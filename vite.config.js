import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    },
    // ✅ Agregar cabeceras CSP para desarrollo
    headers: {
      'Content-Security-Policy': 
        "default-src 'self' 'unsafe-inline' http://localhost:3000 http://localhost:4000; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: blob:; " +
        "connect-src 'self' ws://localhost:3000 http://localhost:4000 https://uccloans.vercel.app; " +
        "frame-src 'self';"
    }
  },
  // Configuración para producción
  build: {
    outDir: 'dist',
    sourcemap: false, // Mejor performance en producción
    // ✅ Optimizaciones para CSP
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  // ✅ Configuración específica para previsualización
  preview: {
    port: 3000,
    headers: {
      'Content-Security-Policy': 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://uccloans.vercel.app; " +
        "frame-src 'self';"
    }
  }
})