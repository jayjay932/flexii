import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      host: '', // mettre l'URL ngrok ici SANS https
      protocol: 'wss', // websocket sécurisé (ou 'ws' si http)
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
