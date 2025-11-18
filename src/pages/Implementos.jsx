// pages/Implementos.jsx
import React, { useState } from 'react';
import { useImplementos } from '../hooks/useImplementos';
import ImplementoForm from '../components/ImplementoForm/ImplementoForm';
import './Implementos.css';

const Implementos = () => {
  const { 
    implementos, 
    stats, 
    loading, 
    error,
    crearImplemento,
    actualizarImplemento,
    eliminarImplemento 
  } = useImplementos();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [implementoEditando, setImplementoEditando] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const handleCrearImplemento = () => {
    setImplementoEditando(null);
    setMostrarFormulario(true); //agregamos esto a ver
  };

  const handleEditarImplemento = (implemento) => {
    setImplementoEditando(implemento);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setImplementoEditando(null);
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el implemento "${nombre}"?`)) {
      setProcesando(true);
      const resultado = await eliminarImplemento(id);
      setProcesando(false);
      
      if (resultado.success) {
        alert('✅ Implemento eliminado exitosamente');
      } else {
        alert(`❌ Error: ${resultado.error}`);
      }
    }
  };

  const handleSubmitForm = async (formData) => {
    setProcesando(true);
    let resultado;
    
    if (implementoEditando) {
      resultado = await actualizarImplemento(implementoEditando.id, formData);
    } else {
      resultado = await crearImplemento(formData);
    }
    
    setProcesando(false);
    
    if (resultado.success) {
      alert(implementoEditando ? 
        '✅ Implemento actualizado exitosamente' : 
        '✅ Implemento creado exitosamente'
      );
      handleCerrarFormulario();
    } else {
      alert(`❌ Error: ${resultado.error}`);
    }
  };

  if (loading && implementos.length === 0) {
    return (
      <div className="implementos-page">
        <div className="loading">⏳ Cargando implementos...</div>
      </div>
    );
  }

  return (
    <div className="implementos-page">
      <div className="page-header">
        <h1 className="page-title">🎮 Gestión de Implementos</h1>
        <p className="page-subtitle">Administra los implementos disponibles para préstamos</p>
      </div>
      
      <div className="implementos-content">
        {/* Estadísticas */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Total Implementos</h3>
              <span className="stat-number">{stats.total}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Disponibles</h3>
              <span className="stat-number">{stats.disponibles}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>En Préstamo</h3>
              <span className="stat-number">{stats.prestados}</span>
            </div>
          </div>
        </div>

        {/* Barra de Acciones */}
        <div className="actions-bar">
          <button 
            className="btn-primary"
            onClick={handleCrearImplemento}
            disabled={procesando}
          >
            ➕ Agregar Implemento
          </button>
        </div>

        {/* Lista de Implementos */}
        <div className="implementos-list">
          {error && (
            <div className="error-message">
              ❌ Error: {error}
            </div>
          )}

          {implementos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎮</div>
              <h3>No hay implementos registrados</h3>
              <p>Comienza agregando el primer implemento al sistema</p>
              <button 
                className="btn-primary"
                onClick={handleCrearImplemento}
              >
                Agregar Primer Implemento
              </button>
            </div>
          ) : (
            <div className="implementos-grid">
              {implementos.map(implemento => (
                <div key={implemento.id} className="implemento-card">
                  <div className="implemento-header">
                    <h3 className="implemento-nombre">{implemento.nombre}</h3>
                    <div className="implemento-status">
                      {!implemento.activo && (
                        <span className="inactive-badge">Inactivo</span>
                      )}
                      {implemento.cantidad_disponible === 0 && (
                        <span className="sin-stock-badge">Sin stock</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="implemento-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total:</span>
                      <span className="stat-value">{implemento.cantidad_total}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Disponibles:</span>
                      <span className={`stat-value ${implemento.cantidad_disponible === 0 ? 'sin-stock' : 'con-stock'}`}>
                        {implemento.cantidad_disponible}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">En préstamo:</span>
                      <span className="stat-value">
                        {implemento.cantidad_total - implemento.cantidad_disponible}
                      </span>
                    </div>
                  </div>

                  <div className="implemento-actions">
                    <button 
                      className="btn-editar"
                      onClick={() => handleEditarImplemento(implemento)}
                      disabled={procesando}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminar(implemento.id, implemento.nombre)}
                      disabled={procesando}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal del Formulario */}
        {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-content">
              <ImplementoForm
                key={implementoEditando ? `edit-${implementoEditando.id}` : 'create'}
                implementoExistente={implementoEditando}
                onSubmit={handleSubmitForm}
                onCancel={handleCerrarFormulario}
                isSubmitting={procesando}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Implementos;