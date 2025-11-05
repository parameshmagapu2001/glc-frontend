// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useContext } from 'react';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// types
import { AuthContext } from 'src/auth/context';
// ----------------------------------------------------------------------

type Props = {
  row: any;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function AgentsTableRow({
  row,
  onDeleteRow,
  onEditRow,
  onViewRow
}: Props) {
  const {
    regionState,
    Area,
    Mail,
    contactDetails,
    roName,

  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const { user } = useContext(AuthContext);

  return (
    <>
      <TableRow>

        <TableCell>{roName} </TableCell>

        <TableCell>{contactDetails} </TableCell>

        <TableCell> {Mail} </TableCell>

        <TableCell> {Area} </TableCell>

        <TableCell> {regionState} </TableCell>

        <TableCell>
          <Button variant="contained" color='info' onClick={onViewRow}>
            View
          </Button>
        </TableCell>

        <TableCell align="right">
          {(user?.role_id === 1 || user?.userRoles?.indexOf('ROLCEP') !== -1) &&
            <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>}
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {(user?.role_id === 1 || user?.userRoles?.indexOf('ROLCEP') !== -1) &&
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>}

        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
