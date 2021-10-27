import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  css: {
    modules: {
      localsConvention: 'dashesOnly',
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
