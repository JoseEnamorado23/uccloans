import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import './UserFilters.css';
import API from '../../services/api';

const UserFilters = ({ filters, onFiltersChange, onClearFilters, onRefresh }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [programas, setProgramas] = useState([]);
  const [loadingProgramas, setLoadingProgramas] = useState(false);

  // Cargar programas al iniciar
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
      programa_id: '',
      estado: '',
      ordenar_por: 'nombre_completo',
      orden: 'ASC'
    };
    setLocalFilters({ ...localFilters, ...defaultFilters });
    onClearFilters();
  };

  return (
    <div className="user-filters-container">
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={20} />
          <h3>Filtros Avanzados</h3>
        </div>
        
        <div className="filter-actions">
          <button 
            onClick={onRefresh} 
            className="btn btn-outline"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
          <button 
            onClick={handleClear} 
            className="btn btn-outline"
            disabled={!localFilters.programa_id && !localFilters.estado}
          >
            Limpiar Filtros
          </button>
          <button 
            onClick={handleApply} 
            className="btn btn-primary"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      <div className="filters-grid">
        {/* Filtro por programa */}
        <div className="filter-group">
          <label>Programa</label>
          <select
            value={localFilters.programa_id}
            onChange={(e) => handleFilterChange('programa_id', e.target.value)}
            disabled={loadingProgramas}
          >
            <option value="">Todos los programas</option>
            {programas.map((programa) => (
              <option key={programa.id} value={programa.id}>
                {programa.nombre}
              </option>
            ))}
          </select>
          {loadingProgramas && <small>Cargando programas...</small>}
        </div>

        {/* Estado */}
        <div className="filter-group">
          <label>Estado</label>
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
          <label>Ordenar por</label>
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
          <label>Orden</label>
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