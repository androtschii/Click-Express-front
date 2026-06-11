import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':        ['react', 'react-dom', 'react-router-dom'],
          'vendor-query':        ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'vendor-motion':       ['framer-motion', 'motion-dom', 'motion-utils'],
          'vendor-icons':        ['@phosphor-icons/react', 'lucide-react'],
          'vendor-maps':         ['react-simple-maps', 'topojson-client'],
          'vendor-misc':         ['gsap', 'sonner', 'zod'],
        },
      },
    },
  },
})
