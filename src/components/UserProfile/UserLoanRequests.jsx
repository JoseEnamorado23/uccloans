// src/components/UserProfile/UserLoanRequests.jsx
import React, { useState, useEffect } from "react";
import loanRequestsService from "../../services/loanRequests.service";
import "./UserLoanRequests.css";

const UserLoanRequests = ({ userId }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSolicitudes();
  }, [userId]);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const result = await loanRequestsService.getUserLoanRequests(userId);

      if (result.success) {
        setSolicitudes(result.data);
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
      setError(error.message || "Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  // En UserLoanRequests.jsx - ACTUALIZAR getEstadoBadge
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "solicitado":
        return { text: "⏳ Pendiente", class: "badge-pending" };
      case "activo":
        return { text: "✅ Aprobado", class: "badge-approved" };
      case "devuelto":
        return { text: "📦 Devuelto", class: "badge-returned" };
      case "rechazado": // ✅ NUEVO ESTADO
        return { text: "❌ Rechazado", class: "badge-rejected" };
      case "perdido":
        return { text: "🚫 Perdido", class: "badge-lost" };
      default:
        return { text: estado, class: "badge-default" };
    }
  };

  const formatFecha = (fechaString) => {
    return new Date(fechaString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="solicitudes-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tus solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="solicitudes-error">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar solicitudes</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={loadSolicitudes}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="user-solicitudes">
      <div className="solicitudes-header">
        <h3>📝 Mis Solicitudes de Préstamo</h3>
        <p>Revisa el estado de tus solicitudes de préstamo</p>
      </div>
      <div className="solicitudes-stats">
        <div className="solicitud-stat">
          <span className="stat-number">{solicitudes.length}</span>
          <span className="stat-label">Total Solicitudes</span>
        </div>
        <div className="solicitud-stat">
          <span className="stat-number">
            {solicitudes.filter((s) => s.estado === "solicitado").length}
          </span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="solicitud-stat">
          <span className="stat-number">
            {solicitudes.filter((s) => s.estado === "activo").length}
          </span>
          <span className="stat-label">Aprobadas</span>
        </div>
      </div>
      {solicitudes.length === 0 ? (
        <div className="solicitudes-empty">
          <div className="empty-icon">📝</div>
          <h4>No tienes solicitudes de préstamo</h4>
          <p>Cuando solicites un implemento, aparecerán aquí</p>
        </div>
      ) : (
        <div className="solicitudes-list">
          {solicitudes.map((solicitud) => {
            const estado = getEstadoBadge(solicitud.estado);

            return (
              <div key={solicitud.id} className="solicitud-card">
                <div className="solicitud-header">
                  <h4>{solicitud.nombre_implemento || solicitud.implemento}</h4>
                  <span className={`badge ${estado.class}`}>{estado.text}</span>
                </div>

                <div className="solicitud-details">
                  <div className="detail-row">
                    <span className="detail-label">Fecha solicitud:</span>
                    <span className="detail-value">
                      {formatFecha(solicitud.fecha_registro)}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Implemento:</span>
                    <span className="detail-value">{solicitud.implemento}</span>
                  </div>

                  {solicitud.motivo_extension && (
                    <div className="detail-row">
                      <span className="detail-label">Motivo:</span>
                      <span className="detail-value motivo">
                        {solicitud.motivo_extension}
                      </span>
                    </div>
                  )}
                </div>

                <div className="solicitud-footer">
                  <small>ID: {solicitud.id}</small>
                  {solicitud.fecha_actualizacion && (
                    <small>
                      Actualizado: {formatFecha(solicitud.fecha_actualizacion)}
                    </small>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      // En UserLoanRequests.jsx - ACTUALIZAR la sección de información
      <div className="solicitudes-info">
        <p>
          💡 <strong>Estados de las solicitudes:</strong>
        </p>
        <ul>
          <li>
            ⏳ <strong>Pendiente:</strong> Esperando aprobación del
            administrador
          </li>
          <li>
            ✅ <strong>Aprobado:</strong> Solicitud aceptada, puedes usar el
            implemento
          </li>
          <li>
            ❌ <strong>Rechazado:</strong> Solicitud no fue aprobada
          </li>
          <li>
            📦 <strong>Devuelto:</strong> Préstamo finalizado correctamente
          </li>
          <li>
            🚫 <strong>Perdido:</strong> Implemento no fue devuelto
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserLoanRequests;
