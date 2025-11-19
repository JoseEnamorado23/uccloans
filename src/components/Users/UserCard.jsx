// src/components/Users/UserCard.jsx
import React, { useState } from "react";
import { 
  Eye, 
  Edit, 
  FileText, 
  Lock, 
  Unlock, 
  Clock,
  MoreVertical 
} from "lucide-react";
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
  const [showMenu, setShowMenu] = useState(false);
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

  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch (action) {
      case 'view':
        onView(usuario);
        break;
      case 'edit':
        onEdit(usuario);
        break;
      case 'history':
        onHistory(usuario);
        break;
      case 'block':
        onBlock(usuario);
        break;
      case 'unblock':
        onUnblock(usuario.id);
        break;
      case 'hours':
        setShowHoursModal(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`user-card ${!usuario.activo ? "inactive" : ""}`}>
      {/* MENU DE TRES PUNTOS - POSICIÓN CORREGIDA */}
      <div className="user-menu">
        <button 
          className="menu-trigger"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreVertical size={18} />
        </button>
        
        {showMenu && (
          <div className="menu-dropdown">
            <button 
              className="menu-item"
              onClick={() => handleMenuAction('view')}
            >
              <Eye size={16} />
              Ver información
            </button>
            
            <button 
              className="menu-item"
              onClick={() => handleMenuAction('edit')}
            >
              <Edit size={16} />
              Editar información
            </button>
            
            <button 
              className="menu-item"
              onClick={() => handleMenuAction('history')}
            >
              <FileText size={16} />
              Historial de préstamos
            </button>
            
            <button 
              className="menu-item"
              onClick={() => handleMenuAction('hours')}
            >
              <Clock size={16} />
              Editar horas
            </button>
            
            {usuario.activo ? (
              <button 
                className="menu-item delete"
                onClick={() => handleMenuAction('block')}
              >
                <Lock size={16} />
                Bloquear usuario
              </button>
            ) : (
              <button 
                className="menu-item"
                onClick={() => handleMenuAction('unblock')}
              >
                <Unlock size={16} />
                Desbloquear usuario
              </button>
            )}
          </div>
        )}
      </div>

      {/* HEADER */}
      <div className="user-header">
        <div className="user-avatar">
          {usuario.nombre_completo?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="user-info">
          <h3>{usuario.nombre_completo}</h3>
          <div className="user-status">
            {usuario.activo ? (
              <span className="status-badge active">Activo</span>
            ) : (
              <span className="status-badge inactive">Inactivo</span>
            )}
          </div>
        </div>
      </div>

      {/* DETALLES */}
      <div className="user-details">
        <div className="detail-item">
          <span className="detail-label">Cédula:</span>
          <span className="detail-value">{usuario.numero_cedula}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email:</span>
          <span className="detail-value">
            {usuario.email || "No registrado"}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Teléfono:</span>
          <span className="detail-value">{usuario.numero_telefono}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Programa:</span>
          <span className="detail-value">
            {usuario.programa_nombre || `Programa ${usuario.programa_id}` || "N/A"}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Horas acumuladas:</span>
          <span className="detail-value hours-value">
            {parseFloat(usuario.horas_totales_acumuladas || 0).toFixed(2)}h
          </span>
        </div>
        {usuario.motivo_bloqueo && (
          <div className="motivo-bloqueo">
            {usuario.motivo_bloqueo}
          </div>
        )}
      </div>

      {/* MODAL PARA EDITAR HORAS */}
      {showHoursModal && (
        <div className="modal-overlay" onClick={() => setShowHoursModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Horas</h3>
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