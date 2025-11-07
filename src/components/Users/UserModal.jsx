// src/components/Users/UserModal.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from "react";
import API from "../../services/api";
import "./UserModal.css";

const UserModal = ({ user, mode = "view", programas = [], onClose, onSave }) => {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    if (user && mode === "view") {
      loadUserStats();
    }
  }, [user, mode]);

  const loadUserStats = async () => {
    try {
      const response = await API.get(`/api/users/${user.id}`);
      if (response.data.success) {
        setUserStats(response.data.data);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      !userData.nombre_completo ||
      !userData.numero_telefono ||
      !userData.programa_id
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      await onSave(user.id, {
        nombre_completo: userData.nombre_completo,
        numero_telefono: userData.numero_telefono,
        programa_id: userData.programa_id,
        email: userData.email || null,
      });
    } catch (error) {
      console.error("Error guardando usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener nombre del programa
  const getProgramaNombre = () => {
    // Primero intenta usar programa_nombre si está disponible
    if (userData.programa_nombre) {
      return userData.programa_nombre;
    }
    
    // Si no, busca en la lista de programas
    if (userData.programa_id && programas.length > 0) {
      const programa = programas.find(p => p.id === userData.programa_id);
      return programa ? programa.nombre : `Programa ${userData.programa_id}`;
    }
    
    // Si no hay nada, muestra el ID
    return userData.programa_id ? `Programa ${userData.programa_id}` : "Sin programa";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="block-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {mode === "view"
              ? "👤 Información del Usuario"
              : "✏️ Editar Usuario"}
          </h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {mode === "view" ? (
            <div className="user-profile">
              {/* Información Básica */}
              <div className="profile-section">
                <h3>📋 Información Básica</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nombre Completo:</label>
                    <span>{userData.nombre_completo}</span>
                  </div>
                  <div className="info-item">
                    <label>Cédula:</label>
                    <span>{userData.numero_cedula}</span>
                  </div>
                  <div className="info-item">
                    <label>Teléfono:</label>
                    <span>{userData.numero_telefono}</span>
                  </div>
                  <div className="info-item">
                    <label>Programa:</label>
                    <span>{getProgramaNombre()}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{userData.email || "No registrado"}</span>
                  </div>
                  <div className="info-item">
                    <label>Estado:</label>
                    <span
                      className={`status ${
                        userData.activo ? "active" : "inactive"
                      }`}
                    >
                      {userData.activo ? "✅ Activo" : "⏸️ Inactivo"}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Verificado:</label>
                    <span className={`status ${userData.verificado ? "active" : "inactive"}`}>
                      {userData.verificado ? "✅ Verificado" : "❌ No verificado"}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Creado por Admin:</label>
                    <span>
                      {userData.creado_por_admin ? "✅ Sí" : "❌ No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              {userStats && (
                <div className="profile-section">
                  <h3>📊 Estadísticas</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Total Préstamos:</span>
                      <span className="stat-value">
                        {userStats.total_prestamos || 0}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Préstamos Devueltos:</span>
                      <span className="stat-value">
                        {userStats.prestamos_devueltos || 0}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Préstamos Activos:</span>
                      <span className="stat-value">
                        {userStats.prestamos_activos || 0}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Préstamos Pendientes:</span>
                      <span className="stat-value">
                        {userStats.prestamos_pendientes || 0}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Horas Acumuladas:</span>
                      <span className="stat-value">
                        {parseFloat(userStats.horas_totales_acumuladas || 0).toFixed(2)}h
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Horas Reales:</span>
                      <span className="stat-value">
                        {parseFloat(userStats.horas_totales_reales || 0).toFixed(2)}h
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Tasa de Devolución:</span>
                      <span className="stat-value">
                        {userStats.total_prestamos > 0 
                          ? `${Math.round((userStats.prestamos_devueltos / userStats.total_prestamos) * 100)}%`
                          : "0%"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Información de Registro */}
              <div className="profile-section">
                <h3>📅 Información de Registro</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Fecha de Registro:</label>
                    <span>
                      {userData.fecha_registro
                        ? formatDate(userData.fecha_registro)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Última Actualización:</label>
                    <span>
                      {userData.fecha_actualizacion
                        ? formatDate(userData.fecha_actualizacion)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Último Login:</label>
                    <span>
                      {userData.ultimo_login
                        ? formatDate(userData.ultimo_login)
                        : "Nunca"}
                    </span>
                  </div>
                  {userData.fecha_bloqueo && (
                    <div className="info-item">
                      <label>Fecha de Bloqueo:</label>
                      <span>{formatDate(userData.fecha_bloqueo)}</span>
                    </div>
                  )}
                  {userData.motivo_bloqueo && (
                    <div className="info-item">
                      <label>Motivo de Bloqueo:</label>
                      <span className="motivo-bloqueo">
                        {userData.motivo_bloqueo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* MODO EDICIÓN */
            <div className="edit-form">
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={userData.nombre_completo || ""}
                  onChange={(e) =>
                    handleInputChange("nombre_completo", e.target.value)
                  }
                  placeholder="Ingresa el nombre completo"
                />
              </div>

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="text"
                  value={userData.numero_telefono || ""}
                  onChange={(e) =>
                    handleInputChange("numero_telefono", e.target.value)
                  }
                  placeholder="Ingresa el número de teléfono"
                />
              </div>

              {/* SELECT DE PROGRAMAS */}
              <div className="form-group">
                <label>Programa *</label>
                <select
                  value={userData.programa_id || ""}
                  onChange={(e) =>
                    handleInputChange("programa_id", e.target.value)
                  }
                >
                  <option value="">Selecciona un programa</option>
                  {programas.map((programa) => (
                    <option key={programa.id} value={programa.id}>
                      {programa.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ingresa el email (opcional)"
                />
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "💾 Guardar Cambios"}
                </button>
              </div>
            </div>
          )}
        </div>

        {mode === "view" && (
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserModal;