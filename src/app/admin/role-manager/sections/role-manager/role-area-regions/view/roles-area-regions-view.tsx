'use client';

import Container from '@mui/material/Container';
import { Stack } from '@mui/material';
// components
import { useSettingsContext } from 'src/app/admin/role-manager/components/settings';
import AccountsView from '../accounts-view';
import { RoleListView } from '../../roles/view';

// ----------------------------------------------------------------------
export default function RolesAreaRegionsView() {

  const settings = useSettingsContext();
  
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <AccountsView />
      <Stack sx={{ mt: 2 }}>
        <RoleListView />
      </Stack>
    </Container>
  );
}
