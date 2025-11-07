import api from './api';

export const authService = {
  // ========== AUTENTICACIÓN DE ADMINISTRADOR SEGURA ==========
  
  // Login para administrador (ahora usa cookies HttpOnly)
  async adminLogin(credentials) {
    try {
      const response = await api.post('/api/auth/admin-login', credentials, {
        withCredentials: true // Importante para enviar cookies
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Verificar sesión de administrador
  async checkAdminSession() {
    try {
      const response = await api.get('/api/auth/admin-session', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return { success: false, message: 'Sesión no válida' };
    }
  },

  // Refrescar token de administrador
  async refreshAdminToken() {
    try {
      const response = await api.post('/api/auth/admin-refresh', {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error refrescando token' };
    }
  },

  // Logout de administrador
  async adminLogout() {
    try {
      const response = await api.post('/api/auth/admin-logout', {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      // Incluso si hay error, limpiar el estado local
      this.clearAdminData();
      throw error.response?.data || { message: 'Error en logout' };
    }
  },

  // Obtener token CSRF para formularios administrativos
  async getCSRFToken() {
    try {
      const response = await api.get('/api/auth/admin-csrf', {
        withCredentials: true
      });
      return response.data.csrfToken;
    } catch (error) {
      console.warn('No se pudo obtener token CSRF:', error);
      return null;
    }
  },

  // Verificar si el administrador está autenticado (usando cookies)
  async isAdminAuthenticated() {
    try {
      const result = await this.checkAdminSession();
      return result.success;
    } catch (error) {
      return false;
    }
  },

  // Limpiar datos de administrador del localStorage (ya no necesario pero por compatibilidad)
  clearAdminData() {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // ========== AUTENTICACIÓN DE USUARIOS (MANTENER EXISTENTE) ==========
  
  // Verificar si el usuario está autenticado
  async checkAuth() {
    // Para sesiones, el backend maneja la autenticación via cookie
    return true;
  },

  // Logout (limpiar tanto admin como usuario)
  async logout() {
    // Limpiar sesión de admin
    try {
      await this.adminLogout();
    } catch (error) {
      console.warn('Error en logout de admin:', error);
    }
    
    // Limpiar datos locales
    this.clearAdminData();
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  },

  // 🔐 Registro de usuario
  async userRegister(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // 🔐 Login de usuario
  async userLogin(email, password) {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // 👤 Obtener perfil de usuario
  async getUserProfile() {
    try {
      const token = localStorage.getItem('userToken');
      const response = await api.get('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // 📧 Solicitar recuperación de contraseña
  async forgotPassword(email) {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // 🔄 Restablecer contraseña
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // 🔍 Verificar token de usuario
  isUserAuthenticated() {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
  },

  // 💾 Guardar datos de usuario en localStorage
  saveUserData(token, userData) {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  },

  // 📥 Obtener datos de usuario desde localStorage
  getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // 🗑️ Limpiar datos de usuario
  clearUserData() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  }
};