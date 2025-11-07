'use client';

import { Card, Stack, Typography } from '@mui/material';
// @mui
import Container from '@mui/material/Container';
import { useCallback } from 'react';
import Image from 'src/app/admin/role-manager/components/image';
// components
import { useSettingsContext } from 'src/app/admin/role-manager/components/settings';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function RegionAreaCreateView() {

  const settings = useSettingsContext();

  const router = useRouter();

  const goToDashboard = useCallback(() => {
    router.push(paths.rm.root);
  }, [router]);

  const createRegion = useCallback(() => {
    router.push(paths.rm.area_regions.create_region);
  }, [router]);

  const createArea = useCallback(() => {
    router.push(paths.rm.area_regions.create_area);
  }, [router]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'primary.contrastText',
        height: '100vh',
        mt: 1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ position: 'absolute', top: 20, left: 20, cursor: 'pointer' }} // Moves to top-left
        onClick={goToDashboard}
      >
        <img src="/assets/images/backArrow.png" style={{ width: 12, height: 10 }} alt="Back Arrow" />
        <Typography variant="body2" color="text.primary">Dashboard</Typography>
      </Stack>
      <Stack sx={{ p: 3, textAlign: 'center', mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }} textAlign='left' position='relative' left='30%' color='#717171'>Create Regions & Areas</Typography>
        <Container
          maxWidth={settings.themeStretch ? false : 'xl'}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={5}
            justifyContent="center"
            alignItems="center"
            m={5}
          >
            <Card sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }} onClick={createRegion}>
              <Stack direction="column" alignItems="center">
                <Image src="/assets/images/createRegion.png" height={120} width={130} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} >Region</Typography>
              </Stack>
            </Card>
            <Card sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }} onClick={createArea}>
              <Stack direction="column" alignItems="center">
                <Image src="/assets/images/createArea.png" height={120} width={130} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Area</Typography>
              </Stack>
            </Card>
          </Stack>
        </Container>
      </Stack>
    </Container>
  );
}