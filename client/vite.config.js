import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'sw.js',
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'offline.html'],
            manifest: {
                name: 'Urban Harvest Hub',
                short_name: 'UrbanHarvest',
                description: 'Sustainable events and products community for the modern age.',
                theme_color: '#050510',
                background_color: '#050510',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'icon.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'icon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ],
                screenshots: [
                    {
                        src: 'screenshot-desktop.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        form_factor: 'wide'
                    },
                    {
                        src: 'screenshot-mobile.png',
                        sizes: '375x667',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
})
