# 🚀 AI Galaxy Platform - 容器化部署指南

## 概述

本指南提供了在腾讯云 Ubuntu 服务器上完整部署 AI Galaxy Platform 的详细步骤，包括前端、后端和 PostgreSQL 数据库的容器化部署。

## 🏗️ 架构概览

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   AI Galaxy     │    │   PostgreSQL    │
│  (Reverse Proxy)│───▶│     App         │───▶│    Database     │
│   Port 80/443   │    │   Port 3000     │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │     Redis       │             │
         └──────────────│   (Caching)     │─────────────┘
                        │   Port 6379     │
                        └─────────────────┘
```

## 📋 系统要求

### 最低要求
- **操作系统**: Ubuntu 20.04 LTS 或更高版本
- **内存**: 2GB RAM
- **存储**: 20GB 可用空间
- **网络**: 公网 IP 地址

### 推荐配置
- **内存**: 4GB+ RAM
- **存储**: 50GB+ SSD
- **CPU**: 2 核心+

## 🛠️ 快速部署

### 方法一：一键部署（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Xaiver03/AIgalaxy.git
cd AIgalaxy

# 2. 运行部署脚本
sudo chmod +x deploy/scripts/deploy.sh
./deploy/scripts/deploy.sh
```

### 方法二：手动部署

#### 步骤 1：安装 Docker

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 将用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录或运行
newgrp docker
```

#### 步骤 2：准备项目文件

```bash
# 创建项目目录
sudo mkdir -p /opt/ai-galaxy
sudo chown $USER:$USER /opt/ai-galaxy

# 克隆项目
git clone https://github.com/Xaiver03/AIgalaxy.git /opt/ai-galaxy
cd /opt/ai-galaxy
```

#### 步骤 3：配置环境变量

```bash
# 复制环境变量模板
cp deploy/docker/.env.example deploy/docker/.env

# 编辑环境变量（重要！）
nano deploy/docker/.env
```

必须修改的配置：
```env
# 数据库密码（必须修改）
DB_PASSWORD=your_secure_database_password

# Redis 密码（必须修改）
REDIS_PASSWORD=your_secure_redis_password

# 会话密钥（必须修改，至少32字符）
SESSION_SECRET=your_super_secret_session_key_minimum_32_characters

# 管理员邮箱和密码
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_admin_password

# 域名配置
DOMAIN=your-domain.com
APP_URL=https://your-domain.com
```

#### 步骤 4：生成 SSL 证书

```bash
# 为测试生成自签名证书
mkdir -p deploy/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout deploy/nginx/ssl/private.key \
    -out deploy/nginx/ssl/cert.pem \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=AI Galaxy/CN=localhost"
```

#### 步骤 5：启动服务

```bash
# 构建并启动所有服务
docker compose -f deploy/docker/docker-compose.yml --env-file deploy/docker/.env up -d --build

# 等待服务启动
sleep 30

# 初始化数据库
docker compose -f deploy/docker/docker-compose.yml exec app npx prisma db push
docker compose -f deploy/docker/docker-compose.yml exec app npm run db:seed
```

## 🎯 访问应用

部署完成后，您可以通过以下地址访问：

- **主应用**: `http://your-server-ip`
- **管理后台**: `http://your-server-ip/admin`
- **数据库管理**: `http://your-server-ip:8080` (Adminer)
- **容器管理**: `http://your-server-ip:9000` (Portainer)

### 默认登录信息

**管理员账户**:
- 邮箱: `admin@ai-galaxy.com`
- 密码: `admin123`

⚠️ **重要**: 首次登录后请立即修改默认密码！

## 🔧 日常管理

### 使用管理脚本

项目包含一个便捷的管理脚本：

```bash
# 将管理脚本添加到 PATH
sudo ln -s /opt/ai-galaxy/deploy/scripts/manage.sh /usr/local/bin/ai-galaxy

# 常用命令
ai-galaxy start      # 启动服务
ai-galaxy stop       # 停止服务
ai-galaxy restart    # 重启服务
ai-galaxy status     # 查看状态
ai-galaxy logs       # 查看日志
ai-galaxy update     # 更新应用
ai-galaxy backup     # 创建备份
ai-galaxy shell      # 进入应用容器
ai-galaxy db         # 数据库管理
ai-galaxy tools      # 启动开发工具
ai-galaxy ssl        # SSL 证书管理
```

### 手动 Docker 命令

