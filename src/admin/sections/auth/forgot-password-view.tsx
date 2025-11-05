'use client';

import * as Yup from 'yup';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Stack, Typography, Link, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// api
import { adminGenerateAndSendOtp } from 'src/api/forgot-password';
// toast

import { PasswordIcon } from 'src/assets/icons';

const ForgotPasswordPage = () => {
  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    loginId: Yup.string()
      .required('Login Id is required')
      .min(3, 'Login Id must be at least 3 characters'),
  });

  const defaultValues = {
    loginId: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await adminGenerateAndSendOtp(data.loginId);
      if (response.data === true) {
        enqueueSnackbar('OTP sent successfully to your registered mobile number', { variant: 'success' });

        const searchParams = new URLSearchParams({ loginId: data.loginId }).toString();
        const href = `${paths.auth.new_password}?${searchParams}`;
        router.push(href);
      } else {
        enqueueSnackbar('Enter Valid Login Id', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Grid container sx={{ minHeight: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Left Image Section */}
      <Grid
        item
        xs={12}
        md={6}
      >

      <Box sx={{ position: 'relative', width: '112%', height: '100%', px:0 }}>
          <Image
            src="/assets/images/forgetPassword.png"
            alt="Change Password"
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Grid>

      {/* Right Form Section */}
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: '#FFFFFF' }}
      >
        <Box sx={{ width: '100%', maxWidth: 400, px: 3 }}>
        <PasswordIcon sx={{ height: 96 }} />
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3} textAlign="center">
              <Typography variant="h3">Forgot your password?</Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter the loginId associated with your account
              </Typography>

              <RHFTextField
                name="loginId"
                label="Login Id *"
                placeholder="Enter Login Id"
                InputLabelProps={{ shrink: true }}
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ backgroundColor: '#8280FF', '&:hover': { backgroundColor: '#6E6AFF' } }}
              >
                Send Request
              </LoadingButton>

              <Link
                component={RouterLink}
                href={paths.auth.login}
                color="inherit"
                variant="subtitle2"
                sx={{ alignItems: 'center', display: 'inline-flex', justifyContent: 'center' }}
              >
                <Iconify icon="eva:arrow-ios-back-fill" width={16} />
                &nbsp;Return to sign in
              </Link>
            </Stack>
          </FormProvider>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordPage;

