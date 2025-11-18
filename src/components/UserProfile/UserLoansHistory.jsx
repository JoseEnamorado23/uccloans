// src/components/UserProfile/UserLoansHistory.jsx
import React, { useState, useEffect } from 'react';
import { userProfileService } from '../../services/userProfileService';
import loanRequestsService from '../../services/loanRequests.service';
import { 
  Search,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Play,
  Square,
  Hourglass,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import './UserLoansHistory.css';

// Función para formatear horas decimales a horas y minutos
const formatHorasDecimales = (horasDecimal) => {
  if (!horasDecimal || isNaN(horasDecimal)) return '0h 0m';
  
  const horas = Math.floor(horasDecimal);
  const minutos = Math.round((horasDecimal - horas) * 60);
  
  if (horas === 0 && minutos === 0) return '0h 0m';
  if (horas === 0) return `${minutos}m`;
  if (minutos === 0) return `${horas}h`;
  
  return `${horas}h ${minutos}m`;
};

const UserLoansHistory = ({ userId }) => {
  const [prestamos, setPrestamos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('prestamos');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    estado: '',
    implemento: ''
  });
  const [paginacion, setPaginacion] = useState({});
  const [tiemposRestantes, setTiemposRestantes] = useState({});

  useEffect(() => {
    if (activeTab === 'prestamos') {
      loadPrestamos();
    } else {
      loadSolicitudes();
    }
  }, [filters, activeTab]);

  useEffect(() => {
    // Iniciar contadores en vivo para préstamos activos
    if (activeTab === 'prestamos' && prestamos.length > 0) {
      iniciarContadores();
    }
    
    return () => {
      // Limpiar intervalos al desmontar
      Object.keys(intervalosRef.current).forEach(id => {
        clearInterval(intervalosRef.current[id]);
      });
    };
  }, [prestamos, activeTab]);

  const intervalosRef = React.useRef({});

  const iniciarContadores = () => {
    // Limpiar intervalos anteriores
    Object.keys(intervalosRef.current).forEach(id => {
      clearInterval(intervalosRef.current[id]);
    });
    intervalosRef.current = {};

    // Iniciar contadores para préstamos activos
    prestamos.forEach(prestamo => {
      if (prestamo.estado === 'activo' && prestamo.hora_fin_estimada) {
        actualizarTiempoRestante(prestamo.id, prestamo.hora_fin_estimada);
        
        intervalosRef.current[prestamo.id] = setInterval(() => {
          actualizarTiempoRestante(prestamo.id, prestamo.hora_fin_estimada);
        }, 1000); // Actualizar cada segundo
      }
    });
  };

  const actualizarTiempoRestante = (prestamoId, horaFinEstimada) => {
    const ahora = new Date();
    const [horas, minutos, segundos] = horaFinEstimada.split(':').map(Number);
    const finEstimado = new Date();
    finEstimado.setHours(horas, minutos, segundos || 0, 0);
    
    let diferencia = finEstimado - ahora;
    
    if (diferencia <= 0) {
      // Tiempo agotado
      setTiemposRestantes(prev => ({
        ...prev,
        [prestamoId]: { texto: 'Tiempo agotado', clase: 'tiempo-agotado' }
      }));
      clearInterval(intervalosRef.current[prestamoId]);
      return;
    }
    
    const horasRestantes = Math.floor(diferencia / (1000 * 60 * 60));
    const minutosRestantes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundosRestantes = Math.floor((diferencia % (1000 * 60)) / 1000);
    
    let texto = '';
    let clase = 'tiempo-normal';
    
    if (horasRestantes > 0) {
      texto = `${horasRestantes}h ${minutosRestantes}m`;
    } else if (minutosRestantes > 5) {
      texto = `${minutosRestantes}m ${segundosRestantes}s`;
      clase = 'tiempo-advertencia';
    } else {
      texto = `${minutosRestantes}m ${segundosRestantes}s`;
      clase = 'tiempo-peligro';
    }
    
    setTiemposRestantes(prev => ({
      ...prev,
      [prestamoId]: { texto, clase }
    }));
  };

  const loadPrestamos = async () => {
    try {
      setLoading(true);
      const response = await userProfileService.getUserLoansHistory(userId, filters);
      
      if (response.success) {
        setPrestamos(response.data.prestamos || []);
        setPaginacion(response.data.paginacion || {});
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await loanRequestsService.getUserLoanRequests(userId);
      
      if (response.success) {
        setSolicitudes(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      setSolicitudes([]);
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
      'activo': { 
        text: 'Activo', 
        class: 'badge-active',
        icon: <Play size={14} />
      },
      'devuelto': { 
        text: 'Devuelto', 
        class: 'badge-completed',
        icon: <CheckCircle size={14} />
      },
      'pendiente': { 
        text: 'Pendiente', 
        class: 'badge-pending',
        icon: <Clock size={14} />
      },
      'perdido': { 
        text: 'Perdido', 
        class: 'badge-lost',
        icon: <XCircle size={14} />
      },
      'solicitado': {
        text: 'Solicitado',
        class: 'badge-requested',
        icon: <Clock size={14} />
      },
      'aprobado': {
        text: 'Aprobado',
        class: 'badge-approved',
        icon: <CheckCircle size={14} />
      },
      'rechazado': {
        text: 'Rechazado',
        class: 'badge-rejected',
        icon: <XCircle size={14} />
      }
    };
    
    const estadoInfo = estados[estado] || { 
      text: estado, 
      class: 'badge-default',
      icon: <AlertCircle size={14} />
    };
    
    return (
      <span className={`badge ${estadoInfo.class}`}>
        {estadoInfo.icon}
        {estadoInfo.text}
      </span>
    );
  };

  const formatHora = (hora) => {
    if (!hora) return '--:--';
    return hora.substring(0, 5);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  const renderPrestamos = () => {
    if (!Array.isArray(prestamos) || prestamos.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={48} />
          </div>
          <h3>No hay préstamos registrados</h3>
          <p>Aún no has realizado ningún préstamo</p>
        </div>
      );
    }

    return (
      <>
        <div className="prestamos-grid">
          {prestamos.map(prestamo => (
            <div key={prestamo.id} className="prestamo-card">
              <div className="prestamo-header">
                <h4>{prestamo.implemento}</h4>
                <div className="prestamo-status">
                  {getEstadoBadge(prestamo.estado)}
                  {prestamo.estado === 'activo' && tiemposRestantes[prestamo.id] && (
                    <span className={`tiempo-restante ${tiemposRestantes[prestamo.id].clase}`}>
                      <Clock size={12} />
                      {tiemposRestantes[prestamo.id].texto}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="prestamo-details">
                <div className="detail-item">
                  <span className="detail-label">
                    <Calendar size={14} />
                    Fecha:
                  </span>
                  <span className="detail-value">{formatFecha(prestamo.fecha_prestamo)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">
                    <Play size={14} />
                    Inicio:
                  </span>
                  <span className="detail-value">{formatHora(prestamo.hora_inicio)}</span>
                </div>
                
                {prestamo.estado === 'activo' && (
                  <div className="detail-item">
                    <span className="detail-label">
                      <Clock size={14} />
                      Fin Estimado:
                    </span>
                    <span className="detail-value">{formatHora(prestamo.hora_fin_estimada)}</span>
                  </div>
                )}
                
                {prestamo.hora_fin_real && (
                  <div className="detail-item">
                    <span className="detail-label">
                      <Square size={14} />
                      Fin Real:
                    </span>
                    <span className="detail-value">{formatHora(prestamo.hora_fin_real)}</span>
                  </div>
                )}
                
                {prestamo.horas_totales && (
                  <div className="detail-item">
                    <span className="detail-label">
                      <Hourglass size={14} />
                      Duración:
                    </span>
                    <span className="detail-value horas-formateadas">
                      {formatHorasDecimales(prestamo.horas_totales)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {paginacion.total_paginas > 1 && (
          <div className="pagination">
            <button
              className="btn btn-outline"
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              ◀️ Anterior
            </button>
            
            <span className="pagination-info">
              Página {filters.page} de {paginacion.total_paginas}
            </span>
            
            <button
              className="btn btn-outline"
              disabled={filters.page >= paginacion.total_paginas}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              Siguiente ▶️
            </button>
          </div>
        )}
      </>
    );
  };

  const renderSolicitudes = () => {
    if (!Array.isArray(solicitudes) || solicitudes.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={48} />
          </div>
          <h3>No hay solicitudes de préstamo</h3>
          <p>No has realizado ninguna solicitud de préstamo</p>
        </div>
      );
    }

    return (
      <div className="solicitudes-grid">
        {solicitudes.map(solicitud => (
          <div key={solicitud.id} className="solicitud-card">
            <div className="solicitud-header">
              <h4>{solicitud.implemento || 'Implemento no especificado'}</h4>
              {getEstadoBadge(solicitud.estado)}
            </div>
            
            <div className="solicitud-details">
              <div className="detail-item">
                <span className="detail-label">
                  <Calendar size={14} />
                  Fecha Solicitud:
                </span>
                <span className="detail-value">
                  {solicitud.fecha_solicitud ? formatFecha(solicitud.fecha_solicitud) : 
                   solicitud.created_at ? formatFecha(solicitud.created_at) : 'N/A'}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  <BarChart3 size={14} />
                  Estado:
                </span>
                <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                  {solicitud.estado || 'Desconocido'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="user-loans-history">
      {/* Tabs de Navegación */}
      <div className="history-tabs">
        <button
          className={`tab-button ${activeTab === 'prestamos' ? 'active' : ''}`}
          onClick={() => setActiveTab('prestamos')}
        >
          <FileText size={16} />
          Préstamos Activos/Historial
        </button>
        <button
          className={`tab-button ${activeTab === 'solicitudes' ? 'active' : ''}`}
          onClick={() => setActiveTab('solicitudes')}
        >
          <Clock size={16} />
          Solicitudes de Préstamo
        </button>
      </div>

      {/* Filtros (solo para préstamos) */}
      {activeTab === 'prestamos' && (
        <div className="history-filters">
          <div className="filter-group">
            <label>
              <Search size={16} />
              Estado:
            </label>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="devuelto">Devuelto</option>
              <option value="pendiente">Pendiente</option>
              <option value="perdido">Perdido</option>
              <option value="solicitado">Solicitado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Search size={16} />
              Implemento:
            </label>
            <input
              type="text"
              placeholder="Filtrar por implemento..."
              value={filters.implemento}
              onChange={(e) => handleFilterChange('implemento', e.target.value)}
            />
          </div>

          <button 
            className="btn btn-secondary"
            onClick={loadPrestamos}
            style={{ alignSelf: 'flex-end', marginBottom: '0.5rem' }}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      )}

      {/* Contenido */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando {activeTab === 'prestamos' ? 'historial' : 'solicitudes'}...</p>
        </div>
      ) : (
        <>
          {activeTab === 'prestamos' && renderPrestamos()}
          {activeTab === 'solicitudes' && renderSolicitudes()}
        </>
      )}
    </div>
  );
};

export default UserLoansHistory;