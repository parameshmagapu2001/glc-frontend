'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  Avatar,
  Menu,
  MenuItem,
  Button,
  TextField,
  Stack,
  SelectChangeEvent,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { usePathname, useRouter } from 'next/navigation';
import { IFarmlandItem, IFarmlandTableFilters } from 'src/types/farmlands';
import { getFarmlands } from 'src/api/region-officer';
import { getComparator, useConsumerTable } from 'src/components/table';
import CustomPagination from '../common-layout/pagination';

// Sold options
const soldOptions = [
  'Sold to Application Customer',
  'Sold Outside of the Application',
  'Customer Asked to Remove',
];

const TabContainer = styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '515px',
  height: '43px',
  padding: '5px',
  borderRadius: '30px',
  boxShadow: 'none',
  gap: '10px',
});

const TabButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
  minWidth: '180px',
  fontSize: '14px',
  fontWeight: active ? 600 : 400,
  color: active ? 'white' : '#666',
  backgroundColor: active ? '#7A6BF5' : 'transparent',
  textTransform: 'none',
  borderRadius: '30px',
  height: '40px',
  '&:hover': {
    backgroundColor: active ? '#7A6BF5' : 'transparent',
  },
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

const defaultFilters: IFarmlandTableFilters = {
  agentName: '',
};

const FarmlandsSold: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedSoldTo, setSelectedSoldTo] = useState<string>('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [menuOpenRow, setMenuOpenRow] = useState<number | null>(null);

  const [filters, setFilters] = useState(defaultFilters);

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query] = useState('');

  const [page, setPage] = useState(0);

  const [rowsPerPage] = useState(10);

  // Search text
  const [searchText, setSearchText] = useState('');

  // Determine active tab based on current route
  const activeTab = pathname.includes('farmlands-list-details')
    ? 'Farmlands'
    : 'Sold Out Farmlands';

  // Update selectedSoldTo
  const handleSoldToChange = (event: SelectChangeEvent<string>) => {
    setSelectedSoldTo(event.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpenRow(null);
  };

  const handleClickButton = (tab: string) => {
    if (tab === 'Farmlands') {
      router.push('/super-admin/farmlands-list-details');
    } else {
      router.push('/super-admin/farmlands-list-sold');
    }
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleClick = (event: MouseEvent<HTMLElement>, index: number) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setMenuOpenRow(index);
  };

  const handleClickMenuItem = (option: string) => {
    if (option === 'Stats') {
      router.push('/super-admin/farmlands-stats');
    }
    handleClose();
  };

  useEffect(() => {
    const fetchFarmlands = async () => {
      setFarmlandsLoading(true);
      const farmlandData = {
        searchKey: query || null,
        status: 'Assigned',
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
  }, [query, page, rowsPerPage]);

  const fetchPageFarmlands = async () => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: query || null,
      status: 'Assigned',
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

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterParams: filters,
  });


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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 < 4 && (day % 100) - (day % 10) !== 10 ? day % 10 : 0
    ];
    return `${day}${suffix} ${format(date, 'MMM - hh.mm a')}`;
  };

  return (
    <Box>
      <Box sx={{ padding: '20px' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 1, mb: 2 }}>
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
            Farmlands List
          </Typography>
        </Stack>

        <Box
          display="flex"
          pt={0.5}
          sx={{
            backgroundColor: '#FFFFFF',
            width: '515px',
            height: '51px',
            borderRadius: '14px',
            mb: 2,
          }}
        >
          <TabContainer>
            <TabButton
              active={activeTab === 'Farmlands'}
              onClick={() => handleClickButton('Farmlands')}
            >
              Farmlands
            </TabButton>
            <TabButton
              active={activeTab === 'Sold Out Farmlands'}
              onClick={() => handleClickButton('Sold Out Farmlands')}
            >
              Sold Out Farmlands
            </TabButton>
          </TabContainer>
        </Box>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
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
                    <SearchIcon
                      sx={{
                        borderRadius: '27px',
                        backgroundColor: '#F5F6FA',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #D5D5D5',
                        },
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Right: 1 Dropdowns (status) */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* // Right: "Sold to" Dropdown */}
              <Select
                value={selectedSoldTo}
                onChange={handleSoldToChange}
                displayEmpty
                size="small"
                sx={{
                  width: 85,
                  height: 35,
                  fontWeight: 500,
                  borderRadius: 1,
                  fontFamily: 'Circular Std',
                  fontSize: '12px',
                  backgroundColor: '#FCFDFD',
                }}
              >
                <MenuItem value="">Sold to</MenuItem>
                {soldOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer component={Paper}>
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
                  {[
                    'Agent Name',
                    'Farmland ID',
                    'Location',
                    'Time',
                    'Amount',
                    'Sold to',
                    'User',
                    'Sold Out Date',
                    'Action',
                  ].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFiltered.map((row, index) => (
                  <TableRow key={row.farmlandId} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={row.thumbnailImage} sx={{ width: 30, height: 30, mr: 1 }} />
                        {row.agentName}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'blue', cursor: 'pointer' }}>
                      {row.farmlandId}
                    </TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{formatDate(row.createdOn)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.landCostLabel}</TableCell>
                    <TableCell>{}</TableCell>
                    <TableCell>{}</TableCell>
                    <TableCell>{}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={(event) => handleClick(event, index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                        }}
                        aria-label="View more"
                      >
                        <img src="/assets/images/dotIcon.svg" alt="View more" />
                      </button>

                      <Menu anchorEl={anchorEl} open={menuOpenRow === index} onClose={handleClose}>
                        {['View', 'Stats'].map((option) => (
                          <MenuItem key={option} onClick={() => handleClickMenuItem(option)}>
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

          {/* Pagination */}
          <CustomPagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRecords={totalCount}
            onChange={handleChangePage}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default FarmlandsSold;
