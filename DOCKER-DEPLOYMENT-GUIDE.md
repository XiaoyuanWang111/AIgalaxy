# 🐳 AI Agent Platform Docker部署指南

## 📦 本地Docker镜像构建完成

### ✅ 构建状态
- **镜像名称**: `ai-agent-platform:latest`
- **镜像ID**: `714b87450c9e`
- **镜像大小**: 443MB
- **构建时间**: 2025-08-20 13:08
- **标签**: `ai-agent-platform:20250820-1308`

### 🔧 镜像配置
- **基础镜像**: Node.js 18 Alpine Linux
- **架构**: 多阶段构建优化
- **应用端口**: 3000
- **健康检查**: ✅ 已配置
- **用户权限**: 非root用户运行

## 🚀 推送到腾讯云服务器准备

### 第一步：腾讯云容器镜像服务配置

#### 1. 登录腾讯云容器镜像服务
```bash
# 替换为你的腾讯云镜像仓库地址
docker login ccr.ccs.tencentyun.com
```

#### 2. 创建镜像仓库（在腾讯云控制台）
- 登录腾讯云容器镜像服务 TCR
- 创建命名空间：`ai-agent-platform`
- 创建镜像仓库：`ai-agent-platform`

#### 3. 重新标记镜像
```bash
# 标记为腾讯云镜像仓库格式
docker tag ai-agent-platform:latest ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:latest
docker tag ai-agent-platform:latest ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:20250820-1308
```

#### 4. 推送镜像到腾讯云
```bash
# 推送最新版本
docker push ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:latest

# 推送时间戳版本
docker push ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:20250820-1308
```

### 第二步：使用Docker Hub（备选方案）

#### 1. 登录Docker Hub
```bash
docker login
```

#### 2. 重新标记镜像
```bash
# 替换your-username为你的Docker Hub用户名
docker tag ai-agent-platform:latest your-username/ai-agent-platform:latest
docker tag ai-agent-platform:latest your-username/ai-agent-platform:20250820-1308
```

#### 3. 推送到Docker Hub
```bash
docker push your-username/ai-agent-platform:latest
docker push your-username/ai-agent-platform:20250820-1308
```

## 🖥️ 腾讯云服务器部署

### 第一步：服务器准备
```bash
# SSH连接到腾讯云服务器
ssh root@your-server-ip

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo apt update
sudo apt install docker-compose -y
```

### 第二步：拉取和运行镜像

#### 方案A：使用腾讯云容器镜像服务
```bash
# 拉取镜像
docker pull ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:latest

# 运行容器
docker run -d \
  --name ai-agent-platform \
  -p 3000:3000 \
  --restart unless-stopped \
  -e DATABASE_URL="postgresql://user:pass@your-db-host:5432/dbname" \
  ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:latest
```

#### 方案B：使用完整的Docker Compose部署
```bash
# 克隆项目（获取docker-compose.yml）
git clone https://github.com/Xaiver03/AIgalaxy.git /opt/ai-agent-platform
cd /opt/ai-agent-platform

# 复制并配置环境变量
cp deploy/docker/.env.example deploy/docker/.env
nano deploy/docker/.env  # 编辑配置

# 启动完整服务栈
docker compose -f deploy/docker/docker-compose.yml --env-file deploy/docker/.env up -d
```

### 第三步：配置Nginx反向代理（可选）
```bash
# 安装Nginx
sudo apt install nginx -y

# 配置反向代理
sudo nano /etc/nginx/sites-available/ai-agent-platform
```

Nginx配置内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;

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

## 🔍 验证部署

### 检查容器状态
```bash
# 查看运行的容器
docker ps

# 查看容器日志
docker logs ai-agent-platform

# 进入容器调试
docker exec -it ai-agent-platform sh
```

### 健康检查
```bash
# 检查应用响应
curl http://localhost:3000/api/health

# 检查网站可访问性
curl http://your-server-ip:3000
```

## 📋 部署后配置

### 1. 数据库初始化
```bash
# 进入容器执行数据库初始化
docker exec ai-agent-platform npx prisma db push
docker exec ai-agent-platform npm run db:seed
```

### 2. 管理员账户
- 访问：`http://your-server-ip:3000/admin`
- 默认账户：`admin@ai-galaxy.com` / `admin123`
- **请立即修改默认密码！**

### 3. 监控和日志
```bash
# 实时查看日志
docker logs -f ai-agent-platform

# 监控资源使用
docker stats ai-agent-platform
```

## 🔄 更新部署

### 重新构建并推送
```bash
# 本地重新构建
cd /Users/rocalight/同步空间/miracleplus/ai-agent-platform
docker build -f deploy/docker/Dockerfile -t ai-agent-platform:latest .

# 推送新版本
docker tag ai-agent-platform:latest ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:$(date +%Y%m%d-%H%M)
docker push ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:$(date +%Y%m%d-%H%M)
```

### 服务器更新
```bash
# 拉取新镜像
docker pull ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:latest

# 停止旧容器
docker stop ai-agent-platform
docker rm ai-agent-platform

# 运行新容器
docker run -d \
  --name ai-agent-platform \
  -p 3000:3000 \
  --restart unless-stopped \
  -e DATABASE_URL="your-database-url" \
  ccr.ccs.tencentyun.com/your-namespace/ai-agent-platform:latest
```

## 🎯 下一步建议

1. **设置域名和SSL证书**
2. **配置数据库备份策略**
3. **设置容器监控和告警**
4. **优化镜像大小（可选）**
5. **配置CI/CD自动化部署**

---
**构建完成时间**: 2025-08-20 13:08  
**镜像版本**: 20250820-1308  
**状态**: ✅ 准备就绪，可以推送部署