export type TimelineStatus = 'approved' | 'pending' | 'rejected';

export interface TimelineEvent {
  date: string;
  title: string;
  status: TimelineStatus;
  officer: string;
  time: string;
  icon?: string;
  audioFile?: string;
  ratings?: number;
  reason?: string;
}

export interface TimelineMonth {
  month: string;
  events: TimelineEvent[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

export interface TimelineData {
  farmlandId: string;
  timelineEvents: TimelineMonth[];
}

export interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

export interface TimelineSidebarProps {
  farmlandId: string;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export interface TimelineContentProps {
  timelineData: TimelineMonth[];
}
