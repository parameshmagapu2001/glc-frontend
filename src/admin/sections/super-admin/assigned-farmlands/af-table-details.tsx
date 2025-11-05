'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

// MUI components
import {
  Box, Table, TableBody, TableContainer, Paper, TextField, Typography, Stack, Link,
  InputAdornment, TableHead, TableRow, TableCell, Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

// Internal project imports
import { paths } from 'src/routes/paths';
import { getComparator, useConsumerTable } from 'src/components/table';
import { IFarmlandItem, IFarmlandTableFilters } from 'src/types/farmlands';
import { getFarmlands } from 'src/api/region-officer';
import Image from 'src/components/image';
import CustomPagination from '../common-layout/pagination';


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

const StyledFarmlandId = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const defaultFilters: IFarmlandTableFilters = {
  agentName: '',
};

export default function AssignedFarmlands() {
  const router = useRouter();

  // Search text
  const [searchText, setSearchText] = useState('');

  const [filters, setFilters] = useState(defaultFilters);

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query, setQuery] = useState('');

  const [page, setPage] = useState(0);

  const [rowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1);
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

  const handleViewRow = (farmlandId: number) => {
    router.push(paths.superAdmin.documents(farmlandId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 < 4 && (day % 100) - (day % 10) !== 10 ? day % 10 : 0
    ];
    return `${day}${suffix} ${format(date, 'MMM - hh.mm a')}`;
  };

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };


  return (
    <StyledRoot>
      <Box>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 1 }}>
            <img
              src="/assets/images/backArrow.png"
              style={{ width: 12, height: 10 }}
              alt="Back Arrow"
              color="black"
            />
            <Link
              component="button"
              onClick={() => router.push(paths.superAdmin.root)}
              color="inherit"
              underline="hover"
              sx={{ fontSize: '18px' }}
            >
              Dashboard
            </Link>
            &nbsp;/&nbsp;
            <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '18px' }}>
              Assigned Farmlands
            </Typography>
          </Stack>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
                            border: '1px sold #D5D5D5',
                          },
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

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
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Farmland ID</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Land Extend</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Value Per Acre</TableCell>
                    <TableCell>View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataFiltered.map((row) => (
                    <TableRow key={row.farmlandId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={row.thumbnailImage} sx={{ width: 30, height: 30, mr: 1 }} />
                          {row.agentName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StyledFarmlandId>{row.farmlandCode}</StyledFarmlandId>
                      </TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{formatDate(row.createdOn)}</TableCell>
                      <TableCell>{row.landArea}</TableCell>
                      <TableCell>
                        <b>{row.landCostLabel}</b>
                      </TableCell>
                      <TableCell>{row.costPerAcre}</TableCell>
                      <TableCell align="right">
                        <Image
                          src="/assets/images/view.png"
                          height={20}
                          width={20}
                          onClick={() => handleViewRow(row.farmlandId)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
    </StyledRoot>
  );
}
