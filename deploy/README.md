# 🚀 AI Agent Platform - 完整部署指南

## 📁 Deploy目录结构

```
deploy/
├── README.md               # 本文档
├── docker/                 # Docker容器化配置
│   ├── Dockerfile         # 多阶段构建的生产级Dockerfile
│   ├── docker-compose.yml # 完整服务栈编排（含PostgreSQL、Redis、Nginx）
│   ├── init-db.sql        # 数据库初始化脚本
│   └── .env.example       # 环境变量模板
├── nginx/                  # Nginx反向代理配置
│   └── nginx.conf         # 生产环境Nginx配置
├── scripts/               # 部署脚本
│   ├── deploy.sh         # 一键部署到Ubuntu服务器脚本
│   └── manage.sh         # 服务管理脚本
└── docs/                  # 部署文档
    ├── README.md         # 容器化部署指南
    └── QUICK-START.md    # 快速开始指南
```

## 🎯 部署方式概览

### 1. **GitHub Actions自动化部署（推荐）**
- **触发方式**: 推送代码到main分支
- **流程**: 代码提交 → 自动构建Docker镜像 → 推送到镜像仓库 → 服务器自动拉取部署
- **配置文件**: `.github/workflows/docker-deploy.yml`

### 2. **手动Docker部署**
- **适用场景**: 本地测试或手动部署
- **流程**: 本地构建 → 推送镜像 → 服务器拉取运行
- **配置文件**: `deploy/docker/docker-compose.yml`

### 3. **传统部署（备选）**
- **适用场景**: 不使用容器的环境
- **流程**: Git拉取 → npm构建 → PM2运行
- **配置文件**: `.github/workflows/deploy.yml`

## 🤖 GitHub Actions自动化CI/CD设置

### 步骤1: 配置GitHub Secrets

在GitHub仓库设置中添加以下Secrets：

| Secret名称 | 说明 | 示例值 |
|-----------|------|--------|
| **腾讯云镜像仓库** |
| `TCR_NAMESPACE` | 腾讯云镜像命名空间 | `your-namespace` |
| `TCR_USERNAME` | 腾讯云镜像仓库用户名 | `100012345678` |
| `TCR_PASSWORD` | 腾讯云镜像仓库密码 | `your-tcr-password` |
| **服务器连接** |
| `HOST` | 服务器IP地址 | `192.168.1.100` |
| `USERNAME` | SSH用户名 | `root` |
| `SSH_KEY` | SSH私钥内容 | `-----BEGIN RSA...` |
| `PORT` | SSH端口 | `22` |
| **应用配置** |
| `DATABASE_URL` | PostgreSQL连接字符串 | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | Redis连接字符串 | `redis://:password@host:6379` |
| `SESSION_SECRET` | 会话密钥(至少32字符) | `your-super-secret-key...` |
| `DOMAIN` | 应用域名 | `ai-agent.example.com` |
| **Docker Hub（可选）** |
| `DOCKER_HUB_USERNAME` | Docker Hub用户名 | `your-username` |
| `DOCKER_HUB_TOKEN` | Docker Hub访问令牌 | `dckr_pat_xxx...` |

### 步骤2: 触发自动部署

1. **自动触发**: 
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```

2. **手动触发**:
   - GitHub仓库 → Actions → Docker Build and Deploy → Run workflow

### 步骤3: 监控部署状态

- **查看进度**: GitHub Actions页面实时查看
- **部署结果**: 查看Summary获取部署详情
- **服务器日志**: `docker logs ai-agent-platform`

## 🐳 Docker容器化部署详解

### 本地构建和测试

```bash
# 1. 构建镜像
cd /path/to/ai-agent-platform
docker build -f deploy/docker/Dockerfile -t ai-agent-platform:latest .

# 2. 本地运行测试
docker run -d \
  --name ai-agent-platform-test \
  -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  ai-agent-platform:latest

# 3. 查看日志
docker logs -f ai-agent-platform-test
```

### 使用Docker Compose完整部署

```bash
# 1. 准备环境变量
cp deploy/docker/.env.example deploy/docker/.env
# 编辑.env文件，填入实际配置

# 2. 启动所有服务
docker compose -f deploy/docker/docker-compose.yml up -d

