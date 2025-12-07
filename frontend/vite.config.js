import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable minification for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        passes: 2, // Multiple passes for better compression
        unused: true, // Remove unused code
        dead_code: true, // Remove dead code
        pure_funcs: ['console.log', 'console.debug'],
      },
      format: {
        comments: false,
      },
      mangle: {
        toplevel: true, // Mangle top-level variables
      },
    },
    // Performance optimization
    sourcemap: false, // Disable source maps in production
    cssCodeSplit: true, // Split CSS into separate files
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    // Optimize output for compression
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Optimize chunk naming for caching
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        // Separate vendor code and route chunks for better caching
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'vendor-router';
          }
        },
      },
    },
  },
  // Optimization for development
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
