// src/components/Filters/LoanFilters.jsx
import React, { useState } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  Package, 
  Search,
  X,
  Check,
  SlidersHorizontal,
  Download,
  Plus
} from 'lucide-react';
import './LoanFilters.css';

const LoanFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  onSearchChange,
  onExport,
  onAddLoan 
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    fecha_inicio: filters.fecha_inicio,
    implemento: filters.implemento,
    estado: filters.estado,
    ordenar_por: filters.ordenar_por,
    orden: filters.orden
  });

  const handleSearchChange = (value) => {
    onSearchChange(value);
  };

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsFiltersOpen(false);
  };

  const handleApplySort = () => {
    onFiltersChange({
      ordenar_por: localFilters.ordenar_por,
      orden: localFilters.orden
    });
    setIsSortOpen(false);
  };

  const handleClearAll = () => {
    const defaultFilters = {
      fecha_inicio: '',
      implemento: '',
      estado: '',
      ordenar_por: 'fecha_prestamo',
      orden: 'DESC'
    };
    setLocalFilters(defaultFilters);
    onClearFilters();
    setIsFiltersOpen(false);
    setIsSortOpen(false);
  };

  const hasActiveFilters = filters.fecha_inicio || filters.implemento || filters.estado;

  return (
    <div className="advanced-filters-container">
      {/* Barra superior con todos los controles */}
      <div className="filters-header-bar">
        {/* Búsqueda automática */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre e identidficaciones..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          {filters.search && (
            <button 
              onClick={() => handleSearchChange('')}
              className="clear-search-btn"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Controles de filtros, ordenamiento, exportar y agregar */}
        <div className="controls-container">
          {/* Botón de filtros */}
          <div className="filter-control-group">
            <button 
              className={`filter-control-btn ${hasActiveFilters ? 'active' : ''}`}
              onClick={() => {
                setIsFiltersOpen(!isFiltersOpen);
                setIsSortOpen(false);
              }}
            >
              <Filter size={18} />
              <span>Filtrar</span>
              {hasActiveFilters && <span className="active-dot"></span>}
            </button>

            {/* Panel de filtros desplegable */}
            {isFiltersOpen && (
              <div className="filters-dropdown-panel">
                <div className="filters-dropdown-header">
                  <Filter size={16} />
                  <span>Filtros Avanzados</span>
                </div>

                <div className="filters-dropdown-content">
                  {/* Fecha */}
                  <div className="filter-dropdown-item">
                    <label>
                      <Calendar size={16} />
                      Fecha:
                    </label>
                    <input
                      type="date"
                      value={localFilters.fecha_inicio}
                      onChange={(e) => handleLocalFilterChange('fecha_inicio', e.target.value)}
                    />
                  </div>

                  {/* Implemento */}
                  <div className="filter-dropdown-item">
                    <label>
                      <Package size={16} />
                      Implemento:
                    </label>
                    <input
                      type="text"
                      placeholder="Filtrar por implemento..."
                      value={localFilters.implemento}
                      onChange={(e) => handleLocalFilterChange('implemento', e.target.value)}
                    />
                  </div>

                  {/* Estado */}
                  <div className="filter-dropdown-item">
                    <label>Estado:</label>
                    <select
                      value={localFilters.estado}
                      onChange={(e) => handleLocalFilterChange('estado', e.target.value)}
                    >
                      <option value="">Todos los estados</option>
                      <option value="activo">Activo</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="devuelto">Devuelto</option>
                      <option value="perdido">Perdido</option>
                      <option value="rechazado">Rechazado</option>
                      <option value="solicitado">Solicitado</option>
                    </select>
                  </div>
                </div>

                <div className="filters-dropdown-actions">
                  <button onClick={handleApplyFilters} className="btn-apply">
                    <Check size={16} />
                    Aplicar Filtros
                  </button>
                  <button onClick={handleClearAll} className="btn-clear">
                    <X size={16} />
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botón de ordenar */}
          <div className="filter-control-group">
            <button 
              className="filter-control-btn"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFiltersOpen(false);
              }}
            >
              <ArrowUpDown size={18} />
              <span>Ordenar</span>
            </button>

            {/* Panel de ordenamiento desplegable */}
            {isSortOpen && (
              <div className="filters-dropdown-panel">
                <div className="filters-dropdown-header">
                  <ArrowUpDown size={16} />
                  <span>Ordenar por</span>
                </div>

                <div className="filters-dropdown-content">
                  <div className="filter-dropdown-item">
                    <label>Campo:</label>
                    <select
                      value={localFilters.ordenar_por}
                      onChange={(e) => handleLocalFilterChange('ordenar_por', e.target.value)}
                    >
                      <option value="fecha_prestamo">Fecha préstamo</option>
                      <option value="hora_inicio">Hora inicio</option>
                      <option value="implemento">Implemento</option>
                      <option value="estado">Estado</option>
                    </select>
                  </div>

                  <div className="filter-dropdown-item">
                    <label>Orden:</label>
                    <select
                      value={localFilters.orden}
                      onChange={(e) => handleLocalFilterChange('orden', e.target.value)}
                    >
                      <option value="DESC">Descendente</option>
                      <option value="ASC">Ascendente</option>
                    </select>
                  </div>
                </div>

                <div className="filters-dropdown-actions">
                  <button onClick={handleApplySort} className="btn-apply">
                    <Check size={16} />
                    Aplicar Orden
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botón de exportar */}
          <button 
            className="export-control-btn"
            onClick={onExport}
          >
            <Download size={18} />
            <span>Exportar</span>
          </button>

          {/* Botón de agregar préstamo */}
          <button 
            className="add-loan-control-btn"
            onClick={onAddLoan}
          >
            <Plus size={18} />
            <span>Add Loan</span>
          </button>
        </div>
      </div>

      {/* Indicadores de filtros activos */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <span className="active-filters-label">Filtros activos:</span>
          <div className="active-filters-tags">
            {filters.fecha_inicio && (
              <span className="active-filter-tag">
                Fecha: {filters.fecha_inicio}
                <button onClick={() => onFiltersChange({ fecha_inicio: '' })}>
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.implemento && (
              <span className="active-filter-tag">
                Implemento: {filters.implemento}
                <button onClick={() => onFiltersChange({ implemento: '' })}>
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.estado && (
              <span className="active-filter-tag">
                Estado: {filters.estado}
                <button onClick={() => onFiltersChange({ estado: '' })}>
                  <X size={12} />
                </button>
              </span>
            )}
            <button 
              onClick={handleClearAll}
              className="clear-all-filters-btn"
            >
              <X size={14} />
              Limpiar todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanFilters;