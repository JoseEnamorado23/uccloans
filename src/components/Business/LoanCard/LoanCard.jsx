// src/components/Business/LoanCard/LoanCard.jsx - VERSIÓN CON LUCIDE ICONS
import { useState, useEffect, useMemo } from "react";
import { 
  Clock, 
  User, 
  IdCard, 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  Eye, 
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Inbox
} from "lucide-react";
import { io } from "socket.io-client";
import API from "../../../services/api";
//import whatsAppIcon from "../../../assets/whatsapp.svg";
import "./LoanCard.css";

export default function LoanCard({ loan, onViewDetails, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ ACTUALIZAR HORA CADA SEGUNDO
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ CALCULAR TIEMPO RESTANTE (Memoizado para optimizar)
  const timeInfo = useMemo(() => {
    if (!loan.hora_fin_estimada) return null;

    const now = new Date();
    const [hours, minutes, seconds] = loan.hora_fin_estimada
      .split(":")
      .map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes, seconds || 0);

    const diff = endTime - now;

    if (diff <= 0) {
      // Calcular tiempo excedido
      const excedidoMs = Math.abs(diff);
      const minutosExcedidos = Math.floor(excedidoMs / (1000 * 60));
      const segundosExcedidos = Math.floor((excedidoMs % (1000 * 60)) / 1000);

      return {
        vencido: true,
        minutos: -minutosExcedidos,
        texto: `+${minutosExcedidos
          .toString()
          .padStart(2, "0")}:${segundosExcedidos.toString().padStart(2, "0")}`,
        porcentaje: 0,
      };
    }

    const minutos = Math.floor(diff / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

    // Calcular porcentaje (asumiendo 3 horas = 180 minutos)
    const DURACION_TOTAL = 180;
    const porcentaje = (minutos / DURACION_TOTAL) * 100;

    return {
      vencido: false,
      minutos,
      segundos,
      texto: `${minutos.toString().padStart(2, "0")}:${segundos
        .toString()
        .padStart(2, "0")}`,
      porcentaje: Math.min(porcentaje, 100),
    };
  }, [loan.hora_fin_estimada, currentTime]);

  // ✅ DETERMINAR COLOR SEGÚN TIEMPO
  const getStatusClass = () => {
    if (!timeInfo) return "normal";
    if (timeInfo.vencido || loan.estado === "pendiente") return "critical";
    if (timeInfo.minutos <= 5) return "critical";
    if (timeInfo.minutos <= 15) return "warning";
    return "normal";
  };

  // ✅ FUNCIÓN PARA WHATSAPP
  const openWhatsApp = () => {
    if (!loan.numero_telefono) {
      alert('No hay número de teléfono disponible para este usuario');
      return;
    }

    // Limpiar el teléfono
    const telefonoLimpio = loan.numero_telefono.toString().replace(/\D/g, '');
    
    // Si el número tiene 10 dígitos (Colombia), quitar el primer 0 si existe
    let numeroWhatsApp = telefonoLimpio;
    if (telefonoLimpio.length === 10 && telefonoLimpio.startsWith('0')) {
      numeroWhatsApp = telefonoLimpio.substring(1);
    }
    
    // Crear mensaje predeterminado
    const mensaje = `Hola ${loan.nombre_completo || 'usuario'}, te escribo desde Bienestar Universitario acerca del préstamo de implementos.`;
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/57${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // ✅ FINALIZAR PRÉSTAMO
  const handleFinishLoan = async () => {
    console.log("🎯🎯🎯 handleFinishLoan INICIADO 🎯🎯🎯");
    console.log("📋 Datos del préstamo:", {
      id: loan.id,
      implemento: loan.implemento,
      estado: loan.estado,
    });

    if (!window.confirm(`¿Confirmas la devolución de: ${loan.implemento}?`)) {
      console.log("❌ Usuario canceló la acción");
      return;
    }

    console.log("✅ Usuario confirmó la finalización");
    setLoading(true);

    try {
      console.log("🔄 Realizando petición PUT...");
      console.log("📤 URL:", `/api/prestamos/${loan.id}/finalizar`);

      const response = await API.put(`/api/prestamos/${loan.id}/finalizar`, {
        mostrar_resumen: true,
      });

      console.log("📥 RESPUESTA COMPLETA:", response);
      console.log("📊 Datos de respuesta:", response.data);

      if (response.data.success) {
        console.log("✅✅✅ PRÉSTAMO FINALIZADO EXITOSAMENTE");
        onUpdate?.();
      } else {
        console.log("❌ Backend respondió con error:", response.data.message);
      }
    } catch (error) {
      console.error("❌❌❌ ERROR CAPTURADO:", error);
      console.log("🔍 Detalles del error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      alert("Error al finalizar el préstamo. Intenta de nuevo.");
    } finally {
      console.log("🏁 Finalizando handleFinishLoan");
      setLoading(false);
    }
  };

  // ✅ BADGE DE ESTADO
  const getEstadoBadge = () => {
    if (loan.estado === "pendiente") {
      return (
        <span className="badge badge-danger">
          <AlertTriangle size={14} />
          PENDIENTE
        </span>
      );
    }
    if (loan._vencido_cliente || (timeInfo && timeInfo.vencido)) {
      return (
        <span className="badge badge-warning">
          <Clock size={14} />
          VENCIDO
        </span>
      );
    }
    if (timeInfo && timeInfo.minutos <= 15) {
      return (
        <span className="badge badge-alert">
          <AlertCircle size={14} />
          POR VENCER
        </span>
      );
    }
    return (
      <span className="badge badge-success">
        <CheckCircle size={14} />
        ACTIVO
      </span>
    );
  };

  return (
    <div className={`loan-card status-${getStatusClass()}`}>
      {/* HEADER */}
      <div className="loan-header">
        <div className="loan-title-section">
          <h4 className="loan-implemento">{loan.implemento}</h4>
          {getEstadoBadge()}
        </div>
        
        {/* BOTÓN DE WHATSAPP EN EL HEADER */}
        {loan.numero_telefono && (
          <button
            onClick={openWhatsApp}
            className="whatsapp-btn-header"
            title="Enviar mensaje por WhatsApp"
          >
            <MessageCircle size={20} />
          </button>
        )}
      </div>

      {/* DETALLES DEL USUARIO */}
      <div className="loan-details">
        <div className="detail-row">
          <User size={18} className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Usuario</span>
            <span className="detail-value">{loan.nombre_completo}</span>
          </div>
        </div>

        <div className="detail-row">
          <IdCard size={18} className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Cédula</span>
            <span className="detail-value">{loan.numero_cedula}</span>
          </div>
        </div>

        <div className="detail-row">
          <BookOpen size={18} className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Programa</span>
            <span className="detail-value">{loan.programa || "N/A"}</span>
          </div>
        </div>

        <div className="detail-row">
          <Calendar size={18} className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Hora inicio</span>
            <span className="detail-value">{loan.hora_inicio}</span>
          </div>
        </div>

        <div className="detail-row">
          <Clock size={18} className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Hora límite</span>
            <span className="detail-value">{loan.hora_fin_estimada}</span>
          </div>
        </div>
      </div>

      {/* TIEMPO RESTANTE */}
      {timeInfo && (loan.estado === "activo" || !loan.estado) && (
        <div className={`time-section status-${getStatusClass()}`}>
          <div className="time-header">
            <span className="time-label">
              {timeInfo.vencido ? (
                <>
                  <AlertCircle size={16} />
                  Tiempo excedido
                </>
              ) : (
                <>
                  <Clock size={16} />
                  Tiempo restante
                </>
              )}
            </span>
            <span className="time-value">{timeInfo.texto}</span>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: timeInfo.vencido
                  ? "100%"
                  : `${100 - timeInfo.porcentaje}%`,
                background: timeInfo.vencido
                  ? "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)"
                  : timeInfo.minutos <= 5
                  ? "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)"
                  : timeInfo.minutos <= 15
                  ? "linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)"
                  : "linear-gradient(90deg, #10b981 0%, #059669 100%)",
              }}
            />
          </div>
        </div>
      )}

      {/* ACCIONES */}
      <div className="loan-actions">
        <button
          onClick={handleFinishLoan}
          disabled={loading}
          className="btn btn-success"
          title="Marcar como devuelto"
        >
          {loading ? (
            <>
              <span className="spinner-small"></span>
              Procesando...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Finalizar
            </>
          )}
        </button>

        <button
          onClick={() => onViewDetails?.(loan)}
          className="btn btn-info"
          title="Ver detalles completos"
        >
          <Eye size={16} />
          Detalles
        </button>
      </div>
    </div>
  );
}