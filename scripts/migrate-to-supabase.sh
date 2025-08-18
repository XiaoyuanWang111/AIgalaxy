#!/bin/bash

# Supabase Database Migration Script
# This script helps migrate the schema to Supabase

echo "🚀 Supabase Database Migration Tool"
echo "=================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set it with your Supabase connection string:"
    echo "export DATABASE_URL='postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres'"
    exit 1
fi

echo "📊 Using database: $DATABASE_URL"
echo ""

# Generate Prisma client
echo "1️⃣ Generating Prisma client..."
npx prisma generate

# Push schema to database
echo ""
echo "2️⃣ Pushing schema to Supabase..."
npx prisma db push --skip-generate

# Run seed if requested
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "3️⃣ Seeding database..."
    npx tsx prisma/seed.ts
else
    echo "3️⃣ Skipping seed data"
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Update your Vercel environment variables"
echo "2. Redeploy your Vercel project"
echo "3. Visit https://your-app.vercel.app/api/init-db to verify"