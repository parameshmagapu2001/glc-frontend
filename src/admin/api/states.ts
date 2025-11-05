import axiosInstance, { endpoints } from 'src/utils/axios';

export const listStates = async () => {
  try {
    const URL = endpoints.common.get_states;
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const listStateRegions = async (id: string) => {
  try {
    const URL = endpoints.common.get_state_regions(id);
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const listRegionAreas = async (id: string) => {
  try {
    const URL = endpoints.common.get_region_areas(id);
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};
