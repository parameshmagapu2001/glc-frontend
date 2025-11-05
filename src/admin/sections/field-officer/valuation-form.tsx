'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
// components
import { listRegionAreas, listStateRegions, listStates } from 'src/api/states';
import { State } from 'src/components/common/states';
import { useFieldOfficerContext } from 'src/components/field-officer/context/field-officer-context';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useSnackbar } from 'src/components/snackbar';
import { FarmlandDocuments } from 'src/types/farmlands';
// ----------------------------------------------------------------------

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
  document: FarmlandDocuments;
}

export default function ValuationForm({ document }: Props) {

  const { enqueueSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null | Date>();
  const [acquisitionCategory, setAcquisitionCategory] = useState('ancestral');
  const [agentLocation, setAgentLocation] = useState('other');
  const [selectedState, setSelectedState] = useState<{ id: string; label: string }>();
  const [selectedDistrict, setSelectedDistrict] = useState<{ id: string; label: string }>();
  const [area, setArea] = useState();
  const [agent, setAgents] = useState();
  const [landConversion, setLandConversion] = useState();
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<State[]>([]);
  const [areas, setAreas] = useState<State[]>([]);

  const fieldOfficerContext = useFieldOfficerContext();

  const methods = useForm({
    // resolver: yupResolver(LandDetailsSchema),
    defaultValues: {
      acquisitionCategory: document.documentDetails?.acquisitionCategory || '',
      agentId: document.documentDetails?.agentId || '',
      agentLocation: document.documentDetails?.agentLocation || '',
      agentName: document.documentDetails?.agentName || '',
      cityId: document.documentDetails?.cityId || '',
      cityName: document.documentDetails?.cityName || '',
      districtId: document.documentDetails?.districId || '',
      districtName: document.documentDetails?.districtName || '',
      landConversion: document.documentDetails?.landConversion || '',
      stateId: document.documentDetails?.stateId || '',
      stateName: document.documentDetails?.stateName || '',
      valuePerArea: document.documentDetails?.valuePerArea || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  // const addressType = watch('address_type', '');

  // useEffect(() => {}, [reset, setValue]);

  const getStates = async () => {
    const res = await listStates();

    if (res?.data?.length > 0) {
      setStates(res.data);
    }
  };

  const getDistricts = async (id: string) => {
    const res = await listStateRegions(id);

    if (res?.data?.length > 0) {
      setDistricts(res.data);
    }
  };

  const getAreas = async (id: string) => {
    const res = await listRegionAreas(id);

    if (res?.data?.length > 0) {
      setAreas(res.data);
    }
  };

  const handleOnStateChange = (item: { id: string; label: string }) => {
    setSelectedState(item);
    getDistricts(item.id);
  };

  const handleOnDistrictChange = (item: { id: string; label: string }) => {
    setSelectedDistrict(item);
    getAreas(item.id);
  };

  useEffect(() => {
    getStates();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    // if (isValid) {
    //   try {
    //     data.date_of_birth = selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : null;
    //     data.default_address = true;
    //     const response = await createConsumer(data);
    //     if (response.data === true) {
    //       reset();
    //       enqueueSnackbar('Consumer created successfully!');
    //       router.push(paths.rm.consumer.root);
    //       console.info('DATA', data);
    //     } else {
    //       console.error('API Error:', response.data);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     enqueueSnackbar(error.error, { variant: 'error' });
    //   }
    // }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          borderRadius: 1,
          mt: 2,
          flex: 1, // Take remaining space
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Acquisition Category */}
            <FormControl>
              <FormLabel>Please indicate the acquisition category for the land.</FormLabel>
              <RadioGroup
                value={acquisitionCategory}
                onChange={(e) => setAcquisitionCategory(e.target.value)}
                name="acquisitionCategory"
              >
                <FormControlLabel value="self" control={<Radio />} label="Self Purchase" />
                <FormControlLabel
                  value="ancestral"
                  control={<Radio />}
                  label="Ancestral Property"
                />
              </RadioGroup>
            </FormControl>

            {/* Agent Selection */}
            <FormControl>
              <FormLabel>Please select the agent who referred the customer?</FormLabel>
              <RadioGroup value={agentLocation} onChange={(e) => setAgentLocation(e.target.value)}>
                <FormControlLabel value="default" control={<Radio />} label="Default Location" />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Agent from other Location"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            <RHFSelect
              name="state"
              label="State*"
              placeholder="Select State"
              InputLabelProps={{ shrink: true }}
              value={selectedState?.id}
              onChange={(e) => handleOnStateChange(JSON.parse(e.target.value))}
            >
              <MenuItem value="0">Select State</MenuItem>
              {states.map((item) => (
                <MenuItem key={item.id} value={JSON.stringify(item)}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              name="district"
              label="District*"
              placeholder="Select District"
              InputLabelProps={{ shrink: true }}
              value={selectedDistrict}
              onChange={(e) => handleOnDistrictChange(JSON.parse(e.target.value))}
            >
              <MenuItem value="0">Select District</MenuItem>
              {districts.map((item) => (
                <MenuItem key={item.id} value={JSON.stringify(item)}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              name="area"
              label="Area/City/Town*"
              placeholder="Select Area"
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="0">Select Area</MenuItem>
              {areas.map((item) => (
                <MenuItem key={item.id} value={JSON.stringify(item)}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              name="religion"
              label="Agent*"
              placeholder="Select Agent"
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="0">Select Agent</MenuItem>
              {RELIGION_OPTIONS.map((gender) => (
                <MenuItem key={gender.id} value={gender.id}>
                  {gender.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              name="gender"
              label="Land Conversion*"
              placeholder="Select Land Conversion"
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="0">Select Land Conversion</MenuItem>
              {GENDER_OPTIONS.map((gender) => (
                <MenuItem key={gender.id} value={gender.id}>
                  {gender.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField
              name="first_name"
              label=" Value Per Area*"
              placeholder="Enter Value Per Area"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              // onClick={handleCancelClick}
              sx={{ mr: 2, borderRadius: 10 }}
            >
              Edit
            </Button>

            <Button
              type="submit"
              variant="contained"
              size="small"
              color="primary"
              sx={{ borderRadius: 10 }}
            >
              Next
            </Button>
          </Grid>
        </Stack>
      </Card>
    </FormProvider>
  );
}
