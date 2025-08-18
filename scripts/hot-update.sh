#!/bin/bash

# 热更新脚本 - 只更新修改的文件，速度更快
# 用法: ./hot-update.sh

SERVER_IP="192.144.154.224"
SERVER_USER="root"
DOMAIN="mpai.openpenpal.com"
REMOTE_PATH="/www/wwwroot/$DOMAIN"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${2}[$(date '+%H:%M:%S')] $1${NC}"
}

print_message "⚡ 热更新模式 - 快速部署..." $BLUE

# 1. 本地构建（如果需要）
if [ "$1" = "--build" ] || [ ! -d ".next" ]; then
    print_message "📦 重新构建..." $YELLOW
    npm run build
    npx prisma generate
fi

# 2. 同步文件（只更新修改的文件）
print_message "🔄 同步文件到服务器..." $YELLOW

# 使用 rsync 进行增量同步，只传输修改的文件
rsync -avz --progress \
    --exclude='node_modules/' \
    --exclude='.git/' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='*.tar.gz' \
    --exclude='.env.local' \
    .next/ $SERVER_USER@$SERVER_IP:$REMOTE_PATH/.next/

rsync -avz --progress \
    app/ $SERVER_USER@$SERVER_IP:$REMOTE_PATH/app/

rsync -avz --progress \
    components/ $SERVER_USER@$SERVER_IP:$REMOTE_PATH/components/

# 同步其他必要文件
rsync -avz --progress \
    package.json \
    next.config.js \
    .env.production \
    $SERVER_USER@$SERVER_IP:$REMOTE_PATH/

# 3. 服务器端更新
print_message "⚙️  服务器端更新..." $YELLOW
ssh $SERVER_USER@$SERVER_IP << EOF
cd $REMOTE_PATH
npm ci --only=production --silent
npx prisma generate > /dev/null
pm2 reload ai-agent-platform
EOF

print_message "✅ 热更新完成！" $GREEN
print_message "🌐 访问: https://$DOMAIN" $BLUE