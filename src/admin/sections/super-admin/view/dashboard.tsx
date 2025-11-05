'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import SalesOverview from '../dashboard/sales-overview';
import VisitorsOverview from '../dashboard/visitors-overview';
import FarmlandStats from '../dashboard/farmland-stats';
import PerformersChart from '../dashboard/performers-chart';
import SalesChart from '../dashboard/sales-chart';
import WebsiteVisitors from '../dashboard/website-visitors';
import SubscribersData from '../dashboard/subscribers-data';
import NavigationBar from '../dashboard/navigation-bar';

export default function SuperAdminView() {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* <TopBar /> */}

      <Box>
        <Container maxWidth={false}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={3}>
              <SalesOverview 
              totalSales={2445678}
              nriSalesPercentage={71}
              localSalesPercentage={29}/>
            </Grid>

            <Grid item xs={12} md={3}>
              <VisitorsOverview nriVisitorPercentage={71} localVisitorPercentage={29}/>
            </Grid>

            <Grid item xs={12} md={6}>
              <FarmlandStats />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={12}>

            <NavigationBar />
            
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={7.5}>
              <PerformersChart />
            </Grid>

            <Grid item xs={12} md={4.5}>
              <SalesChart />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={7.5}>
              <WebsiteVisitors />
            </Grid>

            <Grid item xs={12} md={4.5}>
              <SubscribersData />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}