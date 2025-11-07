import { ApexOptions } from 'apexcharts';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
// components
import Iconify from 'src/app/admin/role-manager/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      type: string;
      data: {
        name: string;
        data: number[];
      }[];
    };
    options?: ApexOptions;
  };
  onGraphDataChange: (type: string) => void;
}

export default function BankingBalanceStatistics({ title, subheader, chart, onGraphDataChange, ...other }: Props) {
  const { categories, colors, series, options } = chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState(series.type);

  const GRAPH_OPTIONS = [
    { type: 'Year' },
    { type: 'Month' },
    { type: 'Week' }
  ];

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `₹ ${value}`,
      },
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      setSeriesData(newValue);
      onGraphDataChange(newValue);
    },
    [onGraphDataChange, setSeriesData]
  );

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
              }}
            >
              {seriesData}

              <Iconify
                width={16}
                icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />
        {series &&
          <Box key={series.type} sx={{ mt: 3, mx: 3 }}>
            {true && (
              <Chart dir="ltr" type="bar" series={series.data} options={chartOptions} height={364} />
            )}
          </Box>
        }
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {GRAPH_OPTIONS.map((option) => (
          <MenuItem
            key={option.type}
            selected={option.type === seriesData}
            onClick={() => handleChangeSeries(option.type)}
          >
            {option.type}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
