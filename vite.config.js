import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        skipWaiting: true,
        clientsClaim: true,
        globIgnores: ['**/*.wasm'],
        runtimeCaching: [{
          urlPattern: /\.wasm$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'wasm-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        }]
      },
      manifest: {
        name: 'Cool Background Remover',
        short_name: 'BG Remover',
        description: 'Remove image backgrounds easily',
        theme_color: '#1E40AF',
        icons: [
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 30000,
    rollupOptions: {}
  }
})