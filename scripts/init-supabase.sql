-- 创建枚举类型
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

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

-- 创建索引
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_key" ON "admins"("email");
CREATE INDEX IF NOT EXISTS "agents_enabled_idx" ON "agents"("enabled");
CREATE INDEX IF NOT EXISTS "agents_click_count_idx" ON "agents"("click_count");

-- 插入默认数据
INSERT INTO "admins" ("email", "password", "name", "role", "can_change_password", "can_manage_admins")
VALUES ('admin@example.com', '$2a$10$YourHashedPasswordHere', 'System Admin', 'SUPER_ADMIN', true, true)
ON CONFLICT DO NOTHING;

INSERT INTO "danmaku_config" ("enabled", "maxLength", "playSpeed", "batchSize")
VALUES (true, 20, 1.0, 10)
ON CONFLICT DO NOTHING;

-- 插入示例 AI 工具
INSERT INTO "agents" ("name", "description", "tags", "manager", "enabled", "click_count") VALUES
('ChatGPT', 'OpenAI的对话AI助手', ARRAY['AI', 'Chat', 'OpenAI'], 'OpenAI', true, 1000),
('Claude', 'Anthropic的AI助手', ARRAY['AI', 'Chat', 'Anthropic'], 'Anthropic', true, 800),
('Midjourney', 'AI图像生成工具', ARRAY['AI', 'Image', 'Art'], 'Midjourney', true, 1200),
('Stable Diffusion', '开源AI图像生成', ARRAY['AI', 'Image', 'Open Source'], 'Stability AI', true, 600),
('GitHub Copilot', 'AI编程助手', ARRAY['AI', 'Coding', 'GitHub'], 'GitHub', true, 1500)
ON CONFLICT DO NOTHING;