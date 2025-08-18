#!/bin/bash

echo "🔧 Prisma Database Push Script"
echo "============================="
echo ""

# 检查环境变量
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set!"
    echo ""
    echo "Please set it first:"
    echo "export DATABASE_URL='postgresql://postgres.xjvnzhpgzdabxgkbxxwx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres'"
    exit 1
fi

echo "📊 Using database: ${DATABASE_URL%%@*}@***"
echo ""

# 1. 生成 Prisma Client
echo "1️⃣ Generating Prisma Client..."
npx prisma generate

# 2. 推送架构到数据库
echo ""
echo "2️⃣ Pushing schema to database..."
echo "This will create all tables with proper default values..."
npx prisma db push --force-reset

# 3. 运行种子数据
echo ""
echo "3️⃣ Seeding database..."
npm run db:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify at: https://your-app.vercel.app/api/init-db"
echo "2. Login at: https://your-app.vercel.app/admin"
echo "   - Email: admin@example.com"
echo "   - Password: admin123"