// src/pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { userProfileService } from "../services/userProfileService";
import UserLoansHistory from "../components/UserProfile/UserLoansHistory";
import UserStats from "../components/UserProfile/UserStats";
import UserImplementos from "../components/UserProfile/UserImplementos";
import UserLoanRequests from "../components/UserProfile/UserLoanRequests";
import { 
  FaUser, 
  FaHistory, 
  FaTools, 
  FaChartBar, 
  FaSignOutAlt,
  FaBook,
  FaClock,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaIdCard
} from "react-icons/fa";
import { 
  MdEmail, 
  MdPhone, 
  MdPerson, 
  MdSchool,
  MdCalendarToday
} from "react-icons/md";
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

  // Items de navegación
  const navItems = [
    { id: "profile", icon: FaUser, label: "Información Personal" },
    { id: "implementos", icon: FaTools, label: "Implementos" },
    { id: "history", icon: FaHistory, label: "Historial" },
    { id: "stats", icon: FaChartBar, label: "Estadísticas" }
  ];

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
      {/* Sidebar */}
      <div className="profile-sidebar">
        {/* Header del Sidebar */}
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="UCC LOANS" className="logo-svg" />
            <span className="logo-text">UCC LOANS</span>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="user-info-sidebar">
          <div className="user-avatar">
            {user?.nombre_completo?.charAt(0) || "U"}
          </div>
          <h3 className="user-name">{user?.nombre_completo}</h3>
          <p className="user-email">{user?.email}</p>
          <p className="user-program">
            <MdSchool style={{ marginRight: '4px' }} />
            {getProgramaNombre()}
          </p>
          
          <div className="user-stats-sidebar">
            <div className="stat-sidebar">
              <span className="stat-value-sidebar">
                {userData?.horas_totales_acumuladas || 0}
              </span>
              <span className="stat-label-sidebar">Horas</span>
            </div>
            <div className="stat-sidebar">
              <span className="stat-value-sidebar">
                {userData?.total_prestamos || 0}
              </span>
              <span className="stat-label-sidebar">Préstamos</span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <IconComponent className="nav-icon" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="profile-main">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información y préstamos</p>
        </div>

        {activeTab === "profile" && (
          <div className="tab-content">
            <h2>Información Personal</h2>
            <div className="info-grid">
              <div className="info-item">
                <label><MdPerson style={{ marginRight: '4px' }} /> Nombre Completo</label>
                <span>{userData?.nombre_completo}</span>
              </div>
              <div className="info-item">
                <label><FaIdCard style={{ marginRight: '4px' }} /> Número de Cédula</label>
                <span>{userData?.numero_cedula}</span>
              </div>
              <div className="info-item">
                <label><MdPhone style={{ marginRight: '4px' }} /> Teléfono</label>
                <span>{userData?.numero_telefono}</span>
              </div>
              <div className="info-item">
                <label><MdSchool style={{ marginRight: '4px' }} /> Programa</label>
                <span>{getProgramaNombre()}</span>
              </div>
              <div className="info-item">
                <label><MdEmail style={{ marginRight: '4px' }} /> Email</label>
                <span>{userData?.email}</span>
              </div>
              <div className="info-item">
                <label><FaCheckCircle style={{ marginRight: '4px' }} /> Estado de Cuenta</label>
                <span className={`status ${userData?.verificado ? "verified" : "pending"}`}>
                  {userData?.verificado ? "✅ Verificada" : "⏳ Pendiente"}
                </span>
              </div>
              <div className="info-item">
                <label><MdCalendarToday style={{ marginRight: '4px' }} /> Fecha de Registro</label>
                <span>
                  {userData?.fecha_registro
                    ? formatDate(userData.fecha_registro)
                    : "N/A"}
                </span>
              </div>
              <div className="info-item">
                <label><FaClock style={{ marginRight: '4px' }} /> Último Login</label>
                <span>
                  {userData?.ultimo_login
                    ? formatDate(userData.ultimo_login)
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
      </main>
    </div>
  );
};

export default UserProfile;