-- AI Galaxy Database Initialization for Docker
-- This script runs when PostgreSQL container starts for the first time

-- Create user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ai_galaxy_user') THEN
        CREATE USER ai_galaxy_user WITH ENCRYPTED PASSWORD 'ai_galaxy_password_2024';
    END IF;
END
$$;

-- Create database if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'ai_galaxy') THEN
        CREATE DATABASE ai_galaxy OWNER ai_galaxy_user;
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ai_galaxy TO ai_galaxy_user;

-- Connect to the new database
\c ai_galaxy;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO ai_galaxy_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ai_galaxy_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ai_galaxy_user;

-- Create initial admin user function for later use
CREATE OR REPLACE FUNCTION create_default_admin()
RETURNS void AS $$
BEGIN
    -- This will be called after Prisma creates the tables
    RAISE NOTICE 'Database initialized. Admin user will be created by application startup.';
END;
$$ LANGUAGE plpgsql;

-- Performance optimizations
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Reload configuration
SELECT pg_reload_conf();