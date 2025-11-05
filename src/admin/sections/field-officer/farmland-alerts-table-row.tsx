import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Avatar, Box, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useBoolean } from 'src/hooks/use-boolean';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { dismissFarmland } from 'src/api/farmlands';
import { AuthContext } from 'src/auth/context';
import CommentDialog from 'src/components/custom-dialog/comment-dialog';
import { IFarmlandAlert } from 'src/types/farmlands';
import { paths } from 'src/routes/paths';
import ProjectStatus from './project-status';

// ----------------------------------------------------------------------

type Props = {
  row: IFarmlandAlert
};

export default function FarmlandAlertsTableRow({ row, rowSx }: { row: IFarmlandAlert; rowSx?: any }) {
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

  const onDismiss = async (val: string) => {
    if (!val) {
      enqueueSnackbar('Please provide the reason to dismiss', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      return;
    }
    if (val.length < 10) {
      enqueueSnackbar('Please provide a valid reason to dismiss', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      return;
    }
    popover.onClose();
    confirm.onFalse();
    const response = await dismissFarmland(row?.alertId || 0, val);
    if (response.data) {
      enqueueSnackbar('Farmland Alert Dismissed', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      router.push(paths.fo.root);
    }
  };


  return (
    <>
      <TableRow sx={rowSx}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={row.agentName}
            src={row.profileImage}
            variant="rounded"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          {row.agentName}
        </TableCell>

        <TableCell>{row.alertCode}</TableCell>

        <TableCell>{formatDate(row.createdOn)}</TableCell>

        <TableCell>{row.landCostLabel}</TableCell>

        <TableCell>
          <ProjectStatus status={row.alertStatus} />
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
        {row?.alertStatus?.toLowerCase() === 'pending' ? (
          <Box>
            <MenuItem
              onClick={() => {
                // confirm.onTrue();
                popover.onClose();
                router.push(paths.fo.newFarmLand(row.alertId));
              }}
            >
              Create
            </MenuItem>

            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              Dismiss
            </MenuItem>
          </Box>
        ) : (
          <>
            {row.alertStatus === 'Dismissed' && (
              <MenuItem
                onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                }}
              >
                View Reason
              </MenuItem>
            )}
            {row.alertStatus !== 'Dismissed' && (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  router.push(paths.fo.documents(row.farmlandId));
                }}
              >
                View
              </MenuItem>
            )}
          </>
        )}
      </CustomPopover>
      <CommentDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Dismiss Reason"
        content={row.alertStatus==='Dismissed' ? 'Reason for dismissal' : 'Please provide the reason to dismiss'}
        btnTitle="Submit"
        onSubmit={(val) => {
          onDismiss(val);
        }}
        submitButtonStatus={row.alertStatus!=='Dismissed'}
        readonlyStatus={row.alertStatus==='Dismissed'}
        comment={row.dismissReason || ''}
      />
    </>
  );
}
