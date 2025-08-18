-- Quick fix for Supabase database initialization
-- Run this in Supabase SQL Editor to fix the type creation issue

-- First, let's check what tables already exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check existing types
SELECT typname 
FROM pg_type 
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND typtype = 'e'
ORDER BY typname;

-- If you need to start fresh, uncomment and run these:
-- DROP TABLE IF EXISTS agent_feedback CASCADE;
-- DROP TABLE IF EXISTS agent_applications CASCADE;
-- DROP TABLE IF EXISTS agents CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS admins CASCADE;
-- DROP TABLE IF EXISTS feedback_buttons CASCADE;
-- DROP TABLE IF EXISTS feedback_config CASCADE;
-- DROP TABLE IF EXISTS star_magnitude_configs CASCADE;
-- DROP TABLE IF EXISTS danmaku_config CASCADE;
-- DROP TABLE IF EXISTS danmakus CASCADE;
-- DROP TABLE IF EXISTS tutorial_config CASCADE;

-- Drop types only if no tables depend on them
-- DROP TYPE IF EXISTS "ApplicationStatus" CASCADE;
-- DROP TYPE IF EXISTS "UserRole" CASCADE;
-- DROP TYPE IF EXISTS "AdminRole" CASCADE;

-- Then run the init-supabase.sql script