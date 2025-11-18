// src/services/loanRequests.service.js - CON HORA BOGOTÁ
import api from './api';

// Función para obtener la hora actual en Bogotá (UTC-5)
const getBogotaTime = () => {
  // Crear fecha actual en UTC
  const now = new Date();
  
  // Convertir a hora de Bogotá (UTC-5)
  const bogotaOffset = -5 * 60; // UTC-5 en minutos
  const localOffset = now.getTimezoneOffset(); // Offset local en minutos
  const bogotaTime = new Date(now.getTime() + (bogotaOffset + localOffset) * 60000);
  
  return bogotaTime;
};

// Formatear fecha para el backend (ISO string)
const formatDateForBackend = (date) => {
  return date.toISOString();
};

const loanRequestsService = {
  createLoanRequest: async (loanData) => {
    try {
      // ✅ Agregar timestamps con hora de Bogotá
      const bogotaTime = getBogotaTime();
      const enrichedLoanData = {
        ...loanData,
        fecha_solicitud: formatDateForBackend(bogotaTime),
        // Si necesitas fecha de devolución estimada
        fecha_devolucion_estimada: loanData.fecha_devolucion_estimada 
          ? formatDateForBackend(new Date(loanData.fecha_devolucion_estimada))
          : null,
        // Timestamp adicional para auditoría
        timestamp_bogota: formatDateForBackend(bogotaTime)
      };

      const response = await api.post('/api/prestamos/solicitar', enrichedLoanData);
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
      const response = await api.get('/api/prestamos/solicitudes-pendientes');
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
      const response = await api.get(`/api/prestamos/usuario/${userId}/solicitudes`);
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
      // ✅ Agregar timestamp de aprobación en hora Bogotá
      const bogotaTime = getBogotaTime();
      const requestData = {
        fecha_aprobacion: formatDateForBackend(bogotaTime),
        timestamp_aprobacion_bogota: formatDateForBackend(bogotaTime)
      };

      const response = await api.put(`/api/prestamos/${loanId}/aprobar`, requestData);
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
      // ✅ Agregar timestamp de rechazo en hora Bogotá
      const bogotaTime = getBogotaTime();
      const requestData = {
        motivo_rechazo: motivo,
        fecha_rechazo: formatDateForBackend(bogotaTime),
        timestamp_rechazo_bogota: formatDateForBackend(bogotaTime)
      };

      const response = await api.put(`/api/prestamos/${loanId}/rechazar`, requestData);
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
      const response = await api.get('/api/implementos');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo implementos:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener implementos' 
      };
    }
  },

  // ✅ Función auxiliar para formatear fechas en el frontend
  formatBogotaDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
};

export default loanRequestsService;