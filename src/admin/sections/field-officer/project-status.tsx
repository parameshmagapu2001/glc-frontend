import { Box, Typography } from '@mui/material';

interface Props {
  status: string;
}

function ProjectStatus({ status }: Props) {
  const getBgColor = () => {
    switch (status) {
      case 'Pending' :
      case 'In Drafts':
      case 'Requested':
        return '#FCBE2D';
      case 'Completed':
      case 'Approved':
        return '#00B69B';
      case 'Dismissed':
      case 'Rejected':
      case 'Returned':
        return '#FD5454';
      default:
        return '#000';
    }
  };

  return (
    <Box width="110px" px="20px" py="4px" borderRadius={999} bgcolor={getBgColor()}>
      <Typography color="white" textAlign="center">{status}</Typography>
    </Box>
  );
}

export default ProjectStatus;
