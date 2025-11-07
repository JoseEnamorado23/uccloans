// src/components/Users/UserHistoryModal.jsx
import React, { useState, useEffect } from 'react';
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
        // ✅ CORRECCIÓN: Acceder a response.data.data.prestamos
        setPrestamos(response.data.data.prestamos || []);
        setPaginacion(response.data.data.paginacion || {
          total: 0,
          pagina_actual: 1,
          total_paginas: 0
        });
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      alert('Error al cargar el historial de préstamos');
      // ✅ CORRECCIÓN: Resetear estados en caso de error
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
      'activo': { text: '🟢 Activo', class: 'badge-success' },
      'devuelto': { text: '✅ Devuelto', class: 'badge-info' },
      'pendiente': { text: '🟡 Pendiente', class: 'badge-warning' },
      'perdido': { text: '🔴 Perdido', class: 'badge-danger' }
    };
    
    const estadoInfo = estados[estado] || { text: estado, class: 'badge-secondary' };
    return <span className={`badge ${estadoInfo.class}`}>{estadoInfo.text}</span>;
  };

  const formatHora = (hora) => {
    if (!hora) return '--:--';
    return hora.substring(0, 5);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content history-modal">
        <div className="modal-header">
          <h2>📋 Historial de Préstamos</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Información del usuario */}
          <div className="user-info-header">
            <div className="user-avatar-large">
              {user.nombre_completo?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <h3>{user.nombre_completo}</h3>
              <p>🆔 {user.numero_cedula} • 📚 {user.programa_nombre || user.programa}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="history-filters">
            <div className="filter-group">
              <label>Estado:</label>
              <select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="devuelto">Devuelto</option>
                <option value="pendiente">Pendiente</option>
                <option value="perdido">Perdido</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Implemento:</label>
              <input
                type="text"
                placeholder="Filtrar por implemento..."
                value={filters.implemento}
                onChange={(e) => handleFilterChange('implemento', e.target.value)}
              />
            </div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={loadPrestamos}
            >
              🔄 Actualizar
            </button>
          </div>

          {/* Lista de préstamos */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando historial...</p>
            </div>
          ) : !Array.isArray(prestamos) || prestamos.length === 0 ? ( // ✅ CORRECCIÓN: Validar que es array
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No hay préstamos registrados</h3>
              <p>Este usuario no tiene préstamos en el historial</p>
            </div>
          ) : (
            <>
              <div className="prestamos-list">
                {prestamos.map(prestamo => (
                  <div key={prestamo.id} className="prestamo-item">
                    <div className="prestamo-header">
                      <h4>{prestamo.implemento}</h4>
                      {getEstadoBadge(prestamo.estado)}
                    </div>
                    
                    <div className="prestamo-details">
                      <div className="detail-row">
                        <span className="detail-label">📅 Fecha:</span>
                        <span className="detail-value">{formatFecha(prestamo.fecha_prestamo)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🕐 Inicio:</span>
                        <span className="detail-value">{formatHora(prestamo.hora_inicio)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🕔 Fin Estimado:</span>
                        <span className="detail-value">{formatHora(prestamo.hora_fin_estimada)}</span>
                      </div>
                      {prestamo.hora_fin_real && (
                        <div className="detail-row">
                          <span className="detail-label">🕛 Fin Real:</span>
                          <span className="detail-value">{formatHora(prestamo.hora_fin_real)}</span>
                        </div>
                      )}
                      {prestamo.horas_totales && (
                        <div className="detail-row">
                          <span className="detail-label">⏱️ Horas:</span>
                          <span className="detail-value">{prestamo.horas_totales}h</span>
                        </div>
                      )}
                      {prestamo.extendido && (
                        <div className="detail-row">
                          <span className="detail-label">🔄 Extendido:</span>
                          <span className="detail-value">Sí {prestamo.motivo_extension && `- ${prestamo.motivo_extension}`}</span>
                        </div>
                      )}
                    </div>

                    <div className="prestamo-meta">
                      <span className="fecha-registro">
                        📝 {new Date(prestamo.fecha_registro).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {paginacion.total_paginas > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                  >
                    ◀️ Anterior
                  </button>
                  
                  <span className="pagination-info">
                    Página {filters.page} de {paginacion.total_paginas}
                  </span>
                  
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={filters.page >= paginacion.total_paginas}
                    onClick={() => handlePageChange(filters.page + 1)}
                  >
                    Siguiente ▶️
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryModal;