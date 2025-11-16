// src/pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { userProfileService } from "../services/userProfileService";
import UserLoansHistory from "../components/UserProfile/UserLoansHistory";
import UserStats from "../components/UserProfile/UserStats";
import UserImplementos from "../components/UserProfile/UserImplementos";
import logo from "../assets/logo1.svg";
import "./UserProfile.css";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const result = await authService.getUserProfile();

      if (result.success) {
        setUserData(result.data);

        if (activeTab === "stats") {
          await loadUserStats(result.data.id);
        }
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async (userId) => {
    try {
      const result = await userProfileService.getUserDetailedStats(userId);
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    if (tab === "stats" && userData?.id) {
      await loadUserStats(userData.id);
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      logout();
      window.location.href = "/";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgramaNombre = () => {
    if (userData?.programa_nombre) {
      return userData.programa_nombre;
    }
    if (userData?.programa_id) {
      return `Programa ID: ${userData.programa_id}`;
    }
    return "Sin programa asignado";
  };

  if (loading && !userData) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header Superior */}
      <header className="profile-header">
        <div className="header-left">
          <div className="logo-container">
            <img src={logo} alt="UCC LOANS" className="logo-svg" />
            <span className="logo-text">UCC LOANS</span>
          </div>
          <div className="user-info-mobile">
            <div className="user-avatar-small">
              {user?.nombre_completo?.charAt(0) || "U"}
            </div>
            <span className="user-name-mobile">Mi Perfil</span>
          </div>
        </div>

        <div className="header-right">
          <div className="hours-badge">
            ⏱️ {userData?.horas_totales_acumuladas || 0}h
          </div>
          <button 
            className="logout-button-mobile" 
            onClick={handleLogout}
          >
            🚪 Salir
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="profile-main">
        {activeTab === "profile" && (
          <div className="tab-content">
            <h2>Información Personal</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Nombre Completo</label>
                <span>{userData?.nombre_completo}</span>
              </div>
              <div className="info-item">
                <label>Número de Cédula</label>
                <span>{userData?.numero_cedula}</span>
              </div>
              <div className="info-item">
                <label>Teléfono</label>
                <span>{userData?.numero_telefono}</span>
              </div>
              <div className="info-item">
                <label>Programa</label>
                <span>{getProgramaNombre()}</span>
              </div>
              <div className="info-item">
                <label>Email</label>
                <span>{userData?.email}</span>
              </div>
              <div className="info-item">
                <label>Estado de Cuenta</label>
                <span className={`status ${userData?.verificado ? "verified" : "pending"}`}>
                  {userData?.verificado ? "✅ Verificada" : "⏳ Pendiente"}
                </span>
              </div>
              <div className="info-item">
                <label>Fecha de Registro</label>
                <span>
                  {userData?.fecha_registro
                    ? formatDate(userData.fecha_registro)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "implementos" && (
          <div className="tab-content">
            <h2>Implementos Disponibles</h2>
            <UserImplementos />
          </div>
        )}

        {activeTab === "history" && userData && (
          <div className="tab-content">
            <h2>Historial de Préstamos</h2>
            <UserLoansHistory userId={userData.id} />
          </div>
        )}

        {activeTab === "stats" && userData && (
          <div className="tab-content">
            <h2>Estadísticas de Uso</h2>
            <UserStats userId={userData.id} statsData={stats} />
          </div>
        )}
      </main>

      {/* Navigation Bar Inferior */}
      <nav className="profile-nav-bottom">
        <button
          className={`nav-item-bottom ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => handleTabChange("profile")}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Perfil</span>
        </button>

        <button
          className={`nav-item-bottom ${activeTab === "implementos" ? "active" : ""}`}
          onClick={() => handleTabChange("implementos")}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">Implementos</span>
        </button>

        <button
          className={`nav-item-bottom ${activeTab === "history" ? "active" : ""}`}
          onClick={() => handleTabChange("history")}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">Historial</span>
        </button>

        <button
          className={`nav-item-bottom ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => handleTabChange("stats")}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Estadísticas</span>
        </button>
      </nav>

      {/* Sidebar Desktop (solo se muestra en desktop) */}
      <div className="profile-sidebar-desktop">
        <div className="user-summary-desktop">
          <div className="user-avatar-desktop">
            {user?.nombre_completo?.charAt(0) || "U"}
          </div>
          <h3>{user?.nombre_completo}</h3>
          <p className="user-email-desktop">{user?.email}</p>
          <p>📚 {getProgramaNombre()}</p>
          <div className="user-stats-desktop">
            <div className="stat-desktop">
              <span className="stat-value-desktop">
                {userData?.horas_totales_acumuladas || 0}
              </span>
              <span className="stat-label-desktop">Horas</span>
            </div>
            <div className="stat-desktop">
              <span className="stat-value-desktop">
                {userData?.total_prestamos || 0}
              </span>
              <span className="stat-label-desktop">Préstamos</span>
            </div>
          </div>
        </div>

        <nav className="profile-nav-desktop">
          <button
            className={`nav-item-desktop ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => handleTabChange("profile")}
          >
            👤 Información Personal
          </button>

          <button
            className={`nav-item-desktop ${activeTab === "implementos" ? "active" : ""}`}
            onClick={() => handleTabChange("implementos")}
          >
            🎯 Implementos Disponibles
          </button>

          <button
            className={`nav-item-desktop ${activeTab === "history" ? "active" : ""}`}
            onClick={() => handleTabChange("history")}
          >
            📋 Historial de Préstamos
          </button>

          <button
            className={`nav-item-desktop ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => handleTabChange("stats")}
          >
            📊 Estadísticas
          </button>
        </nav>

        <button className="logout-button-desktop" onClick={handleLogout}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserProfile;