'use client';

// @mui
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
// components
import { Link, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useSettingsContext } from 'src/components/settings';
import { IRegionRequest } from 'src/types/regions';
import { getRegionDetails } from 'src/api/regions';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import RegionNewEditForm from '../region-new-edit-form';
// ----------------------------------------------------------------------

type Props = {
  id: number;
};

export default function RegionEditView({ id }: Props) {
  const router = useRouter();

  const settings = useSettingsContext();

  const [currentPromotion, setCurrentPromotion] = useState<IRegionRequest>()

  useEffect(() => {
    fetchBannerDetails(id)
  }, [id]);

  const fetchBannerDetails = async (promotionId: number) => {
    try {
      const response = await getRegionDetails(promotionId);
      setCurrentPromotion(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 1 }}>
        <Image
          src="/assets/images/backArrow.png"
          alt="Back Arrow"
          width={12}
          height={10}
          onClick={() => router.push(paths.rm.root)}
          style={{ cursor: 'pointer' }}
        />
        <Typography variant="body2" color="text.primary" sx={{ p: 2 }}>
          <Link
            component="button"
            onClick={() => router.push(paths.rm.root)}
            color="inherit"
            underline="hover"
          >
            Dashboard
          </Link>
          &nbsp;/&nbsp;
          <Link
            component="button"
            onClick={() => router.push(paths.rm.area_regions.root)}
            color="primary"
            underline="hover"
          >
            Region
          </Link>
        </Typography>
      </Stack>

      <RegionNewEditForm
        currentPromotion={currentPromotion}
        regionId={currentPromotion?.region_id}
      />
    </Container>
  );
}
