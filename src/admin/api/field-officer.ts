
import axios, { endpoints } from 'src/utils/axios';
// ----------------------------------------------------------------------

export async function getAlertDetails(alert_id: string) {
  try {
    const URL = `${endpoints.farmlands.alert_details}/${alert_id}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDocumentDetails(farmlandId: number, documentId: number) {
  try {
    const URL = `${endpoints.farmlands.document_details}/${farmlandId}/${documentId}`;
    const response = await axios.put(URL);
    return response;
  } catch (err) {
    console.error('ERROR: ', err);
    throw err;
  }
}