# 🚀 AI Galaxy 部署指南

## 概述

AI Galaxy 平台支持多种部署方式，从本地开发到生产环境都有相应的解决方案。

## 📋 部署选项

### 1. Vercel 部署（推荐）
- **优势**: 零配置，自动CI/CD，全球CDN
- **适用**: 个人项目，原型验证，小规模应用
- **指南**: [Vercel 部署指南](./vercel.md)

### 2. Docker 容器化部署
- **优势**: 环境一致性，易于扩展，完整控制
- **适用**: 生产环境，团队协作，自建服务器
- **指南**: [Docker 部署指南](./docker.md)

### 3. 云服务器部署
- **优势**: 完全控制，高性能，可定制
- **适用**: 大型应用，高流量，企业级部署
- **指南**: [云服务器部署指南](./server.md)

## 🛠️ 环境配置

### 必需环境变量
```env
# 数据库连接
DATABASE_URL=postgresql://user:password@host:5432/database

# 应用配置
SESSION_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

### 可选环境变量
```env
# 应用信息
NEXT_PUBLIC_APP_NAME=AI Galaxy
NEXT_PUBLIC_APP_VERSION=2.1.5

# 第三方服务
SMTP_HOST=smtp.gmail.com
SENTRY_DSN=your-sentry-dsn
```

## 🔧 数据库设置

### PostgreSQL（推荐）
```bash
# 使用 Docker
docker run --name postgres -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres:15

# 或使用云服务
# Supabase: https://supabase.com
# Neon: https://neon.tech
# Railway: https://railway.app
```

### 初始化数据库
```bash
npx prisma db push
npm run db:seed
```

## 🚨 故障排除

### 常见问题
1. **数据库连接失败**: 检查 DATABASE_URL 格式和网络连接
2. **构建失败**: 确保所有依赖已安装，环境变量已设置
3. **部署后无法访问**: 检查防火墙和端口配置

### 调试工具
- `/api/health` - 健康检查
- `/api/debug-db` - 数据库连接诊断
- 查看部署日志获取详细错误信息

## 📞 获取帮助

- [GitHub Issues](https://github.com/Xaiver03/AIgalaxy/issues)
- [部署文档](../README.md)
- [开发指南](../DEVELOPMENT.md)