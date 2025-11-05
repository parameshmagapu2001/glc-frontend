'use client';

import { Box, Container, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
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
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { getFarmlands } from 'src/api/region-officer';
import DraftsTableRow from './drafts-table-row';
import CustomPagination from '../field-officer/common-layout/pagination';

const TABLE_HEAD = [
  { id: 'name', label: 'Agent Name' },
  { id: 'id', label: 'Farmland Id' },
  { id: 'location', label: 'Location' },
  { id: 'time', label: 'Time' },
  { id: 'area', label: 'Land Extend' },
  { id: 'amount', label: 'Amount' },
  { id: 'acreAmount', label: 'Cost Per Acre' },
  { id: 'action', label: 'Action' },
];


const sortFieldMap: Record<string, keyof IFarmlandItem> = {
  name: 'agentName',
  id: 'farmlandId',
  time: 'createdOn',
  amount: 'landCost',
  status: 'farmlandStatus',
}

export default function TotalDraftsListView() {
  const router = useRouter();

  const settings = useSettingsContext();

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query, setQuery] = useState('');

  const confirm = useBoolean();

  const [page, setPage] = useState(1);

  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const fetchFarmlands = async () => {
      setFarmlandsLoading(true);
      const farmlandData = {
        searchKey: null,
        status: 'Draft',
        pageNumber: page,
        pageSize: rowsPerPage,
      };
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
    fetchFarmlands();
  }, [page, query, rowsPerPage]);

  const fetchPageFarmlands = async (pageNumber: number, pageSize: number) => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: query || null,
      status: 'Draft',
      pageNumber: pageNumber + 1,
      pageSize,
    };
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

  const table = useConsumerTable({ fetchData: fetchPageFarmlands });

  const denseHeight = table.dense ? 60 : 80;

  const notFound = farmlandsEmpty;

  // client-side filtering: first by status, then by search query
  const filteredData = useMemo(() => {
    let arr = tableData;

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


  const handleViewRow = useCallback(
    (id: number) => {
      router.push(paths.ro.documents(id));
    },
    [router]
  );

  const handleEditRow = useCallback((id: number) => {
    // router.push(paths.rm.roles_users.role_edit(id));
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      table.setPage(0);
      fetchPageFarmlands(0, table.rowsPerPage);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        links={[
          {
            name: 'Dashboard',
            href: paths.ro.root,
          },
          {
            name: 'Drafts',
          },
        ]}
      />
      <Card sx={{ borderRadius: '10px' }}>
        <Stack sx={{ p: 2 }}>
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
        <TableContainer sx={{ position: 'relative', overflow: 'unset' ,px:2}}>
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
                    {sortedData.map((row) => (
                      <DraftsTableRow
                        key={row.farmlandId}
                        row={row}
                        onViewRow={() => handleViewRow(row.farmlandId)}
                        onEditRow={() => handleEditRow(row.farmlandId)}
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

        <Box p={2}>
          <CustomPagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRecords={totalCount}
            onChange={handleChangePage}
          />
        </Box>
      </Card>
    </Container>
  );
}
