import { FC } from 'react';
import {
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  styled,
  Box,
  Paper,
  Avatar,
} from '@mui/material';
import { TimelineSidebarProps } from './types';
import { StyledSidebar} from './styles';
import { NAVIGATION_ITEMS } from './mock-data';

const StyledSidebarItem = styled(Box)(({ theme }) => ({
  borderRadius: '30px',
  display: 'flex',
  padding: '10px',
  alignItems: 'center',
  gap: '10px',
  marginLeft: '11px',
  marginRight: '12px',
}));

const ActiveSidebarItem = styled(StyledSidebarItem)(({ theme }) => ({
  backgroundColor: 'rgba(229, 228, 255, 1)',
}));

const InactiveSidebarItem = styled(StyledSidebarItem)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
}));

const StepConnector = styled(Box)(({ theme }) => ({
  borderColor: 'rgba(12, 160, 12, 1)',
  borderStyle: 'solid',
  borderWidth: '3px',
  marginLeft: '32px',
  width: '3px',
  height: '50px',
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
  },
}));

export const TimelineSidebar: FC<TimelineSidebarProps> = ({
  farmlandId,
  currentSection,
  onSectionChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledSidebar
      elevation={isMobile ? 1 : 3}
      sx={{ margin: '0 !important', padding: '0 !important' }}
    >
      <Paper
        sx={{
          borderRadius: '10px',
          display: 'flex',
          width: '100%',
          padding: { xs: '20px 20px 51px', md: '20px 21px 51px' },
          flexDirection: 'column',
          alignItems: 'stretch',
          fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
          fontSize: '16px',
          color: 'rgba(0, 0, 0, 1)',
          fontWeight: 400,
        }}
      >
        <Typography
          sx={{
            color: 'rgba(117, 117, 117, 1)',
            fontSize: '18px',
            alignSelf: 'flex-start',
            marginLeft: { xs: '10px', md: '26px' },
          }}
        >
          Dashboard
        </Typography>

        <Divider sx={{ marginTop: '14px', height: '1px', borderColor: 'rgba(223, 223, 223, 1)' }} />

        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 300,
            alignSelf: 'center',
            marginTop: '23px',
          }}
        >
          Farmland ID:
        </Typography>

        <Typography
          sx={{
            fontSize: '35px',
            fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
            alignSelf: 'center',
          }}
        >
          {farmlandId}
        </Typography>

        <Box sx={{ marginTop: '41px' }}>
          {NAVIGATION_ITEMS.map((item, index) => (
            <Box key={item.id} onClick={() => onSectionChange(item.id)}>
              {index !== 0 && <StepConnector />}
              {currentSection === item.id ? (
                <ActiveSidebarItem>
                  <Avatar src={item.icon} sx={{ width: 24, height: 24 }} />
                  <Typography sx={{ flexGrow: 1 }}>{item.label}</Typography>
                </ActiveSidebarItem>
              ) : (
                <InactiveSidebarItem>
                  <Avatar src={item.icon} sx={{ width: 24, height: 24 }} />
                  <Typography sx={{ flexGrow: 1 }}>{item.label}</Typography>
                </InactiveSidebarItem>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </StyledSidebar>
  );
};

export default TimelineSidebar;
