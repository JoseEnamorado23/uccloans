import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  IdCard, 
  Phone, 
  Mail, 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle,
  BarChart3,
  FileText,
  Save,
  Edit3,
  Shield,
  History
} from "lucide-react";
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
    if (!userData.nombre_completo || !userData.numero_telefono || !userData.programa_id) {
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

  const getProgramaNombre = () => {
    if (userData.programa_nombre) {
      return userData.programa_nombre;
    }
    
    if (userData.programa_id && programas.length > 0) {
      const programa = programas.find(p => p.id === userData.programa_id);
      return programa ? programa.nombre : `Programa ${userData.programa_id}`;
    }
    
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

  const getStatusBadge = () => {
    if (userData.activo) {
      return <span className="user-badge user-badge--green">Activo</span>;
    } else {
      return <span className="user-badge user-badge--red">Inactivo</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="user-modal-head">
          <div>
            <h3 className="user-modal-title">
              {mode === "view" ? <User size={18} /> : <Edit3 size={18} />}
              {mode === "view" ? "Información del Usuario" : "Editar Usuario"}
            </h3>
            <p className="user-modal-sub">
              ID #{user.id} · {getProgramaNombre()}
            </p>
          </div>
          <button 
            aria-label="Cerrar" 
            className="user-modal-close" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <main className="user-modal-body">
          {mode === "view" ? (
            <>
              <section className="user-modal-grid">
                <div className="user-modal-block">
                  <div className="user-modal-block-title">
                    <User size={16} /> <span>Información Básica</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Nombre</strong>
                    <span>{userData.nombre_completo}</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Cédula</strong>
                    <span>{userData.numero_cedula}</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Teléfono</strong>
                    <span>{userData.numero_telefono}</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Estado</strong>
                    <span>{getStatusBadge()}</span>
                  </div>
                </div>

                <div className="user-modal-block">
                  <div className="user-modal-block-title">
                    <BookOpen size={16} /> <span>Información Académica</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Programa</strong>
                    <span>{getProgramaNombre()}</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Email</strong>
                    <span>
                      <Mail size={14} />
                      {userData.email || "No registrado"}
                    </span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Verificado</strong>
                    <span>
                      {userData.verificado ? (
                        <>
                          <CheckCircle size={14} />
                          Verificado
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          No verificado
                        </>
                      )}
                    </span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Creado por Admin</strong>
                    <span>
                      {userData.creado_por_admin ? (
                        <>
                          <Shield size={14} />
                          Sí
                        </>
                      ) : (
                        <>
                          <User size={14} />
                          No
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </section>

              {userStats && (
                <section className="user-modal-stats">
                  <div className="user-stats-grid">
                    <div className="user-stat-item">
                      <div className="user-stat-value">{userStats.total_prestamos || 0}</div>
                      <div className="user-stat-label">Total Préstamos</div>
                    </div>
                    <div className="user-stat-item">
                      <div className="user-stat-value">{userStats.prestamos_devueltos || 0}</div>
                      <div className="user-stat-label">Devueltos</div>
                    </div>
                    <div className="user-stat-item">
                      <div className="user-stat-value">{userStats.prestamos_activos || 0}</div>
                      <div className="user-stat-label">Activos</div>
                    </div>
                    <div className="user-stat-item">
                      <div className="user-stat-value">
                        {parseFloat(userStats.horas_totales_acumuladas || 0).toFixed(1)}h
                      </div>
                      <div className="user-stat-label">Horas Acum.</div>
                    </div>
                  </div>
                </section>
              )}

              <section className="user-modal-grid">
                <div className="user-modal-block">
                  <div className="user-modal-block-title">
                    <History size={16} /> <span>Historial</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Registro</strong>
                    <span>{formatDate(userData.fecha_registro)}</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Actualización</strong>
                    <span>{formatDate(userData.fecha_actualizacion)}</span>
                  </div>
                  <div className="user-modal-row">
                    <strong>Último Login</strong>
                    <span>{formatDate(userData.ultimo_login) || "Nunca"}</span>
                  </div>
                  {userData.fecha_bloqueo && (
                    <div className="user-modal-row">
                      <strong>Bloqueado</strong>
                      <span>{formatDate(userData.fecha_bloqueo)}</span>
                    </div>
                  )}
                </div>

                {userData.motivo_bloqueo && (
                  <div className="user-modal-block">
                    <div className="user-modal-block-title">
                      <XCircle size={16} /> <span>Información de Bloqueo</span>
                    </div>
                    <div className="user-motivo-bloqueo">
                      {userData.motivo_bloqueo}
                    </div>
                  </div>
                )}
              </section>
            </>
          ) : (
            /* MODO EDICIÓN */
            <div className="user-edit-form">
              <div className="user-form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={userData.nombre_completo || ""}
                  onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
                  placeholder="Ingresa el nombre completo"
                />
              </div>

              <div className="user-form-group">
                <label>Teléfono *</label>
                <input
                  type="text"
                  value={userData.numero_telefono || ""}
                  onChange={(e) => handleInputChange("numero_telefono", e.target.value)}
                  placeholder="Ingresa el número de teléfono"
                />
              </div>

              <div className="user-form-group">
                <label>Programa *</label>
                <select
                  value={userData.programa_id || ""}
                  onChange={(e) => handleInputChange("programa_id", e.target.value)}
                >
                  <option value="">Selecciona un programa</option>
                  {programas.map((programa) => (
                    <option key={programa.id} value={programa.id}>
                      {programa.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ingresa el email (opcional)"
                />
              </div>
            </div>
          )}
        </main>

        <footer className="user-modal-foot">
          <button 
            className="user-modal-btn user-modal-btn--ghost" 
            onClick={onClose} 
            disabled={loading}
          >
            <X size={16} />
            Cancelar
          </button>
          
          {mode === "edit" && (
            <button
              className="user-modal-btn user-modal-btn--primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <span className="user-modal-spinner" />
              ) : (
                <>
                  <Save size={16} />
                  Guardar Cambios
                </>
              )}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default UserModal;