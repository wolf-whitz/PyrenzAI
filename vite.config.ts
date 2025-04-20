import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import path from 'path';

export default defineConfig({
  plugins: [
    react(), 
  ],

  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]',
      },
    },
    minify: 'terser',
    sourcemap: false,
  },

  server: {
    open: true,
    port: 8080,
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
