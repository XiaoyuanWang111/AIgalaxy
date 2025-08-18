-- Minimal initialization script for AI Galaxy
-- This only inserts data, assuming tables already exist

-- 1. Check if admin exists first
DO $$
BEGIN
    -- Only insert if admin doesn't exist
    IF NOT EXISTS (SELECT 1 FROM admins WHERE email = 'admin@example.com') THEN
        INSERT INTO "admins" (
            "id", 
            "email", 
            "password", 
            "name", 
            "role", 
            "can_change_password", 
            "can_manage_admins"
        ) VALUES (
            'cm3admin001',
            'admin@example.com', 
            '$2a$10$K8ZpdrjrLKVvuE3p.b1yVuWYzAKr8qkTAVYJ4w8F5qD2mI7iQZnW2', 
            'System Admin', 
            'SUPER_ADMIN', 
            true, 
            true
        );
    ELSE
        -- Update password if admin exists
        UPDATE admins 
        SET password = '$2a$10$K8ZpdrjrLKVvuE3p.b1yVuWYzAKr8qkTAVYJ4w8F5qD2mI7iQZnW2'
        WHERE email = 'admin@example.com';
    END IF;
END$$;

-- 2. Insert danmaku config
INSERT INTO "danmaku_config" ("id", "enabled", "maxLength", "playSpeed", "batchSize")
VALUES ('default', true, 20, 1.0, 10)
ON CONFLICT (id) DO UPDATE SET
    enabled = EXCLUDED.enabled,
    maxLength = EXCLUDED.maxLength,
    playSpeed = EXCLUDED.playSpeed,
    batchSize = EXCLUDED.batchSize;

-- 3. Insert star magnitude configs
DO $$
DECLARE
    configs RECORD;
BEGIN
    FOR configs IN 
        SELECT * FROM (
            VALUES 
            ('cm3mag001', 1, 1000, NULL::INTEGER, 5::FLOAT, 1::FLOAT, 0.8::FLOAT, '#FFD700', '超亮恒星', 1),
            ('cm3mag002', 2, 500, 999, 4::FLOAT, 0.9::FLOAT, 0.6::FLOAT, '#FFA500', '亮恒星', 2),
            ('cm3mag003', 3, 200, 499, 3::FLOAT, 0.8::FLOAT, 0.4::FLOAT, '#FF8C00', '恒星', 3),
            ('cm3mag004', 4, 100, 199, 2.5::FLOAT, 0.7::FLOAT, 0.3::FLOAT, '#FF6347', '亮星', 4),
            ('cm3mag005', 5, 50, 99, 2::FLOAT, 0.6::FLOAT, 0.2::FLOAT, '#FF4500', '星星', 5),
            ('cm3mag006', 6, 20, 49, 1.5::FLOAT, 0.5::FLOAT, 0.1::FLOAT, '#DC143C', '暗星', 6),
            ('cm3mag007', 7, 0, 19, 1::FLOAT, 0.4::FLOAT, 0::FLOAT, '#8B0000', '微光星', 7)
        ) AS t(id, magnitude, minClicks, maxClicks, size, brightness, glow, color, label, orderIndex)
    LOOP
        INSERT INTO star_magnitude_configs (id, magnitude, "minClicks", "maxClicks", size, brightness, glow, color, label, "orderIndex")
        VALUES (configs.id, configs.magnitude, configs.minClicks, configs.maxClicks, configs.size, configs.brightness, configs.glow, configs.color, configs.label, configs.orderIndex)
        ON CONFLICT (magnitude) DO NOTHING;
    END LOOP;
END$$;

-- 4. Insert sample AI agents
DO $$
DECLARE
    agent RECORD;
BEGIN
    FOR agent IN 
        SELECT * FROM (
            VALUES 
            ('cm3agent001', 'ChatGPT', 'OpenAI的对话AI助手', ARRAY['AI', 'Chat', 'OpenAI'], 'OpenAI', true, 1000),
            ('cm3agent002', 'Claude', 'Anthropic的AI助手', ARRAY['AI', 'Chat', 'Anthropic'], 'Anthropic', true, 800),
            ('cm3agent003', 'Midjourney', 'AI图像生成工具', ARRAY['AI', 'Image', 'Art'], 'Midjourney', true, 1200),
            ('cm3agent004', 'Stable Diffusion', '开源AI图像生成', ARRAY['AI', 'Image', 'Open Source'], 'Stability AI', true, 600),
            ('cm3agent005', 'GitHub Copilot', 'AI编程助手', ARRAY['AI', 'Coding', 'GitHub'], 'GitHub', true, 1500),
            ('cm3agent006', 'DALL-E 3', 'OpenAI图像生成', ARRAY['AI', 'Image', 'OpenAI'], 'OpenAI', true, 900),
            ('cm3agent007', 'Bard', 'Google AI助手', ARRAY['AI', 'Chat', 'Google'], 'Google', true, 700),
            ('cm3agent008', 'Perplexity', 'AI搜索引擎', ARRAY['AI', 'Search', 'Research'], 'Perplexity AI', true, 400)
        ) AS t(id, name, description, tags, manager, enabled, click_count)
    LOOP
        -- Check if agent exists by name
        IF NOT EXISTS (SELECT 1 FROM agents WHERE name = agent.name) THEN
            INSERT INTO agents (id, name, description, tags, manager, enabled, click_count)
            VALUES (agent.id, agent.name, agent.description, agent.tags, agent.manager, agent.enabled, agent.click_count);
        END IF;
    END LOOP;
END$$;

-- Show results
SELECT 'Initialization complete!' as status;
SELECT COUNT(*) as admin_count FROM admins;
SELECT COUNT(*) as agent_count FROM agents;
SELECT COUNT(*) as config_count FROM star_magnitude_configs;