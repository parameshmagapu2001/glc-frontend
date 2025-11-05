'use client';

import { Box, InputAdornment, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
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
  useConsumerTable
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import {
  IFarmlandAlert
} from 'src/types/farmlands';
import { getFarmlandAlerts } from 'src/api/region-officer';
import FarmlandAlertsTableRow from '../farmland-alerts-table-row';


// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'Completed', label: 'Completed'},
  { value: 'Pending',   label: 'Pending'  },
  { value: 'Dismissed',   label: 'Dismissed'  },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Agent Name' },
  { id: 'id', label: 'Alert Id' },
  { id: 'time', label: 'Time' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Project Status' },
  { id: 'action', label: 'Action' },
];

const sortFieldMap: Record<string, keyof IFarmlandAlert> = {
  name: 'agentName',
  id: 'alertId',
  time: 'createdOn',
  amount: 'landCost',
  status: 'alertStatus',
}

export default function FarmlandAlertsListView() {

  const router = useRouter();

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandAlert[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query, setQuery] = useState('');

  const [alertsEmpty, setAlertsEmpty] = useState(false);

  const confirm = useBoolean();

  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
    fetchSearchFarmlands(0, table.rowsPerPage, event.target.value);
  };

  useEffect(() => {
    const fetchFarmlands = async () => {
      setFarmlandsLoading(true);
      const farmlandData = {
        searchKey: null,
        status: 'All',
        pageNumber: 1,
        pageSize: 0,
        filterStatus: null
      }
      try {
        const response = await getFarmlandAlerts(farmlandData);
        const { data, totalRecords } = response.data;
        setTotalCount(totalRecords);
        if (data.length === 0) {
          setAlertsEmpty(true);
        } else {
          setAlertsEmpty(false);
        }
        setTableData(data);
      } catch (error) {
        console.error(error);
        setAlertsEmpty(true);
      } finally {
        setFarmlandsLoading(false);
      }
    };
    fetchFarmlands();
  }, []);

  const fetchPageFarmlands = async (pageNumber: number, pageSize: number) => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: query || null,
      status: 'All',
      pageNumber: pageNumber + 1,
      pageSize,
      filterStatus: selectedStatus
    }
    try {
      const response = await getFarmlandAlerts(farmlandData);
      const { data, totalRecords } = response.data;
      setTotalCount(totalRecords);
      if (data.length === 0) {
        setAlertsEmpty(true);
      } else {
        setAlertsEmpty(false);
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
      setAlertsEmpty(true);
    } finally {
      setFarmlandsLoading(false);
    }
  };

  const fetchSearchFarmlands = async (pageNumber: number, pageSize: number, status: string) => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: query || null,
      status: 'All',
      pageNumber: pageNumber + 1,
      pageSize,
      filterStatus: status
    }
    try {
      const response = await getFarmlandAlerts(farmlandData);
      const { data, totalRecords } = response.data;
      setTotalCount(totalRecords);
      if (data.length === 0) {
        setAlertsEmpty(true);
      } else {
        setAlertsEmpty(false);
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
      setAlertsEmpty(true);
    } finally {
      setFarmlandsLoading(false);
    }
  };

  const table = useConsumerTable({ fetchData: fetchPageFarmlands });
  const denseHeight = table.dense ? 60 : 80;
  const notFound = alertsEmpty;

  // client-side filtering: first by status, then by search query
  const filteredData = useMemo(() => {
    let arr = tableData;

    // 1) status filter
    if (selectedStatus) {
      arr = arr.filter((r) => r.alertStatus === selectedStatus);
    }

    // 2) search query filter
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      arr = arr.filter((row) => {
        // agent name, code, id, status
        if (row.agentName.toLowerCase().includes(q)) return true;
        if (row.alertCode.toLowerCase().includes(q)) return true;
        if (row.alertId.toString().includes(q)) return true;
        if (row.alertStatus.toLowerCase().includes(q)) return true;

        // formatted time
        const displayTime = format(new Date(row.createdOn), 'do MMM - hh.mm aa')
          .toLowerCase();
        if (displayTime.includes(q)) return true;

        // amount label & raw
        if (row.landCostLabel.toLowerCase().includes(q)) return true;
        if (row.landCost.toString().includes(q)) return true;

        return false;
      });
    }

    return arr;
  }, [tableData, selectedStatus, query]);

  const sortedData = useMemo(() => {
    if (!table.orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const key = sortFieldMap[table.orderBy!] || (table.orderBy as keyof IFarmlandAlert);
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      // number
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return table.order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      // date
      const dateKeys = ['createdOn','farmlandCreatedOn','publishedTime','dob'] as const;
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
      <Card sx={{
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: 'none',
        minHeight: 470
      }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Stack sx={{ p: 2 }}>
            <TextField
              placeholder="Search"
              value={query}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              sx={{
                width: 300,
                height: 30,
                borderRadius: 20,
                '& .MuiOutlinedInput-root': {
                  paddingLeft: '14px'
                }
              }}
              InputProps={{
                sx: {
                  height: 30,
                  borderRadius: 20,
                  backgroundColor: '#F5F6FA',
                  paddingLeft: '8px'
                },
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
              sx={{ width:105, height:35, fontSize:12, fontWeight: 500, fontFamily: 'Circular Std', color: "#000000", backgroundColor: '#F5F6FA' }}
            >
              <MenuItem value="">Status</MenuItem>
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Box>

        <TableContainer sx={{
          position: 'relative',
          overflow: 'unset',
          px: 2
        }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.alertId)
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
                    {sortedData.slice(0,4)
                      .sort((a, b) => {
                        const aValue = a[table.orderBy as keyof IFarmlandAlert];
                        const bValue = b[table.orderBy as keyof IFarmlandAlert];

                        if (aValue == null) return 1;
                        if (bValue == null) return -1;

                        if (typeof aValue === 'number' && typeof bValue === 'number') {
                          return table.order === 'asc' ? aValue - bValue : bValue - aValue;
                        }

                        return table.order === 'asc'
                          ? String(aValue).localeCompare(String(bValue))
                          : String(bValue).localeCompare(String(aValue));
                      })
                      .map((row) => (
                        <FarmlandAlertsTableRow
                          key={row.alertId}
                          row={row}
                          rowSx={{
                            "&:first-of-type td": {
                              paddingTop: '16px'
                            },
                            "&:last-child td": {
                              paddingBottom: '16px'
                            },
                            "& td:first-of-type": {
                              paddingLeft: '24px'
                            },
                            "& td:last-child": {
                              paddingRight: '24px'
                            }
                          }}
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

        {!alertsEmpty && totalCount > 4 &&
          <Typography
            textAlign="center"
            py="20px"
            color="#3C78B9"
            sx={{ cursor: 'pointer' }}
            onClick={() => router.push(paths.fo.allFarmlandAlerts)}
          >
            View More
          </Typography>}
      </Card>
    </Stack>
  );
}