// src/components/UserProfile/UserStats.jsx
import React, { useState, useEffect } from 'react';
import { userProfileService } from '../../services/userProfileService';
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Play, 
  XCircle, 
  Hourglass,
  BarChart3,
  Calendar,
  TrendingUp,
  Package
} from 'lucide-react';
import './UserStats.css';

// Función para formatear horas decimales a horas y minutos
const formatHoras = (horasDecimal) => {
  if (!horasDecimal || isNaN(horasDecimal)) return '0h 0m';
  
  const horas = Math.floor(horasDecimal);
  const minutos = Math.round((horasDecimal - horas) * 60);
  
  if (horas === 0 && minutos === 0) return '0h 0m';
  if (horas === 0) return `${minutos}m`;
  if (minutos === 0) return `${horas}h`;
  
  return `${horas}h ${minutos}m`;
};

// Función para formatear promedio (siempre muestra minutos con 2 dígitos)
const formatPromedioHoras = (horasDecimal) => {
  if (!horasDecimal || isNaN(horasDecimal)) return '0h 00m';
  
  const horas = Math.floor(horasDecimal);
  const minutos = Math.round((horasDecimal - horas) * 60);
  
  if (horas === 0) return `${minutos.toString().padStart(2, '0')}m`;
  
  return `${horas}h ${minutos.toString().padStart(2, '0')}m`;
};

const UserStats = ({ userId, statsData }) => {
  const [stats, setStats] = useState(statsData);
  const [loading, setLoading] = useState(!statsData);

  useEffect(() => {
    if (!statsData) {
      loadStats();
    }
  }, [userId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await userProfileService.getUserDetailedStats(userId);
      
      console.log('📊 ESTADÍSTICAS RECIBIDAS DEL BACKEND:', result.data);
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="loading-spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  // ✅ USAR DIRECTAMENTE los datos del backend
  const {
    horas_totales_acumuladas = 0,
    total_prestamos = 0,
    prestamos_devueltos = 0,
    prestamos_activos = 0,
    prestamos_solicitados = 0,
    prestamos_rechazados = 0,
    implementos_diferentes = 0,
    dias_activo = 0
  } = stats || {};

  // Calcular métricas derivadas
  const tasaFinalizacion = total_prestamos ? 
    Math.round((prestamos_devueltos / total_prestamos) * 100) : 0;
  
  const promedioHorasDecimal = total_prestamos ? 
    (parseFloat(horas_totales_acumuladas) / parseInt(total_prestamos)) : 0;

  return (
    <div className="user-stats-container">

      {/* Resumen de actividad primero */}
      <div className="stats-summary">
        <div className="summary-header">
          <BarChart3 size={24} />
          <h3>Resumen de Actividad</h3>
        </div>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">
              <TrendingUp size={16} />
              Tasa de Finalización:
            </span>
            <span className="summary-value">{tasaFinalizacion}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">
              <Clock size={16} />
              Promedio por Préstamo:
            </span>
            <span className="summary-value">{formatPromedioHoras(promedioHorasDecimal)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">
              <Calendar size={16} />
              Días Activo:
            </span>
            <span className="summary-value">{dias_activo}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">
              <Package size={16} />
              Implementos Diferentes:
            </span>
            <span className="summary-value">{implementos_diferentes}</span>
          </div>
        </div>
      </div>

      {/* Grid de estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Horas Totales</h3>
            <p className="stat-number">{formatHoras(horas_totales_acumuladas)}</p>
            <p className="stat-desc">Tiempo total en préstamos</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>Préstamos Totales</h3>
            <p className="stat-number">{total_prestamos}</p>
            <p className="stat-desc">Total de implementos prestados</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Préstamos Devueltos</h3>
            <p className="stat-number">{prestamos_devueltos}</p>
            <p className="stat-desc">Préstamos completados exitosamente</p>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">
            <Play size={24} />
          </div>
          <div className="stat-info">
            <h3>Préstamos Activos</h3>
            <p className="stat-number">{prestamos_activos}</p>
            <p className="stat-desc">Implementos en uso actualmente</p>
          </div>
        </div>

        <div className="stat-card requested">
          <div className="stat-icon">
            <Hourglass size={24} />
          </div>
          <div className="stat-info">
            <h3>Solicitados</h3>
            <p className="stat-number">{prestamos_solicitados}</p>
            <p className="stat-desc">Solicitudes de préstamo enviadas</p>
          </div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">
            <XCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Rechazados</h3>
            <p className="stat-number">{prestamos_rechazados}</p>
            <p className="stat-desc">Solicitudes no aprobadas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;