'use client';

import { Grid,InputBase, InputAdornment } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { listTopPerformers } from 'src/api/agents';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import TopPerformerItem from 'src/sections/field-officer/top-performer/top-performer-item';
import { Agent } from 'src/types/agent';

function TopPerformersPage() {
  const [agents, setAgents] = useState<Agent[]>([]);


  const fetchTopPerformers = async () => {
    try {
      const res = await listTopPerformers();

      setAgents(res.data?.topAgents || []);
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  }

  useEffect(() => {
    fetchTopPerformers();
  }, []);

  return (
    <>
      <Stack sx={{ px:1 }}>
        <Stack direction="row" alignItems="center" >
          <CustomBreadcrumbs
            links={[
              {
                name: 'Dashboard',
                href: paths.fo.root,
              },
              {
                name: 'Top Performers',
              }
            ]}
          />
        </Stack>
        <InputBase
          placeholder="Search by Agent ID"
          onChange={handleSearchChange}
          sx={{
            mb:2,
            maxWidth: '30%',
            backgroundColor: 'white',
            borderRadius: 999,
            px: 2,
            py: 1,
            boxShadow: 1,
          }}
          endAdornment={
            <InputAdornment position="start">
              <SearchIcon style={{color:"#3C78B9"}}/>
            </InputAdornment>
          }
        />
        <Grid container spacing={4} gap={2} ml={0.2} mt={0.5} >
        
          {agents.map((item) => (
            <Grid key={item.userId}>
              <TopPerformerItem item={item} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </>
  );
}

export default TopPerformersPage;
