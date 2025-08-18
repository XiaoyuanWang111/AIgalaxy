# Migration Guide: SQLite to PostgreSQL for Vercel Deployment

## Why Migration is Necessary

SQLite uses local file storage which doesn't persist in serverless environments like Vercel. Each function invocation has its own isolated filesystem, causing data loss between requests.

## Step 1: Set up Vercel Postgres

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to the "Storage" tab
4. Click "Create Database" → "Postgres"
5. Follow the setup wizard to create a PostgreSQL database
6. Vercel will automatically add the database connection strings to your environment variables

## Step 2: Update Prisma Schema

Update your `prisma/schema.prisma` file:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("POSTGRES_PRISMA_URL")  // Uses Vercel's connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING")  // Direct connection for migrations
}
```

## Step 3: Update Environment Variables

Vercel automatically provides these environment variables when you create a Postgres database:
- `POSTGRES_PRISMA_URL` - Connection pooling URL (use this for queries)
- `POSTGRES_URL_NON_POOLING` - Direct connection (use for migrations)
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Step 4: Update Data Types in Schema

Some data types need adjustment for PostgreSQL:

1. Change any SQLite-specific types to PostgreSQL equivalents
2. Arrays are supported natively in PostgreSQL (no need to store as strings)

## Step 5: Generate New Prisma Client

```bash
# Delete old client
rm -rf node_modules/.prisma

# Generate new client for PostgreSQL
npm run db:generate
```

## Step 6: Create Initial Migration

```bash
# Create a migration from your schema
npx prisma migrate dev --name init

# This will create the tables in your PostgreSQL database
```

## Step 7: Deploy to Vercel

```bash
# Commit your changes
git add .
git commit -m "fix: migrate from SQLite to PostgreSQL for Vercel deployment"
git push

# Vercel will automatically deploy with the new database
```

## Step 8: Seed Initial Data

After deployment, you can seed your production database:

1. Use Vercel CLI to run commands in production:
```bash
vercel env pull .env.production.local
npm run db:seed
```

Or manually add initial data through your admin interface.

## Alternative: Use Neon or Supabase

If you prefer other PostgreSQL providers:

### Neon (Free tier available)
1. Sign up at https://neon.tech
2. Create a database
3. Copy the connection string
4. Add to Vercel environment variables as `DATABASE_URL`

### Supabase (Free tier available)
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Add to Vercel environment variables as `DATABASE_URL`

## Important Notes

1. **Remove SQLite initialization code**: The `ensureDatabase()` and table creation logic in `lib/db-middleware.ts` is no longer needed with PostgreSQL
2. **Update connection pooling**: PostgreSQL handles connections differently than SQLite
3. **Test locally**: Before deploying, test with a local PostgreSQL instance or use the cloud database directly

## Verification

After migration, verify that:
1. Data persists after adding new agents
2. Admin panel changes are retained
3. All CRUD operations work correctly
4. No database connection errors in Vercel logs