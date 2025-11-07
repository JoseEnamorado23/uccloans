// src/pages/Activos.jsx - LAYOUT 3 COLUMNAS HORIZONTALES
import React, { useState } from "react";
import { useAutoLoans } from "../hooks/useAutoLoans";
import LoanCard from "../components/Business/LoanCard/LoanCard";
import LoanModal from "../components/Business/LoanModal/LoanModal";
import "./Activos.css";

const Activos = () => {
  const {
    activeLoans,
    pendingLoans,
    expiringLoans,
    loading,
    error,
    lastUpdate,
    refreshAll,
    isConnected,
  } = useAutoLoans();

  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleUpdate = () => {
    refreshAll();
  };

  const SeccionPrestamos = ({ titulo, icono, loans, color, descripcion }) => {
    return (
      <div className={`seccion-prestamos seccion-${color}`}>
        <div className="seccion-header">
          <span className="seccion-icono">{icono}</span>
          <div className="seccion-info">
            <h2 className="seccion-titulo">{titulo}</h2>
            <p className="seccion-descripcion">{descripcion}</p>
          </div>
          <span className="seccion-contador">{loans.length}</span>
        </div>

        {loans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No hay {titulo.toLowerCase()}</h3>
            <p>No se encontraron préstamos en esta categoría</p>
          </div>
        ) : (
          <div className="loans-grid">
            {loans.map((loan) => (
              <LoanCard
                key={`loan-${loan.id}-${color}`}
                loan={loan}
                onViewDetails={setSelectedLoan}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (
    loading &&
    activeLoans.length === 0 &&
    pendingLoans.length === 0 &&
    expiringLoans.length === 0
  ) {
    return (
      <div className="activos-page">
        <div className="loading-full">
          <div className="spinner"></div>
          <p>⏳ Cargando préstamos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activos-page">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">
              📊 Gestión de Préstamos en Tiempo Real
            </h1>
            <p className="page-subtitle">
              Sistema automático - Los préstamos se actualizan instantáneamente sin recargar
            </p>
          </div>

          <button
            onClick={refreshAll}
            className="btn-refresh"
            disabled={loading}
            title="Forzar actualización desde servidor"
          >
            🔄 {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        <div className="update-info">
          {lastUpdate && (
            <span className="last-update">
              📅 Última actualización:{" "}
              {new Date(lastUpdate).toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
          <span
            className={`connection-status ${
              isConnected ? "connected" : "disconnected"
            }`}
          >
            <span className="status-dot"></span>
            {isConnected ? "🟢 Conectado en tiempo real" : "🔴 Reconectando..."}
          </span>
        </div>
      </div>

      {/* ERROR GLOBAL */}
      {error && (
        <div className="error-message global-error">
          <span>❌ {error}</span>
          <button onClick={refreshAll} className="retry-btn">
            Reintentar
          </button>
        </div>
      )}

      {/* SECCIONES EN 3 COLUMNAS HORIZONTALES */}
      <div className="secciones-container">
        <SeccionPrestamos
          titulo="Por Vencer"
          icono="⏰"
          loans={expiringLoans}
          color="warning"
          descripcion="Préstamos próximos a vencer (menos de 30 min)"
        />

        <SeccionPrestamos
          titulo="Activos"
          icono="✅"
          loans={activeLoans}
          color="success"
          descripcion="Préstamos en curso normal"
        />

        <SeccionPrestamos
          titulo="Pendientes"
          icono="⚠️"
          loans={pendingLoans}
          color="danger"
          descripcion="Préstamos que excedieron el tiempo límite"
        />
      </div>

      {/* MODAL DE DETALLES */}
      {selectedLoan && (
        <LoanModal
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
          onUpdate={handleUpdate}
        />
      )}

      {/* INDICADOR DE WEBSOCKET */}
      <div className={`websocket-status ${isConnected ? "online" : "offline"}`}>
        <span
          className={`status-indicator ${isConnected ? "online" : "offline"}`}
        ></span>
        {isConnected ? (
          <>🟢 Sistema en tiempo real activo</>
        ) : (
          <>🔴 Reconectando al servidor...</>
        )}
      </div>
    </div>
  );
};

export default Activos;