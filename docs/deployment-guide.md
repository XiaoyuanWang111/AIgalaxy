# 🚀 AI Agent Platform 部署指南

## 📋 部署准备清单

### ✅ 已完成配置
- [x] 一键部署脚本 (`deploy.sh`)
- [x] 生产环境变量 (`.env.production`)
- [x] Nginx配置 (`nginx.conf`)
- [x] PM2进程管理配置 (`ecosystem.config.js`)
- [x] 数据库结构文档
- [x] 构建测试通过

### 🎯 服务器信息
- **IP地址**: 192.144.154.224
- **应用目录**: `/var/www/ai-agent-platform`
- **Node.js版本**: 18.x
- **数据库**: SQLite
- **进程管理**: PM2
- **Web服务器**: Nginx

## 🚀 快速部署

### 方法一：一键部署（推荐）
```bash
# 赋予执行权限
chmod +x deploy.sh

# 一键部署到服务器
./deploy.sh deploy
```

### 方法二：分步部署
```bash
# 1. 服务器环境设置
./deploy.sh setup

# 2. 应用部署
./deploy.sh deploy

# 3. 查看状态
./deploy.sh status
```

### 方法三：手动部署
```bash
# SSH到服务器
ssh root@192.144.154.224

# 克隆项目
git clone <repository-url> /var/www/ai-agent-platform
cd /var/www/ai-agent-platform

# 安装依赖
npm ci --production

# 构建应用
npm run build

# 数据库迁移
npx prisma generate
npx prisma db push

# 启动应用
pm2 start npm --name ai-agent-platform -- start
```

## 🔧 部署脚本详解

### deploy.sh 命令用法
```bash
./deploy.sh [command]

Commands:
  setup    - 设置服务器环境（需要root权限）
  deploy   - 部署应用（默认）
  restart  - 重启应用
  logs     - 查看日志
  status   - 查看状态
```

### 环境变量配置

#### 生产环境 (.env.production)
```bash
# 生产环境配置
NODE_ENV=production
NEXTAUTH_URL=http://192.144.154.224:3000
NEXTAUTH_SECRET=your-secure-secret-here

# 数据库
DATABASE_URL="file:./production.db"

# 管理员认证
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# 服务器配置
HOST=0.0.0.0
PORT=3000
```

## 🌐 访问地址

部署完成后，应用将在以下地址可用：

### 主应用
- **HTTP**: http://192.144.154.224:3000
- **HTTPS**: https://192.144.154.224 (需要SSL证书)

### 管理后台
- **管理界面**: http://192.144.154.224:3000/admin
- **默认管理员**: admin / [需要修改]

### 数据库管理
- **Prisma Studio**: http://192.144.154.224:3000/api/studio

## 🔒 安全配置

### 必须修改的安全设置
1. **管理员密码**
   ```bash
   # 修改.env.production文件
   ADMIN_PASSWORD=your-secure-password-here
   ```

2. **JWT密钥**
   ```bash
   # 生成安全的JWT密钥
   openssl rand -base64 32
   
   # 设置到.env.production
   NEXTAUTH_SECRET=your-generated-secret
   ```

3. **数据库权限**
   ```bash
   # 设置文件权限
   chown -R aiagent:aiagent /var/www/ai-agent-platform
   chmod 600 /var/www/ai-agent-platform/.env.production
   ```

## 🐳 容器化部署（可选）

### Docker部署
```bash
# 构建镜像
docker build -t ai-agent-platform .

# 运行容器
docker run -d \
  --name ai-agent-platform \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  ai-agent-platform
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

## 🔄 更新部署

### 应用更新
```bash
# 拉取最新代码
git pull origin main

# 重新部署
./deploy.sh deploy

# 或手动更新
npm ci --production
npm run build
npx prisma db push
pm2 restart ai-agent-platform
```

### 数据库迁移
```bash
# 备份数据库
cp prisma/production.db prisma/production.db.backup

# 执行迁移
npx prisma migrate deploy

# 验证迁移
npx prisma db seed
```

## 📊 监控与日志

### 应用监控
```bash
# 查看应用状态
pm2 status

# 查看实时日志
pm2 logs ai-agent-platform

# 查看错误日志
pm2 logs ai-agent-platform --err

# 日志文件位置
# ~/.pm2/logs/ai-agent-platform-out.log
# ~/.pm2/logs/ai-agent-platform-error.log
```

### 系统监控
```bash
# 查看系统资源
htop

# 查看端口占用
netstat -tlnp | grep :3000

# 查看Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🔍 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 检查端口占用
lsof -i :3000

# 终止占用进程
kill -9 <PID>
```

#### 2. 权限问题
```bash
# 修复权限
chown -R aiagent:aiagent /var/www/ai-agent-platform
chmod -R 755 /var/www/ai-agent-platform
```

#### 3. 依赖问题
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm ci --production
```

#### 4. 数据库问题
```bash
# 重置数据库
rm prisma/production.db
npx prisma db push
npx prisma db seed
```

### 健康检查
```bash
# 应用健康检查
curl -f http://localhost:3000/api/health || echo "应用未运行"

# 数据库连接检查
sqlite3 prisma/production.db ".tables"
```

## 📈 性能优化

### Nginx优化
```nginx
# 在nginx.conf中添加
server {
    listen 80;
    server_name 192.144.154.224;
    
    # 静态文件缓存
    location /_next/static/ {
        alias /var/www/ai-agent-platform/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    # API代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2优化
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ai-agent-platform',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    }
  }]
};
```

## 📞 支持联系方式

### 技术支持
- **部署问题**: 查看 `deploy.sh logs`
- **应用问题**: 查看 `pm2 logs`
- **系统问题**: 查看 `/var/log/`

### 文档链接
- [数据库结构](./database-structure.md)
- [部署脚本](../deploy.sh)
- [环境配置](../.env.production)

---
*部署指南版本: 1.0*
*最后更新: 2025-07-18*
*服务器IP: 192.144.154.224*