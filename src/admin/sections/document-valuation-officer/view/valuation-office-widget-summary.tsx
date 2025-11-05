// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// utils
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  src: string;
}

export default function ValuationOfficerWidgetSummary({ title, total, src, sx, ...other }: Props) {

  return (
    <Card sx={{ width: 1, display: 'flex', alignItems: 'center', p: 3, ...sx, height: '150px' }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Stack>
          <Typography variant="subtitle2" color='#898b8b'
          >{title}</Typography>
        </Stack>
        <Stack direction="row" justifyContent='space-between' sx={{ mt: 2, mb: 1 }}>
          <Typography variant="h3">{fNumber(total)}</Typography>
          <img src={src} width={60} alt={title} />
        </Stack>

      </Box>
    </Card>
  );
}
