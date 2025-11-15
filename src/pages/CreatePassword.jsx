// src/pages/CreatePassword.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import logo from "../assets/logo1.svg";
import './UserAuth.css';

// Configuración de la URL base
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const CreatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verificar si el token es válido al cargar la página
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-token/${token}`);
      const result = await response.json();
      
      if (result.success) {
        setTokenValid(true);
        setUserEmail(result.data.email);
      } else {
        setTokenValid(false);
        setMessage('❌ Enlace inválido o expirado');
      }
    } catch (error) {
      setTokenValid(false);
      setMessage('❌ Error de conexión');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/create-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: formData.password
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ ' + result.message);
        setTimeout(() => {
          navigate('/user/login');
        }, 2000); // Redirige después de 2 segundos
      } else {
        setMessage('❌ ' + result.message);
      }
    } catch (error) {
      setMessage('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (tokenValid === null) {
    return (
      <div className="auth-page">
        <div className="form-card">
          <div className="auth-header">
            <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
            <div className="header-text">
              <h3 className="visual-title">UCC LOANS</h3>
              <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader2 size={48} className="loading-spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block', color: 'var(--primary-color)' }} />
            <p style={{ fontSize: '1.1rem', margin: '0', color: 'var(--text-dark)' }}>Verificando enlace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="auth-page">
        <div className="form-card">
          <div className="auth-header">
            <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
            <div className="header-text">
              <h3 className="visual-title">UCC LOANS</h3>
              <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
            </div>
          </div>
          <div className="error-message" style={{ textAlign: 'center' }}>
            <XCircle size={48} style={{ margin: '0 auto 1rem', display: 'block', color: '#9c1c1c' }} />
            <h3 style={{ margin: '0 0 1rem 0', color: '#9c1c1c' }}>Enlace Inválido</h3>
            <p style={{ margin: '0 0 1.5rem 0' }}>{message}</p>
            <Link to="/user/login" className="auth-button" style={{ display: 'block', textAlign: 'center' }}>
              Ir al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="form-card">
        <div className="auth-header">
          <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
          <div className="header-text">
            <h3 className="visual-title">UCC LOANS</h3>
            <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
          </div>
          
          <h2>Crear Contraseña</h2>
          <p>Hola, establece tu contraseña para activar tu cuenta</p>
          {userEmail && (
            <p style={{ color: 'var(--primary-color)', fontSize: '0.9rem', margin: '0.5rem 0 0 0', fontWeight: '600' }}>
              Cuenta: {userEmail}
            </p>
          )}
        </div>

        {message && (
          <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
            {message.includes('✅') && <CheckCircle size={20} style={{ marginRight: '0.5rem' }} />}
            {message.includes('❌') && <XCircle size={20} style={{ marginRight: '0.5rem' }} />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group has-password">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
              placeholder=" "
              minLength="6"
            />
            <label className="floating-label">Nueva Contraseña *</label>
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="form-group has-password">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              disabled={loading}
              placeholder=" "
            />
            <label className="floating-label">Confirmar Contraseña *</label>
            <button
              type="button"
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="loading-spinner" />
                Creando contraseña...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Activar Cuenta y Crear Contraseña
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/user/login">← Volver al Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;