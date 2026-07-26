import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      // Use defer to avoid blocking Safari rendering
      injectRegister: 'script-defer',

      includeAssets: ['favicon.svg', 'apple-touch-icon.png', '*.png', '*.jpg'],

      manifest: {
        name: 'මොණරාගල දිස්ත්‍රික්කයේ සංවර්ධන ව්‍යාපෘති',
        short_name: 'Monaragala',
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
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        // Cache all static assets
        globPatterns: ['**/*.{js,css,ico,png,svg,jpg,jpeg,woff,woff2,ttf}'],

        // ✅ SAFARI FIX: Disable NavigationRoute
        // Vercel already handles SPA routing via vercel.json rewrites.
        // The SW NavigationRoute + Vercel rewrites conflict in Safari → white screen.
        navigateFallback: null,

        // Cache name prefix
        cacheId: 'monaragala-dev-projects',

        // Runtime caching strategies
        runtimeCaching: [
          {
            // API calls: NetworkFirst — try network, fall back to cache
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Google Fonts: CacheFirst
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
            },
          },
        ],
      },

      // Dev options — disable in dev to avoid confusion
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
