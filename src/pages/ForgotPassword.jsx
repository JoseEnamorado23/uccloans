// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) clearError();
                if (message) setMessage('');
              }}
              required
              disabled={loading}
              placeholder="tu.email@ejemplo.com"
            />
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