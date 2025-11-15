// src/pages/CreatePassword.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

  // Verificar si el token es válido al cargar la página
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      // ✅ USAR API_BASE_URL en lugar de localhost
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
      // ✅ USAR API_BASE_URL en lugar de localhost
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
        }, 3000);
      } else {
        setMessage('❌ ' + result.message);
      }
    } catch (error) {
      setMessage('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Verificando enlace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-message">
            <h3>❌ Enlace Inválido</h3>
            <p>{message}</p>
            <Link to="/user/login" className="auth-button" style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>
              Ir al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Crear Contraseña</h2>
          <p>Hola, establece tu contraseña para activar tu cuenta</p>
          {userEmail && (
            <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>
              Cuenta: {userEmail}
            </p>
          )}
        </div>

        {message && (
          <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
              placeholder=" "
              minLength="6"
            />
            <label className="floating-label">Nueva Contraseña *</label>
            <small>Mínimo 6 caracteres</small>
          </div>

          <div className="form-group">
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              disabled={loading}
              placeholder=" "
            />
            <label className="floating-label">Confirmar Contraseña *</label>
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? (
              <div className="button-loading">
                <span className="loading-spinner-small"></span>
                Creando contraseña...
              </div>
            ) : (
              '✅ Activar Cuenta y Crear Contraseña'
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