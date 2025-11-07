// src/services/programasService.js
import API from './api';

const programasService = {
  // 📚 OBTENER TODOS LOS PROGRAMAS
  async getProgramas() {
    try {
      const response = await API.get('/api/programas');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo programas:', error);
      throw error;
    }
  },

  // ➕ CREAR PROGRAMA
  async createPrograma(nombre) {
    try {
      const response = await API.post('/api/programas', { nombre });
      return response.data;
    } catch (error) {
      console.error('Error creando programa:', error);
      throw error;
    }
  },

  // ✏️ ACTUALIZAR PROGRAMA
  async updatePrograma(id, nombre) {
    try {
      const response = await API.put(`/api/programas/${id}`, { nombre });
      return response.data;
    } catch (error) {
      console.error('Error actualizando programa:', error);
      throw error;
    }
  },

  // 🗑️ ELIMINAR PROGRAMA
  async deletePrograma(id) {
    try {
      const response = await API.delete(`/api/programas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando programa:', error);
      throw error;
    }
  },

  // 🔍 BUSCAR PROGRAMAS
  async searchProgramas(query) {
    try {
      const response = await API.get(`/api/programas/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error buscando programas:', error);
      throw error;
    }
  }
};

export default programasService;