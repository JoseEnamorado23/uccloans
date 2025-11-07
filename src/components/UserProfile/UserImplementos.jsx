// src/components/UserProfile/UserImplementos.jsx
import React, { useState, useEffect } from 'react';
import { useImplementosUser } from '../../hooks/useImplementosUser';
import loanRequestsService from '../../services/loanRequests.service';
import { useAuth } from '../../hooks/useAuth'; 
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

  const { user } = useAuth(); // ✅ AHORA DEBERÍA FUNCIONAR
  
  // ✅ AGREGAR DEBUG PARA VERIFICAR
  console.log('🔐 Usuario desde useAuth:', user);
  console.log('🆔 User ID:', user?.id);
  console.log('📧 User email:', user?.email);

  const [filters, setFilters] = useState({
    search: ''
  });
  const [solicitando, setSolicitando] = useState(null);

  useEffect(() => {
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
    // ✅ VERIFICAR USUARIO CON DEBUG
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
      return { text: '🔴 No disponible', class: 'badge-unavailable' };
    } else if (cantidadDisponible < cantidadTotal * 0.3) {
      return { text: '🟡 Poco stock', class: 'badge-low' };
    } else if (cantidadDisponible < cantidadTotal * 0.7) {
      return { text: '🟠 Stock moderado', class: 'badge-medium' };
    } else {
      return { text: '🟢 Disponible', class: 'badge-available' };
    }
  };

  const getStockInfo = (cantidadDisponible, cantidadTotal) => {
    return `${cantidadDisponible} de ${cantidadTotal} disponibles`;
  };

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar implementos</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => cargarImplementosDisponibles()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="user-implementos">
      <div className="implementos-header">
        <h2>🎯 Implementos Disponibles</h2>
        <p>Selecciona un implemento para solicitar préstamo</p>
      </div>

      {/* Filtros */}
      <div className="implementos-filters">
        <div className="filter-group">
          <label>Buscar implemento:</label>
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
          {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="implementos-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Implementos</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.disponibles}</span>
          <span className="stat-label">Disponibles</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.unidadesTotales}</span>
          <span className="stat-label">Unidades Totales</span>
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
          <div className="empty-icon">🎯</div>
          <h3>No hay implementos disponibles</h3>
          <p>No se encontraron implementos con los filtros aplicados</p>
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
                      🎯
                    </div>
                  )}
                </div>
                
                <div className="implemento-content">
                  <div className="implemento-header">
                    <h4>{implemento.nombre}</h4>
                    <span className={`badge ${disponibilidad.class}`}>
                      {disponibilidad.text}
                    </span>
                  </div>
                  
                  <div className="implemento-details">
                    <div className="detail-item">
                      <span className="detail-label">Stock:</span>
                      <span className="detail-value">
                        {getStockInfo(implemento.cantidad_disponible, implemento.cantidad_total)}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Estado:</span>
                      <span className={`status ${implemento.activo ? 'active' : 'inactive'}`}>
                        {implemento.activo ? '✅ Activo' : '⏸️ Inactivo'}
                      </span>
                    </div>
                  </div>

                  {/* ✅ BOTÓN DE SOLICITAR - AGREGADO */}
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
                        '⏳ Enviando...'
                      ) : implemento.cantidad_disponible <= 0 ? (
                        '❌ No Disponible'
                      ) : !implemento.activo ? (
                        '⏸️ Inactivo'
                      ) : (
                        '📝 Solicitar Préstamo'
                      )}
                    </button>
                  </div>

                  {implemento.fecha_actualizacion && (
                    <div className="implemento-footer">
                      <small>
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