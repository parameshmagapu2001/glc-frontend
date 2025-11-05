'use client';

import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import { IRoleUserItem, IRoleUserTableFilters } from 'src/types/role-users';
import CustomTabs from 'src/components/tab/customTabs';
import { getFarmlands } from 'src/api/region-officer';
import FarmLandListView from '../farm-land-list-view';
import AssignedFarmLandListView from '../assigned-farm-land-list-view';
import InprogressFarmLandListView from '../inprogress-farm-land-list-view';

// ----------------------------------------------------------------------

export default function RegionOfficerPage() {

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [assignedCount, setAssignedCount] = useState(0);

  const [inprogressCount, setInprogressCount] = useState(0);

  const [farmLandCount, setFarmLandCount] = useState(0);

  const [currentTab, setCurrentTab] = useState('AssignedFarmlands');

  useEffect(() => {
    fetchAssignedFarmlands();
    fetchInprogressFarmlands();
    fetchFarmlands();
  }, []);

  const fetchAssignedFarmlands = async () => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: null,
      status: 'Assigned',
      pageNumber: 1,
      pageSize: 5
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { totalRecords } = response.data;
      setAssignedCount(totalRecords);
    } catch (error) {
      console.error(error);
      setFarmlandsEmpty(false);
    }
  }

  const fetchInprogressFarmlands = async () => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: null,
      status: 'Inprogress',
      pageNumber: 1,
      pageSize: 5
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { totalRecords } = response.data;
      setInprogressCount(totalRecords);
    } catch (error) {
      console.error(error);
      setFarmlandsEmpty(false);
    }
  }

  const fetchFarmlands = async () => {
    setFarmlandsLoading(true);
    const farmlandData = {
      searchKey: null,
      status: 'All',
      pageNumber: 1,
      pageSize: 5
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { totalRecords } = response.data;
      setFarmLandCount(totalRecords);
    } catch (error) {
      console.error(error);
      setFarmlandsEmpty(false);
    }
  }

  const tabs = [
    {
      value: 'AssignedFarmlands',
      label: 'Assigned Farmlands',
      count: assignedCount,
    },
    {
      value: 'InProgressFarmlands',
      label: 'Inprogress Farmlands',
      count: inprogressCount,
    },
    {
      value: 'FarmlandsList',
      label: 'Farmlands List',
      count: farmLandCount,
    },
  ];

  return (
    <>
      <Card sx={{ display: 'flex', alignItems: 'center', borderRadius: '14px', px: 2, mb: 2, width: '50%', height: '51px', pt: 0.5 }}>
        <CustomTabs
          tabs={tabs}
          currentTab={currentTab}
          onChange={setCurrentTab}
          sx={{ justifyContent: 'flex-start' }} // use flex-start instead of 'none'
        />
      </Card>

      <Card sx={{
        p: 1,
        px: 2,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: 1,
        my: 0,
      }}>
        <Stack sx={{ flex: 1 }}>
          {currentTab === 'AssignedFarmlands' && <AssignedFarmLandListView />}
          {currentTab === 'InProgressFarmlands' && <InprogressFarmLandListView />}
          {currentTab === 'FarmlandsList' && <FarmLandListView />}
        </Stack>
      </Card>
    </>
  );
}


// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IRoleUserItem[];
  comparator: (a: any, b: any) => number;
  filters: IRoleUserTableFilters;
}) {
  const { mobile_number } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (mobile_number) {
    inputData = inputData.filter(
      (role) => role.mobile_number.toLowerCase()?.indexOf(mobile_number.toLowerCase()) !== -1
    );
  }

  // if (role_status.length) {
  //   inputData = inputData.filter((role) => role_status.includes(role.role_status));
  // }

  return inputData;
}
