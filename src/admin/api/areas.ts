
import { IAreaRequest } from 'src/types/area';
import axios, { endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------

export async function getAreas() {
  try {
    const URL = endpoints.areas.list;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createArea(regionData: IAreaRequest) {
  try {
    const URL = endpoints.areas.list;
    const response = await axios.post(URL, regionData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateArea(areaId: number, regionData: IAreaRequest) {
  try {
    const URL = `${endpoints.areas.list}/${areaId}`;
    const response = await axios.put(URL, regionData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}