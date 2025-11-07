// hooks/useImplementos.js
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const useImplementos = () => {
  const [implementos, setImplementos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar implementos
  const cargarImplementos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/implementos`);
      const data = await response.json();
      
      if (data.success) {
        setImplementos(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear implemento
  const crearImplemento = async (implementoData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/implementos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(implementoData)
      });
      
      const data = await response.json();
      if (data.success) {
        await cargarImplementos();
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
      const response = await fetch(`${API_BASE_URL}/api/implementos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(implementoData)
      });
      
      const data = await response.json();
      if (data.success) {
        await cargarImplementos();
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
      const response = await fetch(`${API_BASE_URL}/api/implementos/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        await cargarImplementos();
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Cargar al inicio
  useEffect(() => {
    cargarImplementos();
  }, []);

  // Calcular estadísticas
  const stats = {
    total: implementos.length,
    disponibles: implementos.reduce((sum, imp) => sum + imp.cantidad_disponible, 0),
    prestados: implementos.reduce((sum, imp) => sum + (imp.cantidad_total - imp.cantidad_disponible), 0)
  };

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