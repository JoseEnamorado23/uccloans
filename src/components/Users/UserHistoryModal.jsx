import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  IdCard, 
  BookOpen, 
  Clock, 
  Calendar,
  RefreshCw,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import API from '../../services/api';
import './UserHistoryModal.css';

const UserHistoryModal = ({ user, onClose }) => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    estado: '',
    implemento: ''
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    pagina_actual: 1,
    total_paginas: 0
  });

  useEffect(() => {
    loadPrestamos();
  }, [filters]);

  const loadPrestamos = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/users/${user.id}/loans`, { 
        params: filters 
      });
      
      if (response.data.success) {
        setPrestamos(response.data.data.prestamos || []);
        setPaginacion(response.data.data.paginacion || {
          total: 0,
          pagina_actual: 1,
          total_paginas: 0
        });
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      setPrestamos([]);
      setPaginacion({
        total: 0,
        pagina_actual: 1,
        total_paginas: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'activo': { text: 'Activo', class: 'badge-success' },
      'devuelto': { text: 'Devuelto', class: 'badge-info' },
      'pendiente': { text: 'Pendiente', class: 'badge-warning' },
      'perdido': { text: 'Perdido', class: 'badge-danger' }
    };
    
    const estadoInfo = estados[estado] || { text: estado, class: 'badge-secondary' };
    return <span className={`history-badge ${estadoInfo.class}`}>{estadoInfo.text}</span>;
  };

  const formatHora = (hora) => {
    if (!hora) return '--:--';
    return hora.substring(0, 5);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  return (
    <div className="history-modal-overlay" onClick={onClose}>
      <div className="history-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="history-modal-head">
          <div>
            <h3 className="history-modal-title">
              <FileText size={18} />
              Historial de Préstamos
            </h3>
            <p className="history-modal-sub">
              ID #{user.id} · {user.programa_nombre || user.programa}
            </p>
          </div>
          <button 
            aria-label="Cerrar" 
            className="history-modal-close" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <main className="history-modal-body">
          {/* Información del usuario */}
          <div className="history-user-info">
            <div className="history-user-avatar">
              {user.nombre_completo?.charAt(0) || 'U'}
            </div>
            <div className="history-user-details">
              <h3>{user.nombre_completo}</h3>
              <p>
                <IdCard size={12} />
                {user.numero_cedula}
                <BookOpen size={12} />
                {user.programa_nombre || user.programa}
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="history-filters">
            <div className="filter-group">
              <label>
                <Filter size={12} />
                Estado
              </label>
              <select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="devuelto">Devuelto</option>
                <option value="pendiente">Pendiente</option>
                <option value="perdido">Perdido</option>
              </select>
            </div>

            <div className="filter-group">
              <label>
                <Search size={12} />
                Implemento
              </label>
              <input
                type="text"
                placeholder="Buscar implemento..."
                value={filters.implemento}
                onChange={(e) => handleFilterChange('implemento', e.target.value)}
              />
            </div>

            <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
              <label>&nbsp;</label>
              <button 
                className="history-modal-btn history-modal-btn--ghost"
                onClick={loadPrestamos}
                disabled={loading}
              >
                <RefreshCw size={14} />
                Actualizar
              </button>
            </div>
          </div>

          {/* Lista de préstamos - CON SCROLL */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando historial...</p>
            </div>
          ) : !Array.isArray(prestamos) || prestamos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FileText size={32} />
              </div>
              <h3>No hay préstamos registrados</h3>
              <p>Este usuario no tiene préstamos en el historial</p>
            </div>
          ) : (
            <>
              <div className="prestamos-container">
                <div className="prestamos-list">
                  {prestamos.map(prestamo => (
                    <div key={prestamo.id} className="prestamo-item">
                      <div className="prestamo-header">
                        <h4>{prestamo.implemento}</h4>
                        {getEstadoBadge(prestamo.estado)}
                      </div>
                      
                      <div className="prestamo-details">
                        <div className="detail-row">
                          <span className="detail-label">
                            <Calendar size={12} />
                            Fecha:
                          </span>
                          <span className="detail-value">{formatFecha(prestamo.fecha_prestamo)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">
                            <Clock size={12} />
                            Inicio:
                          </span>
                          <span className="detail-value">{formatHora(prestamo.hora_inicio)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">
                            <Clock size={12} />
                            Fin Estimado:
                          </span>
                          <span className="detail-value">{formatHora(prestamo.hora_fin_estimada)}</span>
                        </div>
                        {prestamo.hora_fin_real && (
                          <div className="detail-row">
                            <span className="detail-label">
                              <Clock size={12} />
                              Fin Real:
                            </span>
                            <span className="detail-value">{formatHora(prestamo.hora_fin_real)}</span>
                          </div>
                        )}
                      </div>

                      <div className="prestamo-meta">
                        <span className="fecha-registro">
                          <Calendar size={10} />
                          Registrado: {formatFecha(prestamo.fecha_registro)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paginación */}
              {paginacion.total_paginas > 1 && (
                <div className="pagination">
                  <button
                    className="history-modal-btn history-modal-btn--ghost"
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                  >
                    Anterior
                  </button>
                  
                  <span className="pagination-info">
                    Página {filters.page} de {paginacion.total_paginas}
                  </span>
                  
                  <button
                    className="history-modal-btn history-modal-btn--ghost"
                    disabled={filters.page >= paginacion.total_paginas}
                    onClick={() => handlePageChange(filters.page + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="history-modal-foot">
          <button 
            className="history-modal-btn history-modal-btn--primary" 
            onClick={onClose}
          >
            <X size={16} />
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UserHistoryModal;