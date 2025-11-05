'use client';

import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { getAgentFarmlandReport, getFarmlandSalesReport } from 'src/api/agents';
import { TableNoData } from 'src/components/table';
import { AgentSaleReportItem } from 'src/types/agent';
import { FarmlandReportItem } from 'src/types/farmlands';

interface Props {
  activeItem: 'farmland' | 'sales';
  id: string;
}

const getStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          width="113px"
          height="27px"
          borderRadius={999}
          bgcolor="#00B69B"
        >
          <Typography fontSize="14px" color="white">
            {status}
          </Typography>
        </Stack>
      );
    case 'pending':
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          width="113px"
          height="27px"
          borderRadius={999}
          bgcolor="#FCBE2D"
        >
          <Typography fontSize="14px" color="white">
            {status}
          </Typography>
        </Stack>
      );
    case 'rejected':
    case 'closed':
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          width="113px"
          height="27px"
          borderRadius={999}
          bgcolor="#FD5454"
        >
          <Typography fontSize="14px" color="white">
            {status}
          </Typography>
        </Stack>
      );
    default:
      return <Box />;
  }
};
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10) < 4 && (day % 100 - day % 10 !== 10) ? day % 10 : 0];
  return `${day}${suffix} ${format(date, "MMM - hh.mm a")}`;
};

const FarmlandReport = ({ farmlandReport, farmLandNotFound }: { farmlandReport: FarmlandReportItem[], farmLandNotFound: boolean }) => (
  <TableContainer sx={{borderRadius:"10px"}}>
    <Table>
      <TableHead>
        <TableRow sx={{ '& > th': { backgroundColor: '#EDEAEA' , color:"#000000"} }}>
        <TableCell>Farmland ID</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Land Value</TableCell>
          <TableCell>Project Status</TableCell>
          <TableCell>Position</TableCell>
          <TableCell>Commission</TableCell>
        </TableRow>
      </TableHead>
      <TableBody sx={{ backgroundColor: 'white' }}>
        {farmlandReport.map((item) => (
          <TableRow key={item.farmlandId}>
            <TableCell>{item.farmlandCode}</TableCell>
            <TableCell>{formatDate(item.createdOn)}</TableCell>
            <TableCell>{item.landCostLabel}</TableCell>
            <TableCell>{getStatus(item.farmlandStatus)}</TableCell>
            <TableCell>{item.position || 'NA'}</TableCell>
            <TableCell>{item.commission || 'NA'}</TableCell>
          </TableRow>
        ))}
      </TableBody>

      {farmLandNotFound && (
        <TableNoData notFound={farmLandNotFound} />
      )}
    </Table>
  </TableContainer>
);

const SalesReport = ({ salesReport, salesNotFound }: { salesReport: AgentSaleReportItem[], salesNotFound: boolean }) => (
  <TableContainer sx={{borderRadius:"10px"}}>
    <Table sx={{ backgroundColor: 'white' }}>
      <TableHead>
        <TableRow sx={{ '& > th': { backgroundColor: '#EDEAEA', color:"#000000" } }}>
          <TableCell>Farmland ID</TableCell>
          <TableCell>User Name</TableCell>
          <TableCell>Mail Id</TableCell>
          <TableCell>Phone Number</TableCell>
          <TableCell>Enquiry Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {salesReport.map((item) => (
          <TableRow key={item.farmlandId}>
            <TableCell>{item.farmlandId}</TableCell>
            <TableCell>{item.agentName}</TableCell>
            <TableCell>{item.contactEmail}</TableCell>
            <TableCell>{item.contactNumber}</TableCell>
            <TableCell>{getStatus(item.leadStatus)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {salesNotFound && (
        <TableNoData notFound={salesNotFound} />
      )}
    </Table>

  </TableContainer>
);

function ReportTable({ id, activeItem }: Props) {
  const [farmlandReport, setFarmlandReport] = useState<FarmlandReportItem[]>([]);
  const [salesReport, setSalesReport] = useState<AgentSaleReportItem[]>([]);
  const [salesEmpty, setSalesEmpty] = useState(false);
  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  useEffect(() => {
    const fetchFarmlands = async () => {
      try {
        const res = await getAgentFarmlandReport(id);

        if (res.data?.length > 0) {
          setFarmlandReport(res.data);
        }
        if (res.data.length === 0) {
          setFarmlandsEmpty(true);
        } else {
          setFarmlandsEmpty(false);
        }
      } catch (err) {
        console.log('ERROR: ', err);
      }
    };

    const fetchSalesReport = async () => {
      try {
        const res = await getFarmlandSalesReport(id);
        if (res.data?.length > 0) {
          setSalesReport(res.data);
        }
        if (res.data.length === 0) {
          setSalesEmpty(true);
        } else {
          setSalesEmpty(false);
        }
      } catch (err) {
        console.log('ERROR: ', err);
      }
    };
    if (id) {
      if (activeItem === 'farmland') {
        fetchFarmlands();
      } else {
        fetchSalesReport();
      }
    }
  }, [activeItem, id]);

  const farmLandNotFound = farmlandsEmpty;
  const salesNotFound = salesEmpty;

  return (
    <Box>
      {activeItem === 'farmland' &&
        <FarmlandReport
          farmlandReport={farmlandReport}
          farmLandNotFound={farmLandNotFound}
        />}
      {activeItem === 'sales' &&
        <SalesReport
          salesReport={salesReport}
          salesNotFound={salesNotFound}
        />}
    </Box>
  );
}

export default ReportTable;
