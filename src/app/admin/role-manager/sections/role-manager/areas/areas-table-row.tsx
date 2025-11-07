
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useContext } from 'react';
import { format } from 'date-fns';
import { useBoolean } from 'src/hooks/use-boolean';
import { usePopover } from 'src/app/admin/role-manager/components/custom-popover';
// types
import { AuthContext } from 'src/auth/context';
import { IAreaItem } from 'src/types/area';
import Image from 'src/app/admin/role-manager/components/image';

// ----------------------------------------------------------------------

type Props = {
  row: IAreaItem;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function AreasTableRow({
  row,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) {
  const {
    area_name,
    area_status,
    sub_area_tags,
    region_id,
    state_id,
    area_id,
    created_on,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const { user } = useContext(AuthContext);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10) < 4 && (day % 100 - day % 10 !== 10) ? day % 10 : 0];
    return `${day}${suffix} ${format(date, "MMM - hh.mm a")}`;
  };
  return (
    <>
      <TableRow>

        <TableCell>{area_name} </TableCell>

        <TableCell>{sub_area_tags} </TableCell>

        <TableCell>{formatDate(created_on)}</TableCell>

        <TableCell align="right">
          <Image
            src="/assets/images/edit.png"
            height={20}
            width={20}
            onClick={onEditRow}
            sx={{ cursor: 'pointer' }}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
