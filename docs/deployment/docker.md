# 🐳 Docker 容器化部署指南

## 概述

Docker 部署方案提供了完整的技术栈，包括前端、后端、数据库和反向代理的一体化部署。

## 🏗️ 架构组件

- **应用容器**: Next.js 14 应用
- **数据库**: PostgreSQL 15
- **缓存**: Redis 7
- **反向代理**: Nginx
- **监控工具**: Adminer, Portainer（可选）

## 🚀 快速开始

### 前提条件
- Docker 20.10+
- Docker Compose 2.0+
- 2GB+ 内存
- 10GB+ 磁盘空间

### 一键部署
```bash
# 克隆项目
git clone https://github.com/Xaiver03/AIgalaxy.git
cd AIgalaxy

# 配置环境变量
cp deploy/docker/.env.example deploy/docker/.env
nano deploy/docker/.env

# 启动服务
docker compose -f deploy/docker/docker-compose.yml up -d
```

## ⚙️ 环境配置

### 必需配置
编辑 `deploy/docker/.env`:

```env
# 数据库密码（必须修改）
DB_PASSWORD=your_secure_database_password

# Redis 密码（必须修改）  
REDIS_PASSWORD=your_secure_redis_password

# 会话密钥（必须修改，至少32字符）
SESSION_SECRET=your_super_secret_session_key_minimum_32_characters

# 管理员配置
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_admin_password

# 域名配置
DOMAIN=your-domain.com
APP_URL=https://your-domain.com
```

### SSL 证书配置

#### 开发环境（自签名证书）
```bash
mkdir -p deploy/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout deploy/nginx/ssl/private.key \
    -out deploy/nginx/ssl/cert.pem \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=AI Galaxy/CN=localhost"
```

#### 生产环境（Let's Encrypt）
```bash
# 安装 certbot
sudo apt install certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com

# 复制证书
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem deploy/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem deploy/nginx/ssl/private.key
```

## 🎯 服务管理

### 启动服务
```bash
docker compose -f deploy/docker/docker-compose.yml up -d
```

### 查看状态
```bash
docker compose -f deploy/docker/docker-compose.yml ps
```

### 查看日志
```bash
# 所有服务日志
docker compose -f deploy/docker/docker-compose.yml logs -f

# 特定服务日志
docker compose -f deploy/docker/docker-compose.yml logs -f app
docker compose -f deploy/docker/docker-compose.yml logs -f postgres
```

### 停止服务
```bash
docker compose -f deploy/docker/docker-compose.yml down
```

### 重启服务
```bash
docker compose -f deploy/docker/docker-compose.yml restart
```

## 🗄️ 数据库管理

### 数据库备份
```bash
docker exec ai-galaxy-db pg_dump -U ai_galaxy_user ai_galaxy > backup.sql
```

### 数据库恢复
```bash
docker exec -i ai-galaxy-db psql -U ai_galaxy_user -d ai_galaxy < backup.sql
```

### 数据库控制台
```bash
docker exec -it ai-galaxy-db psql -U ai_galaxy_user -d ai_galaxy
```

### 重置数据库
```bash
docker compose -f deploy/docker/docker-compose.yml exec app npx prisma db push --force-reset
docker compose -f deploy/docker/docker-compose.yml exec app npm run db:seed
```

## 📊 监控和维护

### 访问地址
- **主应用**: `http://your-server-ip`
- **管理后台**: `http://your-server-ip/admin`
- **数据库管理**: `http://your-server-ip:8080` (Adminer)
- **容器管理**: `http://your-server-ip:9000` (Portainer)

### 启动监控工具
```bash
docker compose -f deploy/docker/docker-compose.yml --profile tools up -d
```

### 资源监控
```bash
docker stats
```

### 磁盘使用
```bash
docker system df
```

## 🔧 性能优化

### 内存限制
在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 数据库优化
```sql
-- 连接数据库后执行
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
SELECT pg_reload_conf();
```

### Nginx 缓存
在 `deploy/nginx/nginx.conf` 中已配置：
- 静态文件缓存
- Gzip 压缩
- 连接池优化

## 🚨 故障排除

### 常见问题

#### 容器启动失败
```bash
# 检查容器状态
docker ps -a

# 查看启动日志
docker logs ai-galaxy-app

# 检查资源使用
free -h
df -h
```

#### 数据库连接失败
```bash
# 检查数据库容器
docker logs ai-galaxy-db

# 测试连接
docker exec ai-galaxy-db pg_isready -U ai_galaxy_user
```

#### 应用无法访问
```bash
# 检查端口占用
netstat -tlnp | grep :80

# 检查 Nginx 配置
docker exec ai-galaxy-nginx nginx -t

# 重启 Nginx
docker restart ai-galaxy-nginx
```

### 健康检查
```bash
# 应用健康检查
curl http://localhost:3000/api/health

# 数据库健康检查
docker exec ai-galaxy-db pg_isready -U ai_galaxy_user
```

## 🔄 更新部署

### 更新应用代码
```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker compose -f deploy/docker/docker-compose.yml up -d --build
```

### 更新依赖
```bash
# 重新构建镜像
docker compose -f deploy/docker/docker-compose.yml build --no-cache app
docker compose -f deploy/docker/docker-compose.yml up -d app
```

## 📦 备份和恢复

### 完整备份脚本
```bash
#!/bin/bash
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 备份数据库
docker exec ai-galaxy-db pg_dump -U ai_galaxy_user ai_galaxy > "$BACKUP_DIR/database.sql"

# 备份上传文件
docker cp ai-galaxy-app:/app/public/uploads "$BACKUP_DIR/"

# 备份配置
cp deploy/docker/.env "$BACKUP_DIR/"

# 压缩备份
tar -czf "$BACKUP_DIR.tar.gz" -C backups "$(basename "$BACKUP_DIR")"
rm -rf "$BACKUP_DIR"

echo "Backup completed: $BACKUP_DIR.tar.gz"
```

## 🔐 安全配置

### 防火墙设置
```bash
# 安装 UFW
sudo apt install ufw

# 基本配置
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### SSL 强化
在 `deploy/nginx/nginx.conf` 中已包含：
- 现代 SSL 协议
- 安全的加密套件
- HSTS 头
- 安全响应头

Docker 部署方案提供了生产级的稳定性和可扩展性，适合各种规模的部署需求。