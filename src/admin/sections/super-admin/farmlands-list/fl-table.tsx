'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
  SelectChangeEvent,
  InputAdornment,
  Menu,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { IFarmlandItem, IFarmlandTableFilters } from 'src/types/farmlands';
import { getFarmlands } from 'src/api/region-officer';
import { useConsumerTable, getComparator } from 'src/components/table';
import { paths } from 'src/routes/paths';
import TagSelectionModal from './tag-selection-modal';


const STATES = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu'];
const REGIONS = ['Region 1', 'Region 2', 'Region 3'];
const AREAS = ['Area 1', 'Area 2', 'Area 3'];
const STATUS = ['In Live', 'Rejected'];

const StyledSearchBar = styled(TextField)(() => ({
  backgroundColor: '#F5F6FA',
  borderRadius: '27px',
  minWidth: 400,
  '& .MuiOutlinedInput-root': {
    borderRadius: '27px',
    paddingRight: 0,
  },
}));

const defaultFilters: IFarmlandTableFilters = {
  agentName: '',
};

const FarmlandsListTable: React.FC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpenRow, setMenuOpenRow] = useState<number | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Search text
  const [searchText, setSearchText] = useState('');

  // Dropdown states
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [filters] = useState(defaultFilters);

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query] = useState('');

  const [page] = useState(0);

  // Handler for search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    setSelectedState(event.target.value);
    setSelectedRegion('');
    setSelectedArea('');
  };

  const handleRegionChange = (event: SelectChangeEvent) => {
    setSelectedRegion(event.target.value);
    setSelectedArea('');
  };

  const handleAreaChange = (event: SelectChangeEvent) => {
    setSelectedArea(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setMenuOpenRow(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpenRow(null);
  };

   const handleClickMenuItem = (option: string, farmlandId: number) => {
     if (option === 'Change Tag') {
       setIsTagModalOpen(true);
     } else if (option === 'Stats') {
       router.push('/super-admin/farmlands-stats');
     } else {
         router.push(paths.superAdmin.documents(farmlandId));
     }
     handleClose();
   };

  useEffect(() => {
    const fetchFarmlands = async () => {
      setFarmlandsLoading(true);
      const farmlandData = {
        searchKey: query || null,
        status: 'All',
        pageNumber: page + 1,
        pageSize: 10,
      };
      try {
        const response = await getFarmlands(farmlandData);
        const { data, totalRecords } = response.data;
        setTotalCount(totalRecords);
        if (data.length === 0) {
          setFarmlandsEmpty(true);
        } else {
          setFarmlandsEmpty(false);
        }
        setTableData(data);
      } catch (error) {
        console.error(error);
        setFarmlandsEmpty(true);
      } finally {
        setFarmlandsLoading(false);
      }
    };
    fetchFarmlands();
  }, [page, query]);

  const fetchPageFarmlands = async () => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: query || null,
      status: 'All',
      pageNumber: 1,
      pageSize: 10,
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { data, totalRecords } = response.data;
      setTotalCount(totalRecords);
      if (data.length === 0) {
        setFarmlandsEmpty(true);
      } else {
        setFarmlandsEmpty(false);
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
      setFarmlandsEmpty(true);
    } finally {
      setFarmlandsLoading(false);
    }
  };

  const table = useConsumerTable({ fetchData: fetchPageFarmlands });

  function applyFilter({
    inputData,
    comparator,
    filterParams,
  }: {
    inputData: IFarmlandItem[];
    comparator: (a: any, b: any) => number;
    filterParams: IFarmlandTableFilters;
  }) {
    const { agentName } = filterParams;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (agentName) {
      inputData = inputData.filter(
        (role) => role.agentName.toLowerCase()?.indexOf(agentName.toLowerCase()) !== -1
      );
    }

    return inputData;
  }

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterParams: filters,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 < 4 && (day % 100) - (day % 10) !== 10 ? day % 10 : 0
    ];
    return `${day}${suffix} ${format(date, 'MMM - hh.mm a')}`;
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', p: 2, bgcolor: '#FFFFFF', borderRadius: 2 }}>
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
        <StyledSearchBar
          placeholder="Search"
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
                <SearchIcon
                  sx={{
                    borderRadius: '27px',
                    backgroundColor: '#F5F6FA',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '1px sold #D5D5D5',
                    },
                  }}
                />
              </InputAdornment>
            ),
          }}
        />

        {/* Right: 3 Dropdowns (State, Region, Area) */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* State */}
          <Select
            value={selectedState}
            onChange={handleStateChange}
            displayEmpty
            size="small"
            sx={{
              width: 84,
              height: 35,
              fontWeight: 500,
              fontFamily: 'Circular Std',
              fontSize: '12px',
              backgroundColor: '#FCFDFD',
            }}
          >
            <MenuItem value="">State</MenuItem>
            {STATES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>

          {/* Region */}
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            displayEmpty
            size="small"
            sx={{
              width: 84,
              height: 35,
              fontWeight: 500,
              fontFamily: 'Circular Std',
              fontSize: '12px',
              backgroundColor: '#FCFDFD',
            }}
          >
            <MenuItem value="">Region</MenuItem>
            {REGIONS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>

          {/* Area */}
          <Select
            value={selectedArea}
            onChange={handleAreaChange}
            displayEmpty
            size="small"
            sx={{
              width: 84,
              height: 35,
              fontWeight: 500,
              fontFamily: 'Circular Std',
              fontSize: '12px',
              backgroundColor: '#FCFDFD',
            }}
          >
            <MenuItem value="">Area</MenuItem>
            {AREAS.map((a) => (
              <MenuItem key={a} value={a}>
                {a}
              </MenuItem>
            ))}
          </Select>

          {/* Status */}
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            displayEmpty
            size="small"
            sx={{
              width: 84,
              height: 35,
              fontWeight: 500,
              fontFamily: 'Circular Std',
              fontSize: '12px',
              backgroundColor: '#FCFDFD',
            }}
          >
            <MenuItem value="">Status</MenuItem>
            {STATUS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: '#EAEFF5',
              '& th:first-of-type': {
                borderBottomLeftRadius: 20,
                borderTopLeftRadius: 20,
              },
              '& th:last-of-type': {
                borderBottomRightRadius: 20,
                borderTopRightRadius: 20,
              },
            }}
          >
            <TableRow>
              <TableCell>Agent Name</TableCell>
              <TableCell>Farmland ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Land Extend</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataFiltered.slice(0, 4).map((row, index) => (
              <TableRow key={row.farmlandId} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar src={row.thumbnailImage} sx={{ mr: 1 }} />
                    <Typography>{row.agentName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography color="primary" sx={{ cursor: 'pointer' }}>
                    {row.farmlandCode}
                  </Typography>
                </TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{formatDate(row.createdOn)}</TableCell>
                 <TableCell>{row.landArea}</TableCell>
                <TableCell>{row.landCostLabel}</TableCell>{' '}
                <TableCell>{row.costPerAcre}</TableCell>
                <TableCell>
                  <Typography color={row.farmlandStatus === 'In Live' ? green[500] : red[500]}>
                    {row.farmlandStatus}
                  </Typography>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={(event) => handleClick(event, index)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    aria-label="View more"
                  >
                    <img src="/assets/images/dotIcon.svg" alt="View more" />
                  </button>

                  <Menu anchorEl={anchorEl} open={menuOpenRow === index} onClose={handleClose}>
                    {['View', 'Edit', 'Stats', 'Change Tag'].map((option) => (
                      <MenuItem key={option} onClick={() => handleClickMenuItem(option, row.farmlandId)}>
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TagSelectionModal
        open={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSubmit={(selectedTags) => {
          console.log('Selected Tags:', selectedTags);
          setIsTagModalOpen(false);
        }}
      />

      {/* View More Button */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          onClick={() => router.push('/super-admin/farmlands-list-details')}
          variant="text"
          sx={{ color: '#3C78B9' }}
        >
          View More
        </Button>
      </Box>
    </Box>
  );
};

export default FarmlandsListTable;
