// src/components/Export/ExportModal.jsx - VERSIÓN CORREGIDA
import React, { useState } from "react";
import API from "../../services/api";
import "./ExportModal.css";

// Importar las librerías correctamente
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable"; // ← Importación correcta

const ExportModal = ({ isOpen, onClose, currentFilters }) => {
  const [exportLoading, setExportLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [reportType, setReportType] = useState("todos");
  const [customFilters, setCustomFilters] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    usuario: "",
    implemento: "",
    estado: "",
    limite: "",
  });

  if (!isOpen) return null;

  const handleFilterChange = (field, value) => {
    setCustomFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para descargar Excel - CORREGIDA
  const downloadExcel = (data, filename) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Préstamos");
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error al generar archivo Excel");
    }
  };

  // Función para descargar CSV - CORREGIDA
  const downloadCSV = (data, filename) => {
    try {
      if (!data || data.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      const headers = Object.keys(data[0]).join(",");
      const csvData = data
        .map((row) =>
          Object.values(row)
            .map((field) => `"${String(field || "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

      const csv = `${headers}\n${csvData}`;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Para IE
        window.navigator.msSaveOrOpenBlob(blob, `${filename}.csv`);
      } else {
        // Para navegadores modernos
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error generando CSV:", error);
      alert("Error al generar archivo CSV");
    }
  };

  // Función para descargar PDF - CORREGIDA
  // Función para descargar PDF - VERSIÓN CORREGIDA
  // Función para descargar PDF - VERSIÓN HORIZONTAL COMPLETA
  // Función para descargar PDF - VERSIÓN CON AUTOTABLE FUNCIONAL
  // Función para descargar PDF - VERSIÓN MEJORADA
  const downloadPDF = (data, title, filename) => {
    try {
      if (!data || data.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      // Crear PDF en orientación horizontal
      const doc = new jsPDF("landscape");

      // Configuración de página
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Título más grande
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, 20);

      // Información del reporte - más grande
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generado el: ${new Date().toLocaleDateString("es-ES")}`,
        35, // Movido más a la derecha
        35
      );
      doc.text(`Total de registros: ${data.length}`, pageWidth - 75, 35); // Ajustado para balance

      // Preparar datos para autotable
      const headers = [
        [
          "Nombre Completo",
          "N° Cédula",
          "Programa",
          "Teléfono",
          "Implemento",
          "Fecha",
          "Hora Inicio",
          "Hora Final",
          "Horas Totales",
          "Estado",
        ],
      ];

      const tableData = data.map((item) => [
        String(item["Nombre completo"] || "-"),
        String(item["N° cédula"] || "-"),
        String(item["Programa"] || "-"),
        String(item["Teléfono"] || "-"),
        String(item["Implemento"] || "-"),
        String(item["Fecha"] || "-"),
        String(item["Hora inicio"] || "-"),
        String(item["Hora final"] || "-"),
        String(item["Horas totales"] || "-"),
        String(item["Estado"] || "-"),
      ]);

      // Generar tabla con autotable - CON BORDES DE CUADRO
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 45,
        styles: {
          fontSize: 9, // Más grande
          cellPadding: 2, // Más espacio
          overflow: "linebreak",
          halign: "left",
          lineColor: [0, 0, 0], // Color de líneas negro
          lineWidth: 0.1, // Grosor de líneas
        },
        headStyles: {
          fillColor: [255, 255, 255], // Fondo blanco
          textColor: [0, 0, 0], // Texto negro
          fontStyle: "bold",
          fontSize: 10, // Más grande
          lineColor: [0, 0, 0], // Bordes negros
          lineWidth: 0.3, // Bordes más gruesos en encabezados
        },
        bodyStyles: {
          lineColor: [0, 0, 0], // Bordes negros en cuerpo
          lineWidth: 0.1,
        },

        columnStyles: {
          0: { cellWidth: 30, fontSize: 8 }, // Nombre (un poco más grande)
          1: { cellWidth: 24, fontSize: 9 }, // Cédula
          2: { cellWidth: 28, fontSize: 8 }, // Programa
          3: { cellWidth: 25, fontSize: 9 }, // Teléfono
          4: { cellWidth: 28, fontSize: 8 }, // Implemento
          5: { cellWidth: 24, fontSize: 8 }, // Fecha
          6: { cellWidth: 24, fontSize: 9 }, // Hora Inicio
          7: { cellWidth: 24, fontSize: 9 }, // Hora Final
          8: { cellWidth: 20, fontSize: 9 }, // Horas Totales
          9: {
            cellWidth: 24,
            fontSize: 9,
            fontStyle: "bold", // Estado en negrita
            // Colores según estado
            fillColor: function (row) {
              const estado = row.raw[9];
              if (estado === "activo") return [220, 255, 220]; // Verde claro
              if (estado === "pendiente") return [255, 255, 200]; // Amarillo claro
              if (estado === "devuelto") return [220, 230, 255]; // Azul claro
              if (estado === "perdido") return [255, 220, 220]; // Rojo claro
              return [255, 255, 255]; // Blanco por defecto
            },
          },
        },
        margin: {
          top: 45,
          right: 10, // Margen derecho aumentado
          left: 23, // Margen izquierdo aumentado para balance
          bottom: 25, // Margen inferior aumentado para evitar interferencia
        },
        theme: "grid", // Tema con bordes de cuadrícula
        didDrawPage: function (data) {
          // Pie de página con más espacio
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = data.pageNumber;

          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.setFont("helvetica", "normal");

          // Línea separadora del pie de página - más arriba para dar espacio
          doc.setDrawColor(200, 200, 200);
          doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25); // Movida hacia arriba

          // Texto del pie de página - más arriba
          doc.text(
            `Sistema de Gestión de Préstamos - Bienestar Universitario`,
            25, // Movido más a la derecha
            pageHeight - 17 // Más espacio desde el borde inferior
          );

          doc.text(
            `Página ${currentPage} de ${pageCount}`,
            pageWidth - 45, // Movido más a la derecha
            pageHeight - 17, // Más espacio desde el borde inferior
            { align: "right" }
          );

          // Fecha y hora de generación en pie de página
          const now = new Date();
          const fechaHora = `Generado: ${now.toLocaleDateString(
            "es-ES"
          )} ${now.toLocaleTimeString("es-ES")}`;
          doc.text(fechaHora, pageWidth / 2, pageHeight - 17, {
            // Más espacio
            align: "center",
          });
        },
        willDrawCell: function (data) {
          // Solo bordes, sin colores de fondo excepto en estado
          if (data.section === "body" && data.column.index !== 9) {
            data.cell.styles.fillColor = [255, 255, 255]; // Fondo blanco
          }
        },
      });

      doc.save(`${filename}.pdf`);

      console.log("✅ PDF mejorado generado exitosamente");
    } catch (error) {
      console.error("❌ Error generando PDF mejorado:", error);
      alert("Error al generar PDF: " + error.message);
    }
  };

  // Función helper para formatear horas
  const formatHora12h = (horaString) => {
    if (!horaString) return "--:--";
    const [horas, minutos] = horaString.split(":");
    const horasNum = parseInt(horas);
    const ampm = horasNum >= 12 ? "PM" : "AM";
    const horas12 = horasNum % 12 || 12;
    return `${horas12}:${minutos} ${ampm}`;
  };

  // Función helper para formatear duración
  const formatDuracionExport = (horasDecimal) => {
    if (!horasDecimal) return "--";
    const minutosTotales = Math.round(horasDecimal * 60);
    if (minutosTotales < 60) {
      return `${minutosTotales} min`;
    } else {
      const horas = Math.floor(minutosTotales / 60);
      const minutos = minutosTotales % 60;
      return `${horas}:${minutos.toString().padStart(2, "0")} h`;
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Combinar filtros actuales con los del modal
      const filters = {
        tipo_reporte: reportType,
        ...customFilters,
        ...(reportType === "personalizado"
          ? {}
          : {
              fecha_inicio: "",
              fecha_fin: "",
            }),
      };

      // Limpiar filtros vacíos
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] === "" ||
          filters[key] === null ||
          filters[key] === undefined
        ) {
          delete filters[key];
        }
      });

      console.log("📤 Solicitando reporte con filtros:", filters);

      const response = await API.get("/api/prestamos/reporte/exportar", {
        params: filters,
      });

      if (response.data.success) {
        const { data, titulo, total, fecha_generacion } = response.data;

        if (!data || data.length === 0) {
          alert("❌ No hay datos para exportar con los filtros seleccionados");
          return;
        }

        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `prestamos_bienestar_${timestamp}`;

        switch (exportFormat) {
          case "excel":
            downloadExcel(data, filename);
            break;
          case "csv":
            downloadCSV(data, filename);
            break;
          case "pdf":
            downloadPDF(data, titulo, filename);
            break;
          default:
            break;
        }

        alert(
          `✅ Reporte exportado exitosamente\n📊 Total de registros: ${total}\n📅 Fecha: ${fecha_generacion}`
        );
        onClose();
      } else {
        alert("❌ Error al generar el reporte: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Error exportando reporte:", error);
      alert(
        "Error al exportar el reporte. Verifica la consola para más detalles."
      );
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="modal-overlay export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Exportar Reporte de Préstamos</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="export-section">
            <h3>📋 Tipo de Reporte</h3>
            <div className="report-type-grid">
              <label className="report-type-option">
                <input
                  type="radio"
                  value="todos"
                  checked={reportType === "todos"}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <span>Todos los préstamos</span>
              </label>

              <label className="report-type-option">
                <input
                  type="radio"
                  value="hoy"
                  checked={reportType === "hoy"}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <span>Préstamos de hoy</span>
              </label>

              <label className="report-type-option">
                <input
                  type="radio"
                  value="ayer"
                  checked={reportType === "ayer"}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <span>Préstamos de ayer</span>
              </label>

              <label className="report-type-option">
                <input
                  type="radio"
                  value="semana"
                  checked={reportType === "semana"}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <span>Última semana</span>
              </label>

              <label className="report-type-option">
                <input
                  type="radio"
                  value="mes"
                  checked={reportType === "mes"}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <span>Último mes</span>
              </label>

              <label className="report-type-option">
                <input
                  type="radio"
                  value="personalizado"
                  checked={reportType === "personalizado"}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <span>Rango personalizado</span>
              </label>
            </div>
          </div>

          {/* Filtros personalizados */}
          {reportType === "personalizado" && (
            <div className="custom-filters">
              <h3>📅 Rango de Fechas</h3>
              <div className="filter-row">
                <div className="filter-group">
                  <label>Fecha inicio:</label>
                  <input
                    type="date"
                    value={customFilters.fecha_inicio}
                    onChange={(e) =>
                      handleFilterChange("fecha_inicio", e.target.value)
                    }
                  />
                </div>
                <div className="filter-group">
                  <label>Fecha fin:</label>
                  <input
                    type="date"
                    value={customFilters.fecha_fin}
                    onChange={(e) =>
                      handleFilterChange("fecha_fin", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filtros adicionales */}
          <div className="additional-filters">
            <h3>🎯 Filtros Adicionales</h3>
            <div className="filter-grid">
              <div className="filter-group">
                <label>Usuario (nombre o cédula):</label>
                <input
                  type="text"
                  value={customFilters.usuario}
                  onChange={(e) =>
                    handleFilterChange("usuario", e.target.value)
                  }
                  placeholder="Buscar por nombre o cédula..."
                />
              </div>

              <div className="filter-group">
                <label>Implemento:</label>
                <input
                  type="text"
                  value={customFilters.implemento}
                  onChange={(e) =>
                    handleFilterChange("implemento", e.target.value)
                  }
                  placeholder="Filtrar por implemento..."
                />
              </div>

              <div className="filter-group">
                <label>Estado:</label>
                <select
                  value={customFilters.estado}
                  onChange={(e) => handleFilterChange("estado", e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="devuelto">Devuelto</option>
                  <option value="perdido">Perdido</option>
                  <option value="rechazado">Rechazado</option>{" "}
                  {/* ✅ NUEVA OPCIÓN */}
                  <option value="solicitado">Solicitado</option>{" "}
                  {/* ✅ POR SI ACASO */}
                </select>
              </div>

              <div className="filter-group">
                <label>Límite de registros:</label>
                <input
                  type="number"
                  value={customFilters.limite}
                  onChange={(e) => handleFilterChange("limite", e.target.value)}
                  placeholder="Ej: 100 (vacío = todos)"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="export-section">
            <h3>💾 Formato de Exportación</h3>
            <div className="format-options">
              <label className="format-option">
                <input
                  type="radio"
                  value="excel"
                  checked={exportFormat === "excel"}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <span>📗 Excel (.xlsx)</span>
              </label>

              <label className="format-option">
                <input
                  type="radio"
                  value="pdf"
                  checked={exportFormat === "pdf"}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <span>📕 PDF (.pdf)</span>
              </label>

              <label className="format-option">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <span>📘 CSV (.csv)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="btn btn-primary export-btn"
          >
            {exportLoading ? (
              <>
                <span className="spinner-small"></span>
                Generando reporte...
              </>
            ) : (
              <>📥 Exportar Reporte</>
            )}
          </button>

          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
