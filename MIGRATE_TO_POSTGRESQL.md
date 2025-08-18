# 数据库迁移指南：从 SQLite 到 PostgreSQL

## 为什么需要迁移？

**关键问题**：SQLite 在 Vercel 的 serverless 环境中无法正常工作，因为：
- 每个 API 函数调用都会创建独立的数据库文件
- 数据在函数容器销毁时丢失
- 不同函数之间无法共享数据

**解决方案**：迁移到云数据库（PostgreSQL）实现真正的数据持久化。

## 快速迁移步骤

### 1. 设置云数据库（选择其中一种）

#### 选项 A：Vercel Postgres（推荐）
1. 登录 Vercel Dashboard
2. 进入你的项目
3. 点击 Storage → Create Database → Postgres
4. 数据库创建后，Vercel 会自动设置环境变量

#### 选项 B：Neon（免费）
1. 访问 https://neon.tech
2. 创建账户和数据库
3. 复制连接字符串

#### 选项 C：Supabase（免费）
1. 访问 https://supabase.com
2. 创建项目
3. 从设置中获取数据库连接字符串

### 2. 设置本地环境变量

创建 `.env` 文件：
```bash
cp .env.example .env
```

更新 `.env` 文件中的 `DATABASE_URL`：
```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

### 3. 运行迁移

```bash
# 生成并运行迁移
npx prisma migrate dev --name init

# 生成 Prisma 客户端
npx prisma generate

# （可选）查看数据库
npx prisma studio
```

### 4. 部署到 Vercel

```bash
git add .
git commit -m "feat: migrate to PostgreSQL for persistent data storage"
git push
```

### 5. 在 Vercel 中设置环境变量

如果不是使用 Vercel Postgres：
1. 进入 Vercel Dashboard → 项目设置
2. Environment Variables
3. 添加 `DATABASE_URL` 变量

## 迁移已完成的更改

✅ 已更新 `prisma/schema.prisma` 使用 PostgreSQL  
✅ 已添加 PostgreSQL 数据类型支持（arrays, enums）  
✅ 已简化 Prisma 客户端配置  
✅ 已移除 SQLite 特定的初始化代码  
✅ 已安装 PostgreSQL 依赖  

## 验证迁移成功

迁移完成后，测试以下功能：
1. 管理员登录：http://yourapp.vercel.app/admin/login
2. 添加新工具
3. 刷新页面确认数据保持存在
4. 在不同设备/浏览器中访问确认数据持久化

## 故障排除

**连接错误**：检查数据库 URL 格式是否正确  
**权限错误**：确保数据库用户有创建表的权限  
**迁移失败**：删除 `prisma/migrations` 文件夹重新开始

## 数据库连接字符串格式

```
postgresql://[username]:[password]@[host]:[port]/[database]?[parameters]
```

示例：
```
postgresql://user:pass@localhost:5432/mydb
postgresql://user:pass@aws-rds-endpoint.com:5432/prod_db
```