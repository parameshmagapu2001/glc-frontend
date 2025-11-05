// ----------------------------------------------------------------------

export type IAreaRegionItem = {
  state_id: number;
  state_name: string;
  region_count: number;
  area_count: number;
};

export type IAreaRegionState = {
  isLoading: boolean;
  error: Error | string | null;
  regions: IAreaRegionItem[];
};
export type IAreaRegionTableFilterValue = string | string[];

export type IAreaRegionTableFilters = {
  state_name: string;
  region_status: string[];
};