'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Stack,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Card,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { enqueueSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { changePassword } from 'src/api/change-password';
import { useAuthContext } from 'src/auth/hooks';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

const getDashboardHref = (pathname: string): string => {
  if (pathname.includes('/role-manager')) return paths.rm.root;
  if (pathname.includes('/field-officer')) return paths.fo.root;
  if (pathname.includes('/region-officer')) return paths.ro.root;
  if (pathname.includes('/intelligence-officer')) return paths.io.root;
  if (pathname.includes('/ccs-approval-team')) return paths.ccs.root;
  if (pathname.includes('/glc-admin')) return paths.admin.root;
  if (pathname.includes('/document-valuation-officer')) return paths.vo.root;
  if (pathname.includes('/super-admin')) return paths.superAdmin.root;
  return '/'; // fallback
};

export default function ChangePasswordForm() {
  const pathname = usePathname();
  const dashboardHref = getDashboardHref(pathname);
  const router = useRouter();
  const password = useBoolean();
  const oldPassword = useBoolean();
  const newPassword = useBoolean();
  const { logout } = useAuthContext();

  const VerifySchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(6, 'Old Password must be at least 6 characters')
      .required('Old Password is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onClosePage = () => {
    router.push(paths.rm.root);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await changePassword(data);
      console.log('Password Change Response:', response); 
  
      if (response.data === true) {
        enqueueSnackbar('Password Updated Successfully', { variant: 'success' });
  
        setTimeout(async () => {
          await logout();
          router.replace('/');
        }, 1500);
      } else {
        enqueueSnackbar('Enter the Correct Old Password', { variant: 'error' });
      }
    } catch (error) {
      console.error('Change Password Error:', error); 
      enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });
    }
  });
  

  return (
<>
    <Stack direction="row" alignItems="center" >
          <CustomBreadcrumbs
            links={[
              {
                name: 'Dashboard',
                href: dashboardHref,
              },
              {
                name: 'Change Password',
              }
            ]}
          />
        </Stack>
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left section with image */}
      <Grid
        item
        xs={12}
        md={6}
      >
        <Box sx={{ position: 'relative', width: '112%', height: '100%', px:0 }}>
          <Image
            src="/assets/images/changePassword.png"
            alt="Change Password"
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Grid>

      {/* Right section with form */}
      <Grid
        item
        xs={12}
        md={6}
        component={Card}
        sx={{
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ px: { xs: 3, md: 6 }, py: 5, width: '100%' }}>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
              <RHFTextField
                name="oldPassword"
                label="Old Password"
                type={oldPassword.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={oldPassword.onToggle} edge="end">
                        <Iconify
                          icon={oldPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="password"
                label="New Password"
                type={newPassword.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={newPassword.onToggle} edge="end">
                        <Iconify
                          icon={newPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="confirmPassword"
                label="Confirm Password"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <DialogActions sx={{ px: 0 }}>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="outlined" color="inherit" onClick={onClosePage}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ backgroundColor: '#8280FF',
                    borderRadius: 0.5,
                    '&:hover': {
                      backgroundColor: '#8280FF',
                    },
                  }}
                 
                >
                  Update Password
                </LoadingButton>
              </DialogActions>
            </Stack>
          </FormProvider>
        </Box>
      </Grid>
    </Grid>
  </>
  );
}
