# Vercel 环境变量配置

## 关键环境变量

```bash
# 数据库配置
DATABASE_URL="file:./tmp/production.db"

# JWT配置
JWT_SECRET="your-production-secret-key-here"

# Next.js配置
NODE_ENV="production"
```

## 在Vercel Dashboard设置：

1. 进入项目设置 → Environment Variables
2. 添加以下变量：

- `DATABASE_URL` = `file:./tmp/production.db`
- `JWT_SECRET` = `生产环境密钥`

## 注意事项：

- SQLite在Vercel无服务器环境中可能有限制
- 考虑升级到PostgreSQL或其他云数据库
- 临时文件夹 `/tmp` 在每次部署后会重置