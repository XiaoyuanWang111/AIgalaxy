#!/bin/bash

echo "🚀 AI Galaxy 自动部署脚本"
echo "============================"

echo "📋 准备部署环境..."

# 检查Git状态
echo "1. 检查Git状态..."
git status --porcelain

# 构建项目
echo "2. 构建项目..."
npm run build

# 提交任何未提交的更改
if [[ $(git status --porcelain) ]]; then
  echo "3. 提交最新更改..."
  git add -A
  git commit -m "feat: prepare for full production deployment with database

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
  git push origin main
else
  echo "3. 代码已是最新状态"
fi

echo "✅ 准备就绪！"
echo ""
echo "🌐 部署步骤："
echo "1. 访问 https://vercel.com 并登录"
echo "2. 点击 'New Project'"
echo "3. 导入GitHub仓库: XiaoyuanWang111/AIgalaxy"
echo "4. 在环境变量中添加数据库连接"
echo "5. 点击 Deploy"
echo ""
echo "📚 详细说明请参考项目文档"