import Cookies from 'js-cookie';
import { refreshToken } from './auth';

export const API_BASE_URL = 'http://localhost:8000/api';

const getHeaders = () => {
  const token = Cookies.get('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: getHeaders(),
    });

    if (response.status === 401) {
      const refreshData = await refreshToken();
      Cookies.set('access_token', refreshData.access, { expires: 1 });
      
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: getHeaders(),
      });

      if (!retryResponse.ok) {
        throw new Error('Request failed after token refresh');
      }

      return retryResponse.json();
    }

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export * from './auth';
export * from './communities';