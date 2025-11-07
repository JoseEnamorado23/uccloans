// src/services/loans.service.js
import api from './api';

const loansService = {
  // Finalizar préstamo
  finishLoan: async (loanId, mostrarResumen = true) => {
    try {
      const response = await api.put(`/api/prestamos/${loanId}/finalizar`, {
        mostrar_resumen: mostrarResumen
      });
      return response.data;
    } catch (error) {
      console.error('Error finalizando préstamo:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al finalizar préstamo' 
      };
    }
  },

  // Rechazar préstamo (para préstamos pendientes)
  rejectLoan: async (loanId, motivo) => {
    try {
      const response = await api.put(`/api/prestamos/${loanId}/rechazar`, {
        motivo_rechazo: motivo
      });
      return response.data;
    } catch (error) {
      console.error('Error rechazando préstamo:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al rechazar préstamo' 
      };
    }
  },

  // Aprobar préstamo (para préstamos pendientes)
  approveLoan: async (loanId) => {
    try {
      const response = await api.put(`/api/prestamos/${loanId}/aprobar`);
      return response.data;
    } catch (error) {
      console.error('Error aprobando préstamo:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al aprobar préstamo' 
      };
    }
  },

  // Extender préstamo
  extendLoan: async (loanId, motivo) => {
    try {
      const response = await api.put(`/api/prestamos/${loanId}/extender`, {
        motivo: motivo
      });
      return response.data;
    } catch (error) {
      console.error('Error extendiendo préstamo:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al extender préstamo' 
      };
    }
  },

  // Marcar como perdido
  markAsLost: async (loanId) => {
    try {
      const response = await api.put(`/api/prestamos/${loanId}/perdido`);
      return response.data;
    } catch (error) {
      console.error('Error marcando préstamo como perdido:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al marcar como perdido' 
      };
    }
  },

  // Obtener detalles del préstamo
  getLoanDetails: async (loanId) => {
    try {
      const response = await api.get(`/api/prestamos/${loanId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo detalles del préstamo:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener detalles' 
      };
    }
  }
};

export default loansService;