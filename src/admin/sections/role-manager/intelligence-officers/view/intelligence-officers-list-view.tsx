'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useContext } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { AuthContext } from 'src/auth/context';
import NotAuthorized from 'src/components/not-authorized/not-authorized';
import { getRoles } from 'src/api/roles';
import { IRoleItem, IRoleTableFilters, IRoleTableFilterValue } from 'src/types/roles';
import AccountsView from 'src/sections/role-manager/role-area-regions/accounts-view';
import IntelligenceOfficersTableRow from '../intelligence-officers-table-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'roleId', label: 'Io Name ' },
  { id: 'role', label: 'Contact Details' },
  { id: 'regOn', label: 'Mail' },
  { id: 'status', label: 'Area' },
  { id: 'action', label: 'Region / State' },
  { id: 'action', label: 'Details' },
  { id: 'action', label: 'Action', align: 'right' },
];


const defaultFilters: IRoleTableFilters = {
  name: '',
  role_status: []
};

// ----------------------------------------------------------------------

export default function IntelligenceOfficersListView() {

  const router = useRouter();

  const table = useTable();

  const settings = useSettingsContext();

  const { user } = useContext(AuthContext);

  const [tableData, setTableData] = useState<any[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [rolesEmpty, setRolesEmpty] = useState(false);

  const [rolesLoading, setRolesLoading] = useState(false);

  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const regionalOfficers = [
      {
        "roName": "Ram Varma",
        "contactDetails": "+91 9908776651",
        "Mail": "Ram@56glc.com",
        "Area": "Tanuku",
        "regionState": "Godavari, AP",
      },
      {
        "roName": "Krishna",
        "contactDetails": "+91 9908776651",
        "Mail": "Krishna43@glc.com",
        "Area": "Tanuku",
        "regionState": "Godavari, AP",
      },
      {
        "roName": "Satish",
        "contactDetails": "+91 9908776651",
        "Mail": "satish56@glc.com",
        "Area": "Tanuku",
        "regionState": "Godavari, AP",
      },
      {
        "roName": "Paramesh",
        "contactDetails": "+91 9908776651",
        "Mail": "Paramesh46@glc.com",
        "Area": "Tanuku",
        "regionState": "Godavari, AP",
      },
      {
        "roName": "Satish",
        "contactDetails": "+91 9908776651",
        "Mail": "satish56@glc.com",
        "Area": "Tanuku",
        "regionState": "Godavari, AP",
      },
      {
        "roName": "Paramesh",
        "contactDetails": "+91 9908776651",
        "Mail": "Paramesh46@glc.com",
        "Area": "Tanuku",
        "regionState": "Godavari, AP",
      },
      {
        "roName": "Satish",
        "contactDetails": "+91 9908776651",
        "Mail": "satish56@glc.com",
        "Area": "Tanuku",
        "regionState": "Godavari, AP",
      }
    ]
    setTableData(regionalOfficers);
  }, []);

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await getRoles();
      const roles: IRoleItem[] = response.data;
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
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || rolesEmpty;

  const handleFilters = useCallback(
    (name: string, value: IRoleTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState: IRoleTableFilters) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id: number) => {
      const deleteRow = tableData.filter((row) => row.roleID !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleEditRow = useCallback(
    (id: number) => {
      router.push(paths.rm.roles_users.role_edit(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);


  const handleFilterSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    handleFilters('searchText', event.target.value);
  };

  const goToRoles = () => {
    router.push(paths.rm.roles.root);
  }

  const handleViewRow = useCallback(
    (id: number) => {
      router.push(paths.rm.roles.intelligence_officer_view(id));
    },
    [router]
  );

  return (
    <>
      {(user?.roleID === 1 || user?.userRoles?.indexOf('ROLEP') !== -1) ?
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <AccountsView />

          <Card sx={{ mt: 2 }}>


            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Stack direction="row" justifyContent="space-between" sx={{ px: 2, py: 2 }}>
                <Stack direction='row' alignItems='center'>
                  <Iconify icon="eva:arrow-ios-back-fill" width={25} height={25} color='#2B303466' onClick={goToRoles} />
                  <Typography variant="h6" sx={{ px: 2, py: 2 }}>
                    Intelligence Officers
                  </Typography>
                </Stack>
                <Stack direction="row">

                  <TextField
                    fullWidth
                    value={searchText}
                    onChange={handleFilterSearch}
                    placeholder="Search..."
                    sx={{
                      width: 300,
                      borderRadius: '8px'
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Stack>
              </Stack>
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
                            <IntelligenceOfficersTableRow
                              key={row.roleID}
                              row={row}
                              onDeleteRow={() => handleDeleteRow(row.roleID)}
                              onEditRow={() => handleEditRow(row.roleID)}
                              onViewRow={() => handleViewRow(1)}
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
        </Container > :
        <NotAuthorized />
      }
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IRoleItem[];
  comparator: (a: any, b: any) => number;
  filters: IRoleTableFilters;
}) {
  const { name, role_status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (role) => role.name.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (role_status.length) {
  //   inputData = inputData.filter((role) => role_status.includes(role.role_status));
  // }

  return inputData;
}
