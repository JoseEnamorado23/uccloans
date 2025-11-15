// src/pages/UserLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User as UserIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  LogIn as LogInIcon
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo1.svg"; // ajusta la ruta si hace falta
import "./UserAuth.css";

const UserLogin = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Ruta a la que redirigir después del login
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
      {/* IZQUIERDA: Form centrado */}
      <main className="auth-left">
        <div className="auth-card form-card" role="region" aria-label="Formulario de inicio de sesión">
          <div className="auth-header">
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
                  <LogInIcon size={16} style={{ marginRight: 8 }} />
                  Iniciar Sesión
                </>
              )}
            </button>

            {/* Botón demo solo en development */}
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

            <div className="auth-divider" aria-hidden="true">
              <span>O</span>
            </div>

            <p>
              ¿Eres administrador? <Link to="/admin">Accede al panel admin</Link>
            </p>
          </div>
        </div>
      </main>

      {/* DERECHA: Área visual (logo + texto) */}
      <aside className="auth-right" aria-hidden="false">
        <div className="visual-top">
          <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
          <h3 className="visual-title">UCC LOANS</h3>
          <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
        </div>

        <div className="visual-extra">
          {/* Aquí puedes agregar elementos visuales sencillos (illustration CSS shapes, texto, etc.) */}
          <div className="visual-cards">
            <div className="vc">
              <UserIcon size={20} />
              <div>
                <strong>Rápido</strong>
                <small>Solicita en pocos pasos</small>
              </div>
            </div>
            <div className="vc">
              <MailIcon size={20} />
              <div>
                <strong>Seguro</strong>
                <small>Validación de correo institucional</small>
              </div>
            </div>
            <div className="vc">
              <LockIcon size={20} />
              <div>
                <strong>Responsable</strong>
                <small>Control de devoluciones</small>
              </div>
            </div>
          </div>
        </div>

        <footer className="visual-footer">
          <small>Hecho para la comunidad UCC</small>
        </footer>
      </aside>
    </div>
  );
};

export default UserLogin;
