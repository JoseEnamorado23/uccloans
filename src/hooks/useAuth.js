// src/hooks/useAuth.js
import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/authService';

// Crear contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si el usuario está autenticado
  const checkUserAuth = async () => {
    try {
      setLoading(true);
      
      if (authService.isUserAuthenticated()) {
        const userData = authService.getUserData();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      authService.clearUserData();
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    checkUserAuth();
  }, []);

  // 🔐 Registro de usuario
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.userRegister(userData);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage = error.message || 'Error en el registro';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Login de usuario
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.userLogin(email, password);
      
      if (result.success) {
        authService.saveUserData(result.data.token, result.data.user);
        setUser(result.data.user);
        return { success: true, user: result.data.user };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage = error.message || 'Error en el login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 👨‍💼 Login de administrador (VERSIÓN SEGURA)
  const adminLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.adminLogin(credentials);
      
      if (result.success) {
        const adminUser = {
          ...result.data.user,
          isAdmin: true
        };
        // Ya no necesitamos guardar en localStorage - las cookies HttpOnly se manejan automáticamente
        setUser(adminUser);
        return { success: true, user: adminUser };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage = error.message || 'Error en el login de administrador';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Refrescar sesión de administrador
  const refreshAdminSession = async () => {
    try {
      const result = await authService.refreshAdminToken();
      if (result.success) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.warn('Error refrescando sesión:', error);
      return { success: false };
    }
  };

  // 🔍 Verificar sesión de administrador
  const checkAdminSession = async () => {
    try {
      const result = await authService.checkAdminSession();
      if (result.success) {
        const adminUser = {
          ...result.data.user,
          isAdmin: true
        };
        setUser(adminUser);
        return { success: true, user: adminUser };
      }
      return { success: false };
    } catch (error) {
      console.warn('Error verificando sesión:', error);
      return { success: false };
    }
  };

  // 🚪 Logout (VERSIÓN SEGURA)
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Error en logout:', error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  // 📧 Recuperación de contraseña
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.forgotPassword(email);
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Error en recuperación de contraseña';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Restablecer contraseña
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.resetPassword(token, newPassword);
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Error restableciendo contraseña';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Verificar si es administrador
  const isAdmin = () => {
    return user?.isAdmin || user?.type === 'admin';
  };

  // 🔍 Verificar si es usuario normal
  const isUser = () => {
    return user && !(user?.isAdmin || user?.type === 'admin');
  };

  const value = {
    // Estado
    user,
    loading,
    error,
    
    // Acciones
    register,
    login,
    adminLogin,
    logout,
    forgotPassword,
    resetPassword,
    
    // Nuevas funciones de administrador seguras
    refreshAdminSession,
    checkAdminSession,
    
    // Utilidades
    isAuthenticated: !!user,
    isAdmin,
    isUser,
    clearError: () => setError(null)
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};