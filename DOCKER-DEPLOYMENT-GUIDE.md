# 🐳 AI Agent Platform Docker部署保姆级指南

> 📌 **本指南将手把手教你完成从零开始的Docker部署，每一步都有详细说明和截图位置提示。**

## 📋 目录

1. [准备工作](#准备工作)
2. [本地Docker镜像构建](#本地docker镜像构建)
3. [腾讯云容器镜像服务配置](#腾讯云容器镜像服务配置)
4. [推送镜像到腾讯云](#推送镜像到腾讯云)
5. [腾讯云服务器部署](#腾讯云服务器部署)
6. [验证和测试](#验证和测试)
7. [常见问题解决](#常见问题解决)

---

## 🔧 准备工作

### 需要准备的账号和工具

- [ ] **腾讯云账号** - [注册地址](https://cloud.tencent.com/)
- [ ] **本地Docker** - 已安装Docker Desktop
- [ ] **腾讯云服务器** - Ubuntu 20.04或更高版本
- [ ] **域名**（可选）- 用于HTTPS访问

### 本地环境检查

```bash
# 1. 检查Docker是否安装
docker --version
# 应该显示: Docker version 20.x.x 或更高

# 2. 检查Docker是否运行
docker ps
# 应该显示表头，没有错误

# 3. 进入项目目录
cd /Users/rocalight/同步空间/miracleplus/ai-agent-platform
pwd
# 应该显示: /Users/rocalight/同步空间/miracleplus/ai-agent-platform
```

---

## 🏗️ 本地Docker镜像构建

### 步骤1：检查Docker配置文件

```bash
# 查看Dockerfile是否存在
ls deploy/docker/Dockerfile
# 应该显示: deploy/docker/Dockerfile

# 查看docker-compose.yml
ls deploy/docker/docker-compose.yml
# 应该显示: deploy/docker/docker-compose.yml
```

### 步骤2：准备环境变量

```bash
# 1. 复制环境变量模板
cp deploy/docker/.env.example deploy/docker/.env

# 2. 打开编辑器修改配置
nano deploy/docker/.env
# 或使用你喜欢的编辑器: code deploy/docker/.env
```

**必须修改的配置项：**

```env
# 数据库密码（修改为你自己的强密码）
DB_PASSWORD=your_secure_database_password_2024

# Redis密码（修改为你自己的强密码）
REDIS_PASSWORD=your_secure_redis_password_2024

# 会话密钥（必须至少32个字符）
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-long-change-this

# 管理员邮箱（修改为你的邮箱）
ADMIN_EMAIL=your-email@example.com

# 管理员密码（修改为强密码）
ADMIN_PASSWORD=your_secure_admin_password_2024

# 域名（如果有域名就填写，没有就用IP）
DOMAIN=your-server-ip-or-domain.com
APP_URL=http://your-server-ip-or-domain.com
```

### 步骤3：构建Docker镜像

```bash
# 1. 确保在项目根目录
pwd
# 应该显示: /Users/rocalight/同步空间/miracleplus/ai-agent-platform

# 2. 构建镜像（这一步需要5-10分钟）
docker build -f deploy/docker/Dockerfile -t ai-agent-platform:latest .

# 3. 查看构建进度
# 你会看到类似这样的输出：
# [+] Building 120.5s (23/23) FINISHED
# => [internal] load build definition from Dockerfile
# => [internal] load .dockerignore
# ... 更多构建步骤 ...
```

### 步骤4：验证镜像构建成功

```bash
# 查看构建的镜像
docker images | grep ai-agent-platform

# 应该看到类似输出：
# ai-agent-platform   latest   714b87450c9e   2 minutes ago   443MB
```

**🎉 如果看到镜像信息，说明构建成功！**

---

## 🌐 腾讯云容器镜像服务配置

### 步骤1：登录腾讯云控制台

1. 打开浏览器访问：https://console.cloud.tencent.com/
2. 使用你的腾讯云账号登录
3. 在顶部搜索框输入"容器镜像服务"或"TCR"
4. 点击进入"容器镜像服务"

### 步骤2：开通容器镜像服务

如果是首次使用：
1. 点击"立即开通"
2. 选择"个人版"（免费）
3. 点击"确定开通"

### 步骤3：创建命名空间

1. 左侧菜单点击"命名空间"
2. 点击"新建"按钮
3. 填写信息：
   - **命名空间名称**: `ai-platform`（或你喜欢的名称）
   - **描述**: AI Agent Platform镜像
4. 点击"确定"

### 步骤4：获取访问凭证

1. 左侧菜单点击"访问凭证"
2. 点击"新建"按钮
3. 填写信息：
   - **用户名**: 自动生成（记录下来）
   - **密码**: 点击"生成密码"（记录下来）
4. 点击"确定"

**⚠️ 重要：请将用户名和密码保存到安全的地方！**

### 步骤5：获取镜像仓库地址

1. 左侧菜单点击"我的镜像"
2. 记录你的镜像仓库地址，格式如下：
   ```
   ccr.ccs.tencentyun.com/你的命名空间/镜像名称
   ```
   例如：`ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform`

---

## 📤 推送镜像到腾讯云

### 步骤1：登录腾讯云镜像仓库

```bash
# 1. 登录腾讯云镜像仓库
docker login ccr.ccs.tencentyun.com

# 2. 输入用户名（上一步记录的）
Username: 100012345678

# 3. 输入密码（上一步记录的）
Password: ********

# 看到 "Login Succeeded" 表示登录成功
```

### 步骤2：重新标记镜像

```bash
# 1. 标记镜像（替换命名空间为你创建的）
docker tag ai-agent-platform:latest ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform:latest

# 2. 再打一个时间戳标签
docker tag ai-agent-platform:latest ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform:$(date +%Y%m%d-%H%M)

# 3. 查看标记的镜像
docker images | grep ccr.ccs.tencentyun.com
```

### 步骤3：推送镜像到腾讯云

```bash
# 1. 推送latest标签（这一步需要几分钟，取决于网速）
docker push ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform:latest

# 你会看到上传进度：
# The push refers to repository [ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform]
# 5f70bf18a086: Pushing [==============>                ] 15.36MB/52.71MB
# ... 更多层上传 ...

# 2. 推送时间戳标签
docker push ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform:$(date +%Y%m%d-%H%M)
```

### 步骤4：验证推送成功

1. 回到腾讯云控制台
2. 点击"我的镜像"
3. 你应该看到刚推送的镜像

---

## 🖥️ 腾讯云服务器部署

### 步骤1：连接到服务器

```bash
# 使用SSH连接到你的腾讯云服务器
ssh root@你的服务器IP

# 例如：
ssh root@192.144.154.224
```

### 步骤2：安装Docker（如果未安装）

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装Docker（一键安装脚本）
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 4. 验证安装
docker --version
```

### 步骤3：登录腾讯云镜像仓库（服务器端）

```bash
# 1. 在服务器上登录镜像仓库
docker login ccr.ccs.tencentyun.com

# 2. 输入相同的用户名和密码
Username: 100012345678
Password: ********
```

### 步骤4：创建必要的目录

```bash
# 1. 创建应用目录
mkdir -p /opt/ai-agent-platform/data
mkdir -p /opt/ai-agent-platform/uploads

# 2. 设置权限
chmod -R 755 /opt/ai-agent-platform
```

### 步骤5：创建PostgreSQL数据库

```bash
# 1. 运行PostgreSQL容器
docker run -d \
  --name postgres \
  -e POSTGRES_DB=ai_galaxy \
  -e POSTGRES_USER=ai_galaxy_user \
  -e POSTGRES_PASSWORD=your_database_password \
  -p 5432:5432 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine

# 2. 验证数据库运行
docker ps | grep postgres
```

### 步骤6：创建Redis缓存服务

```bash
# 1. 运行Redis容器
docker run -d \
  --name redis \
  -p 6379:6379 \
  --restart unless-stopped \
  redis:7-alpine redis-server --requirepass your_redis_password

# 2. 验证Redis运行
docker ps | grep redis
```

### 步骤7：运行应用容器

```bash
# 1. 拉取镜像
docker pull ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform:latest

# 2. 运行应用（注意修改环境变量）
docker run -d \
  --name ai-agent-platform \
  -p 3000:3000 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/data:/app/data \
  -v /opt/ai-agent-platform/uploads:/app/public/uploads \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ai_galaxy_user:your_database_password@postgres:5432/ai_galaxy" \
  -e REDIS_URL="redis://:your_redis_password@redis:6379" \
  -e SESSION_SECRET="your-super-secret-session-key-minimum-32-characters" \
  --link postgres:postgres \
  --link redis:redis \
  ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform:latest

# 3. 查看容器状态
docker ps
```

### 步骤8：初始化数据库

```bash
# 1. 等待容器启动（约30秒）
sleep 30

# 2. 执行数据库迁移
docker exec ai-agent-platform npx prisma db push

# 3. 初始化种子数据（可选）
docker exec ai-agent-platform npm run db:seed
```

### 步骤9：配置Nginx反向代理（可选但推荐）

```bash
# 1. 安装Nginx
sudo apt install nginx -y

# 2. 创建配置文件
sudo nano /etc/nginx/sites-available/ai-agent-platform
```

粘贴以下内容：

```nginx
server {
    listen 80;
    server_name 你的域名或IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 3. 启用配置
sudo ln -s /etc/nginx/sites-available/ai-agent-platform /etc/nginx/sites-enabled/

# 4. 测试配置
sudo nginx -t

# 5. 重启Nginx
sudo systemctl restart nginx
```

---

## ✅ 验证和测试

### 步骤1：检查所有服务状态

```bash
# 查看所有运行的容器
docker ps

# 应该看到3个容器：
# - ai-agent-platform (应用)
# - postgres (数据库)
# - redis (缓存)
```

### 步骤2：查看应用日志

```bash
# 查看最新日志
docker logs ai-agent-platform --tail 50

# 持续查看日志
docker logs -f ai-agent-platform
```

### 步骤3：访问应用

1. **使用浏览器访问**：
   - 如果配置了Nginx：`http://你的服务器IP`
   - 如果没有配置Nginx：`http://你的服务器IP:3000`

2. **测试API健康检查**：
   ```bash
   curl http://localhost:3000/api/health
   # 应该返回: {"status":"healthy"}
   ```

### 步骤4：登录管理后台

1. 访问：`http://你的服务器IP/admin`
2. 使用默认账号登录：
   - 邮箱：`admin@ai-galaxy.com`
   - 密码：`admin123`
3. **⚠️ 登录后立即修改密码！**

---

## 🔧 常见问题解决

### 问题1：Docker构建失败

**错误信息**：`failed to solve: process "/bin/sh -c npm ci" did not complete successfully`

**解决方案**：
```bash
# 1. 清理Docker缓存
docker system prune -a

# 2. 重新构建（不使用缓存）
docker build --no-cache -f deploy/docker/Dockerfile -t ai-agent-platform:latest .
```

### 问题2：无法推送到腾讯云

**错误信息**：`denied: requested access to the resource is denied`

**解决方案**：
```bash
# 1. 重新登录
docker logout ccr.ccs.tencentyun.com
docker login ccr.ccs.tencentyun.com

# 2. 检查镜像标签是否正确
docker images | grep ccr.ccs.tencentyun.com
```

### 问题3：容器无法启动

**错误信息**：`docker: Error response from daemon: Conflict`

**解决方案**：
```bash
# 1. 停止并删除旧容器
docker stop ai-agent-platform
docker rm ai-agent-platform

# 2. 重新运行容器
docker run -d ... # 使用上面的完整命令
```

### 问题4：数据库连接失败

**错误信息**：`PrismaClientInitializationError: Can't reach database`

**解决方案**：
```bash
# 1. 检查数据库容器状态
docker ps | grep postgres

# 2. 查看数据库日志
docker logs postgres

# 3. 测试数据库连接
docker exec postgres psql -U ai_galaxy_user -d ai_galaxy -c "SELECT 1;"
```

### 问题5：网站无法访问

**检查清单**：
```bash
# 1. 检查容器是否运行
docker ps | grep ai-agent-platform

# 2. 检查端口是否被占用
sudo netstat -tlnp | grep 3000

# 3. 检查防火墙
sudo ufw status

# 4. 开放端口（如果需要）
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
```

---

## 📱 后续维护

### 更新应用

```bash
# 1. 拉取最新镜像
docker pull ccr.ccs.tencentyun.com/ai-platform/ai-agent-platform:latest

# 2. 停止旧容器
docker stop ai-agent-platform
docker rm ai-agent-platform

# 3. 运行新容器（使用相同的运行命令）
docker run -d ... # 完整命令

# 4. 清理旧镜像
docker image prune -f
```

### 备份数据

```bash
# 1. 备份数据库
docker exec postgres pg_dump -U ai_galaxy_user ai_galaxy > backup_$(date +%Y%m%d).sql

# 2. 备份上传文件
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /opt/ai-agent-platform/uploads
```

### 查看资源使用

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

---

## 🎉 恭喜！

如果你按照以上步骤操作，你的AI Agent Platform应该已经成功部署并运行了！

**需要帮助？**
- 查看应用日志：`docker logs ai-agent-platform`
- 检查容器状态：`docker ps`
- 查看详细文档：[部署文档](./deploy/README.md)

---

**最后更新**: 2025-08-20  
**版本**: 保姆级指南 v1.0