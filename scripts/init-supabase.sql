-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 创建枚举类型 (仅在不存在时创建)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ApplicationStatus') THEN
        CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AdminRole') THEN
        CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');
    END IF;
END$$;

-- 创建 agents 表
CREATE TABLE IF NOT EXISTS "agents" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "manager" TEXT NOT NULL,
    "guide_url" TEXT,
    "homepage" TEXT,
    "icon" TEXT,
    "cover_image" TEXT,
    "guide_content" TEXT,
    "theme_color" TEXT DEFAULT '#FFFFFF',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- 创建 users 表
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 创建 admins 表
CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "can_change_password" BOOLEAN NOT NULL DEFAULT false,
    "can_manage_admins" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- 创建 feedback_buttons 表
CREATE TABLE IF NOT EXISTS "feedback_buttons" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_buttons_pkey" PRIMARY KEY ("id")
);

-- 创建 danmaku_config 表
CREATE TABLE IF NOT EXISTS "danmaku_config" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "maxLength" INTEGER NOT NULL DEFAULT 20,
    "playSpeed" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "batchSize" INTEGER NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "danmaku_config_pkey" PRIMARY KEY ("id")
);

-- 创建 danmakus 表
CREATE TABLE IF NOT EXISTS "danmakus" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#FFFFFF',
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "danmakus_pkey" PRIMARY KEY ("id")
);

-- 创建 agent_applications 表
CREATE TABLE IF NOT EXISTS "agent_applications" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "agent_id" TEXT NOT NULL,
    "applicant_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_applications_pkey" PRIMARY KEY ("id")
);

-- 创建 agent_feedback 表
CREATE TABLE IF NOT EXISTS "agent_feedback" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "agent_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT,
    "score" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_feedback_pkey" PRIMARY KEY ("id")
);

-- 创建 feedback_config 表
CREATE TABLE IF NOT EXISTS "feedback_config" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "product_feedback_url" TEXT NOT NULL,
    "platform_feedback_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_config_pkey" PRIMARY KEY ("id")
);

-- 创建 star_magnitude_configs 表
CREATE TABLE IF NOT EXISTS "star_magnitude_configs" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "magnitude" INTEGER NOT NULL,
    "minClicks" INTEGER NOT NULL,
    "maxClicks" INTEGER,
    "size" DOUBLE PRECISION NOT NULL,
    "brightness" DOUBLE PRECISION NOT NULL,
    "glow" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "star_magnitude_configs_pkey" PRIMARY KEY ("id")
);

-- 创建 tutorial_config 表
CREATE TABLE IF NOT EXISTS "tutorial_config" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "miracle_tutorial_url" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL DEFAULT '奇绩教程',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutorial_config_pkey" PRIMARY KEY ("id")
);

-- 创建索引
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_key" ON "admins"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "star_magnitude_configs_magnitude_key" ON "star_magnitude_configs"("magnitude");
CREATE INDEX IF NOT EXISTS "agents_enabled_idx" ON "agents"("enabled");
CREATE INDEX IF NOT EXISTS "agents_click_count_idx" ON "agents"("click_count");
CREATE INDEX IF NOT EXISTS "star_magnitude_configs_isEnabled_idx" ON "star_magnitude_configs"("isEnabled");

-- 创建外键约束（仅在不存在时创建）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'agent_applications_agent_id_fkey'
    ) THEN
        ALTER TABLE "agent_applications" ADD CONSTRAINT "agent_applications_agent_id_fkey" 
            FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'agent_feedback_agent_id_fkey'
    ) THEN
        ALTER TABLE "agent_feedback" ADD CONSTRAINT "agent_feedback_agent_id_fkey" 
            FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- 插入默认数据
-- 插入默认管理员 (password: admin123)
INSERT INTO "admins" ("email", "password", "name", "role", "can_change_password", "can_manage_admins")
VALUES ('admin@example.com', '$2a$10$K8ZpdrjrLKVvuE3p.b1yVuWYzAKr8qkTAVYJ4w8F5qD2mI7iQZnW2', 'System Admin', 'SUPER_ADMIN', true, true)
ON CONFLICT DO NOTHING;

INSERT INTO "danmaku_config" ("enabled", "maxLength", "playSpeed", "batchSize")
VALUES (true, 20, 1.0, 10)
ON CONFLICT DO NOTHING;

-- 插入星等配置
INSERT INTO "star_magnitude_configs" ("magnitude", "minClicks", "maxClicks", "size", "brightness", "glow", "color", "label", "orderIndex") VALUES
(1, 1000, NULL, 5, 1, 0.8, '#FFD700', '超亮恒星', 1),
(2, 500, 999, 4, 0.9, 0.6, '#FFA500', '亮恒星', 2),
(3, 200, 499, 3, 0.8, 0.4, '#FF8C00', '恒星', 3),
(4, 100, 199, 2.5, 0.7, 0.3, '#FF6347', '亮星', 4),
(5, 50, 99, 2, 0.6, 0.2, '#FF4500', '星星', 5),
(6, 20, 49, 1.5, 0.5, 0.1, '#DC143C', '暗星', 6),
(7, 0, 19, 1, 0.4, 0, '#8B0000', '微光星', 7)
ON CONFLICT (magnitude) DO NOTHING;

-- 插入示例 AI 工具
INSERT INTO "agents" ("name", "description", "tags", "manager", "enabled", "click_count") VALUES
('ChatGPT', 'OpenAI的对话AI助手', ARRAY['AI', 'Chat', 'OpenAI'], 'OpenAI', true, 1000),
('Claude', 'Anthropic的AI助手', ARRAY['AI', 'Chat', 'Anthropic'], 'Anthropic', true, 800),
('Midjourney', 'AI图像生成工具', ARRAY['AI', 'Image', 'Art'], 'Midjourney', true, 1200),
('Stable Diffusion', '开源AI图像生成', ARRAY['AI', 'Image', 'Open Source'], 'Stability AI', true, 600),
('GitHub Copilot', 'AI编程助手', ARRAY['AI', 'Coding', 'GitHub'], 'GitHub', true, 1500)
ON CONFLICT DO NOTHING;