-- Database Verification Script
-- Run this to check if your database is properly set up

-- 1. Check all tables
SELECT '=== Tables ===' as info;
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check types
SELECT '=== Types ===' as info;
SELECT typname as type_name
FROM pg_type 
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND typtype = 'e'
ORDER BY typname;

-- 3. Check constraints
SELECT '=== Constraints ===' as info;
SELECT conname as constraint_name, 
       conrelid::regclass as table_name,
       contype as constraint_type
FROM pg_constraint
WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY conname;

-- 4. Check row counts
SELECT '=== Row Counts ===' as info;
SELECT 'agents' as table_name, COUNT(*) as row_count FROM agents
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'danmaku_config', COUNT(*) FROM danmaku_config
UNION ALL
SELECT 'star_magnitude_configs', COUNT(*) FROM star_magnitude_configs
ORDER BY table_name;

-- 5. Check if admin exists
SELECT '=== Admin Users ===' as info;
SELECT email, name, role FROM admins;

-- 6. Check sample agents
SELECT '=== Sample Agents ===' as info;
SELECT name, click_count, enabled FROM agents ORDER BY click_count DESC LIMIT 5;