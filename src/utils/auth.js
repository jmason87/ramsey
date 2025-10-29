import Cookies from 'js-cookie';

export const setTokens = (accessToken, refreshToken) => {
  Cookies.set('access_token', accessToken, { 
    expires: 1,
    secure: false, // false for dev
    sameSite: 'strict'  
  });
  Cookies.set('refresh_token', refreshToken, { 
    expires: 7,
    secure: false, // false for dev
    sameSite: 'strict'  
  });
};

export const getAccessToken = () => {
  return Cookies.get('access_token');
};

export const getRefreshToken = () => {
  return Cookies.get('refresh_token');
};

export const removeTokens = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
