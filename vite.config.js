import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.HEIC', '**/*.heic'],
  build: {
    // Ensure assets are optimized but not broken
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Ensure consistent asset naming in production
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          } else if (/png|jpe?g|gif|svg|webp|ico|heic/i.test(assetInfo.name)) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  server: {
    // Ensure proper MIME types in dev
    mimeTypes: {
      'application/javascript': ['mjs']
    }
  }
})
