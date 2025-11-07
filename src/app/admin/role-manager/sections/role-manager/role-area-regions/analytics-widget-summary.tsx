// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// theme
import { bgGradient } from 'src/theme/css';
// utils
import { fNumber } from 'src/utils/format-number';
// theme
import { ColorSchema } from 'src/theme/palette';
import Image from 'src/app/admin/role-manager/components/image';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  color?: ColorSchema;
  src: string;
  iconColor?: ColorSchema;
}

export default function AnalyticsWidgetSummary({
  title,
  total,
  color = 'primary',
  src,
  sx,
  iconColor = 'primary',
  ...other
}: Props) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        py: 1,
        px: 3,
        position: 'relative',
        boxShadow: 0,
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      {/* Move Icon to Top Right Corner */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette[iconColor].dark,
          ...bgGradient({
            direction: '135deg',
            startColor: `${alpha(theme.palette[iconColor].dark, 0)} 0%`,
            endColor: `${alpha(theme.palette[iconColor].dark, 0.24)} 100%`,
          }),
        }}
      >
        <Image src={src} alt="create region" width={22} />

      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="body2" sx={{ opacity: 0.64, color: '#202224' }}>
          {title}
        </Typography>

        <Typography variant="h6">
          {fNumber(total)}
        </Typography>
      </Box>
    </Card>
  );
}

