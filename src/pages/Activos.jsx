// src/pages/Activos.jsx - LAYOUT 3 COLUMNAS HORIZONTALES
import React, { useState } from "react";
import { useAutoLoans } from "../hooks/useAutoLoans";
import LoanCard from "../components/Business/LoanCard/LoanCard";
import LoanModal from "../components/Business/LoanModal/LoanModal";
import { RefreshCw, Clock, CheckCircle, AlertTriangle, Inbox } from "lucide-react";
import "./Activos.css";

const Activos = () => {
  const {
    activeLoans,
    pendingLoans,
    expiringLoans,
    loading,
    error,
    refreshAll,
  } = useAutoLoans();

  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleUpdate = () => {
    refreshAll();
  };

  const SeccionPrestamos = ({ titulo, icono, loans, color, descripcion }) => {
    return (
      <div className={`seccion-prestamos seccion-${color}`}>
        <div className="seccion-header">
          <div className="seccion-icono">{icono}</div>
          <div className="seccion-info">
            <h3 className="seccion-titulo">{titulo}</h3>
            <p className="seccion-descripcion">{descripcion}</p>
          </div>
          <span className="seccion-contador badge">{loans.length}</span>
        </div>

        {loans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox size={48} />
            </div>
            <h4>No hay {titulo.toLowerCase()}</h4>
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Cargando préstamos...</h3>
          <p>Estamos obteniendo la información más reciente</p>
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
              Gestión de Préstamos Activos
            </h1>
            <p className="page-subtitle">
              Sistema en tiempo real - Actualización automática
            </p>
          </div>

          <button
            onClick={refreshAll}
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={18} />
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {/* ERROR GLOBAL */}
      {error && (
        <div className="error-message">
          <div className="detail-label">
            Error de conexión
          </div>
          <span>{error}</span>
          <button onClick={refreshAll} className="btn btn-outline">
            Reintentar
          </button>
        </div>
      )}

      {/* SECCIONES EN 3 COLUMNAS HORIZONTALES */}
      <div className="secciones-container">
        <SeccionPrestamos
          titulo="Por Vencer"
          icono={<Clock size={24} />}
          loans={expiringLoans}
          color="warning"
          descripcion="Préstamos próximos a vencer (30min)"
        />

        <SeccionPrestamos
          titulo="Activos"
          icono={<CheckCircle size={24} />}
          loans={activeLoans}
          color="success"
          descripcion="Préstamos en curso normal"
        />

        <SeccionPrestamos
          titulo="Pendientes"
          icono={<AlertTriangle size={24} />}
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
    </div>
  );
};

export default Activos;