# 3. 查看服务状态
docker compose -f deploy/docker/docker-compose.yml ps
```

### 服务架构说明

Docker Compose包含以下服务：
- **app**: Next.js应用主服务
- **postgres**: PostgreSQL数据库
- **redis**: Redis缓存服务
- **nginx**: Nginx反向代理
- **adminer**: 数据库管理工具（可选）
- **portainer**: Docker管理界面（可选）

## 🖥️ 服务器环境准备

### 腾讯云服务器初始化

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. 安装Docker Compose
sudo apt install docker-compose -y

# 4. 创建应用目录
sudo mkdir -p /opt/ai-agent-platform
sudo chown $USER:$USER /opt/ai-agent-platform
```

### 配置镜像仓库访问

```bash
# 登录腾讯云镜像仓库
docker login ccr.ccs.tencentyun.com
# 输入用户名和密码
```

## 📝 环境变量配置说明

### 必需的环境变量

```env
# 数据库配置
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis配置（用于缓存和会话）
REDIS_URL=redis://:password@host:6379

# 会话密钥（至少32字符）
SESSION_SECRET=your-super-secret-session-key-minimum-32-chars

# 管理员配置
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-admin-password
```

### 可选的环境变量

```env
# 域名配置
DOMAIN=ai-agent.example.com
APP_URL=https://ai-agent.example.com

# 邮件服务（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 监控服务（可选）
SENTRY_DSN=https://your-sentry-dsn
```

## 🔧 部署脚本使用

### deploy.sh - 一键部署脚本

```bash
# 赋予执行权限
chmod +x deploy/scripts/deploy.sh

# 执行部署
./deploy/scripts/deploy.sh
```

脚本功能：
- 系统环境检查
- Docker安装
- 项目配置
- SSL证书生成
- 服务启动
- 防火墙配置
- 备份设置

### manage.sh - 服务管理脚本

```bash
# 安装管理命令
sudo ln -s /opt/ai-agent-platform/deploy/scripts/manage.sh /usr/local/bin/ai-galaxy

# 使用示例
ai-galaxy start      # 启动服务
ai-galaxy stop       # 停止服务
ai-galaxy restart    # 重启服务
ai-galaxy status     # 查看状态
ai-galaxy logs       # 查看日志
ai-galaxy update     # 更新应用
ai-galaxy backup     # 创建备份
```

## 🔒 安全建议

1. **密钥管理**
   - 使用强密码和密钥
   - 定期轮换密钥
   - 不要在代码中硬编码密钥

2. **网络安全**
   - 配置防火墙规则
   - 使用HTTPS加密
   - 限制SSH访问

3. **容器安全**
   - 使用非root用户运行
   - 定期更新基础镜像
   - 扫描镜像漏洞

## 🆘 故障排除

### 常见问题

1. **镜像构建失败**
   ```bash
   # 检查Dockerfile语法
   docker build --no-cache -f deploy/docker/Dockerfile .
   ```

2. **容器无法启动**
   ```bash
   # 查看容器日志
   docker logs ai-agent-platform
   
   # 检查环境变量
   docker exec ai-agent-platform env
   ```

3. **数据库连接失败**
   ```bash
   # 测试数据库连接
   docker exec ai-agent-platform npx prisma db push
   ```

### 日志位置

- **应用日志**: `docker logs ai-agent-platform`
- **Nginx日志**: `docker logs ai-galaxy-nginx`
- **数据库日志**: `docker logs ai-galaxy-db`
- **部署日志**: `/var/log/ai-galaxy-deploy.log`

## 📊 监控和维护

### 健康检查

```bash
# 应用健康检查
curl http://localhost:3000/api/health

# 容器健康状态
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 备份策略

```bash
# 手动备份
docker exec ai-galaxy-db pg_dump -U user database > backup.sql

# 自动备份（已配置cron）
# 每天凌晨2点自动备份
```

### 更新流程

1. **通过GitHub Actions**: 推送代码自动更新
2. **手动更新**: 
   ```bash
   docker pull ccr.ccs.tencentyun.com/namespace/ai-agent-platform:latest
   docker stop ai-agent-platform
   docker rm ai-agent-platform
   docker run -d ... # 使用新镜像启动
   ```

## 🎯 快速开始

最简单的部署方式：

1. **Fork仓库到你的GitHub账号**
2. **配置GitHub Secrets（见上表）**
3. **推送代码到main分支**
4. **等待自动部署完成（约5分钟）**
5. **访问 https://your-domain.com**

---

📅 更新时间: 2025-08-20  
📝 版本: v2.1.5  
🔗 [返回主文档](../README.md)