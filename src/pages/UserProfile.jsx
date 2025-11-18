// src/pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { userProfileService } from "../services/userProfileService";
import UserLoansHistory from "../components/UserProfile/UserLoansHistory";
import UserStats from "../components/UserProfile/UserStats";
import UserImplementos from "../components/UserProfile/UserImplementos";
import {
  Menu,
  User,
  History,
  Wrench,
  BarChart3,
  LogOut,
  BookOpen,
  Clock,
  Calendar,
  ChevronDown,
  Mail,
  Phone,
  IdCard,
  CheckCircle,
} from "lucide-react";
import "./UserProfile.css";
import logo from "../assets/logo1.svg";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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

  // Items de navegación para usuario
  const menuItems = [
    {
      id: "profile",
      icon: User,
      text: "Información Personal",
    },
    {
      id: "implementos",
      icon: Wrench,
      text: "Implementos Disponibles",
    },
    {
      id: "history",
      icon: History,
      text: "Historial de Préstamos",
    },
    {
      id: "stats",
      icon: BarChart3,
      text: "Estadísticas",
    },
  ];

  if (loading && !userData) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-loading">
          <div className="user-profile-loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      {/* Sidebar */}
      <div
        className={`user-profile-sidebar ${
          sidebarOpen
            ? "user-profile-sidebar-open"
            : "user-profile-sidebar-closed"
        }`}
      >
        {/* Header del Sidebar */}
        <div className="user-profile-sidebar-header">
          <Menu
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="user-profile-menu-icon"
            size={20}
          />
          {sidebarOpen && (
            <div className="user-profile-logo-container">
              <div className="user-profile-logo-svg-container">
                <img
                  src={logo}
                  alt="UCC LOANS Logo"
                  className="user-profile-logo-svg"
                />
              </div>
              <div className="user-profile-logo-text-container">
                <span className="user-profile-logo-text">UCC LOANS</span>
                <span className="user-profile-logo-subtitle">Usuario</span>
              </div>
            </div>
          )}
        </div>

        {/* Navegación principal */}
        <nav className="user-profile-sidebar-nav">
          <ul className="user-profile-nav-list">
            {menuItems.map(({ id, icon: Icon, text }) => (
              <li key={id} className="user-profile-nav-item">
                <button
                  className={`user-profile-nav-link ${
                    activeTab === id ? "user-profile-nav-link-active" : ""
                  }`}
                  onClick={() => handleTabChange(id)}
                >
                  <Icon size={18} className="user-profile-nav-icon" />
                  {sidebarOpen && (
                    <span className="user-profile-nav-text">{text}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Contenido Principal */}
      <main className={`user-profile-main ${sidebarOpen ? '' : 'user-profile-main-expanded'}`}>
        {/* Top Header con información de usuario */}
        <header className="user-profile-top-header">
          {/* Logo en móvil - Parte superior izquierda */}
          <div className="user-profile-mobile-logo">
            <div className="user-profile-mobile-logo-container">
              <img
                src={logo}
                alt="UCC LOANS Logo"
                className="user-profile-mobile-logo-svg"
              />
              <span className="user-profile-mobile-logo-text">UCC LOANS</span>
            </div>
          </div>

          <div className="user-profile-header-content">
            <div className="user-profile-header-title">
              <h1>
                {activeTab === "profile" && "Información Personal"}
                {activeTab === "implementos" && "Implementos Disponibles"}
                {activeTab === "history" && "Historial de Préstamos"}
                {activeTab === "stats" && "Estadísticas de Uso"}
              </h1>
              <p>Gestiona tu información y préstamos</p>
            </div>

            {/* User Dropdown */}
            <div className="user-profile-dropdown-container">
              <button
                className="user-profile-dropdown-trigger"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="user-profile-avatar-small">
                  {user?.nombre_completo?.charAt(0) || "U"}
                </div>
                <ChevronDown size={16} />
              </button>

              {showUserDropdown && (
                <div className="user-profile-dropdown">
                  <div className="user-profile-dropdown-header">
                    <div className="user-profile-avatar-medium">
                      {user?.nombre_completo?.charAt(0) || "U"}
                    </div>
                    <div className="user-profile-info">
                      <div className="user-profile-name">
                        {user?.nombre_completo}
                      </div>
                      <div className="user-profile-email">{user?.email}</div>
                      <div className="user-profile-program">
                        <BookOpen size={12} />
                        {getProgramaNombre()}
                      </div>
                    </div>
                  </div>

                  <div className="user-profile-stats-dropdown">
                    <div className="user-profile-stat">
                      <div className="user-profile-stat-value">
                        {userData?.horas_totales_acumuladas || 0}
                      </div>
                      <div className="user-profile-stat-label">
                        Horas Acumuladas
                      </div>
                    </div>
                    <div className="user-profile-stat">
                      <div className="user-profile-stat-value">
                        {userData?.total_prestamos || 0}
                      </div>
                      <div className="user-profile-stat-label">
                        Préstamos Totales
                      </div>
                    </div>
                  </div>

                  <div className="user-profile-dropdown-info">
                    <div className="user-profile-info-item">
                      <IdCard size={14} />
                      <span>{userData?.numero_cedula}</span>
                    </div>
                    <div className="user-profile-info-item">
                      <Phone size={14} />
                      <span>{userData?.numero_telefono}</span>
                    </div>
                    <div className="user-profile-info-item">
                      <Calendar size={14} />
                      <span>
                        {userData?.fecha_registro
                          ? formatDate(userData.fecha_registro)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="user-profile-info-item status">
                      <CheckCircle size={14} />
                      <span
                        className={`${
                          userData?.verificado
                            ? "user-profile-status-verified"
                            : "user-profile-status-pending"
                        }`}
                      >
                        {userData?.verificado
                          ? "Cuenta Verificada"
                          : "Pendiente de Verificación"}
                      </span>
                    </div>
                  </div>

                  {/* BOTÓN DE LOGOUT EN DROPDOWN */}
                  <button
                    className="user-profile-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido de las pestañas */}
        <div className="user-profile-tab-content-container">
          {activeTab === "profile" && (
            <div className="user-profile-tab-content">
              <h2>Detalles de la Cuenta</h2>
              <div className="user-profile-info-grid">
                <div className="user-profile-info-item-detailed">
                  <div className="user-profile-info-icon">
                    <User size={18} />
                  </div>
                  <div className="user-profile-info-content">
                    <label>Nombre Completo</label>
                    <span>{userData?.nombre_completo}</span>
                  </div>
                </div>

                <div className="user-profile-info-item-detailed">
                  <div className="user-profile-info-icon">
                    <IdCard size={18} />
                  </div>
                  <div className="user-profile-info-content">
                    <label>Número de Cédula</label>
                    <span>{userData?.numero_cedula}</span>
                  </div>
                </div>

                <div className="user-profile-info-item-detailed">
                  <div className="user-profile-info-icon">
                    <Phone size={18} />
                  </div>
                  <div className="user-profile-info-content">
                    <label>Teléfono</label>
                    <span>{userData?.numero_telefono}</span>
                  </div>
                </div>

                <div className="user-profile-info-item-detailed">
                  <div className="user-profile-info-icon">
                    <BookOpen size={18} />
                  </div>
                  <div className="user-profile-info-content">
                    <label>Programa Académico</label>
                    <span>{getProgramaNombre()}</span>
                  </div>
                </div>

                <div className="user-profile-info-item-detailed">
                  <div className="user-profile-info-icon">
                    <Mail size={18} />
                  </div>
                  <div className="user-profile-info-content">
                    <label>Email</label>
                    <span>{userData?.email}</span>
                  </div>
                </div>

                <div className="user-profile-info-item-detailed">
                  <div className="user-profile-info-icon">
                    <CheckCircle size={18} />
                  </div>
                  <div className="user-profile-info-content">
                    <label>Estado de Cuenta</label>
                    <span
                      className={`${
                        userData?.verificado
                          ? "user-profile-status-verified"
                          : "user-profile-status-pending"
                      }`}
                    >
                      {userData?.verificado
                        ? "✅ Verificada"
                        : "⏳ Pendiente de verificación"}
                    </span>
                  </div>
                </div>

                <div className="user-profile-info-item-detailed">
                  <div className="user-profile-info-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="user-profile-info-content">
                    <label>Fecha de Registro</label>
                    <span>
                      {userData?.fecha_registro
                        ? formatDate(userData.fecha_registro)
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="user-profile-info-item-detailed">
                  <div className="user-profile-info-icon">
                    <Clock size={18} />
                  </div>
                  <div className="user-profile-info-content">
                    <label>Último Login</label>
                    <span>
                      {userData?.ultimo_login
                        ? formatDate(userData.ultimo_login)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "implementos" && (
            <div className="user-profile-tab-content">
              <UserImplementos />
            </div>
          )}

          {activeTab === "history" && userData && (
            <div className="user-profile-tab-content">
              <h2>Historial de Préstamos Realizados</h2>
              <UserLoansHistory userId={userData.id} />
            </div>
          )}

          {activeTab === "stats" && userData && (
            <div className="user-profile-tab-content">
              <h2>Estadísticas de Uso</h2>
              <UserStats userId={userData.id} statsData={stats} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;