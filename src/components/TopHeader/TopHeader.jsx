// src/components/Admin/TopHeader.jsx - MODIFICADO CON TÍTULOS DINÁMICOS
import React, { useState, useEffect } from "react";

import { 
  Search, Bell, HelpCircle, Settings, User, LogOut, Calendar, Clock,
  Plus, Handshake, Wrench, CheckCircle, Users, BookOpen, BarChart3 
} from "lucide-react";
import loanRequestsService from "../../services/loanRequests.service";
import "./TopHeader.css";

const TopHeader = ({ onConfigClick, sidebarOpen }) => {
  
  const [pageInfo, setPageInfo] = useState({ 
    title: "Dashboard", 
    subtitle: "Sistema de Gestión de Préstamos", 
    icon: null 
  });
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showSolicitudModal, setShowSolicitudModal] = useState(false);
  
  const currentDate = new Date();
  const formattedTime = currentDate.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const formattedDate = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // ✅ EFECTO PARA TÍTULOS DINÁMICOS
  

  useEffect(() => {
    loadSolicitudesPendientes();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadSolicitudesPendientes, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSolicitudesPendientes = async () => {
    try {
      setLoadingSolicitudes(true);
      const result = await loanRequestsService.getPendingRequests();
      if (result.success) {
        setSolicitudesPendientes(result.data);
      }
    } catch (error) {
      console.error('Error cargando solicitudes pendientes:', error);
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    window.location.href = "/";
  };

  const handleSolicitudClick = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowSolicitudModal(true);
    setShowNotifications(false);
  };

  const handleAprobarSolicitud = async (solicitudId) => {
    try {
      const result = await loanRequestsService.approveLoanRequest(solicitudId);
      if (result.success) {
        alert('✅ Solicitud aprobada exitosamente');
        setShowSolicitudModal(false);
        await loadSolicitudesPendientes();
      }
    } catch (error) {
      alert(error.message || 'Error al aprobar solicitud');
    }
  };

  const handleRechazarSolicitud = async (solicitudId, motivo) => {
    const motivoRechazo = prompt('Ingresa el motivo del rechazo:');
    if (!motivoRechazo) return;

    try {
      const result = await loanRequestsService.rejectLoanRequest(solicitudId, motivoRechazo);
      if (result.success) {
        alert('✅ Solicitud rechazada exitosamente');
        setShowSolicitudModal(false);
        await loadSolicitudesPendientes();
      }
    } catch (error) {
      alert(error.message || 'Error al rechazar solicitud');
    }
  };

  const IconComponent = pageInfo.icon;

  return (
    <header className="top-header">
      <div className="header-content">
        {/* ✅ TÍTULO DINÁMICO */}
        

        {/* Iconos */}
        <div className="header-icons">
          {/* Calendario */}
          <div className="icon-container" onClick={() => setShowCalendar(!showCalendar)}>
            <Calendar size={20} />
            {showCalendar && (
              <div className="calendar-dropdown">
                <div className="calendar-time">{formattedTime}</div>
                <div className="calendar-date">{formattedDate}</div>
              </div>
            )}
          </div>
          
          {/* ✅ NOTIFICACIONES DE SOLICITUDES */}
          <div className="icon-container" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {solicitudesPendientes.length > 0 && (
              <span className="notification-badge">{solicitudesPendientes.length}</span>
            )}
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>📝 Solicitudes Pendientes</h4>
                  <span className="badge-count">{solicitudesPendientes.length}</span>
                </div>
                
                {loadingSolicitudes ? (
                  <div className="notification-loading">
                    <div className="loading-spinner-small"></div>
                    <span>Cargando...</span>
                  </div>
                ) : solicitudesPendientes.length === 0 ? (
                  <div className="notification-empty">
                    <span>No hay solicitudes pendientes</span>
                  </div>
                ) : (
                  <div className="notifications-list">
                    {solicitudesPendientes.slice(0, 5).map((solicitud) => (
                      <div 
                        key={solicitud.id} 
                        className="notification-item"
                        onClick={() => handleSolicitudClick(solicitud)}
                      >
                        <div className="notification-icon">📋</div>
                        <div className="notification-content">
                          <div className="notification-title">
                            {solicitud.nombre_completo}
                          </div>
                          <div className="notification-desc">
                            {solicitud.implemento}
                          </div>
                          <div className="notification-time">
                            {new Date(solicitud.fecha_registro).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {solicitudesPendientes.length > 5 && (
                      <div className="notification-more">
                        +{solicitudesPendientes.length - 5} más solicitudes
                      </div>
                    )}
                  </div>
                )}
                
                <div className="notifications-footer">
                  <button 
                    className="btn-view-all"
                    onClick={() => {
                      // Aquí podrías redirigir a una página de gestión de solicitudes
                      window.location.href = '/dashboard/prestamos';
                    }}
                  >
                    Ver todas las solicitudes
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Ayuda */}
          <div className="icon-container">
            <HelpCircle size={20} />
          </div>
          
          {/* Configuración */}
          <div className="icon-container" onClick={onConfigClick}>
            <Settings size={20} />
          </div>
          
          {/* Usuario */}
          <div className="icon-container" onClick={() => setShowUserModal(!showUserModal)}>
            <User size={20} />
            {showUserModal && (
              <div className="user-modal">
                <div className="user-info">
                  <div className="user-avatar">
                    <User size={24} />
                  </div>
                  <div className="user-details">
                    <div className="user-name">Administrador</div>
                    <div className="user-email">admin@ucc.edu.co</div>
                  </div>
                </div>
                <div className="user-actions">
                  <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ MODAL DE DETALLE DE SOLICITUD */}
      {showSolicitudModal && selectedSolicitud && (
        <div className="modal-overlay">
          <div className="solicitud-modal">
            <div className="modal-header">
              <h3>📋 Detalle de Solicitud</h3>
              <button 
                className="close-btn"
                onClick={() => setShowSolicitudModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="solicitud-info">
                <div className="info-row">
                  <label>Solicitante:</label>
                  <span>{selectedSolicitud.nombre_completo}</span>
                </div>
                <div className="info-row">
                  <label>Cédula:</label>
                  <span>{selectedSolicitud.numero_cedula}</span>
                </div>
                <div className="info-row">
                  <label>Programa:</label>
                  <span>{selectedSolicitud.programa || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Teléfono:</label>
                  <span>{selectedSolicitud.numero_telefono}</span>
                </div>
                <div className="info-row">
                  <label>Implemento:</label>
                  <span>{selectedSolicitud.implemento}</span>
                </div>
                <div className="info-row">
                  <label>Fecha solicitud:</label>
                  <span>
                    {new Date(selectedSolicitud.fecha_registro).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <div className="info-row">
                  <label>Hora solicitud:</label>
                  <span>
                    {new Date(selectedSolicitud.fecha_registro).toLocaleTimeString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-aprobar"
                onClick={() => handleAprobarSolicitud(selectedSolicitud.id)}
              >
                ✅ Aprobar Solicitud
              </button>
              <button 
                className="btn-rechazar"
                onClick={() => handleRechazarSolicitud(selectedSolicitud.id)}
              >
                ❌ Rechazar Solicitud
              </button>
              <button 
                className="btn-cancelar"
                onClick={() => setShowSolicitudModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopHeader;