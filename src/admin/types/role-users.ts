// ----------------------------------------------------------------------
export type IRoleUserItem = {
  user_id: number;
  user_code: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  user_status: string;
  user_email: string;
  created_on: string;
  region: string;
  area: string;
  role_name: string;
  role_id: number;
  age: number;
  location: string;
  address: string;
  state: string;
  city_village: string;
  pin_code: string;
  aadhar_number: string;
  pan_number: string;
  state_id: number;
  region_id: number;
  area_id: number;
  aadhar_front: string;
  aadhar_back: string;
  pan_front: string;
  pan_back: string;
  profile_image: string;
};

export type IRoleUserRequest = {
  role_id: number;
  first_name: string;
  last_name: string;
  mobile_number: string;
  user_email: string;
  age: number;
  location: string;
  address: string;
  state: string;
  city_village: string;
  pin_code: string;
  aadhar_number: string;
  pan_number: string;
  state_id: number;
  region_id: number;
  area_id: number | undefined;
  aadhar_front: string | undefined;
  aadhar_back: string | undefined;
  pan_front: string | undefined;
  pan_back: string | undefined;
};

export type IRoleUserState = {
  isLoading: boolean;
  error: Error | string | null;
  roles: IRoleUserItem[];
};

export type IRoleUserTableFilterValue = string | string[];

export type IRoleUserTableFilters = {
  mobile_number: string;
  role_status: string[]
};
