import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions:{
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.png'],
      manifest: {
        name: "Forge",
        short_name: "Forge",
        description: "Workout tracker app",
        theme_color: "#f3f3f3",
        start_url: '/',
        display: 'standalone',
        display_override: ["window-controls-overlay", "standalone"],
        background_color: '#f3f3f3',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
  ],

})
