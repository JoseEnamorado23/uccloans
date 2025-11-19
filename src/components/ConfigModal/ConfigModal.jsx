// components/ConfigModal/ConfigModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Clock, Settings, Users, Calendar, Save, Loader } from 'lucide-react';
import './ConfigModal.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ConfigModal = ({ isOpen, onClose }) => {
  const [configuraciones, setConfiguraciones] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('tiempos');
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarConfiguraciones();
    }
  }, [isOpen]);

  const cargarConfiguraciones = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/object`);
      const data = await response.json();
      
      if (data.success) {
        setConfiguraciones(data.data);
      }
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const actualizarConfiguracion = async (clave, valor) => {
    setGuardando(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/${clave}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor })
      });

      const data = await response.json();
      
      if (data.success) {
        setConfiguraciones(prev => ({
          ...prev,
          [clave]: valor
        }));
      }
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (clave, valor) => {
    setConfiguraciones(prev => ({
      ...prev,
      [clave]: valor
    }));
  };

  const handleGuardar = (clave) => {
    actualizarConfiguracion(clave, configuraciones[clave]);
  };

  if (!isOpen) return null;

  return (
    <div className="config-modal-overlay" onClick={onClose}>
      <div className="config-modal-wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="config-modal-header">
          <div>
            <h2>Configuración del Sistema</h2>
            <p className="config-subtitle">Gestión de parámetros y horarios</p>
          </div>
          <button className="config-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className="config-modal-content-wide">
          {/* Sidebar */}
          <div className="config-sidebar-wide">
            <button 
              className={`sidebar-item-wide ${seccionActiva === 'tiempos' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('tiempos')}
            >
              <Clock size={18} />
              <span>Tiempos</span>
            </button>
            <button className="sidebar-item-wide disabled">
              <Calendar size={18} />
              <span>Horarios</span>
            </button>
            <button className="sidebar-item-wide disabled">
              <Users size={18} />
              <span>Usuarios</span>
            </button>
            <button className="sidebar-item-wide disabled">
              <Settings size={18} />
              <span>Sistema</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="config-main-content-wide">
            {cargando ? (
              <div className="config-loading">
                <Loader size={32} className="config-spinner" />
                <span>Cargando configuraciones...</span>
              </div>
            ) : (
              <>
                {seccionActiva === 'tiempos' && (
                  <div className="config-section-wide">
                    <div className="section-header-wide">
                      <Clock size={24} />
                      <div>
                        <h3>Configuración de Tiempos</h3>
                        <p className="section-description">
                          Parámetros de duración y alertas para préstamos
                        </p>
                      </div>
                    </div>

                    <div className="config-grid-wide">
                      {/* Tiempo máximo de préstamo */}
                      <div className="config-item-wide">
                        <div className="config-item-header-wide">
                          <label>Tiempo Máximo de Préstamo</label>
                          <span className="config-current-value">
                            {configuraciones.tiempo_maximo_prestamo_horas || 0} horas
                          </span>
                        </div>
                        <div className="input-group-wide">
                          <input
                            type="number"
                            value={configuraciones.tiempo_maximo_prestamo_horas || ''}
                            onChange={(e) => handleChange('tiempo_maximo_prestamo_horas', e.target.value)}
                            min="1"
                            max="8"
                            step="0.5"
                            placeholder="3"
                          />
                          <span className="input-suffix-wide">horas</span>
                        </div>
                        <small>Duración máxima permitida para los préstamos</small>
                        <button 
                          className="save-btn-wide"
                          onClick={() => handleGuardar('tiempo_maximo_prestamo_horas')}
                          disabled={guardando}
                        >
                          {guardando ? <Loader size={16} className="config-spinner" /> : <Save size={16} />}
                          <span>Guardar</span>
                        </button>
                      </div>

                      {/* Tiempo de alerta */}
                      <div className="config-item-wide">
                        <div className="config-item-header-wide">
                          <label>Alerta Preventiva</label>
                          <span className="config-current-value">
                            {configuraciones.mostrar_alerta_horas_antes || 0} horas
                          </span>
                        </div>
                        <div className="input-group-wide">
                          <input
                            type="number"
                            value={configuraciones.mostrar_alerta_horas_antes || ''}
                            onChange={(e) => handleChange('mostrar_alerta_horas_antes', e.target.value)}
                            min="0.1"
                            max="2"
                            step="0.1"
                            placeholder="0.5"
                          />
                          <span className="input-suffix-wide">horas</span>
                        </div>
                        <small>Tiempo de anticipación para alertas de vencimiento</small>
                        <button 
                          className="save-btn-wide"
                          onClick={() => handleGuardar('mostrar_alerta_horas_antes')}
                          disabled={guardando}
                        >
                          {guardando ? <Loader size={16} className="config-spinner" /> : <Save size={16} />}
                          <span>Guardar</span>
                        </button>
                      </div>

                      {/* Apertura Mañana */}
                      <div className="config-item-wide">
                        <div className="config-item-header-wide">
                          <label>Apertura Mañana</label>
                          <span className="config-current-value">
                            {configuraciones.hora_apertura_manana || '--:--'}
                          </span>
                        </div>
                        <input
                          type="time"
                          value={configuraciones.hora_apertura_manana || ''}
                          onChange={(e) => handleChange('hora_apertura_manana', e.target.value)}
                        />
                        <small>Hora de inicio de la jornada matutina</small>
                        <button 
                          className="save-btn-wide"
                          onClick={() => handleGuardar('hora_apertura_manana')}
                          disabled={guardando}
                        >
                          {guardando ? <Loader size={16} className="config-spinner" /> : <Save size={16} />}
                          <span>Guardar</span>
                        </button>
                      </div>

                      {/* Cierre Mañana */}
                      <div className="config-item-wide">
                        <div className="config-item-header-wide">
                          <label>Cierre Mañana</label>
                          <span className="config-current-value">
                            {configuraciones.hora_cierre_manana || '--:--'}
                          </span>
                        </div>
                        <input
                          type="time"
                          value={configuraciones.hora_cierre_manana || ''}
                          onChange={(e) => handleChange('hora_cierre_manana', e.target.value)}
                        />
                        <small>Hora de finalización de la jornada matutina</small>
                        <button 
                          className="save-btn-wide"
                          onClick={() => handleGuardar('hora_cierre_manana')}
                          disabled={guardando}
                        >
                          {guardando ? <Loader size={16} className="config-spinner" /> : <Save size={16} />}
                          <span>Guardar</span>
                        </button>
                      </div>

                      {/* Apertura Tarde */}
                      <div className="config-item-wide">
                        <div className="config-item-header-wide">
                          <label>Apertura Tarde</label>
                          <span className="config-current-value">
                            {configuraciones.hora_apertura_tarde || '--:--'}
                          </span>
                        </div>
                        <input
                          type="time"
                          value={configuraciones.hora_apertura_tarde || ''}
                          onChange={(e) => handleChange('hora_apertura_tarde', e.target.value)}
                        />
                        <small>Hora de inicio de la jornada vespertina</small>
                        <button 
                          className="save-btn-wide"
                          onClick={() => handleGuardar('hora_apertura_tarde')}
                          disabled={guardando}
                        >
                          {guardando ? <Loader size={16} className="config-spinner" /> : <Save size={16} />}
                          <span>Guardar</span>
                        </button>
                      </div>

                      {/* Cierre Tarde */}
                      <div className="config-item-wide">
                        <div className="config-item-header-wide">
                          <label>Cierre Tarde</label>
                          <span className="config-current-value">
                            {configuraciones.hora_cierre_tarde || '--:--'}
                          </span>
                        </div>
                        <input
                          type="time"
                          value={configuraciones.hora_cierre_tarde || ''}
                          onChange={(e) => handleChange('hora_cierre_tarde', e.target.value)}
                        />
                        <small>Hora de finalización de la jornada vespertina</small>
                        <button 
                          className="save-btn-wide"
                          onClick={() => handleGuardar('hora_cierre_tarde')}
                          disabled={guardando}
                        >
                          {guardando ? <Loader size={16} className="config-spinner" /> : <Save size={16} />}
                          <span>Guardar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;