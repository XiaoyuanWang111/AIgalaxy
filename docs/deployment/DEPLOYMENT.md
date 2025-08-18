# 🚀 AI Agent Platform 部署指南

本文档详细介绍如何将 AI Agent Platform 部署到腾讯云服务器（使用宝塔面板）。

## 📋 部署前准备

### 环境要求

- **服务器**：腾讯云轻量应用服务器（推荐 2核4G 或更高配置）
- **操作系统**：Ubuntu 20.04+ 或 CentOS 7+
- **域名**：已备案的域名
- **宝塔面板**：已安装并配置完成

### 本地准备

确保本地项目可以正常运行：

```bash
# 检查项目是否正常
npm run dev

# 构建测试
npm run build
npm start
```

## 🛠️ 第一步：环境配置

### 1.1 宝塔面板软件安装

在宝塔面板 → 软件商店中安装以下软件：

- [x] **Node.js**（版本 18.17.0 或更高）
- [x] **PM2 管理器**（Node.js 进程管理）
- [x] **Nginx**（Web 服务器）
- [x] **MySQL 8.0**（可选，如果使用 MySQL 数据库）

### 1.2 Node.js 环境验证

SSH 连接服务器或使用宝塔终端：

```bash
# 验证 Node.js 版本
node --version  # 应该 >= 18.17.0
npm --version   # 应该 >= 9.0.0

# 全局安装 PM2（如果未安装）
npm install -g pm2
```

## 📦 第二步：项目部署

### 2.1 本地构建

在本地项目根目录执行：

```bash
# 安装依赖
npm ci

# 构建生产版本
npm run build

# 生成数据库客户端
npx prisma generate
```

### 2.2 上传项目文件

通过宝塔文件管理器或 FTP 上传以下文件到 `/www/wwwroot/你的域名.com/`：

**必需文件/目录：**
```
├── .next/                 # 构建输出目录
├── public/               # 静态资源
├── prisma/              # 数据库相关
├── components/          # 组件目录
├── app/                 # Next.js 应用目录
├── package.json         # 依赖配置
├── package-lock.json    # 锁定依赖版本
├── next.config.js       # Next.js 配置
├── tailwind.config.js   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
└── ecosystem.config.js  # PM2 配置（下面创建）
```

**排除文件：**
- `node_modules/`
- `.git/`
- `.env.local`
- `*.log`

### 2.3 服务器端安装依赖

SSH 进入项目目录：

```bash
# 进入项目目录
cd /www/wwwroot/你的域名.com

# 安装生产依赖
npm ci --only=production

# 生成 Prisma 客户端
npx prisma generate
```

## ⚙️ 第三步：环境配置

### 3.1 生产环境变量

创建 `.env.production` 文件：

```bash
# 在项目根目录创建文件
nano .env.production
```

```env
# 基础配置
NODE_ENV=production
PORT=3000

# 数据库配置（SQLite - 推荐小型应用）
DATABASE_URL="file:./prisma/prod.db"

# 或者使用 MySQL（需要先在宝塔创建数据库）
# DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"

# 域名配置（替换为你的域名）
NEXTAUTH_URL=https://你的域名.com

# 安全密钥（生成一个随机字符串）
NEXTAUTH_SECRET=你的超级安全密钥请使用随机字符串

# 其他配置
NEXT_TELEMETRY_DISABLED=1
```

### 3.2 数据库初始化

```bash
# 推送数据库结构到生产环境
npx prisma db push

# 如果需要种子数据
# npx prisma db seed
```

### 3.3 文件权限设置

```bash
# 设置项目文件权限
chown -R www:www /www/wwwroot/你的域名.com
chmod -R 755 /www/wwwroot/你的域名.com

# 数据库文件特殊权限（如果使用 SQLite）
chmod 644 /www/wwwroot/你的域名.com/prisma/prod.db
```

## 🚀 第四步：PM2 进程管理

### 4.1 创建 PM2 配置文件

在项目根目录创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'ai-agent-platform',
    script: 'npm',
    args: 'start',
    cwd: '/www/wwwroot/你的域名.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/www/server/nodejs/vhost/logs/ai-agent-platform-error.log',
    out_file: '/www/server/nodejs/vhost/logs/ai-agent-platform-out.log',
    log_file: '/www/server/nodejs/vhost/logs/ai-agent-platform.log',
    time: true
  }]
}
```

### 4.2 启动应用

```bash
# 启动应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup

