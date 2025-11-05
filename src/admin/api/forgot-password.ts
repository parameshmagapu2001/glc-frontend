import axios, { endpoints } from 'src/utils/axios';
import { IForgotRequest } from 'src/types/forgot-password';

// ----------------------------------------------------------------------

export async function adminGenerateAndSendOtp(loginId: string) {
  try {
    const URL = `${endpoints.auth.generate_otp}?loginId=${loginId}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function adminUpdatePasswordWithOTP(passwordData: IForgotRequest) {
  try {
    const URL = endpoints.auth.update_password;
    const response = await axios.post(URL, passwordData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}