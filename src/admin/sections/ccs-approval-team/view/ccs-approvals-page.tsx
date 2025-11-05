'use client';

import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import { Grid, Stack } from '@mui/material';
import { IRoleUserItem, IRoleUserTableFilters } from 'src/types/role-users';
import CustomTabs from 'src/components/tab/customTabs';
import { getFarmlands } from 'src/api/region-officer';
import FarmLandListView from '../farm-land-list-view';
import FarmLandRequestsListView from '../farm-land-requests-list-view';

// ----------------------------------------------------------------------

export default function CCSApprovalsPage() {

  const [currentTab, setCurrentTab] = useState<string>('FarmlandRequests');

  const [farmlandsEmpty, setFarmlandsEmpty] = useState(false);

  const [farmlandsLoading, setFarmlandsLoading] = useState(false);

  const [requestedCount, setRequestedCount] = useState(0);

  useEffect(() => {
    fetchAssignedFarmlands();
  }, []);

  const fetchAssignedFarmlands = async () => {
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
      value: 'FarmlandRequests',
      label: 'Farmland Requests',
      count: requestedCount,
    },
    {
      value: 'FarmlandLists',
      label: 'Farmland Lists',
      count: 0
    },
  ];

  return (
    <>
     <Card sx={{ display: 'flex', alignItems: 'center', borderRadius: '14px', px: 2, mb: 2, width: '450px', height: '51px', pt: 0.5 }}>
        <Grid container>
          <Grid item xs={12}>
            <CustomTabs tabs={tabs} currentTab={currentTab} onChange={setCurrentTab} />
          </Grid>
        </Grid>
      </Card>
      <Card sx={{
        p: 1,
        px: 2,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: 1,
        my: 1,
      }}>
        <Stack sx={{ flex: 1 }}>
          {currentTab === 'FarmlandRequests' && <FarmLandRequestsListView />}
          {currentTab === 'FarmlandLists' && <FarmLandListView />}
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

