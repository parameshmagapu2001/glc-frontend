"use client";

import { Box, Typography, Stack, Container } from '@mui/material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      pb: 2,
      px: 2,
      backgroundColor: '#f4f6f8',
    }}
  >
    <Container maxWidth={false} sx={{ maxWidth: '2560px', mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
      >
        <Typography variant="body1" color="text.primary">
          Powered by TechGy Innovations
        </Typography>
        <Typography variant="body1" color="text.primary">
          Copyright © 2023 Green Land Capital. All rights reserved.
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default Footer;

