// src/hooks/useAutoLoans.js - VERSIÓN SIMPLIFICADA
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import API from "../services/api";

export const useAutoLoans = () => {
  const [loansData, setLoansData] = useState({
    activos: [],
    pendientes: [],
    por_vencer: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const socketRef = useRef(null);

  // ✅ CARGAR DATOS DESDE LA API - CONFIANZA 100% EN BACKEND
  const loadAllLoans = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const response = await API.get("/api/prestamos/auto-update");
      if (response.data.success) {
        // ✅ USAR DIRECTAMENTE LA CLASIFICACIÓN DEL BACKEND
        const { activos = [], pendientes = [], por_vencer = [] } = response.data.data;
        
        setLoansData({
          activos,
          pendientes, 
          por_vencer,
        });

        setLastUpdate(new Date().toISOString());

        console.log("📊 Datos cargados desde BACKEND:", {
          activos: activos.length,
          pendientes: pendientes.length,
          por_vencer: por_vencer.length,
        });

        // ✅ VERIFICAR DUPLICADOS (solo para debug)
        const todosIds = [...activos.map(p => p.id), ...pendientes.map(p => p.id), ...por_vencer.map(p => p.id)];
        const idsUnicos = [...new Set(todosIds)];
        if (todosIds.length !== idsUnicos.length) {
          console.warn("⚠️ BACKEND envió duplicados:", {
            total: todosIds.length, 
            unicos: idsUnicos.length
          });
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error cargando préstamos");
      console.error("Error:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // ✅ INICIALIZACIÓN - SIN RECÁLCULO LOCAL
  useEffect(() => {
    // 1. Cargar datos iniciales
    loadAllLoans(true);

    // 2. Conexión WebSocket
    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 WebSocket conectado");
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 WebSocket desconectado");
    });

    // 3. Escuchar eventos del servidor - RECARGAR DESDE BACKEND
    socketRef.current.on("prestamos_actualizados", (data) => {
      console.log("📡 Actualización automática del servidor");
      loadAllLoans(false);
    });

    socketRef.current.on("nuevo_prestamo", (data) => {
      console.log("➕ Nuevo préstamo creado");
      loadAllLoans(false);
    });

    socketRef.current.on("prestamo_finalizado", (data) => {
      console.log("✅ Préstamo finalizado");
      loadAllLoans(false);
    });

    socketRef.current.on("prestamo_actualizado", (data) => {
      console.log("🔄 Préstamo actualizado");
      loadAllLoans(false);
    });

    // 4. Sincronización periódica con backend cada 2 minutos
    const syncInterval = setInterval(() => {
      console.log("🔄 Sincronización periódica con servidor");
      loadAllLoans(false);
    }, 120000);

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      clearInterval(syncInterval);
    };
  }, [loadAllLoans]);

  return {
    activeLoans: loansData.activos,
    pendingLoans: loansData.pendientes,
    expiringLoans: loansData.por_vencer,
    loading,
    error,
    lastUpdate,
    refreshAll: () => loadAllLoans(true),
    isConnected: socketRef.current?.connected || false,
  };
};