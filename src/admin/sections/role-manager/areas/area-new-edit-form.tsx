import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Chip, MenuItem, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from 'src/components/hook-form';
import { IMapping } from 'src/types/mapping';
import { getFilterStateRegions, getFilterStates } from 'src/api/filters';
import { IAreaRequest } from 'src/types/area';
import { createArea, updateArea } from 'src/api/areas';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import Image from 'src/components/image';
// ----------------------------------------------------------------------

type Props = {
  areaId?: number;
  currentPromotion?: IAreaRequest;
};

export default function AreaNewEditForm({ areaId, currentPromotion }: Props) {

  const [states, setStates] = useState<IMapping[]>([{ id: "0", label: "Select State" }]);

  const [tags, setTags] = useState<string[]>([]);

  const [regions, setRegions] = useState<IMapping[]>([{ id: "0", label: "Select A Region" }]);

  const [successFlag, setSuccessFlag] = useState(false);

  const router = useRouter();

  const AreaSchema = Yup.object().shape({
    area_name: Yup.string().required('Area Name is required')
      .max(150, 'Maximum 150 characters'),
    sub_area_tags: Yup.string().optional(),
    area_status: Yup.string().required('Sub Area Tags are required'),
    state_id: Yup.number().required('state is required').moreThan(0, 'Select a state'),
    region_id: Yup.number().required('Region is required').moreThan(0, 'Select a region'),
    area_id: Yup.number().optional()
  });

  const defaultValues = useMemo(
    () => ({
      area_name: currentPromotion?.area_name || '',
      sub_area_tags: currentPromotion?.sub_area_tags || '',
      area_status: currentPromotion?.area_status || 'Active',
      state_id: currentPromotion?.state_id || 0,
      region_id: currentPromotion?.region_id || 0,
      area_id: currentPromotion?.area_id || 0
    }),
    [currentPromotion]
  );

  const methods = useForm({
    resolver: yupResolver(AreaSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = methods;


  useEffect(() => {
    getStates()
  }, []);

  const getStates = async () => {
    const response = await getFilterStates();
    setStates([{ id: "0", label: "Select A State" }, ...response]);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault(); // Prevent form submission

      const value = watch("sub_area_tags")?.trim() || '';
      if (value && !tags.includes(value)) {
        const updatedTags = [...tags, value];
        setTags(updatedTags);
        setValue("sub_area_tags", '');
      }
    }
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stateId = event.target.value;
    setValue('state_id', parseInt(stateId, 10));
    trigger('state_id', { shouldFocus: false });
    getFilterRegions(parseInt(stateId, 10));
  };


  const getFilterRegions = async (stateId: number) => {
    const response = await getFilterStateRegions(stateId);
    setRegions([{ id: "0", label: "Select A Region" }, ...response]);
  }

  const handleDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleBlur = () => {
    const value = watch("sub_area_tags")?.trim() || '';

    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
      setValue("sub_area_tags", ''); // Clear the input field
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const isValid = Object.keys(errors).length === 0;
    if (!isValid) return;

    try {

      const value = watch("sub_area_tags")?.trim() || '';

      // Ensure the current input value is added to tags before submission
      const updatedTags = [...tags];
      if (value && !updatedTags.includes(value)) {
        updatedTags.push(value);
      }

      // Set tags state immediately before using it
      setTags(updatedTags);
      setValue("sub_area_tags", ''); // Clear input

      // Convert array to string for submission
      data.sub_area_tags = updatedTags.join(',');

      if (!data.sub_area_tags) {
        enqueueSnackbar('Sub Area Tags are required', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }


      const response = areaId ? await updateArea(areaId || 0, data) : await createArea(data);

      if (response) {
        setSuccessFlag(true);
        setTimeout(() => {
          router.push(paths.rm.area_regions.area_view(response?.data.state_id || 0));
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

  const renderDetails = (
    <>
      {!successFlag ?
        <Grid xs={12} md={5} lg={5}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(1, 1fr)',
            }}
          >
            <Typography variant="h6" alignItems='left'>Area</Typography>

            {/* Select State */}
            <RHFSelect
              name="state_id"
              label="Select State*"
              placeholder="Select State"
              onChange={handleStateChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            >
              {states.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {/* Enter Region Name */}
            <RHFSelect
              name="region_id"
              label="Select Region*"
              placeholder="Select Region"
              InputLabelProps={{ shrink: true }}
              fullWidth
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {/* Enter Area Name */}
            <RHFTextField
              name="area_name"
              label="Enter Area Name*"
              placeholder="Enter Area Name"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <RHFTextField
              name="sub_area_tags"
              label="Enter Sub Area Tags*"
              placeholder="Enter Sub Area Tags"
              InputLabelProps={{ shrink: true }}
              fullWidth
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            />

            {/* Display entered tags below the input */}
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mt: 1, maxWidth: "100%", overflow: "hidden" }}
            >
              {tags.map((tag) => (
                <Chip key={tag} label={tag} color='primary' onDelete={() => handleDelete(tag)} />
              ))}
            </Stack>

            {/* Submit Button */}
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton
                type="submit"
                variant="contained"
                size="medium"
                color='primary'
                loading={isSubmitting}
                sx={{ borderRadius: 0.5 }}
              >
                Create Area
              </LoadingButton>
            </Stack>
          </Box>
        </Grid> :
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
          <Image src="/assets/images/success.png" alt="success" width={115} height={115} />
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            Area Created Successfully!
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2, borderRadius: 5, p: 1, px: 3, backgroundColor: '#494949', color: '#fff' }}>
            Redirecting to Regions Page....
          </Typography>
        </Box>
      }

    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
          {renderDetails}
        </Grid>
      </FormProvider>
    </>
  );
}
