import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  plugins: [react()],
})
