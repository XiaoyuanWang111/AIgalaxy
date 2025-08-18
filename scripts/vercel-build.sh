#!/bin/bash

echo "Starting Vercel build process..."

# 如果没有 DATABASE_URL，使用 POSTGRES_PRISMA_URL
if [ -z "$DATABASE_URL" ] && [ ! -z "$POSTGRES_PRISMA_URL" ]; then
  echo "Setting DATABASE_URL from POSTGRES_PRISMA_URL"
  export DATABASE_URL="$POSTGRES_PRISMA_URL"
fi

# 如果还是没有 DATABASE_URL，使用占位符让构建继续
if [ -z "$DATABASE_URL" ]; then
  echo "Warning: DATABASE_URL not found, using placeholder"
  export DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
fi

echo "DATABASE_URL is set: ${DATABASE_URL:0:30}..."

# 运行构建
echo "Running Next.js build..."
npm run build

echo "Build completed!"