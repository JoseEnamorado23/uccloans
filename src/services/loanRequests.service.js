// src/services/loanRequests.service.js - CORREGIDO PARA PRODUCCIÓN
import API from './api';

// ✅ FUNCIÓN MEJORADA para hora Bogotá
const getBogotaTime = () => {
  const now = new Date();
  
  // Calcular hora Bogotá manualmente (UTC-5)
  const bogotaOffset = -5 * 60 * 60 * 1000; // UTC-5 en milisegundos
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const bogotaTime = new Date(utc + bogotaOffset);
  
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
        fecha_devolucion_estimada: loanData.fecha_devolucion_estimada 
          ? formatDateForBackend(new Date(loanData.fecha_devolucion_estimada))
          : null,
        timestamp_bogota: formatDateForBackend(bogotaTime)
      };

      console.log('📤 Enviando solicitud con hora Bogotá:', bogotaTime.toString());
      
      // ✅ RUTA RELATIVA - usa el baseURL configurado en api.js
      const response = await API.post('/api/prestamos/solicitar', enrichedLoanData);
      return response.data;
    } catch (error) {
      console.error('Error creando solicitud:', error);
      console.error('Detalles error:', error.response?.data);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al crear solicitud' 
      };
    }
  },

  getPendingRequests: async () => {
    try {
      const response = await API.get('/api/prestamos/solicitudes-pendientes');
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
      const response = await API.get(`/api/prestamos/usuario/${userId}/solicitudes`);
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

      const response = await API.put(`/api/prestamos/${loanId}/aprobar`, requestData);
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

      const response = await API.put(`/api/prestamos/${loanId}/rechazar`, requestData);
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
      const response = await API.get('/api/implementos');
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
  },

  // ✅ Función para verificar conexión
  checkConnection: async () => {
    try {
      const response = await API.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Error verificando conexión:', error);
      return { success: false, message: 'Sin conexión al backend' };
    }
  }
};

export default loanRequestsService;