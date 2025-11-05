'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  useConsumerTable,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { IRoleUserItem, IRoleUserTableFilters } from 'src/types/role-users';
import { deleteUser, getRoleUsers, searchUsers } from 'src/api/roles';
import RoleUserTableRow from '../role-user-table-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'first_name', label: 'Name' },
  { id: 'user_code', label: 'Role ID' },
  { id: 'mobile_number', label: 'Contact Details' },
  { id: 'user_email', label: 'Mail' },
  { id: 'role_name', label: 'Role' },
  { id: 'action', label: 'Action' },
];

const defaultFilters: IRoleUserTableFilters = {
  mobile_number: '',
  role_status: []
};

// ----------------------------------------------------------------------

export default function RoleUserListView() {

  const router = useRouter();

  const [query, setQuery] = useState("");

  const [tableData, setTableData] = useState<IRoleUserItem[]>([]);

  const [filters] = useState(defaultFilters);

  const [usersEmpty, setUsersEmpty] = useState(false);

  const [usersLoading, setUsersLoading] = useState(false);

  const [active, setActive] = useState<string>('roles');

  const confirm = useBoolean();

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchRoleUsers(0, 10)
  }, []);

  const fetchRoleUsers = async (pageNumber: number, pageSize: number) => {
    setUsersLoading(true);
    try {
      const response = await getRoleUsers(pageNumber + 1, pageSize);
      const { users, total_records } = response.data;
      setTotalCount(total_records);
      const consumers_list: IRoleUserItem[] = users;
      if (consumers_list.length === 0) {
        setUsersEmpty(true);
      } else {
        setUsersEmpty(false);
      }
      setTableData(consumers_list);
    } catch (error) {
      console.error(error);
      setUsersEmpty(true);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchUsers = useCallback(async (pageNumber: number, pageSize: number) => {
    setUsersLoading(true);
    try {
      const response = await getRoleUsers(pageNumber + 1, pageSize);
      const { users, total_records } = response.data;
      setTotalCount(total_records);
      const consumers_list: IRoleUserItem[] = users;
      setUsersEmpty(consumers_list.length === 0);
      setTableData(consumers_list);
    } catch (error) {
      console.error(error);
      setUsersEmpty(true);
    } finally {
      setUsersLoading(false);
    }
  }, []); // Add dependencies if needed


  const filterUsersCall = useCallback(
    async (pageNumber: number, pageSize: number) => {
      setUsersLoading(true);
      try {
        const response = await searchUsers(query, pageNumber + 1, pageSize);
        console.log('API response:', response);
        const { users, total_records } = response;
        setTotalCount(total_records);
        const users_list: IRoleUserItem[] = users;
        if (users_list.length === 0) {
          setUsersEmpty(true);
        } else {
          setUsersEmpty(false);
        }
        setTableData(users_list);
      } catch (error) {
        console.error(error);
        setUsersEmpty(true);
      } finally {
        setUsersLoading(false);
      }
    },
    [query] // Add query as a dependency
  );

  const fetchPageUsers = async (pageNumber: number, pageSize: number) => {
    setUsersLoading(true);
    table.onResetPage();
    try {
      if (query === '' || query === null || query === undefined) {
        fetchRoleUsers(pageNumber, pageSize)
      } else {
        filterUsersCall(pageNumber, pageSize)
      }
    } catch (error) {
      console.error(error);
      setUsersEmpty(true);
    } finally {
      setUsersLoading(false);
    }
  };

  const table = useConsumerTable({ fetchData: fetchRoleUsers });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || usersEmpty;

  const handleButtonClick = (button: string): void => {
    setActive(button);
    if (button === 'roles') {
      router.push(paths.rm.roles.root);
    } else {
      router.push(paths.rm.area_regions.root);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const onEditRow = (role_id: number, user_id: number) => {
    router.push(`${paths.rm.roles.edit(role_id, user_id)}`);
  }

  const handleDeleteRow = useCallback(
    async (id: number) => {
      const response = await deleteUser(id);
      if (response) {
        if (response.data === true) {
          enqueueSnackbar('User deleted successfully', { variant: 'success' });
        } else {
          enqueueSnackbar('User deletion failed', { variant: 'error' });
        }
        fetchUsers(table.page, table.rowsPerPage);
      }
    },
    [fetchUsers,table]
  );

  return (
    <Stack >

      <Card>
        <Stack direction="row" sx={{ p: 1, pl: 2, px: 3 }} spacing={4} alignItems="center" justifyContent="space-between">
          <Card sx={{
            p: 1,
            px: 2,
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: 1,
            my: 1,
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
          <Stack direction="row" justifyContent="flex-end">
            <TextField
              placeholder="Search...."
              value={query}
              onChange={handleSearchChange}
              onKeyDown={(event) => {
                if (query === '') {
                  fetchPageUsers(0, 5);
                }
                if (event.key === 'Enter') {
                  event.preventDefault();
                  fetchPageUsers(0, 5);
                }
              }}
              sx={{ width: 300, height: 30, borderRadius: 20 }} // Adjust height here
              InputProps={{
                sx: { height: 30, borderRadius: 20, backgroundColor: '#F5F6FA' }, // Ensures input field matches height
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

          </Stack>
        </Stack>

        <Divider sx={{ borderBottomWidth: 2, mx: 2 }} />

        <Stack sx={{ mt: 2 }}>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.user_id)
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
                  {usersLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered.map((row) => (
                        <RoleUserTableRow
                          key={row.user_id}
                          row={row}
                          onEditRow={() => onEditRow(row.role_id, row.user_id)}
                          onDeleteRow={() => handleDeleteRow(row.user_id)}
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

          {!usersEmpty &&
            <TablePaginationCustom
              count={totalCount}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />}
        </Stack>
      </Card>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IRoleUserItem[];
  comparator: (a: any, b: any) => number;
  filters: IRoleUserTableFilters;
}) {
  const { mobile_number } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (mobile_number) {
    inputData = inputData.filter(
      (role) => role.mobile_number.toLowerCase()?.indexOf(mobile_number.toLowerCase()) !== -1
    );
  }

  // if (role_status.length) {
  //   inputData = inputData.filter((role) => role_status.includes(role.role_status));
  // }

  return inputData;
}
