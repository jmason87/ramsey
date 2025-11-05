import { apiCall } from './index';

export const getCurrentUser = async () => {
  // We need to get the user ID from the token first
  const token = document.cookie.split('; ').find(row => row.startsWith('access_token='));
  if (!token) return null;
  
  const tokenValue = token.split('=')[1];
  const base64Url = tokenValue.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  const decoded = JSON.parse(jsonPayload);
  
  // Fetch the user details
  return apiCall(`/users/${decoded.user_id}/`);
};
