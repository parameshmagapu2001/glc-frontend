'use client';

import { Card, Grid, Stack, Typography } from '@mui/material';
// @mui
import Container from '@mui/material/Container';
import { useCallback } from 'react';
import Image from 'src/components/image';
// components
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function RoleTypeCreateView() {

  const settings = useSettingsContext();

  const router = useRouter();

  const goToDashboard = useCallback(() => {
    router.push(paths.rm.root);
  }, [router]);

  const createRegionalOfficer = useCallback(() => {
    router.push(paths.rm.roles.create_regional_officer);
  }, [router]);

  const createIntelligenceOfficer = useCallback(() => {
    router.push(paths.rm.roles.create_intelligence_officer);
  }, [router]);


  const createFieldOfficer = useCallback(() => {
    router.push(paths.rm.roles.create_field_officer);
  }, [router]);


  const createAgent = useCallback(() => {
    router.push(paths.rm.roles.create_agent);
  }, [router]);

  return (
    <Stack
      sx={{
        backgroundColor: 'white',
        minHeight: '100vh',
        width: '100%',
        overflow: 'auto',
        borderRadius: 1,
        pt: 4,
        mt: 1,
        textAlign: 'center',
      }}
    >

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ position: 'absolute', top: 20, left: 20, cursor: 'pointer' }} // Moves to top-left
        onClick={goToDashboard}
      >
        <img src="/assets/images/backArrow.png" style={{ width: 12, height: 10 }} alt="Back Arrow" />
        <Typography variant="body2" color="text.primary">Dashboard</Typography>
      </Stack>
      <Stack sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'left', ml: '15%', color: '#717171' }}>
          Create User Role
        </Typography>

        <Container
          maxWidth={settings.themeStretch ? false : 'xl'}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 2, sm: 2 },
            mt: 4
          }}
        >
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {[ // Map through card data for cleaner code
              { onClick: createRegionalOfficer, img: '/assets/images/regionalOfficerCreate.png', text: 'Regional Officer' },
              { onClick: createIntelligenceOfficer, img: '/assets/images/intelligenceOfficerCreate.png', text: 'Intelligence Officer' },
              { onClick: createFieldOfficer, img: '/assets/images/fieldOfficerCreate.png', text: 'Field Officer' },
              { onClick: createAgent, img: '/assets/images/agentCreate.png', text: 'Agent' },
            ].map((card, index) => (
              <Grid item key={index} xs={12} sm={3} md={2} lg={2}>
                <Card
                  sx={{
                    p: 2,
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                    '&:hover': { transform: 'scale(1.02)' },
                    transition: 'transform 0.2s',
                  }}
                  onClick={card.onClick}
                >
                  <Stack direction="column" alignItems="center" spacing={2}>
                    <Image
                      src={card.img}
                      sx={{
                        height: 130,
                        width: 150,
                        objectFit: 'fit',
                        p: 2
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {card.text}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Stack>
    </Stack>

  );
}