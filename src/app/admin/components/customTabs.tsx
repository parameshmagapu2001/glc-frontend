'use client';

import { Box, Stack, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

interface TabItem {
  value: string;
  label: string;
  count?: number;
}

interface CustomTabsProps {
  tabs: TabItem[];
  currentTab: string;
  onChange: (tabValue: string) => void;
  sx?: React.CSSProperties;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, currentTab, onChange ,sx}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Tabs
      value={currentTab}
      onChange={(_event, newValue) => onChange(newValue)}
      variant={isMobile ? 'scrollable' : 'standard'}
      scrollButtons="auto"
      sx={{
        '& .MuiTabs-indicator': { display: 'none' },
        '& .MuiTabs-flexContainer': {
          gap: isMobile ? 0 : 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: isMobile ? 0 : 1,
        },
      }}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: currentTab === tab.value ? '#fff' : '#9E9E9E',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.75rem',
                  },
                }}
              >
                {tab.label}
              </Typography>
       
              {/* {tab.count !== undefined && tab.count > 0 && ( */}
              { index !== 3 && (

                <Box
                  sx={{
                    backgroundColor: currentTab === tab.value ? '#FFFFFF' : '#A4A3EA',
                    color: currentTab === tab.value ? '#8280FF' : '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    minWidth: 20,
                    px: '6px',
                    borderRadius: '12px',
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {tab.count}
                </Box>
              )} 
            </Stack>
          }
          
          sx={{
            textTransform: 'none',
            minHeight: '32px',
            transition: 'all 0.3s ease-in-out',
            borderRadius: '20px',
            padding: isMobile ? '10px 12px' : '1px 35px',
            backgroundColor: currentTab === tab.value ? '#8279F2' : 'transparent',
            color: currentTab === tab.value ? '#fff' : '#9E9E9E',
            '&:hover': {
              backgroundColor: currentTab === tab.value ? '#6b63c9' : 'rgba(145, 158, 171, 0.08)',
            },
            [theme.breakpoints.down('sm')]: {
              margin: '0 2px',
              padding: '4px 8px',
              borderRadius: '12px',
            },
          }}
        />
      ))}
    </Tabs>
  );
};

export default CustomTabs;
