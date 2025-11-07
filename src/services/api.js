import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/",
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