
// @mui
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { format } from 'date-fns';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
// types
import { IRegionItem } from 'src/types/regions';
import Image from 'src/components/image';

// ----------------------------------------------------------------------

type Props = {
  row: IRegionItem;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function RegionsTableRow({
  row,
  onDeleteRow,
  onEditRow,
}: Props) {
  const {
    region_name,
    sub_region_tags,
    created_on,
  } = row;

  const confirm = useBoolean();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10) < 4 && (day % 100 - day % 10 !== 10) ? day % 10 : 0];
    return `${day}${suffix} ${format(date, "MMM - hh.mm a")}`;
  };

  return (
    <>
      <TableRow>

        <TableCell>{region_name} </TableCell>

        <TableCell>{sub_region_tags} </TableCell>

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
