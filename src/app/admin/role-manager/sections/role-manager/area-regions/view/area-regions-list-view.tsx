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
import { useForm } from 'react-hook-form';
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
import AccountsView from 'src/sections/role-manager/role-area-regions/accounts-view';
import { IAreaRegionItem, IAreaRegionTableFilters, IAreaRegionTableFilterValue } from 'src/types/area-regions';
import { getStateAreaRegions } from 'src/api/regions';
import AreaRegionsTableRow from '../area-regions-table-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'roleId', label: 'State', width: 150 },
  { id: 'role', label: 'No of Regions', width: 100 },
  { id: 'email', label: 'No of Areas', width: 100 },
];

const defaultFilters: IAreaRegionTableFilters = {
  state_name: '',
  region_status: []
};

export default function AreaRegionsListView() {

  const router = useRouter();

  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState<any[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [rolesEmpty, setRolesEmpty] = useState(false);

  const [rolesLoading, setRolesLoading] = useState(false);

  const [active, setActive] = useState<string>('area');

  const [searchText, setSearchText] = useState<string>('');

  const [query, setQuery] = useState('');

  const confirm = useBoolean();

  const methods = useForm({
  });

  useEffect(() => {
    fetchStateAreaRegions();
  }, []);

  const fetchStateAreaRegions = async () => {
    setRolesLoading(true);
    try {
      const response = await getStateAreaRegions();
      const roles: IAreaRegionItem[] = response.data;
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

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || rolesEmpty;

  const handleButtonClick = (button: string): void => {
    setActive(button);
    if (button === 'area') {
      router.push(paths.rm.area_regions.root);
    } else {
      router.push(paths.rm.roles.root);
    }
  };

  const onViewRegion = (stateId: number, stateName: string) => {
    localStorage.setItem('stateName', stateName);
    router.push(paths.rm.area_regions.region_view(stateId));
  }

  const onViewArea = (stateId: number, stateName: string) => {
    localStorage.setItem('stateName', stateName);
    router.push(paths.rm.area_regions.area_view(stateId));
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack sx={{ mb: 2 }}>
          <AccountsView />
        </Stack>
        <Card sx={{ mt: 2, my: 1 }}>
          <Stack direction="row" justifyContent='space-between' pt={2} pb={2} px={2}>
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
                  tableData.map((row) => row.role_id)
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
                          <AreaRegionsTableRow
                            key={row.state_id}
                            row={row}
                            onViewRegionRow={() => onViewRegion(row.state_id, row.state_name)}
                            onViewAreaRow={() => onViewArea(row.state_id, row.state_name)}
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
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />}
        </Card>
      </Container >
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  query
}: {
  inputData: IAreaRegionItem[];
  comparator: (a: any, b: any) => number;
  filters: IAreaRegionTableFilters;
  query: string;
}) {
  const { state_name, region_status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);


  if (query) {
    inputData = inputData.filter(
      (area) => area.state_name.toLowerCase().includes(query.toLowerCase())
    );
  }

  return inputData;
}
