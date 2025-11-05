
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Link, ListItemText } from '@mui/material';
import { useContext } from 'react';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// types
import { AuthContext } from 'src/auth/context';
import { IAreaRegionItem } from 'src/types/area-regions';

// ----------------------------------------------------------------------

type Props = {
  row: IAreaRegionItem;
  onViewAreaRow: VoidFunction;
  onViewRegionRow: VoidFunction;
};

export default function AreaRegionsTableRow({
  row,
  onViewAreaRow,
  onViewRegionRow,
}: Props) {
  const {
    state_name,
    region_count,
    area_count,
  } = row;

  return (
    <TableRow>

      <TableCell>{state_name} </TableCell>

      <TableCell>
        <ListItemText
          disableTypography
          primary={
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onViewRegionRow}
              sx={{ cursor: 'pointer', color: 'info.main' }}
            >
              {region_count}
            </Link>}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          disableTypography
          primary={
            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onViewAreaRow}
              sx={{ cursor: 'pointer', color: 'info.main' }}
            >
              {area_count}
            </Link>}
        />
      </TableCell>

    </TableRow>
  );
}
