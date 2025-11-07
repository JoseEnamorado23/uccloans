// src/services/userProfileService.js
import API from './api';

export const userProfileService = {
  // Obtener perfil completo con estadísticas
  async getUserProfile() {
    try {
      const response = await API.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error cargando perfil' };
    }
  },

  // Obtener historial de préstamos del usuario
  async getUserLoansHistory(userId, filters = {}) {
    try {
      const response = await API.get(`/api/users/${userId}/loans`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error cargando historial' };
    }
  },

  // Obtener estadísticas detalladas
  async getUserDetailedStats(userId) {
    try {
      const response = await API.get(`/api/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error cargando estadísticas' };
    }
  }
};