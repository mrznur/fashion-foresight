import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.webp'],

  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'supabase':     ['@supabase/supabase-js'],
          'validation':   ['zod'],
        },
      },
    },
  },

  server: {
    headers: {
      'X-Frame-Options':           'DENY',
      'X-Content-Type-Options':    'nosniff',
      'Referrer-Policy':           'strict-origin-when-cross-origin',
    },
  },

  preview: {
    headers: {
      'X-Frame-Options':           'DENY',
      'X-Content-Type-Options':    'nosniff',
      'Referrer-Policy':           'strict-origin-when-cross-origin',
    },
  },
});
