# 🔧 修复 Vercel DATABASE_URL 特殊字符问题

## 问题
您的密码包含特殊字符 `#`，在 URL 中需要编码为 `%23`。

## 原始连接字符串
```
postgresql://postgres.xjvnzhpgzdabxgkbxxwx:xT#Uxs7uB-FfTjD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 正确的连接字符串
```
postgresql://postgres.xjvnzhpgzdabxgkbxxwx:xT%23Uxs7uB-FfTjD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 在 Vercel 中设置

1. 进入 Vercel Dashboard → Settings → Environment Variables
2. 更新 `DATABASE_URL` 为：
   ```
   postgresql://postgres.xjvnzhpgzdabxgkbxxwx:xT%23Uxs7uB-FfTjD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

3. 如果您还设置了其他 Postgres 变量，也需要更新：
   ```
   POSTGRES_PRISMA_URL=postgresql://postgres.xjvnzhpgzdabxgkbxxwx:xT%23Uxs7uB-FfTjD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   POSTGRES_URL=postgresql://postgres.xjvnzhpgzdabxgkbxxwx:xT%23Uxs7uB-FfTjD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

## URL 编码参考

| 字符 | 编码 |
|------|------|
| `#` | `%23` |
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `&` | `%26` |
| `=` | `%3D` |
| `+` | `%2B` |
| ` ` | `%20` |

## 验证步骤

1. 更新环境变量后，重新部署
2. 访问 `https://your-app.vercel.app/api/init-db`
3. 应该看到成功的数据库连接信息

## 提示
- 在 Vercel 环境变量设置中，不需要加引号
- 确保没有多余的空格
- 保存后需要重新部署才会生效