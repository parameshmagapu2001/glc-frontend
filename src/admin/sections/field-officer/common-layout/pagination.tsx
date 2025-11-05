import React from 'react';
import { Pagination, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

// Styled wrapper
const StyledPaginationWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  backgroundColor: '#fff',
  padding: '12px 24px',
  position: 'relative',
}));

const CenteredPagination = styled(Box)(() => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
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
  const startRecord = totalRecords === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endRecord = Math.min(page * rowsPerPage, totalRecords);

  return (
    <StyledPaginationWrapper>
      {/* Left-aligned text */}
      <Typography variant="body2" sx={{ color: '#666' }}>
        {totalRecords === 0
          ? 'Showing 0 of 0'
          : `Showing ${endRecord - startRecord + 1} of ${totalRecords}`}
      </Typography>

      {/* Center-aligned pagination */}
      <CenteredPagination>
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
      </CenteredPagination>
    </StyledPaginationWrapper>
  );
};

export default CustomPagination;
