import { TimelineMonth } from './types';

export const MOCK_TIMELINE_DATA: TimelineMonth[]= [
  {
    month: 'August, 2023',
    events: [
      {
        title: 'Alert Created',
        date: '13th Aug',
        time: '04:30 am',
        officer: 'Agent: Ravi varma',
        status: 'pending',
        icon: '/assets/images/alertIcon.svg'
      },
      {
        title: 'Farmland ID:GLCSOS 01 Created by Field Officer',
        date: '16th Aug',
        time: '04:30 am',
        officer: 'Field Officer: Ravi varma',
        status: 'pending',
        icon: "/assets/images/fileIcon.svg"
      },
      {
        title: 'Farmland ID:GLCSOS 01 Uploaded by Field Officer',
        date: '24th Aug',
        time: '04:30 am',
        officer: 'Field Officer: Ravi varma',
        status: 'pending',
        icon: "/assets/images/checkedFileIcon.svg"
      },
      {
        title: 'Farmland ID:GLCSOS 01 Approved by CCS Team',
        date: '30th Aug',
        time: '04:30 am',
        officer: 'CCS Team: Ravi varma',
        status: 'approved',
        icon: "/assets/images/selected.png"
      },
      {
        title: 'Farmland ID:GLCSOS 01 Submitted to Regional Officer',
        date: '30th Aug',
        time: '04:30 am',
        officer: 'Regional Officer: Ravi varma',
        status: 'pending',
        icon: "/assets/images/fileIcon.svg"
      },
      {
        title: 'Farmland ID:GLCSOS 01 Submitted to Local Intelligence Officer',
        date: '30th Aug',
        time: '04:30 am',
        officer: 'Local Intelligence Officer: Ravi varma',
        status: 'pending',
        icon: "/assets/images/fileIcon.svg"
      },
    ],
  },
  {
    month: 'September, 2023',
    events: [
      {
        title: 'Farmland ID:GLCSOS 01 Uploaded by Regional Officer',
        date: '18th Sep',
        time: '04:30 am',
        officer: 'Regional Officer: Ravi varma',
        status: 'approved',
        icon: "/assets/images/checkedFileIcon.svg",
        audioFile: 'File_name.mp3',
        ratings: 4,
        reason:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      },
      {
        title: 'Farmland ID:GLCSOS 01 Uploaded by Local Intelligence Officer',
        date: '20th Sep',
        time: '04:30 am',
        officer: 'Local Intelligence Officer: Ravi varma',
        status: 'pending',
        icon: "/assets/images/checkedFileIcon.svg",
      },
      {
        title: 'Farmland ID:GLCSOS 01 Submitted to Officer 1',
        date: '22nd Sep',
        time: '04:30 am',
        officer: 'Officer 1: Ravi varma',
        status: 'approved',
        icon: "/assets/images/fileIcon.svg",
      },
      {
        title: 'Farmland ID:GLCSOS 01 Approved by Officer 1',
        date: '22nd Sep',
        time: '04:30 am',
        officer: 'Officer 1: Ravi varma',
        status: 'approved',
        icon: "/assets/images/selected.png",
        audioFile: 'File_name.mp3',
        ratings: 4,
        reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        title: 'Farmland ID:GLCSOS 01 Submitted to Officer 2',
        date: '22nd Sep',
        time: '04:30 am',
        officer: 'Officer 2: Ravi varma',
        status: 'pending',
        icon: "/assets/images/fileIcon.svg",
      },
      {
        title: 'Farmland ID:GLCSOS 01 Turned Back by Officer 2',
        date: '22nd Sep',
        time: '04:30 am',
        officer: 'Officer 2: Ravi varma',
        status: 'rejected',
        icon: "/assets/images/cancelIcon.svg",
        reason:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      },
      {
        title: 'Farmland ID:GLCSOS 01 Turned Back to Regional Officer',
        date: '22nd Sep',
        time: '04:30 am',
        officer: 'Regional Officer: Ravi varma',
        status: 'pending',
        icon: "/assets/images/pendingIcon.svg",
      },
      {
        title: 'Farmland ID:GLCSOS 01 Re-submitted to Officer 2 by Regional Officer',
        date: '25th Sep',
        time: '04:30 am',
        officer: 'Officer 2: Ravi varma',
        status: 'pending',
        icon: "/assets/images/redFile.svg",
      },
      {
        title: 'Farmland ID:GLCSOS 01 Approved by Officer 2',
        date: '29th Sep',
        time: '04:30 am',
        officer: 'Officer 2: Ravi varma',
        status: 'approved',
        icon: "/assets/images/selected.png",
        audioFile: 'File_name.mp3',
        ratings: 4,
        reason:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      },
      {
        title: 'Farmland ID:GLCSOS 01 Submitted to Officer 3',
        date: '29th Sep',
        time: '04:30 am',
        officer: 'Officer 3: Ravi varma',
        status: 'pending',
        icon: "/assets/images/fileIcon.svg",
      },
    ],
  },
  {
    month: 'October, 2023',
    events: [
      {
        title: 'Farmland ID:GLCSOS 01 Approved by Officer 3',
        date: '04th Oct',
        time: '04:30 am',
        officer: 'Officer 3: Ravi varma',
        status: 'approved',
        icon: "/assets/images/selected.png",
      },
      {
        title: 'Farmland ID:GLCSOS 01 Submitted to Super Admin',
        date: '04th Oct',
        time: '04:30 am',
        officer: 'Super Admin: Ravi varma',
        status: 'pending',
        icon: "/assets/images/fileIcon.svg",
      },
      {
        title: 'Farmland ID:GLCSOS 01 Approved by Super Admin',
        date: '06th Oct',
        time: '04:30 am',
        officer: 'Super Admin: Ravi varma',
        status: 'approved',
        icon: "/assets/images/selected.png",
        audioFile: 'File_name.mp3',
        ratings: 5,
        reason: 'Final approval granted after thorough review.',
      },
      {
        title: 'Farmland ID:GLCSOS 01 Live in Website',
        date: '06th Oct',
        time: '04:30 am',
        officer: 'System',
        status: 'approved',
        icon: "/assets/images/selected.png",
      },
    ],
  },
];


export const NAVIGATION_ITEMS = [
  { id: 'project-details', label: 'Project Details', icon: '/assets/images/selected.png' },
  { id: 'customer-info', label: 'Customer Information', icon: '/assets/images/selected.png' },
  { id: 'legal-docs', label: 'Legal Documents', icon: '/assets/images/selected.png' },
  { id: 'agriculture-report', label: 'Agriculture Report', icon: '/assets/images/selected.png' },
  { id: 'land-boundaries', label: 'Land & Boundaries', icon: '/assets/images/selected.png' },
  { id: 'valuation', label: 'Valuation', icon: '/assets/images/selected.png' },
  { id: 'local-intelligence', label: 'Local Intelligence', icon: '/assets/images/selected.png' },
];
