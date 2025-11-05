'use client';

import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
} from "recharts";
import { Card, CardContent, Box, Typography, Select, MenuItem, SelectChangeEvent, Button } from "@mui/material";
import { useRouter } from "next/navigation";


// Define interfaces for our data and props
interface PerformerData {
  name: string;
  value: number;
  total: number;
  img: string;
}

// Define types for filter data
interface FilterData {
  states: string[];
  districts: Record<string, string[]>;
  areas: Record<string, string[]>;
}

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

interface CustomBarProps extends Record<string, any> {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: PerformerData;
}

const CustomBar: React.FC<CustomBarProps> = ({ x, y, width, height, payload }) => {
  if (!x || !y || !width || !height || !payload?.img) {
    return null; // Prevent crashes if props are missing
  }

  const radius = 10;
  const spacing = 10;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#4A6CF7" />
      <defs>
        <clipPath id={`clip-${x}`}>
          <circle cx={x + width / 2} cy={y - radius - spacing} r={radius} />
        </clipPath>
      </defs>
      <image
        x={x + width / 2 - radius - 3}
        y={y - 20 - spacing}
        width="25"
        height="25"
        xlinkHref={payload.img}
        clipPath={`url(#clip-${x})`}
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  );
};


// Component in TypeScript
const PerformersChart: React.FC = () => {
  const router = useRouter();

  const performersData: PerformerData[] = [
    {
      name: "SAM",
      value: 10,
      total: 100,
      img: "https://i.pravatar.cc/40?img=1",
    },
    {
      name: "Amanda",
      value: 20,
      total: 100,
      img: "https://i.pravatar.cc/40?img=2",
    },
    {
      name: "Carry",
      value: 30,
      total: 100,
      img: "https://i.pravatar.cc/40?img=3",
    },
    {
      name: "Ben",
      value: 8,
      total: 100,
      img: "https://i.pravatar.cc/40?img=4",
    },
    {
      name: "Richa",
      value: 22,
      total: 100,
      img: "https://i.pravatar.cc/40?img=5",
    },
    {
      name: "Mike",
      value: 32,
      total: 100,
      img: "https://i.pravatar.cc/40?img=6",
    },
    {
      name: "Bide",
      value: 15,
      total: 100,
      img: "https://i.pravatar.cc/40?img=7",
    },
    {
      name: "Priya",
      value: 12,
      total: 100,
      img: "https://i.pravatar.cc/40?img=8",
    },
    {
      name: "Amy",
      value: 25,
      total: 100,
      img: "https://i.pravatar.cc/40?img=9",
    },
    {
      name: "Rig",
      value: 7,
      total: 100,
      img: "https://i.pravatar.cc/40?img=10",
    },
    {
      name: "Boston",
      value: 18,
      total: 100,
      img: "https://i.pravatar.cc/40?img=11",
    },
    {
      name: "Lara",
      value: 35,
      total: 100,
      img: "https://i.pravatar.cc/40?img=12",
    },
  ];

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

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
    <Card sx={{ borderRadius: "16px", mr: { xs: 0, md: 0 } }}>
      <CardContent>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: {xs:2, sm:'0%', md:'4%', xl:'14%'},
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              Top
            </Typography>
            <Box sx={{ width: "110%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Typography variant="h6" color="text.primary">
                Performers List
              </Typography>
              <Button
                onClick={() => router.push('top-performers')}
                sx={{
                  color: "#ffffff",
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    color: "#ffffff",
                    backgroundColor: 'primary.main',
                  },
                }}>
                View All
              </Button>
            </Box>

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
        <img src="/assets/images/horizontalLine.png" alt="img-notfound" />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={performersData}
            margin={{ top: 40, bottom: 5, right: 16 }}
          >
            <CartesianGrid
              strokeDasharray="5 5"
              vertical={false}
              stroke="#E0E0E0"
            />
            <XAxis
              dataKey="name"
              axisLine
              tickLine={false}
              scale="point"
              padding={{ left: 10, right: 10 }}
              tick={{ fontSize: "clamp(0.6rem, 2vw, 1rem)" }}
            />
            <YAxis axisLine={false} tickLine={false} domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            {[0, 20, 40, 60, 80].map((tick) => (
              <Line
                key={tick}
                x1="0%"
                x2="100%"
                y1={`${100 - tick}%`}
                y2={`${100 - tick}%`}
                stroke="#E0E0E0"
                strokeDasharray="5 5"
              />
            ))}

            <Bar
              dataKey="value"
              shape={(props: any) => <CustomBar {...props} />}
              barSize={10}
              background={{ fill: "#eee" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformersChart;
