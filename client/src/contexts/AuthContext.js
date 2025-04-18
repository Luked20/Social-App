import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const token = localStorage.getItem('@CloneSocial:token');
      const storedUser = localStorage.getItem('@CloneSocial:user');

      if (token && storedUser) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      localStorage.removeItem('@CloneSocial:token');
      localStorage.removeItem('@CloneSocial:user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('@CloneSocial:token', token);
      localStorage.setItem('@CloneSocial:user', JSON.stringify(userData));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem('@CloneSocial:token', token);
      localStorage.setItem('@CloneSocial:user', JSON.stringify(newUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(newUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao registrar'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('@CloneSocial:token');
    localStorage.removeItem('@CloneSocial:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      const updatedUser = { ...user, ...response.data };
      
      localStorage.setItem('@CloneSocial:user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao atualizar perfil'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 