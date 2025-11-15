// src/pages/UserRegister.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useProgramas } from "../hooks/useProgramas";
import logo from "../assets/logo1.svg";
import "./UserAuth.css";

const UserRegister = () => {
  const { register, loading, error, clearError } = useAuth();
  const { programas, loading: programasLoading } = useProgramas();
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      alert("✅ " + result.message);
      navigate("/user/login");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-page">
      <div className="form-card">
        <div className="auth-header">
          <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
          <h3 className="visual-title">UCC LOANS</h3>
          <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
          
          <h2>Crear Cuenta</h2>
          <p>Regístrate para gestionar tus préstamos</p>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Nombre Completo */}
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
            {/* Cédula */}
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

            {/* Teléfono */}
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

          {/* Programa Académico */}
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
                  {programa.nombre}
                </option>
              ))}
            </select>
            <label htmlFor="programa_id" className="floating-label">
              Programa Académico *
            </label>
          </div>

          {/* Email */}
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
            {/* Contraseña */}
            <div className="form-group has-password">
              <input
                type={showPassword ? "text" : "password"}
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
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirmar Contraseña */}
            <div className="form-group has-password">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder=" "
              />
              <label htmlFor="confirmPassword" className="floating-label">
                Confirmar Contraseña *
              </label>
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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