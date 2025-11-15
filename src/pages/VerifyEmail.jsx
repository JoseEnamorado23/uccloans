// src/pages/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './UserAuth.css';

// Configuración de la URL base
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmailToken();
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      // ✅ USAR API_BASE_URL en lugar de localhost
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email/${token}`);
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        // Redirigir automáticamente después de 3 segundos
        setTimeout(() => {
          navigate('/user/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión al verificar el email');
      console.error('Error verificando email:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Verificación de Email</h2>
        </div>

        {status === 'loading' && (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Verificando tu email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="success-message">
            <h3>✅ ¡Email Verificado Exitosamente!</h3>
            <p>{message}</p>
            <p>Serás redirigido al login en unos segundos...</p>
            <Link to="/user/login" className="auth-button" style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>
              Ir al Login Ahora
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="error-message">
            <h3>❌ Error de Verificación</h3>
            <p>{message}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Link to="/user/register" className="auth-button" style={{flex: 1, textAlign: 'center', background: '#666'}}>
                Volver al Registro
              </Link>
              <Link to="/user/login" className="auth-button" style={{flex: 1, textAlign: 'center'}}>
                Intentar Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;