
import { IRegionRequest } from 'src/types/regions';
import axios, { endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------

export async function getRegions() {
  try {
    const URL = endpoints.regions.list;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getStateRegions(stateId:number) {
  try {
    const URL = `${endpoints.regions.state_regions}/${stateId}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getStateAreaRegions() {
  try {
    const URL = endpoints.regions.area_regions;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getRegionDetails(regionId: number) {
  try {
    const URL = `${endpoints.regions.region_details}/${regionId}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createRegion(regionData: IRegionRequest) {
  try {
    const URL = endpoints.regions.list;
    const response = await axios.post(URL, regionData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateRegion(regionId: number, regionData: IRegionRequest) {
  try {
    const URL = `${endpoints.regions.list}/${regionId}`;
    const response = await axios.put(URL, regionData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
