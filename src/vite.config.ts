import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        include: ['framer-motion'],
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        // Tell the browser to connect HMR to localhost, not 0.0.0.0
        // (0.0.0.0 is the listen address inside Docker; localhost is what the
        //  host machine and browser can actually reach)
        hmr: {
            host: 'localhost',
            port: 5173,
        },
        // Windows + Docker Desktop (WSL2) does not propagate inotify events
        // across the bind-mount boundary, so chokidar never fires.
        // Polling detects changes by comparing file mtimes every `interval` ms.
        watch: {
            usePolling: true,
            interval: 300,
            ignored: ['**/storage/**', '**/bootstrap/cache/**', '**/vendor/**'],
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});
