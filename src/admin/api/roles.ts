
import { IRoleUserRequest } from 'src/types/role-users';
import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getRoleUsers(page: number, pageSize: number) {
  try {
    const URL = endpoints.roles.role_users;
    const response = await axios.get(URL, {
      params: {
        page,
        page_size: pageSize,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function searchUsers(search_key: string, page: number, pageSize: number) {
  try {
    const URL = `${endpoints.roles.search_users}/${search_key}`;
    const response = await axios.get(URL, {
      params: {
        page,
        page_size: pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error while searching users:', error);
    throw error;
  }
}

export async function getRoles() {
  try {
    const URL = endpoints.roles.role_users;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAccountCount() {
  try {
    const URL = endpoints.roles.account_count;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserDetails(userId: number) {
  try {
    const URL = `${endpoints.auth.me}/${userId}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOfficerDetails(roleId: number, regionId: number) {
  try {
    const URL = `${endpoints.roles.officer_details}/${roleId}/${regionId}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAreaOfficerDetails(roleId: number, regionId: number) {
  try {
    const URL = `${endpoints.roles.area_officer_details}/${roleId}/${regionId}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function createUser(userData: IRoleUserRequest) {
  try {
    const URL = `${endpoints.roles.create_user}`;
    const response = await axios.post(URL, userData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUser(userId: number, userData: IRoleUserRequest) {
  try {
    const URL = `${endpoints.roles.update_user}/${userId}`;
    const response = await axios.put(URL, userData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(userId: number) {
  try {
    const URL = `${endpoints.roles.delete_user}/${userId}`;
    const response = await axios.delete(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadUserIdProofs(fileData: FormData) {
  try {
    const URL = `${endpoints.roles.upload_user_id_proofs}`;
    const response = await axios.post(URL, fileData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
