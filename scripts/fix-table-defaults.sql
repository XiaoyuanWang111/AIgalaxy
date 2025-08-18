-- 检查并修复表的默认值设置

-- 1. 检查 admins 表的列定义
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'admins'
AND column_name = 'id';

-- 2. 检查是否有默认值函数
SELECT 
    proname as function_name,
    pronargs as arg_count
FROM pg_proc 
WHERE proname IN ('gen_random_uuid', 'uuid_generate_v4', 'cuid')
ORDER BY proname;

-- 3. 修复表的默认值（如果需要）
-- 首先确保 UUID 扩展已启用
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 4. 为表添加默认值
ALTER TABLE admins 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE agents 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE star_magnitude_configs 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE danmaku_config 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE feedback_buttons 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE danmakus 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE agent_applications 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE agent_feedback 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE feedback_config 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE tutorial_config 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 5. 验证修复
SELECT 
    table_name,
    column_name,
    column_default
FROM information_schema.columns
WHERE column_name = 'id'
AND table_schema = 'public'
ORDER BY table_name;