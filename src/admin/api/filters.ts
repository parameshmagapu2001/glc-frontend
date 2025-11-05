import { IMapping } from 'src/types/mapping';
import axios, { endpoints, } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getFilterStates() {

  try {
    const URL = endpoints.filters.states;
    const response = await axios.get(URL);
    const categories: IMapping[] = response.data;
    return categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getFilterStateRegions(state_id: number) {
  try {
    const URL = `${endpoints.filters.state_regions}/${state_id}`;
    const response = await axios.get(URL);
    const cities: IMapping[] = response.data;
    return cities;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getFilterRegionAreas(area_id: number) {
  try {
    const URL = `${endpoints.filters.region_area}/${area_id}`;
    const response = await axios.get(URL);
    const cities: IMapping[] = response.data;
    return cities;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getFilterFarmlandIdentifiers(type: string) {
  try {
    const URL = `${endpoints.common.get_identifiers}/${type}`;
    const response = await axios.get(URL);
    const cities: IMapping[] = response.data;
    return cities;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const filterAreaAgents = async (id: string) => {
  try {
    const URL = `${endpoints.common.area_agents}/${id}`;
    const response = await axios.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};




