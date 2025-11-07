import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Menu, ChevronDown, Plus, Handshake, Wrench, 
  CheckCircle, Users, BookOpen, BarChart3 
} from "lucide-react";
import "./Sidebar.css";
import logo from "../../assets/logo1.svg";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { 
      to: "/dashboard/", 
      end: true,
      icon: Plus, 
      text: "Nuevo Préstamo" 
    },
    { 
      to: "/dashboard/prestamos", 
      icon: Handshake, 
      text: "Préstamos" 
    },
    { 
      to: "/dashboard/implementos", 
      icon: Wrench, 
      text: "Implementos" 
    },
    { 
      to: "/dashboard/activos", 
      icon: CheckCircle, 
      text: "Activos" 
    },
    { 
      to: "/dashboard/gestion-usuarios", 
      icon: Users, 
      text: "Gestión de Usuarios" 
    },
    { 
      to: "/dashboard/gestion-programas", 
      icon: BookOpen, 
      text: "Programas Académicos" 
    },
    { 
      to: "/dashboard/reportes", 
      icon: BarChart3, 
      text: "Reportes" 
    }
  ];

  return (
    <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Logo y botón de menú */}
      <div className="sidebar-header">
        <Menu 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="menu-icon" 
          size={20}
        />
        {sidebarOpen && (
          <div className="logo-container">
            <div className="logo-svg-container">
              <img 
                src={logo}
                alt="UCC LOANS Logo" 
                className="logo-svg"
              />
            </div>
            <div className="logo-text-container">
              <span className="logo-text">UCC LOANS</span>
              <span className="logo-subtitle">Keep Calm Medium</span>
            </div>
          </div>
        )}
      </div>

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(({ to, end, icon: Icon, text }) => (
            <li key={text} className="nav-item">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
              >
                <Icon size={18} className="nav-icon" />
                {sidebarOpen && <span className="nav-text">{text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer simplificado */}
      <div className="sidebar-footer">
        {sidebarOpen && (
          <div className="more-option">
            <span className="more-text">
              Más <ChevronDown size={16} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;