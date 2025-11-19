// src/pages/GestionUsuarios.jsx - VERSIÓN ACTUALIZADA
import React, { useState, useEffect } from "react";
import { Users, Search } from "lucide-react";
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

  // Estados para modales
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(""); // 'view', 'edit', 'history', 'block'
  const [searchInput, setSearchInput] = useState("");

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

  // Funciones para búsqueda y filtros
  const handleSearchChange = (value) => {
    setSearchInput(value);
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput("");
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

  // Funciones para modales
  const openModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType("");
  };

  // Funciones de manejo de datos
  const handleUpdateUser = async (userId, updateData) => {
    try {
      const response = await API.put(`/api/users/${userId}`, updateData);
      if (response.data.success) {
        loadUsuarios();
        closeModal();
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  };

  const handleBlockUser = async (userId, motivo) => {
    try {
      const response = await API.put(`/api/users/${userId}/block`, { motivo });
      if (response.data.success) {
        loadUsuarios();
        closeModal();
      }
    } catch (error) {
      console.error("Error bloqueando usuario:", error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const response = await API.put(`/api/users/${userId}/unblock`);
      if (response.data.success) {
        loadUsuarios();
      }
    } catch (error) {
      console.error("Error desbloqueando usuario:", error);
    }
  };

  const handleUpdateHours = async (userId, horas) => {
    try {
      const response = await API.put(`/api/users/${userId}/horas`, { horas });
      if (response.data.success) {
        loadUsuarios();
      }
    } catch (error) {
      console.error("Error actualizando horas:", error);
    }
  };

  // Calcular estadísticas
  const stats = {
    total: paginacion.total || 0,
    activos: usuarios.filter((u) => u.activo).length,
    inactivos: usuarios.filter((u) => !u.activo).length
  };

  return (
    <div className="gestion-usuarios-page">
      {/* HEADER PRINCIPAL */}
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1>
              <Users size={28} />
              Gestión de Usuarios
            </h1>
            <p>Administra y gestiona todos los usuarios del sistema</p>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Usuarios</h3>
            <span className="stat-number">{stats.total}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Activos</h3>
            <span className="stat-number">{stats.activos}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Inactivos</h3>
            <span className="stat-number">{stats.inactivos}</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE BÚSQUEDA Y FILTROS */}
      <div className="filters-search-section">
        {/* BARRA DE BÚSQUEDA GENERAL */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre, cédula, email..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
              />
              {searchInput && (
                <button 
                  onClick={() => handleSearchChange("")}
                  className="clear-search-btn"
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="search-stats">
              <span className="results-count">
                {stats.total} usuarios encontrados
              </span>
            </div>
          </div>
        </div>

        {/* FILTROS AVANZADOS */}
        <UserFilters
          filters={filters}
          programas={programas}
          onFiltersChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onRefresh={loadUsuarios}
        />
      </div>

      {/* LISTA DE USUARIOS */}
      <div className="usuarios-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3>Cargando usuarios...</h3>
            <p>Obteniendo la información más reciente</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={48} />
            </div>
            <h3>No se encontraron usuarios</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
            <button 
              onClick={handleClearFilters}
              className="btn btn-outline"
            >
              Limpiar filtros
            </button>
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

      {/* MODALES */}
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