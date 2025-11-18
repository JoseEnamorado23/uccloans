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
  // src/services/userProfileService.js - VERSIÓN CON DEBUG EXTENDIDO
async getUserDetailedStats(userId) {
  try {
    console.log('🔍 INICIANDO getUserDetailedStats...');
    console.log(`📞 Llamando a: /api/users/${userId}/stats`);
    console.log(`👤 UserID: ${userId}`);
    
    const response = await API.get(`/api/users/${userId}/stats`);
    
    console.log('✅ RESPUESTA EXITOSA:', {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ ERROR COMPLETO EN getUserDetailedStats:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.response?.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    throw error.response?.data || { message: 'Error cargando estadísticas' };
  }
}
};