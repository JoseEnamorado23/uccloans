// components/Business/LoanForm/LoanForm.jsx - MODIFICADO
import React, { useRef, useEffect } from "react";
import { useLoanForm } from "../../../hooks/useLoanForm";
import "./LoanForm.css";

const LoanForm = ({ onSubmit, onCancel }) => {
  const {
    formData,
    errors,
    searchResults,
    isSearching,
    selectedUser,
    implementosDisponibles,
    cargandoImplementos,
    isNewUser,
    isSubmitting,
    programas,
    programasLoading,
    handleChange,
    validateForm,
    resetForm,
    getFormDataForSubmit,
    selectUser,
    setSelectedUser,
    submitForm,
  } = useLoanForm();

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // No cerramos los resultados aquí para permitir selección
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await submitForm();

    if (result.success) {
      let message = "✅ Préstamo registrado exitosamente";
      if (result.userCreated) {
        message +=
          ". Se ha enviado un email al usuario para que active su cuenta.";
      }
      alert(message);

      resetForm();
      if (onSubmit) onSubmit(result.data);
    } else {
      alert("❌ Error: " + result.error);
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) onCancel();
  };

  // Obtener el implemento seleccionado para mostrar información
  const implementoSeleccionado = implementosDisponibles.find(
    (imp) => imp.id === parseInt(formData.implemento_id)
  );

  return (
    <div className="loan-form-container">
      <h2 className="form-title">Nuevo Préstamo</h2>
      <p className="form-subtitle">Registra un nuevo préstamo de implemento</p>

      <form onSubmit={handleSubmit} className="loan-form">
        {/* Línea 1: Nombre Completo con Búsqueda */}
        <div className="form-group full-width search-container" ref={searchRef}>
          <input
            type="text"
            value={formData.nombre_completo}
            onChange={(e) => handleChange("nombre_completo", e.target.value)}
            className={errors.nombre_completo ? "error" : ""}
            placeholder=" "
            disabled={selectedUser}
          />
          <label>
            Nombre Completo *{" "}
            {selectedUser && (
              <span className="user-selected">(Usuario seleccionado)</span>
            )}
          </label>
          {errors.nombre_completo && (
            <span className="error-text">{errors.nombre_completo}</span>
          )}

          {/* Dropdown de resultados de búsqueda */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((user, index) => (
                <div
                  key={user.id || index}
                  className="search-result-item"
                  onClick={() => selectUser(user)}
                >
                  {user._exactMatch ? (
                    <div className="exact-match">
                      <strong>✓ Esta cédula pertenece a:</strong>
                      <div>{user.nombre_completo}</div>
                      <small>
                        {user.programa} • {user.numero_telefono}
                      </small>
                    </div>
                  ) : (
                    <>
                      <div className="user-name">{user.nombre_completo}</div>
                      <div className="user-details">
                        {user.numero_cedula} • {user.programa} •{" "}
                        {user.numero_telefono}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="search-loading">Buscando usuarios...</div>
          )}
        </div>

        {/* Línea 2: Cédula y Teléfono */}
        <div className="form-row">
          <div className="form-group half-width">
            <input
              type="number"
              value={formData.cedula}
              onChange={(e) => handleChange("cedula", e.target.value)}
              className={errors.cedula ? "error" : ""}
              placeholder=" "
              disabled={selectedUser}
            />
            <label>N. Cédula *</label>
            {errors.cedula && (
              <span className="error-text">{errors.cedula}</span>
            )}
          </div>

          <div className="form-group half-width">
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              className={errors.telefono ? "error" : ""}
              placeholder=" "
              disabled={selectedUser}
            />
            <label>Teléfono *</label>
            {errors.telefono && (
              <span className="error-text">{errors.telefono}</span>
            )}
          </div>
        </div>

        {/* ✅ Campo Email (solo para usuarios nuevos) */}
        {isNewUser && !selectedUser && (
          <div className="form-group">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "error" : ""}
              placeholder=" "
            />
            <label>Email *</label>
            {errors.email && <span className="error-text">{errors.email}</span>}
            <small>
              Se enviará un enlace para que el usuario active su cuenta y cree
              su contraseña
            </small>
          </div>
        )}

        {/* ✅ PROGRAMA - Mostrar como texto cuando hay usuario seleccionado */}
        <div className="form-group">
          {selectedUser ? (
            // Mostrar como campo de texto deshabilitado cuando hay usuario seleccionado
            <div className="programa-display">
              <input
                type="text"
                value={programas.find(p => p.id === parseInt(formData.programa_id))?.nombre || ""} 
                disabled
                className="programa-display-input"
              />
              <label>Programa Académico</label>
              <div className="programa-info-text">
                ✅ Programa del usuario seleccionado
              </div>
            </div>
          ) : (
            // Mostrar como select normal cuando no hay usuario seleccionado
            <>
              <select
                value={formData.programa}
                onChange={(e) => handleChange("programa_id", e.target.value)}
                className={errors.programa ? "error" : ""}
                required
                disabled={programasLoading}
              >
                <option value="">Selecciona el programa</option>
                {programas.map((programa) => (
                  <option key={programa.id} value={programa.id}>
                    {programa.nombre}
                  </option>
                ))}
              </select>
              <label>Programa Académico *</label>
              {errors.programa && (
                <span className="error-text">{errors.programa_id}</span>
              )}
            </>
          )}
        </div>

        {/* Implemento */}
        <div className="form-group">
          <select
            value={formData.implemento_id}
            onChange={(e) => handleChange("implemento_id", e.target.value)}
            className={errors.implemento_id ? "error" : ""}
          >
            <option value="">Selecciona un implemento</option>
            {cargandoImplementos ? (
              <option value="" disabled>
                Cargando implementos...
              </option>
            ) : (
              implementosDisponibles.map((implemento) => (
                <option key={implemento.id} value={implemento.id}>
                  {implemento.nombre} ({implemento.cantidad_disponible}{" "}
                  disponibles)
                </option>
              ))
            )}
          </select>
          <label>Implemento a Prestar *</label>
          {errors.implemento_id && (
            <span className="error-text">{errors.implemento_id}</span>
          )}

          {/* Información del implemento seleccionado */}
          {implementoSeleccionado && (
            <div className="implemento-info">
              <small>
                ✅ <strong>{implementoSeleccionado.nombre}</strong> -{" "}
                {implementoSeleccionado.cantidad_disponible} unidades
                disponibles de {implementoSeleccionado.cantidad_total}
              </small>
            </div>
          )}
        </div>

        {/* Hora de Inicio */}
        <div className="form-group">
          <input
            type="time"
            value={formData.hora_inicio}
            onChange={(e) => handleChange("hora_inicio", e.target.value)}
            className={errors.hora_inicio ? "error" : ""}
          />
          <label>Hora de Inicio del Préstamo *</label>
          {errors.hora_inicio && (
            <span className="error-text">{errors.hora_inicio}</span>
          )}
        </div>

        
        {/* Botón para limpiar selección */}
        {selectedUser && (
          <div className="selected-user-info">
            <button
              type="button"
              className="btn-clear-selection"
              onClick={() => {
                resetForm();
                setSelectedUser(null);
              }}
              disabled={isSubmitting}
            >
              ✕ Limpiar selección y registrar nuevo usuario
            </button>
          </div>
        )}

        {/* ✅ Mensaje de estado durante el envío */}
        {isSubmitting && (
          <div className="form-status loading">
            ⏳ Procesando solicitud... Esto puede tomar unos segundos
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="button-loading">
                <span className="loading-spinner-small"></span>
                Procesando...
              </div>
            ) : selectedUser ? (
              "Registrar Préstamo"
            ) : (
              "Registrar Usuario y Préstamo"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;