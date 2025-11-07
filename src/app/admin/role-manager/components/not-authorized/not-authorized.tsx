// @mui
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import ForbiddenIllustration from 'src/assets/illustrations/forbidden-illustration';

// ----------------------------------------------------------------------

type EmptyContentProps = StackProps & {
  filled?: boolean;
  description?: string;
  action?: React.ReactNode;
};

export default function NotAuthorized({
  action,
  filled,
  description,
  sx,
  ...other
}: EmptyContentProps) {
  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        px: 3,
        ...(filled && {
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.08)}`,
        }),
        ...sx,
      }}
      {...other}
    >
      
      <ForbiddenIllustration
        sx={{
          height: 150,
          my: { xs: 5, sm: 10 },
        }}
      />

      <Typography
        variant="h6"
        component="span"
        sx={{color: 'text.disabled', textAlign: 'center' }}
      >
        You are not authorized to access this page.
      </Typography>

    </Stack>
  );
}
