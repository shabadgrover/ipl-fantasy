import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: false,
    environment: 'node',
    exclude: ['backend/**', 'node_modules/**', 'dist/**'],
  },
})
