import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
    // ✅ CSP para desarrollo - SIN WILDCARDS
    headers: {
      'Content-Security-Policy': 
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data:; " + // ✅ SOLO IMÁGENES LOCALES
        "connect-src 'self' http://localhost:4000; " +
        "frame-src 'self';"
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})