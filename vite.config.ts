import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import path from 'path';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    react(),
    imagetools(),
    sentryVitePlugin({
      org: 'pyrenzai',
      project: 'pyrenzai',
    }),
    sentryVitePlugin({
      org: 'pyrenzai',
      project: 'pyrenzai',
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  cacheDir: 'node_modules/.vite_cache',
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 5000,
    minify: 'terser',
    sourcemap: true,
    target: 'es2020',
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
      format: {
        comments: false,
        beautify: false,
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        compact: true,
      },
      treeshake: {
        moduleSideEffects: 'no-external',
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    open: true,
    port: 8080,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '@public': path.resolve(__dirname, 'public'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@ui': path.resolve(__dirname, 'src/components/common/ui'),
      '@layout': path.resolve(__dirname, 'src/components/common/layout'),
      '@shared-types': path.resolve(
        __dirname,
        'src/components/common/shared-types'
      ),
      '@store': path.resolve(__dirname, 'src/store'),
      '@libs': path.resolve(__dirname, 'src/lib'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
  },
  assetsInclude: ['**/*.png', '**/*.jpg'],
});
