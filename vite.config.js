import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            coms: path.resolve(__dirname, 'src/components'),
            pages: path.resolve(__dirname, 'src/pages')
        }
    },
    server: {
        open: false,
        host: '0.0.0.0', // ← 新增内容 ←
        proxy: {
            '^/baidu': {
                target: 'https://api.map.baidu.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/baidu/, '')
            },
            '^/api': {
                target: 'http://192.168.31.159:7777',
                changeOrigin: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
