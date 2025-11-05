import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getLocations() {
  try {
    const URL = endpoints.locations.list;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}