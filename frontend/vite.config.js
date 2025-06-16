// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins:
    [react()
      ,
    tailwindcss()
    ],
  server: {
    port: process.env.VITE_PORT || 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://diario-de-viagem-backend.vercel.app',
        changeOrigin: true,
        secure: true,
        ws: true
      }
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      process.env.VITE_FRONTEND_URL || 'diario-de-viagem.vercel.app',
      process.env.VITE_BACKEND_URL || 'diario-de-viagem-backend.vercel.app',
      '.vercel.app'
    ]
  }
})
