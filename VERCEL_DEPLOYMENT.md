# 🚀 Vercel Deployment Guide for AI Galaxy

## Step 1: Database Setup

### Option A: Use Vercel Postgres (Recommended)
1. In Vercel Dashboard, go to **Storage** tab
2. Click **Create Database** → **Postgres**
3. Choose a name and region
4. Vercel will automatically add all necessary environment variables

### Option B: Use External PostgreSQL
You can use any PostgreSQL provider:
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app
- **Render**: https://render.com

Get your connection string from your provider.

## Step 2: Environment Variables

In Vercel's deployment page, you'll see "Configure Project". Add these environment variables:

### Required Variables
```env
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

### Optional Variables
```env
# Session Secret (auto-generated if not provided)
SESSION_SECRET=your-random-secret-at-least-32-characters

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

## Step 3: Quick Setup

### For Vercel Postgres Users:
Just paste this single line (Vercel handles the rest):
```env
# Vercel will auto-populate DATABASE_URL and related variables
SESSION_SECRET=generate-a-random-32-character-string-here
```

### For External Database Users:
```env
DATABASE_URL=your-postgresql-connection-string
SESSION_SECRET=generate-a-random-32-character-string-here
```

## Step 4: Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

## Post-Deployment

### Initialize Database
After deployment, visit these URLs to set up your database:
1. `https://your-app.vercel.app/api/init-database` - Initialize schema
2. `https://your-app.vercel.app/api/db-seed` - Add sample data

### Access Admin Panel
- URL: `https://your-app.vercel.app/admin`
- Default credentials: 
  - Email: `admin@example.com`
  - Password: `admin123`
  
**Important**: Change these credentials immediately after first login!

## Troubleshooting

### "Database connection failed"
- Ensure your DATABASE_URL includes `?sslmode=require` at the end
- Check that your database allows connections from Vercel's IP ranges

### "Build failed"
- Make sure all environment variables are properly formatted
- No quotes needed around values in Vercel's UI

### "Page not found after deployment"
- Wait 1-2 minutes for deployment to propagate
- Try clearing your browser cache

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `SESSION_SECRET` | ⚠️ | Session encryption key (auto-generated if not set) | `random-32-character-string` |
| `ADMIN_EMAIL` | ❌ | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | ❌ | Admin login password | `secure-password` |
| `NEXT_PUBLIC_APP_NAME` | ❌ | App display name | `AI Galaxy` |

## Need Help?

- Check the [deployment logs](https://vercel.com/docs/concepts/deployments/logs) in Vercel Dashboard
- Open an issue on [GitHub](https://github.com/Xaiver03/AIgalaxy/issues)
- Join our [discussions](https://github.com/Xaiver03/AIgalaxy/discussions)