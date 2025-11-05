'use client';

import React, { useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import {
  Box,
  Typography,
  MenuItem,
  Card,
  CardContent,
  Select, 
  SelectChangeEvent
} from "@mui/material";
import { styled } from '@mui/material/styles';

// Define interfaces for data types
interface DataItem {
  name: string;
  value: number;
  color: string;
}

// Define types for filter data
interface FilterData {
  states: string[];
  districts: Record<string, string[]>;
}

// Sample Filter Data
const FILTER_DATA: FilterData = {
  states: ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu'],
  districts: {
    'Andhra Pradesh': ['West Godavari', 'East Godavari', 'Krishna', 'Guntur'],
    Telangana: ['Hyderabad', 'Warangal', 'Karimnagar'],
    Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  }
};

const StyledSelect = styled(Select<string>)(({ theme }) => ({
  height: '27px',
  width: '50%',
  border: '0.912px solid #8280FF',
  borderRadius: '27.346px',
  backgroundColor: '#FFF',
  '& .MuiSelect-select': {
    padding: '4px 8px',
    fontFamily: "'Nunito Sans', sans-serif",
    fontSize: '9px',
    color: '#8280FF',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },

  // Responsive widths
  [theme.breakpoints.down('md')]: {
    width: '50%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '50%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
}));

const data: DataItem[] = [
  { name: "Gold", value: 52.1, color: "#FFD700" },
  { name: "Platinum", value: 22.8, color: "#D3D3D3" },
  { name: "Bronze", value: 11.2, color: "#CD7F32" },
  { name: "Silver", value: 13.9, color: "#C0C0C0" },
];

const SubscribersData: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

    // Event handlers with correct typing
    const handleStateChange = (event: SelectChangeEvent) => {
      setSelectedState(event.target.value);
      setSelectedDistrict('');
    };


  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedDistrict(event.target.value);
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        ml: { xs: 0, md: 0 },
        mr: 0,
        mb: { xs: 2 },
        height: { xs: "auto", md: "396px" },
        minHeight: "396px",
      }}
    >
      <CardContent>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.primary">
              Subscribers Data
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              flexWrap: {xs:'wrap', sm:'nowrap', md:'nowrap', lg:'nowrap'},
            }}
          >

            <StyledSelect value={selectedState} onChange={handleStateChange} displayEmpty>
              <MenuItem value="">Select State</MenuItem>
              {FILTER_DATA.states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </StyledSelect>

            <StyledSelect
              value={selectedDistrict}
              onChange={handleDistrictChange}
              displayEmpty
              disabled={!selectedState}
            >
            <MenuItem value="">Select District</MenuItem>
              {(FILTER_DATA.districts[selectedState] || []).map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </StyledSelect>
        </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "40%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="80%"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ width: "55%" }}>
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      mr: 0.5,
                    }}
                  />
                  <Typography sx={{ color: "#333", fontSize: "1rem" }}>
                    {item.name}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 500, fontSize: "1rem" }}>
                  {item.value}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SubscribersData;