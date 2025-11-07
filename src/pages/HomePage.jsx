import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Sistema de Préstamos Universitarios</h1>
        <p>Gestión de implementos de bienestar para la comunidad universitaria</p>
        
        <div className="home-actions">
          <Link to="/admin" className="admin-btn">
            👨‍💼 Acceso Administrador
          </Link>
          <Link to="/user/login" className="user-btn">
            👤 Acceso Usuarios
          </Link>
          <Link to="/user/register" className="register-btn">
            📝 Registrarse
          </Link>
        </div>

        {/* Nueva sección de información */}
        <div className="home-info">
          <div className="info-card">
            <h3>👤 Para Usuarios</h3>
            <p>Regístrate y gestiona tus préstamos de implementos deportivos</p>
            <ul>
              <li>✅ Solicitar préstamos en línea</li>
              <li>✅ Ver tu historial y horas acumuladas</li>
              <li>✅ Consultar disponibilidad en tiempo real</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>👨‍💼 Para Administradores</h3>
            <p>Gestiona el sistema completo de préstamos</p>
            <ul>
              <li>📊 Dashboard en tiempo real</li>
              <li>📝 Registrar nuevos préstamos</li>
              <li>⚙️ Gestionar inventario</li>
              <li>📈 Reportes y estadísticas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;