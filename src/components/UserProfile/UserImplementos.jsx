// src/components/UserProfile/UserImplementos.jsx
import React, { useState, useEffect } from 'react';
import { useImplementosUser } from '../../hooks/useImplementosUser';
import loanRequestsService from '../../services/loanRequests.service';
import { useAuth } from '../../hooks/useAuth'; 
import { 
  Search, 
  RefreshCw, 
  Wrench, 
  Package, 
  PackageCheck, 
  PackageX,
  CheckCircle, 
  XCircle, 
  Dices,
  Clock,
  AlertCircle,
  BarChart3,
  Send
} from 'lucide-react';
import './UserImplementos.css';

const UserImplementos = () => {
  const { 
    implementos, 
    stats, 
    loading, 
    error, 
    cargarImplementosDisponibles, 
    buscarImplementos 
  } = useImplementosUser();

  const { user } = useAuth();
  
  // Debug para verificar datos del usuario
  console.log('🔐 Usuario desde useAuth:', user);
  console.log('🆔 User ID:', user?.id);
  console.log('📧 User email:', user?.email);

  const [filters, setFilters] = useState({
    search: ''
  });
  const [solicitando, setSolicitando] = useState(null);

  useEffect(() => {
    console.log('🔧 INICIANDO DEBUG DE HORA BOGOTÁ');
  const test = loanRequestsService.testBogotaTime();
  console.log('🧪 RESULTADO TEST:', test);
    if (filters.search) {
      buscarImplementos(filters.search);
    } else {
      cargarImplementosDisponibles();
    }
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSolicitarPrestamo = async (implemento) => {
    // Verificar usuario
    console.log('🔄 Intentando solicitar préstamo...');
    console.log('👤 Usuario actual:', user);
    console.log('🆔 User ID para solicitud:', user?.id);

    if (!user?.id) {
      alert('❌ Debes iniciar sesión para solicitar préstamos');
      console.error('❌ No se encontró user.id');
      return;
    }

    // Confirmación antes de enviar solicitud
    const confirmar = window.confirm(
      `¿Estás seguro de que quieres solicitar el implemento: ${implemento.nombre}?`
    );

    if (!confirmar) return;

    try {
      setSolicitando(implemento.id);
      
      console.log('📤 Enviando solicitud con datos:', {
        usuario_id: user.id,
        implemento: implemento.nombre
      });

      const result = await loanRequestsService.createLoanRequest({
        usuario_id: user.id,
        implemento: implemento.nombre
      });

      if (result.success) {
        alert('✅ Solicitud enviada. Espera la aprobación del administrador.');
        // Recargar implementos para actualizar disponibilidad
        await cargarImplementosDisponibles();
      }
    } catch (error) {
      console.error('❌ Error solicitando préstamo:', error);
      alert(error.message || 'Error al enviar solicitud');
    } finally {
      setSolicitando(null);
    }
  };

  const getDisponibilidadBadge = (cantidadDisponible, cantidadTotal) => {
    if (cantidadDisponible === 0) {
      return { 
        text: 'No disponible', 
        class: 'badge-unavailable',
        icon: <PackageX size={14} />
      };
    } else if (cantidadDisponible < cantidadTotal * 0.3) {
      return { 
        text: 'Poco stock', 
        class: 'badge-low',
        icon: <Package size={14} />
      };
    } else if (cantidadDisponible < cantidadTotal * 0.7) {
      return { 
        text: 'Stock moderado', 
        class: 'badge-medium',
        icon: <Package size={14} />
      };
    } else {
      return { 
        text: 'Disponible', 
        class: 'badge-available',
        icon: <PackageCheck size={14} />
      };
    }
  };

  const getStockInfo = (cantidadDisponible, cantidadTotal) => {
    return `${cantidadDisponible} de ${cantidadTotal} disponibles`;
  };

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">
          <AlertCircle size={48} />
        </div>
        <h3>Error al cargar implementos</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => cargarImplementosDisponibles()}
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="user-implementos">
      <div className="implementos-header">
        <h2>
          <Wrench size={24} />
          Implementos Disponibles
        </h2>
        <p>Selecciona un implemento para solicitar préstamo</p>
      </div>

      {/* Filtros */}
      <div className="implementos-filters">
        <div className="filter-group">
          <label>
            <Search size={16} />
            Buscar implemento:
          </label>
          <input
            type="text"
            placeholder="Nombre del implemento..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => cargarImplementosDisponibles()}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="spinning" />
              Cargando...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Actualizar
            </>
          )}
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="implementos-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">
            <Dices size={16} />
            Total Implementos
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.disponibles}</span>
          <span className="stat-label">
            <PackageCheck size={16} />
            Disponibles Ahora
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.unidadesTotales}</span>
          <span className="stat-label">
            <Package size={16} />
            Unidades Totales
          </span>
        </div>
      </div>

      {/* Lista de implementos */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando implementos...</p>
        </div>
      ) : implementos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Dices size={48} />
          </div>
          <h3>No hay implementos disponibles</h3>
          <p>No se encontraron implementos con los filtros aplicados</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setFilters({ search: '' });
              cargarImplementosDisponibles();
            }}
          >
            <RefreshCw size={16} />
            Ver todos los implementos
          </button>
        </div>
      ) : (
        <div className="implementos-grid">
          {implementos.map(implemento => {
            const disponibilidad = getDisponibilidadBadge(
              implemento.cantidad_disponible, 
              implemento.cantidad_total
            );
            
            return (
              <div key={implemento.id} className="implemento-card">
                <div className="implemento-image">
                  {implemento.imagen_url ? (
                    <img src={implemento.imagen_url} alt={implemento.nombre} />
                  ) : (
                    <div className="implemento-placeholder">
                      <Wrench size={48} />
                    </div>
                  )}
                </div>
                
                <div className="implemento-content">
                  <div className="implemento-header">
                    <h4>{implemento.nombre}</h4>
                    <span className={`badge ${disponibilidad.class}`}>
                      {disponibilidad.icon}
                      {disponibilidad.text}
                    </span>
                  </div>
                  
                  <div className="implemento-details">
                    <div className="detail-item">
                      <span className="detail-label">
                        <Package size={14} />
                        Stock:
                      </span>
                      <span className="detail-value">
                        {getStockInfo(implemento.cantidad_disponible, implemento.cantidad_total)}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">
                        <BarChart3 size={14} />
                        Estado:
                      </span>
                      <span className={`status ${implemento.activo ? 'active' : 'inactive'}`}>
                        {implemento.activo ? (
                          <>
                            <CheckCircle size={14} />
                            Activo
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Inactivo
                          </>
                        )}
                      </span>
                    </div>

                    {implemento.descripcion && (
                      <div className="detail-item">
                        <span className="detail-label">
                          <Clock size={14} />
                          Descripción:
                        </span>
                        <span className="detail-value" style={{fontSize: '0.8rem', textAlign: 'right'}}>
                          {implemento.descripcion.length > 50 
                            ? `${implemento.descripcion.substring(0, 50)}...` 
                            : implemento.descripcion}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botón de Solicitar */}
                  <div className="implemento-actions">
                    <button
                      onClick={() => handleSolicitarPrestamo(implemento)}
                      disabled={
                        implemento.cantidad_disponible <= 0 || 
                        !implemento.activo ||
                        solicitando === implemento.id
                      }
                      className={`btn-solicitar ${
                        implemento.cantidad_disponible <= 0 || !implemento.activo ? 'disabled' : ''
                      }`}
                    >
                      {solicitando === implemento.id ? (
                        <>
                          <RefreshCw size={16} className="spinning" />
                          Enviando solicitud...
                        </>
                      ) : implemento.cantidad_disponible <= 0 ? (
                        <>
                          <PackageX size={16} />
                          No Disponible
                        </>
                      ) : !implemento.activo ? (
                        <>
                          <XCircle size={16} />
                          Temporalmente Inactivo
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Solicitar Préstamo
                        </>
                      )}
                    </button>
                  </div>

                  {implemento.fecha_actualizacion && (
                    <div className="implemento-footer">
                      <small>
                        <Clock size={12} />
                        Actualizado: {new Date(implemento.fecha_actualizacion).toLocaleDateString('es-CO')}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserImplementos;