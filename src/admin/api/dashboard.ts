import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getWeeklyRegisteredCount() {
  try {
    const URL = endpoints.dashboard.weekly_registered_count;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMonthlyRegisteredCount() {
  try {
    const URL = endpoints.dashboard.monthly_registered_count;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTodayRegisteredCount() {
  try {
    const URL = endpoints.dashboard.today_registered_count;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getRegisteredCount() {
  try {
    const URL = endpoints.dashboard.registered_count;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDeviceUsersCount() {
  try {
    const URL = endpoints.dashboard.device_users_count;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getRequestCount() {
  try {
    const URL = endpoints.dashboard.request_count;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMonthlyOrdersData(type: string) {
  try {
    const URL = `${endpoints.dashboard.monthly_orders_data}?type=${type}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTotalRevenue() {
  try {
    const URL = endpoints.dashboard.total_revenue;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTotalOrders() {
  try {
    const URL = endpoints.dashboard.total_orders;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSamplesForTomorrow() {
  try {
    const URL = endpoints.dashboard.samples_for_tomorrow;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getConsumerDashboardCount(consumerId: number) {
  try {
    const URL = `${endpoints.dashboard.consumer_count}?consumerId=${consumerId}`;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}