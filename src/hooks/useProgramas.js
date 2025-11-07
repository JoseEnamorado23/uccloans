// src/hooks/useProgramas.js
import { useState, useEffect } from 'react';
import programasService from '../services/programasService';

export const useProgramas = () => {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar programas al inicializar
  useEffect(() => {
    loadProgramas();
  }, []);

  const loadProgramas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await programasService.getProgramas();
      
      if (response.success) {
        setProgramas(response.data);
      }
    } catch (error) {
      console.error('Error cargando programas:', error);
      setError('Error al cargar los programas');
      // Fallback a programas básicos si hay error
      setProgramas(getProgramasFallback());
    } finally {
      setLoading(false);
    }
  };

  // Fallback por si la API falla
  const getProgramasFallback = () => [
    { id: 1, nombre: 'Ingeniería de Sistemas' },
    { id: 2, nombre: 'Ingeniería Civil' },
    { id: 3, nombre: 'Arquitectura' },
    { id: 4, nombre: 'Medicina' },
    { id: 5, nombre: 'Derecho' },
    { id: 6, nombre: 'Psicología' },
    { id: 7, nombre: 'Enfermería' },
    { id: 8, nombre: 'Administración' }
  ];

  const createPrograma = async (nombre) => {
    try {
      const response = await programasService.createPrograma(nombre);
      if (response.success) {
        await loadProgramas(); // Recargar la lista
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Error creando programa:', error);
      return { success: false, message: error.response?.data?.message || 'Error al crear programa' };
    }
  };

  const updatePrograma = async (id, nombre) => {
    try {
      const response = await programasService.updatePrograma(id, nombre);
      if (response.success) {
        await loadProgramas(); // Recargar la lista
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Error actualizando programa:', error);
      return { success: false, message: error.response?.data?.message || 'Error al actualizar programa' };
    }
  };

  const deletePrograma = async (id) => {
    try {
      const response = await programasService.deletePrograma(id);
      if (response.success) {
        await loadProgramas(); // Recargar la lista
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Error eliminando programa:', error);
      return { success: false, message: error.response?.data?.message || 'Error al eliminar programa' };
    }
  };

  return {
    programas,
    loading,
    error,
    refreshProgramas: loadProgramas,
    createPrograma,
    updatePrograma,
    deletePrograma
  };
};