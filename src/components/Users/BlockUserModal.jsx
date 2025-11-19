import React, { useState } from 'react';
import { 
  X, 
  User, 
  IdCard, 
  BookOpen, 
  Mail, 
  AlertTriangle,
  Lock,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
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

  const getProgramaNombre = () => {
    return user.programa_nombre || user.programa || 'Sin programa';
  };

  return (
    <div className="block-modal-overlay" onClick={onClose}>
      <div className="block-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="block-modal-head">
          <div>
            <h3 className="block-modal-title">
              <Lock size={18} />
              Bloquear Usuario
            </h3>
            <p className="block-modal-sub">
              ID #{user.id} · {getProgramaNombre()}
            </p>
          </div>
          <button 
            aria-label="Cerrar" 
            className="block-modal-close" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <main className="block-modal-body">
          <div className="warning-section">
            <div className="warning-icon">
              <AlertTriangle size={20} />
            </div>
            <div className="warning-content">
              <h3>Estás a punto de bloquear a un usuario</h3>
              <p>El usuario no podrá realizar nuevos préstamos hasta que sea desbloqueado.</p>
            </div>
          </div>

          <div className="block-user-info">
            <div className="block-user-avatar">
              {user.nombre_completo?.charAt(0) || 'U'}
            </div>
            <div className="block-user-details">
              <h4>{user.nombre_completo}</h4>
              <p>
                <IdCard size={14} />
                {user.numero_cedula}
                <BookOpen size={14} />
                {getProgramaNombre()}
              </p>
              <p>
                <Mail size={14} />
                {user.email || 'No tiene email registrado'}
              </p>
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
              <div className={`char-count ${motivo.length < 5 ? 'warning' : ''}`}>
                {motivo.length}/5 caracteres mínimos
              </div>
            </div>

          </div>
        </main>

        <footer className="block-modal-foot">
          <button 
            className="block-modal-btn block-modal-btn--ghost" 
            onClick={onClose}
            disabled={loading}
          >
            <X size={16} />
            Cancelar
          </button>
          <button 
            className="block-modal-btn block-modal-btn--danger" 
            onClick={handleBlock}
            disabled={loading || motivo.trim().length < 5}
          >
            {loading ? (
              <span className="block-modal-spinner" />
            ) : (
              <>
                <Lock size={16} />
                Confirmar Bloqueo
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default BlockUserModal;