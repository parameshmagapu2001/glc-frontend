'use client';

// @mui
import Container from '@mui/material/Container';
import { Link, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
// components
import Image from 'next/image';
import { useSettingsContext } from 'src/app/admin/role-manager/components/settings';
import { useRouter } from 'src/routes/hooks';
import { getRegionDetails } from 'src/api/regions';
import { IAreaRequest } from 'src/types/area';
import { paths } from 'src/routes/paths';
import AreaNewEditForm from '../area-new-edit-form';
// ----------------------------------------------------------------------

type Props = {
  id: number;
};

export default function AreaEditView({ id }: Props) {

  const settings = useSettingsContext();

  const router = useRouter();

  const [currentPromotion, setCurrentPromotion] = useState<IAreaRequest>()

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
      <Stack direction='row' alignItems='center' spacing={1} sx={{ ml: 1 }}>
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

      <AreaNewEditForm
        currentPromotion={currentPromotion}
        areaId={currentPromotion?.area_id}
      />
    </Container>
  );
}
