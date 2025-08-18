# 🔧 Vercel Database Connection Fix Guide

## Problem
Your Vercel deployment is failing because it cannot connect to the database. The error shows:
```
Can't reach database server at `aws-0-us-east-1.pooler.supabase.com:6543`
```

## Solution Steps

### Step 1: Clear Vercel Cache
First, we need to clear the old cached database URL:

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Delete the old `DATABASE_URL` if it exists
4. Add a new `DATABASE_URL` with your Supabase connection string

### Step 2: Get Correct Supabase Connection String

1. Go to your Supabase project dashboard
2. Click on **Settings** → **Database**
3. Find the **Connection string** section
4. Choose **"Transaction" mode** (not Session mode)
5. Copy the connection string

It should look like:
```
postgresql://postgres.[your-project-ref]:[your-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Step 3: Update Vercel Environment Variables

Add these environment variables in Vercel:

```env
DATABASE_URL=postgresql://postgres.[your-project-ref]:[your-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Optional: Add these for redundancy
POSTGRES_PRISMA_URL=postgresql://postgres.[your-project-ref]:[your-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
POSTGRES_URL=postgresql://postgres.[your-project-ref]:[your-password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Step 4: Initialize Database Tables

Since Supabase is a blank database, you need to create the tables:

1. Go to Supabase SQL Editor
2. Run the SQL from `scripts/init-supabase.sql`
3. Or use the Prisma migration:

```bash
# In your local project
npx prisma db push
```

### Step 5: Redeploy on Vercel

1. Go to Vercel dashboard
2. Click on your project
3. Go to **Deployments**
4. Click the three dots on the latest deployment
5. Choose **Redeploy**
6. ✅ Check "Use existing Build Cache" OFF (important!)
7. Click **Redeploy**

### Step 6: Verify Connection

After deployment, visit:
```
https://your-app.vercel.app/api/init-db
```

You should see a JSON response with database connection status.

## Alternative: Use Vercel Postgres

If Supabase continues to have issues, consider using Vercel's native Postgres:

1. In Vercel Dashboard → **Storage** → **Create Database**
2. Choose **Postgres**
3. Vercel will automatically set up all environment variables
4. Redeploy your project

## Quick Fix Command

Run this in your terminal to force update and redeploy:

```bash
# Update package version to force cache refresh
npm version patch --no-git-tag-version

# Commit and push
git add package.json package-lock.json
git commit -m "fix: force Vercel cache refresh for database connection"
git push origin main
```

## Environment Variables Summary

Make sure these are set in Vercel:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Supabase/Postgres connection string |
| `SESSION_SECRET` | Any random 32+ character string |
| `ADMIN_EMAIL` | admin@yourdomain.com (optional) |
| `ADMIN_PASSWORD` | your-secure-password (optional) |

## ID Generation Error Fix

If you get "null value in column 'id' violates not-null constraint":

### Option 1: Fix Table Defaults (Recommended)
Run this in Supabase SQL Editor:
```sql
-- Enable UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add default values to all ID columns
ALTER TABLE admins ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE agents ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();
-- ... (run the full script from scripts/fix-table-defaults.sql)
```

### Option 2: Use Prisma to Recreate Tables
```bash
# In your local terminal
export DATABASE_URL="your-supabase-connection-string"

# This will recreate all tables with proper defaults
npx prisma db push --force-reset

# Then seed the database
npm run db:seed
```

### Option 3: Manual ID in SQL
If all else fails, manually provide IDs:
```sql
INSERT INTO admins (id, email, password, name, role, can_change_password, can_manage_admins)
VALUES (
    'a1b2c3d4e5f6',  -- Manual ID
    'admin@example.com',
    '$2a$10$K8ZpdrjrLKVvuE3p.b1yVuWYzAKr8qkTAVYJ4w8F5qD2mI7iQZnW2',
    'System Admin',
    'SUPER_ADMIN',
    true,
    true
);
```

## Still Having Issues?

1. Check Supabase dashboard for connection pooler status
2. Ensure your database is not paused (free tier pauses after 1 week)
3. Try using the direct connection string (port 5432) instead of pooler (port 6543)
4. Check Vercel function logs for detailed error messages