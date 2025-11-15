// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail as MailIcon } from 'lucide-react';
import logo from "../assets/logo1.svg";
import './UserAuth.css';

const ForgotPassword = () => {
  const { forgotPassword, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      setMessage(result.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) clearError();
    if (message) setMessage('');
  };

  return (
    <div className="auth-page">
      <div className="form-card">
        <div className="auth-header">
          <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
          <div className="header-text">
            <h3 className="visual-title">UCC LOANS</h3>
            <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
          </div>
          
          <h2>Recuperar Contraseña</h2>
          <p>Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            ✅ {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading}
              placeholder=" "
              autoComplete="email"
            />
            <label htmlFor="email" className="floating-label">
              Email *
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/user/login">← Volver al Login</Link>
          </p>
          <p>
            ¿No tienes cuenta? <Link to="/user/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;