#!/bin/bash

# Migration script from SQLite to PostgreSQL for Vercel deployment
# This script helps automate the migration process

set -e  # Exit on any error

echo "🚀 Starting migration from SQLite to PostgreSQL..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Backup current files
echo "📦 Creating backups..."
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

cp prisma/schema.prisma "$BACKUP_DIR/schema.prisma.sqlite.backup"
cp lib/prisma.ts "$BACKUP_DIR/prisma.ts.sqlite.backup"
cp .env.local "$BACKUP_DIR/.env.local.backup" 2>/dev/null || echo "No .env.local found"

echo "✅ Backups created in $BACKUP_DIR"

# Replace schema file
echo "🔄 Updating Prisma schema..."
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Replace prisma client file
echo "🔄 Updating Prisma client..."
cp lib/prisma.postgresql.ts lib/prisma.ts

# Remove SQLite-specific middleware (if you want to keep it for reference, comment this line)
echo "🧹 Removing SQLite-specific database middleware..."
if [ -f "lib/db-middleware.ts" ]; then
    mv lib/db-middleware.ts "$BACKUP_DIR/db-middleware.ts.backup"
    echo "// SQLite database middleware is no longer needed with PostgreSQL" > lib/db-middleware.ts
    echo "// All database operations are handled through Prisma migrations" >> lib/db-middleware.ts
    echo "" >> lib/db-middleware.ts
    echo "export async function ensureDatabase(): Promise<void> {" >> lib/db-middleware.ts
    echo "  // No-op for PostgreSQL - tables are created via migrations" >> lib/db-middleware.ts
    echo "  console.log('Database operations handled by PostgreSQL and Prisma migrations')" >> lib/db-middleware.ts
    echo "}" >> lib/db-middleware.ts
fi

# Clean up temporary files
rm -f prisma/schema.postgresql.prisma lib/prisma.postgresql.ts 2>/dev/null || true

echo ""
echo "✅ Migration preparation complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set up PostgreSQL database in Vercel dashboard (Storage > Create Database > Postgres)"
echo "2. Generate new Prisma client: npm run db:generate"
echo "3. Create initial migration: npx prisma migrate dev --name init"
echo "4. Test locally if possible"
echo "5. Commit and push to deploy: git add . && git commit -m 'fix: migrate to PostgreSQL for Vercel deployment' && git push"
echo ""
echo "📚 See MIGRATION_GUIDE.md for detailed instructions"
echo "📁 Backups are stored in: $BACKUP_DIR"