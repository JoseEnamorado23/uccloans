// src/services/loanRequests.service.js - VERSIÓN DEFINITIVA
import api from './api';

// ✅ FUNCIÓN MEJORADA para hora Bogotá - funciona en cualquier timezone
const getBogotaTime = () => {
  const now = new Date();
  
  // Calcular hora Bogotá manualmente (UTC-5)
  const bogotaOffset = -5 * 60 * 60 * 1000; // UTC-5 en milisegundos
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const bogotaTime = new Date(utc + bogotaOffset);
  
  return bogotaTime;
};
  
  // Convertir "MM/DD/YYYY, HH:MM:SS" a Date object

// ✅ Formatear fecha para el backend
const formatDateForBackend = (date) => {
  return date.toISOString();
};

// ✅ Función para debug de timezone
const debugTimezone = () => {
  const now = new Date();
  const bogotaTime = getBogotaTime();
  
  console.log('🌎 DEBUG TIMEZONE:');
  console.log('📍 Hora local del navegador:', now.toString());
  console.log('📍 Hora Bogotá calculada:', bogotaTime.toString());
  console.log('🕒 ISO Local:', now.toISOString());
  console.log('🕒 ISO Bogotá:', bogotaTime.toISOString());
  console.log('⏰ Diferencia (minutos):', (bogotaTime - now) / 60000);
  
  return bogotaTime;
};

const loanRequestsService = {
  createLoanRequest: async (loanData) => {
    try {
      // ✅ Obtener hora Bogotá real
      const bogotaTime = getBogotaTime();
      
      // ✅ Debug en producción
      debugTimezone();
      
      const enrichedLoanData = {
        ...loanData,
        fecha_solicitud: formatDateForBackend(bogotaTime),
        fecha_devolucion_estimada: loanData.fecha_devolucion_estimada 
          ? formatDateForBackend(new Date(loanData.fecha_devolucion_estimada))
          : null,
        timestamp_bogota: formatDateForBackend(bogotaTime),
        // ✅ Metadata para verificar en backend
        timezone_metadata: {
          source: 'frontend-bogota',
          bogota_time: bogotaTime.toString(),
          bogota_iso: bogotaTime.toISOString(),
          client_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          calculated_at: new Date().toISOString()
        }
      };

      console.log('📤 ENVIANDO SOLICITUD CON HORA BOGOTÁ:');
      console.log('✅ Hora Bogotá:', bogotaTime.toString());
      console.log('✅ Datos:', enrichedLoanData);//esto para el commit

      // ✅ RUTAS CORREGIDAS (sin /api duplicado si tu baseURL ya lo tiene)
      const response = await api.post('/prestamos/solicitar', enrichedLoanData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando solicitud:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al crear solicitud' 
      };
    }
  },

  getPendingRequests: async () => {
    try {
      const response = await api.get('/prestamos/solicitudes-pendientes');
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
      const response = await api.get(`/prestamos/usuario/${userId}/solicitudes`);
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
      const bogotaTime = getBogotaTime();
      const requestData = {
        fecha_aprobacion: formatDateForBackend(bogotaTime),
        timestamp_aprobacion_bogota: formatDateForBackend(bogotaTime),
        timezone_metadata: {
          source: 'frontend-bogota-approval',
          bogota_time: bogotaTime.toString()
        }
      };

      const response = await api.put(`/prestamos/${loanId}/aprobar`, requestData);
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
      const bogotaTime = getBogotaTime();
      const requestData = {
        motivo_rechazo: motivo,
        fecha_rechazo: formatDateForBackend(bogotaTime),
        timestamp_rechazo_bogota: formatDateForBackend(bogotaTime),
        timezone_metadata: {
          source: 'frontend-bogota-rejection',
          bogota_time: bogotaTime.toString()
        }
      };

      const response = await api.put(`/prestamos/${loanId}/rechazar`, requestData);
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
      const response = await api.get('/implementos');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo implementos:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener implementos' 
      };
    }
  },

  // ✅ Función para verificar la configuración
  checkBogotaTime: () => {
    return debugTimezone();
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