# 查看应用状态
pm2 status
pm2 logs ai-agent-platform
```

## 🌐 第五步：Nginx 配置

### 5.1 在宝塔面板创建网站

1. 登录宝塔面板
2. 点击 **网站** → **添加站点**
3. 填写域名：`你的域名.com`
4. 选择类型：**PHP** → **纯静态**
5. 点击提交

### 5.2 配置 Nginx 反向代理

在宝塔面板中：

1. 进入 **网站设置** → **配置文件**
2. 替换为以下配置：

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name 你的域名.com www.你的域名.com;
    index index.php index.html index.htm default.php default.htm default.html;
    root /www/wwwroot/你的域名.com;
    
    # SSL 配置文件（宝塔自动生成）
    include /www/server/panel/vhost/cert/你的域名.com.conf;
    
    # 反向代理到 Next.js 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Next.js 静态资源优化
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # API 路由
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 禁止访问敏感文件
    location ~ ^/(\.user\.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README\.md) {
        return 404;
    }
    
    # 禁止在证书验证目录写入 PHP 文件
    location ~ \.well-known{
        allow all;
    }
    
    # 访问日志
    access_log /www/wwwlogs/你的域名.com.log;
    error_log /www/wwwlogs/你的域名.com.error.log;
}
```

### 5.3 SSL 证书配置

1. 在宝塔面板 → **网站设置** → **SSL**
2. 选择 **Let's Encrypt** 免费证书
3. 填写邮箱，勾选域名
4. 点击申请
5. 开启 **强制 HTTPS**

## 🔍 第六步：验证部署

### 6.1 基础功能测试

```bash
# 检查应用状态
pm2 status

# 检查端口监听
netstat -tulpn | grep 3000

# 测试 HTTP 响应
curl -I http://localhost:3000
```

### 6.2 访问测试

1. 打开浏览器访问：`https://你的域名.com`
2. 检查主要功能：
   - [x] 首页星系展示
   - [x] 工具列表加载
   - [x] 管理后台访问（`/admin`）
   - [x] API 接口响应

## 📊 第七步：监控和维护

### 7.1 PM2 监控

```bash
# 实时监控
pm2 monit

# 查看日志
pm2 logs ai-agent-platform --lines 100

# 重启应用
pm2 restart ai-agent-platform

# 重新加载（无停机）
pm2 reload ai-agent-platform
```

### 7.2 备份策略

#### 数据库备份（SQLite）

```bash
# 创建备份脚本
cat > /www/backup_db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/www/backup"
DB_PATH="/www/wwwroot/你的域名.com/prisma/prod.db"

mkdir -p $BACKUP_DIR
cp $DB_PATH $BACKUP_DIR/prod_db_$DATE.db
find $BACKUP_DIR -name "prod_db_*.db" -mtime +7 -delete
EOF

chmod +x /www/backup_db.sh

# 设置定时任务（宝塔面板 → 计划任务）
# 每天凌晨 2 点备份：0 2 * * * /www/backup_db.sh
```

#### 代码备份

在宝塔面板 → **计划任务** 中设置定期备份网站文件。

### 7.3 日志管理

```bash
# 创建日志轮转配置
cat > /etc/logrotate.d/ai-agent-platform << 'EOF'
/www/server/nodejs/vhost/logs/ai-agent-platform*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 0644 www www
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

## 🚨 故障排除

### 常见问题及解决方案

#### 1. 应用无法启动

```bash
# 检查 PM2 状态
pm2 status

# 查看详细错误
pm2 logs ai-agent-platform --err

# 常见原因：
# - 端口被占用：netstat -tulpn | grep 3000
# - 环境变量错误：检查 .env.production
# - 依赖缺失：npm install
```

#### 2. 数据库连接失败

```bash
# 检查数据库文件权限
ls -la /www/wwwroot/你的域名.com/prisma/

# 重新推送数据库
cd /www/wwwroot/你的域名.com
npx prisma db push
```

#### 3. 静态文件 404

- 检查 Nginx 配置中的 `/_next/static` 路径配置
- 确认 Next.js 应用正常运行在 3000 端口

#### 4. SSL 证书问题

- 在宝塔面板重新申请 SSL 证书
- 检查域名 DNS 解析是否正确指向服务器 IP

## 🔄 更新部署

当需要更新应用时：

```bash
# 1. 备份数据库
/www/backup_db.sh

# 2. 上传新的代码文件

# 3. 安装新依赖（如有）
npm ci --only=production

# 4. 数据库迁移（如有）
npx prisma db push

# 5. 重新构建（如需要）
npm run build

# 6. 重启应用
pm2 restart ai-agent-platform
```

## 📞 技术支持

如遇到问题，请检查：

1. **PM2 日志**：`pm2 logs ai-agent-platform`
2. **Nginx 错误日志**：`/www/wwwlogs/你的域名.com.error.log`
3. **系统资源**：`htop` 或在宝塔面板查看

---

## 📝 部署检查清单

部署完成前，请确认以下项目：

- [ ] Node.js 环境安装完成（v18+）
- [ ] 项目代码完整上传
- [ ] 生产环境依赖安装完成
- [ ] 环境变量配置正确
- [ ] 数据库初始化完成
- [ ] PM2 应用启动成功
- [ ] Nginx 反向代理配置完成
- [ ] 域名 DNS 解析正确
- [ ] SSL 证书申请并配置成功
- [ ] 防火墙端口开放（80, 443）
- [ ] 网站功能正常访问
- [ ] 管理后台可以登录
- [ ] 备份策略配置完成

🎉 **部署完成！** 您的 AI Agent Platform 现在已经成功运行在生产环境中。

---

*最后更新：2024年1月*