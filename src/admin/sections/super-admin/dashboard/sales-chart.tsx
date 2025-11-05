'use client';

import { useState } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define types for chart data
interface BarData {
  value: number;
  label: string;
  color: string;
  height: number;
}

// Define types for filter data
interface FilterData {
  states: string[];
  districts: Record<string, string[]>;
  areas: Record<string, string[]>;
}

// Sample Chart Data
const CHART_DATA: BarData[] = [
  { value: 2000, label: 'Tanuku', color: '#9F9FF8', height: 155 },
  { value: 5000, label: 'Attili', color: '#96E2D6', height: 271 },
  { value: 3000, label: 'Palakollu', color: '#000', height: 194 },
  { value: 6000, label: 'Rajole', color: '#92BFFF', height: 310 },
  { value: 1000, label: 'Eluru', color: '#AEC7ED', height: 116 },
  { value: 4000, label: 'Tanuku', color: '#94E9B8', height: 233 },
];

// Sample Filter Data
const FILTER_DATA: FilterData = {
  states: ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu'],
  districts: {
    'Andhra Pradesh': ['West Godavari', 'East Godavari', 'Krishna', 'Guntur'],
    Telangana: ['Hyderabad', 'Warangal', 'Karimnagar'],
    Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  },
  areas: {
    'West Godavari': ['Tanuku', 'Attili', 'Palakollu', 'Eluru'],
    'East Godavari': ['Rajole', 'Kakinada', 'Amalapuram'],
    Krishna: ['Vijayawada', 'Gudivada', 'Machilipatnam'],
    Guntur: ['Guntur City', 'Tenali', 'Mangalagiri'],
  },
};

// Styled Components
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0px 4px 16.5px 0px rgba(0,0,0,0.12)',
  backgroundColor: '#FFF',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const StyledSelect = styled(Select<string>)(({ theme }) => ({
  height: '27px',
  width: '43%',
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
    width: '45%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '45%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
}));

const ChartBar = styled(Box)<{ height: number; color: string }>(({ height, color }) => ({
  height: `${height}px`,
  width: '28px',
  borderRadius: '8px',
  position: 'relative',
  transition: 'height 0.3s',
  backgroundColor: color,
}));

const AxisLabel = styled(Typography)({
  fontFamily: "'Inter', sans-serif",
  fontSize: '12px',
  color: 'rgba(0,0,0,0.4)',
  textAlign: 'right',
  minWidth: '40px',
});

const BarLabel = styled(Typography)({
  marginTop: '8px',
  fontFamily: "'Nunito Sans', sans-serif",
  fontSize: '12px',
  color: 'rgba(0,0,0,0.4)',
});

// Main Component
export default function SalesChart() {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');


    // Event handlers with correct typing
    const handleStateChange = (event: SelectChangeEvent) => {
      setSelectedState(event.target.value);
      setSelectedDistrict('');
      setSelectedArea('');
    };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedDistrict(event.target.value);
    setSelectedArea('');
  };

  const handleAreaChange = (event: SelectChangeEvent) => {
    setSelectedArea(event.target.value);
  };


  return (
    <RootStyle>
      <Box
        sx={{
          mb: 3,
          mt:2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: {xs:2, sm:'0%', md:'4%', xl:'14%'},
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: '#000',
            whiteSpace: 'nowrap',
          }}
        >
          Sales Report
        </Typography>

        {/* Dropdown Filters */}
        <Box
           sx={{
            display: 'flex',
            gap: '10px',
            flexWrap: {xs:'wrap', sm:'nowrap', md:'wrap', lg:'nowrap'},
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

          <StyledSelect
          value={selectedArea}
          onChange={handleAreaChange}
          displayEmpty
          disabled={!selectedDistrict}
          >
          <MenuItem value="">Select Area</MenuItem>
          {(FILTER_DATA.areas[selectedDistrict] || []).map((area) => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
          </StyledSelect>
      </Box>
     </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            py: 6,
          }}
        >
          <AxisLabel>25 CR</AxisLabel>
          <AxisLabel>1 CR</AxisLabel>
          <AxisLabel>50 L</AxisLabel>
          <AxisLabel>25 L</AxisLabel>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            py: 0,
            mt: {md:-2,lg:-1,xl:0}
          }}
        >
          {CHART_DATA.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <ChartBar height={item.height} color={item.color} />
              <BarLabel>{item.label}</BarLabel>
            </Box>
          ))}
        </Box>
        </Box>
    </RootStyle>
  );
}