import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo Vite corre en 5173 y manda todo lo que empiece por /api
// al servidor Hono en 5177. En producción no se usa: el servidor Hono
// sirve el dist/ compilado y la api desde el mismo puerto.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5177',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
