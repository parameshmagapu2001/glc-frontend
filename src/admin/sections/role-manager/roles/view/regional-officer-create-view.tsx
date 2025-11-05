'use client';

// @mui
import Container from '@mui/material/Container';
import { Link, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import RegionalOfficerNewEditForm from '../regional-officer-new-edit-form';
// ----------------------------------------------------------------------

export default function RegionalOfficerCreateView() {

  const settings = useSettingsContext();

  const router = useRouter();

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
        <Typography variant="body2" color="text.primary" sx={{ p: 1 }}>
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
            onClick={() => router.push(paths.rm.area_regions.root)}
            color="primary"
            underline="hover"
          >
            Region
          </Link>
        </Typography>

      </Stack>
      <Stack
        sx={{
          backgroundColor: 'white',
          borderRadius: 1,
          p: 2,
          mt: 1,
          spacing: 2,
        }}>
        <RegionalOfficerNewEditForm />
      </Stack>
    </Container >
  );
}