# 测试与发布问题检查清单

## 🔴 严重问题（必须修复）

### 1. Nginx 配置缺少 API 代理
**问题描述：**
- `nginx.conf` 中没有配置 `/api` 路径的代理
- 生产环境中，前端请求 `/api` 会返回 404
- 后端 API 无法被前端访问

**当前配置：**
```nginx
# nginx.conf 只有静态文件服务，没有 API 代理
location / {
    try_files $uri $uri/ /index.html;
}
```

**需要添加：**
```nginx
location /api {
    proxy_pass http://backend-server:8888;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**影响：**
- 生产环境所有 API 请求失败
- 用户无法登录、获取数据、上传资源等

---

### 2. API BaseURL 硬编码问题
**问题描述：**
- `src/api/index.js` 中 `baseURL: '/api'` 是硬编码的
- 开发环境和生产环境可能需要不同的 API 地址
- 没有使用环境变量配置

**当前代码：**
```javascript
// src/api/index.js
const api = axios.create({
  baseURL: '/api',  // 硬编码，无法根据不同环境切换
  timeout: 10000
})
```

**建议修复：**
```javascript
// 支持环境变量配置
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})
```

**影响：**
- 无法灵活配置不同环境的 API 地址
- 如果后端 API 不在同一域名下，无法正常访问

---

### 3. Nginx Server Name 配置不当
**问题描述：**
- `nginx.conf` 中 `server_name localhost;` 硬编码为 localhost
- 生产环境应该使用实际域名 `share.yourang.top`

**当前配置：**
```nginx
server_name localhost;
```

**建议配置：**
```nginx
server_name share.yourang.top localhost;
```

**影响：**
- 可能导致 SSL 证书配置问题
- 多域名访问可能无法正确处理

---

## 🟡 中等问题（建议修复）

### 4. 环境变量配置不完整
**问题描述：**
- `vite.config.js` 中定义了环境变量，但实际未使用
- 没有 `.env` 文件管理环境变量
- 开发和生产环境配置混在一起

**当前配置：**
```javascript
// vite.config.js
define: {
  'process.env.VUE_APP_API_BASE_URL': JSON.stringify(process.env.VUE_APP_API_BASE_URL || 'http://localhost:8888/api'),
  'process.env.VUE_APP_ENV': JSON.stringify(process.env.VUE_APP_ENV || 'development')
}
```

**问题：**
- 这些环境变量定义后未被使用
- 应该使用 Vite 的 `import.meta.env` 而不是 `process.env`

**建议：**
- 创建 `.env.development` 和 `.env.production` 文件
- 使用 `import.meta.env.VITE_*` 访问环境变量

---

### 5. Docker Compose 配置不完整
**问题描述：**
- `docker-compose.yml` 中只有前端服务
- 没有后端服务配置
- 如果后端也在 Docker 中，需要配置网络连接

**当前配置：**
```yaml
services:
  education-platform:
    build: .
    ports:
      - "3000:80"
```

**问题：**
- Nginx 配置中 `proxy_pass http://backend:8888;` 需要后端服务在同一网络中
- 如果没有后端服务，需要配置外部 API 地址

**建议：**
- 如果后端在 Docker 中，添加后端服务配置
- 如果后端在外部，修改 nginx.conf 中的 proxy_pass 地址

---

### 6. 构建配置缺少优化
**问题描述：**
- `vite.config.js` 的 `build` 配置过于简单
- 没有配置代码分割、压缩优化等

**当前配置：**
```javascript
build: {
  outDir: 'dist',
  assetsDir: 'assets'
}
```

**建议添加：**
```javascript
build: {
  outDir: 'dist',
  assetsDir: 'assets',
  sourcemap: false, // 生产环境不生成 sourcemap
  minify: 'terser', // 使用 terser 压缩
  chunkSizeWarningLimit: 1000, //  chunk 大小警告限制
  rollupOptions: {
    output: {
      manualChunks: {
        // 代码分割配置
        vendor: ['vue', 'vue-router', 'vuex'],
        utils: ['axios']
      }
    }
  }
}
```

---

## 🟢 小问题（优化建议）

### 7. 缺少测试脚本
**问题描述：**
- `package.json` 中没有测试相关的脚本
- 没有单元测试、集成测试配置

