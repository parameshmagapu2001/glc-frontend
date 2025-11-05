// ----------------------------------------------------------------------
export type IRoleItem = {
  roleID: number;
  name: string;
  role: string;
  email:string;
  contactDetails:string
};

export type IRoleState = {
  isLoading: boolean;
  error: Error | string | null;
  roles: IRoleItem[];
};

export type IRoleTableFilterValue = string | string[];

export type IRoleTableFilters = {
  name: string;
  role_status: string[]
};
