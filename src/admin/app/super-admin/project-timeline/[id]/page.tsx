'use client';

import ProjectTimelineView from "../../../../sections/super-admin/project-timeline/project-timeline-view";

type Props = {
  params: {
    id: string;
  };
};

export default function ProjectTimelinePage({ params }: Props) {
  return <ProjectTimelineView />;
}
