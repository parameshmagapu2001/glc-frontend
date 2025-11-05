import axiosInstance, { endpoints } from 'src/utils/axios';

export const listTopPerformers = async () => {
  try {
    const URL = endpoints.agents.topPerformers;
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const getAgentDetails = async (id: string) => {
  try {
    const URL = endpoints.agents.agentDetails(id);
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const getAgentFarmlandReport = async (id: string) => {
  try {
    const URL = endpoints.agents.agentFarmlandReport(id);
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const getFarmlandSalesReport = async (id: string) => {
  try {
    const URL = endpoints.agents.agentSalesReport(id);
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};
