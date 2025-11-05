import { Theme } from '@mui/material/styles';

export const cardStyle = (theme: Theme) => ({
  borderRadius: 16,
  boxShadow: '0px 4px 17px rgba(0, 0, 0, 0.12)',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
});

export const selectStyle = (theme: Theme) => ({
  borderRadius: 30,
  backgroundColor: 'rgba(130, 128, 255, 0.11)',
  border: '1px solid rgba(130, 128, 255, 1)',
  color: 'rgba(130, 128, 255, 1)',
  fontSize: 12,
  padding: theme.spacing(0.8, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
});

export const chartContainerStyle = {
  width: '100%',
  height: 300,
  '& .recharts-wrapper': {
    fontSize: 12,
  },
};

export const gridSpacing = 2;

export const responsiveSpacing = (theme: Theme) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
});
