'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Stack, Typography, Link, Divider } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { getAgentDetails } from 'src/api/agents';
import Image from 'src/components/image/image';
import { AgentDetail } from 'src/types/agent';

// Define the TypeScript interface for activity data
interface Activity {
  time: string;
  description: string;
  extraInfo?: string;
}

// Dummy Data (Replace with API data)
const activities: Activity[] = [
  { time: '6th Oct - 12:53 PM', description: 'Purchased Farmland ID: GLCSOS 01' },
  { time: '6th Oct - 12:53 PM', description: 'Shown Interest in Farmland ID: GLCSOS 02' },
  {
    time: '6th Oct - 12:53 PM',
    description: 'Subscribed to Basic Plan',
    extraInfo: '5 Views Added',
  },
  { time: '6th Oct - 12:53 PM', description: 'Shown Interest in Farmland ID: GLCSOS 01' },
  { time: '6th Oct - 12:53 PM', description: 'Unlocked Farmland ID: GLCSOS 01' },
  { time: '6th Oct - 12:53 PM', description: 'Unlocked Farmland ID: GLCSOS 01' },
  { time: '6th Oct - 12:53 PM', description: 'Shown Interest in Farmland ID: GLCSOS 01' },
  { time: '6th Oct - 12:53 PM', description: 'Shown Interest in Farmland ID: GLCSOS 01' },
];

const ViewUserDetails = () => {
  const router = useRouter();
  const [agent, setAgent] = useState<AgentDetail>();

  const pathname = usePathname();

  const id =
    pathname.split('/')?.[pathname.split('/').length - 1] ||
    pathname.split('/')?.[pathname.split('/').length - 2];

  const fetchAgent = useCallback(async () => {
    try {
      const res = await getAgentDetails(id);
      if (res.data) {
        setAgent(res.data);
      }
    } catch (err) {
      console.error("ERROR: ", err);
    }
  }, [id]);

  useEffect(() => {
    if (!Number.isNaN(id)) {
      fetchAgent();
    }
  }, [id, fetchAgent]);

  return (
    <Stack px="20px">
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, mt: 2 }}>
        <img
          src="/assets/images/backArrow.png"
          style={{ width: 12, height: 10 }}
          alt="Back Arrow"
          color="black"
        />
        <Link
          component="button"
          onClick={() => router.push('/super-admin')}
          color="inherit"
          underline="hover"
          sx={{ fontSize: '18px' }}
        >
          Dashboard
        </Link>
        &nbsp;/&nbsp;
        <Link
          component="button"
          onClick={() => router.push('/super-admin/users-details/')}
          color="inherit"
          underline="hover"
          sx={{ fontSize: '18px' }}
        >
          Users
        </Link>
        &nbsp;/&nbsp;
        <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '18px' }}>
          {agent?.firstName} {agent?.lastName}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mt="20px">
        <Box width="30%">
          <Stack
            alignItems="center"
            justifyContent="center"
            width="140px"
            height="140px"
            border="1px solid #DADEE6"
            borderRadius={999}
            mx="auto"
          >
            <Image
              src={agent?.profileImage}
              width={108}
              height={108}
              alt={agent?.firstName}
              borderRadius={999}
            />
          </Stack>
          <Typography fontSize="19px" fontWeight={600} textAlign="center" mt="12px">
            {agent?.firstName} {agent?.lastName}
          </Typography>
          <Typography fontSize="14px" fontWeight={300} color="#999999" textAlign="center" mt="6px">
            {agent?.userEmail}
          </Typography>
          <Typography fontSize="14px" fontWeight={300} color="#999999" textAlign="center" mt="6px">
            +91-9234512345
          </Typography>
        </Box>

        <Box width="70%" sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box height="186px" bgcolor="white" borderRadius="10px">
            <Stack direction="row" alignItems="center" height="100%" mb="30px">
              <Stack alignItems="center" width="25%" borderRight="1px solid #999999">
                <Image
                  src="/assets/icons/field-officer/completed.svg"
                  width={30}
                  height={30}
                  alt="completed"
                />
                <Typography fontSize="20px" fontWeight={600} color="#676767" mt="14px">
                  Basic Plan
                </Typography>
                <Typography
                  fontSize="14px"
                  fontWeight={600}
                  color="#999999"
                  mt="14px"
                  sx={{ textAlign: 'center' }}
                >
                  Subsription Active
                </Typography>
              </Stack>

              <Stack alignItems="center" width="25%" borderRight="1px solid #999999">
                <Image
                  src="/assets/images/shoppingCart.svg"
                  width={30}
                  height={30}
                  alt="completed"
                />
                <Typography fontSize="20px" fontWeight={600} color="#676767" mt="14px">
                  03
                </Typography>
                <Typography
                  fontSize="14px"
                  fontWeight={600}
                  color="#999999"
                  mt="14px"
                  sx={{ textAlign: 'center' }}
                >
                  Farmland Purchases
                </Typography>
              </Stack>

              <Stack alignItems="center" width="25%" borderRight="1px solid #999999">
                <Image
                  src="/assets/icons/field-officer/pending.svg"
                  width={30}
                  height={30}
                  alt="completed"
                />
                <Typography fontSize="20px" fontWeight={600} color="#676767" mt="14px">
                  10
                </Typography>
                <Typography
                  fontSize="14px"
                  fontWeight={600}
                  color="#999999"
                  mt="14px"
                  sx={{ textAlign: 'center' }}
                >
                  No. of Times Subscribed
                </Typography>
              </Stack>
              <Stack alignItems="center" width="25%">
                <Image
                  src="/assets/icons/field-officer/rejected.svg"
                  width={30}
                  height={30}
                  alt="completed"
                />
                <Typography fontSize="20px" fontWeight={600} color="#676767" mt="14px">
                  06
                </Typography>
                <Typography
                  fontSize="14px"
                  fontWeight={600}
                  color="#999999"
                  mt="14px"
                  sx={{ textAlign: 'center' }}
                >
                  Views Left
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: 3,
              mt: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              User Activities:
            </Typography>

            <Timeline sx={{ pl: 0, ml: '-90%' }}>
              {activities.map((activity, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot
                      color="primary"
                      variant="outlined"
                      sx={{ borderWidth: 4, width: 18, height: 18 }}
                    />
                    {index !== activities.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>

                  <TimelineContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: 6,
                        alignItems: 'center',
                        alignContent: 'center',
                        ml: 2,
                      }}
                    >
                      <Box width='20%' sx={{ display: 'flex', mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          {activity.time}
                        </Typography>
                      </Box>

                      <Box
                        width='80%'
                        sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}
                      >
                        <Typography variant="body1" fontWeight={500}>
                          {activity.description}
                        </Typography>
                        {activity.extraInfo && (
                          <Typography variant="body1" fontWeight={500}>
                            {activity.extraInfo}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Divider spanning full width */}
                    {index !== activities.length - 1 && (
                      <Divider sx={{ my: 2, width: '100%', ml: 2 }} />
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default ViewUserDetails;
