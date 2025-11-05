import { forwardRef } from 'react';
import NextLink from 'next/link';
import { Box, Link, BoxProps } from '@mui/material';
import Image from 'src/components/image';


// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const LogoFull = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 100,
          height: 100,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
       
       <Image src="/assets/images/logo.svg" alt="logo" width={115} height={55} />


      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default LogoFull;
