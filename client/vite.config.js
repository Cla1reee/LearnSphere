import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Setiap kali kita panggil '/api' di frontend...
      '/api': {
        target: 'http://localhost:3000', // ...akan diteruskan ke Backend Node.js
        changeOrigin: true,
        secure: false,
      },
      // Setup juga untuk akses folder uploads (gambar)
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})