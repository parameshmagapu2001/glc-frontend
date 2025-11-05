'use client';

import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettingsContext } from 'src/components/settings';
import { getFarmlandsAnalytics } from 'src/api/farmlands';
import { AuthContext } from 'src/auth/context';
import { paths } from 'src/routes/paths';
import RegionOfficerWidgetSummary from './intelligence-officer-widget-summary';
import RegionOfficerPageView from './intelligence-officer-page-view';
// ----------------------------------------------------------------------


const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'Good Morning!';
  if (hour >= 12 && hour < 17) return 'Good Afternoon!';
  return 'Good Evening!';
};
export default function IntelligenceOfficerView() {
  const greeting = getTimeBasedGreeting();
  const settings = useSettingsContext();
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const [farmlandAnalytics, setFarmlandAnalytics] = useState<any>([]);

  useEffect(() => {
    fetchFarmlandAnalytics();
  }
    , []);

  const fetchFarmlandAnalytics = async () => {
    try {
      const res = await getFarmlandsAnalytics();
      if (res.data) {
        setFarmlandAnalytics(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Card sx={{ width: 1, display: 'flex', alignItems: 'center', p: 3, height: '150px' }} >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight='bold'>Welcome Back!</Typography>

                <Stack direction="row" alignItems="center" spacing={3} sx={{ mt: 2, mb: 1 }}>
                  <img src="/assets/images/sun.png" width={90} alt='sun' />
                  <Typography variant="body2">Hello <span style={{ fontWeight: 'bold' }}>{user?.first_name} {user?.last_name}!</span>  <br /> <span style={{ fontWeight: 'bold' }}>{greeting}</span> </Typography>
                </Stack>

              </Box>
            </Card>
            <RegionOfficerWidgetSummary
              title="Total farmlands"
              total={farmlandAnalytics?.totalFarmlands}
              src='/assets/images/ccsaccounts.png'
              onClick={() => router.push(paths.io.allFarmlands)}
            />
            <RegionOfficerWidgetSummary
              title="Approved Farmlands"
              total={farmlandAnalytics?.approveFarmlands}
              src='/assets/images/ccsapprove.png'
              onClick={() => router.push(`${paths.io.allFarmlands}?status=approved`)}
            />
            <RegionOfficerWidgetSummary
              title="Pending Farmlands"
              total={farmlandAnalytics?.pendingFarmlands}
              src='/assets/images/ccsreject.png'
              onClick={() => router.push(`${paths.io.allFarmlands}?status=pending`)}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={12} sx={{ mt: 2 }}>
          <RegionOfficerPageView />
        </Grid>
      </Grid>
    </Container >
  );
};
