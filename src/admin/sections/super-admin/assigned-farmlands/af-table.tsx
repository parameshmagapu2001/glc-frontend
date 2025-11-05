'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Button,
  SelectChangeEvent,
  MenuItem,
  Select,
  InputAdornment,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { IFarmlandItem, IFarmlandTableFilters } from 'src/types/farmlands';
import { getFarmlands } from 'src/api/region-officer';
import { useConsumerTable, getComparator } from 'src/components/table';
import { paths } from 'src/routes/paths';
import Image from 'src/components/image';


const StyledSearchBar = styled(TextField)({
  backgroundColor: '#F5F6FA',
  borderRadius: '27px',
  minWidth: 400,
  '& .MuiOutlinedInput-root': {
    borderRadius: '27px',
  },
});

const defaultFilters: IFarmlandTableFilters = {
  agentName: '',
};

export default function AssignedFarmlandsPage() {
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [filters] = useState(defaultFilters);

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query] = useState('');

  const [page] = useState(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 < 4 && (day % 100) - (day % 10) !== 10 ? day % 10 : 0
    ];
    return `${day}${suffix} ${format(date, 'MMM - hh.mm a')}`;
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
  }, [page, query]);

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
    filterParams: filters,  // ✅ Use the new parameter name
  });

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (e: SelectChangeEvent<string>) =>
      setter(e.target.value);

  const getSelectedValue = (index: number) => {
    if (index === 0) return selectedState;
    if (index === 1) return selectedRegion;
    return selectedArea;
  };

  const getSelectedSetter = (index: number) => {
    if (index === 0) return setSelectedState;
    if (index === 1) return setSelectedRegion;
    return setSelectedArea;
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

  const handleViewRow = (farmlandId: number) => {
    router.push(paths.superAdmin.documents(farmlandId));
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', p: 2, bgcolor: '#FFFFFF', borderRadius: 2 }}>
      {/* Search & Filters */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2, gap: 2 }}
      >
        <StyledSearchBar
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {['State', 'Region', 'Area'].map((label, index) => (
            <Select
              key={index}
              value={getSelectedValue(index)}
              onChange={handleDropdownChange(getSelectedSetter(index))}
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
              <MenuItem value="">{label}</MenuItem>
            </Select>
          ))}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          {/* Table Head */}
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
              <TableCell>Area</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Cost Per Acre</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          {/* Table Body */}
          <TableBody>
            {dataFiltered.slice(0, 4).map((row) => (
              <TableRow key={row.farmlandId} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={row.thumbnailImage} sx={{ width: 30, height: 30, mr: 1 }} />
                    {row.agentName}
                  </Box>
                </TableCell>
                <TableCell>{row.farmlandCode}</TableCell>
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

      {/* View More */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          onClick={() => router.push('/super-admin/assigned-farmlands-details')}
          variant="text"
          sx={{ color: '#3C78B9' }}
        >
          View More
        </Button>
      </Box>
    </Box>
  );
}
