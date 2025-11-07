import React, { useState, useEffect } from "react";
import { authService } from "../services/authService";
import styles from "./AdminLoginPage.module.css";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  // Obtener token CSRF al cargar la página
  useEffect(() => {
    const getCSRFToken = async () => {
      try {
        const token = await authService.getCSRFToken();
        setCsrfToken(token);
      } catch (error) {
        console.warn('No se pudo obtener token CSRF:', error);
      }
    };
    getCSRFToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.adminLogin(formData);
      console.log("✅ Respuesta del login:", response);

      if (response.success) {
        console.log("🔄 Redirigiendo a /dashboard...");
        // Redirigir usando window.location para asegurar que las cookies se envíen
        window.location.href = "/dashboard";
      } else {
        setError(response.message || "Error en el login");
      }
    } catch (err) {
      console.log("❌ Error completo:", err);
      
      // Manejar diferentes tipos de errores
      if (err.message?.includes('Demasiados intentos')) {
        setError("Demasiados intentos de login. Espera 15 minutos antes de intentar nuevamente.");
      } else {
        setError(err.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h2>Acceso Administrador</h2>
          <p>Sistema de Préstamos Universitarios</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Token CSRF oculto */}
          {csrfToken && (
            <input type="hidden" name="_csrf" value={csrfToken} />
          )}
          
          <div className={styles.inputGroup}>
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
