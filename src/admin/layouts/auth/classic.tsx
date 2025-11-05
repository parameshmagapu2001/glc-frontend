// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components
import LogoFull from 'src/components/logo-full/LogoFull';
// ----------------------------------------------------------------------

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {

  const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  const renderLogo = (
    <LogoFull
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 15, md: 30 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={2}
      alignItems="center"
      justifyContent="center"
      spacing={10}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center', pl: 3 }}>
        {title || 'Welcome To Green Land Capital'}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/farmLandForm.png'}
        sx={{ maxWidth: 600 }}
      />
      <Typography variant="caption" component="div">
        <Typography>
          <a href="https://akshayakalpa.org/terms_conditions.php" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>
            Terms & conditions
          </a>{' '}
          |{' '}
          <a href="https://akshayakalpa.org/privacy_policy.php" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>
            Privacy Policy
          </a>
          <br />
        </Typography>

        © All rights reserved by <Typography component="span" sx={{ color: 'primary.main' }}>Green Land Capital</Typography>
      </Typography>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {renderLogo}

      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}
