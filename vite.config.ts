import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/legalworld/',
  plugins: [react()],
  server: {
    port: 5174,
  },
  preview: {
    port: 4174,
  },
}));
