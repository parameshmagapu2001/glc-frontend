'use client';

import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Grid } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useCountdownSeconds } from 'src/hooks/use-countdown';
// assets
import { SentIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFCode } from 'src/components/hook-form';
import { adminGenerateAndSendOtp, adminUpdatePasswordWithOTP } from 'src/api/forgot-password';
// ----------------------------------------------------------------------

export default function NewPasswordView() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const loginId = searchParams.get('loginId');

  const password = useBoolean();

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const VerifySchema = Yup.object().shape({
    verificationCode: Yup.string().min(5, 'verificationCode must be at least 5 characters').required('verificationCode is required'),
    loginId: Yup.string().required('loginId is required')
      .min(3, 'loginId must be at least 3 characters'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    verificationCode: '',
    loginId: loginId || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await adminUpdatePasswordWithOTP(data);
      if (response.data === true) {
        enqueueSnackbar('Password updated successfully', { variant: 'success' });
        router.push(paths.auth.login);
      } else {
        enqueueSnackbar('Enter valid OTP', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await adminGenerateAndSendOtp(values.loginId);
    } catch (error) {
      console.error(error);
    }
  }, [startCountdown, values.loginId]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">

      <RHFCode
        name="verificationCode"
      />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
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

      <RHFTextField
        name="confirmPassword"
        label="Confirm New Password"
        type={password.value ? 'text' : 'password'}
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit" 
        variant="contained"
        loading={isSubmitting}
        sx={{ borderRadius: 0.5 }}
      >
        Update Password
      </LoadingButton>

      <Typography variant="body2">
        {`Don’t have a code? `}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(counting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          Resend code {counting && `(${countdown}s)`}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 86 }} />

      <Stack spacing={1} sx={{ my: 2 }}>
        <Typography variant="h3">Request sent successfully!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the code in below box to verify your loginId.
        </Typography>
      </Stack>
    </>
  );

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} md={4}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderHead}

          {renderForm}
        </FormProvider>
      </Grid>
    </Grid>
  );
}
