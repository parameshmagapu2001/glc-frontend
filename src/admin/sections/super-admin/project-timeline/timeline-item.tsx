import { FC } from 'react';
import { Box, Stack, Typography, Rating} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TimelineItemProps } from './types';
import {
  StyledTimelineContent,
  StyledEventCard,
  StyledEventTitle,
  StyledAudioPlayer,
  StyledRatingContainer,
} from './styles';

const getBorderColor = (theme: any, status: 'approved' | 'pending' | 'rejected') => {
  if (status === 'approved') return theme.palette.success.main;
  if (status === 'rejected') return theme.palette.error.main;
  return theme.palette.primary.main;
};

const TimelineDot = styled(Box)<{ status: 'approved' | 'pending' | 'rejected' }>(
  ({ theme, status }) => ({
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: '4px solid',
    borderColor: getBorderColor(theme, status),
    backgroundColor: theme.palette.background.paper,
  })
);

const TimelineConnector = styled(Box)(({ theme }) => ({
  width: 0.5,
  height: "100%",
  backgroundColor: theme.palette.primary.main,
  margin: 'auto'
}));

export const TimelineItem: FC<TimelineItemProps> = ({ event, isLast }) => {
  const { date, title, status, officer, time, icon, audioFile, ratings, reason } = event;

  return (
    <Stack direction="row" spacing={2}>
      <Box>
        <TimelineDot status={status as 'approved' | 'pending' | 'rejected'} />
        {!isLast && <TimelineConnector />}
      </Box>

      <StyledEventCard>
        {date}
      </StyledEventCard>

      <StyledTimelineContent>
        <StyledEventCard>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            {icon && (
              <Box
                component="img"
                src={icon}
                alt=""
                sx={{ width: 24, height: 24, objectFit: 'contain' }}
              />
            )}
            <StyledEventTitle variant="subtitle1">{title}</StyledEventTitle>
          </Stack>

            <Box sx={{ml:4}}>
            <Typography variant="caption" color="text.secondary" display="block">
            {date} - {time}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {officer}
          </Typography>
            
          {ratings !== undefined && (
            <StyledRatingContainer>
              <Typography variant="body2" fontWeight="bold">Rating:</Typography>
              <Rating value={ratings} readOnly size="small" />
            </StyledRatingContainer>
          )}

          {audioFile && (
            <StyledAudioPlayer>
              <Typography variant="body2" fontWeight="bold">Audio File:</Typography>
              <Box
                component="img"
                src='/assets/images/audioFile.svg'
                alt="audio"
                sx={{ width: 20, height: 20 }}
              />
              <Typography variant="body2">{audioFile}</Typography>
            </StyledAudioPlayer>
          )}

          {reason && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" component="span" fontWeight="bold">
                Reason:{' '}
              </Typography>
              <Typography variant="body2" component="span">
                {reason}
              </Typography>
            </Box>
          )}
          </Box>
        </StyledEventCard>
      </StyledTimelineContent>
    </Stack>
  );
};

export default TimelineItem;
