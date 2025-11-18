// src/services/loanRequests.service.js - VERSIÓN DEBUG COMPLETA
import API from './api';

// ✅ FUNCIÓN DEBUG PARA HORA BOGOTÁ
const getBogotaTime = () => {
  const now = new Date();
  
  console.log('🔍 DEBUG getBogotaTime():');
  console.log('Hora LOCAL del servidor Vercel:', now.toString());
  console.log('Hora LOCAL ISO:', now.toISOString());
  console.log('Timezone Offset local:', now.getTimezoneOffset(), 'minutos');
  
  // Diferentes métodos para calcular hora Bogotá
  const method1 = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
  const method2 = new Date(now.getTime() - (5 * 60 * 60 * 1000)); // UTC-5 directo
  const method3 = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) - (5 * 60 * 60 * 1000));
  
  console.log('Método 1 (toLocaleString):', method1.toString());
  console.log('Método 2 (UTC-5 directo):', method2.toString());
  console.log('Método 3 (offset calc):', method3.toString());
  
  // Usar método 2 (más simple)
  const bogotaTime = method2;
  
  console.log('✅ Hora Bogotá seleccionada:', bogotaTime.toString());
  console.log('✅ Hora Bogotá ISO:', bogotaTime.toISOString());
  console.log('✅ Hora en Bogotá:', bogotaTime.getHours() + ':' + bogotaTime.getMinutes());
  
  return bogotaTime;
};

// Formatear fecha para el backend
const formatDateForBackend = (date) => {
  return date.toISOString();
};

const loanRequestsService = {
  createLoanRequest: async (loanData) => {
    try {
      console.log('🚀 INICIANDO createLoanRequest');
      console.log('📦 Datos recibidos:', loanData);
      
      const bogotaTime = getBogotaTime();
      
      const enrichedLoanData = {
        ...loanData,
        // ✅ Enviar múltiples formatos para debug
        fecha_solicitud: formatDateForBackend(bogotaTime),
        fecha_solicitud_iso: bogotaTime.toISOString(),
        fecha_solicitud_legible: bogotaTime.toString(),
        fecha_solicitud_bogota: bogotaTime.toLocaleString('es-CO', {
          timeZone: 'America/Bogota',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        timestamp_bogota: bogotaTime.getTime(),
        hora_bogota: bogotaTime.getHours(),
        minuto_bogota: bogotaTime.getMinutes(),
        segundo_bogota: bogotaTime.getSeconds(),
        // Metadata de timezone
        timezone_info: {
          cliente: Intl.DateTimeFormat().resolvedOptions().timeZone,
          objetivo: 'America/Bogota',
          offset_objetivo: -5,
          timestamp_creacion: Date.now()
        }
      };

      console.log('📤 DATOS QUE SE ENVIARÁN AL BACKEND:');
      console.log('📍 fecha_solicitud (ISO):', enrichedLoanData.fecha_solicitud);
      console.log('📍 fecha_solicitud_legible:', enrichedLoanData.fecha_solicitud_legible);
      console.log('📍 fecha_solicitud_bogota:', enrichedLoanData.fecha_solicitud_bogota);
      console.log('🕒 Hora en Bogotá:', enrichedLoanData.hora_bogota + ':' + enrichedLoanData.minuto_bogota);
      console.log('📊 Datos completos:', JSON.stringify(enrichedLoanData, null, 2));

      console.log('🌐 Enviando a:', API.defaults.baseURL + '/api/prestamos/solicitar');
      
      const response = await API.post('/api/prestamos/solicitar', enrichedLoanData);
      
      console.log('✅ Respuesta del backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR EN createLoanRequest:');
      console.error('Mensaje:', error.message);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      
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
      console.log('👤 Obteniendo solicitudes del usuario:', userId);
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
      const bogotaTime = getBogotaTime();
      console.log('✅ Aprobando solicitud:', loanId, 'a las', bogotaTime.toString());
      
      const requestData = {
        fecha_aprobacion: formatDateForBackend(bogotaTime),
        timestamp_aprobacion_bogota: formatDateForBackend(bogotaTime),
        hora_aprobacion_bogota: bogotaTime.getHours() + ':' + bogotaTime.getMinutes()
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
      const bogotaTime = getBogotaTime();
      console.log('❌ Rechazando solicitud:', loanId, 'a las', bogotaTime.toString());
      
      const requestData = {
        motivo_rechazo: motivo,
        fecha_rechazo: formatDateForBackend(bogotaTime),
        timestamp_rechazo_bogota: formatDateForBackend(bogotaTime),
        hora_rechazo_bogota: bogotaTime.getHours() + ':' + bogotaTime.getMinutes()
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
      console.log('🛠️ Obteniendo implementos disponibles...');
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

  // ✅ Función para test de hora
  testBogotaTime: () => {
    console.log('🧪 TEST DE HORA BOGOTÁ');
    const testTime = getBogotaTime();
    
    return {
      hora_actual_bogota: testTime.toString(),
      hora_actual_bogota_iso: testTime.toISOString(),
      hora_actual_bogota_legible: testTime.toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        dateStyle: 'full',
        timeStyle: 'long'
      }),
      horas: testTime.getHours(),
      minutos: testTime.getMinutes(),
      segundos: testTime.getSeconds(),
      timestamp: testTime.getTime()
    };
  },

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