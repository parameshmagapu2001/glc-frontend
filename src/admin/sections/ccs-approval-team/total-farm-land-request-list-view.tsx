'use client';

import {
  Box,
  Container,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  TableSkeleton,
  useConsumerTable,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { IFarmlandItem } from 'src/types/farmlands';
import { getFarmlands } from 'src/api/region-officer';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { listStateRegions, listRegionAreas } from 'src/api/states';
import FarmLandRequestsTableRow from './farm-land-requests-table-row';
import CustomPagination from '../field-officer/common-layout/pagination';
// ----------------------------------------------------------------------

const STATES = [
  { id: 2, name: 'Andhra Pradesh' },
  { id: 36, name: 'Telangana' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Agent Name' },
  { id: 'id', label: 'Farmland Id' },
  { id: 'location', label: 'Location' },
  { id: 'time', label: 'Time' },
  { id: 'landExtend', label: 'Land Extend' },
  { id: 'amount', label: 'Amount' },
  { id: 'costPerAcre', label: 'Cost Per Acre' },
  { id: 'action', label: 'View' },
];

const sortFieldMap: Record<string, keyof IFarmlandItem> = {
  name: 'agentName',
  id: 'farmlandId',
  time: 'createdOn',
  amount: 'landCost',
  status: 'farmlandStatus',
}

export default function TotalFarmlandRequestsListView() {
  const router = useRouter();

  const settings = useSettingsContext();

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [tableData, setTableData] = useState<IFarmlandItem[]>([]);

  const [totalCount, setTotalCount] = useState(0);

  const [query, setQuery] = useState('');

  const [page, setPage] = useState(1);

  const [rowsPerPage] = useState(10);

  const confirm = useBoolean();

  // Dropdown states
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [regions, setRegions] = useState<{ id: number; label: string }[]>([]);
  const [areas, setAreas] = useState<{ id: number; label: string }[]>([]);

  const handleStateChange = async (event: SelectChangeEvent) => {
    const stateId = event.target.value;
    setSelectedState(stateId);
    setSelectedRegion('');
    setSelectedArea('');
    setRegions([]);
    setAreas([]);

    if (stateId) {
      try {
        const response = await listStateRegions(stateId);
        setRegions(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    }
  };

  const handleRegionChange = async (event: SelectChangeEvent) => {
    const regionId = event.target.value;
    setSelectedRegion(regionId);
    setSelectedArea('');
    setAreas([]);

    if (regionId) {
      try {
        const response = await listRegionAreas(regionId);
        setAreas(response.data);
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    }
  };

  const handleAreaChange = (event: SelectChangeEvent) => {
    setSelectedArea(event.target.value);
  };
  useEffect(() => {
    const fetchFarmlands = async () => {
      setFarmlandsLoading(true);
      const farmlandData = {
        searchKey: null,
        status: 'Requested',
        pageNumber: page,
        pageSize: rowsPerPage,
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
  }, [page, query, rowsPerPage]);

  const fetchPageFarmlands = async (pageNumber: number, pageSize: number) => {
    setFarmlandsLoading(true);
    try {
      const farmlandData = {
        searchKey: query || null,
        status: 'Requested',
        pageNumber: pageNumber + 1,
        pageSize,
      };
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

  const denseHeight = table.dense ? 60 : 80;

  const notFound = farmlandsEmpty;

  // client-side filtering: first by select filter, then by search query
  const filteredData = useMemo(() => {
    let arr = tableData;

    if (selectedState) {
      const regionNamesUnderState = regions?.map((r) =>
        r.label.toLowerCase()
      );
      arr = arr.filter((row) =>
        // filter by checking if location contains *any* of those region names
        regionNamesUnderState.some((regionName) =>
          row.location.toLowerCase().includes(regionName)
        )
      );
    }

    if (selectedRegion) {
      arr = arr.filter((r) => r.location?.toLowerCase().includes(
        regions.find((reg) => reg.id.toString() === selectedRegion)?.label.toLowerCase() || ''
      ));
    }

    if (selectedArea) {
      arr = arr.filter((r) => r.location?.toLowerCase().includes(
        areas.find((a) => a.id.toString() === selectedArea)?.label.toLowerCase() || ''
      ));
    }

    // 5) search query filter
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      arr = arr.filter((row) => {
        // agent name, code, id, status
        if (row.agentName.toLowerCase().includes(q)) return true;
        if (row.farmlandCode.toLowerCase().includes(q)) return true;
        if (row.farmlandId.toString().includes(q)) return true;
        if (row.farmlandStatus.toLowerCase().includes(q)) return true;

        // formatted time
        const displayTime = format(new Date(row.createdOn), 'do MMM - hh.mm aa')
          .toLowerCase();
        if (displayTime.includes(q)) return true;

        // amount label & raw
        if (row.landCostLabel && row.landCostLabel.toLowerCase().includes(q)) return true;
        if (row.landCost && row.landCost.toString().includes(q)) return true;

        return false;
      });
    }

    return arr;
  }, [tableData, query, selectedState, selectedRegion, selectedArea, regions, areas]);

  const sortedData = useMemo(() => {
    if (!table.orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const key = sortFieldMap[table.orderBy!] || (table.orderBy as keyof IFarmlandItem);
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      // number
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return table.order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      // date
      const dateKeys = ['createdOn', 'farmlandCreatedOn', 'publishedTime', 'dob'] as const;
      if (dateKeys.includes(key as any)) {
        const diff = new Date(aVal as string).getTime() - new Date(bVal as string).getTime();
        return table.order === 'asc' ? diff : -diff;
      }
      // string fallback
      const sa = String(aVal).toLowerCase();
      const sb = String(bVal).toLowerCase();
      return table.order === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [filteredData, table.order, table.orderBy]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      table.setPage(0);
      // fetchPageFarmlands(0, table.rowsPerPage);
    }
  };

  const handleViewRow = useCallback(
    (id: number) => {
      router.push(paths.ccs.documents(id));
    },
    [router]
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        links={[
          {
            name: 'Dashboard',
            href: paths.ccs.root,
          },
          {
            name: 'Farmland Requests',
          },
        ]}
        sx={{ mb: 2 }}
      />
      <Card sx={{ borderRadius: '10px' }}>
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
          <Stack sx={{ p: 2 }}>
            <TextField
              placeholder="Search...."
              value={query}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              sx={{ width: 300, height: 30, borderRadius: 20 }}
              InputProps={{
                sx: { height: 30, borderRadius: 20, backgroundColor: '#F5F6FA' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Right: 3 Dropdowns (State, Region, Area) */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pr: 2 }}>
            <Select
              value={selectedState}
              onChange={handleStateChange}
              displayEmpty
              size="small"
              sx={{
                width: 105,
                height: 35,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'Circular Std',
                color: '#000000',
                backgroundColor: '#F5F6FA',
              }}
            >
              <MenuItem value="">State</MenuItem>
              {STATES.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>


            <Select
              value={selectedRegion}
              onChange={handleRegionChange}
              displayEmpty
              disabled={!selectedState}
              sx={{
                width: 105,
                height: 35,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'Circular Std',
                color: '#000000',
                backgroundColor: '#F5F6FA',
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Limit the height of the dropdown (e.g., 5 items)
                    overflowY: 'auto', // Enable scrolling for additional items
                  },
                },
              }}
            >
              <MenuItem value="">Region</MenuItem>
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.label}
                </MenuItem>
              ))}
            </Select>


            <Select
              value={selectedArea}
              onChange={handleAreaChange}
              displayEmpty
              disabled={!selectedRegion}
              sx={{
                width: 105,
                height: 35,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'Circular Std',
                color: '#000000',
                backgroundColor: '#F5F6FA',
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Limit the height of the dropdown (e.g., 5 items)
                    overflowY: 'auto', // Enable scrolling for additional items
                  },
                },
              }}
            >
              <MenuItem value="">Area</MenuItem>
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <TableContainer sx={{ position: 'relative', overflow: 'unset', px: 2 }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.farmlandId)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 600 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD.map((head) => ({
                  ...head,
                  label: (
                    <Typography color="#000000" fontWeight="bold" sx={{ fontSize: "14px" }}>
                      {head.label}
                    </Typography>
                  ),
                }))}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {farmlandsLoading ? (
                  [...Array(table.rowsPerPage)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {sortedData.map((row) => (
                      <FarmLandRequestsTableRow
                        key={row.farmlandId}
                        row={row}
                        onViewRow={() => handleViewRow(row.farmlandId)}
                      />
                    ))}
                  </>
                )}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Box p={2}>
          <CustomPagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRecords={totalCount}
            onChange={handleChangePage}
          />
        </Box>
      </Card>
    </Container>
  );
}
