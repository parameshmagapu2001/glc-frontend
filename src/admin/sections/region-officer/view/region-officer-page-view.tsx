'use client';

import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import { IRoleUserItem, IRoleUserTableFilters } from 'src/types/role-users';
import CustomTabs from 'src/components/tab/customTabs';
import { getFarmlands } from 'src/api/region-officer';
import FarmLandListView from '../farm-land-list-view';
import AssignedFarmLandListView from '../assigned-farm-land-list-view';
import RequestInfoListView from '../request-info-list-view';
import DraftsListView from '../drafts-list-view';
// ----------------------------------------------------------------------

export default function RegionOfficerPage() {

  const [assignedCount, setAssignedCount] = useState(0);

  const [requestedCount, setRequestedCount] = useState(0);

  const [draftsCount, setDraftsCount] = useState(0);

  const [farmLandCount, setFarmLandCount] = useState(0);

  const [currentTab, setCurrentTab] = useState('AssignedFarmlands');

  useEffect(() => {
    fetchAssignedFarmlands();
    fetchDraftFarmlands();
    fetchRequestedFarmlands();
    fetchAllFarmlands()
  }, []);

  const fetchAllFarmlands = async () => {
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
    }
  }

  const fetchAssignedFarmlands = async () => {
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
    }
  }

  const fetchDraftFarmlands = async () => {
    const farmlandData = {
      searchKey: null,
      status: 'Draft',
      pageNumber: 1,
      pageSize: 5
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { totalRecords } = response.data;
      setDraftsCount(totalRecords);
    } catch (error) {
      console.error(error);
    }
  }
  const fetchRequestedFarmlands = async () => {
    const farmlandData = {
      searchKey: null,
      status: 'Requested',
      pageNumber: 1,
      pageSize: 5
    };
    try {
      const response = await getFarmlands(farmlandData);
      const { totalRecords } = response.data;
      setRequestedCount(totalRecords);
    } catch (error) {
      console.error(error);
    }
  }

  const tabs = [
    {
      value: 'AssignedFarmlands',
      label: 'Assigned Farmlands',
      count: assignedCount,
    },
    {
      value: 'RequestedInfo',
      label: 'Requested Info',
      count: requestedCount,
    },
    {
      value: 'Draft',
      label: 'Drafts',
      count: draftsCount
    },
    {
      value: 'FarmlandsList',
      label: 'Farmlands List',
      count: farmLandCount
    },
  ];

  return (
    <>
      <Card sx={{ alignItems: 'center', borderRadius: 1, px: 2, mb: 2 }}>
        <CustomTabs tabs={tabs} currentTab={currentTab} onChange={setCurrentTab} />
      </Card>
      <Card sx={{
        p: 1,
        px: 2,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: 1,
        my: 1,
      }}>
        <Stack sx={{ flex: 1 }}>
          {currentTab === 'AssignedFarmlands' && <AssignedFarmLandListView />}
          {currentTab === 'RequestedInfo' && <RequestInfoListView />}
          {currentTab === 'Draft' && <DraftsListView />}
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
