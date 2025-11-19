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
  AlertCircle,
} from "lucide-react";
import API from "../../../services/api";
import "./LoanModal.min.css";

const LoanModal = ({ loan, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(loan?.segundos_restantes ?? 0);

  useEffect(() => {
    if (!loan?.segundos_restantes) return;
    setTimeRemaining(loan.segundos_restantes);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [loan]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFinishLoan = async () => {
    setLoading(true);
    try {
      const response = await API.put(`/api/prestamos/${loan.id}/finalizar`, {
        mostrar_resumen: true,
      });
      if (response.data?.success) {
        onUpdate?.();
        alert("✅ Préstamo finalizado exitosamente");
        onClose?.();
      } else {
        alert("Error: " + (response.data?.message || "respuesta inesperada"));
      }
    } catch (err) {
      console.error(err);
      alert("Error al finalizar el préstamo");
    } finally {
      setLoading(false);
    }
  };

  const getTimeStatus = () => {
    if (!timeRemaining || timeRemaining <= 0) return "neutral";
    if (timeRemaining <= 1800) return "critical";
    if (timeRemaining <= 3600) return "warning";
    return "ok";
  };

  const getStatusBadge = () => {
    switch (loan?.estado) {
      case "activo":
        return <span className="badge badge--green">Activo</span>;
      case "devuelto":
        return <span className="badge badge--blue">Devuelto</span>;
      case "pendiente":
        return <span className="badge badge--yellow">Pendiente</span>;
      default:
        return <span className="badge">Desconocido</span>;
    }
  };

  if (!loan) return null;

  return (
    <div className="mm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="mm-card" onClick={(e) => e.stopPropagation()}>
        <header className="mm-head">
          <div>
            <h3 className="mm-title">Detalles del préstamo</h3>
            <p className="mm-sub">ID #{loan.id} · {loan.programa}</p>
          </div>
          <button aria-label="Cerrar" className="mm-close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <main className="mm-body">
          <section className="mm-grid">
            <div className="mm-block">
              <div className="mm-block-title">
                <User size={16} /> <span>Usuario</span>
              </div>
              <div className="mm-row"><strong>Nombre</strong><span>{loan.nombre_completo}</span></div>
              <div className="mm-row"><strong>Cédula</strong><span>{loan.numero_cedula}</span></div>
              <div className="mm-row"><strong>Teléfono</strong><span>{loan.numero_telefono || "-"}</span></div>
            </div>

            <div className="mm-block">
              <div className="mm-block-title">
                <Package size={16} /> <span>Préstamo</span>
              </div>
              <div className="mm-row"><strong>Implemento</strong><span>{loan.implemento}</span></div>
              <div className="mm-row"><strong>Inicio</strong><span>{loan.hora_inicio || "-"}</span></div>
              <div className="mm-row"><strong>Fin estimado</strong><span>{loan.hora_fin_estimada || "No calculada"}</span></div>
              <div className="mm-row"><strong>Estado</strong><span>{getStatusBadge()}</span></div>
            </div>
          </section>

          <section className="mm-time">
            <div className={`mm-time-box mm-${getTimeStatus()}`}>
              {getTimeStatus() === "critical" && <AlertCircle size={20} />}
              {getTimeStatus() === "warning" && <AlertTriangle size={20} />}
              {getTimeStatus() === "ok" && <Clock size={20} />}
              <div className="mm-time-text">
                <div className="mm-time-value">{formatTime(timeRemaining)}</div>
                <div className="mm-time-label">Tiempo restante</div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mm-foot">
          <button className="mm-btn mm-btn--ghost" onClick={onClose} disabled={loading}>Cancelar</button>
          <button
            className="mm-btn mm-btn--primary"
            onClick={handleFinishLoan}
            disabled={loading}
          >
            {loading ? (
              <span className="mm-spinner" />
            ) : (
              <>
                <CheckCircle size={16} /> Terminar préstamo
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LoanModal;
