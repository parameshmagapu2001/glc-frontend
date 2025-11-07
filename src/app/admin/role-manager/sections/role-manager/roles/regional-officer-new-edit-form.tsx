import * as Yup from 'yup';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Button, Dialog, DialogTitle, MenuItem, Typography, useTheme } from '@mui/material';
// components
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFSelect, RHFUploadAvatar } from 'src/app/admin/role-manager/components/hook-form';
import { IMapping } from 'src/types/mapping';
import Image from 'src/app/admin/role-manager/components/image';
import { getFilterStateRegions, getFilterStates } from 'src/api/filters';
import { IRoleUserRequest } from 'src/types/role-users';
import { createUser, getOfficerDetails, updateUser, uploadUserIdProofs } from 'src/api/roles';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------
type Props = {
  userId?: number;
  currentUser?: IRoleUserRequest;
};

export default function RegionalOfficerNewEditForm({ currentUser, userId }: Props) {

  const [states, setStates] = useState<IMapping[]>([{ id: '0', label: 'Select State' }]);

  const [regions, setRegions] = useState<IMapping[]>([{ id: '0', label: 'Select A Region' }]);

  const [officerDetails, setOfficerDetails] = useState<any>();

  const [successFlag, setSuccessFlag] = useState(false);

  const [openAadharUpload, setOpenAadharUpload] = useState(false);

  const [openPanUpload, setOpenPanUpload] = useState(false);


  const theme = useTheme();

  const router = useRouter();

  const UserSchema = Yup.object().shape({
    role_id: Yup.number().required('Role is required').moreThan(0, 'Select a role'),
    first_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'First Name should not contain numbers')
      .required('First Name is required')
      .max(150, 'Maximum 150 characters'),
    last_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Last Name should not contain numbers')
      .required('Last Name is required')
      .max(150, 'Maximum 150 characters'),
    mobile_number: Yup.string().required('Contact Number is required')
      .matches(/^[1-9][0-9]*$/, 'Please Enter only numbers and the first digit should not be zero')
      .max(10, 'Please enter a valid number ').min(10, 'Please enter a valid number'),
    user_email: Yup.string().required('Email is required').email('Email is not valid'),
    age: Yup.number().required('Age is required').min(18, 'Minimum age is 18'),
    location: Yup.string().required('Location is required'),
    address: Yup.string().required('Address is required'),
    state_id: Yup.number().required('State is required').moreThan(0, 'Select a state'),
    region_id: Yup.number().required('Region is required').moreThan(0, 'Select a region'),
    area_id: Yup.number().optional(),
    city_village: Yup.string().required('City/Village is required'),
    pin_code: Yup.string().required('Pin Code is required').min(6, 'Maximum 6 characters').max(6, 'Maximum 6 characters'),
    aadhar_number: Yup.string()
      .required('Aadhar Number is required')
      .min(12, 'Maximum 12 characters').max(12, 'Maximum 12 characters'),
    pan_number: Yup.string()
    .transform(value => value?.toUpperCase())
    .required('Pan Number is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN must be 10 characters: 5 letters, 4 digits, 1 letter'),
    state: Yup.string().required('State is required'),
    aadhar_front: Yup.mixed<any>().nullable().optional(),
    aadhar_back: Yup.mixed<any>().nullable().optional(),
    pan_front: Yup.mixed<any>().nullable().optional(),
    pan_back: Yup.mixed<any>().nullable().optional(),
  });

  const defaultValues = useMemo(
    () => ({
      role_id: currentUser?.role_id || 7,
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      mobile_number: currentUser?.mobile_number || '',
      user_email: currentUser?.user_email || '',
      age: currentUser?.age || 0,
      location: currentUser?.location || '',
      address: currentUser?.address || '',
      state_id: currentUser?.state_id || 0,
      region_id: currentUser?.region_id || 0,
      area_id: currentUser?.area_id || 0,
      city_village: currentUser?.city_village || '',
      pin_code: currentUser?.pin_code || '',
      aadhar_number: currentUser?.aadhar_number || '',
      pan_number: currentUser?.pan_number || '',
      state: currentUser?.state || '',
      aadhar_front: currentUser?.aadhar_front || '',
      aadhar_back: currentUser?.aadhar_back || '',
      pan_front: currentUser?.pan_front || '',
      pan_back: currentUser?.pan_back || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    getValues,
    setValue,
    watch,
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
      getFilterRegions(currentUser.state_id);
    }
    getStates();
    console.log('currentUser', currentUser?.first_name);
  }, [currentUser, defaultValues, reset]);

  const getStates = async () => {
    const response = await getFilterStates();
    setStates([{ id: '0', label: 'Select A State' }, ...response]);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stateId = event.target.value;
    setValue('state_id', parseInt(stateId, 10));
    trigger('state_id', { shouldFocus: false });
    getFilterRegions(parseInt(stateId, 10));
  };

  const getFilterRegions = async (stateId: number) => {
    const response = await getFilterStateRegions(stateId);
    setRegions([{ id: '0', label: 'Select A Region' }, ...response]);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regionId = event.target.value;
    setValue('region_id', parseInt(regionId, 10));
    trigger('region_id', { shouldFocus: false });
    fetchOfficerDetails(7, parseInt(regionId, 10));
  }

  const fetchOfficerDetails = async (roleId: number, regionId: number) => {
    try {
      const response = await getOfficerDetails(roleId, regionId);
      setOfficerDetails(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const onOpenUploadAadhar = () => {
    setOpenAadharUpload(true);
  }

  const onOpenUploadPan = () => {
    setOpenPanUpload(true);
  }

  const handleAadharFrontDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('aadhar_front', newFile);
        enqueueSnackbar('Aadhar Front Image Uploaded', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        });
      }
    },
    [setValue]
  );

  const handleAadharBackDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('aadhar_back', newFile);
        enqueueSnackbar('Aadhar Back Image Uploaded', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        });
      }
    },
    [setValue]
  );

  const handlePanFrontDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('pan_front', newFile);
        enqueueSnackbar('Pan Front Image Uploaded', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        });
      }
    },
    [setValue]
  );

  const handlePanBackDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('pan_back', newFile);
        enqueueSnackbar('Pan Back Image Uploaded', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
          }
        });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    const isValid = Object.keys(errors).length === 0;
    if (!isValid) return;

    const aadharFrontStatus = typeof data.aadhar_front !== 'string';
    const aadharBackStatus = typeof data.aadhar_back !== 'string';
    const panFrontStatus = typeof data.pan_front !== 'string';
    const panBackStatus = typeof data.pan_back !== 'string';

    if (!aadharFrontStatus || !aadharBackStatus || !panFrontStatus || !panBackStatus) {
      enqueueSnackbar('Please upload all the images', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      });
      return;
    }

    try {
      const response = userId ? await updateUser(userId || 0, data) : await createUser(data);
      if (response) {
        console.log('response', response);
        const newUserId = (userId !== undefined && userId !== 0) ? userId : response?.data?.user_id;
        if (aadharFrontStatus) {
          const imageFile = data.aadhar_front;
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('user_id', newUserId);
          formData.append('type', 'aadhar_front');
          await uploadUserIdProofs(formData);
        }

        if (aadharBackStatus) {
          const imageFile = data.aadhar_back;
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('user_id', newUserId);
          formData.append('type', 'aadhar_back');
          await uploadUserIdProofs(formData);
        }
        if (panFrontStatus) {
          const imageFile = data.pan_front;
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('user_id', newUserId);
          formData.append('type', 'pan_front');
          await uploadUserIdProofs(formData);
        }
        if (panBackStatus) {
          const imageFile = data.pan_back;
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('user_id', newUserId);
          formData.append('type', 'pan_back');
          await uploadUserIdProofs(formData);
        }

        setSuccessFlag(true);
        setTimeout(() => {
          router.push(paths.rm.roles.root);
        }, 1000);
      }
    } catch (error) {
      setSuccessFlag(false);
      enqueueSnackbar(error.error || 'An error occurred', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      });
    }
  });
  
  const watchedAadharFront = watch('aadhar_front');
  const watchedAadharBack = watch('aadhar_back');
  const watchedPanFront = watch('pan_front');
  const watchedPanBack = watch('pan_back');


  const renderDetails = (
    <>
      {!successFlag ?
        <Grid container spacing={2} sx={{ px: 10, py: 1, mb: 0 }}>
          {/* Left Image - Sticky on desktop */}
          <Grid xs={12} md={7} sx={{
            mt: 2,
            maxHeight: { md: 'calc(100vh - 100px)' }, // Allow more space
            minHeight: 500, // Ensure it doesn't shrink too much
          }}>
            <img
              src="/assets/images/regionalOfficerForm.png"
              alt="RegionalOfficer"
              style={{
                width: '100%', // Responsive width
                height: 'auto', // Maintain aspect ratio
                maxHeight: '90vh', // Avoid exceeding viewport
                objectFit: 'contain',
              }}
            />
          </Grid>


          <Grid xs={12} md={5} sx={{
            mt: 2,
            overflowY: { md: 'auto' }, // Enable vertical scrolling
          }}>
            <Stack spacing={3}>

              <RHFSelect
                name="state_id"
                label="State*"
                placeholder="Select State"
                onChange={handleStateChange}
                fullWidth
              >
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                name="region_id"
                label="Region*"
                placeholder="Select Region"
                onChange={handleRegionChange}
                fullWidth>
                {regions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              {officerDetails && officerDetails !== 'NotFound' &&
                <Stack direction="row" spacing={2} justifyContent='flex-end' alignItems='center'>
                  <Image src="/assets/images/brakeWarning.png" alt="Arrow" height={20} width={20} />
                  <Typography variant="body2" sx={{ color: 'error.main' }}>{officerDetails}</Typography>
                </Stack>}

              <Typography variant="h6">Enter Regional Officer Details</Typography>

              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <RHFTextField
                    name="first_name"
                    label="First Name*"
                    placeholder="Enter First Name"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <RHFTextField
                    name="last_name"
                    label="Last Name*"
                    placeholder="Enter Last Name"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12}>
                  <RHFTextField
                    type='email'
                    name="user_email"
                    label="Email ID*"
                    placeholder="Enter Email"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12}>
                  <RHFTextField
                    type='text'
                    name="mobile_number"
                    label="Phone Number*"
                    inputProps={{ maxLength: 10 }}
                    placeholder="Enter Mobile Number"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <RHFTextField
                    name="age"
                    label="Age*"
                    placeholder="Enter Age"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <RHFTextField
                    name="location"
                    label="Location*"
                    placeholder="Enter Location"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12}>
                  <RHFTextField
                    type='text'
                    name="aadhar_number"
                    label="Aadhar Number*"
                    inputProps={{ maxLength: 12 }}
                    placeholder="Enter Aadhar Number"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      backgroundColor: '#8280FF2E',
                      color: '#8280FF',
                      border: '1px dashed #8280FF',
                      textTransform: 'none',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '5px 20px',
                      '&:hover': { backgroundColor: '#d1c4e9' },
                    }}
                    onClick={onOpenUploadAadhar} 
                  >
                    Upload Data Here
                  </Button>
                </Grid>

                <Grid xs={12}>
                  <RHFTextField
                    type='text'
                    name="pan_number"
                    label="Pan Number*"
                    inputProps={{ maxLength: 10 }}
                    placeholder="Enter Pan Number"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      backgroundColor: '#8280FF2E',
                      color: '#8280FF',
                      border: '1px dashed #b39ddb',
                      textTransform: 'none',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '5px 20px',
                      '&:hover': { backgroundColor: '#d1c4e9' },
                    }}
                    onClick={onOpenUploadPan}
                  >
                    Upload Data Here
                  </Button>
                </Grid>

                <Grid xs={12}>
                  <RHFTextField
                    name="address"
                    label="Address*"
                    placeholder="Enter Address"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12}>
                  <RHFTextField
                    name="state"
                    label="State*"
                    placeholder="Enter State"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12}>
                  <RHFTextField
                    name="city_village"
                    label="City/Village*"
                    placeholder="Enter City/Village"
                    fullWidth
                  />
                </Grid>
                <Grid xs={12}>
                  <RHFTextField
                    name="pin_code"
                    label="Pin Code*"
                    placeholder="Enter Pin Code"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Stack direction="row" justifyContent="flex-start">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  color="primary"
                  loading={isSubmitting}
                  disabled={officerDetails !== 'NotFound' && !currentUser}
                  sx={{ borderRadius: 0.5 }}
                >
                  {userId ? 'Update' : 'Create'}
                </LoadingButton>
              </Stack>

            </Stack>
          </Grid>
        </Grid> :
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image src="/assets/images/success.png" alt="success" width={115} height={115} />
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            {userId ? 'User Updated Successfully' : 'User Created Successfully'}
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mt: 2,
              borderRadius: 5,
              padding: 1,
              backgroundColor: '#494949',
              color: 'white',
            }}
          >
            Redirecting to Role Users Page....
          </Typography>
        </Box>
      }

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAadharUpload}
        onClose={() => setOpenAadharUpload(false)}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>
          <Stack direction='row' alignItems='center' spacing={2}>
            <Image
              src="/assets/images/upload.png"
              height={30}
              width={47}
            />
            <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
              Upload Aadhar Card Images
            </Typography>
          </Stack>
        </DialogTitle>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 4 }} >
          <Stack textAlign="center">
            <RHFUploadAvatar
              name='aadhar_front'
              maxSize={3145728}
              onDrop={handleAadharFrontDrop}
            />
            <Typography variant="subtitle1" sx={{ mt: 1 }} color='text.secondary'>
              Front Side
            </Typography>

          </Stack>
          <Stack textAlign="center">
            {/* Back Card */}
            <RHFUploadAvatar
              name='aadhar_back'
              maxSize={3145728}
              onDrop={handleAadharBackDrop}
            />

            <Typography variant="subtitle1" sx={{ mt: 1 }} color='text.secondary'>
              Back Side
            </Typography>
          </Stack>
        </Box>

        <Button
          variant="contained"
          size="small"
          sx={{ alignSelf: 'center', my: 4, borderRadius: 0.5 }}
          onClick={() => {
            const aadharFront = getValues('aadhar_front');
            const aadharBack = getValues('aadhar_back');
            
            if (aadharFront && aadharBack) {
              enqueueSnackbar('Your Aadhar card is uploaded successfully!', {
                variant: 'success',
                anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
              });
              setOpenAadharUpload(false);
            } else {
              enqueueSnackbar('Please upload both front and back sides', {
                variant: 'error',
                anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
              });
            }
          }}
          disabled={!watchedAadharFront || !watchedAadharBack}
          color='primary'
        >
          Submit
        </Button>

      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openPanUpload}
        onClose={() => setOpenPanUpload(false)}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>
          <Stack direction='row' alignItems='center' spacing={2}>
            <Image
              src="/assets/images/upload.png"
              height={30}
              width={47}
            />
            <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
              Upload Pan Card Images
            </Typography>
          </Stack>
        </DialogTitle>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 4 }} >
          <Stack textAlign="center">
            <RHFUploadAvatar
              name='pan_front'
              maxSize={3145728}
              onDrop={handlePanFrontDrop}
            />
            <Typography variant="subtitle1" sx={{ mt: 1 }} color='text.secondary'>
              Front Side
            </Typography>

          </Stack>
          <Stack textAlign="center">
            {/* Back Card */}
            <RHFUploadAvatar
              name='pan_back'
              maxSize={3145728}
              onDrop={handlePanBackDrop}
            />

            <Typography variant="subtitle1" sx={{ mt: 1 }} color='text.secondary'>
              Back Side
            </Typography>
          </Stack>
        </Box>

        <Button
          variant="contained"
          size="small"
          sx={{ alignSelf: 'center', my: 4, borderRadius: 0.5 }}
          color='primary'
          onClick={() => {
            const panFront = getValues('pan_front');
            const panBack = getValues('pan_back');
            if (panFront && panBack) {
              enqueueSnackbar('PAN card uploaded successfully!', {
                variant: 'success',
                anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
              });
              setOpenPanUpload(false);
            } else {
              enqueueSnackbar('Please upload both front and back sides', {
                variant: 'error',
                anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
              });
            }
          }}
          disabled={!watchedPanFront || !watchedPanBack}
        >
          Submit
        </Button>

      </Dialog>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
      </Grid>
    </FormProvider>
  );
}
