"use client"

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import SalesOverview from 'src/sections/super-admin/dashboard/sales-overview';
import VisitorsOverview from 'src/sections/super-admin/dashboard/visitors-overview';
import FarmlandStats from 'src/sections/super-admin/dashboard/farmland-stats';
import NavigationBar from 'src/sections/super-admin/dashboard/navigation-bar';
import UsersTable from 'src/sections/super-admin/users/users-table';

const Users = () => (
  <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
    <Box>
      <Container maxWidth={false}>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} md={3}>
            <SalesOverview totalSales={2445678} nriSalesPercentage={71} localSalesPercentage={29} />
          </Grid>

          <Grid item xs={12} md={3}>
            <VisitorsOverview nriVisitorPercentage={71} localVisitorPercentage={29} />
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
          <Grid item xs={12} md={12}>
            <UsersTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </Box>
);

export default Users;
