// src/services/implementosService.js
import API from './api';

export const implementosService = {
  // ✅ CORREGIDO: Usar el endpoint que SÍ funciona
  async getImplementosDisponibles(filters = {}) {
    try {
      // Usar /api/implementos con filtro para solo activos
      const response = await API.get('/api/implementos', { 
        params: { 
          ...filters,
          activo: true  // Solo implementos activos
        } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error cargando implementos' };
    }
  },

  // Para el admin (todos los implementos)
  async getAllImplementos(filters = {}) {
    try {
      const response = await API.get('/api/implementos', { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error cargando implementos' };
    }
  }
};

export default implementosService;