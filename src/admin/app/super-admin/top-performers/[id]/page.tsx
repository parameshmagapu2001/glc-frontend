'use client';

import { Box, Stack, Typography, Link } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getAgentDetails } from 'src/api/agents';
import Image from 'src/components/image/image';
import RatingCircle from 'src/layouts/_common/RatingCircle';
import ReportOptions from 'src/sections/super-admin/top-performer/report-options';
import ReportTable from 'src/sections/super-admin/top-performer/report-table';
import { AgentDetail } from 'src/types/agent';

function TopPerformerPage() {
  const router = useRouter();
  const [activeOption, setActiveOption] = useState<'farmland' | 'sales'>('farmland');
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
      <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2, mt: 2 }}>
        <img src="/assets/images/backArrow.png" style={{ width: 12, height: 10 }} alt="Back Arrow" color='black' />
        <Link
          component="button"
          onClick={() => router.push('/super-admin')}
          color="inherit"
          underline="hover"
          sx={{ fontSize: "18px" }}
        >
          Dashboard
        </Link>
        &nbsp;/&nbsp;
        <Link
          component="button"
          onClick={() => router.push('/super-admin/top-performers')}
          color="inherit"
          underline="hover"
          sx={{ fontSize: "18px" }}
        >
          Top Performers
        </Link>
        &nbsp;/&nbsp;
        <Typography sx={{ fontWeight: "bold", color: "black", fontSize: "18px" }}>
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
            borderRadius={999}
            mx="auto"
          >
             <RatingCircle imageUrl={`${agent?.profileImage || '/assets/images/regionalOfficerCreate.png'}`} rating={4.3} />
          </Stack>
          <Typography fontSize="19px" fontWeight={600} textAlign="center" mt="12px">
            Hello {agent?.firstName} {agent?.lastName}
          </Typography>
          <Typography fontSize="14px" fontWeight={300} color="#999999" textAlign="center" mt="6px">
            {agent?.userEmail}
          </Typography>
          <ReportOptions
            activeItem={activeOption}
            setActiveItem={(item) => setActiveOption(item)}
            totalFarmlands={agent?.totalFarmlands || 0}
            totalSales={agent?.totalSales || 0}
          />
        </Box>
        <Box width="70%" height="186px" bgcolor="white" borderRadius="10px">
          <Stack direction="row" alignItems="center" height="100%" mb="30px">
            <Stack alignItems="center" width="25%" borderRight="1px solid #999999">
              <Image
                src="/assets/icons/field-officer/completed.svg"
                width={30}
                height={30}
                alt="completed"
              />
              <Typography fontSize="20px" fontWeight={600} color="#676767" mt="14px">
                45
              </Typography>
              <Typography fontSize="14px" fontWeight={600} color="#999999" mt="14px">
                Completed
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
                {agent?.pendingCount}
              </Typography>
              <Typography fontSize="14px" fontWeight={600} color="#999999" mt="14px">
                Pending
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
                {agent?.rejectedCount}
              </Typography>
              <Typography fontSize="14px" fontWeight={600} color="#999999" mt="14px">
                Rejected
              </Typography>
            </Stack>
            <Image
              src="/assets/images/fieldOfficerPerformer.png"
              width={195}
              height={177}
              alt="image"
            />
          </Stack>
          <ReportTable id={id} activeItem={activeOption} />
        </Box>
      </Stack>
    </Stack>
  );
}

export default TopPerformerPage;
