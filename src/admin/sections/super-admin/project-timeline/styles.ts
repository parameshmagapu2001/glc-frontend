import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Typography } from '@mui/material';

export const StyledRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: theme.spacing(8),
  },
}));

export const StyledContent = styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100%',
  margin: '0 auto',
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const StyledSidebar = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingLeft: '20px',  
  paddingRight: '10px', 
  paddingTop: '0px',
  paddingBottom: '0px',
  margin: "0 !important",
  [theme.breakpoints.down('md')]: {
    paddingLeft: '15px',
  },
}));

export const StyledNavItem = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  gap: theme.spacing(2),
  backgroundColor: active ? theme.palette.primary.lighter : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  transition: theme.transitions.create(['background-color', 'color']),
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
    color: theme.palette.primary.main,
  },
}));

export const StyledTimelineContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const getBorderColor = (theme: any, status: 'approved' | 'pending' | 'rejected') => {
  if (status === 'approved') return theme.palette.success.main;
  if (status === 'rejected') return theme.palette.error.main;
  return theme.palette.primary.main;
};

export const StyledTimelineDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: 'approved' | 'pending' | 'rejected' }>(({ theme, status }) => ({
  width: 22,
  height: 22,
  borderRadius: '50%',
  borderWidth: 4,
  borderStyle: 'solid',
  backgroundColor: theme.palette.background.paper,
  borderColor: getBorderColor(theme, status),
}));

export const StyledTimelineConnector = styled(Box)(({ theme }) => ({
  width: 2,
  height: 35,
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(0.5, 0, 0.5, 2.5),
}));

export const StyledTimelineContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0, 2),
}));

export const StyledEventCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: 'none',
  boxShadow: 'none',
  borderRadius: 0
 }));

export const StyledEventTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  marginBottom: theme.spacing(1),
}));

export const StyledAudioPlayer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
}));

export const StyledRatingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));
