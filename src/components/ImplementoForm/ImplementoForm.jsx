// components/ImplementoForm/ImplementoForm.jsx
import React, { useState, useEffect } from 'react';
import './ImplementoForm.css';

const ImplementoForm = ({ implementoExistente, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad_total: '',
    imagen_url: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar datos cuando cambie implementoExistente
  useEffect(() => {
    if (implementoExistente) {
      setFormData({
        nombre: implementoExistente.nombre || '',
        cantidad_total: implementoExistente.cantidad_total?.toString() || '',
        imagen_url: implementoExistente.imagen_url || ''
      });
    } else {
      setFormData({
        nombre: '',
        cantidad_total: '',
        imagen_url: ''
      });
    }
  }, [implementoExistente]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo
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
        cantidad_total: parseInt(formData.cantidad_total),
        imagen_url: formData.imagen_url.trim() || null
      };

      onSubmit(dataToSubmit);
    }
  };

  
  return (
    <div className="implemento-form-container">
      <h2 className="form-title">
        {implementoExistente ? '✏️ Editar Implemento' : '➕ Nuevo Implemento'}
      </h2>
      
      <form onSubmit={handleSubmit} className="implemento-form">
        {/* Campo Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Implemento *</label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            className={errors.nombre ? 'error' : ''}
            placeholder="Ej: Ajedrez, Monopoly, UNO..."
            disabled={isSubmitting}
          />
          {errors.nombre && <span className="error-text">{errors.nombre}</span>}
        </div>

        {/* Campo Cantidad */}
        <div className="form-group">
          <label htmlFor="cantidad_total">Cantidad Total *</label>
          <input
            type="number"
            id="cantidad_total"
            value={formData.cantidad_total}
            onChange={(e) => handleChange('cantidad_total', e.target.value)}
            className={errors.cantidad_total ? 'error' : ''}
            placeholder="0"
            min="0"
            max="1000"
            disabled={isSubmitting}
          />
          {errors.cantidad_total && (
            <span className="error-text">{errors.cantidad_total}</span>
          )}
        </div>

        {/* Campo Imagen */}
        <div className="form-group">
          <label htmlFor="imagen_url">URL de la Imagen (opcional)</label>
          <input
            type="text"
            id="imagen_url"
            value={formData.imagen_url}
            onChange={(e) => handleChange('imagen_url', e.target.value)}
            placeholder="/images/ejemplo.svg"
            disabled={isSubmitting}
          />
          
          {/* Selector rápido de imágenes */}
          
        </div>


        {/* Acciones */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Guardando...' : (implementoExistente ? '💾 Actualizar' : '✅ Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImplementoForm;