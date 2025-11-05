import { CustomFile } from 'src/components/upload';

// ----------------------------------------------------------------------

export type IDashboardTableFilterValue = string | string[];

export type IDashboardTableFilters = {
  name: string;
  dateRange: string[];
  status: string;
};

// ----------------------------------------------------------------------

export type IDashboardSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IDashboardProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IDashboardProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IDashboardSocialLink;
};

export type IDashboardProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IDashboardProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date;
};

export type IDashboardProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IDashboardProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

export type IDashboardCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IDashboardItem = {
  today_count: number;
  yesterday_count: number;
  percentage: number;
  this_month_count: number;
  last_month_count: number;
  this_week_count: number;
  last_week_count: number;
  consumers_count: number;
  android_count: number;
  ios_count: number;
  web_count: number;
  total: number;
  percent: number;
  pre_registration_count: number;
  address_requests_count: number;
  delete_requests_count: number;
  ticket_count: number;
  series: IseriesItem[];
};

export type IseriesItem = {
  x: number;
  y: number;
};

export type IDashboardAccount = {
  email: string;
  isPublic: boolean;
  displayName: string;
  city: string | null;
  state: string | null;
  about: string | null;
  country: string | null;
  address: string | null;
  zipCode: string | null;
  phoneNumber: string | null;
  photoURL: CustomFile | string | null;
};

export type IDashboardOrdersData = {
  categories: string[];
  data: IOrderData[];
};

export type IOrderData = {
  name: string;
  data: number[];
};


export type LoginResponse = {
  accessToken: string;
  userId: number;
  primaryRoleId: number; // Ensure this field exists in the API response
};
