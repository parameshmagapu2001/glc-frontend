'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  Grid,
  Divider,
  styled,
  Container,
  Link,
  Stack,
  Paper,
  Button,
  TableRow,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import CustomPagination from '../common-layout/pagination';
import MarkAsSoldModal from './sold-modal';
import CommentDetailsModal from './comment-modal';

// Types
interface VisitorData {
  name: string;
  email: string;
  phone: string;
  date: string;
  action: string;
  comments?: string;
  subscription: string;
  avatar: string;
}

interface StatsCardProps {
  icon: string;
  count: string;
  label: string;
}

interface UserDetails {
  id: number;
  name: string;
  email: string;
  role?: string;
}

// Interface for the CommentDetailsModal component props
export interface CommentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  date: string;
  time: string;
  status: string;
  subscription: string;
  comments: Comment[];
  userDetails: UserDetails;
}

export interface Comment {
  action: string;
  description: string;
  date: string;
  status: "completed" | "pending" | "inactive";
}

const comments: Comment[] = [
  {
    action: "Requested an Enquiry by User",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: "21-02-2024, 04:30 AM",
    status: "completed",
  },
  {
    action: "Responded by CCS Team",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: "21-02-2024, 04:30 AM",
    status: "completed",
  },
  {
    action: "User not responded to CCS Team",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: "21-02-2024, 04:30 AM",
    status: "pending",
  },
  {
    action: "User Responded to CCS Team",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: "21-02-2024, 04:30 AM",
    status: "completed",
  },
];

const userDetails = {
  name: "Varma",
  mobile: "+91-9245279149",
  email: "varma@gmail.com",
  plan: "Basic",
};

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: 'white',
  padding: theme.spacing(0.5, 8),
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5, 2.5),
  },
}));

const TabContainer = styled(Paper)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  width: "100%",
  height: "43px",
  padding: "5px",
  borderRadius: "30px",
  boxShadow: "none",
  gap: "10px",
});

const TabButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
  fontSize: "14px",
  fontWeight: active ? 600 : 400,
  color: active ? "white" : "#666",
  backgroundColor: active ? "#7A6BF5" : "transparent",
  textTransform: "none",
  borderRadius: "30px",
  height: "40px",
  width: "100%",
  "&:hover": {
    backgroundColor: active ? "#7A6BF5" : "transparent",
  },
}));

