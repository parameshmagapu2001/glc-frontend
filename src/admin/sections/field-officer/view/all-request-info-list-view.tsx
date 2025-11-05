'use client';

import { Container, Input, InputAdornment, Stack, TextField } from '@mui/material';
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
  TablePaginationCustom,
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
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RequestInfoTableRow from '../request-info-table-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'roleId', label: ' Agent Name' },
  { id: 'role', label: 'Farmland Id' },
  { id: 'regOn', label: 'Time' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Project Status' },
  { id: 'action', label: 'Action' },
];


export default function AllRequestInfoListView() {
  const router = useRouter();

  const settings = useSettingsContext();

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
        pageSize: 10
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
            name: 'Requested More Information',
          }
        ]}
        sx={{ mb: 2 }}
      />
       <Card sx={{ borderRadius: '10px' }}>
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
                    {tableData
                      .map((row) => (
                        <RequestInfoTableRow
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
        <TablePaginationCustom
          count={totalCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}