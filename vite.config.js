// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression'
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    const ASSET_PREFIX = `VampireC`;

    return {
        root: 'src',
        publicDir: '../public',
        plugins: [
            viteCompression({
                algorithm: 'gzip',
                ext: '.gz',
                threshold: 1024,
                deleteOriginFile: false
            }),
            viteCompression({
                algorithm: 'brotliCompress',
                ext: '.br',
                threshold: 1024,
                deleteOriginFile: false
            }),
            {
                name: 'vite-404-middleware',
                configureServer(server) {
                    server.middlewares.use((req, res, next) => {
                        // 放行 Vite 内部资源
                        if (
                            req.url.startsWith('/@') ||
                            req.url.startsWith('/src') ||
                            req.url.startsWith('/node_modules') ||
                            req.url.includes('.js') ||
                            req.url.includes('.css')
                        ) {
                            return next();
                        }

                        next();
                    });
                }
            }
        ],

        server: {
            host: true,
            port: 5173,
            open: true,
            strictPort: true,
        },

        preview: {
            port: 4173,
            open: true,
            strictPort: true,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },

        build: {
            outDir: path.resolve(__dirname, 'dist'),
            target: 'esnext',
            sourcemap: false,
            cssMinify: 'lightningcss',
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'src/index.html'),
                    sponsor: path.resolve(__dirname, 'src/sponsor.html'),
                    verify: path.resolve(__dirname, 'src/verify.html'),
                },
                output: {
                    entryFileNames: `assets/${ASSET_PREFIX}-[name]-[hash].js`,
                    chunkFileNames: `assets/${ASSET_PREFIX}-[name]-[hash].js`,
                    assetFileNames: `assets/${ASSET_PREFIX}-[name]-[hash].[ext]`,
                }
            },
        },

        esbuild: mode === 'production' ? {
            drop: ['console', 'debugger'],
            legalComments: 'none'
        } : {},

        define: {
            __APP_MODE__: JSON.stringify(env.MODE),
            __API_BASE__: JSON.stringify(env.VITE_API_BASE || ''),
        }
    };
});
