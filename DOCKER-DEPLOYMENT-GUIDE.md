# 🐳 AI Agent Platform Docker部署保姆级指南

> 📌 **本指南将手把手教你完成从零开始的Docker部署，提供多种经济实惠的镜像仓库选择。**

## 📋 目录

1. [准备工作](#准备工作)
2. [本地Docker镜像构建](#本地docker镜像构建)
3. [镜像仓库选择（3种方案）](#镜像仓库选择)
4. [推送镜像](#推送镜像)
5. [腾讯云服务器部署](#腾讯云服务器部署)
6. [验证和测试](#验证和测试)
7. [常见问题解决](#常见问题解决)

---

## 🔧 准备工作

### 需要准备的账号和工具

- [ ] **腾讯云服务器** - Ubuntu 20.04或更高版本
- [ ] **本地Docker** - 已安装Docker Desktop
- [ ] **镜像仓库账号**（选择一种即可）：
  - [ ] **Docker Hub账号**（推荐，免费）
  - [ ] **阿里云容器镜像服务**（免费）
  - [ ] **腾讯云容器镜像服务**（付费，但速度快）
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

## 📦 镜像仓库选择

选择一种适合你的镜像仓库方案：

### 方案1：Docker Hub（推荐，免费）

**优势**：
- ✅ 完全免费
- ✅ 全球CDN加速
- ✅ 简单易用
- ✅ 支持私有仓库（免费1个）

**注册地址**：https://hub.docker.com/

**步骤**：
1. 注册Docker Hub账号
2. 登录并创建仓库（可选私有）

### 方案2：阿里云容器镜像服务（推荐，免费）

**优势**：
- ✅ 完全免费
- ✅ 国内访问速度快
- ✅ 个人版支持私有仓库
- ✅ 中文界面友好

**注册地址**：https://cr.console.aliyun.com/

**步骤**：
1. 注册阿里云账号
2. 开通容器镜像服务（个人版免费）
3. 创建命名空间

### 方案3：直接传输镜像文件（最省钱）

**优势**：
- ✅ 完全免费
- ✅ 不依赖外部服务
- ✅ 适合小团队

**缺点**：
- ❌ 需要手动传输文件
- ❌ 更新时需要重新传输

---

## 📤 推送镜像

### 方案1：推送到Docker Hub

```bash
# 1. 登录Docker Hub
docker login

# 输入你的Docker Hub用户名和密码
Username: your-dockerhub-username
Password: your-dockerhub-password

# 2. 标记镜像（替换your-username为你的用户名）
docker tag ai-agent-platform:latest your-username/ai-agent-platform:latest
docker tag ai-agent-platform:latest your-username/ai-agent-platform:$(date +%Y%m%d-%H%M)

# 3. 推送镜像
docker push your-username/ai-agent-platform:latest
docker push your-username/ai-agent-platform:$(date +%Y%m%d-%H%M)

# 4. 验证推送成功
# 访问: https://hub.docker.com/r/your-username/ai-agent-platform
```

### 方案2：推送到阿里云

```bash
# 1. 登录阿里云镜像仓库
docker login --username=your-aliyun-username registry.cn-hangzhou.aliyuncs.com

# 2. 标记镜像
docker tag ai-agent-platform:latest registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest

# 3. 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest
```

### 方案3：直接传输镜像文件

```bash
# 1. 将镜像保存为文件
docker save ai-agent-platform:latest -o ai-agent-platform.tar

# 2. 压缩文件
gzip ai-agent-platform.tar

# 3. 上传到服务器
scp ai-agent-platform.tar.gz root@your-server-ip:/tmp/

# 4. 在服务器上加载镜像
ssh root@your-server-ip
cd /tmp
gunzip ai-agent-platform.tar.gz
docker load -i ai-agent-platform.tar
```

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

### 步骤3：配置Docker镜像加速（可选但推荐）

```bash
# 创建Docker配置目录
sudo mkdir -p /etc/docker

# 配置镜像加速器（使用阿里云加速器）
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF

# 重启Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 步骤4：创建必要的目录

```bash
# 1. 创建应用目录
mkdir -p /opt/ai-agent-platform/data
mkdir -p /opt/ai-agent-platform/uploads

# 2. 设置权限
chmod -R 755 /opt/ai-agent-platform
```

### 步骤5：创建网络（推荐）

```bash
# 创建自定义Docker网络
docker network create ai-network
```

### 步骤6：创建PostgreSQL数据库

```bash
# 1. 运行PostgreSQL容器
docker run -d \
  --name postgres \
  --network ai-network \
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

### 步骤7：创建Redis缓存服务

```bash
# 1. 运行Redis容器
docker run -d \
  --name redis \
  --network ai-network \
  -p 6379:6379 \
  --restart unless-stopped \
  redis:7-alpine redis-server --requirepass your_redis_password

# 2. 验证Redis运行
docker ps | grep redis
```

### 步骤8：运行应用容器

**选择对应的镜像源**：

#### 使用Docker Hub镜像

```bash
# 1. 拉取镜像
docker pull your-username/ai-agent-platform:latest

# 2. 运行应用
docker run -d \
  --name ai-agent-platform \
  --network ai-network \
  -p 3000:3000 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/data:/app/data \
  -v /opt/ai-agent-platform/uploads:/app/public/uploads \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ai_galaxy_user:your_database_password@postgres:5432/ai_galaxy" \
  -e REDIS_URL="redis://:your_redis_password@redis:6379" \
  -e SESSION_SECRET="your-super-secret-session-key-minimum-32-characters" \
  your-username/ai-agent-platform:latest
```

#### 使用阿里云镜像

```bash
# 1. 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest

# 2. 运行应用
docker run -d \
  --name ai-agent-platform \
  --network ai-network \
  -p 3000:3000 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/data:/app/data \
  -v /opt/ai-agent-platform/uploads:/app/public/uploads \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ai_galaxy_user:your_database_password@postgres:5432/ai_galaxy" \
  -e REDIS_URL="redis://:your_redis_password@redis:6379" \
  -e SESSION_SECRET="your-super-secret-session-key-minimum-32-characters" \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest
```

#### 使用本地镜像文件

```bash
# 如果使用了方案3，镜像已经加载到本地，直接运行：
docker run -d \
  --name ai-agent-platform \
  --network ai-network \
  -p 3000:3000 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/data:/app/data \
  -v /opt/ai-agent-platform/uploads:/app/public/uploads \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ai_galaxy_user:your_database_password@postgres:5432/ai_galaxy" \
  -e REDIS_URL="redis://:your_redis_password@redis:6379" \
  -e SESSION_SECRET="your-super-secret-session-key-minimum-32-characters" \
  ai-agent-platform:latest
```

### 步骤9：初始化数据库

```bash
# 1. 等待容器启动（约30秒）
sleep 30

# 2. 执行数据库迁移
docker exec ai-agent-platform npx prisma db push

# 3. 初始化种子数据（可选）
docker exec ai-agent-platform npm run db:seed
```

### 步骤10：配置Nginx反向代理（可选但推荐）

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

## 💰 成本对比

| 方案 | 月费用 | 优点 | 缺点 |
|------|--------|------|------|
| Docker Hub | 免费 | 全球CDN，稳定 | 国内访问可能较慢 |
| 阿里云镜像服务 | 免费 | 国内访问快，中文界面 | 仅限国内 |
| 文件传输 | 免费 | 完全免费，无限制 | 手动操作，更新麻烦 |
| 腾讯云TCR | ¥1.2/GB/月 | 速度最快，功能强大 | 有费用 |

## 🔄 更新部署流程

### 使用Docker Hub/阿里云

```bash
# 1. 本地重新构建镜像
docker build -f deploy/docker/Dockerfile -t ai-agent-platform:latest .

# 2. 推送新镜像
docker push your-username/ai-agent-platform:latest

# 3. 服务器更新
ssh root@your-server-ip
docker pull your-username/ai-agent-platform:latest
docker stop ai-agent-platform
docker rm ai-agent-platform
# 重新运行容器（使用上面的命令）
```

### 使用文件传输

```bash
# 1. 本地重新构建并保存
docker build -f deploy/docker/Dockerfile -t ai-agent-platform:latest .
docker save ai-agent-platform:latest | gzip > ai-agent-platform.tar.gz

# 2. 上传到服务器
scp ai-agent-platform.tar.gz root@your-server-ip:/tmp/

# 3. 服务器更新
ssh root@your-server-ip
docker load -i /tmp/ai-agent-platform.tar.gz
docker stop ai-agent-platform
docker rm ai-agent-platform
# 重新运行容器
```

---

## 🚨 常见问题解决

### 问题1：推送到Docker Hub失败

**错误信息**：`denied: requested access to the resource is denied`

**解决方案**：
```bash
# 1. 重新登录
docker logout
docker login

# 2. 检查镜像名称是否正确
docker images | grep your-username
```

### 问题2：国内访问Docker Hub慢

**解决方案**：
```bash
# 使用镜像加速器
sudo nano /etc/docker/daemon.json
# 添加镜像加速器配置（如上文所示）
```

### 问题3：服务器磁盘空间不足

**解决方案**：
```bash
# 清理无用的镜像和容器
docker system prune -a

# 查看磁盘使用
df -h
```

---

## 📝 总结

**推荐方案排序**：

1. **Docker Hub**（最简单，免费）
2. **阿里云镜像服务**（国内用户推荐）
3. **文件传输**（小项目或内网环境）
4. **腾讯云TCR**（预算充足，追求极致性能）

选择适合你的方案，按照对应的步骤操作即可！

---

**最后更新**: 2025-08-20  
**版本**: 经济实用版 v2.0