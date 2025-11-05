'use client';

import { InputAdornment, Stack, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useMemo, useState } from 'react';
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
import {
  IFarmlandItem
} from 'src/types/farmlands';
import { getFarmlands } from 'src/api/region-officer';
import RequestInfoTableRow from '../request-info-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Agent Name' },
  { id: 'id', label: 'Farmland Id' },
  { id: 'time', label: 'Time' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Project Status' },
  { id: 'action', label: 'Action' },
];

const sortFieldMap: Record<string, keyof IFarmlandItem> = {
  name: 'agentName',
  id: 'farmlandId',
  time: 'createdOn',
  amount: 'landCost',
  status: 'farmlandStatus',
}

export default function RequestInfoListView() {

  const router = useRouter();

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query, setQuery] = useState('');

  const confirm = useBoolean();

  useEffect(() => {
    const fetchFarmlands = async () => {
      setFarmlandsLoading(true);
      const farmlandData = {
        searchKey: null,
        status: 'Returned',
        pageNumber: 1,
        pageSize: 0,
      }
      try {
        const response = await getFarmlands(farmlandData);
        const { data, totalRecords } = response.data;
        setTotalCount(totalRecords);
        if (data.length === 0) {
          setFarmlandsEmpty(true);
        } else {
          setFarmlandsEmpty(false);
        }
        setTableData(data);
      } catch (error) {
        console.error(error);
        setFarmlandsEmpty(true);
      } finally {
        setFarmlandsLoading(false);
      }
    };
    fetchFarmlands()
  }, []);

  const fetchPageFarmlands = async (pageNumber: number, pageSize: number) => {
    setFarmlandsLoading(true);
    try {
      const farmlandData = {
        searchKey: query || null,
        status: 'Returned',
        pageNumber: pageNumber + 1,
        pageSize
      }
      const response = await getFarmlands(farmlandData);
      const { data, totalRecords } = response.data;
      setTotalCount(totalRecords);
      if (data.length === 0) {
        setFarmlandsEmpty(true);
      } else {
        setFarmlandsEmpty(false);
      }
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

  // client-side filtering: by search query
  const filteredData = useMemo(() => {
    let arr = tableData;

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
        if (row.landCost.toString().includes(q)) return true;

        return false;
      });
    }

    return arr;
  }, [tableData, query]);

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
    }
  };

  return (
    <Stack>
      <Card sx={{ borderRadius: '10px', minHeight: 470 }}>
        <Stack sx={{ p: 2, borderRadius: '10px' }}>
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
        <TableContainer sx={{ position: 'relative', overflow: 'unset', px: 2 }}>
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
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 600, px: 2 }}>
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
                    {sortedData.slice(0, 4)
                      .map((row) => (
                        <RequestInfoTableRow
                          key={row.farmlandId}
                          row={row}
                          onViewRow={() => router.push(paths.fo.documents(row.farmlandId))}
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

        {!farmlandsEmpty && totalCount > 4 &&
          <Typography
            textAlign="center"
            py="20px"
            color="#3C78B9"
            sx={{ cursor: 'pointer' }}
            onClick={() => router.push(paths.fo.allRequestedInfo)}
          >
            View More
          </Typography>}
      </Card>
    </Stack>
  );
}