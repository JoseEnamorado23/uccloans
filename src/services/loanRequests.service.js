// src/services/loanRequests.service.js - CORREGIR RUTAS
import api from './api';

const loanRequestsService = {
  // ✅ CORREGIR: Agregar /api a todas las rutas
  createLoanRequest: async (loanData) => {
    try {
      const response = await api.post('/api/prestamos/solicitar', loanData); // ✅ /api/
      return response.data;
    } catch (error) {
      console.error('Error creando solicitud:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al crear solicitud' 
      };
    }
  },

  getPendingRequests: async () => {
    try {
      const response = await api.get('/api/prestamos/solicitudes-pendientes'); // ✅ /api/
      return response.data;
    } catch (error) {
      console.error('Error obteniendo solicitudes pendientes:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener solicitudes' 
      };
    }
  },

  getUserLoanRequests: async (userId) => {
    try {
      const response = await api.get(`/api/prestamos/usuario/${userId}/solicitudes`); // ✅ /api/
      return response.data;
    } catch (error) {
      console.error('Error obteniendo mis solicitudes:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener mis solicitudes' 
      };
    }
  },

  approveLoanRequest: async (loanId) => {
    try {
      const response = await api.put(`/api/prestamos/${loanId}/aprobar`); // ✅ /api/
      return response.data;
    } catch (error) {
      console.error('Error aprobando solicitud:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al aprobar solicitud' 
      };
    }
  },

  rejectLoanRequest: async (loanId, motivo) => {
    try {
      const response = await api.put(`/api/prestamos/${loanId}/rechazar`, { // ✅ /api/
        motivo_rechazo: motivo
      });
      return response.data;
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al rechazar solicitud' 
      };
    }
  },

  getAvailableImplementos: async () => {
    try {
      const response = await api.get('/api/implementos'); // ✅ /api/
      return response.data;
    } catch (error) {
      console.error('Error obteniendo implementos:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener implementos' 
      };
    }
  }
};

export default loanRequestsService;