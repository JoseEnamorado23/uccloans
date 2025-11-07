// src/components/Users/UserCard.jsx
import React, { useState } from "react";
import "./UserCard.css";

const UserCard = ({
  usuario,
  onView,
  onEdit,
  onHistory,
  onBlock,
  onUnblock,
  onUpdateHours,
}) => {
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [newHours, setNewHours] = useState("");

  const handleUpdateHours = () => {
    if (newHours && !isNaN(newHours) && parseFloat(newHours) >= 0) {
      onUpdateHours(usuario.id, parseFloat(newHours));
      setShowHoursModal(false);
      setNewHours("");
    } else {
      alert("Por favor ingresa un número válido de horas");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdateHours();
    }
  };

  return (
    <div className={`user-card ${!usuario.activo ? "inactive" : ""}`}>
      {/* HEADER */}
      <div className="user-header">
        <div className="user-avatar">
          {usuario.nombre_completo?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="user-info">
          <h3>{usuario.nombre_completo}</h3>
          <p className="user-cedula">🆔 {usuario.numero_cedula}</p>
        </div>
        <div className="user-status">
          {usuario.activo ? (
            <span className="status-badge active">✅ Activo</span>
          ) : (
            <span className="status-badge inactive">⏸️ Inactivo</span>
          )}
        </div>
      </div>

      {/* DETALLES */}
      <div className="user-details">
        <div className="detail-item">
          <span className="detail-label">📧 Email:</span>
          <span className="detail-value">
            {usuario.email || "No registrado"}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">📞 Teléfono:</span>
          <span className="detail-value">{usuario.numero_telefono}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">📚 Programa:</span>
          <span className="detail-value">
            {usuario.programa_nombre || `Programa ${usuario.programa_id}` || "N/A"}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">⏱️ Horas:</span>
          <span className="detail-value hours-value">
            {parseFloat(usuario.horas_totales_acumuladas || 0).toFixed(2)}h
            <button
              className="btn-hours-edit"
              onClick={() => setShowHoursModal(true)}
              title="Editar horas"
            >
              ✏️
            </button>
          </span>
        </div>
        {usuario.motivo_bloqueo && (
          <div className="detail-item">
            <span className="detail-label">🚫 Motivo bloqueo:</span>
            <span className="detail-value motivo-bloqueo">
              {usuario.motivo_bloqueo}
            </span>
          </div>
        )}
      </div>

      {/* ACCIONES */}
      <div className="user-actions">
        <button
          className="btn btn-info btn-sm"
          onClick={() => onView(usuario)}
          title="Ver información completa"
        >
          👁️ Ver
        </button>
        <button
          className="btn btn-warning btn-sm"
          onClick={() => onEdit(usuario)}
          title="Editar información"
        >
          ✏️ Editar
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onHistory(usuario)}
          title="Ver historial de préstamos"
        >
          📋 Historial
        </button>
        {usuario.activo ? (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onBlock(usuario)}
            title="Bloquear usuario"
          >
            🔒 Bloquear
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm"
            onClick={() => onUnblock(usuario.id)}
            title="Desbloquear usuario"
          >
            🔓 Desbloquear
          </button>
        )}
      </div>

      {/* MODAL PARA EDITAR HORAS */}
      {showHoursModal && (
        <div className="modal-overlay" onClick={() => setShowHoursModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Editar Horas</h3>
              <button
                className="btn-close"
                onClick={() => setShowHoursModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Actualizar horas para:{" "}
                <strong>{usuario.nombre_completo}</strong>
              </p>
              <div className="form-group">
                <label>Nuevas horas totales:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ej: 25.5"
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowHoursModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateHours}
                  disabled={!newHours || isNaN(newHours) || parseFloat(newHours) < 0}
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;