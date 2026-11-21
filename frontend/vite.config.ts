import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Báo lỗi nếu port 5173 đã bị chiếm, thay vì âm thầm chuyển port khác
  },
})
