import { IChangePasswordRequest } from 'src/types/forgot-password';
import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function changePassword(passwordData: IChangePasswordRequest) {
  try {
    const URL = endpoints.auth.change_password;
    const response = await axios.post(URL, passwordData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
