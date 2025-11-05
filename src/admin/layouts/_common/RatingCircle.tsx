import { Box, CircularProgress, Avatar} from '@mui/material';

const RatingCircle = ({ imageUrl, rating }: { imageUrl: string; rating: number }) => {
  const progress = (rating / 5) * 100;

  return (
    <Box sx={{ position: 'relative', width: 120, height: 120 }}>
      {/* Progress Ring */}
      <CircularProgress
        variant="determinate"
        value={progress}
        size={125}
        thickness={0.5}
        sx={{
          color: '#4CAF50', // Green progress
          position: 'absolute',
          top: -2,
          left: -2,
          zIndex: 1,
        }}
      />
      {/* Background Ring (for remaining circle) */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={125}
        thickness={0.5}
        sx={{
          color: '#E0E0E0',
          position: 'absolute',
          top: -2,
          left: -2,
        }}
      />
      {/* Avatar */}
      <Avatar
        src={imageUrl}
        sx={{
          width: 100,
          height: 100,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }}
      />
      {/* Rating Badge */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translate(50%, -50%)',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '50%',
          width:15,
          height: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8px',
          fontWeight: 'bold',
          zIndex: 3,
        }}
      >
        {rating.toFixed(1)}
      </Box>
    </Box>
  );
};

export default RatingCircle;

