-- Enable UUID extension in Supabase
-- This is required for gen_random_uuid() function

-- Check if extension exists
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

-- Enable the extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Alternative: pgcrypto extension also provides gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Test UUID generation
SELECT gen_random_uuid() as test_uuid;

-- Show all available extensions
SELECT name, default_version, installed_version, comment 
FROM pg_available_extensions 
WHERE name IN ('uuid-ossp', 'pgcrypto')
ORDER BY name;