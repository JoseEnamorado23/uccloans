// src/pages/UserLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserImplementos from '../components/UserProfile/UserImplementos';
import { useAuth } from "../hooks/useAuth";
import "./UserAuth.css";

const UserLogin = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Obtener la ruta a la que redirigir después del login
  const from = location.state?.from?.pathname || "/user/profile";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    if (result.success) {
      alert("✅ ¡Bienvenido de vuelta!");
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "ana.test@ejemplo.com",
      password: "123456",
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de usuario</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder=" "
            />
            <label htmlFor="email" className="floating-label">
              Email
            </label>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder=" "
            />
            <label htmlFor="password" className="floating-label">
              Contraseña
            </label>
          </div>

          <div className="form-options">
            <Link to="/user/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
          </button>

          {/* Botón de demo solo en desarrollo */}
          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              className="demo-button"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              🚀 Cargar Datos de Demo
            </button>
          )}
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta? <Link to="/user/register">Regístrate aquí</Link>
          </p>
          <p>
            <Link to="/">← Volver al Inicio</Link>
          </p>
          <div className="auth-divider">
            <span>O</span>
          </div>
          <p>
            ¿Eres administrador? <Link to="/admin">Accede al panel admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
