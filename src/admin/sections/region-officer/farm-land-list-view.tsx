'use client';

import { InputAdornment, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  TableSkeleton,
  useConsumerTable,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { IFarmlandItem } from 'src/types/farmlands';
import { getFarmlands } from 'src/api/region-officer';
import FarmlandTableRow from './farm-land-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Agent Name' },
  { id: 'id', label: 'Farmland Id' },
  { id: 'location', label: 'Location' },
  { id: 'time', label: 'Time' },
  { id: 'area', label: 'Area' },
  { id: 'amount', label: 'Amount' },
  { id: 'acreAmount', label: 'Cost Per Acre' },
  { id: 'status', label: 'Status' },
];

const STATUS_OPTIONS = [
  { value: 'Completed', label: 'Completed' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'Returned', label: 'Returned' },
];

const sortFieldMap: Record<string, keyof IFarmlandItem> = {
  name: 'agentName',
  id: 'farmlandId',
  time: 'createdOn',
  amount: 'landCost',
  status: 'farmlandStatus',
}
export default function FarmLandListView() {
  const router = useRouter();

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query, setQuery] = useState('');

  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const confirm = useBoolean();

  useEffect(() => {
    const fetchFarmlands = async () => {
      setFarmlandsLoading(true);
      const farmlandData = {
        searchKey: null,
        status: 'All',
        pageNumber: 1,
        pageSize: 0,
      };
      try {
        const response = await getFarmlands(farmlandData);
        const { data, totalRecords } = response.data;
        setTotalCount(totalRecords);
        setFarmlandsEmpty(data.length === 0);
        setTableData(data);
      } catch (error) {
        console.error(error);
        setFarmlandsEmpty(true);
      } finally {
        setFarmlandsLoading(false);
      }
    };
    fetchFarmlands();
  }, []);

  const fetchPageFarmlands = async () => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: query || null,
      status: 'All',
      pageNumber: 1,
      pageSize: 5,
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { data, totalRecords } = response.data;
      setTotalCount(totalRecords);
      setFarmlandsEmpty(data.length === 0);
      setTableData(data);
    } catch (error) {
      console.error(error);
      setFarmlandsEmpty(true);
    } finally {
      setFarmlandsLoading(false);
    }
  };

  const fetchSearchFarmlands = async (status: string) => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: query || null,
      status: 'All',
      pageNumber: 1,
      pageSize: 0,
      c: status
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { data, totalRecords } = response.data;
      setTotalCount(totalRecords);
      setFarmlandsEmpty(data.length === 0);
      setTableData(data);
    } catch (error) {
      console.error(error);
      setFarmlandsEmpty(true);
    } finally {
      setFarmlandsLoading(false);
    }
  };

  const table = useConsumerTable({ fetchData: fetchPageFarmlands });

  const denseHeight = table.dense ? 60 : 80;

  const notFound = farmlandsEmpty;

  // client-side filtering: first by status, then by search query
  const filteredData = useMemo(() => {
    let arr = tableData;

    // 1) status filter
    if (selectedStatus) {
      arr = arr.filter((r) => r.farmlandStatus === selectedStatus);
    }
    // 2) search query filter
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      arr = arr.filter((row) => {
        // agent name, code, id, status
        if (row.agentName.toLowerCase().includes(q)) return true;
        if (row.farmlandCode.toLowerCase().includes(q)) return true;
        if (row.farmlandId.toString().includes(q)) return true;
        if (row.farmlandStatus.toLowerCase().includes(q)) return true;

        // formatted time
        const displayTime = format(new Date(row.createdOn), 'do MMM - hh.mm aa')
          .toLowerCase();
        if (displayTime.includes(q)) return true;

        // amount label & raw
        if (row.landCostLabel && row.landCostLabel.toLowerCase().includes(q)) return true;
        if (row.landCost && row.landCost.toString().includes(q)) return true;

        return false;
      });
    }

    return arr;
  }, [tableData, query, selectedStatus]);

  const sortedData = useMemo(() => {
    if (!table.orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const key = sortFieldMap[table.orderBy!] || (table.orderBy as keyof IFarmlandItem);
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      // number
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return table.order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      // date
      const dateKeys = ['createdOn', 'farmlandCreatedOn', 'publishedTime', 'dob'] as const;
      if (dateKeys.includes(key as any)) {
        const diff = new Date(aVal as string).getTime() - new Date(bVal as string).getTime();
        return table.order === 'asc' ? diff : -diff;
      }
      // string fallback
      const sa = String(aVal).toLowerCase();
      const sb = String(bVal).toLowerCase();
      return table.order === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [filteredData, table.order, table.orderBy]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      table.setPage(0);
      fetchPageFarmlands();
    }
  };
  const handleViewRow = useCallback(
    (id: number) => {
      router.push(paths.ro.documents(id));
    },
    [router]
  );

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
    fetchSearchFarmlands(event.target.value);
  };

  return (
    <Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Stack sx={{ py: 2 }}>
          <TextField
            placeholder="Search...."
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            sx={{ width: 300, height: 30, borderRadius: 20 }}
            InputProps={{
              sx: { height: 30, borderRadius: 20, backgroundColor: '#F5F6FA' },
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack sx={{ p: 2 }}>
          {/* Status */}
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            displayEmpty
            size="small"
            sx={{ width: 105, height: 35, fontSize: 12, fontWeight: 500, fontFamily: 'Circular Std', color: "#000000", backgroundColor: '#F5F6FA' }}
          >
            <MenuItem value="">Status</MenuItem>
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.farmlandId)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={confirm.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 600 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD.map((head) => ({
                ...head,
                label: (
                  <Typography color="#000000" fontWeight="bold" sx={{ fontSize: "14px" }}>
                    {head.label}
                  </Typography>
                ),
              }))}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {farmlandsLoading ? (
                [...Array(table.rowsPerPage)].map((i, index) => (
                  <TableSkeleton key={index} sx={{ height: denseHeight }} />
                ))
              ) : (
                <>
                  {sortedData.slice(0,5).map((row) => (
                    <FarmlandTableRow
                      key={row.farmlandId}
                      row={row}
                      onViewRow={() => handleViewRow(row.farmlandId)}
                    />
                  ))}
                </>
              )}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {!farmlandsEmpty && totalCount > 5 && (
        <Typography
          textAlign="center"
          py="20px"
          color="#3C78B9"
          sx={{ cursor: 'pointer' }}
          onClick={() => router.push(paths.ro.allFarmlands)}
        >
          View More
        </Typography>
      )}
    </Stack>
  );
}
