// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression'
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        root: '.',

        plugins: [
            viteCompression({
                algorithm: 'gzip',
                ext: '.gz',
                threshold: 1024,   // 大于 1KB 才压缩（可选）
                deleteOriginFile: false
            }),
            viteCompression({
                algorithm: 'brotliCompress',
                ext: '.br',
                threshold: 1024,   // 大于 1KB 才压缩（可选）
                deleteOriginFile: false
            }),
            {
                name: 'vite-404-middleware',
                configureServer(server) {
                    server.middlewares.use((req, res, next) => {
                        // 排除 Vite 内部请求
                        if (req.url.startsWith('/@vite')) return next();

                        // 去掉查询参数
                        const urlPath = req.url.split('?')[0];

                        // 拼接真实路径
                        const filePath = path.join(process.cwd(), urlPath);

                        // 检查文件是否存在
                        fs.access(filePath, fs.constants.F_OK, (err) => {
                            if (err) {
                                res.statusCode = 404;
                                res.end(); // 只返回 404 状态
                            } else {
                                next();
                            }
                        });
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
            outDir: 'dist',
            target: 'esnext',
            sourcemap: false,
            cssMinify: 'lightningcss',
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html'),
                    sponsor: path.resolve(__dirname, 'sponsor.html'),
                },
            },
            emptyOutDir: true,
        },

        define: {
            __APP_MODE__: JSON.stringify(env.MODE),
            __API_BASE__: JSON.stringify(env.VITE_API_BASE || ''),
        }
    };
});
