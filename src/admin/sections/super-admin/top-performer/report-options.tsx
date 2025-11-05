import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';

interface Props {
  activeItem: 'farmland' | 'sales';
  setActiveItem: (item: 'farmland' | 'sales') => void;
  totalFarmlands: number;
  totalSales: number;
}

function ReportOptions({ activeItem, totalFarmlands, totalSales, setActiveItem }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      borderRadius="10px"
      border="1px solid #DADEE6"
      width="244px"
      height="162px"
      mt="40px"
      mx="auto"
    >
      {/* Farmland */}
      <Box
        sx={{
          position: 'relative',
          width: '50%',
          height: '100%',
          backgroundColor: activeItem === 'farmland' ? 'white' : 'transparent',
          borderRadius: activeItem === 'farmland' ? '10px' : 0,
          color: activeItem === 'farmland' ? '#3361FF' : '#999999',
          cursor: 'pointer',
          transform: activeItem === 'farmland' ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => setActiveItem('farmland')}
      >
        {/* Blue Dot */}
        {activeItem === 'farmland' && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#3361FF',
            }}
          />
        )}

        <Stack alignItems="center" justifyContent="center" height="100%">
          <Image
            src={
              activeItem === 'farmland'
                ? '/assets/icons/field-officer/farmland-report-active.svg'
                : '/assets/icons/field-officer/farmland-report-inactive.svg'
            }
            width={32}
            height={32}
            alt="icon"
          />
          <Typography fontSize="14px">Farmland Report</Typography>
          <Typography fontSize="21px" fontWeight={600}>
            {totalFarmlands}
          </Typography>
        </Stack>
      </Box>

      {/* Sales */}
      <Box
        sx={{
          position: 'relative',
          width: '50%',
          height: '100%',
          backgroundColor: activeItem === 'sales' ? 'white' : 'transparent',
          borderRadius: activeItem === 'sales' ? '10px' : 0,
          color: activeItem === 'sales' ? '#3361FF' : '#999999',
          cursor: 'pointer',
          transform: activeItem === 'sales' ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => setActiveItem('sales')}
      >
        {/* Blue Dot */}
        {activeItem === 'sales' && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#3361FF',
            }}
          />
        )}

        <Stack alignItems="center" justifyContent="center" height="100%">
          <Image
            src={
              activeItem === 'sales'
                ? '/assets/icons/field-officer/sales-report-active.svg'
                : '/assets/icons/field-officer/sales-report-inactive.svg'
            }
            width={32}
            height={32}
            alt="icon"
          />
          <Typography fontSize="14px">Sales Report</Typography>
          <Typography fontSize="21px" fontWeight={600}>
            {totalSales}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

export default ReportOptions;

