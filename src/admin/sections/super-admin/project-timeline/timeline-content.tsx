import { FC } from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { TimelineItem } from './timeline-item';
import { TimelineContentProps } from './types';
import { StyledTimelineContainer } from './styles';

export const TimelineContent: FC<TimelineContentProps> = ({ timelineData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledTimelineContainer>
      <Typography variant="h6" gutterBottom>
        Project Details
      </Typography>

      <Grid container spacing={3}>
        {timelineData.map((monthGroup, monthIndex) => (
          <Grid item xs={12} key={monthIndex}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 3, mt: monthIndex > 0 ? 4 : 0 }}
            >
              {monthGroup.month}
            </Typography>

            <Box sx={{ ml: isMobile ? 0 : 2 }}>
              {monthGroup.events.map((event, eventIndex) => (
                <TimelineItem
                  key={`${monthIndex}-${eventIndex}`}
                  event={event}
                  isLast={eventIndex === monthGroup.events.length - 1}
                />
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </StyledTimelineContainer>
  );
};

export default TimelineContent;
