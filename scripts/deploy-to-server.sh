#!/bin/bash

# AI Agent Platform 一键部署脚本
# 用法: ./deploy-to-server.sh

# 配置信息
SERVER_IP="192.144.154.224"
SERVER_USER="root"  # 或者您的服务器用户名
DOMAIN="mpai.openpenpal.com"
REMOTE_PATH="/www/wwwroot/$DOMAIN"
LOCAL_PROJECT_PATH="$(pwd)"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${2}[$(date '+%H:%M:%S')] $1${NC}"
}

print_message "🚀 开始部署到生产服务器..." $BLUE
print_message "目标服务器: $SERVER_IP" $BLUE
print_message "目标域名: $DOMAIN" $BLUE
echo ""

# 1. 本地构建
print_message "📦 1. 本地构建生产版本..." $YELLOW
npm run build
if [ $? -ne 0 ]; then
    print_message "❌ 构建失败" $RED
    exit 1
fi
print_message "✅ 构建完成" $GREEN

# 2. 生成 Prisma 客户端
print_message "🔄 2. 生成 Prisma 客户端..." $YELLOW
npx prisma generate
print_message "✅ Prisma 客户端生成完成" $GREEN

# 3. 创建部署包
print_message "📁 3. 创建部署包..." $YELLOW
DEPLOY_PACKAGE="ai-platform-deploy-$(date +%Y%m%d_%H%M%S).tar.gz"

tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='*.tar.gz' \
    --exclude='.env.local' \
    -czf $DEPLOY_PACKAGE \
    .next \
    public \
    prisma \
    components \
    app \
    lib \
    package.json \
    package-lock.json \
    next.config.js \
    tailwind.config.js \
    tsconfig.json \
    ecosystem.config.js \
    .env.production

print_message "✅ 部署包创建完成: $DEPLOY_PACKAGE" $GREEN

# 4. 上传到服务器
print_message "🌐 4. 上传到服务器..." $YELLOW
scp $DEPLOY_PACKAGE $SERVER_USER@$SERVER_IP:/tmp/
if [ $? -ne 0 ]; then
    print_message "❌ 文件上传失败，请检查SSH连接" $RED
    exit 1
fi
print_message "✅ 文件上传完成" $GREEN

# 5. 服务器端部署
print_message "⚙️  5. 服务器端部署..." $YELLOW
ssh $SERVER_USER@$SERVER_IP << EOF
set -e
cd $REMOTE_PATH

# 备份当前版本
if [ -d "backup" ]; then rm -rf backup; fi
mkdir -p backup
cp -r .next backup/ 2>/dev/null || true
cp -r app backup/ 2>/dev/null || true
cp -r components backup/ 2>/dev/null || true

# 解压新版本
tar -xzf /tmp/$DEPLOY_PACKAGE -C $REMOTE_PATH

# 安装/更新依赖
npm ci --only=production

# 生成 Prisma 客户端
npx prisma generate

# 数据库迁移（如果需要）
npx prisma db push

# 设置权限
chown -R www:www $REMOTE_PATH
chmod -R 755 $REMOTE_PATH

# 重启 PM2 应用
pm2 restart ai-agent-platform || pm2 start ecosystem.config.js

# 清理临时文件
rm -f /tmp/$DEPLOY_PACKAGE

echo "✅ 服务器端部署完成"
EOF

if [ $? -ne 0 ]; then
    print_message "❌ 服务器端部署失败" $RED
    exit 1
fi

# 6. 验证部署
print_message "🔍 6. 验证部署..." $YELLOW
sleep 5

# 检查服务状态
ssh $SERVER_USER@$SERVER_IP "pm2 status | grep ai-agent-platform"
if [ $? -eq 0 ]; then
    print_message "✅ 应用运行正常" $GREEN
else
    print_message "⚠️  应用状态异常，请检查日志" $YELLOW
fi

# 清理本地临时文件
rm -f $DEPLOY_PACKAGE

print_message "🎉 部署完成！" $GREEN
print_message "🌐 访问地址: https://$DOMAIN" $BLUE
print_message "⚙️  管理后台: https://$DOMAIN/admin" $BLUE
print_message "📊 查看日志: ssh $SERVER_USER@$SERVER_IP 'pm2 logs ai-agent-platform'" $BLUE
echo ""
print_message "💡 如有问题，可以通过以下命令查看详细日志：" $YELLOW
print_message "   ssh $SERVER_USER@$SERVER_IP" $YELLOW
print_message "   pm2 logs ai-agent-platform" $YELLOW