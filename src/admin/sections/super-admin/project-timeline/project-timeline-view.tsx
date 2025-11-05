import { useState } from 'react';
import { Container, Grid } from '@mui/material';
import { TimelineSidebar } from './timeline-sidebar';
import { TimelineContent } from './timeline-content';
import { StyledRoot, StyledContent } from './styles';
import { MOCK_TIMELINE_DATA } from './mock-data';

export default function ProjectTimelineView() {
  const [currentSection, setCurrentSection] = useState('project-details');

  return (
    <StyledRoot>
      <StyledContent>
        <Container maxWidth={false} disableGutters>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TimelineSidebar
                farmlandId="GLCSOS 01"
                currentSection={currentSection}
                onSectionChange={setCurrentSection}
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <TimelineContent timelineData={MOCK_TIMELINE_DATA} />
            </Grid>
          </Grid>
        </Container>
      </StyledContent>
    </StyledRoot>
  );
}
