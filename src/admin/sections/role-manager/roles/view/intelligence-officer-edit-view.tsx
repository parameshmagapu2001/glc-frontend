'use client';

// @mui
import Container from '@mui/material/Container';
import { Link, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { IRoleUserItem } from 'src/types/role-users';
import { getUserDetails } from 'src/api/roles';
import IntelligenceOfficerNewEditForm from '../intelligence-officer-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: number;
  userId: number;
};

export default function IntelligenceOfficerEditView({ id, userId }: Props) {

  const settings = useSettingsContext();

  const [usersLoading, setUsersLoading] = useState(false);

  const [usersEmpty, setUsersEmpty] = useState(false);

  const [currentPromotion, setCurrentPromotion] = useState<IRoleUserItem>();

  const router = useRouter();

  useEffect(() => {
    fetchUserDetails(userId)
  }, [userId]);

  const fetchUserDetails = async (user_id: number) => {
    setUsersLoading(true);
    try {
      const response = await getUserDetails(user_id);
      console.log(response)
      setCurrentPromotion(response.data);
    } catch (error) {
      console.error(error);
      setUsersEmpty(true);
    } finally {
      setUsersLoading(false);
    }
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction='row' alignItems='center' spacing={1} sx={{ ml: 1 }}>
      <Image
          src="/assets/images/backArrow.png"
          alt="Back Arrow"
          width={12}
          height={10}
          onClick={() => router.push(paths.rm.root)}
          style={{ cursor: 'pointer' }}
        />
        <Typography variant="body2" color="text.primary" sx={{ p: 2 }}>
          <Link
            component="button"
            onClick={() => router.push(paths.rm.root)}
            color="inherit"
            underline="hover"
          >
            Dashboard
          </Link>
          &nbsp;/&nbsp;
          <Link
            component="button"
            onClick={() => router.push(paths.rm.roles.root)}
            color="primary"
            underline="hover"
          >
            Role Users
          </Link>
        </Typography>

      </Stack>
      <Stack
        sx={{
          backgroundColor: 'white',
          minHeight: '100vh',  // Use minHeight instead of height
          borderRadius: 1,
          p: 2,
          mt: 1,
          spacing: 2,
        }}>
        <IntelligenceOfficerNewEditForm
          userId={userId}
          currentUser={currentPromotion}
        />
      </Stack>
    </Container>
  );
}