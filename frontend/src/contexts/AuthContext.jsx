import { createContext, useContext, useState, useEffect } from 'react';
import api, { setToken, clearToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const checkAuth = async () => {
    try {
      // Attempt silent refresh
      const response = await api.post('/auth/refresh');
      const { accessToken, user: refreshUser } = response.data;
      
      setToken(accessToken);
      setUser(refreshUser);
    } catch (e) {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
      setInitialLoadDone(true);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      clearToken();
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken } = response.data;
    
    setToken(accessToken);
    setUser(user);
    
    return user;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user, accessToken } = response.data;
    
    setToken(accessToken);
    setUser(user);
    
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout errors
    }
    clearToken();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!initialLoadDone) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};