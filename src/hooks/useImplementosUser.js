// src/hooks/useImplementosUser.js
import { useState, useEffect } from 'react';
import { implementosService } from '../services/implementosService';

export const useImplementosUser = () => {
  const [implementos, setImplementos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    unidadesTotales: 0
  });

  // Cargar implementos disponibles (solo para vista de usuario)
  const cargarImplementosDisponibles = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await implementosService.getImplementosDisponibles(filters);
      
      if (result.success) {
        setImplementos(result.data || []);
        calcularStats(result.data || []);
      } else {
        throw new Error(result.message || 'Error al cargar implementos');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error cargando implementos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas simplificadas para usuario
  const calcularStats = (implementosList) => {
    const total = implementosList.length;
    const disponibles = implementosList.filter(imp => imp.cantidad_disponible > 0).length;
    const unidadesTotales = implementosList.reduce((sum, imp) => sum + imp.cantidad_disponible, 0);
    
    setStats({ total, disponibles, unidadesTotales });
  };

  // Buscar implementos
  const buscarImplementos = async (query) => {
    await cargarImplementosDisponibles({ search: query });
  };

  // Cargar implementos al inicializar
  useEffect(() => {
    cargarImplementosDisponibles();
  }, []);

  return {
    implementos,
    stats,
    loading,
    error,
    cargarImplementosDisponibles,
    buscarImplementos
  };
};