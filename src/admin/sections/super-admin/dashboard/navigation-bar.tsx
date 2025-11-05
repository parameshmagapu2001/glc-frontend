import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getFarmlands } from 'src/api/region-officer';

const RootStyle = styled(Box)(({ theme }) => ({
  borderRadius: 14,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '6px 6px 54px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(1, 4),
  height: '75px',
  alignContent: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 2),
  },
}));

// Common Nav Button styling
const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  fontWeight: 700,
  textTransform: 'none',
  flex: 1,
  height: '55px',
  padding: theme.spacing(1, 3),
  // fontSize: 12, // Default size
  [theme.breakpoints.up('sm')]: {
    fontSize: 10, // Medium screen
  },
  [theme.breakpoints.up('md')]: {
    fontSize: 13, // Medium screen
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 16, // Large screen
  },
}));
const NavigationBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string>('');
  const [assignedCount, setAssignedCount] = useState(0);


  const handleButtonClick = (button: string): void => {
    setActive(button);
    setTimeout(() => {
      if (button === 'dashboard') {
        router.push('/super-admin');
      } else if (button === 'assigned') {
        router.push('/super-admin/assigned-farmlands');
      } else if (button === 'farmlands') {
        router.push('/super-admin/farmlands-list');
      } else {
        router.push('/super-admin/users');
      }
    }, 0);
  };

  useEffect(() => {
    fetchAssignedFarmlands();
    if (pathname.includes('/super-admin/assigned-farmlands')) {
      setActive('assigned');
    } else if (pathname.includes('/super-admin/farmlands-list')) {
      setActive('farmlands');
    } else if (pathname.includes('/super-admin/users')) {
      setActive('users');
    } else {
      setActive('dashboard');
    }
  }, [pathname]);
 
    const fetchAssignedFarmlands = async () => {
      const farmlandData = {
        searchKey: null,
        status: 'Assigned',
        pageNumber: 1,
        pageSize: 5
      };
      try {
        const response = await getFarmlands(farmlandData);
        const { totalRecords } = response.data;
        setAssignedCount(totalRecords);
      } catch (error) {
        console.error(error);
      }
    }

  return (
    <RootStyle>
      {/* Use a row Stack with full width so all buttons share space equally */}
      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
        {/* 1) Dashboard */}
        <NavButton
          onClick={() => handleButtonClick('dashboard')}
          sx={{
            bgcolor: active === 'dashboard' ? 'primary.main' : 'transparent',
            color: active === 'dashboard' ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: active === 'dashboard' ? 'primary.main' : 'grey[300]'
            },
          }}
        >
          Dashboard
        </NavButton>

        {/* 2) Assigned Farmlands + Badge */}
        <NavButton
          onClick={() => handleButtonClick('assigned')}
          sx={{
            bgcolor: active === 'assigned' ? 'primary.main' : 'transparent',
            color: active === 'assigned' ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: active === 'assigned' ? 'primary.main' : 'grey[300]',
            },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontSize: { sm: '10px', md: '13px', lg: '16px' } }}>Assigned Farmlands</Typography>
            <Box
              sx={{
                bgcolor: active === 'assigned' ? '#ffffff' : '#A4A3EA',
                color: active === 'assigned' ? 'grey' : 'white',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: { sm: '10px', md: '13px', lg: '16px' }
              }}
            >
              {assignedCount}
            </Box>
          </Stack>
        </NavButton>

        {/* 3) Farmlands List */}
        <NavButton
          onClick={() => handleButtonClick('farmlands')}
          sx={{
            bgcolor: active === 'farmlands' ? 'primary.main' : 'transparent',
            color: active === 'farmlands' ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: active === 'farmlands' ? 'primary.main' : 'grey[300]',
            },
          }}
        >
          Farmlands List
        </NavButton>

        {/* 4) Users */}
        <NavButton
          onClick={() => handleButtonClick('users')}
          sx={{
            bgcolor: active === 'users' ? 'primary.main' : 'transparent',
            color: active === 'users' ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: active === 'users' ? 'primary.main' : 'grey[300]'
            },
          }}
        >
          Users
        </NavButton>
      </Stack>
    </RootStyle>
  );
}

export default NavigationBar;