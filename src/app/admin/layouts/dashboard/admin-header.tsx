import {useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Box, MenuItem, Select, SelectChangeEvent, styled } from '@mui/material';
import { usePathname } from 'next/navigation';
import { bgBlur } from 'src/theme/css';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import Image from 'src/components/image';
import { HEADER, NAV } from '../config-layout';
import {
  AccountPopover,
  SettingsButton,
} from '../_common';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

const SelectWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
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

interface FilterData {
  countries: string[],
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
    'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  },
  areas: {
    'West Godavari': ['Tanuku', 'Attili', 'Palakollu', 'Eluru'],
    'East Godavari': ['Rajole', 'Kakinada', 'Amalapuram'],
    'Krishna': ['Vijayawada', 'Gudivada', 'Machilipatnam'],
    'Guntur': ['Guntur City', 'Tenali', 'Mangalagiri'],
  },
};

export default function AdminHeader({ onOpenNav }: Props) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const pathname = usePathname();
  const isSuperAdminRoute = pathname === '/super-admin/' || pathname ===  '/super-admin/assigned-farmlands/' || pathname === "/super-admin/farmlands-list/" || pathname === "/super-admin/users/"; 
 
  const handleCountryChange = (event: SelectChangeEvent) => {
    setSelectedCountry(event.target.value);
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


  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Image src="/assets/images/logo.svg" alt="logo" width={115} height={55} />


      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {isSuperAdminRoute && (
        <SelectWrapper>
          <StyledSelect value={selectedCountry} onChange={handleCountryChange} displayEmpty>
            <MenuItem value="">Select Country</MenuItem>
            {FILTER_DATA.countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </StyledSelect>

          <StyledSelect value={selectedState} onChange={handleStateChange} displayEmpty disabled={!selectedCountry}>
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
        )}

        <SettingsButton />
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.paper,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          // width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}





