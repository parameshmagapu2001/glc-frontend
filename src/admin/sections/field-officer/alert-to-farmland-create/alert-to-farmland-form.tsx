import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'src/routes/hooks';
import { createFarmland, dismissFarmland } from 'src/api/farmlands';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useBoolean } from 'src/hooks/use-boolean';
import { usePopover } from 'src/components/custom-popover';
import { paths } from 'src/routes/paths';
import { IFarmlandAlert } from 'src/types/farmlands';
import { OwnerSchema } from 'src/utils/schema';
import CommentDialog from 'src/components/custom-dialog/comment-dialog';
import GoogleLocationViewer from '../googleLocationViewer';

const GENDER_OPTIONS = [
  { id: 'M', label: 'Male' },
  { id: 'F', label: 'Female' },
  { id: 'O', label: 'Other' },
];

const RELIGION_OPTIONS = [
  { id: 'Hindu', label: 'Hindu' },
  { id: 'Muslim', label: 'Muslim' },
  { id: 'Christian', label: 'Christian' },
  { id: 'Sikh', label: 'Sikh' },
  { id: 'Buddhist', label: 'Buddhist' },
  { id: 'Jain', label: 'Jain' },
  { id: 'Other', label: 'Other' },
];

interface Props {
  selectedFarmland: IFarmlandAlert;
  isCompleted: boolean;
}

function AlertToFarmLandFarm({ selectedFarmland, isCompleted }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null | Date>();

  const router = useRouter();

  const confirm = useBoolean();

  const popover = usePopover();

  const methods = useForm({
    resolver: yupResolver(OwnerSchema),
    defaultValues: {
      firstName: selectedFarmland?.firstName || '',
      lastName: selectedFarmland?.lastName || '',
      phoneNumber: selectedFarmland?.contactNumber || '',
      email: selectedFarmland?.contactEmail || '',
      religion: selectedFarmland?.religion || '',
      gender: selectedFarmland?.gender || '',
      latitude: selectedFarmland?.landLatitude || '',
      longitude: selectedFarmland?.landLongitude || '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!isCompleted) {
      const response = await createFarmland({
        firstName: data.firstName,
        lastName: data.lastName,
        contactNumber: data.phoneNumber,
        contactMail: data.email,
        dob: selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB') : '',
        religion: data.religion,
        gender: data.gender,
        landCost: 0,
        landLatitude: data.latitude,
        landLongitude: data.longitude,
        alertId: selectedFarmland?.alertId || 0,
      });
      if (response.data) {
        enqueueSnackbar('Farmland created Successfully', {
          variant: 'success',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        });
        router.push(paths.fo.documents(response.data.farmlandId));
      }
    }
  });

  const onDismiss = async (val: string) => {
    if (!val) {
      enqueueSnackbar('Please provide the reason to dismiss', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      return;
    }
    if (val.length < 10) {
      enqueueSnackbar('Please provide a valid reason to dismiss', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      return;
    }
    popover.onClose();
    confirm.onFalse();
    const response = await dismissFarmland(selectedFarmland?.alertId || 0, val);
    if (response.data) {
      enqueueSnackbar('Farmland Alert Dismissed', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      router.push(paths.fo.root);
    }
  };

  useEffect(() => {
    if (selectedFarmland && selectedFarmland?.dob) {
      const dob = selectedFarmland.dob; // Assuming it's in "dd/mm/yyyy" format
      const [day, month, year] = dob.split('/'); // Split into parts
      const formattedDate = new Date(`${month}/${day}/${year}`);
      setSelectedDate(formattedDate);
    }
  }, [selectedFarmland]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            borderRadius: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField
                label="First Name*"
                placeholder="Enter First Name"
                InputLabelProps={{ shrink: true }}
                name="firstName"
                type='text'
              />

              <RHFTextField
                label="Last Name*"
                placeholder="Enter Last Name"
                InputLabelProps={{ shrink: true }}
                name="lastName"
                type='text'
              />

              <RHFTextField
                label="Phone Number*"
                placeholder="Enter Phone Number"
                InputLabelProps={{ shrink: true }}
                name="phoneNumber"
                type='number'
              />

              <RHFTextField
                label="Email*"
                placeholder="Enter Email"
                InputLabelProps={{ shrink: true }}
                name="email"
                type='email'
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <DatePicker
                  orientation="portrait"
                  label="Date Of Birth"
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                  maxDate={new Date()}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'none',
                    },
                  }}
                />
              </Stack>

              <RHFSelect
                label="Religion*"
                placeholder="Select Religion"
                InputLabelProps={{ shrink: true }}
                name="religion"
              >
                <MenuItem value="0">Select Religion</MenuItem>
                {RELIGION_OPTIONS.map((gender) => (
                  <MenuItem key={gender.id} value={gender.id}>
                    {gender.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                label="Gender*"
                placeholder="Select Address Type"
                InputLabelProps={{ shrink: true }}
                name="gender"
              >
                <MenuItem value="0">Select Gender</MenuItem>
                {GENDER_OPTIONS.map((gender) => (
                  <MenuItem key={gender.id} value={gender.id}>
                    {gender.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Stack>
              <Box>
                <GoogleLocationViewer
                  onLocationChange={(lat, lng) => {
                    methods.setValue('latitude', lat.toString());
                    methods.setValue('longitude', lng.toString());
                  }}
                  initialLatitude={methods.watch('latitude')}
                  initialLongitude={methods.watch('longitude')}
                />
              </Box>
            </Stack>

            <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {selectedFarmland?.alertId && (
                <Button
                  variant="outlined"
                  color="inherit"
                  size="medium"
                  onClick={() => {
                    confirm.onTrue();
                    popover.onClose();
                  }}
                  sx={{ mr: 2, borderRadius: 10, mt: 13 }}
                >
                  Dismiss
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                size="medium"
                color="primary"
                sx={{ borderRadius: 10, mt: 13 }}
                onClick={onSubmit}
              >
                Create
              </Button>
            </Grid>
          </Stack>
        </Card>
      </FormProvider>
      <CommentDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Dismiss Reason"
        content="Please provide the reason to dismiss"
        btnTitle="Submit"
        onSubmit={(val) => {
          onDismiss(val);
        }}
        submitButtonStatus={selectedFarmland.alertStatus !== 'Dismissed'}
        readonlyStatus={selectedFarmland.alertStatus === 'Dismissed'}
        comment={selectedFarmland.dismissReason || ''}
      />
    </>
  );
}

export default AlertToFarmLandFarm;
