// @mui
import { Stack } from '@mui/material';
import EmptyContent from '../empty-content/empty-content';

// ----------------------------------------------------------------------

export default function DeleteAccount() {
  return (
    <Stack>
      <EmptyContent
        filled
        title="Your Account has been deleted"
      />
    </Stack>
  );
}

