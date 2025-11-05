'use client';

import {
  Grid,
  Typography,
  Link,
  InputAdornment,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { listTopPerformers } from 'src/api/agents';
import TopPerformerItem from 'src/sections/super-admin/top-performer/top-performer-item';
import { Agent } from 'src/types/agent';

const SelectWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
}));

const StyledPaginationContainer = styled(Stack)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '30px',
}));

const StyledSelect = styled(Select<string>)(({ theme }) => ({
  height: '27px',
  border: '0.912px solid #8280FF',
  borderRadius: '27.346px',
  backgroundColor: '#e7e9f8',
  '& .MuiSelect-select': {
    padding: '4px 8px',
    fontFamily: "'Nunito Sans', sans-serif",
    fontSize: '11px',
    color: '#8280FF',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const StyledSearchBar = styled(TextField)(() => ({
  color: '#FFFFFF',
  boxShadow:"10px",
  minWidth: '170%',
  height: '40px',
  padding: 0,
  margin: 0,
  '& .MuiOutlinedInput-root': {
    borderRadius: '27px',
    padding: 0, 
    minHeight: '40px',
    '& fieldset': {
      borderColor: '#D5D5D5',
    },
    '& .MuiInputBase-input': {
      padding: '10px 14px', 
    },
  },
}));

// Define types for filter data
interface FilterData {
  countries: string[];
  states: string[];
  districts: Record<string, string[]>;
  areas: Record<string, string[]>;
}

// Sample Filter Data
const FILTER_DATA: FilterData = {
  countries: ['India', 'USA', 'Canada', 'Australia'],
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

function TopPerformersPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Search text
  const [searchText, setSearchText] = useState('');

  const onChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const fetchTopPerformers = async () => {
    try {
      const res = await listTopPerformers();

      setAgents(res.data?.topAgents || []);
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  useEffect(() => {
    fetchTopPerformers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleCountryChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value);
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedArea('');
  };

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
    <Stack>
      <Grid item xs={12} sm={8} md={9} sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <img
            src="/assets/images/backArrow.png"
            style={{ width: 12, height: 10 }}
            alt="Back Arrow"
            color="black"
          />
          <Link
            component="button"
            onClick={() => router.push('/super-admin')}
            color="inherit"
            underline="hover"
            sx={{ fontSize: '18px' }}
          >
            Dashboard
          </Link>
          &nbsp;/&nbsp;
          <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '18px' }}>
            Top Performers
          </Typography>
        </Stack>
      </Grid>

      <Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            mb: 2,
            gap: 2,
          }}
        >
          {/* Left: Search Bar (rounded, with search icon) */}
         <Grid >
         <StyledSearchBar
            placeholder="Search by Agent..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchText}
            onChange={handleSearchChange}
            InputProps={{
              sx: {
                padding: '0px 10px', 
                backgroundColor: '#FFFFFF',
              },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    sx={{
                      marginRight: '6px',
                      color: '#3C78B9',
                      cursor: 'pointer',
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
         </Grid>

          <Stack
            flexGrow={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={{ xs: 0.5, sm: 1 }}
          >
            <SelectWrapper>
              <StyledSelect value={selectedRole} onChange={handleCountryChange} displayEmpty>
                <MenuItem value="">Select Role</MenuItem>
                {FILTER_DATA.countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </StyledSelect>

              <StyledSelect
                value={selectedState}
                onChange={handleStateChange}
                displayEmpty
                disabled={!selectedRole}
              >
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
            </SelectWrapper>
          </Stack>
        </Box>
      </Grid>
      <Grid container spacing="20px" sx={{ mt: 2, ml: 0 }}>
        {agents.map((item) => (
          <Grid key={item.userId}>
            <TopPerformerItem item={item} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination Component */}
      <StyledPaginationContainer>
        <Stack direction="row" justifyContent="center" flex={1}>
          <Pagination
            count={Math.ceil(agents.length / rowsPerPage)}
            page={page}
            onChange={onChange}
            shape="rounded"
            color="primary"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      </StyledPaginationContainer>
    </Stack>
  );
}

export default TopPerformersPage;
