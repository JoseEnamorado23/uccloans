// src/pages/UserLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  LogIn as LogInIcon
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo1.svg";
import "./UserAuth.css";

const UserLogin = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    if (result?.success) {
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
    <div className="auth-page">
      <div className="form-card">
        {/* Header con logo y título */}
        <div className="auth-header">
          <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
          <h3 className="visual-title">UCC LOANS</h3>
          <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
          
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de usuario</p>
        </div>

        {error && <div className="error-message" role="alert">❌ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
          <div className="form-group icon-group">
            <span className="input-icon"><MailIcon size={18} /></span>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder=" "
              autoComplete="email"
              aria-label="Email"
            />
            <label htmlFor="email" className="floating-label">Email</label>
          </div>

          <div className="form-group icon-group">
            <span className="input-icon"><LockIcon size={18} /></span>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder=" "
              autoComplete="current-password"
              aria-label="Contraseña"
            />
            <label htmlFor="password" className="floating-label">Contraseña</label>
          </div>

          <div className="form-options">
            <Link to="/user/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Iniciando Sesión..." : (
              <>
                <LogInIcon size={16} />
                Iniciar Sesión
              </>
            )}
          </button>

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
          
          <div className="auth-divider" aria-hidden="true">
            <span>O</span>
          </div>

          <p>
            ¿Eres administrador? <Link to="/admin">Accede al panel admin</Link>
          </p>
          
          <p>
            <Link to="/">← Volver al Inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;