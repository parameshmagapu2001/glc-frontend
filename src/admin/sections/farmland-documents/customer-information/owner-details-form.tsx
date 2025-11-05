import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  Grid,
  InputAdornment,
  InputBase,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { parse } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { fetchDocumentDetails, saveFarmlandDocument } from 'src/api/farmlands';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { OwnerSchema } from 'src/utils/schema';
import { useBoolean } from 'src/hooks/use-boolean';
import GoogleLocationViewer from 'src/sections/field-officer/googleLocationViewer';
import TimelineButtonView from '../timeline-buttons';


// -----------------------------------------------------------------

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
  farmlandId: number;
  documentIndex: number;
  document: any;
  onNext: (index: number) => void;
}

function OwnerDetailsForm({ farmlandId, onNext, documentIndex, document }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null | Date>();

  const [ownerDetails, setOwnerDetails] = useState<any>(document?.documentDetails);

  const [editable, setEditable] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const [cancelButton, setCancelButton] = useState(false);

  const [timelineViewStatus, setTimelineViewStatus] = useState(false);

  const [activeView, setActiveView] = useState(timelineViewStatus ? 'timeline' : 'file');

  const confirm = useBoolean();

  const methods = useForm({
    resolver: yupResolver(OwnerSchema),
    defaultValues: {
      firstName: ownerDetails?.firstName || '',
      lastName: ownerDetails?.lastName || '',
      phoneNumber: ownerDetails?.contactNumber || '',
      email: ownerDetails?.contactMail || '',
      religion: ownerDetails?.religion || '',
      gender: ownerDetails?.gender || '',
      latitude: ownerDetails?.landLatitude || '',
      longitude: ownerDetails?.landLongitude || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const setEditMode = async () => {
    setEditable(true);
    setCancelButton(true);
  };

  const onCancelEdit = async () => {
    setEditable(false);
    setCancelButton(false);
  };

  const onSave = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const farmData = {
        firstName: data.firstName,
        lastName: data.lastName,
        contactNumber: data.phoneNumber,
        contactMail: data.email,
        dob: selectedDate?.toLocaleString() || '',
        religion: data.religion,
        gender: data.gender,
        landCost: 0,
        landLatitude: data.latitude,
        landLongitude: data.longitude,
      };
      await saveFarmlandDocument(farmlandId, document.documentId, farmData);
      enqueueSnackbar('Land details have been saved to drafts', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      });
      await refreshDocumentData();
      setEditable(false);
    } catch (err) {
      console.error('Failed to save document:', err);
    } finally {
      setLoading(false);
    }
  });

  const refreshDocumentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentDetails(farmlandId, document.documentId);
      setOwnerDetails(res.data.documentDetails);
    } catch (err) {
      console.log('ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [farmlandId, document.documentId]);

  useEffect(() => {
    if (ownerDetails?.dob) {
      const parsedDate = parse(ownerDetails.dob, 'dd/MM/yyyy', new Date());
      setSelectedDate(parsedDate);
    }
  }, [ownerDetails, farmlandId, document.documentId]);

  const renderButtons = () => {
    const { reviewStatus, approveAccess, editAccess } = document;
    if (reviewStatus === 'Approved' || reviewStatus === 'Rejected') {
      return (
        <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            sx={{ mr: 2, borderRadius: 10 }}
            disabled={documentIndex === 0}
            onClick={() => onNext(documentIndex - 1)}
          >
            {' '}
            Back{' '}
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            sx={{ borderRadius: 10 }}
            onClick={() => onNext(documentIndex + 1)}
          >
            Next
          </Button>
        </Grid>
      );
    }

    if (reviewStatus === 'Pending') {
      if (!approveAccess) {
        return (
          <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!editable ? (
              <>
                {editAccess ? (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="medium"
                    sx={{ mr: 2, borderRadius: 10 }}
                    onClick={setEditMode}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="medium"
                    sx={{ mr: 2, borderRadius: 10 }}
                    disabled={documentIndex === 0}
                    onClick={() => onNext(documentIndex - 1)}
                  >
                    {' '}
                    Back{' '}
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{ borderRadius: 10 }}
                  onClick={() => onNext(documentIndex + 1)}
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                {cancelButton && (
                  <Button
                    variant="outlined"
                    size="medium"
                    color="error"
                    sx={{ mr: 2, borderRadius: 10 }}
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{ borderRadius: 10 }}
                  onClick={onSave}
                >
                  Save
                </Button>
              </>
            )}
          </Grid>
        );
      }

      return (
        <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            sx={{ mr: 2, borderRadius: 10 }}
            disabled={documentIndex === 0}
            onClick={() => onNext(documentIndex - 1)}
          >
            {' '}
            Back{' '}
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            sx={{ borderRadius: 10 }}
            onClick={() => onNext(documentIndex + 1)}
          >
            Next
          </Button>
        </Grid>
      );
    }
    return null;
  };

  const handleButtonClick = (button: string) => {
    setActiveView(button);
  };

  return (
    <>
      {timelineViewStatus && (
        <TimelineButtonView
          handleButtonClick={handleButtonClick}
          setActiveView={setActiveView}
          activeView={activeView} />
      )}

      {activeView === 'file' && (
        <FormProvider methods={methods} onSubmit={() => onSave}>
          <Card
            sx={{
              borderRadius: 1,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Stack spacing={3} sx={{ p: 3, height: '100%' }}>
              <Stack spacing={3} sx={{ py: 3, height: '100%' }}>
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
                    InputProps={{
                      readOnly: !editable,
                    }}
                  />

                  <RHFTextField
                    label="Last Name*"
                    placeholder="Enter Last Name"
                    InputLabelProps={{ shrink: true }}
                    name="lastName"
                    InputProps={{
                      readOnly: !editable,
                    }}
                  />

                  <RHFTextField
                    label="Phone Number*"
                    placeholder="Enter Phone Number"
                    InputLabelProps={{ shrink: true }}
                    name="phoneNumber"
                    InputProps={{
                      readOnly: !editable,
                    }}
                  />

                  <RHFTextField
                    label="Email*"
                    placeholder="Enter Email"
                    InputLabelProps={{ shrink: true }}
                    name="email"
                    InputProps={{
                      readOnly: !editable,
                    }}
                  />

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <DatePicker
                      orientation="portrait"
                      label="Date Of Birth"
                      value={selectedDate}
                      onChange={(newValue) => {
                        setSelectedDate(newValue);
                      }}
                      format="dd/MM/yyyy"
                      maxDate={new Date()}
                      disabled={!editable}
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
                    InputProps={{
                      readOnly: !editable,
                    }}
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
                    placeholder="Select Gender"
                    InputLabelProps={{ shrink: true }}
                    name="gender"
                    InputProps={{
                      readOnly: !editable,
                    }}
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
                  <Typography variant="subtitle1" fontWeight="bold">
                    Google Location of Land
                  </Typography>
                  <Box mt={1}>
                    {editable ? (
                      <GoogleLocationViewer
                        onLocationChange={(lat, lng) => {
                          methods.setValue('latitude', lat.toString());
                          methods.setValue('longitude', lng.toString());
                        }}
                        initialLatitude={methods.watch('latitude')}
                        initialLongitude={methods.watch('longitude')}

                      />
                    ) : (
                      <InputBase
                        value={
                          methods.watch('latitude') && methods.watch('longitude')
                            ? `${parseFloat(methods.watch('latitude')).toFixed(7)}, ${parseFloat(
                              methods.watch('longitude')
                            ).toFixed(7)}`
                            : 'Add Google Location'
                        }
                        readOnly
                        startAdornment={
                          <InputAdornment position="start">
                            <Image
                              src="/assets/images/mapIcon.svg"
                              alt="map-icon"
                              width={20}
                              height={20}
                            />
                          </InputAdornment>
                        }
                        sx={{
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          px: 1.5,
                          py: 1,
                          fontSize: '16px',
                          fontFamily: 'poppins',
                          width: '270px',
                          color:
                            methods.watch('latitude') && methods.watch('longitude')
                              ? '#1D7ABE'
                              : '#666',
                          fontWeight:
                            methods.watch('latitude') && methods.watch('longitude') ? 600 : 400,
                        }}
                      />
                    )}
                  </Box>
                </Stack>
              </Stack>
              {renderButtons()}
            </Stack>
          </Card>
        </FormProvider>
      )}
    </>
  );
}

export default OwnerDetailsForm;
