import { forwardRef } from 'react';
// @mui
import { Box, BoxProps, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 150,
          height: 50,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <img src="/assets/images/logo.svg" alt="logo" />
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Stack>
        {logo}
      </Stack>
    );
  }
);

export default Logo;