// Mock Data
const visitors: VisitorData[] = [
  {
    name: 'Varma',
    email: 'varma@gmail.com',
    phone: '+91-9245279149',
    date: '3rd Oct - 04.13 PM',
    action: 'Requested An Enquiry',
    comments: 'Lorem ipsum dolor...',
    subscription: 'Subscribed',
    avatar:
      "https://randomuser.me/api/portraits/men/1.jpg",
  },
  { name: 'Krishna', email: 'krishna24@gmail.com', phone: '+91-9245279149', date: '3rd Oct - 04.13 PM', action: 'Requested An Enquiry', comments: 'Lorem ipsum dolor...', subscription: 'Subscribed', avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: 'Harish', email: 'harish18@gmail.com', phone: '+91-9245279149', date: '3rd Oct - 04.13 PM', action: 'Visited', comments: 'NA', subscription: 'NA', avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { name: 'Mohan', email: 'mohan@gmail.com', phone: '+91-9245279149', date: '3rd Oct - 04.13 PM', action: 'Requested An Enquiry', comments: 'Lorem ipsum dolor...', subscription: 'Subscribed', avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { name: 'Paramesh', email: 'paramesh@gmail.com', phone: '+91-9245279149', date: '3rd Oct - 04.13 PM', action: 'Requested An Enquiry', comments: 'Lorem ipsum dolor...', subscription: 'Subscribed', avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
  { name: 'Hemanth', email: 'hemanth@gmail.com', phone: '+91-9245279149', date: '3rd Oct - 04.13 PM', action: 'Documents Unlocked', comments: 'NA', subscription: 'Subscribed', avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
  { name: 'K Mohan', email: 'krmohan@gmail.com', phone: '+91-9245279149', date: '3rd Oct - 04.13 PM', action: 'Visited', comments: 'NA', subscription: 'NA', avatar: "https://randomuser.me/api/portraits/men/7.jpg" },
  { name: 'Zameer', email: 'zameert@gmail.com', phone: '+91-9245279149', date: '3rd Oct - 04.13 PM', action: 'Documents Unlocked', comments: 'NA', subscription: 'Subscribed', avatar: "https://randomuser.me/api/portraits/men/8.jpg" }
  // Add more visitor data as needed
];

const statsCards: StatsCardProps[] = [
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3d6b31fe0921d56a2f73ce40f46aab230a8b6c30a6e7c055c5f2a254ccafa831?placeholderIfAbsent=true',
    count: '45',
    label: 'Total Visitors',
  },
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0d8e399356ac32ca294af61f9b13a6ec7ca2f37a09793b36d21c07a58a6a86c8?placeholderIfAbsent=true',
    count: '14',
    label: 'Documents Unlocked',
  },
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1e6b7f60cb4e4df2b011813a0480af91c16204203ad12025c7d0c072e05d8b59?placeholderIfAbsent=true',
    count: '06',
    label: 'Purchase Requests',
  },
];

export default function FarmlandsStatsDetails() {
  const router = useRouter();

  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const [filter, setFilter] = useState("All");

  const [openComment, setOpenComment] = useState(false);
  // Search text
  const [searchText] = useState('');

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  // Determine active tab based on current route
  const activeTab = pathname.includes("farmlands-stats") ? "Website" : "Agent";

  const handleClickButton = (tab: string) => {
    if (tab === "Website") {
      router.push('/super-admin/farmlands-stats');
    } else {
      router.push('/super-admin/farmlands-agent');
    }
  };

  const filteredData = visitors.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: 'rgba(245, 246, 247, 1)', minHeight: '100vh', pb: 3 }}>
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={8} md={9}>
            <Stack direction='row' alignItems='center' spacing={1} sx={{ ml: 1, mb: 2 }}>
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
              <Typography
                sx={{ fontWeight: "bold", color: "black", fontSize: "18px" }}
              >
                Stats
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <Box display="flex" pt={0.5} sx={{ backgroundColor: "#FFFFFF", width: "100%", height: '51px', borderRadius: "30px", mb: 2 }}>
              <TabContainer>
                <TabButton
                  active={activeTab === "Website"}
                  onClick={() => handleClickButton("Website")}
                >
                  Website
                </TabButton>
                <TabButton
                  active={activeTab === "Agent"}
                  onClick={() => handleClickButton("Agent")}
                >
                  Agent
                </TabButton>
              </TabContainer>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7fddb875418bf05ed16cde471836bf1c9b6768cf1a905adc32ff1854380733c7?placeholderIfAbsent=true"
                sx={{
                  width: 139,
                  height: 139,
                  border: '1px solid rgba(218, 222, 230, 1)',
                  p: 1,
                }}
              />
              <Typography variant="h6" sx={{ color: 'rgba(103, 103, 103, 1)', fontWeight: 600 }}>
                GLCSOS 01
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(153, 153, 153, 1)' }}>
                East Godavari, AP
              </Typography>
              <Button
                sx={{
                  bgcolor: 'rgba(130, 128, 255, 1)',
                  color: 'white',
                  borderRadius: '30px',
                  px: 5,
                  py: 2,
                  mt: 2,
                  cursor: 'pointer',
                  ":hover": { bgcolor: 'rgba(130, 128, 255, 1)' }
                }}
                onClick={() => setOpen(true)}
              >
                Mark as Sold
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <StatsCard sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: 'flex', gap: 5 }}>
                {statsCards.map((stat, index) => (
                  <React.Fragment key={stat.label}>
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
                    >
                      <Box component="img" src={stat.icon} sx={{ width: 31, height: 31 }} />
                      <Typography
                        variant="h6"
                        sx={{ color: 'rgba(103, 103, 103, 1)', fontWeight: 600 }}
                      >
                        {stat.count}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(153, 153, 153, 1)' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                    {index < statsCards.length - 1 && (
                      <Divider orientation="vertical" sx={{ height: 110, mx: 2 }} />
                    )}
                  </React.Fragment>
                ))}
              </Box>

              <Box
                component="img"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/cfb6a432cd678122cb6ed12ae32427334def48ad5929e5a1ab7915a8d7b37f62?placeholderIfAbsent=true"
                sx={{ width: 195, height: 177, borderRadius: 2 }}
              />
            </StatsCard>

            <Box sx={{ width: '100%', overflow: 'hidden', p: 2, bgcolor: '#FFFFFF', borderRadius: 2, mt: 4 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexWrap: 'wrap',
                mb: 2,
                gap: 2,
              }}>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{ backgroundColor: "#fff", borderRadius: 0, width: 80, height: 35, textAlign: 'center' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Subscribed">Subscribed</MenuItem>
                  <MenuItem value="Non-Subscribed">Non-Subscribed</MenuItem>
                </Select>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{
                    backgroundColor: '#EAEFF5',
                    "& th:first-of-type": {
                      borderBottomLeftRadius: 20,
                      borderTopLeftRadius: 20,
                    },
                    "& th:last-of-type": {
                      borderBottomRightRadius: 20,
                      borderTopRightRadius: 20,
                    },
                  }}>
                    <TableRow>
                      <TableCell>User Name</TableCell>
                      <TableCell>Mail Id</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Query Date</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Comments</TableCell>
                      <TableCell>Subscription</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar src={row.avatar} sx={{ width: 30, height: 30, mr: 1 }} />
                            {row.name}
                          </Box>
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.action}</TableCell>
                        <TableCell><Link onClick={() => setOpenComment(true)} sx={{ cursor: 'pointer' }}>{row.comments}</Link></TableCell>
                        <TableCell>{row.subscription}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <CustomPagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={page}
                rowsPerPage={rowsPerPage}
                totalRecords={filteredData.length}
                onChange={handleChangePage}
              />
            </Box>

          </Grid>
        </Grid>

        <MarkAsSoldModal
          open={open}
          onClose={() => setOpen(false)}
          options={["Auction", "Direct Sale", "Lease-to-Own"]}
        />

        <CommentDetailsModal
          open={openComment}
          onClose={() => setOpenComment(false)}
          date="21st Feb, 24"
          time="04:30 AM"
          status="Pending"
          subscription="Available"
          comments={comments}
          userDetails={userDetails}
        />
      </Container>
    </Box>
  );
}
