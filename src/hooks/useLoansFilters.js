// src/hooks/useLoansFilters.js
import { useState, useEffect, useRef } from 'react';
import API from '../services/api';

// Hook personalizado para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useLoansFilters = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 15,
    search: '',
    fecha_inicio: '',
    fecha_fin: '',
    usuario_id: '',
    implemento: '',
    estado: '',
    ordenar_por: 'fecha_prestamo',
    orden: 'DESC'
  });
  const [pagination, setPagination] = useState({
    pagina_actual: 1,
    por_pagina: 15,
    total: 0,
    total_paginas: 0
  });

  // Usar debounce para la búsqueda automática (500ms de delay)
  const debouncedSearch = useDebounce(filters.search, 500);

  const loadLoans = async (newFilters = {}) => {
    const updatedFilters = { ...filters, ...newFilters, page: newFilters.page || 1 };
    
    setLoading(true);
    setError(null);

    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await API.get(`/api/prestamos/filtros?${queryParams}`);
      
      if (response.data.success) {
        setLoans(response.data.data);
        setPagination(response.data.paginacion);
        setFilters(updatedFilters);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error cargando préstamos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para búsqueda automática cuando cambia el debouncedSearch
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      loadLoans({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  // Cambiar página
  const changePage = (newPage) => {
    loadLoans({ page: newPage });
  };

  // Aplicar filtros (reinicia a página 1)
  const applyFilters = (newFilters) => {
    loadLoans({ ...newFilters, page: 1 });
  };

  // Actualizar filtros individualmente (para búsqueda automática)
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    const defaultFilters = {
      page: 1,
      limit: 15,
      search: '',
      fecha_inicio: '',
      fecha_fin: '',
      usuario_id: '',
      implemento: '',
      estado: '',
      ordenar_por: 'fecha_prestamo',
      orden: 'DESC'
    };
    setFilters(defaultFilters);
    loadLoans(defaultFilters);
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadLoans();
  }, []);

  return {
    loans,
    loading,
    error,
    filters,
    pagination,
    loadLoans,
    changePage,
    applyFilters,
    clearFilters,
    updateFilter // Nueva función para actualizar filtros individualmente
  };
};