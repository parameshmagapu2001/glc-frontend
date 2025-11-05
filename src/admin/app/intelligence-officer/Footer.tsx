"use client";

import { Box, Typography, Stack, Container } from '@mui/material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py:3,
      px: 2,
      backgroundColor: '#f4f6f8',
    }}
  >
    <Container maxWidth="xl">
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center"
      >
        <Typography variant="body2" color="text.secondary">
          Powered by TechGy Innovations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Copyright © 2023 Green Land Capital. All rights reserved.
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default Footer;


