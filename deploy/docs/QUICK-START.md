# 🚀 AI Galaxy - 5分钟快速部署

## 前提条件

- Ubuntu 20.04+ 服务器
- 2GB+ 内存
- 10GB+ 可用磁盘空间
- 可访问互联网

## 一键部署

```bash
# 1. 下载项目
wget https://github.com/Xaiver03/AIgalaxy/archive/refs/heads/main.zip
unzip main.zip
cd AIgalaxy-main

# 2. 执行部署脚本
chmod +x deploy/scripts/deploy.sh
./deploy/scripts/deploy.sh
```

## 部署完成后访问

- **主页面**: `http://your-server-ip`
- **管理后台**: `http://your-server-ip/admin`
  - 邮箱: admin@ai-galaxy.com
  - 密码: admin123

## 常用管理命令

```bash
# 添加管理快捷方式
sudo ln -s /opt/ai-galaxy/deploy/scripts/manage.sh /usr/local/bin/ai-galaxy

# 基本操作
ai-galaxy start      # 启动
ai-galaxy stop       # 停止
ai-galaxy restart    # 重启
ai-galaxy status     # 状态
ai-galaxy logs       # 日志
ai-galaxy backup     # 备份
```

## 生产环境配置

### 1. 修改默认密码
```bash
# 编辑环境变量
nano /opt/ai-galaxy/deploy/docker/.env

# 修改这些值：
DB_PASSWORD=your_secure_password
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_32_char_secret_key
```

### 2. 配置域名
```bash
# 更新环境变量
DOMAIN=yourdomain.com
APP_URL=https://yourdomain.com

# 获取 SSL 证书
ai-galaxy ssl
# 选择选项 2 (Let's Encrypt)
```

### 3. 重启服务
```bash
ai-galaxy restart
```

## 故障排除

### 检查服务状态
```bash
ai-galaxy status
```

### 查看日志
```bash
ai-galaxy logs
```

### 重新部署
```bash
cd /opt/ai-galaxy
git pull origin main
ai-galaxy restart
```

就这么简单！🎉