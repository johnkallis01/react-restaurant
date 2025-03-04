import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api':'http://localhost:8080'
    }
  },
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': 'https://localhost:8080',
  //   }
  // }
})
