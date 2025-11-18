// src/services/loanRequests.service.js - VERSIÓN DEFINITIVA CORREGIDA
import API from './api';

// ✅ FUNCIÓN DEFINITIVA CORREGIDA PARA HORA BOGOTÁ
const getBogotaTime = () => {
  const now = new Date();
  
  // Bogotá = UTC-5 
  // Convertir hora local a UTC y luego aplicar offset de Bogotá
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const bogotaTime = new Date(utc - (5 * 60 * 60 * 1000));
  
  console.log('🎯 CÁLCULO HORA BOGOTÁ:');
  console.log('📍 Hora local servidor:', now.toString());
  console.log('📍 Hora Bogotá calculada:', bogotaTime.toString());
  console.log('⏰ Hora actual ~', now.getHours() + ':' + now.getMinutes());
  console.log('⏰ Hora Bogotá ~', bogotaTime.getHours() + ':' + bogotaTime.getMinutes());
  
  return bogotaTime;
};

// Formatear fecha para el backend
const formatDateForBackend = (date) => {
  return date.toISOString();
};

const loanRequestsService = {
  createLoanRequest: async (loanData) => {
    try {
      console.log('🚀 INICIANDO SOLICITUD DE PRÉSTAMO');
      console.log('📦 Datos recibidos:', loanData);
      
      const bogotaTime = getBogotaTime();
      
      const enrichedLoanData = {
        ...loanData,
        fecha_solicitud: formatDateForBackend(bogotaTime),
        fecha_devolucion_estimada: loanData.fecha_devolucion_estimada 
          ? formatDateForBackend(new Date(loanData.fecha_devolucion_estimada))
          : null,
        timestamp_bogota: formatDateForBackend(bogotaTime),
        // ✅ Información de debug para verificar en backend
        debug_time: {
          hora_bogota_calculada: bogotaTime.toString(),
          hora_bogota_iso: bogotaTime.toISOString(),
          hora_bogota_legible: bogotaTime.toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          horas: bogotaTime.getHours(),
          minutos: bogotaTime.getMinutes(),
          segundos: bogotaTime.getSeconds(),
          timestamp_unix: Math.floor(bogotaTime.getTime() / 1000),
          timezone: 'America/Bogota',
          offset: -5
        }
      };

      console.log('📤 ENVIANDO AL BACKEND:');
      console.log('🕒 Hora Bogotá enviada:', enrichedLoanData.debug_time.hora_bogota_legible);
      console.log('🕒 Hora (HH:MM):', enrichedLoanData.debug_time.horas + ':' + enrichedLoanData.debug_time.minutos);
      console.log('🌐 Endpoint:', API.defaults.baseURL + '/api/prestamos/solicitar');
      
      const response = await API.post('/api/prestamos/solicitar', enrichedLoanData);
      
      console.log('✅ RESPUESTA BACKEND:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR EN SOLICITUD:');
      console.error('Mensaje:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('URL:', error.config?.url);
      
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al crear solicitud' 
      };
    }
  },

  getPendingRequests: async () => {
    try {
      console.log('📋 Obteniendo solicitudes pendientes...');
      const response = await API.get('/api/prestamos/solicitudes-pendientes');
      console.log('✅ Solicitudes pendientes obtenidas:', response.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo solicitudes pendientes:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener solicitudes' 
      };
    }
  },

  getUserLoanRequests: async (userId) => {
    try {
      console.log('👤 Obteniendo solicitudes del usuario:', userId);
      const response = await API.get(`/api/prestamos/usuario/${userId}/solicitudes`);
      console.log('✅ Solicitudes usuario obtenidas:', response.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo mis solicitudes:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener mis solicitudes' 
      };
    }
  },

  approveLoanRequest: async (loanId) => {
    try {
      const bogotaTime = getBogotaTime();
      console.log('✅ Aprobando solicitud:', loanId);
      console.log('🕒 Hora aprobación Bogotá:', bogotaTime.getHours() + ':' + bogotaTime.getMinutes());
      
      const requestData = {
        fecha_aprobacion: formatDateForBackend(bogotaTime),
        timestamp_aprobacion_bogota: formatDateForBackend(bogotaTime),
        debug_aprobacion: {
          hora_bogota: bogotaTime.getHours() + ':' + bogotaTime.getMinutes(),
          timestamp: bogotaTime.getTime()
        }
      };

      const response = await API.put(`/api/prestamos/${loanId}/aprobar`, requestData);
      console.log('✅ Solicitud aprobada exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error aprobando solicitud:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al aprobar solicitud' 
      };
    }
  },

  rejectLoanRequest: async (loanId, motivo) => {
    try {
      const bogotaTime = getBogotaTime();
      console.log('❌ Rechazando solicitud:', loanId);
      console.log('🕒 Hora rechazo Bogotá:', bogotaTime.getHours() + ':' + bogotaTime.getMinutes());
      console.log('📝 Motivo:', motivo);
      
      const requestData = {
        motivo_rechazo: motivo,
        fecha_rechazo: formatDateForBackend(bogotaTime),
        timestamp_rechazo_bogota: formatDateForBackend(bogotaTime),
        debug_rechazo: {
          hora_bogota: bogotaTime.getHours() + ':' + bogotaTime.getMinutes(),
          timestamp: bogotaTime.getTime()
        }
      };

      const response = await API.put(`/api/prestamos/${loanId}/rechazar`, requestData);
      console.log('✅ Solicitud rechazada exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error rechazando solicitud:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al rechazar solicitud' 
      };
    }
  },

  getAvailableImplementos: async () => {
    try {
      console.log('🛠️ Obteniendo implementos disponibles...');
      const response = await API.get('/api/implementos');
      console.log('✅ Implementos obtenidos:', response.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo implementos:', error);
      throw error.response?.data || { 
        success: false, 
        message: 'Error de conexión al obtener implementos' 
      };
    }
  },

  // ✅ Función para test rápido de hora
  testHoraBogota: () => {
    console.log('🧪 TEST RÁPIDO HORA BOGOTÁ');
    const now = new Date();
    const bogotaTime = getBogotaTime();
    
    const resultado = {
      hora_local: now.toString(),
      hora_bogota: bogotaTime.toString(),
      hora_bogota_legible: bogotaTime.toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        dateStyle: 'full',
        timeStyle: 'long'
      }),
      diferencia_horas: bogotaTime.getHours() - now.getHours(),
      es_correcta: Math.abs(bogotaTime.getHours() - now.getHours()) <= 1
    };
    
    console.log('📊 RESULTADO TEST:', resultado);
    return resultado;
  },

  // ✅ Función auxiliar para formatear fechas en el frontend
  formatBogotaDate: (dateString) => {
    try {
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
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return dateString;
    }
  },

  // ✅ Función para verificar conexión con backend
  healthCheck: async () => {
    try {
      console.log('🏥 Health check al backend...');
      const response = await API.get('/api/health');
      console.log('✅ Health check exitoso:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Health check falló:', error);
      return { 
        success: false, 
        message: 'Backend no disponible',
        error: error.message 
      };
    }
  }
};

export default loanRequestsService;