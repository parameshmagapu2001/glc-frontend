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

const defaultFilters: IRoleUserTableFilters = {
  mobile_number: '',
  role_status: []
};

// ----------------------------------------------------------------------

export default function IntelligenceOfficerPage() {

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [assignedCount, setAssignedCount] = useState(0);

  const [requestedCount, setRequestedCount] = useState(0);

  const [draftsCount, setDraftsCount] = useState(0);

  const [currentTab, setCurrentTab] = useState('AssignedFarmlands');

  useEffect(() => {
    fetchAssignedFarmlands();
    fetchDraftFarmlands();
    fetchRequestedFarmlands();
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
  const fetchDraftFarmlands = async () => {
    setFarmlandsLoading(true);
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
      setFarmlandsEmpty(false);
    }
  }
  const fetchRequestedFarmlands = async () => {
    setFarmlandsLoading(true);
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
      label: 'Farmlands List'
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