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
    <div className="mm-overlay" onClick={onClose}>
      <div className="mm-card config-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="mm-head">
          <div>
            <h3 className="mm-title">Configuración del Sistema</h3>
            <p className="mm-sub">Gestión de parámetros y horarios</p>
          </div>
          <button className="mm-close" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className="config-modal-content">
          {/* Sidebar */}
          <div className="config-sidebar">
            <button 
              className={`sidebar-item ${seccionActiva === 'tiempos' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('tiempos')}
            >
              <Clock size={16} />
              Tiempos
            </button>
            <button className="sidebar-item disabled">
              <Calendar size={16} />
              Horarios
            </button>
            <button className="sidebar-item disabled">
              <Users size={16} />
              Usuarios
            </button>
            <button className="sidebar-item disabled">
              <Settings size={16} />
              Sistema
            </button>
          </div>

          {/* Main Content */}
          <div className="config-main-content">
            {cargando ? (
              <div className="cargando">
                <Loader size={24} className="spinner" />
                Cargando configuraciones...
              </div>
            ) : (
              <>
                {seccionActiva === 'tiempos' && (
                  <div className="config-seccion">
                    <div className="seccion-header">
                      <Clock size={20} />
                      <div>
                        <h3>Configuración de Tiempos</h3>
                        <p className="seccion-descripcion">
                          Parámetros de duración y alertas para préstamos
                        </p>
                      </div>
                    </div>

                    <div className="config-grid-three-columns">
                      {/* Columna 1 */}
                      <div className="config-column">
                        {/* Tiempo máximo de préstamo */}
                        <div className="config-item">
                          <div className="config-item-header">
                            <label>Tiempo Máximo</label>
                            <span className="config-item-value">
                              {configuraciones.tiempo_maximo_prestamo_horas || 0}h
                            </span>
                          </div>
                          <div className="input-group">
                            <input
                              type="number"
                              value={configuraciones.tiempo_maximo_prestamo_horas || ''}
                              onChange={(e) => handleChange('tiempo_maximo_prestamo_horas', e.target.value)}
                              min="1"
                              max="8"
                              step="0.5"
                              placeholder="3"
                            />
                            <span className="input-suffix">horas</span>
                          </div>
                          <small>Duración máxima del préstamo</small>
                          <button 
                            className="mm-btn mm-btn--primary config-save-btn"
                            onClick={() => handleGuardar('tiempo_maximo_prestamo_horas')}
                            disabled={guardando}
                          >
                            {guardando ? <Loader size={16} className="spinner" /> : <Save size={16} />}
                            Guardar
                          </button>
                        </div>

                        {/* Apertura Mañana */}
                        <div className="config-item">
                          <div className="config-item-header">
                            <label>Apertura Mañana</label>
                            <span className="config-item-value">
                              {configuraciones.hora_apertura_manana || '--:--'}
                            </span>
                          </div>
                          <input
                            type="time"
                            value={configuraciones.hora_apertura_manana || ''}
                            onChange={(e) => handleChange('hora_apertura_manana', e.target.value)}
                          />
                          <small>Inicio jornada mañana</small>
                          <button 
                            className="mm-btn mm-btn--primary config-save-btn"
                            onClick={() => handleGuardar('hora_apertura_manana')}
                            disabled={guardando}
                          >
                            {guardando ? <Loader size={16} className="spinner" /> : <Save size={16} />}
                            Guardar
                          </button>
                        </div>
                      </div>

                      {/* Columna 2 */}
                      <div className="config-column">
                        {/* Tiempo de alerta */}
                        <div className="config-item">
                          <div className="config-item-header">
                            <label>Alerta Preventiva</label>
                            <span className="config-item-value">
                              {configuraciones.mostrar_alerta_horas_antes || 0}h
                            </span>
                          </div>
                          <div className="input-group">
                            <input
                              type="number"
                              value={configuraciones.mostrar_alerta_horas_antes || ''}
                              onChange={(e) => handleChange('mostrar_alerta_horas_antes', e.target.value)}
                              min="0.1"
                              max="2"
                              step="0.1"
                              placeholder="0.5"
                            />
                            <span className="input-suffix">horas</span>
                          </div>
                          <small>Anticipación para alertas</small>
                          <button 
                            className="mm-btn mm-btn--primary config-save-btn"
                            onClick={() => handleGuardar('mostrar_alerta_horas_antes')}
                            disabled={guardando}
                          >
                            {guardando ? <Loader size={16} className="spinner" /> : <Save size={16} />}
                            Guardar
                          </button>
                        </div>

                        {/* Cierre Mañana */}
                        <div className="config-item">
                          <div className="config-item-header">
                            <label>Cierre Mañana</label>
                            <span className="config-item-value">
                              {configuraciones.hora_cierre_manana || '--:--'}
                            </span>
                          </div>
                          <input
                            type="time"
                            value={configuraciones.hora_cierre_manana || ''}
                            onChange={(e) => handleChange('hora_cierre_manana', e.target.value)}
                          />
                          <small>Fin jornada mañana</small>
                          <button 
                            className="mm-btn mm-btn--primary config-save-btn"
                            onClick={() => handleGuardar('hora_cierre_manana')}
                            disabled={guardando}
                          >
                            {guardando ? <Loader size={16} className="spinner" /> : <Save size={16} />}
                            Guardar
                          </button>
                        </div>
                      </div>

                      {/* Columna 3 */}
                      <div className="config-column">
                        {/* Apertura Tarde */}
                        <div className="config-item">
                          <div className="config-item-header">
                            <label>Apertura Tarde</label>
                            <span className="config-item-value">
                              {configuraciones.hora_apertura_tarde || '--:--'}
                            </span>
                          </div>
                          <input
                            type="time"
                            value={configuraciones.hora_apertura_tarde || ''}
                            onChange={(e) => handleChange('hora_apertura_tarde', e.target.value)}
                          />
                          <small>Inicio jornada tarde</small>
                          <button 
                            className="mm-btn mm-btn--primary config-save-btn"
                            onClick={() => handleGuardar('hora_apertura_tarde')}
                            disabled={guardando}
                          >
                            {guardando ? <Loader size={16} className="spinner" /> : <Save size={16} />}
                            Guardar
                          </button>
                        </div>

                        {/* Cierre Tarde */}
                        <div className="config-item">
                          <div className="config-item-header">
                            <label>Cierre Tarde</label>
                            <span className="config-item-value">
                              {configuraciones.hora_cierre_tarde || '--:--'}
                            </span>
                          </div>
                          <input
                            type="time"
                            value={configuraciones.hora_cierre_tarde || ''}
                            onChange={(e) => handleChange('hora_cierre_tarde', e.target.value)}
                          />
                          <small>Fin jornada tarde</small>
                          <button 
                            className="mm-btn mm-btn--primary config-save-btn"
                            onClick={() => handleGuardar('hora_cierre_tarde')}
                            disabled={guardando}
                          >
                            {guardando ? <Loader size={16} className="spinner" /> : <Save size={16} />}
                            Guardar
                          </button>
                        </div>
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