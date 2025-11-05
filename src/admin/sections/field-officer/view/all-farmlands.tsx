'use client';

import {
  Box,
  Container,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useEffect, useState } from 'react';
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
import { getFarmlands } from 'src/api/region-officer';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FarmlandTableRow from '../farmland-table-row';
import CustomPagination from '../common-layout/pagination';

// ----------------------------------------------------------------------

const STATUS = ['In Live', 'Rejected'];

const TABLE_HEAD = [
  { id: 'name', label: 'Agent Name' },
  { id: 'id', label: 'Farmland Id' },
  { id: 'time', label: 'Time' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Project Status' },
  { id: 'publishedOn', label: 'Published Time' },
  { id: 'action', label: 'Action' },
];

export default function AllFarmlands() {

  const router = useRouter();

  const settings = useSettingsContext();

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query, setQuery] = useState('');

  const confirm = useBoolean();

  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
    fetchSearchFarmlands(0, table.rowsPerPage, event.target.value);
  };

  const [page, setPage] = useState(1);

  const [rowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    fetchPageFarmlands(newPage, rowsPerPage);
  };

  const fetchPageFarmlands = async (pageNumber: number, pageSize: number) => {
    setFarmlandsLoading(true);
    try {
      const farmlandData = {
        searchKey: query || null,
        status: 'All',
        pageNumber: pageNumber + 1,
        pageSize,
        filterStatus: null
      };
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

  useEffect(() => {
    const fetchFarmlands = async () => {
      setFarmlandsLoading(true);
      try {
        const farmlandData = {
          searchKey: query || null,
          status: selectedStatus || 'All',
          pageNumber: page, // Already 1-based
          pageSize: rowsPerPage,
          filterStatus: selectedStatus
        };
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
  }, [page, query, selectedStatus, rowsPerPage]);

  const fetchSearchFarmlands = async (pageNumber: number, pageSize: number, status: string) => {
    setFarmlandsLoading(true);
    try {
      const farmlandData = {
        searchKey: query || null,
        status: 'All',
        pageNumber: pageNumber + 1,
        pageSize,
        filterStatus: status
      };
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

  const handleViewRow = useCallback(
    (id: number) => {
      router.push(paths.fo.documents(id));
    },
    [router]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      table.setPage(0);
      fetchPageFarmlands(0, table.rowsPerPage);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        links={[
          {
            name: 'Dashboard',
            href: paths.fo.root,
          },
          {
            name: 'Farmlands List',
          },
        ]}
        sx={{ mb: 2 }}
      />
      <Card sx={{ borderRadius: '10px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Stack direction="row" p="20px">
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
              sx={{
                width: 84,
                height: 35,
                fontWeight: 500,
                fontFamily: 'Circular Std',
                fontSize: '12px',
                backgroundColor: '#FCFDFD',
              }}
            >
              <MenuItem value="">Status</MenuItem>
              {STATUS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Box>
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
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 600 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
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
                    {tableData.map((row) => (
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
                  emptyRows={emptyRows(0, table.rowsPerPage, tableData.length)}
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
