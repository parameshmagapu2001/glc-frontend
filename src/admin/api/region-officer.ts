
import { IAssignedFarmlandRequest } from 'src/types/farmlands';
import axios, { endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------

export async function getFarmlands(data: IAssignedFarmlandRequest) {
  try {
    const URL = endpoints.farmlands.farmlands;
    const response = await axios.post(URL, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getFarmlandAlerts = async (data: IAssignedFarmlandRequest) => {
  try {
    const URL = endpoints.farmlands.farmland_alerts;
    const response = await axios.post(URL, data);
    return response;
  } catch (err) {
    console.error('ERROR: ', err);
    throw err;
  }
};

export async function approveDocument(farmlandId: number, documentId: number) {
  try {
    const URL = `${endpoints.farmlands.approve_document}/${farmlandId}/${documentId}`;
    const response = await axios.put(URL);
    return response;
  } catch (err) {
    console.error('ERROR: ', err);
    throw err;
  }
}

export async function rejectFarmland(farmlandId: number, data: any) {
  try {
    const URL = `${endpoints.farmlands.reject_farmland}/${farmlandId}`;
    const response = await axios.put(URL, data);
    return response;
  } catch (err) {
    console.error('ERROR: ', err);
    throw err;
  }
}

export async function turnBackDocument(farmlandId: number, documentId: number, data: any) {
  try {
    const URL = `${endpoints.farmlands.turn_back_document}/${farmlandId}/${documentId}`;
    const response = await axios.put(URL, data);
    return response;
  } catch (err) {
    console.error('ERROR: ', err);
    throw err;
  }
}

