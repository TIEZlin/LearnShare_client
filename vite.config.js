import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081, // 修改为 3000 以匹配后端白名单
    open: true,
    // 允许的域名（部署到云服务器时使用）
    allowedHosts: [
      'share.yourang.top',
      'localhost',
      '.yourang.top' // 允许所有 yourang.top 的子域名
    ],
    // 或者禁用 host 检查（不推荐，仅用于开发环境）
    // strictPort: false,
    // host: '0.0.0.0', // 允许外部访问

    // 添加代理配置来解决CORS问题
    proxy: {
      '/api': {
        target: 'http://localhost:8888', // 指向真实的后端地址
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

