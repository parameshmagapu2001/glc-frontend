// ----------------------------------------------------------------------
export type IRegionRequest = {
  region_name: string;
  region_status: string;
  sub_region_tags: string | undefined;
  state_id: number;
  region_id: number | undefined;
};

export type IRegionItem = {
  region_name: string;
  region_status: string;
  sub_region_tags: string;
  state_id: number;
  region_id: number;
  created_on: string;
  state_name: string;
  no_of_areas: number;
};

export type IRegionState = {
  isLoading: boolean;
  error: Error | string | null;
  regions: IRegionItem[];
};
export type IRegionTableFilterValue = string | string[];

export type IRegionTableFilters = {
  region_name: string;
  region_status: string[];
};