import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Chip, MenuItem, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
  RHFTextField,
  RHFSelect,
} from 'src/components/hook-form';
import { IMapping } from 'src/types/mapping';
import { getFilterStates } from 'src/api/filters';
import { IRegionRequest } from 'src/types/regions';
import { createRegion, updateRegion } from 'src/api/regions';
import Image from 'src/components/image';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// ----------------------------------------------------------------------

type Props = {
  regionId?: number;
  currentPromotion?: IRegionRequest;
};

export default function RegionNewEditForm({ regionId, currentPromotion }: Props) {

  const [states, setStates] = useState<IMapping[]>([{ id: "0", label: "Select State" }]);

  const [tags, setTags] = useState<string[]>([]);

  const [successFlag, setSuccessFlag] = useState(false);

  const router = useRouter();

  const ClusterSchema = Yup.object().shape({
    region_name: Yup.string().required('Region Name is required')
      .max(150, 'Maximum 150 characters'),
    sub_region_tags: Yup.string().optional(),
    region_status: Yup.string().required('Cluster Name is required'),
    state_id: Yup.number().required('state is required').moreThan(0, 'Select a state'),
    region_id: Yup.number().optional()
  });

  const defaultValues = useMemo(
    () => ({
      region_name: currentPromotion?.region_name || '',
      sub_region_tags: currentPromotion?.sub_region_tags || '',
      region_status: currentPromotion?.region_status || 'Active',
      state_id: currentPromotion?.state_id || 0,
      region_id: regionId
    }),
    [currentPromotion, regionId]
  );

  const methods = useForm({
    resolver: yupResolver(ClusterSchema),
    defaultValues,
  });


  const {
    handleSubmit,
    setValue,
    watch,
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

      const value = watch("sub_region_tags")?.trim() || '';
      if (value && !tags.includes(value)) {
        const updatedTags = [...tags, value];
        setTags(updatedTags);
        setValue("sub_region_tags", '');
      }
    }
  };

  const handleDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const onSubmit = handleSubmit(async (data) => {
    const isValid = Object.keys(errors).length === 0;
    if (!isValid) return;

    try {
      const value = watch("sub_region_tags")?.trim() || '';

      // Ensure the current input value is added to tags before submission
      const updatedTags = [...tags];
      if (value && !updatedTags.includes(value)) {
        updatedTags.push(value);
      }

      // Set tags state immediately before using it
      setTags(updatedTags);
      setValue("sub_region_tags", ''); // Clear input

      // Convert array to string for submission
      data.sub_region_tags = updatedTags.join(',');

      if (!data.sub_region_tags) {
        enqueueSnackbar('Sub Area Tags are required', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

      const response = regionId
        ? await updateRegion(regionId || 0, data)
        : await createRegion(data);

      if (response) {
        setSuccessFlag(true);
        setTimeout(() => {
          router.push(paths.rm.area_regions.region_view(response?.data.state_id || 0));
        }, 1000);
      }
    } catch (error) {
      setSuccessFlag(false);
      enqueueSnackbar(error.error || 'An error occurred', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
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
            <Typography variant="h6" alignItems='left'>Region</Typography>

            {/* Select State */}
            <RHFSelect
              name="state_id"
              label="Select State*"
              placeholder="Select State"
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
            <RHFTextField
              name="region_name"
              label="Enter Region Name*"
              placeholder="Godavari Region"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <RHFTextField
              name="sub_region_tags"
              label="Tag Sub Region*"
              placeholder="Godavari Region"
              InputLabelProps={{ shrink: true }}
              fullWidth
              onKeyDown={handleKeyDown}
            />

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mt: 1, maxWidth: "100%", overflow: "hidden" }}
            >
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{ borderRadius: 0.5 }}
                  onDelete={() => handleDelete(tag)} color='primary' />
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
                Create Region
              </LoadingButton>
            </Stack>
          </Box>
        </Grid>
        :
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
          <Image src="/assets/images/success.png" alt="success" width={115} height={115} />
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            Region Created Successfully!
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2, borderRadius: 5, p: 1, px: 3, backgroundColor: '#494949', color: '#fff' }}>
            Redirecting to Regions Page....
          </Typography>
        </Box>
      }
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
        {renderDetails}
      </Grid>
    </FormProvider>
  );
}
