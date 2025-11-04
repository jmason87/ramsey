import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { setTokens, removeTokens, isAuthenticated, decodeToken, getAccessToken } from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const token = getAccessToken();
      const decoded = decodeToken(token);
      setUser({ 
        authenticated: true,
        id: decoded?.user_id,
        username: decoded?.username
      });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      setTokens(data.access, data.refresh);
      
      const decoded = decodeToken(data.access);
      setUser({ 
        authenticated: true, 
        username,
        id: decoded?.user_id
      });
      
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password, passwordConfirmation) => {
    try {
      await apiRegister(username, email, password, passwordConfirmation);
      return await login(username, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    removeTokens();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
