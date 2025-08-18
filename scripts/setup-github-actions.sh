#!/bin/bash

# GitHub Actions 快速设置脚本
# 帮助自动化部分设置过程

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${2}[$(date '+%H:%M:%S')] $1${NC}"
}

clear
print_message "🚀 GitHub Actions 自动部署设置助手" $BLUE
print_message "======================================" $BLUE
echo ""

# 检查是否在项目目录
if [ ! -f "package.json" ]; then
    print_message "❌ 请在项目根目录运行此脚本" $RED
    exit 1
fi

# 步骤 1: 生成 SSH 密钥
print_message "🔑 第1步: 生成 SSH 密钥对" $YELLOW
echo ""

SSH_KEY_PATH="$HOME/.ssh/github_actions_rsa"

if [ -f "$SSH_KEY_PATH" ]; then
    print_message "⚠️  SSH 密钥已存在: $SSH_KEY_PATH" $YELLOW
    read -p "是否覆盖现有密钥? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_message "使用现有密钥..." $GREEN
    else
        rm -f "$SSH_KEY_PATH" "$SSH_KEY_PATH.pub"
    fi
fi

if [ ! -f "$SSH_KEY_PATH" ]; then
    print_message "正在生成新的 SSH 密钥..." $BLUE
    ssh-keygen -t rsa -b 4096 -C "github-actions@mpai.openpenpal.com" -f "$SSH_KEY_PATH" -N ""
    print_message "✅ SSH 密钥生成完成" $GREEN
fi

echo ""
print_message "📋 请保存以下信息到 GitHub Secrets:" $YELLOW
echo ""
echo "=== GitHub Secrets 配置 ==="
echo "HOST: 192.144.154.224"
echo "USERNAME: root"
echo "PORT: 22"
echo ""
echo "SSH_KEY (私钥内容):"
echo "-------------------"
cat "$SSH_KEY_PATH"
echo ""
echo "=== 服务器公钥 (添加到服务器) ==="
echo "--------------------------------"
cat "$SSH_KEY_PATH.pub"
echo ""

# 步骤 2: 初始化 Git 仓库
print_message "📁 第2步: 检查 Git 仓库状态" $YELLOW

if [ ! -d ".git" ]; then
    print_message "初始化 Git 仓库..." $BLUE
    git init
    git add .
    git commit -m "🎉 Initial commit: AI Agent Platform"
    print_message "✅ Git 仓库初始化完成" $GREEN
else
    print_message "✅ Git 仓库已存在" $GREEN
fi

# 检查远程仓库
if ! git remote | grep -q "origin"; then
    print_message "⚠️  未设置远程仓库" $YELLOW
    read -p "请输入 GitHub 仓库地址 (https://github.com/用户名/仓库名.git): " REPO_URL
    if [ ! -z "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        print_message "✅ 远程仓库设置完成" $GREEN
    fi
else
    REPO_URL=$(git remote get-url origin)
    print_message "✅ 远程仓库: $REPO_URL" $GREEN
fi

# 步骤 3: 生成服务器设置命令
print_message "🖥️  第3步: 生成服务器设置命令" $YELLOW
echo ""

SERVER_SETUP_FILE="server-setup-commands.txt"
cat > "$SERVER_SETUP_FILE" << EOF
# 在服务器 (192.144.154.224) 上执行以下命令:

# 1. 添加 SSH 公钥
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "$(cat $SSH_KEY_PATH.pub)" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 2. 进入项目目录并设置 Git
cd /www/wwwroot/mpai.openpenpal.com
git init
git remote add origin $REPO_URL
git config user.name "AI Agent Platform"
git config user.email "admin@mpai.openpenpal.com"

# 3. 拉取代码
git pull origin main

# 4. 安装依赖并构建
npm ci --only=production
npx prisma generate
npm run build
npx prisma db push

# 5. 启动 PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 6. 设置权限
chown -R www:www /www/wwwroot/mpai.openpenpal.com
chmod -R 755 /www/wwwroot/mpai.openpenpal.com
EOF

print_message "✅ 服务器设置命令已保存到: $SERVER_SETUP_FILE" $GREEN

# 步骤 4: 推送到 GitHub
echo ""
print_message "📤 第4步: 推送代码到 GitHub" $YELLOW

if [ ! -z "$REPO_URL" ]; then
    read -p "是否现在推送代码到 GitHub? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "正在推送代码..." $BLUE
        git branch -M main
        git push -u origin main
        if [ $? -eq 0 ]; then
            print_message "✅ 代码推送成功" $GREEN
        else
            print_message "❌ 代码推送失败，请检查仓库权限" $RED
        fi
    fi
fi

# 总结
echo ""
print_message "🎉 设置助手完成！" $GREEN
print_message "=====================================" $BLUE
echo ""
print_message "📋 下一步操作:" $YELLOW
echo "1. 将 SSH 公钥添加到服务器 (见上方内容)"
echo "2. 在 GitHub 仓库中设置 Secrets (见上方内容)"
echo "3. 在服务器上执行设置命令 (见 $SERVER_SETUP_FILE 文件)"
echo "4. 测试自动部署: git push origin main"
echo ""
print_message "📖 详细设置指南: GITHUB-ACTIONS-SETUP.md" $BLUE
print_message "🌐 部署完成后访问: https://mpai.openpenpal.com" $BLUE

# 生成快速复制文件
cat > "github-secrets.txt" << EOF
=== GitHub Secrets 设置 ===
访问: https://github.com/您的用户名/仓库名/settings/secrets/actions

添加以下 Secrets:

Name: HOST
Value: 192.144.154.224

Name: USERNAME  
Value: root

Name: PORT
Value: 22

Name: SSH_KEY
Value: 
$(cat "$SSH_KEY_PATH")
EOF

print_message "💾 GitHub Secrets 信息已保存到: github-secrets.txt" $GREEN
echo ""