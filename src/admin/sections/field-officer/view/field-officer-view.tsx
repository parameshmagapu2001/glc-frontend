'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { listTopPerformers } from 'src/api/agents';
import { getFarmlandsAnalytics } from 'src/api/farmlands';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import CustomTabs from 'src/components/tab/customTabs';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { Agent } from 'src/types/agent';
import { FarmlandAnalytics } from 'src/types/farmlands';
import { getFarmlandAlerts, getFarmlands } from 'src/api/region-officer';
import { AuthContext } from 'src/auth/context';
import RequestInfoListView from './request-info-list-view';
import DraftListView from './draft-list-view';
import FarmlandAlertsListView from './farmland-alerts-list-view';
import FarmlandListView from './farmland-list-view';
// ----------------------------------------------------------------------

const FieldOfficerView = () => {
  const router = useRouter();

  const settings = useSettingsContext();

  const [alertCount, setAlertCount] = useState(0);

  const [requestedCount, setRequestedCount] = useState(0);

  const [draftsCount, setDraftsCount] = useState(0);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchFarmlandAlerts();
    fetchDraftFarmlands();
    fetchRequestedFarmlands();
  }, []);

  const fetchFarmlandAlerts = async () => {
    const farmlandData = {
      searchKey: null,
      status: 'All',
      pageNumber: 1,
      pageSize: 5,
    };
    try {
      const response = await getFarmlandAlerts(farmlandData);
      const { totalRecords } = response.data;
      setAlertCount(totalRecords);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDraftFarmlands = async () => {
    const farmlandData = {
      searchKey: null,
      status: 'Draft',
      pageNumber: 1,
      pageSize: 5,
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { totalRecords } = response.data;
      setDraftsCount(totalRecords);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchRequestedFarmlands = async () => {
    const farmlandData = {
      searchKey: null,
      status: 'Returned',
      pageNumber: 1,
      pageSize: 5,
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { totalRecords } = response.data;
      setRequestedCount(totalRecords);
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    {
      value: 'FarmlandAlerts',
      label: 'Farmland Alerts',
      count: alertCount,
    },
    {
      value: 'RequestedInfo',
      label: 'Requested Info',
      count: requestedCount,
    },
    {
      value: 'Draft',
      label: 'Drafts',
      count: draftsCount,
    },
    {
      value: 'FarmlandsList',
      label: 'Farmlands List',
      count: 0,
    },
  ];

  const [currentTab, setCurrentTab] = useState<string>('FarmlandAlerts');

  const [agents, setAgents] = useState<Agent[]>([]);

  const [analytics, setAnalytics] = useState<FarmlandAnalytics>();

  function getOrdinal(n: number) {
    if (n % 100 > 10 && n % 100 < 14) {
      return 'th';
    }
    switch (n % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  const addFarmland = () => {
    router.push(paths.fo.newFarmLand(0));
  };

  const fetchTopPerformers = async () => {
    try {
      const res = await listTopPerformers();

      setAgents(res.data?.topAgents || []);
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  const fetchFarmlandAnalytics = async () => {
    try {
      const res = await getFarmlandsAnalytics();

      if (res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  useEffect(() => {
    fetchTopPerformers();
    fetchFarmlandAnalytics();
  }, []);

  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 0 && currentHour < 12) {
      return "Good Morning!";
    }
    if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon!";
    }
    return "Good Evening!";
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid item xs={8} md={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
            <Card sx={{ alignItems: 'center', borderRadius: 1, px: 2 }}>
              <CustomTabs tabs={tabs} currentTab={currentTab} onChange={setCurrentTab} />
            </Card>
            <Stack sx={{ flex: 1 }}>
              {currentTab === 'FarmlandAlerts' && <FarmlandAlertsListView />}
              {currentTab === 'RequestedInfo' && <RequestInfoListView />}
              {currentTab === 'Draft' && <DraftListView />}
              {currentTab === 'FarmlandsList' && <FarmlandListView />}
            </Stack>

            <Grid container>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 1 }}>
                  <Grid container sx={{ mt: 2 }}>
                    <Grid
                      item
                      xs={2}
                      md={1.5}
                      sx={{ borderRight: (theme) => `1px solid ${theme.palette.divider}`, px: 2 }}
                    >
                      <Stack sx={{ mt: 0 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: '11px', md: '13px', lg: '15px' },
                            fontWeight: 'medium',
                          }}
                        >
                          Total Agents
                        </Typography>
                        <Typography
                          fontWeight="bold"
                          sx={{
                            fontSize: { xs: '14px', md: '16px', lg: '18px' },
                            color: '#163BF5',
                          }}
                        >
                          {agents.length}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: 3,
                            minWidth: 0,
                            width: { xs: '50px', md: '60px', lg: '70px' },
                            fontSize: { xs: '11px', md: '13px', lg: '15px' },
                          }}
                          color="primary"
                          // size='medium'
                          onClick={() => router.push('/field-officer/top-performers')}
                        >
                          View
                        </Button>
                      </Stack>
                    </Grid>

                    <Grid item xs={10} md={10.5}>
                      <Box sx={{ overflowX: 'auto' }}>
                        <Stack
                          direction="row"
                          spacing={3}
                          alignItems="center"
                          sx={{ ml: 2, minWidth: 'fit-content', pb: 1 }}
                        >
                          <Image
                            src="/assets/images/topPerformers.png"
                            style={{ width: 100, height: 90, marginTop: -16 }}
                            alt="Top Performers"
                          />
                          {agents.map((agent, index) => (
                            <Box key={index}>
                              <Stack alignItems="center">
                                <Avatar
                                  src={agent.profileImage}
                                  alt={agent.firstName}
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    border: '3px solid #1D7ABE',
                                    boxShadow: 2,
                                  }}
                                />
                                <Typography
                                  sx={{ fontSize: { xs: '12px', md: '15px', lg: '18px' } }}
                                  fontWeight="bold"
                                >
                                  {`${agent.agentRank}${getOrdinal(agent.agentRank)}`}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: { xs: '10px', md: '10px', lg: '12px' } }}
                                >
                                  {agent.firstName}
                                </Typography>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={4} md={3}>
          <Card sx={{ height: '100%', alignItems: 'center', borderRadius: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2} textAlign="center">
                <Stack textAlign="end">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Typography variant="body2" component="div" gutterBottom>
                      hello
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight="bold">
                      {user?.first_name} {user?.last_name}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Welcome back, {getTimeBasedGreeting()}
                  </Typography>
                </Stack>

                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    objectFit: 'cover',
                    height: {
                      xs: 150, 
                      sm: 285,
                      md: 220, 
                      lg: 240, 
                      xl: 260, 
                    },
                  }}
                  alt="Farmland"
                  src="/assets/images/farm.png"
                />

                <Stack spacing={2}>
                  <Card sx={{ borderRadius: 1 }}>
                    <Stack
                      m={2}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      px={1}
                      sx={{ borderLeft: (theme) => `3px solid ${theme.palette.primary.dark}` }}
                    >
                      <Stack sx={{ p: 1, borderRadius: 10, backgroundColor: 'primary.lighter' }}>
                        <Box
                          component="img"
                          src="/assets/images/totalFarmLands.png"
                          alt="Total Farmlands"
                          sx={{ width: 20, height: 20 }}
                        />
                      </Stack>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontSize="10px">
                          Total Farmlands
                        </Typography>
                        <Typography variant="subtitle1" component="div" color="primary.dark">
                          {analytics?.totalFarmlands || 0}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>

                  <Card sx={{ borderRadius: 1 }}>
                    <Stack
                      m={2}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      px={1}
                      sx={{ borderLeft: (theme) => `3px solid ${theme.palette.success.dark}` }}
                    >
                      <Stack sx={{ p: 1, borderRadius: 10, backgroundColor: 'success.lighter' }}>
                        <Box
                          component="img"
                          src="/assets/images/approvedFarmLands.png"
                          alt="Approved Farmlands"
                          sx={{ width: 20, height: 20 }}
                        />
                      </Stack>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontSize="10px">
                          Approved Farmlands
                        </Typography>
                        <Typography variant="subtitle1" component="div" color="success.dark">
                          {analytics?.approveFarmlands || 0}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>

                  <Card sx={{ borderRadius: 1 }}>
                    <Stack
                      m={2}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      px={1}
                      sx={{ borderLeft: (theme) => `3px solid ${theme.palette.error.dark}` }}
                    >
                      <Stack sx={{ p: 1, borderRadius: 10, backgroundColor: 'error.lighter' }}>
                        <Box
                          component="img"
                          src="/assets/images/rejectedFarmLands.png"
                          alt="Rejected Farmlands"
                          sx={{ width: 20, height: 20 }}
                        />
                      </Stack>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontSize="10px">
                          Rejected Farmlands
                        </Typography>
                        <Typography variant="subtitle1" component="div" color="error.dark">
                          {analytics?.rejectedFarmlands || 0}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Stack>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    mt: 1,
                    py: 1.5,
                    fontSize: {
                      xs: '0.875rem', 
                      sm: '0.775rem', 
                      md: '0.9375rem',
                    },
                  }}
                  onClick={addFarmland}
                >
                  Add Farmland
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FieldOfficerView;
