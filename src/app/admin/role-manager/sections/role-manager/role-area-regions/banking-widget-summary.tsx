import { ApexOptions } from 'apexcharts';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// utils
import { fNumber, fPercent } from 'src/utils/format-number';
// theme
import { ColorSchema } from 'src/theme/palette';
import { bgGradient } from 'src/theme/css';
// components
import Iconify from 'src/app/admin/role-manager/components/iconify';
import Chart, { useChart } from 'src/app/admin/role-manager/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  percent: number;
  color?: ColorSchema;
  icon: string;
  chart: {
    series: {
      x: number;
      y: number;
    }[];
    options?: ApexOptions;
  };
}

export default function BankingWidgetSummary({
  title,
  total,
  icon,
  percent,
  color = 'primary',
  chart,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const { series, options } = chart;

  const chartOptions = useChart({
    colors: [theme.palette[color].dark],
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      marker: {
        show: false,
      },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
    },
    ...options,
  });

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        width: 1,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1, p: 2, pb: 0 }}>
        <div>
          <Typography variant="subtitle2">{title}</Typography>

          <Typography variant="h5">&#8377;{fNumber(total)}</Typography>
        </div>

        <div>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 0.6 }}>
            <Iconify icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />

            <Typography variant="subtitle2" component="span" sx={{ ml: 0.5 }}>
              {percent > 0 && '+'}
              {fPercent(percent)}
            </Typography>
          </Stack>


          <Typography variant="body2" component="span" sx={{ opacity: 0.72 }}>
            &nbsp;than last month
          </Typography>

        </div>
      </Stack>

      <Chart type="area" series={[{ data: series }]} options={chartOptions} height={120} />
    </Stack>
  );
}