```bash
# 查看服务状态
docker compose -f deploy/docker/docker-compose.yml ps

# 查看日志
docker compose -f deploy/docker/docker-compose.yml logs -f app

# 重启特定服务
docker compose -f deploy/docker/docker-compose.yml restart app

# 进入应用容器
docker compose -f deploy/docker/docker-compose.yml exec app sh

# 数据库备份
docker exec ai-galaxy-db pg_dump -U ai_galaxy_user ai_galaxy > backup.sql
```

## 🔒 安全配置

### 1. 防火墙设置

```bash
# 配置 UFW 防火墙
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 允许必要端口
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw --force enable
```

### 2. SSL 证书配置

#### 使用 Let's Encrypt（推荐）

```bash
# 安装 certbot
sudo apt install certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com

# 复制证书到项目目录
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem deploy/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem deploy/nginx/ssl/private.key
sudo chown $USER:$USER deploy/nginx/ssl/*

# 重启 nginx
docker compose -f deploy/docker/docker-compose.yml restart nginx
```

### 3. 定期更新

```bash
# 创建自动更新脚本
echo '#!/bin/bash
cd /opt/ai-galaxy
git pull origin main
docker compose -f deploy/docker/docker-compose.yml up -d --build
' | sudo tee /usr/local/bin/ai-galaxy-update.sh

sudo chmod +x /usr/local/bin/ai-galaxy-update.sh

# 添加定时任务（每周自动更新）
(crontab -l; echo "0 2 * * 0 /usr/local/bin/ai-galaxy-update.sh") | crontab -
```

## 📊 监控和备份

### 自动备份

部署脚本会自动设置每日备份：

```bash
# 手动创建备份
sudo /usr/local/bin/ai-galaxy-backup.sh

# 查看备份
ls -la /opt/ai-galaxy-backups/
```

### 日志监控

```bash
# 应用日志
docker logs ai-galaxy-app

# 数据库日志
docker logs ai-galaxy-db

# Nginx 日志
docker logs ai-galaxy-nginx

# 系统部署日志
tail -f /var/log/ai-galaxy-deploy.log
```

## 🚨 故障排除

### 常见问题

#### 1. 容器启动失败
```bash
# 检查日志
docker compose -f deploy/docker/docker-compose.yml logs

# 检查磁盘空间
df -h

# 检查内存使用
free -h
```

#### 2. 数据库连接失败
```bash
# 检查数据库容器
docker logs ai-galaxy-db

# 测试数据库连接
docker exec ai-galaxy-db psql -U ai_galaxy_user -d ai_galaxy -c "SELECT 1;"
```

#### 3. 应用无法访问
```bash
# 检查端口占用
sudo netstat -tlnp | grep :80

# 检查防火墙状态
sudo ufw status

# 重启 nginx
docker compose -f deploy/docker/docker-compose.yml restart nginx
```

### 性能优化

#### 1. 数据库优化
```bash
# 进入数据库容器
docker exec -it ai-galaxy-db psql -U ai_galaxy_user -d ai_galaxy

# 运行性能分析
EXPLAIN ANALYZE SELECT * FROM agents WHERE enabled = true;
```

#### 2. 内存优化
```bash
# 调整 Docker 内存限制
# 编辑 docker-compose.yml，为每个服务添加：
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

## 📱 域名和生产环境配置

### 1. 域名配置

1. 在域名服务商设置 A 记录指向服务器 IP
2. 更新 `.env` 文件中的域名配置
3. 获取并配置 SSL 证书
4. 重启服务

### 2. 生产环境优化

```env
# 生产环境变量示例
NODE_ENV=production
DB_PASSWORD=超强密码
REDIS_PASSWORD=超强密码
SESSION_SECRET=至少32位随机字符串
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=超强管理员密码
DOMAIN=yourdomain.com
APP_URL=https://yourdomain.com
```

## 🆙 更新和维护

### 版本更新

```bash
# 使用管理脚本更新
ai-galaxy update

# 或手动更新
cd /opt/ai-galaxy
git pull origin main
docker compose -f deploy/docker/docker-compose.yml up -d --build
```

### 数据迁移

```bash
# 导出数据
docker exec ai-galaxy-db pg_dump -U ai_galaxy_user ai_galaxy > migration.sql

# 导入新服务器
docker exec -i ai-galaxy-db psql -U ai_galaxy_user -d ai_galaxy < migration.sql
```

## 📞 技术支持

如遇问题，请查看：

1. **项目文档**: [GitHub Repository](https://github.com/Xaiver03/AIgalaxy)
2. **Issue 反馈**: [GitHub Issues](https://github.com/Xaiver03/AIgalaxy/issues)
3. **部署日志**: `/var/log/ai-galaxy-deploy.log`

---

**祝您部署顺利！** 🎉