**当前 scripts：**
```json
{
  "dev": "vite",
  "serve": "node serve.js",
  "build": "vite build",
  "preview": "vite preview"
}
```

**建议添加：**
```json
{
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "lint": "eslint src",
  "build:prod": "vite build --mode production"
}
```

---

### 8. 开发服务器配置问题
**问题描述：**
- `vite.config.js` 中的 `allowedHosts` 配置只在开发环境有效
- 生产环境使用 Nginx，不需要这个配置

**当前配置：**
```javascript
server: {
  allowedHosts: [
    'share.yourang.top',
    'localhost',
    '.yourang.top'
  ]
}
```

**说明：**
- 这个配置只在 `npm run dev` 时有效
- 生产环境使用 Docker + Nginx，不受此配置影响
- 如果需要开发环境通过域名访问，此配置是正确的

---

### 9. HTML 缓存策略
**问题描述：**
- `nginx.conf` 中没有配置 HTML 文件的缓存策略
- HTML 文件应该不缓存或短时间缓存，确保更新及时生效

**建议添加：**
```nginx
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

---

### 10. 安全头配置
**问题描述：**
- `nginx.conf` 中有基本的安全头，但可以更完善
- 缺少 CSP (Content-Security-Policy) 等安全头

**当前配置：**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

**建议添加：**
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

## 📋 部署检查清单

### 部署前检查
- [ ] 修复 Nginx API 代理配置
- [ ] 配置正确的 server_name
- [ ] 检查后端 API 地址是否正确
- [ ] 配置环境变量文件
- [ ] 测试构建产物是否正常
- [ ] 检查 Docker 镜像构建
- [ ] 验证 API 连接正常

### 部署后检查
- [ ] 前端页面可以正常访问
- [ ] API 请求可以正常响应
- [ ] 静态资源加载正常
- [ ] 路由跳转正常（SPA）
- [ ] 用户登录功能正常
- [ ] 资源上传下载正常
- [ ] 控制台无错误信息
- [ ] 网络请求正常

### 性能检查
- [ ] 页面加载速度
- [ ] 静态资源缓存生效
- [ ] Gzip 压缩生效
- [ ] 图片资源优化
- [ ] 代码分割生效

---

## 🔧 修复优先级

### 优先级 1（必须修复）
1. **Nginx API 代理配置** - 否则生产环境无法访问 API
2. **Server Name 配置** - 影响域名访问和 SSL 配置
3. **API BaseURL 环境变量** - 确保不同环境配置正确

### 优先级 2（建议修复）
4. **环境变量文件管理** - 提高配置灵活性
5. **Docker Compose 配置** - 完善容器化部署
6. **构建优化配置** - 提升生产环境性能

### 优先级 3（可选优化）
7. **测试脚本配置** - 提高代码质量
8. **安全头完善** - 增强安全性
9. **缓存策略优化** - 提升用户体验

---

## 📝 注意事项

1. **后端 API 地址**：确认生产环境后端 API 的实际地址和端口
2. **HTTPS 配置**：如果使用 HTTPS，需要配置 SSL 证书
3. **CORS 配置**：如果前端和后端不在同一域名，需要配置 CORS
4. **环境变量**：不同环境使用不同的环境变量文件
5. **构建优化**：生产环境构建时应该启用代码压缩和优化
6. **错误监控**：建议添加错误监控和日志收集
7. **性能监控**：建议添加性能监控工具

---

## 🚀 快速修复步骤

1. **修复 Nginx 配置**
   - 添加 `/api` 代理配置
   - 修改 `server_name` 为实际域名
   - 配置后端 API 地址

2. **修复 API 配置**
   - 使用环境变量配置 `baseURL`
   - 创建 `.env.production` 文件

3. **优化构建配置**
   - 添加构建优化选项
   - 配置代码分割

4. **测试部署**
   - 本地构建测试
   - Docker 构建测试
   - 生产环境部署测试

---

## 📚 参考文档

- [Vite 环境变量](https://vitejs.dev/guide/env-and-mode.html)
- [Nginx 代理配置](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Docker Compose 网络配置](https://docs.docker.com/compose/networking/)
- [Vite 构建配置](https://vitejs.dev/config/build-options.html)









