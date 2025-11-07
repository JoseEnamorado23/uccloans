// src/pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { userProfileService } from "../services/userProfileService";
import UserLoansHistory from "../components/UserProfile/UserLoansHistory";
import UserStats from "../components/UserProfile/UserStats";
import UserImplementos from "../components/UserProfile/UserImplementos";
import UserLoanRequests from "../components/UserProfile/UserLoanRequests";
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

        // Cargar estadísticas adicionales si está en la pestaña de stats
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

  // ✅ CORREGIDO: Función para obtener el nombre del programa
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
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información y préstamos</p>
      </div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-summary">
            <div className="user-avatar">
              {user?.nombre_completo?.charAt(0) || "U"}
            </div>
            <h3>{user?.nombre_completo}</h3>
            <p className="user-email">{user?.email}</p>
            {/* ✅ CORREGIDO: Mostrar nombre del programa */}
            <p className="user-program">📚 {getProgramaNombre()}</p>
            <div className="user-stats">
              <div className="stat">
                <span className="stat-value">
                  {userData?.horas_totales_acumuladas || 0}
                </span>
                <span className="stat-label">Horas Acumuladas</span>
              </div>
              <div className="stat">
                {/* ✅ CORREGIDO: Usar total_prestamos del userData en lugar de stats */}
                <span className="stat-value">
                  {userData?.total_prestamos || 0}
                </span>
                <span className="stat-label">Préstamos Totales</span>
              </div>
            </div>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => handleTabChange("profile")}
            >
              👤 Información Personal
            </button>

            <button
              className={`nav-item ${
                activeTab === "implementos" ? "active" : ""
              }`}
              onClick={() => handleTabChange("implementos")}
            >
              🎯 Implementos Disponibles
            </button>
            <button
              className={`nav-item ${
                activeTab === "solicitudes" ? "active" : ""
              }`}
              onClick={() => handleTabChange("solicitudes")}
            >
              📝 Mis Solicitudes
            </button>
            <button
              className={`nav-item ${activeTab === "history" ? "active" : ""}`}
              onClick={() => handleTabChange("history")}
            >
              📋 Historial de Préstamos
            </button>
            <button
              className={`nav-item ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => handleTabChange("stats")}
            >
              📊 Estadísticas
            </button>
          </nav>

          <button className="logout-button" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === "implementos" && (
            <div className="tab-content">
              <UserImplementos />
            </div>
          )}
          {activeTab === "profile" && (
            <div className="tab-content">
              <h2>Información Personal</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre Completo:</label>
                  <span>{userData?.nombre_completo}</span>
                </div>
                <div className="info-item">
                  <label>Número de Cédula:</label>
                  <span>{userData?.numero_cedula}</span>
                </div>
                <div className="info-item">
                  <label>Teléfono:</label>
                  <span>{userData?.numero_telefono}</span>
                </div>
                <div className="info-item">
                  <label>Programa:</label>
                  <span>{getProgramaNombre()}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{userData?.email}</span>
                </div>
                <div className="info-item">
                  <label>Estado de Cuenta:</label>
                  <span
                    className={`status ${
                      userData?.verificado ? "verified" : "pending"
                    }`}
                  >
                    {userData?.verificado
                      ? "✅ Verificada"
                      : "⏳ Pendiente de verificación"}
                  </span>
                </div>
                <div className="info-item">
                  <label>Fecha de Registro:</label>
                  <span>
                    {userData?.fecha_registro
                      ? formatDate(userData.fecha_registro)
                      : "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <label>Último Login:</label>
                  <span>
                    {userData?.ultimo_login
                      ? formatDate(userData.ultimo_login)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && userData && (
            <div className="tab-content">
              <h2>Historial de Préstamos</h2>
              <UserLoansHistory userId={userData.id} />
            </div>
          )}

          {/* ✅ NUEVA PESTAÑA - AGREGAR ESTO */}
          {activeTab === "solicitudes" && userData && (
            <div className="tab-content">
              <h2>Mis Solicitudes de Préstamo</h2>
              <UserLoanRequests userId={userData.id} />
            </div>
          )}

          {activeTab === "stats" && userData && (
            <div className="tab-content">
              <h2>Estadísticas de Uso</h2>
              <UserStats userId={userData.id} statsData={stats} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
