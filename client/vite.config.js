import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['antd', '@ant-design/icons'],
          'state-vendor': ['@reduxjs/toolkit', 'react-redux', '@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable source maps in production for security
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
})
