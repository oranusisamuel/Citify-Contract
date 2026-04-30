import { defineConfig } from 'vite'
import sitemap from 'vite-plugin-sitemap'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), sitemap({
    hostname: 'https://citify-contractors.com',
    routes: ['/', '/about', '/services', '/projects', '/contact', '/blog', '/events']
  })],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase'
            if (id.includes('react-router')) return 'router'
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('react-icons') || id.includes('lucide-react')) return 'icons'
            if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
          }
        },
      },
    },
  },
})
