// src/pages/Prestamos.jsx - VERSIÓN ACTUALIZADA
import React, { useState } from "react";
import { useLoansFilters } from "../hooks/useLoansFilters";
import { useNavigate } from "react-router-dom";
import LoanFilters from "../components/Filters/LoanFilters";
import ExportModal from "../components/Export/ExportModal";
import loansService from "../services/loans.service";
import { FileText, CheckCircle, XCircle, Clock, Info } from "lucide-react";
import "./Prestamos.css";

// Función para formatear duración
const formatDuracion = (horasDecimal) => {
  if (!horasDecimal || horasDecimal === 0) return "--";

  const minutosTotales = Math.round(horasDecimal * 60);

  if (minutosTotales < 60) {
    return `${minutosTotales} min`;
  } else {
    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;
    return `${horas}:${minutos.toString().padStart(2, "0")} h`;
  }
};

// Función para formatear horas
const formatHora12h = (horaString) => {
  if (!horaString) return "--:--";

  const horaSinSegundos = horaString
    .split(".")[0]
    .split(":")
    .slice(0, 2)
    .join(":");

  const [horas, minutos] = horaSinSegundos.split(":");
  const horasNum = parseInt(horas);
  const ampm = horasNum >= 12 ? "pm" : "am";
  const horas12 = horasNum % 12 || 12;

  return `${horas12}:${minutos} ${ampm}`;
};

// Función para formatear teléfono
const formatTelefono = (telefono) => {
  if (!telefono) return "--";

  const telefonoLimpio = telefono.toString().replace(/\D/g, "");

  if (telefonoLimpio.length === 10) {
    return `(${telefonoLimpio.substring(0, 3)}) ${telefonoLimpio.substring(
      3,
      6
    )}-${telefonoLimpio.substring(6)}`;
  } else if (telefonoLimpio.length === 7) {
    return `${telefonoLimpio.substring(0, 3)}-${telefonoLimpio.substring(3)}`;
  }

  return telefono;
};

