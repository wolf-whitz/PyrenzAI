import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { cspPlugin } from './plugin/DevheaderCsp';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),

    sentryVitePlugin({
      org: 'pyrenzai',
      project: 'pyrenzai',
      authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
    }),

    tsconfigPaths({
      projects: ['tsconfig.app.json'],
    }),

    cspPlugin(),

    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
  ],

  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },

  publicDir: 'public',
  cacheDir: 'node_modules/.vite_cache',

  build: {
    outDir: 'build',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 50,
    minify: 'esbuild',
    sourcemap: true,
    target: 'esnext',
    cssCodeSplit: true,
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

  optimizeDeps: {
    include: ['react', 'react-dom'],
  },

  assetsInclude: ['**/*.png', '**/*.jpg'],
});
