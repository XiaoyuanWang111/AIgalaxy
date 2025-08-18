# 🚀 GitHub Actions 自动部署设置指南

本指南将帮您设置 GitHub Actions 自动部署到腾讯云服务器。

## 📋 设置步骤

### 第一步：创建 GitHub 仓库

1. **创建新仓库**
   - 访问 [GitHub](https://github.com)
   - 点击 **New repository**
   - 仓库名：`ai-agent-platform` (或您喜欢的名称)
   - 设置为 **Private** (推荐) 或 Public
   - 不要初始化 README（因为本地已有文件）

2. **连接本地仓库**
   ```bash
   # 在项目目录执行
   cd /Users/rocalight/同步空间/micraplus/AEXD/ai-agent-platform
   
   # 初始化 Git 仓库（如果还未初始化）
   git init
   
   # 添加远程仓库（替换为您的仓库地址）
   git remote add origin https://github.com/您的用户名/ai-agent-platform.git
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "🎉 Initial commit: AI Agent Platform"
   
   # 推送到 GitHub
   git branch -M main
   git push -u origin main
   ```

### 第二步：生成 SSH 密钥

1. **在本地生成密钥对**
   ```bash
   # 生成新的 SSH 密钥（专用于 GitHub Actions）
   ssh-keygen -t rsa -b 4096 -C "github-actions@mpai.openpenpal.com" -f ~/.ssh/github_actions_rsa
   
   # 查看私钥（用于 GitHub Secrets）
   cat ~/.ssh/github_actions_rsa
   
   # 查看公钥（用于服务器授权）
   cat ~/.ssh/github_actions_rsa.pub
   ```

2. **复制密钥内容**
   - **私钥** (`~/.ssh/github_actions_rsa`)：完整复制，包括 `-----BEGIN` 和 `-----END` 行
   - **公钥** (`~/.ssh/github_actions_rsa.pub`)：单行内容

### 第三步：服务器端配置

1. **SSH 连接到服务器**
   ```bash
   ssh root@192.144.154.224
   ```

2. **添加公钥到服务器**
   ```bash
   # 创建 .ssh 目录（如果不存在）
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   
   # 添加公钥到授权文件
   echo "您的公钥内容" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **在服务器上初始化 Git 仓库**
   ```bash
   # 进入网站目录
   cd /www/wwwroot/mpai.openpenpal.com
   
   # 初始化为 Git 仓库
   git init
   
   # 添加远程仓库
   git remote add origin https://github.com/您的用户名/ai-agent-platform.git
   
   # 拉取代码
   git pull origin main
   
   # 设置 Git 用户信息
   git config user.name "AI Agent Platform"
   git config user.email "admin@mpai.openpenpal.com"
   ```

4. **安装依赖并首次部署**
   ```bash
   # 安装生产依赖
   npm ci --only=production
   
   # 生成 Prisma 客户端
   npx prisma generate
   
   # 构建应用
   npm run build
   
   # 数据库初始化
   npx prisma db push
   
   # 启动 PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### 第四步：配置 GitHub Secrets

1. **访问仓库设置**
   - GitHub 仓库页面 → **Settings** → **Secrets and variables** → **Actions**

2. **添加以下 Secrets**：

   | Name | Value | 说明 |
   |------|-------|------|
   | `HOST` | `192.144.154.224` | 服务器 IP 地址 |
   | `USERNAME` | `root` | SSH 用户名 |
   | `SSH_KEY` | `私钥内容` | SSH 私钥完整内容 |
   | `PORT` | `22` | SSH 端口（默认 22） |

3. **添加 Secrets 的详细步骤**：
   - 点击 **New repository secret**
   - **Name**: 输入上表中的名称
   - **Secret**: 输入对应的值
   - 点击 **Add secret**
   - 重复以上步骤添加所有 4 个 secrets

### 第五步：创建 Environment (可选但推荐)

1. **仓库设置** → **Environments** → **New environment**
2. **Name**: `production`
3. **Environment protection rules** (可选):
   - ✅ **Required reviewers**: 需要审核才能部署
   - ✅ **Wait timer**: 延迟部署时间
   - ✅ **Deployment branches**: 限制部署分支

### 第六步：测试自动部署

1. **修改代码测试**
   ```bash
   # 本地修改任意文件，比如 README.md
   echo "# AI Agent Platform - Updated" > README.md
   
   # 提交并推送
   git add .
   git commit -m "🧪 Test GitHub Actions deployment"
   git push origin main
   ```

2. **查看部署过程**
   - GitHub 仓库 → **Actions** 选项卡
   - 查看运行的工作流
   - 实时查看部署日志

## 🎯 使用方法

### 日常开发流程：

```bash
# 1. 本地开发
# 修改代码...

# 2. 测试
npm run dev

# 3. 提交代码
git add .
git commit -m "✨ Add new feature"
git push origin main

# 4. 自动部署
# GitHub Actions 会自动检测到推送并开始部署
# 大约 3-5 分钟后，更新就会上线到 https://mpai.openpenpal.com
```

### 手动触发部署：

1. GitHub 仓库 → **Actions**
2. 选择 **Deploy AI Agent Platform**
3. 点击 **Run workflow**
4. 选择分支并点击 **Run workflow**

## 🔧 故障排除

### 常见问题：

1. **SSH 连接失败**
   ```bash
   # 测试 SSH 连接
   ssh -i ~/.ssh/github_actions_rsa root@192.144.154.224
   ```

2. **权限问题**
   ```bash
   # 检查服务器文件权限
   ls -la /www/wwwroot/mpai.openpenpal.com
   
   # 修复权限
   chown -R www:www /www/wwwroot/mpai.openpenpal.com
   chmod -R 755 /www/wwwroot/mpai.openpenpal.com
   ```

3. **PM2 应用问题**
   ```bash
   # 查看 PM2 状态
   pm2 status
   
   # 查看日志
   pm2 logs ai-agent-platform
   
   # 重启应用
   pm2 restart ai-agent-platform
   ```

4. **Git 同步问题**
   ```bash
   # 服务器上重置 Git 状态
   cd /www/wwwroot/mpai.openpenpal.com
   git reset --hard origin/main
   git clean -fd
   ```

## 📊 监控部署

### 查看部署状态：
- **GitHub Actions**: 实时查看部署日志
- **服务器日志**: `pm2 logs ai-agent-platform`
- **网站健康**: https://mpai.openpenpal.com
- **管理后台**: https://mpai.openpenpal.com/admin

### 部署通知：
- GitHub 会在部署成功/失败时发送邮件通知
- Actions 页面显示详细的部署状态

## 🎉 完成！

设置完成后，您的工作流程变成：
1. **本地开发** → 修改代码
2. **git push** → 推送到 GitHub  
3. **自动部署** → GitHub Actions 自动部署到服务器
4. **立即生效** → 访问 https://mpai.openpenpal.com 查看更新

**部署时间**：约 3-5 分钟 ⚡
**完全自动化**：无需手动操作 🤖