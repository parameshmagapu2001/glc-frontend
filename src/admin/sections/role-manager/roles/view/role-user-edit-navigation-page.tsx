'use client';

// @mui
import Container from '@mui/material/Container';
import { Stack } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import RegionalOfficerEditView from './regional-officer-edit-view';
import AgentEditView from './agent-edit-view';
import IntelligenceOfficerEditView from './intelligence-officer-edit-view';
import FieldOfficerEditView from './field-officer-edit-view';

// ----------------------------------------------------------------------

type Props = {
  id: string;
  userId: number;
};

export default function RoleUserEditNavigationPage({ id, userId }: Props) {

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {id === '7' && (
        <Stack>
          <RegionalOfficerEditView id={parseInt(id, 10)} userId={(userId)} />
        </Stack>
      )}
      {id === '8' && (
        <Stack>
          <IntelligenceOfficerEditView id={parseInt(id, 10)} userId={(userId)} />
        </Stack>
      )}
      {id === '9' && (
        <Stack>
          <FieldOfficerEditView id={parseInt(id, 10)} userId={(userId)} />
        </Stack>
      )}
      {id === '10' && (
        <Stack>
          <AgentEditView id={parseInt(id, 10)} userId={(userId)} />
        </Stack>
      )}

    </Container>
  );
}
