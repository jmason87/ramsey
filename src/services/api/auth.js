import Cookies from 'js-cookie';
import { API_BASE_URL } from './index';

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
};

export const register = async (username, email, password, password2) => {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, password2 }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }

  return response.json();
};

export const refreshToken = async () => {
  const refresh = Cookies.get('refresh_token');
  
  if (!refresh) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return response.json();
};