const Prestamos = () => {
  const navigate = useNavigate();
  const {
    loans,
    loading,
    error,
    filters,
    pagination,
    applyFilters,
    clearFilters,
    updateFilter,
    changePage,
    loadLoans,
  } = useLoansFilters();

  const [showExportModal, setShowExportModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const handleFinishLoan = async (loanId) => {
    if (!window.confirm('¿Estás seguro de que quieres finalizar este préstamo?')) {
      return;
    }

    setActionLoading(loanId);
    try {
      const result = await loansService.finishLoan(loanId);
      if (result.success) {
        alert('✅ Préstamo finalizado exitosamente');
        loadLoans(); // Recargar la lista
      } else {
        alert('❌ Error: ' + result.message);
      }
    } catch (error) {
      alert('❌ Error: ' + (error.message || 'Error al finalizar préstamo'));
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ FUNCIÓN PARA RECHAZAR PRÉSTAMO
  const handleRejectLoan = async (loanId) => {
    const motivo = prompt('Ingresa el motivo del rechazo:');
    if (!motivo || !motivo.trim()) {
      alert('Debes ingresar un motivo para rechazar el préstamo');
      return;
    }

    setActionLoading(loanId);
    try {
      const result = await loansService.rejectLoan(loanId, motivo.trim());
      if (result.success) {
        alert('✅ Préstamo rechazado exitosamente');
        loadLoans(); // Recargar la lista
      } else {
        alert('❌ Error: ' + result.message);
      }
    } catch (error) {
      alert('❌ Error: ' + (error.message || 'Error al rechazar préstamo'));
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ FUNCIÓN PARA APROBAR PRÉSTAMO
  const handleApproveLoan = async (loanId) => {
    if (!window.confirm('¿Estás seguro de que quieres aprobar este préstamo?')) {
      return;
    }

    setActionLoading(loanId);
    try {
      const result = await loansService.approveLoan(loanId);
      if (result.success) {
        alert('✅ Préstamo aprobado exitosamente');
        loadLoans(); // Recargar la lista
      } else {
        alert('❌ Error: ' + result.message);
      }
    } catch (error) {
      alert('❌ Error: ' + (error.message || 'Error al aprobar préstamo'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddLoan = () => {
    navigate("/dashboard");
  };

  // Función para manejar acciones de préstamos
  const handleLoanAction = (loanId, action) => {
    console.log(`Acción ${action} en préstamo ${loanId}`);
    // Aquí implementarás la lógica para aprobar, rechazar o finalizar
  };

  const renderPagination = () => {
    if (pagination.total_paginas <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, pagination.pagina_actual - 2);
    const endPage = Math.min(
      pagination.total_paginas,
      pagination.pagina_actual + 2
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => changePage(i)}
          className={`pagination-btn ${
            pagination.pagina_actual === i ? "active" : ""
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => changePage(pagination.pagina_actual - 1)}
          disabled={pagination.pagina_actual === 1}
          className="pagination-btn"
        >
          ← Anterior
        </button>

        {pages}

        <button
          onClick={() => changePage(pagination.pagina_actual + 1)}
          disabled={pagination.pagina_actual === pagination.total_paginas}
          className="pagination-btn"
        >
          Siguiente →
        </button>
      </div>
    );
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      activo: { class: "status-active", label: "Activo" },
      pendiente: { class: "status-pending", label: "Pendiente" },
      devuelto: { class: "status-completed", label: "Devuelto" },
      perdido: { class: "status-lost", label: "Perdido" },
      rechazado: { class: "status-rejected", label: "Rechazado" },
      solicitado: { class: "status-requested", label: "Solicitado" },
    };

    const config = statusConfig[estado] || {
      class: "status-default",
      label: estado,
    };
    return (
      <span className={`status-badge ${config.class}`}>{config.label}</span>
    );
  };

  const renderActionIcons = (loan) => {
    // Solo mostrar acciones para estados específicos
    if (loan.estado === "solicitado") {
      return (
        <div className="status-actions">
          <button
            onClick={() => handleApproveLoan(loan.id)}
            disabled={actionLoading === loan.id}
            className="action-btn approve-btn"
            title="Aprobar préstamo"
          >
            <CheckCircle size={16} />
          </button>
          <button
            onClick={() => handleRejectLoan(loan.id)}
            disabled={actionLoading === loan.id}
            className="action-btn reject-btn"
            title="Rechazar préstamo"
          >
            <XCircle size={16} />
          </button>
        </div>
      );
    }

    if (loan.estado === "activo") {
      return (
        <div className="status-actions">
          <button
            onClick={() => handleFinishLoan(loan.id)}
            disabled={actionLoading === loan.id}
            className="action-btn complete-btn"
            title="Marcar como finalizado"
          >
            <Clock size={16} />
          </button>
        </div>
      );
    }

    return null;
  };

  if (loading && loans.length === 0) {
    return (
      <div className="prestamos-page">
        <div className="loading-full">⏳ Cargando préstamos...</div>
      </div>
    );
  }

  return (
    <div className="prestamos-page">
      <div className="page-header">
    <div className="header-actions">
      <div className="header-title">
        
        <div>
          <h1> Todos los Préstamos</h1>
          <p>Gestión completa de préstamos con filtros avanzados</p>
        </div>
      </div>
    </div>
  </div>

      <LoanFilters
        filters={filters}
        onFiltersChange={applyFilters}
        onClearFilters={clearFilters}
        onSearchChange={(value) => updateFilter("search", value)}
        onExport={() => setShowExportModal(true)}
        onAddLoan={handleAddLoan}
      />

      {error && (
        <div className="error-message">
          ❌ Error: {error}
          <button onClick={() => applyFilters({})} className="retry-btn">
            Reintentar
          </button>
        </div>
      )}

      <div className="results-info">
        <span>
          Mostrando {loans.length} de {pagination.total} préstamos
          {filters.search && ` para "${filters.search}"`}
        </span>
        <span>
          Página {pagination.pagina_actual} de {pagination.total_paginas}
        </span>
      </div>

      <div className="loans-table-container">
        <table className="loans-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Programa</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Implemento</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Horas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>
                  <div className="user-info">
                    <strong>{loan.nombre_completo}</strong>
                  </div>
                </td>
                <td>
                  <span className="programa-text">{loan.programa || "--"}</span>
                </td>
                <td>{loan.numero_cedula}</td>
                <td>{formatTelefono(loan.numero_telefono)}</td>
                <td>
                  <span className="implemento-badge">{loan.implemento}</span>
                </td>
                <td>
                  {new Date(loan.fecha_prestamo).toLocaleDateString("es-ES")}
                </td>
                <td>{formatHora12h(loan.hora_inicio)}</td>
                <td>
                  {loan.hora_fin_real
                    ? formatHora12h(loan.hora_fin_real)
                    : formatHora12h(loan.hora_fin_estimada) || "--:--"}
                  {loan.hora_fin_real && (
                    <small className="real-time">(Real)</small>
                  )}
                </td>
          
                <td>{formatDuracion(loan.horas_totales)}</td>
                <td>
                  <div className="status-cell">
                    <div className="status-wrapper">
                      {getStatusBadge(loan.estado)}
                      {loan.estado === "rechazado" && loan.motivo_rechazo && (
                        <div
                          className="rejection-reason-tooltip"
                          title={loan.motivo_rechazo}
                        >
                          <Info size={14} />
                        </div>
                      )}
                    </div>
                    {renderActionIcons(loan)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loans.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No se encontraron préstamos</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {renderPagination()}

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        currentFilters={filters}
      />
    </div>
  );
};

export default Prestamos;
