import React from 'react';
import { Pagination, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Styled pagination container
const StyledPaginationContainer = styled(Stack)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  backgroundColor: '#fff',
}));

interface PaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  totalRecords: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({
  count,
  page,
  rowsPerPage,
  totalRecords,
  onChange,
}) => {
  const startRecord = totalRecords === 0 ? 0 : page * rowsPerPage + 1;
  const endRecord = Math.min((page + 1) * rowsPerPage, totalRecords);
  return (
    <StyledPaginationContainer direction="row">
      {/* Records Count */}
      <Typography variant="body2" sx={{ color: '#666' }}>
        {totalRecords === 0
          ? 'Showing 0 of 0 records'
          : `Showing ${endRecord - startRecord + 1} of ${totalRecords} records`}
      </Typography>

      {/* Pagination Component */}
      <Stack direction="row" justifyContent="center" flex={1}>
        <Pagination
          count={count}
          page={page}
          onChange={onChange}
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
        />
      </Stack>
    </StyledPaginationContainer>
  );
};

export default CustomPagination;
