'use client';

import {useContext } from 'react';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { AuthContext } from 'src/auth/context';
import NotAuthorized from 'src/app/admin/role-manager/components/not-authorized/not-authorized';
// ----------------------------------------------------------------------

export default function RegionalOfficerDetailsView() {

  const { user } = useContext(AuthContext);

  const activities = [
    {
      officer: 'Shivaram (Regional Officer)',
    },
    {
      officer: 'Shivaram (Regional Officer)',
    },
  ];
  const documents = [
    { name: "Aadhaar", files: 1 },
    { name: "Pan Card", files: 1 },
  ];


  return (
    <>
      {(user?.role_id === 1 || user?.userRoles?.indexOf('ROLEP') !== -1) ?
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>

          <Card>
            <Grid container spacing={2} sx={{ p: 3 }}>
              <Grid item xs={12} md={6}>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ ml: 1 }}>
                  <img src="/assets/images/backArrow.png" style={{ width: 12, height: 10 }} alt="Back Arrow" color='black' />
                  <Typography variant="body2" color='text.primary' sx={{ p: 2 }}>Back</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle1" color='info.main' sx={{ p: 2 }}>Personal Details</Typography>
                </Stack>
                <Stack direction='row' alignItems='center' spacing={1} sx={{ ml: 1 }}>
                  <Box>
                    <img
                      src="/assets/images/person.png"
                      style={{ width: 150, height: 170 }}
                      alt="Farm Land Form"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color='text.secondary'>Name</Typography>
                    <Typography variant="body2" color='text.primary' fontWeight={600}>Venkat</Typography>
                    <Typography variant="caption" color='text.secondary'>Gender</Typography>
                    <Typography variant="body2" color='text.primary' fontWeight={600}>Male</Typography>
                    <Typography variant="caption" color='text.secondary'>Date of Birth</Typography>
                    <Typography variant="body2" color='text.primary' fontWeight={600}>August 27th, 1998</Typography>
                    <Typography variant="caption" color='text.secondary'>Nationality</Typography>
                    <Typography variant="body2" color='text.primary' fontWeight={600}>Indian</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4} mt={{ md: 5, sm: 0 }}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" color="info.main" fontWeight={600} gutterBottom>
                    Submitted Documents
                  </Typography>

                  <Stack spacing={2}>
                    {documents.map((doc, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          px: 2,
                          borderRadius: "25px",
                          bgcolor: "white",
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          width: "100%",
                          minWidth: "250px",
                        }}
                      >
                        <Typography variant="body1" fontWeight={500}>
                          {doc.name}
                        </Typography>

                        <Button
                          variant="outlined"
                          size="small"
                          color='inherit'
                          sx={{
                            borderRadius: "20px",
                            textTransform: "none",
                            fontSize: "10px",
                            px: 1.5,
                          }}
                        >
                          {doc.files} File
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>

                <Grid container spacing={2} sx={{ p: 3 }}>
                  {/* Address Section */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color='info.main' gutterBottom>
                      Address
                    </Typography>

                    <Stack spacing={1}>
                      <div>
                        <Typography variant="caption" color="text.secondary">
                          Address Line
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          Bhimavaram Road
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="caption" color="text.secondary">
                          City
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          Yeluru
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="caption" color="text.secondary">
                          State
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          Andhra Pradesh
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="caption" color="text.secondary">
                          Country
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          India
                        </Typography>
                      </div>
                    </Stack>
                  </Grid>

                  {/* Contact Details Section */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color='info.main' gutterBottom>
                      Contact Details
                    </Typography>

                    <Stack spacing={1}>
                      <div>
                        <Typography variant="caption" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          09034867656
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="caption" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          Venkat@me.com
                        </Typography>
                      </div>

                      <div>
                        <Typography variant="subtitle1" color='info.main' gutterBottom>
                          Reports To
                        </Typography>
                        <Timeline
                          sx={{
                            p: 0,
                            m: 0,
                            [`& .${timelineItemClasses.root}:before`]: {
                              flex: 0,
                              padding: 0,
                            },
                            '&::-webkit-scrollbar': {
                              display: 'none',
                            },
                          }}
                        >
                          {activities.map((activity, index) => {
                            const lastTimeline = index === activities.length - 1;

                            return (
                              <TimelineItem key={index} sx={{ minHeight: 'auto', py: 0 }}>
                                <TimelineSeparator>
                                  <TimelineDot
                                    color="primary"
                                    sx={{ transform: 'scale(0.6)' }}
                                  />
                                  {lastTimeline ? null : <TimelineConnector />}
                                </TimelineSeparator>

                                <TimelineContent sx={{ py: 0, my: 2 }}>
                                  <Typography variant="body2" color="text.primary" fontWeight={600}>
                                    {activity.officer}
                                  </Typography>
                                </TimelineContent>
                              </TimelineItem>

                            );
                          })}
                        </Timeline>
                      </div>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </Card>

        </Container >
        :
        <NotAuthorized />
      }
    </>
  );
}
