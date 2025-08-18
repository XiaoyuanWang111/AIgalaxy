-- Simple initialization script that uses cuid() for ID generation
-- This matches Prisma's default ID generation

-- Enable extensions for ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Simple function to generate CUID-like IDs
CREATE OR REPLACE FUNCTION generate_cuid() RETURNS TEXT AS $$
BEGIN
    RETURN 'c' || substr(md5(random()::text || clock_timestamp()::text), 1, 24);
END;
$$ LANGUAGE plpgsql;

-- 1. Insert default admin
INSERT INTO "admins" (
    "id",
    "email", 
    "password", 
    "name", 
    "role", 
    "can_change_password", 
    "can_manage_admins",
    "created_at",
    "updated_at"
) 
SELECT 
    generate_cuid(),
    'admin@example.com',
    '$2a$10$K8ZpdrjrLKVvuE3p.b1yVuWYzAKr8qkTAVYJ4w8F5qD2mI7iQZnW2',
    'System Admin',
    'SUPER_ADMIN',
    true,
    true,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM admins WHERE email = 'admin@example.com'
);

-- 2. Insert danmaku config
INSERT INTO "danmaku_config" (
    "id",
    "enabled", 
    "maxLength", 
    "playSpeed", 
    "batchSize",
    "created_at",
    "updated_at"
)
SELECT 
    generate_cuid(),
    true,
    20,
    1.0,
    10,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM danmaku_config LIMIT 1
);

-- 3. Insert star magnitude configs
WITH mag_data AS (
    SELECT * FROM (VALUES
        (1, 1000, NULL::INTEGER, 5::FLOAT, 1::FLOAT, 0.8::FLOAT, '#FFD700', '超亮恒星', 1),
        (2, 500, 999, 4::FLOAT, 0.9::FLOAT, 0.6::FLOAT, '#FFA500', '亮恒星', 2),
        (3, 200, 499, 3::FLOAT, 0.8::FLOAT, 0.4::FLOAT, '#FF8C00', '恒星', 3),
        (4, 100, 199, 2.5::FLOAT, 0.7::FLOAT, 0.3::FLOAT, '#FF6347', '亮星', 4),
        (5, 50, 99, 2::FLOAT, 0.6::FLOAT, 0.2::FLOAT, '#FF4500', '星星', 5),
        (6, 20, 49, 1.5::FLOAT, 0.5::FLOAT, 0.1::FLOAT, '#DC143C', '暗星', 6),
        (7, 0, 19, 1::FLOAT, 0.4::FLOAT, 0::FLOAT, '#8B0000', '微光星', 7)
    ) AS t(magnitude, minClicks, maxClicks, size, brightness, glow, color, label, orderIndex)
)
INSERT INTO "star_magnitude_configs" (
    "id", 
    "magnitude", 
    "minClicks", 
    "maxClicks", 
    "size", 
    "brightness", 
    "glow", 
    "color", 
    "label", 
    "orderIndex",
    "created_at",
    "updated_at"
)
SELECT 
    generate_cuid(),
    magnitude,
    minClicks,
    maxClicks,
    size,
    brightness,
    glow,
    color,
    label,
    orderIndex,
    NOW(),
    NOW()
FROM mag_data
WHERE NOT EXISTS (
    SELECT 1 FROM star_magnitude_configs WHERE magnitude = mag_data.magnitude
);

-- 4. Insert sample agents
WITH agent_data AS (
    SELECT * FROM (VALUES
        ('ChatGPT', 'OpenAI的对话AI助手', ARRAY['AI', 'Chat', 'OpenAI'], 'OpenAI', true, 1000),
        ('Claude', 'Anthropic的AI助手', ARRAY['AI', 'Chat', 'Anthropic'], 'Anthropic', true, 800),
        ('Midjourney', 'AI图像生成工具', ARRAY['AI', 'Image', 'Art'], 'Midjourney', true, 1200),
        ('Stable Diffusion', '开源AI图像生成', ARRAY['AI', 'Image', 'Open Source'], 'Stability AI', true, 600),
        ('GitHub Copilot', 'AI编程助手', ARRAY['AI', 'Coding', 'GitHub'], 'GitHub', true, 1500)
    ) AS t(name, description, tags, manager, enabled, click_count)
)
INSERT INTO "agents" (
    "id",
    "name", 
    "description", 
    "tags", 
    "manager", 
    "enabled", 
    "click_count",
    "created_at",
    "updated_at"
)
SELECT 
    generate_cuid(),
    name,
    description,
    tags,
    manager,
    enabled,
    click_count,
    NOW(),
    NOW()
FROM agent_data
WHERE NOT EXISTS (
    SELECT 1 FROM agents WHERE name = agent_data.name
);

-- Show results
SELECT 'Database initialized!' as status;
SELECT COUNT(*) as admin_count FROM admins;
SELECT COUNT(*) as agent_count FROM agents;
SELECT COUNT(*) as magnitude_config_count FROM star_magnitude_configs;