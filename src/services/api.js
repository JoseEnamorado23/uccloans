import axios from "axios";

// Configuración para producción y desarrollo
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Importante para enviar cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar errores de autenticación
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si hay error de autenticación, limpiar datos locales
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    return Promise.reject(error);
  }
);

export default API;