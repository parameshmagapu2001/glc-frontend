'use client';

import { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Card, Stack, Typography } from '@mui/material';
// components
import Image from 'src/app/admin/role-manager/components/image';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { getAccountCount } from 'src/api/roles';
import AnalyticsWidgetSummary from './analytics-widget-summary';
// ----------------------------------------------------------------------

export default function AccountsView() {

  const router = useRouter();

  const [accountCount, setAccountCount] = useState<any>();

  const openCreateRegion = useCallback(() => {
    router.push(paths.rm.area_regions.create_region_area);
  }, [router]);

  const openCreateRole = useCallback(() => {
    router.push(paths.rm.roles.create_role_type_view);
  }, [router]);

  useEffect(() => {
    fetchAccountCount();
  }, []);

  const fetchAccountCount = async () => {
    try {
      const response = await getAccountCount();
      setAccountCount(response.data);
    } catch (error) {
      console.error('Error while fetching account count:', error);
    }
  };

  return (
    <Grid container spacing={3} sx={{ display: 'flex', mt: 0 }}>
      <Grid xs={12} md={8} sx={{ display: 'flex' }}>
        <Card style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ px: 3, flexGrow: 1 }}>
            <Grid xs={12} sm={6} md={4}>
              <AnalyticsWidgetSummary
                title="Total Accounts"
                total={accountCount?.total_count || 0}
                iconColor="primary"
                src="/assets/images/totalAccounts.png"
                sx={{ bgcolor: '#EDEEFC' }}
              />
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <AnalyticsWidgetSummary
                title="Accounts Created"
                total={accountCount?.active_count || 0}
                color="info"
                iconColor="success"
                src="/assets/images/accountsCreated.png"
                sx={{ bgcolor: '#EDEEFC' }}
              />
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <AnalyticsWidgetSummary
                title="Accounts Deleted"
                total={accountCount?.deleted_count || 0}
                color="secondary"
                iconColor="error"
                src="/assets/images/rejectedFarmLands.png"
                sx={{ bgcolor: '#E6F1FD' }}
              />
            </Grid>
          </Stack>
        </Card>
      </Grid>
      <Grid container spacing={2} xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ p: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>

          <Grid container spacing={2}>
            <Grid xs={12} sm={6} style={{ display: 'flex' }}>
              <Stack
                sx={{
                  flexGrow: 1,
                  backgroundColor: "#f0f0ff",
                  borderRadius: 2,
                  border: "1px dashed #a0a0ff",
                  m: 1,
                  p: 2,
                  cursor: "pointer"
                }}
                onClick={() => openCreateRegion()}
              >
                <Stack spacing={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <Image src="/assets/images/addLocation.png" alt="create region" width={30} height={25} />
                  <Typography sx={{ color: "#7a7aff", textAlign: "center" }} variant="body2">
                    Create Region / Area
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={12} sm={6} style={{ display: 'flex' }}>
              <Stack
                sx={{
                  flexGrow: 1,
                  backgroundColor: "#f0f0ff",
                  borderRadius: 2,
                  border: "1px dashed #a0a0ff",
                  m: 1,
                  p: 2,
                  cursor: "pointer"
                }}
                onClick={() => openCreateRole()}
              >
                <Stack spacing={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <Image src="/assets/images/addUser.png" alt="add user" width={25} height={25} />
                  <Typography sx={{ color: "#7a7aff", textAlign: "center" }} variant="body2">
                    Create User Role
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
