'use client';

import {Button, Grid, Stack, Typography } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import PasswordIcon from 'src/assets/icons/password-icon';
// ----------------------------------------------------------------------

export default function SessionExpiredView() {

  const router = useRouter();

  const openSessionExpiredPage = () => {
    router.push(paths.auth.login);
  };

  const renderHead = (
    <Grid item xs={12} md={12}>
      <PasswordIcon sx={{ height: 90 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>Your Session Got Expired</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Please login again to continue using our site
        </Typography>
      </Stack>
    </Grid>
  );

  return (
    <Stack sx={{ m: 5 }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          {renderHead}
          <Stack display="flex" justifyContent="center" alignItems="center">
            <Button variant="contained" color="primary" onClick={openSessionExpiredPage}>
              Login
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
