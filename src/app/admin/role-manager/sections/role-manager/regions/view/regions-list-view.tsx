'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useContext } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSettingsContext } from 'src/app/admin/role-manager/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { AuthContext } from 'src/auth/context';
import NotAuthorized from 'src/components/not-authorized/not-authorized';
import AccountsView from 'src/sections/role-manager/role-area-regions/accounts-view';
import { IRegionItem, IRegionTableFilters } from 'src/types/regions';
import { getStateRegions } from 'src/api/regions';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RegionsTableRow from '../regions-table-row';

const TABLE_HEAD = [
  { id: 'region_name', label: 'Region Name', width: 150 },
  { id: 'sub_region_tags', label: 'Sub Regions Name', width: 200 },
  { id: 'created_on', label: 'Created On', width: 100 },
  { id: 'action', label: 'Action', width: 100, align: 'right' },
];

const defaultFilters: IRegionTableFilters = {
  region_name: '',
  region_status: []
};

type Props = {
  id: number;
};

export default function RegionsListView({ id }: Props) {
  const router = useRouter();
  const table = useTable();
  const settings = useSettingsContext();
  const { user } = useContext(AuthContext);
  const [tableData, setTableData] = useState<IRegionItem[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [rolesEmpty, setRolesEmpty] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [active, setActive] = useState<string>('area');
  const [query, setQuery] = useState('');
  const confirm = useBoolean();
  const stateName = localStorage.getItem('stateName');

  useEffect(() => {
    fetchRegions(id);
  }, [id]);

  const fetchRegions = async (stateId: number) => {
    setRolesLoading(true);
    try {
      const response = await getStateRegions(stateId);
      const roles: IRegionItem[] = response.data;
      if (roles.length === 0) {
        setRolesEmpty(true);
      }
      setTableData(roles);
    } catch (error) {
      console.error(error);
      setRolesEmpty(true);
    } finally {
      setRolesLoading(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    query,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || rolesEmpty;

  const handleDeleteRow = useCallback(
    (role_id: number) => {
      const deleteRow = tableData.filter((row) => row.region_id !== role_id);
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleEditRow = useCallback(
    (role_id: number) => {
      router.push(paths.rm.roles_users.role_edit(role_id));
    },
    [router]
  );

  const handleButtonClick = (button: string): void => {
    setActive(button);
    if (button === 'area') {
      router.push(paths.rm.area_regions.root);
    } else {
      router.push(paths.rm.roles.root);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <>
      {(user?.region_id === 1 || user?.userRoles?.indexOf('ROLEP') !== -1) ?
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <AccountsView />
          <Card sx={{ mt: 2 }}>
            <Stack direction="row" pt={2} pb={3} px={2}>
              <Card sx={{
                p: 1, px: 2, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: 1
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Button
                    variant={active === 'roles' ? 'contained' : 'text'}
                    onClick={() => handleButtonClick('roles')}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 20,
                      bgcolor: active === 'roles' ? 'primary.main' : 'transparent',
                      color: active === 'roles' ? 'white' : '#9B9B9B'
                    }}
                  >
                    <Typography variant="body2">Roles List</Typography>
                  </Button>
                  <Button
                    variant={active === 'area' ? 'contained' : 'text'}
                    onClick={() => handleButtonClick('area')}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 20,
                      bgcolor: active === 'area' ? 'primary.main' : 'transparent',
                      color: active === 'area' ? 'white' : '#9B9B9B'
                    }}
                  >
                    <Typography variant="body2">Area / Region List</Typography>
                  </Button>
                </Stack>
              </Card>
            </Stack>

            <Stack sx={{ px: 3, pb: 0 }} direction="row" justifyContent="space-between">
              <CustomBreadcrumbs
                links={[
                  {
                    name: 'Regions List',
                    href: ''
                  },
                  {
                    name: stateName || 'State',
                    href: paths.rm.area_regions.root,
                  },
                  {
                    name: 'Regions',
                  }
                ]}
                sx={{ mb: { xs: 3 } }}
              />

              <TextField
                placeholder="Search...."
                value={query}
                onChange={handleSearchChange}
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
                    tableData.map((row) => row.region_id)
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
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {rolesLoading ? (
                      [...Array(table.rowsPerPage)].map((i, index) => (
                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      ))
                    ) : (
                      <>
                        {dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage
                          )
                          .map((row) => (
                            <RegionsTableRow
                              key={row.region_id}
                              row={row}
                              onDeleteRow={() => handleDeleteRow(row.region_id)}
                              onEditRow={() => handleEditRow(row.region_id)}
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

            {!rolesEmpty &&
              <TablePaginationCustom
                count={dataFiltered.length}
                page={table.page}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                dense={table.dense}
                onChangeDense={table.onChangeDense}
              />}
          </Card>
        </Container> :
        <NotAuthorized />}
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
  query,
}: {
  inputData: IRegionItem[];
  comparator: (a: any, b: any) => number;
  filters: IRegionTableFilters;
  query: string;
}) {
  const { region_name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (query) {
    inputData = inputData.filter(
      (region) => region.region_name.toLowerCase().includes(query.toLowerCase()) ||
        region.sub_region_tags.toLowerCase().includes(query.toLowerCase())
    );
  }

  return inputData;
}