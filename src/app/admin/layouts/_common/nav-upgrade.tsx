// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// ----------------------------------------------------------------------

export default function NavUpgrade() {

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
  
        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
          © 2023 - All Rights
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            With GLC
          </Typography>
        </Stack>

      </Stack>
    </Stack>
  );
}
