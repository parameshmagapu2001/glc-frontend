// @mui
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Avatar, Box, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useBoolean } from 'src/hooks/use-boolean';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { AuthContext } from 'src/auth/context';
import { IFarmlandItem } from 'src/types/farmlands';
import { paths } from 'src/routes/paths';
import ProjectStatus from './project-status';

// ----------------------------------------------------------------------

type Props = {
  row: IFarmlandItem;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function DraftTableRow({ row, onDeleteRow, onEditRow}: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  const { user } = useContext(AuthContext);

  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10) < 4 && (day % 100 - day % 10 !== 10) ? day % 10 : 0];
    return `${day}${suffix} ${format(date, "MMM - hh.mm a")}`;
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={row.agentName}
            src={row.thumbnailImage}
            variant="rounded"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          {row.agentName}
        </TableCell>

        <TableCell><Stack onClick={onEditRow}
          sx={{
            cursor: 'pointer',
            color: '#1D7ABE',
            fontWeight: 'bold',
            textDecoration: 'underline'
          }}>
          {row.farmlandCode}
        </Stack>
        </TableCell>

        <TableCell>{formatDate(row.createdOn)}</TableCell>

        <TableCell>{row.landCostLabel}</TableCell>

        <TableCell>
          <ProjectStatus status='In Drafts'/>
        </TableCell>

        <TableCell>
          {(user?.role_id === 1 || user?.userRoles?.indexOf('ROLCEP') !== -1) && (
            <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <Box>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.fo.documents(row.farmlandId));
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            Delete
          </MenuItem>
        </Box>
      </CustomPopover>
    </>
  );
}
