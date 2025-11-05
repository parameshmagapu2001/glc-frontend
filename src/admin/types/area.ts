// ----------------------------------------------------------------------
export type IAreaRequest = {
  area_name: string;
  area_status: string;
  sub_area_tags: string | undefined;
  state_id: number;
  region_id: number;
  area_id: number | undefined;
};

export type IAreaItem = {
  area_name: string;
  area_status: string;
  sub_area_tags: string;
  region_id: number;
  state_id: number;
  area_id: number;
  created_on: string;
};

export type IAreaState = {
  isLoading: boolean;
  error: Error | string | null;
  regions: IAreaItem[];
};
export type IAreaTableFilterValue = string | string[];

export type IAreaTableFilters = {
  area_name: string;
};