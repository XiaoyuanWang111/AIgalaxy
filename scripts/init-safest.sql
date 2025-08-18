-- 最安全的初始化脚本 - 只插入必要数据，避免任何副作用

-- 1. 只在管理员不存在时插入
INSERT INTO "admins" (
    "email", 
    "password", 
    "name", 
    "role", 
    "can_change_password", 
    "can_manage_admins"
) 
SELECT 
    'admin@example.com',
    '$2a$10$K8ZpdrjrLKVvuE3p.b1yVuWYzAKr8qkTAVYJ4w8F5qD2mI7iQZnW2',
    'System Admin',
    'SUPER_ADMIN',
    true,
    true
WHERE NOT EXISTS (
    SELECT 1 FROM admins WHERE email = 'admin@example.com'
);

-- 2. 只在配置不存在时插入
INSERT INTO "danmaku_config" (
    "enabled", 
    "maxLength", 
    "playSpeed", 
    "batchSize"
)
SELECT 
    true,
    20,
    1.0,
    10
WHERE NOT EXISTS (
    SELECT 1 FROM danmaku_config LIMIT 1
);

-- 显示结果
SELECT 'Initialization complete!' as status;
SELECT email, name FROM admins WHERE email = 'admin@example.com';
SELECT COUNT(*) as config_count FROM danmaku_config;