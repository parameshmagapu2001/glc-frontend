"use client"

import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Avatar,
  Stack,
  Link,
  MenuItem,
  Select,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import SearchIcon from "@mui/icons-material/Search";
import { paths } from 'src/routes/paths';
import CustomPagination from '../common-layout/pagination';


const agentsData = [
    { name: "Ram Varma", email: "ramvarma12@gmail.com", phone: "+91-9245612249", platform: "Mobile", userType: "Local", subscription: "Subscribed", plan: "Basic", state: "Active", image: "https://randomuser.me/api/portraits/men/1.jpg", },
    { name: "Krishna", email: "krishna245@gmail.com", phone: "+91-9245612249", platform: "Website", userType: "NRI", subscription: "Non-Subscribed", plan: "NA", state: "In-active", image: "https://randomuser.me/api/portraits/men/2.jpg", },
    { name: "Satish", email: "harish789@gmail.com", phone: "+91-9245612249", platform: "Website & Mobile", userType: "Local", subscription: "Subscribed", plan: "Trader", state: "Active", image: "https://randomuser.me/api/portraits/men/3.jpg", },
    { name: "Paramesh", email: "mohan1212@gmail.com", phone: "+91-9245612249", platform: "Website & Mobile", userType: "Local", subscription: "Subscribed", plan: "Enterprise", state: "Active", image: "https://randomuser.me/api/portraits/men/4.jpg", },
    { name: "Kishore", email: "kishore@gmail.com", phone: "+91-9245612249", platform: "Website & Mobile", userType: "NRI", subscription: "Non-Subscribed", plan: "NA", state: "In-active", image: "https://randomuser.me/api/portraits/men/5.jpg", },
    { name: "Rambabu", email: "rambabu12@gmail.com", phone: "+91-9245612249", platform: "Website", userType: "NRI", subscription: "Subscribed", plan: "Basic", state: "Active", image: "https://randomuser.me/api/portraits/men/6.jpg", },
    { name: "Praneeth", email: "prn8@gmail.com", phone: "+91-9245612249", platform: "Mobile", userType: "Local", subscription: "Non-Subscribed", plan: "NA", state: "In-active" , image: "https://randomuser.me/api/portraits/men/7.jpg",},
  ];

// Styled Components
const StyledRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    paddingBottom: theme.spacing(5),
  }));
  
const StyledSearchBar = styled(TextField)(() => ({
    backgroundColor: '#F5F6FA',
    borderRadius: '27px',
    minWidth: 400,
    '& .MuiOutlinedInput-root': {
      borderRadius: '27px',
      paddingRight: 0,
    },
}));

const UsersTableDetails = () => {
    const router = useRouter();

    const [filter, setFilter] = useState("All");
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
  
    const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    };

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
    
     // Filter users based on search text
  const filteredAgents = agentsData.filter(
    (agent) => agent.name.toLowerCase().includes(searchText.toLowerCase())
  );
  
// Paginate the filtered data
const paginatedData = filteredAgents.slice((page - 1) * rowsPerPage, page * rowsPerPage);

 
  return (
    <StyledRoot>
      <Box>
        <Box sx={{ p: 3 }}>
        <Stack direction='row' alignItems='center' spacing={1} sx={{ ml: 1 }}>
        <img src="/assets/images/backArrow.png" style={{ width: 12, height: 10 }} alt="Back Arrow" color='black' />
          <Link
            component="button"
            onClick={() => router.push(paths.superAdmin.root)}
            color="inherit"
            underline="hover"
            sx={{fontSize: "18px"}}
          >
            Dashboard
          </Link>
          &nbsp;/&nbsp;
          <Typography
          sx={{fontWeight:"bold", color:"black", fontSize: "18px"}}
          >
           User’s
          </Typography>
         </Stack>
  
 <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
    <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 2,
          gap: 2,
          mt:2
        }}>
      <StyledSearchBar
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearchChange}
          sx={{         
            borderRadius: '27px',
            backgroundColor: '#F5F6FA',
           }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{        
                     borderRadius: '27px',
                     backgroundColor: '#F5F6FA',
                     '& .MuiOutlinedInput-notchedOutline': {
                       border: '1px sold #D5D5D5',
                     },
                }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Filter Dropdown */}
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ width: 80,height:35,fontWeight:500,borderRadius:1,fontFamily:"Circular Std",fontSize:"12px", backgroundColor: '#FCFDFD' }} >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Subscribed">Subscribed</MenuItem>
          <MenuItem value="Non-Subscribed">Non-Subscribed</MenuItem>
        </Select>
      </Box>


      <TableContainer  component={Paper}>
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
              <TableCell>Agent Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>User State</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {paginatedData.map((agent, index) => (
              <TableRow key={index} hover>
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={agent.image} alt={agent.name} />
                  {agent.name}
                </TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>{agent.phone}</TableCell>
                <TableCell>{agent.platform}</TableCell>
                <TableCell>{agent.userType}</TableCell>
                <TableCell>{agent.subscription}</TableCell>
                <TableCell>{agent.plan}</TableCell>
                <TableCell>{agent.state}</TableCell>
                <TableCell onClick={() => router.push(`/super-admin/users/10`)} sx={{ cursor: 'pointer' }}>
                  <img src="/assets/images/eyeIcon.svg" alt="view more" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomPagination
        count={Math.ceil(agentsData.length / rowsPerPage)}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRecords={agentsData.length}
        onChange={handleChangePage}
      />
      </Paper>
    </Box>
</Box>
</StyledRoot> 
  )
}

export default UsersTableDetails;