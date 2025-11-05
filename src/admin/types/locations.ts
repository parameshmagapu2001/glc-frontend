// ----------------------------------------------------------------------
export type ILocationRequest= {
  region_id: number;
  area: string;
  subarea: string;
  visible_to: string
  location_status:string;
};

export type ILocationItem = {
  location_id: number;
  region_id: number;
  region: string;
  area: string;
  subarea: string;
  hub_name: string;
  hub_count: number;
  visible_to: string
  created_on: Date | string | number;
  location_status:string;
  region_name: string;
};

export type ILocationState = {
  isLoading: boolean;
  error: Error | string | null;
  locations: ILocationItem[];
};
export type ILocationTableFilterValue = string | string[];

export type ILocationTableFilters = {
  area: string;
  hub_name: string;
  region_name:string;
  location_status:string[];
};