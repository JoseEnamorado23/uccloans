import React, { useState, useEffect } from 'react';
import './UserFilters.css';
import API from '../../services/api'; // ← IMPORTAR API

const UserFilters = ({ filters, onFiltersChange, onClearFilters, onRefresh }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [programas, setProgramas] = useState([]); // ← ESTADO PARA PROGRAMAS
  const [loadingProgramas, setLoadingProgramas] = useState(false);

  // ✅ CARGAR PROGRAMAS AL INICIAR
  useEffect(() => {
    const loadProgramas = async () => {
      try {
        setLoadingProgramas(true);
        const response = await API.get('/api/programas');
        if (response.data.success) {
          setProgramas(response.data.data);
        }
      } catch (error) {
        console.error('Error cargando programas:', error);
      } finally {
        setLoadingProgramas(false);
      }
    };

    loadProgramas();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleClear = () => {
    const defaultFilters = {
      search: '',
      programa_id: '', // ← programa_id, no programa
      estado: '',
      ordenar_por: 'nombre_completo',
      orden: 'ASC'
    };
    setLocalFilters({ ...localFilters, ...defaultFilters });
    onClearFilters();
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>🔍 Filtros de Usuarios</h3>
        <div className="filter-actions">
          <button onClick={handleApply} className="btn btn-primary">
            Aplicar Filtros
          </button>
          <button onClick={handleClear} className="btn btn-secondary">
            Limpiar
          </button>
          <button onClick={onRefresh} className="btn btn-outline">
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="filters-grid">
        {/* Búsqueda general */}
        <div className="filter-group">
          <label>Búsqueda general:</label>
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, email..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* ✅ FILTRO POR PROGRAMA - CORREGIDO */}
        <div className="filter-group">
          <label>Programa:</label>
          <select
            value={localFilters.programa_id} // ← programa_id
            onChange={(e) => handleFilterChange('programa_id', e.target.value)}
            disabled={loadingProgramas}
          >
            <option value="">Todos los programas</option>
            {programas.map((programa) => (
              <option key={programa.id} value={programa.id}> {/* ← ID como valor */}
                {programa.nombre} {/* ← Nombre como texto */}
              </option>
            ))}
          </select>
          {loadingProgramas && <small>Cargando programas...</small>}
        </div>

        {/* Estado */}
        <div className="filter-group">
          <label>Estado:</label>
          <select
            value={localFilters.estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="filter-group">
          <label>Ordenar por:</label>
          <select
            value={localFilters.ordenar_por}
            onChange={(e) => handleFilterChange('ordenar_por', e.target.value)}
          >
            <option value="nombre_completo">Nombre</option>
            <option value="numero_cedula">Cédula</option>
            <option value="programa_id">Programa</option>
            <option value="horas_totales_acumuladas">Horas acumuladas</option>
            <option value="fecha_registro">Fecha registro</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Orden:</label>
          <select
            value={localFilters.orden}
            onChange={(e) => handleFilterChange('orden', e.target.value)}
          >
            <option value="ASC">Ascendente</option>
            <option value="DESC">Descendente</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;