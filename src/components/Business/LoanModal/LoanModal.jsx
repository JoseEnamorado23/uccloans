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
    if (!seconds || seconds <= 0) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFinishLoan = async () => {
    console.log("🎯 FINALIZANDO DESDE MODAL - Préstamo ID:", loan.id);
    console.log("📋 Implemento a devolver:", loan.implemento);

    setLoading(true);
    try {
      const response = await API.put(`/api/prestamos/${loan.id}/finalizar`, {
        mostrar_resumen: true,
      });

      console.log("📥 Respuesta del backend:", response.data);

      if (response.data.success) {
        console.log("✅ Préstamo finalizado exitosamente desde modal");
        onUpdate();
        alert("✅ Préstamo finalizado exitosamente");
        onClose();
      } else {
        console.log("❌ Backend respondió con error:", response.data.message);
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Error finalizando préstamo:", error);
      console.log("🔍 Detalles del error:", error.response?.data);
      alert("Error al finalizar el préstamo");
    } finally {
      setLoading(false);
    }
  };

  const getTimeStatus = () => {
    if (!timeRemaining) return "neutral";
    if (timeRemaining <= 1800) return "critical"; // 30 minutos
    if (timeRemaining <= 3600) return "warning"; // 1 hora
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
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Información del Usuario */}
          <div className="info-section">
            <div className="section-title">
              <User size={18} />
              <h3>Información del Usuario</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <User size={14} />
                  <span>Nombre</span>
                </div>
                <span className="info-value">{loan.nombre_completo}</span>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <IdCard size={14} />
                  <span>Cédula</span>
                </div>
                <span className="info-value">{loan.numero_cedula}</span>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Phone size={14} />
                  <span>Teléfono</span>
                </div>
                <span className="info-value">{loan.numero_telefono}</span>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <BookOpen size={14} />
                  <span>Programa</span>
                </div>
                <span className="info-value">{loan.programa}</span>
              </div>
            </div>
          </div>

          {/* Información del Préstamo */}
          <div className="info-section">
            <div className="section-title">
              <Package size={18} />
              <h3>Detalles del Préstamo</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <Package size={14} />
                  <span>Implemento</span>
                </div>
                <span className="info-value">{loan.implemento}</span>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Calendar size={14} />
                  <span>Hora inicio</span>
                </div>
                <span className="info-value">{loan.hora_inicio}</span>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Clock size={14} />
                  <span>Hora fin estimada</span>
                </div>
                <span className="info-value">{loan.hora_fin_estimada || "No calculada"}</span>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <span>Estado</span>
                </div>
                {getStatusBadge()}
              </div>
            </div>
          </div>

          {/* Tiempo Restante */}
          {timeRemaining && (
            <div className="time-section">
              <div className="section-title">
                <Clock size={18} />
                <h3>Tiempo Restante</h3>
              </div>
              <div className={`time-display time-${getTimeStatus()}`}>
                {getTimeStatus() === "critical" && <AlertCircle size={24} />}
                {getTimeStatus() === "warning" && <AlertTriangle size={24} />}
                {getTimeStatus() === "ok" && <Clock size={24} />}
                {formatTime(timeRemaining)}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            onClick={handleFinishLoan}
            disabled={loading}
            className="btn-success"
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Terminar Préstamo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanModal;