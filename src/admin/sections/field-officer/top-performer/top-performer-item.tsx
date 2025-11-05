'use client';

import { Box, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/navigation';
import Image from 'src/components/image';
import { Agent } from 'src/types/agent';

interface Props {
  item: Agent;
}

function TopPerformerItem({ item }: Props) {
  const router = useRouter();

  return (
    <>
      <Stack
        overflow="hidden"
        minWidth="264px"
        sx={{ cursor: 'pointer', borderRadius: "16px"}}
        onClick={() => router.push(`/field-officer/top-performers/${item.userId}`)}
      >
        <Stack px="14px" py="12px" bgcolor="white">
          <Typography fontWeight={600} fontSize="14px">
            {item.firstName} {item.lastName}
          </Typography>
          <Typography fontWeight={500} fontSize="12px" color="#939393">
            {item.userEmail}
          </Typography>
        </Stack>
        <Box>
          <Image src={item.profileImage ? item.profileImage : '/assets/images/regionalOfficerCreate.png'} width={264} height={154} />
        </Box>
        <Stack direction="row" alignItems="center" py="20px" bgcolor="#E6E8FD">
          <Box textAlign="center" width="50%" borderRight="1px solid #C7C7C7">
            <Typography fontSize="24px" fontWeight={700}>
              {item.totalFarmlands}
            </Typography>
            <Typography fontSize="12px" color="#A7A7A7">
              Farmlands
            </Typography>
          </Box>
          <Box textAlign="center" width="50%">
            <Typography fontSize="24px" fontWeight={700}>
              {item.totalSales}
            </Typography>
            <Typography fontSize="12px" color="#A7A7A7">
              Sale Report
            </Typography>
          </Box>
        </Stack>
        <Box py="14px" bgcolor="white">
          <Typography color="#939393" fontSize="12px" textAlign="center">
            See Full Details
          </Typography>
        </Box>
      </Stack>

      </>
  );
}

export default TopPerformerItem;
