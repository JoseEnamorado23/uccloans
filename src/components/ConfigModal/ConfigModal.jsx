// components/ConfigModal/ConfigModal.jsx
import React, { useState, useEffect } from 'react';
import './ConfigModal.css';

const ConfigModal = ({ isOpen, onClose }) => {
  const [configuraciones, setConfiguraciones] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('tiempos');
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Cargar configuraciones al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarConfiguraciones();
    }
  }, [isOpen]);

  const cargarConfiguraciones = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:4000/api/config/object');
      const data = await response.json();
      
      if (data.success) {
        setConfiguraciones(data.data);
      }
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
      alert('Error al cargar configuraciones');
    } finally {
      setCargando(false);
    }
  };

  const actualizarConfiguracion = async (clave, valor) => {
    setGuardando(true);
    try {
      const response = await fetch(`http://localhost:4000/api/config/${clave}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor })
      });

      const data = await response.json();
      
      if (data.success) {
        // Actualizar estado local
        setConfiguraciones(prev => ({
          ...prev,
          [clave]: valor
        }));
      } else {
        alert('Error al guardar configuración');
      }
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      alert('Error al guardar configuración');
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
    <div className="config-modal-overlay">
      <div className="config-modal">
        {/* Header del Modal */}
        <div className="config-modal-header">
          <h2>⚙️ Configuración del Sistema</h2>
          <button className="btn-cerrar" onClick={onClose}>✕</button>
        </div>

        <div className="config-modal-content">
          {/* Sidebar Lateral */}
          <div className="config-sidebar">
            <button 
              className={`sidebar-item ${seccionActiva === 'tiempos' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('tiempos')}
            >
              ⏰ Tiempos de Préstamos
            </button>
            {/* Puedes agregar más secciones después */}
            <button className="sidebar-item disabled">
              📊 Horarios (Próximamente)
            </button>
            <button className="sidebar-item disabled">
              👥 Usuarios (Próximamente)
            </button>
          </div>

          {/* Contenido Principal */}
          <div className="config-main-content">
            {cargando ? (
              <div className="cargando">Cargando configuraciones...</div>
            ) : (
              <>
                {seccionActiva === 'tiempos' && (
                  <div className="config-seccion">
                    <h3>⏰ Configuración de Tiempos</h3>
                    <p className="seccion-descripcion">
                      Configura los tiempos máximos y alertas para los préstamos
                    </p>

                    <div className="config-grid">
                      {/* Tiempo máximo de préstamo */}
                      <div className="config-item">
                        <label htmlFor="tiempo_maximo">
                          Tiempo Máximo de Préstamo (horas)
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            id="tiempo_maximo"
                            value={configuraciones.tiempo_maximo_prestamo_horas || ''}
                            onChange={(e) => handleChange('tiempo_maximo_prestamo_horas', e.target.value)}
                            min="1"
                            max="8"
                            step="0.5"
                          />
                          <span className="input-suffix">horas</span>
                        </div>
                        <small>
                          Tiempo máximo que un usuario puede tener un implemento
                        </small>
                        <button 
                          className="btn-guardar"
                          onClick={() => handleGuardar('tiempo_maximo_prestamo_horas')}
                          disabled={guardando}
                        >
                          {guardando ? '⏳' : '💾'} Guardar
                        </button>
                      </div>

                      {/* Tiempo de alerta */}
                      <div className="config-item">
                        <label htmlFor="tiempo_alerta">
                          Mostrar Alerta (horas antes)
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            id="tiempo_alerta"
                            value={configuraciones.mostrar_alerta_horas_antes || ''}
                            onChange={(e) => handleChange('mostrar_alerta_horas_antes', e.target.value)}
                            min="0.1"
                            max="2"
                            step="0.1"
                          />
                          <span className="input-suffix">horas</span>
                        </div>
                        <small>
                          Cuándo mostrar alerta antes del vencimiento
                        </small>
                        <button 
                          className="btn-guardar"
                          onClick={() => handleGuardar('mostrar_alerta_horas_antes')}
                          disabled={guardando}
                        >
                          {guardando ? '⏳' : '💾'} Guardar
                        </button>
                      </div>

                      {/* Horario mañana */}
                      <div className="config-item">
                        <label htmlFor="apertura_manana">
                          Apertura Mañana
                        </label>
                        <input
                          type="time"
                          id="apertura_manana"
                          value={configuraciones.hora_apertura_manana || ''}
                          onChange={(e) => handleChange('hora_apertura_manana', e.target.value)}
                        />
                        <small>Hora de apertura por la mañana</small>
                        <button 
                          className="btn-guardar"
                          onClick={() => handleGuardar('hora_apertura_manana')}
                          disabled={guardando}
                        >
                          {guardando ? '⏳' : '💾'} Guardar
                        </button>
                      </div>

                      <div className="config-item">
                        <label htmlFor="cierre_manana">
                          Cierre Mañana
                        </label>
                        <input
                          type="time"
                          id="cierre_manana"
                          value={configuraciones.hora_cierre_manana || ''}
                          onChange={(e) => handleChange('hora_cierre_manana', e.target.value)}
                        />
                        <small>Hora de cierre por la mañana</small>
                        <button 
                          className="btn-guardar"
                          onClick={() => handleGuardar('hora_cierre_manana')}
                          disabled={guardando}
                        >
                          {guardando ? '⏳' : '💾'} Guardar
                        </button>
                      </div>

                      <div className="config-item">
                        <label htmlFor="apertura_tarde">
                          Apertura Tarde
                        </label>
                        <input
                          type="time"
                          id="apertura_tarde"
                          value={configuraciones.hora_apertura_tarde || ''}
                          onChange={(e) => handleChange('hora_apertura_tarde', e.target.value)}
                        />
                        <small>Hora de apertura por la tarde</small>
                        <button 
                          className="btn-guardar"
                          onClick={() => handleGuardar('hora_apertura_tarde')}
                          disabled={guardando}
                        >
                          {guardando ? '⏳' : '💾'} Guardar
                        </button>
                      </div>

                      <div className="config-item">
                        <label htmlFor="cierre_tarde">
                          Cierre Tarde
                        </label>
                        <input
                          type="time"
                          id="cierre_tarde"
                          value={configuraciones.hora_cierre_tarde || ''}
                          onChange={(e) => handleChange('hora_cierre_tarde', e.target.value)}
                        />
                        <small>Hora de cierre por la tarde</small>
                        <button 
                          className="btn-guardar"
                          onClick={() => handleGuardar('hora_cierre_tarde')}
                          disabled={guardando}
                        >
                          {guardando ? '⏳' : '💾'} Guardar
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