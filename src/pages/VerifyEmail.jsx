// src/pages/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import logo from "../assets/logo1.svg";
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
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email/${token}`);
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
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
    <div className="auth-page">
      <div className="form-card">
        <div className="auth-header">
          <img src={logo} alt="UCC LOANS Logo" className="visual-logo" />
          <div className="header-text">
            <h3 className="visual-title">UCC LOANS</h3>
            <p className="visual-sub">Gestión de implementos de bienestar universitario</p>
          </div>
          
          <h2>Verificación de Email</h2>
        </div>

        {status === 'loading' && (
          <div className="loading-message" style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader2 size={48} className="loading-spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block', color: 'var(--primary-color)' }} />
            <p style={{ fontSize: '1.1rem', margin: '0', color: 'var(--text-dark)' }}>Verificando tu email...</p>
            <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(0,0,0,0.6)' }}>Por favor espera un momento.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="success-message" style={{ textAlign: 'center' }}>
            <CheckCircle size={48} style={{ margin: '0 auto 1rem', display: 'block', color: '#2d5e3b' }} />
            <h3 style={{ margin: '0 0 1rem 0', color: '#2d5e3b' }}>¡Email Verificado Exitosamente!</h3>
            <p style={{ margin: '0 0 1rem 0' }}>{message}</p>
            <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(0,0,0,0.6)' }}>Serás redirigido al login en unos segundos...</p>
            <Link to="/user/login" className="auth-button" style={{ display: 'block', textAlign: 'center' }}>
              Ir al Login Ahora
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="error-message" style={{ textAlign: 'center' }}>
            <XCircle size={48} style={{ margin: '0 auto 1rem', display: 'block', color: '#9c1c1c' }} />
            <h3 style={{ margin: '0 0 1rem 0', color: '#9c1c1c' }}>Error de Verificación</h3>
            <p style={{ margin: '0 0 1.5rem 0' }}>{message}</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              <Link to="/user/register" className="auth-button" style={{ background: '#666', textAlign: 'center' }}>
                Volver al Registro
              </Link>
              <Link to="/user/login" className="auth-button" style={{ textAlign: 'center' }}>
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