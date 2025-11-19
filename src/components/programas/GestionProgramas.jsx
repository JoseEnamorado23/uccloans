import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  BookOpen,
  X,
  Download,
  RefreshCw
} from 'lucide-react';
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

  // Exportar programas
  const handleExport = () => {
    const dataStr = JSON.stringify(programas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `programas-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="prestamos-page">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-actions">
          <div>
            <h1>Programas Académicos</h1>
            <p>Gestiona los programas académicos del sistema</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              className="btn-export"
              onClick={handleExport}
              disabled={loading || programas.length === 0}
            >
              <Download size={16} />
              Exportar
            </button>
            <button 
              className="btn btn-primary"
              onClick={openCreateModal}
              disabled={loading}
            >
              <Plus size={16} />
              Agregar Programa
            </button>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN DE RESULTADOS */}
      {!loading && !error && programas.length > 0 && (
        <div className="results-info">
          <span>Mostrando {programas.length} programa{programas.length !== 1 ? 's' : ''}</span>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={refreshProgramas}
            disabled={loading}
          >
            <RefreshCw size={14} />
            Actualizar
          </button>
        </div>
      )}

      {/* LISTA DE PROGRAMAS */}
      <div className="loans-table-container">
        {loading ? (
          <div className="loading-full">
            <div className="loading-spinner"></div>
            <p>Cargando programas...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <div>
              <h3>Error al cargar programas</h3>
              <p>{error}</p>
            </div>
            <button className="retry-btn" onClick={refreshProgramas}>
              Reintentar
            </button>
          </div>
        ) : programas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen size={48} />
            </div>
            <h3>No hay programas registrados</h3>
            <p>Comienza agregando el primer programa académico</p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={16} />
              Agregar Primer Programa
            </button>
          </div>
        ) : (
          <table className="loans-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Programa</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {programas.map((programa) => (
                <tr key={programa.id}>
                  <td className="programa-id">#{programa.id}</td>
                  <td className="programa-nombre">
                    <strong>{programa.nombre}</strong>
                  </td>
                  <td>
                    <div className="status-actions">
                      <button
                        className="action-btn approve-btn"
                        onClick={() => openEditModal(programa)}
                        disabled={actionLoading}
                        title="Editar programa"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleDelete(programa)}
                        disabled={actionLoading}
                        title="Eliminar programa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL MINIMALISTA PARA CREAR/EDITAR */}
      {showModal && (
        <div className="mm-overlay" onClick={closeModal}>
          <div className="mm-card" onClick={(e) => e.stopPropagation()}>
            <header className="mm-head">
              <div>
                <h3 className="mm-title">
                  {modalType === 'create' ? 'Agregar Programa' : 'Editar Programa'}
                </h3>
                <p className="mm-sub">
                  {modalType === 'create' ? 'Crear nuevo programa académico' : `ID #${selectedPrograma?.id}`}
                </p>
              </div>
              <button 
                aria-label="Cerrar" 
                className="mm-close" 
                onClick={closeModal}
              >
                <X size={18} />
              </button>
            </header>

            <main className="mm-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    autoFocus
                  />
                  <label>Nombre del Programa *</label>
                </div>
              </form>
            </main>

            <footer className="mm-foot">
              <button 
                className="mm-btn mm-btn--ghost" 
                onClick={closeModal}
                disabled={actionLoading}
              >
                <X size={16} />
                Cancelar
              </button>
              <button
                className="mm-btn mm-btn--primary"
                onClick={handleSubmit}
                disabled={actionLoading || !formData.nombre.trim()}
              >
                {actionLoading ? (
                  <span className="mm-spinner" />
                ) : (
                  <>
                    <BookOpen size={16} />
                    {modalType === 'create' ? 'Crear Programa' : 'Actualizar'}
                  </>
                )}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProgramas;