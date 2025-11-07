// src/pages/UserRegister.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProgramas } from "../hooks/useProgramas";
import "./UserAuth.css"; // Crearemos este CSS después

const UserRegister = () => {
  const { register, loading, error, clearError } = useAuth();
  const { programas, loading: programasLoading } = useProgramas(); // ✅ NUEVO
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre_completo: "",
    numero_cedula: "",
    numero_telefono: "",
    programa_id: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Preparar datos para enviar (sin confirmPassword)
    const { confirmPassword, ...userData } = formData;

    const result = await register(userData);

    if (result.success) {
      alert("✅ " + result.message);
      navigate("/user/login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Crear Cuenta de Usuario</h2>
          <p>Regístrate para gestionar tus préstamos</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              id="nombre_completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder=" "
            />
            <label htmlFor="nombre_completo" className="floating-label">
              Nombre Completo *
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="numero_cedula"
                name="numero_cedula"
                value={formData.numero_cedula}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder=" "
              />
              <label htmlFor="numero_cedula" className="floating-label">
                Cédula *
              </label>
            </div>

            <div className="form-group">
              <input
                type="tel"
                id="numero_telefono"
                name="numero_telefono"
                value={formData.numero_telefono}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder=" "
              />
              <label htmlFor="numero_telefono" className="floating-label">
                Teléfono *
              </label>
            </div>
          </div>

          <div className="form-group">
            <select
              id="programa_id"
              name="programa_id"
              value={formData.programa_id}
              onChange={handleChange}
              required
              disabled={loading || programasLoading}
            >
              <option value="">Selecciona tu programa</option>
              {programas.map((programa) => (
                <option key={programa.id} value={programa.id}>
                  {" "}
                  {/* ✅ Cambiado de programa.nombre a programa.id */}
                  {programa.nombre}
                </option>
              ))}
            </select>
            <label htmlFor="programa_id" className="floating-label">
              {" "}
              {/* ✅ Cambiado a programa_id */}
              Programa Académico *
            </label>
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
            />
            <label htmlFor="email" className="floating-label">
              Email *
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength="6"
                placeholder=" "
              />
              <label htmlFor="password" className="floating-label">
                Contraseña *
              </label>
              <small>Mínimo 6 caracteres</small>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder=" "
              />
              <label htmlFor="confirmPassword" className="floating-label">
                Confirmar Contraseña
              </label>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/user/login">Inicia Sesión</Link>
          </p>
          <p>
            <Link to="/">← Volver al Inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
