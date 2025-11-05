// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useContext } from 'react';
import { Avatar, Button, Stack } from '@mui/material';
import { usePopover } from 'src/components/custom-popover';
// types
import { AuthContext } from 'src/auth/context';
import { IRoleUserItem } from 'src/types/role-users';
import Image from 'src/components/image';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

type Props = {
  row: IRoleUserItem;
  onDeleteRow: VoidFunction,
  onEditRow: VoidFunction
};

export default function RoleUserTableRow({
  row,
  onDeleteRow,
  onEditRow,
}: Props) {
  const {
    user_code,
    first_name,
    last_name,
    mobile_number,
    user_email,
    role_id,
    role_name,
    profile_image
  } = row;

  const popover = usePopover();

  const confirm = useBoolean();

  const { user } = useContext(AuthContext);

  return (
    <>
      <TableRow>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={first_name}
            src={profile_image}
            variant="rounded"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          {first_name} {last_name}
        </TableCell>

        <TableCell>{user_code} </TableCell>

        <TableCell>+91 {mobile_number} </TableCell>

        <TableCell>{user_email} </TableCell>

        <TableCell>{role_name} </TableCell>

        <TableCell>
          <Stack direction="row" spacing={2}>
            <Image
              src="/assets/images/edit.png"
              height={20}
              width={20}
              onClick={([7, 8, 9, 10].includes(role_id) ? onEditRow : undefined)}
              style={{ opacity: [7, 8, 9, 10].includes(role_id) ? 1 : 0.5, cursor: [7, 8, 9, 10].includes(role_id) ? 'pointer' : 'not-allowed' }}
            />

            <Iconify
              icon="solar:trash-bin-trash-outline" width={22}
              onClick={([7, 8, 9, 10].includes(role_id) ? () => {
                confirm.onTrue();
                popover.onClose();
              } : undefined)}
              sx={{
                opacity: [7, 8, 9, 10].includes(role_id) ? 1 : 0.5,
                cursor: [7, 8, 9, 10].includes(role_id) ? 'pointer' : 'not-allowed',
                color: 'error.main'
              }} />

          </Stack>
        </TableCell>

      </TableRow>

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
