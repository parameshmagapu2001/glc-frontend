import { ICreateFarmlandBody } from 'src/types/farmlands';
import axiosInstance, { endpoints } from 'src/utils/axios';


export const getFarmlandAlerts = async () => {
  try {
    const URL = endpoints.farmlands.farmland_alerts;
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.error('ERROR: ', err);
    throw err;
  }
};

export const getFarmlandDocumentSets = async (id: number) => {
  try {
    const URL = endpoints.farmlands.farmland_document_sets(id);
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const createFarmland = async (body: ICreateFarmlandBody) => {
  try {
    const URL = endpoints.farmlands.createFarmland;
    const response = await axiosInstance.post(URL, body);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const getFarmlandsAnalytics = async () => {
  try {
    const URL = endpoints.farmlands.analytics;
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const getFarmlandDocuments = async (farmlandId: number, documentSetId: number) => {
  try {
    const URL = endpoints.farmlands.farmland_documents(farmlandId, documentSetId);
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const fetchDocumentDetails = async (farmlandId: number, documentId: number) => {
  try {
    const URL = endpoints.farmlands.document_details(farmlandId, documentId);
    const response = await axiosInstance.get(URL);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const saveFarmlandDocument = async (
  farmlandId: number,
  documentId: number,
  body: any
) => {
  try {
    const URL = endpoints.farmlands.update_farmland(farmlandId, documentId);
    const response = await axiosInstance.put(URL, body);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const submitFarmlandDocument = async (
  farmlandId: number,
  documentId: number,
  body: any
) => {
  try {
    const URL = endpoints.farmlands.submit_farmland_documents(farmlandId, documentId);
    const response = await axiosInstance.put(URL, body);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const uploadFarmlandImage = async (farmlandId: number, documentId: number, file: File) => {
  try {
    const URL = endpoints.farmlands.upload_farmland_cover_pic;

    const formData = new FormData();

    formData.append('file', file)
    formData.append('farmland_id', `${farmlandId}`);
    formData.append('document_id', `${documentId}`);

    const response = await axiosInstance.post(URL, formData);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const uploadFarmlandDocs = async (farmlandId: number, documentId: number, files: File[]) => {
  try {
    const URL = endpoints.farmlands.upload_farmland_docs;

    const formData = new FormData();

    // eslint-disable-next-line no-plusplus
    files.forEach((item) => formData.append('files', item));
    formData.append('farmland_id', `${farmlandId}`);
    formData.append('document_id', `${documentId}`);

    const response = await axiosInstance.post(URL, formData);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};



export const uploadFarmlandSurveyReport = async (farmlandId: number, documentId: number,
  surveyType: string,
  files: File[]) => {
  try {
    const URL = endpoints.farmlands.upload_survey_report;

    const formData = new FormData();

    files.forEach((item) => formData.append('files', item));
    formData.append('farmland_id', `${farmlandId}`);
    formData.append('document_id', `${documentId}`);
    formData.append('survey_type', `${surveyType}`);
    const response = await axiosInstance.post(URL, formData);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};


export const dismissFarmland = async (alertId: number, reason: string) => {
  try {
    const URL = endpoints.farmlands.dimiss_farmland(alertId);
    const response = await axiosInstance.put(URL, { reason });
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

export const updateAgentRating = async (data: any) => {
  try {
    const URL = endpoints.farmlands.update_agent_rating;
    const response = await axiosInstance.put(URL, data);
    return response;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};
