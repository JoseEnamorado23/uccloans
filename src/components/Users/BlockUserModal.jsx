// src/components/Users/BlockUserModal.jsx
import React, { useState } from 'react';
import './BlockUserModal.css';

const BlockUserModal = ({ user, onClose, onBlock }) => {
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    if (!motivo.trim()) {
      alert('Por favor ingresa un motivo para el bloqueo');
      return;
    }

    if (motivo.trim().length < 5) {
      alert('El motivo debe tener al menos 5 caracteres');
      return;
    }

    if (!window.confirm(`¿Estás seguro de bloquear a ${user.nombre_completo}?`)) {
      return;
    }

    setLoading(true);
    try {
      await onBlock(user.id, motivo.trim());
    } catch (error) {
      console.error('Error bloqueando usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content block-modal">
        <div className="modal-header">
          <h2>🔒 Bloquear Usuario</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="warning-section">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h3>Estás a punto de bloquear a un usuario</h3>
              <p>El usuario no podrá realizar nuevos préstamos hasta que sea desbloqueado.</p>
            </div>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {user.nombre_completo?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <h4>{user.nombre_completo}</h4>
              <p>🆔 {user.numero_cedula} • 📚 {user.programa}</p>
              <p>📧 {user.email || 'No tiene email registrado'}</p>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Motivo del bloqueo *</label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe el motivo del bloqueo (mínimo 5 caracteres)..."
                rows="4"
              />
              <div className="char-count">
                {motivo.length}/5 caracteres mínimos
              </div>
            </div>

            <div className="form-tips">
              <h4>💡 Ejemplos de motivos válidos:</h4>
              <ul>
                <li>Comportamiento inapropiado en el uso de implementos</li>
                <li>Incumplimiento reiterado de los horarios de devolución</li>
                <li>Daño o pérdida de implementos prestados</li>
                <li>Uso indebido de las instalaciones</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleBlock}
            disabled={loading || motivo.trim().length < 5}
          >
            {loading ? 'Bloqueando...' : '🔒 Confirmar Bloqueo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUserModal;