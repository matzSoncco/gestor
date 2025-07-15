import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';   // ✅ importa path correctamente

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      // Como TODOS tus archivos (components, composables, services…) están en la raíz
      // del proyecto, apunta el alias "@" a la carpeta actual ('.'):
      '@': resolve(__dirname, './src'),
    },
  },
});