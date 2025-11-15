// src/pages/UserLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Mail, LogIn } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo1.svg"; // ajusta ruta si es necesario
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
      // Mensaje simple (puedes reemplazar por toast)
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
      {/* Columna visual (imagen + logo). Deja aquí el espacio para pegar la imagen) */}
      <aside className="auth-visual" aria-hidden={false}>
        <div className="visual-top">
          <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
          <h3 className="visual-title">UCC LOANS</h3>
          <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
        </div>

        <div className="visual-illustration" id="visual-illustration">
          {/* ---- ESPACIO PARA COLOCAR TU IMAGEN ----
              Opciones:
              1) Reemplaza este div por:
                 <img src={require('../assets/tu-imagen.jpg')} alt="..." />
              2) O importa la imagen arriba (import Ill from '../assets/ill.jpg') y usa:
                 <img src={Ill} alt="Ilustración" />
              3) También puedes usar background-image vía CSS apuntando a #visual-illustration
          */}
          <div className="visual-placeholder">
            {/* Aquí puedes insertar la imagen luego */}
            <span>Tu imagen / ilustración</span>
          </div>
        </div>

        <footer className="visual-footer">
          <small>Hecho para la comunidad UCC</small>
        </footer>
      </aside>

      {/* Columna del formulario */}
      <main className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Iniciar Sesión</h2>
            <p>Accede a tu cuenta de usuario</p>
          </div>

          {error && <div className="error-message" role="alert">❌ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
            <div className="form-row">
              {/* Si quieres dos campos en fila, usa form-row */}
            </div>

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
                autoComplete="email"
                aria-label="Email"
              />
              <label htmlFor="email" className="floating-label">
                Email
              </label>
              <small className="sr-only">Usa tu correo institucional</small>
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
                autoComplete="current-password"
                aria-label="Contraseña"
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

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
            </button>

            {/* Botón demo solo en desarrollo */}
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
    </div>
  );
};

export default UserLogin;
