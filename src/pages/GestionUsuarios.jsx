// src/pages/GestionUsuarios.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from "react";
import API from "../services/api";
import UserModal from "../components/Users/UserModal";
import UserHistoryModal from "../components/Users/UserHistoryModal";
import BlockUserModal from "../components/Users/BlockUserModal";
import UserFilters from "../components/Users/UserFilters";
import UserCard from "../components/Users/UserCard";
import "./GestionUsuarios.css";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    programa_id: "",
    estado: "",
    page: 1,
    limit: 15,
    ordenar_por: "nombre_completo",
    orden: "ASC",
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    pagina_actual: 1,
    total_paginas: 0,
  });

  // Estados para modales - ENFOQUE UNIFICADO
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(""); // 'view', 'edit', 'history', 'block'

  useEffect(() => {
    const loadProgramas = async () => {
      try {
        const response = await API.get("/api/programas");
        if (response.data.success) {
          setProgramas(response.data.data);
        }
      } catch (error) {
        console.error("Error cargando programas:", error);
      }
    };
    loadProgramas();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/users", { params: filters });

      if (response.data.success) {
        setUsuarios(response.data.data.usuarios || []);
        setPaginacion(
          response.data.data.paginacion || {
            total: 0,
            pagina_actual: 1,
            total_paginas: 0,
          }
        );
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      alert("Error al cargar los usuarios");
      setUsuarios([]);
      setPaginacion({
        total: 0,
        pagina_actual: 1,
        total_paginas: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, [filters]);

  // Funciones para abrir modales - ENFOQUE UNIFICADO
  const openModal = (user, type) => {
    console.log("🔘 Abriendo modal:", type, "para usuario:", user.id);
    setSelectedUser(user);
    setModalType(type);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setSelectedUser(null);
    setModalType("");
  };

  // Funciones de manejo de datos
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      programa_id: "",
      estado: "",
      page: 1,
      limit: 15,
      ordenar_por: "nombre_completo",
      orden: "ASC",
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleUpdateUser = async (userId, updateData) => {
    try {
      const response = await API.put(`/api/users/${userId}`, updateData);
      if (response.data.success) {
        alert("Usuario actualizado exitosamente");
        loadUsuarios();
        closeModal();
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      alert("Error al actualizar usuario");
    }
  };

  const handleBlockUser = async (userId, motivo) => {
    try {
      const response = await API.put(`/api/users/${userId}/block`, { motivo });
      if (response.data.success) {
        alert("Usuario bloqueado exitosamente");
        loadUsuarios();
        closeModal();
      }
    } catch (error) {
      console.error("Error bloqueando usuario:", error);
      alert("Error al bloquear usuario");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const response = await API.put(`/api/users/${userId}/unblock`);
      if (response.data.success) {
        alert("Usuario desbloqueado exitosamente");
        loadUsuarios();
      }
    } catch (error) {
      console.error("Error desbloqueando usuario:", error);
      alert("Error al desbloquear usuario");
    }
  };

  const handleUpdateHours = async (userId, horas) => {
    try {
      const response = await API.put(`/api/users/${userId}/horas`, { horas });
      if (response.data.success) {
        alert("Horas actualizadas exitosamente");
        loadUsuarios();
      }
    } catch (error) {
      console.error("Error actualizando horas:", error);
      alert("Error al actualizar horas");
    }
  };

  return (
    <div className="gestion-usuarios-container">
      {/* HEADER */}
      <div className="usuarios-header">
        <h1>👥 Gestión de Usuarios</h1>
        <p>Administra y gestiona todos los usuarios del sistema</p>
      </div>

      {/* FILTROS */}
      <UserFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onRefresh={loadUsuarios}
      />

      {/* ESTADÍSTICAS RÁPIDAS */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Usuarios</h3>
            <p className="stat-number">{paginacion.total || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Activos</h3>
            <p className="stat-number">
              {usuarios.filter((u) => u.activo).length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏸️</div>
          <div className="stat-info">
            <h3>Inactivos</h3>
            <p className="stat-number">
              {usuarios.filter((u) => !u.activo).length}
            </p>
          </div>
        </div>
      </div>

      {/* LISTA DE USUARIOS */}
      <div className="usuarios-list-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No se encontraron usuarios</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="usuarios-grid">
              {usuarios.map((usuario) => (
                <UserCard
                  key={usuario.id}
                  usuario={usuario}
                  onView={() => openModal(usuario, "view")}
                  onEdit={() => openModal(usuario, "edit")}
                  onHistory={() => openModal(usuario, "history")}
                  onBlock={() => openModal(usuario, "block")}
                  onUnblock={handleUnblockUser}
                  onUpdateHours={handleUpdateHours}
                />
              ))}
            </div>

            {/* PAGINACIÓN */}
            {paginacion.total_paginas > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline"
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  ◀️ Anterior
                </button>

                <span className="pagination-info">
                  Página {filters.page} de {paginacion.total_paginas}
                </span>

                <button
                  className="btn btn-outline"
                  disabled={filters.page >= paginacion.total_paginas}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Siguiente ▶️
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALES - ENFOQUE UNIFICADO */}
      {modalType === "view" && selectedUser && (
        <UserModal user={selectedUser} mode="view" onClose={closeModal} />
      )}

      {modalType === "edit" && selectedUser && (
        <UserModal
          user={selectedUser}
          programas={programas}
          mode="edit"
          onClose={closeModal}
          onSave={handleUpdateUser}
        />
      )}

      {modalType === "history" && selectedUser && (
        <UserHistoryModal user={selectedUser} onClose={closeModal} />
      )}

      {modalType === "block" && selectedUser && (
        <BlockUserModal
          user={selectedUser}
          onClose={closeModal}
          onBlock={handleBlockUser}
        />
      )}
    </div>
  );
};

export default GestionUsuarios;