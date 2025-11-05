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
import { useEffect, useState, useCallback } from 'react';
import { getAgentFarmlandReport, getFarmlandSalesReport } from 'src/api/agents';
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

const FarmlandReport = ({ farmlandReport }: { farmlandReport: FarmlandReportItem[] }) => (
  <TableContainer>
    <Table sx={{ backgroundColor: 'white' }}>
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
      <TableBody>
        {farmlandReport.map((item) => (
          <TableRow key={item.farmlandId}>
            <TableCell>{item.farmlandId}</TableCell>
            <TableCell>{item.createdOn}</TableCell>
            <TableCell>{item.landCostLabel}</TableCell>
            <TableCell>{getStatus(item.farmlandStatus)}</TableCell>
            <TableCell>website</TableCell>
            <TableCell>5,000/-</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const SalesReport = ({ salesReport }: { salesReport: AgentSaleReportItem[] }) => (
  <TableContainer>
    <Table sx={{ backgroundColor: 'white' }}>
      <TableHead>
        <TableRow sx={{ '& > th': { backgroundColor: '#EDEAEA' , color:"#000000"} }}>
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
    </Table>
  </TableContainer>
);

function ReportTable({ id, activeItem }: Props) {
  const [farmlandReport, setFarmlandReport] = useState<FarmlandReportItem[]>([]);
  const [salesReport, setSalesReport] = useState<AgentSaleReportItem[]>([]);

  const fetchFarmlands = useCallback(async () => {
    try {
      const res = await getAgentFarmlandReport(id);
      if (res.data?.length > 0) {
        console.log(res.data);
        setFarmlandReport(res.data);
      }
    } catch (err) {
      console.log('ERROR: ', err);
    }
  }, [id]);

  const fetchSalesReport = useCallback(async () => {
    try {
      const res = await getFarmlandSalesReport(id);
      if (res.data?.length > 0) {
        setSalesReport(res.data);
      }
    } catch (err) {
      console.log('ERROR: ', err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      if (activeItem === 'farmland') {
        fetchFarmlands();
      } else {
        fetchSalesReport();
      }
    }
  }, [activeItem, id, fetchFarmlands, fetchSalesReport]);

  return (
    <Box>
      {activeItem === 'farmland' && <FarmlandReport farmlandReport={farmlandReport} />}
      {activeItem === 'sales' && <SalesReport salesReport={salesReport} />}
    </Box>
  );
}

export default ReportTable;
