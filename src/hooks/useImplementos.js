// hooks/useImplementos.js
import { useState, useEffect } from 'react';

export const useImplementos = () => {
  const [implementos, setImplementos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    prestados: 0
  });

  // Base URL de la API - CORREGIDO
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Cargar todos los implementos
  const cargarImplementos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/implementos`);
      const data = await response.json();
      
      if (data.success) {
        setImplementos(data.data);
        calcularStats(data.data);
      } else {
        throw new Error(data.message || 'Error al cargar implementos');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error cargando implementos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const calcularStats = (implementosList) => {
    const total = implementosList.length;
    const disponibles = implementosList.reduce((sum, imp) => sum + imp.cantidad_disponible, 0);
    const prestados = implementosList.reduce((sum, imp) => sum + (imp.cantidad_total - imp.cantidad_disponible), 0);
    
    setStats({ total, disponibles, prestados });
  };

  // Crear nuevo implemento
  const crearImplemento = async (implementoData) => {
    try {
      const response = await fetch(`${API_BASE}/api/implementos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(implementoData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await cargarImplementos(); // Recargar la lista
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Actualizar implemento
  const actualizarImplemento = async (id, implementoData) => {
    try {
      const response = await fetch(`${API_BASE}/api/implementos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(implementoData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await cargarImplementos(); // Recargar la lista
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Eliminar implemento
  const eliminarImplemento = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/implementos/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await cargarImplementos(); // Recargar la lista
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Cargar implementos al inicializar
  useEffect(() => {
    cargarImplementos();
  }, []);

  return {
    implementos,
    stats,
    loading,
    error,
    cargarImplementos,
    crearImplemento,
    actualizarImplemento,
    eliminarImplemento
  };
};