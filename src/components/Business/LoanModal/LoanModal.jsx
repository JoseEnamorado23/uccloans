import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import "./LoanModal.css";

const LoanModal = ({ loan, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [extensionReason, setExtensionReason] = useState("");

  // Calcular tiempo restante en tiempo real
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
    console.log("🎯🎯🎯 FINALIZANDO DESDE MODAL - Préstamo ID:", loan.id);
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

  const handleExtendLoan = async () => {
    if (!extensionReason.trim()) {
      alert("Por favor ingresa un motivo para la extensión");
      return;
    }

    setLoading(true);
    try {
      const response = await API.put(`/api/prestamos/${loan.id}/extender`, {
        motivo: extensionReason,
      });
      if (response.data.success) {
        onUpdate();
        setShowExtendForm(false);
        setExtensionReason("");
        alert("Préstamo extendido exitosamente");
      }
    } catch (error) {
      console.error("Error extendiendo préstamo:", error);
      alert("Error al extender el préstamo");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsLost = async () => {
    // Reemplazar confirm nativo
    const userConfirmed = window.confirm(
      "¿Estás seguro de marcar este préstamo como perdido?"
    );
    if (!userConfirmed) return;

    setLoading(true);
    try {
      const response = await API.put(
        `/api/prestamos/${loan.id}/marcar-perdido`
      );
      if (response.data.success) {
        onUpdate();
        onClose();
        alert("Préstamo marcado como perdido");
      }
    } catch (error) {
      console.error("Error marcando como perdido:", error);
      alert("Error al marcar como perdido");
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="loan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Préstamo</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Información del Usuario */}
          <div className="info-section">
            <h3>👤 Información del Usuario</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Nombre:</label>
                <span>{loan.nombre_completo}</span>
              </div>
              <div className="info-item">
                <label>Cédula:</label>
                <span>{loan.numero_cedula}</span>
              </div>
              <div className="info-item">
                <label>Teléfono:</label>
                <span>{loan.numero_telefono}</span>
              </div>
              <div className="info-item">
                <label>Programa:</label>
                <span>{loan.programa}</span>
              </div>
            </div>
          </div>

          {/* Información del Préstamo */}
          <div className="info-section">
            <h3>📋 Detalles del Préstamo</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Implemento:</label>
                <span>{loan.implemento}</span>
              </div>
              <div className="info-item">
                <label>Hora inicio:</label>
                <span>{loan.hora_inicio}</span>
              </div>
              <div className="info-item">
                <label>Hora fin estimada:</label>
                <span>{loan.hora_fin_estimada || "No calculada"}</span>
              </div>
              <div className="info-item">
                <label>Estado:</label>
                <span className={`status-badge status-${loan.estado}`}>
                  {loan.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Tiempo Restante */}
          {timeRemaining && (
            <div className="time-section">
              <h3>⏰ Tiempo Restante</h3>
              <div className={`time-display time-${getTimeStatus()}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          )}

          {/* Formulario de Extensión */}
          {showExtendForm && (
            <div className="extend-form">
              <h4>Extender Préstamo</h4>
              <textarea
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                placeholder="Motivo de la extensión..."
                rows="3"
              />
              <div className="form-actions">
                <button
                  onClick={handleExtendLoan}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Extendiendo..." : "Confirmar Extensión"}
                </button>
                <button
                  onClick={() => setShowExtendForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
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
            ✅ Terminar Préstamo
          </button>

          {!showExtendForm && (
            <button
              onClick={() => setShowExtendForm(true)}
              disabled={loading}
              className="btn-warning"
            >
              ⏱️ Extender Tiempo
            </button>
          )}

          <button
            onClick={handleMarkAsLost}
            disabled={loading}
            className="btn-danger"
          >
            ❌ Marcar como Perdido
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanModal;
