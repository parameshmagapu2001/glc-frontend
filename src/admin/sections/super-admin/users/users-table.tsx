"use client";

import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from '@mui/material/styles';
import { useRouter } from "next/navigation";

const StyledSearchBar = styled(TextField)(() => ({
  backgroundColor: '#F5F6FA',
  borderRadius: '27px',
  minWidth: 400,
  '& .MuiOutlinedInput-root': {
    borderRadius: '27px',
    paddingRight: 0,
  },
}));

// Sample Data
const users = [
  {
    id: 1,
    name: "Ram Varma",
    email: "ramvarma12@gmail.com",
    phone: "+91-9245612249",
    platform: "Website",
    userType: "Local",
    subscription: "Subscribed",
    plan: "Basic",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    avatar: "/avatars/avatar1.png",
  },
  {
    id: 2,
    name: "Krishna",
    email: "krishna245@gmail.com",
    phone: "+91-9245612249",
    platform: "Mobile",
    userType: "NRI",
    subscription: "Non-Subscribed",
    plan: "NA",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    avatar: "/avatars/avatar2.png",
  },
  {
    id: 3,
    name: "Harish",
    email: "harish789@gmail.com",
    phone: "+91-9245612249",
    platform: "Website & Mobile",
    userType: "NRI",
    subscription: "Subscribed",
    plan: "Trader",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    avatar: "/avatars/avatar3.png",
  },
  {
    id: 4,
    name: "Mohan",
    email: "mohan1212@gmail.com",
    phone: "+91-9245612249",
    platform: "Mobile",
    userType: "Local",
    subscription: "Subscribed",
    plan: "Basic",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    avatar: "/avatars/avatar4.png",
  },
];

export default function UserTable() {
  const router = useRouter();

  const [filter, setFilter] = useState("All");
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) || // Corrected this
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{width: '100%', overflow: 'hidden', p: 2 , bgcolor: '#FFFFFF', borderRadius: 2 }}>
      {/* Search & Filter Section */}
      <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 2,
          gap: 2,
        }}>
      <StyledSearchBar
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearchChange}
          sx={{ width: 84,height:35,fontWeight:500,fontFamily:"Circular Std",fontSize:"12px", backgroundColor: '#FCFDFD' }}
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
          sx={{ width: 80,height:35,fontWeight:500,fontFamily:"Circular Std",textAlign:"center",fontSize:"12px", backgroundColor: '#FCFDFD' }} >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Subscribed">Subscribed</MenuItem>
          <MenuItem value="Non-Subscribed">Non-Subscribed</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          overflow: "hidden",
          width: "100%", 
          backgroundColor: '#FFFFFF'
        }}
      >
        <Table>
          {/* Table Head */}
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
              {["User Name", "Mail", "Phone Number", "Platform", "User Type", "Subscription", "Plan", "View"].map(
                (col) => (
                  <TableCell key={col} sx={{ fontWeight: "bold", color: "#2E3A59" }}>
                    {col}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={user.image} alt={user.name} />
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.platform}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>{user.subscription}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{user.plan}</TableCell>
                <TableCell onClick={() => router.push(`/super-admin/users/10`)} sx={{ cursor: 'pointer' }}>
                  <img src="/assets/images/eyeIcon.svg" alt="view more" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View More Button */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="text" onClick={()=>router.push("/super-admin/users-details")} sx={{color:"#3C78B9"}}>
          View More
        </Button>
      </Box>
    </Box>
  );
}
