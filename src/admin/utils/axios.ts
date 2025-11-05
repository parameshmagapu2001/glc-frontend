import axios, { AxiosRequestConfig } from 'axios';
import { HOST_API } from 'src/config-global';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Perform logout action, e.g., clear tokens, redirect to login page
      console.log(error.response);
      logout();
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

const logout = () => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('userId');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userId');
  // Redirect to the login page
  window.location.href = paths.auth.session_expired;
};

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const postData = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.post(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/mdm-api/role-users/getUserDetails',
    login: '/api/glc-auth/loginWithPassword',
    register: '/api/auth/register',
    pre_registered_users: '/api/glc-auth/getPreRegistrationUsers',
    generate_otp: '/api/glc-auth/adminGenerateAndSendOTP',
    update_password: '/api/glc-auth/adminUpdatePasswordWithOTP',
    change_password: '/api/glc-auth/adminChangePassword',
    get_random_password: '/api/glc-auth/getRandomPassword',
    encrypted_password: '/api/glc-auth/getEncryptPassword',
  },

  dashboard: {
    weekly_registered_count: '/mdm-api/dashboard/getWeeklyRegisteredCount',
    monthly_registered_count: '/mdm-api/dashboard/getMonthlyRegisteredCount',
    today_registered_count: '/mdm-api/dashboard/getTodayRegisteredCount',
    registered_count: '/mdm-api/dashboard/getRegisteredCount',
    device_users_count: '/mdm-api/dashboard/getDeviceUsers',
    monthly_orders_data: 'oms-api/dashboard/getMonthlyOrdersData',
    samples_for_tomorrow: '/oms-api/dashboard/getSamplesForTomorrow',
    total_orders: '/oms-api/dashboard/getTotalOrders',
    total_revenue: '/oms-api/dashboard/getTotalRevenue',
    request_count: '/mdm-api/dashboard/getRequestCounts',
    consumer_count: '/oms-api/dashboard/getConsumerDashboardCounts',
  },

  roles: {
    roles_list: '/mdm-api/roles',
    role_users: '/mdm-api/role-users',
    search_users: '/mdm-api/role-users/searchUsers',
    account_count: '/mdm-api/role-users/getAccountsCount',
    officer_details: '/mdm-api/regions/getOfficerDetails',
    create_user: '/mdm-api/role-users/createUser',
    update_user: '/mdm-api/role-users/updateUser',
    area_officer_details: '/mdm-api/areas/getOfficerDetails',
    delete_user: '/mdm-api/role-users/deleteUser',
    upload_user_id_proofs: '/mdm-api/file-handler/uploadUserIdProofs',
  },

  locations: {
    list: '/mdm-api/locations',
  },

  regions: {
    list: '/mdm-api/regions',
    area_regions: '/mdm-api/regions/stateAreaRegions',
    region_details: '/mdm-api/regions',
    state_regions: '/mdm-api/regions/stateRegions',
  },

  areas: {
    list: '/mdm-api/areas',
    area_details: '/mdm-api/areas',
  },

  filters: {
    states: '/mdm-api/filters/states',
    state_regions: '/mdm-api/filters/stateRegions',
    region_area: '/mdm-api/filters/regionAreas',
  },

  farmlands: {
    farmland_alerts: '/lms-api/farmland-master/getFarmlandAlerts',
    farmland_document_sets: (id: number) =>
      `/lms-api/farmland-documents/farmlandDocumentSets/${id}`,
    createFarmland: '/lms-api/farmland-master/createFarmland',
    analytics: '/lms-api/farmland-master/getFarmlandAnalytics',
    farmland_documents: (id: number, documentSetId: number) =>
      `/lms-api/farmland-documents/farmlandDocuments/${id}/${documentSetId}`,
    document_details: (id: number, documentId: number) =>
      `/lms-api/farmland-documents/documentDetails/${id}/${documentId}`,
    update_farmland: (id: number, documentId: number) =>
      `/lms-api/farmland-documents/saveFarmlandDocument/${id}/${documentId}`,
    submit_farmland_documents: (id: number, documentId: number) =>
      `/lms-api/farmland-documents/submitFarmlandRequest/${id}/${documentId}`,
    upload_farmland_docs: '/mdm-api/file-handler/uploadFarmlandDocs',
    upload_survey_report: '/mdm-api/file-handler/uploadFarmlandSurveyReport',
    upload_farmland_cover_pic: '/mdm-api/file-handler/uploadFarmlandCoverPic',
    dimiss_farmland: (id: number) => `/lms-api/farmland-master/dismissAlert/${id}`,
    farmlands: `/lms-api/farmland-master/getFarmlands`,
    alert_details: `/lms-api/farmland-master/getAlertDetails`,
    approve_document: `/lms-api/farmland-documents/approveDocument`,
    turn_back_document: `/lms-api/farmland-documents/turnBackDocument`,
    reject_farmland: `/lms-api/farmland-documents/rejectFarmland`,
    update_agent_rating: `/lms-api/agent-farmland/updateAgentRating`,
  },

  agents: {
    topPerformers: '/lms-api/agent/getTopPerformers',
    agentDetails: (id: string) => `/lms-api/agent/getAgentDetails/${id}`,
    agentFarmlandReport: (id: string) => `/lms-api/farmland-master/getAgentFarmlandsReport/${id}`,
    agentSalesReport: (id: string) => `/lms-api/farmland-master/getAgentSalesReport/${id}`,
  },

  common: {
    get_states: '/mdm-api/filters/states',
    get_state_regions: (id: string) => `/mdm-api/filters/stateRegions/${id}`,
    get_region_areas: (id: string) => `/mdm-api/filters/regionAreas/${id}`,
    get_identifiers: '/mdm-api/filters/farmland_identifiers',
    area_agents: `/mdm-api/filters/area_agents`,
  },
};
