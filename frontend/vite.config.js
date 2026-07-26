import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',  // don't block Safari rendering

      includeAssets: ['favicon.svg', 'apple-touch-icon.png', '*.png', '*.jpg'],

      manifest: {
        name: 'DCC මොණරාගල',
        short_name: 'DCC මොණරාගල',
        description: 'මොණරාගල දිස්ත්‍රික්කයේ සංවර්ධන ව්‍යාපෘති — සාරාංශය සහ ප්‍රගතිය',
        theme_color: '#1e3a5f',
        background_color: '#f8f6f0',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'si',
        categories: ['government', 'productivity'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },

      workbox: {
        // Only cache static assets — NOT html files
        globPatterns: ['**/*.{js,css,ico,png,svg,jpg,jpeg,woff,woff2,ttf}'],

        // ✅ SAFARI FIX #1: New cache ID — forces old caches to be cleaned up
        // The index.html inline script detects the old name and self-destructs
        cacheId: 'monaragala-dev-projects-v2',

        // ✅ SAFARI FIX #2: No navigation interception
        // Vercel rewrites handle SPA routing via vercel.json
        navigateFallback: null,

        // ✅ SAFARI FIX #3: Force new SW to activate immediately
        // Replaces old broken SW without waiting for all tabs to close
        skipWaiting: true,
        clientsClaim: true,

        // Clean up caches from old SW versions
        cleanupOutdatedCaches: true,

        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 },
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
        ],
      },

      devOptions: { enabled: false },
    }),
  ],
})
