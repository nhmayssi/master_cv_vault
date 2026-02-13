import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/master_cv_vault/', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
