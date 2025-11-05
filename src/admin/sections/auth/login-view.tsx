'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Link } from '@mui/material';
// routes
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import {
  RO_PATH_AFTER_LOGIN, VO_PATH_AFTER_LOGIN, IO_PATH_AFTER_LOGIN, RM_PATH_AFTER_LOGIN
  , CCS_PATH_AFTER_LOGIN, ADMIN_PATH_AFTER_LOGIN, FO_PATH_AFTER_LOGIN
} from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function LoginView() {

  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    loginId: Yup.string().required('User Name required'),
    passCode: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    loginId: '',
    passCode: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await login?.(data.loginId, data.passCode);
      console.log("login response", response.primaryRoleId);
      if (response.primaryRoleId === 1 || response.primaryRoleId === 2) {
        router.push(returnTo || ADMIN_PATH_AFTER_LOGIN);
      } else if (response.primaryRoleId === 3) {
        router.push(returnTo || RM_PATH_AFTER_LOGIN);
      }
      else if (response.primaryRoleId === 7) {
        router.push(returnTo || RO_PATH_AFTER_LOGIN);
      }
      else if (response.primaryRoleId === 8) {
        router.push(returnTo || IO_PATH_AFTER_LOGIN);
      }
      else if (response.primaryRoleId === 9) {
        router.push(returnTo || FO_PATH_AFTER_LOGIN);
      }
      else if (response.primaryRoleId === 4 || response.primaryRoleId === 5 || response.primaryRoleId === 6) {
        router.push(returnTo || VO_PATH_AFTER_LOGIN);
      } else if (response.primaryRoleId === 11) {
        router.push(returnTo || CCS_PATH_AFTER_LOGIN);
      }
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField
        name="loginId"
        label="User Name"
        InputLabelProps={{ shrink: true }}
      />

      <RHFTextField
        name="passCode"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        component={RouterLink}
        href={paths.auth.forgot_password}
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3, borderRadius: 0.5 }}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
