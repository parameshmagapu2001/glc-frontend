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
import { useSettingsContext } from 'src/components/settings';
import { getFarmlandsAnalytics } from 'src/api/farmlands';
import { AuthContext } from 'src/auth/context';
import ValuationOfficerWidgetSummary from './valuation-office-widget-summary';
import ValuationOfficerApprovalsPage from './valuation-officer-approvals-page';

// ----------------------------------------------------------------------
export default function ValuationOfficerPageView() {

  const [farmlandAnalytics, setFarmlandAnalytics] = useState<any>([]);

  const settings = useSettingsContext();

  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchFarmlandAnalytics();
  }
    , []);

  const fetchFarmlandAnalytics = async () => {
    try {
      const res = await getFarmlandsAnalytics();
      if (res.data) {
        setFarmlandAnalytics(res.data);
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
                  <Typography variant="body2">Hello <span style={{ fontWeight: 'bold' }}>{user?.first_name} {user?.last_name}!</span>
                  <br /> <span style={{ fontWeight: 'bold' }}>Good Morning!</span> </Typography>

                </Stack>

              </Box>
            </Card>
            <ValuationOfficerWidgetSummary
              title="Total farmlands"
              total={farmlandAnalytics?.totalFarmlands}
              src='/assets/images/ccsaccounts.png'
            />
            <ValuationOfficerWidgetSummary
              title="Approved Farmlands"
              total={farmlandAnalytics.approvedFarmlands}
              src='/assets/images/ccsapprove.png'
            />
            <ValuationOfficerWidgetSummary
              title="In-Progress Farmlands"
              total={farmlandAnalytics.rejectedFarmlands}
              src='/assets/images/ccsreject.png'
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={12} sx={{ mt: 2 }}>
          <ValuationOfficerApprovalsPage />
        </Grid>
      </Grid>
    </Container >
  );
};
