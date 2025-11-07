// src/components/Programas/GestionProgramas.jsx
import React, { useState } from 'react';
import { useProgramas } from '../../hooks/useProgramas';
import './GestionProgramas.css';

const GestionProgramas = () => {
  const { programas, loading, error, createPrograma, updatePrograma, deletePrograma, refreshProgramas } = useProgramas();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create' o 'edit'
  const [selectedPrograma, setSelectedPrograma] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Abrir modal para crear
  const openCreateModal = () => {
    setFormData({ nombre: '' });
    setModalType('create');
    setShowModal(true);
  };

  // Abrir modal para editar
  const openEditModal = (programa) => {
    setSelectedPrograma(programa);
    setFormData({ nombre: programa.nombre });
    setModalType('edit');
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedPrograma(null);
    setFormData({ nombre: '' });
    setModalType('');
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Crear o actualizar programa
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('El nombre del programa es requerido');
      return;
    }

    setActionLoading(true);
    try {
      let result;
      
      if (modalType === 'create') {
        result = await createPrograma(formData.nombre);
      } else {
        result = await updatePrograma(selectedPrograma.id, formData.nombre);
      }

      if (result.success) {
        alert(result.message || 'Operación realizada exitosamente');
        closeModal();
      } else {
        alert(result.message || 'Error en la operación');
      }
    } catch (error) {
      console.error('Error en operación:', error);
      alert('Error en la operación');
    } finally {
      setActionLoading(false);
    }
  };

  // Eliminar programa
  const handleDelete = async (programa) => {
    if (!window.confirm(`¿Estás seguro de eliminar el programa "${programa.nombre}"?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await deletePrograma(programa.id);
      
      if (result.success) {
        alert('Programa eliminado exitosamente');
      } else {
        alert(result.message || 'Error al eliminar programa');
      }
    } catch (error) {
      console.error('Error eliminando programa:', error);
      alert('Error al eliminar programa');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="gestion-programas-container">
      {/* HEADER */}
      <div className="programas-header">
        <h1>📚 Gestión de Programas Académicos</h1>
        <p>Administra los programas académicos disponibles en el sistema</p>
        <button 
          className="btn btn-primary"
          onClick={openCreateModal}
          disabled={loading}
        >
          ➕ Agregar Programa
        </button>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Total Programas</h3>
            <p className="stat-number">{programas.length}</p>
          </div>
        </div>
      </div>

      {/* LISTA DE PROGRAMAS */}
      <div className="programas-list-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando programas...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Error al cargar programas</h3>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={refreshProgramas}>
              🔄 Reintentar
            </button>
          </div>
        ) : programas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No hay programas registrados</h3>
            <p>Comienza agregando el primer programa académico</p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              ➕ Agregar Primer Programa
            </button>
          </div>
        ) : (
          <div className="programas-table-container">
            <table className="programas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre del Programa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {programas.map((programa) => (
                  <tr key={programa.id}>
                    <td className="programa-id">#{programa.id}</td>
                    <td className="programa-nombre">{programa.nombre}</td>
                    <td className="programa-actions">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => openEditModal(programa)}
                        disabled={actionLoading}
                        title="Editar programa"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(programa)}
                        disabled={actionLoading}
                        title="Eliminar programa"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PARA CREAR/EDITAR */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'create' ? '➕ Agregar Programa' : '✏️ Editar Programa'}
              </h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre del Programa *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre del programa..."
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading || !formData.nombre.trim()}
                >
                  {actionLoading ? (
                    <>
                      <span className="spinner-small"></span>
                      {modalType === 'create' ? 'Creando...' : 'Actualizando...'}
                    </>
                  ) : (
                    <>💾 {modalType === 'create' ? 'Crear Programa' : 'Actualizar Programa'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProgramas;