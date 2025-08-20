# 🚀 AI Galaxy 部署指南

## 概述

AI Galaxy 平台支持多种部署方式，从本地开发到生产环境都有相应的解决方案。

## 📋 部署选项

### 1. GitHub Actions自动化部署（推荐）
- **优势**: 完全自动化，推送即部署，容器化架构
- **适用**: 生产环境，团队协作，持续集成
- **指南**: 
  - [GitHub Actions设置](./GITHUB-ACTIONS-SETUP.md)
  - [GitHub Secrets配置](./GITHUB-SECRETS-SETUP.md)
  - [Docker工作流说明](./.github/workflows/docker-deploy.yml)

### 2. Docker容器化部署
- **优势**: 环境一致性，易于扩展，完整控制
- **适用**: 自建服务器，私有云，本地测试
- **指南**: 
  - [Docker部署指南](./docker.md)
  - [部署目录完整说明](../../deploy/README.md)

### 3. Vercel部署
- **优势**: 零配置，自动CI/CD，全球CDN
- **适用**: 个人项目，原型验证，小规模应用
- **指南**: [Vercel部署指南](./vercel.md)

### 4. 传统服务器部署
- **优势**: 完全控制，高性能，可定制
- **适用**: 大型应用，高流量，特殊需求
- **指南**: [通用部署指南](./DEPLOYMENT.md)

## 🛠️ 环境配置

### 必需环境变量
```env
# 数据库连接（PostgreSQL必需）
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis连接（用于缓存和会话）
REDIS_URL=redis://:password@host:6379

# 应用配置
SESSION_SECRET=your-secret-key-minimum-32-chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

### 可选环境变量
```env
# 应用信息
NEXT_PUBLIC_APP_NAME=AI Galaxy
NEXT_PUBLIC_APP_VERSION=2.1.5
DOMAIN=ai-galaxy.example.com
APP_URL=https://ai-galaxy.example.com

# 第三方服务
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENTRY_DSN=your-sentry-dsn
```

## 🔧 数据库设置

### PostgreSQL（必需）
```bash
# 使用Docker
docker run --name postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ai_galaxy \
  -p 5432:5432 \
  -d postgres:15

# 或使用云服务
# - 腾讯云数据库: https://cloud.tencent.com/product/cdb
# - 阿里云RDS: https://www.aliyun.com/product/rds
# - Supabase: https://supabase.com
# - Neon: https://neon.tech
```

### Redis（推荐）
```bash
# 使用Docker
docker run --name redis \
  -p 6379:6379 \
  -d redis:7-alpine \
  redis-server --requirepass yourpassword

# 或使用云服务
# - 腾讯云Redis: https://cloud.tencent.com/product/redis
# - 阿里云Redis: https://www.aliyun.com/product/kvstore
```

### 初始化数据库
```bash
# 生成Prisma客户端
npx prisma generate

# 推送数据库架构
npx prisma db push

# 初始化种子数据
npm run db:seed
```

## 🚀 快速开始

### 方式1: GitHub Actions自动化（推荐）

1. **Fork仓库到你的GitHub**
2. **配置GitHub Secrets**（[详细指南](./GITHUB-SECRETS-SETUP.md)）
3. **推送代码自动部署**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```
4. **监控部署状态**：GitHub Actions页面

### 方式2: Docker Compose快速部署

```bash
# 克隆项目
git clone https://github.com/Xaiver03/AIgalaxy.git
cd AIgalaxy

# 配置环境变量
cp deploy/docker/.env.example deploy/docker/.env
# 编辑.env文件

# 启动服务
docker compose -f deploy/docker/docker-compose.yml up -d

# 查看状态
docker compose ps
```

## 🚨 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查DATABASE_URL格式：`postgresql://user:pass@host:port/db`
   - 确认PostgreSQL服务运行中
   - 验证网络连接和防火墙

2. **Docker构建失败**
   - 检查Dockerfile路径：`deploy/docker/Dockerfile`
   - 清理缓存重建：`docker build --no-cache`
   - 查看详细日志排查

3. **GitHub Actions失败**
   - 检查Secrets配置完整性
   - 查看Actions日志定位问题
   - 验证镜像仓库访问权限

### 调试工具
- **健康检查**: `/api/health`
- **数据库诊断**: `/api/debug-db`
- **容器日志**: `docker logs ai-agent-platform`
- **PM2日志**: `pm2 logs ai-agent-platform`

## 📊 部署架构图

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub Repo   │────▶│ GitHub Actions  │────▶│   TCR/Docker    │
│  (Source Code)  │     │  (Build & Push) │     │  (Image Repo)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Nginx       │◀────│   AI Galaxy     │────▶│   PostgreSQL    │
│  (Reverse Proxy)│     │   Container     │     │    Database     │
│   Port 80/443   │     │   Port 3000     │     │   Port 5432     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │     Redis       │
                        │   (Caching)     │
                        │   Port 6379     │
                        └─────────────────┘
```

## 📞 获取帮助

- **GitHub Issues**: [提交问题](https://github.com/Xaiver03/AIgalaxy/issues)
- **部署文档**: [完整文档](../../deploy/README.md)
- **开发指南**: [开发文档](../DEVELOPMENT.md)
- **Docker配置**: [Dockerfile](../../deploy/docker/Dockerfile)

---

📅 更新时间: 2025-08-20  
📝 版本: v2.1.5