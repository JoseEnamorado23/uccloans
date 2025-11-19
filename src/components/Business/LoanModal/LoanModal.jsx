import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  IdCard, 
  Phone, 
  BookOpen, 
  Package, 
  Clock, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import API from "../../../services/api";
import "./LoanModal.css";

const LoanModal = ({ loan, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(loan.segundos_restantes);

  useEffect(() => {
    if (!loan.segundos_restantes) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev > 0) return prev - 1;
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loan.segundos_restantes]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFinishLoan = async () => {
    setLoading(true);
    try {
      const response = await API.put(`/api/prestamos/${loan.id}/finalizar`, {
        mostrar_resumen: true,
      });

      if (response.data.success) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error finalizando préstamo:", error);
      alert("Error al finalizar el préstamo");
    } finally {
      setLoading(false);
    }
  };

  const getTimeStatus = () => {
    if (!timeRemaining) return "neutral";
    if (timeRemaining <= 1800) return "critical";
    if (timeRemaining <= 3600) return "warning";
    return "ok";
  };

  const getStatusBadge = () => {
    switch (loan.estado) {
      case "activo":
        return <span className="status-badge status-activo">Activo</span>;
      case "devuelto":
        return <span className="status-badge status-devuelto">Devuelto</span>;
      case "pendiente":
        return <span className="status-badge status-pendiente">Pendiente</span>;
      default:
        return <span className="status-badge status-activo">Activo</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="loan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Préstamo</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {/* Tiempo Restante - Destacado */}
          {timeRemaining && (
            <div className={`time-section time-${getTimeStatus()}`}>
              <div className="time-content">
                <Clock size={32} />
                <div className="time-text">
                  <span className="time-label">Tiempo Restante</span>
                  <span className="time-value">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Información en Grid */}
          <div className="info-grid">
            {/* Información del Usuario */}
            <div className="info-group">
              <div className="info-title">
                <User size={20} />
                <span>Usuario</span>
              </div>
              <div className="info-items">
                <div className="info-row">
                  <div className="info-icon">
                    <User size={16} />
                  </div>
                  <div className="info-details">
                    <span className="info-label">Nombre</span>
                    <span className="info-value">{loan.nombre_completo}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">
                    <IdCard size={16} />
                  </div>
                  <div className="info-details">
                    <span className="info-label">Cédula</span>
                    <span className="info-value">{loan.numero_cedula}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">
                    <Phone size={16} />
                  </div>
                  <div className="info-details">
                    <span className="info-label">Teléfono</span>
                    <span className="info-value">{loan.numero_telefono}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">
                    <BookOpen size={16} />
                  </div>
                  <div className="info-details">
                    <span className="info-label">Programa</span>
                    <span className="info-value">{loan.programa}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Préstamo */}
            <div className="info-group">
              <div className="info-title">
                <Package size={20} />
                <span>Préstamo</span>
              </div>
              <div className="info-items">
                <div className="info-row">
                  <div className="info-icon">
                    <Package size={16} />
                  </div>
                  <div className="info-details">
                    <span className="info-label">Implemento</span>
                    <span className="info-value">{loan.implemento}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">
                    <Calendar size={16} />
                  </div>
                  <div className="info-details">
                    <span className="info-label">Hora inicio</span>
                    <span className="info-value">{loan.hora_inicio}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">
                    <Clock size={16} />
                  </div>
                  <div className="info-details">
                    <span className="info-label">Hora fin</span>
                    <span className="info-value">{loan.hora_fin_estimada}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">
                    <div className="status-dot"></div>
                  </div>
                  <div className="info-details">
                    <span className="info-label">Estado</span>
                    {getStatusBadge()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            onClick={handleFinishLoan}
            disabled={loading}
            className="finish-btn"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <CheckCircle size={20} />
            )}
            <span>{loading ? "Procesando..." : "Finalizar Préstamo"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanModal;