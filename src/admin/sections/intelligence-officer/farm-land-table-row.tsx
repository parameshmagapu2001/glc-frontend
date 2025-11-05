// @mui
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Avatar, Stack } from '@mui/material';
import { format } from 'date-fns';
import { IFarmlandItem } from 'src/types/farmlands';
import ProjectStatus from 'src/sections/field-officer/project-status';

// ----------------------------------------------------------------------

type Props = {
  row: IFarmlandItem;
  onViewRow: VoidFunction;
};

export default function FarmlandTableRow({ row, onViewRow }: Props) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10) < 4 && (day % 100 - day % 10 !== 10) ? day % 10 : 0];
    return `${day}${suffix} ${format(date, "MMM - hh.mm a")}`;
  };

  return (
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

      <TableCell><Stack onClick={onViewRow}
        sx={{
          cursor: 'pointer',
          color: '#1D7ABE',
          fontWeight: 'bold',
          textDecoration: 'underline'
        }}>
        {row.farmlandCode}
      </Stack>
      </TableCell>

      <TableCell>{row.location}</TableCell>

      <TableCell>{formatDate(row.createdOn)}</TableCell>

      <TableCell>{row.landArea}</TableCell>

      <TableCell>{row.landCostLabel}</TableCell>

      <TableCell>{row.costPerAcre}</TableCell>

      <TableCell>
        <ProjectStatus status={row.farmlandStatus} />
      </TableCell>

    </TableRow>
  );
}
