// src/components/UserProfile/UserStats.jsx
import React, { useState, useEffect } from 'react';
import { userProfileService } from '../../services/userProfileService';
import './UserStats.css';

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

  return (
    <div className="user-stats-container">
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>Horas Totales</h3>
            <p className="stat-number">{stats?.horas_totales_acumuladas || 0}</p>
            <p className="stat-desc">Horas acumuladas en préstamos</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Préstamos Totales</h3>
            <p className="stat-number">{stats?.total_prestamos || 0}</p>
            <p className="stat-desc">Total de implementos prestados</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Préstamos Devueltos</h3>
            <p className="stat-number">{stats?.prestamos_devueltos || 0}</p>
            <p className="stat-desc">Préstamos completados correctamente</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <h3>Préstamos Activos</h3>
            <p className="stat-number">{stats?.prestamos_activos || 0}</p>
            <p className="stat-desc">Implementos en uso actual</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <h3>Préstamos Perdidos</h3>
            <p className="stat-number">{stats?.prestamos_perdidos || 0}</p>
            <p className="stat-desc">Préstamos marcados como perdidos</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Préstamos Pendientes</h3>
            <p className="stat-number">{stats?.prestamos_pendientes || 0}</p>
            <p className="stat-desc">Préstamos por finalizar</p>
          </div>
        </div>
      </div>

      {/* Resumen adicional */}
      <div className="stats-summary">
        <h3>Resumen de Actividad</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Tasa de Finalización:</span>
            <span className="summary-value">
              {stats?.total_prestamos ? 
                Math.round(((stats.prestamos_devueltos || 0) / stats.total_prestamos) * 100) : 0
              }%
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Promedio Horas/Préstamo:</span>
            <span className="summary-value">
              {stats?.total_prestamos ? 
                (stats.horas_totales_acumuladas / stats.total_prestamos).toFixed(1) : 0
              }h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;