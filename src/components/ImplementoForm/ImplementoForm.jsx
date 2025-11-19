// components/ImplementoForm/ImplementoForm.jsx
import React, { useState, useEffect } from 'react';
import { Save, X, Loader, Package, Hash } from 'lucide-react';
import './ImplementoForm.css';

const ImplementoForm = ({ implementoExistente, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad_total: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (implementoExistente) {
      setFormData({
        nombre: implementoExistente.nombre || '',
        cantidad_total: implementoExistente.cantidad_total?.toString() || ''
      });
    } else {
      setFormData({
        nombre: '',
        cantidad_total: ''
      });
    }
  }, [implementoExistente]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.cantidad_total) {
      newErrors.cantidad_total = 'La cantidad total es obligatoria';
    } else if (parseInt(formData.cantidad_total) < 0) {
      newErrors.cantidad_total = 'La cantidad no puede ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSubmit = {
        nombre: formData.nombre.trim(),
        cantidad_total: parseInt(formData.cantidad_total)
      };

      onSubmit(dataToSubmit);
    }
  };

  return (
    <div className="implemento-form-container">
      <div className="form-header">
        <div className="form-title-section">
          <Package size={24} />
          <h2 className="form-title">
            {implementoExistente ? 'Editar Implemento' : 'Nuevo Implemento'}
          </h2>
        </div>
        <button 
          className="form-close-btn"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="implemento-form">
        {/* Campo Nombre */}
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">
            <Package size={16} />
            Nombre del Implemento
          </label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            className={`form-input ${errors.nombre ? 'error' : ''}`}
            placeholder="Ej: Ajedrez, Monopoly, UNO..."
            disabled={isSubmitting}
          />
          {errors.nombre && <span className="error-text">{errors.nombre}</span>}
        </div>

        {/* Campo Cantidad */}
        <div className="form-group">
          <label htmlFor="cantidad_total" className="form-label">
            <Hash size={16} />
            Cantidad Total
          </label>
          <input
            type="number"
            id="cantidad_total"
            value={formData.cantidad_total}
            onChange={(e) => handleChange('cantidad_total', e.target.value)}
            className={`form-input ${errors.cantidad_total ? 'error' : ''}`}
            placeholder="0"
            min="0"
            max="1000"
            disabled={isSubmitting}
          />
          {errors.cantidad_total && (
            <span className="error-text">{errors.cantidad_total}</span>
          )}
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            <X size={16} />
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="spinner" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                {implementoExistente ? 'Actualizar' : 'Crear'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImplementoForm;