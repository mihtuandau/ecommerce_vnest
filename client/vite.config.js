import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
    }),
    tailwindcss()
  ],
  
  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store'),
      '@config': path.resolve(__dirname, './src/config'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // Build optimizations
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'ui-vendor': ['antd', '@ant-design/icons', '@ant-design/charts'],
          // State management
          'state-vendor': [
            '@reduxjs/toolkit', 
            'react-redux', 
            '@tanstack/react-query',
            '@tanstack/react-query-devtools'
          ],
          // Utilities
          'utils-vendor': ['axios', 'dayjs', 'clsx'],
          // Animation libraries
          'animation-vendor': ['framer-motion', 'gsap'],
          // Icons
          'icon-vendor': ['lucide-react', 'react-icons', '@heroicons/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Asset optimization
    assetsInlineLimit: 4096,
  },

  // Dev server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true, // Listen on all addresses
    open: false, // Don't auto-open browser
    cors: true,
    // Proxy API requests to backend
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: process.env.VITE_SOCKET_URL || 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
    },
    // HMR configuration
    hmr: {
      overlay: true,
    },
  },

  // Preview server (for production build testing)
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    cors: true,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@tanstack/react-query',
    ],
    exclude: ['@tanstack/react-query-devtools'],
  },

  // Performance optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Drop console in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})
