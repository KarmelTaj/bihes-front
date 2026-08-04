import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Django API runs on its own port in development. Proxying `/api` to it
// keeps every request same-origin, so the browser never needs CORS and the
// backend needs no extra dependency. `VITE_API_BASE_URL` overrides the base
// for deployed builds, where the API lives on a real host.
const API_TARGET = process.env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
