import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081,
    open: true,

    // 添加代理配置来解决CORS问题
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  define: {
    'process.env.VUE_APP_API_BASE_URL': JSON.stringify(process.env.VUE_APP_API_BASE_URL || 'http://localhost:8888/api'),
    'process.env.VUE_APP_ENV': JSON.stringify(process.env.VUE_APP_ENV || 'development')
  }
})
