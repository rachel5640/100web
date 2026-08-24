import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],

  // Vercel은 루트, FTP 빌드는 하위 경로
  base: process.env.VERCEL ? '/' : '/2026/100/',
});
