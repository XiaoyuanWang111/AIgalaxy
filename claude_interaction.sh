#!/bin/bash

# 使用AppleScript自动与Claude交互
osascript << 'EOF'
-- 启动Claude命令行工具
tell application "Terminal"
    activate
    
    -- 创建新的Terminal窗口
    tell application "System Events"
        keystroke "n" using {command down}
        delay 1
    end tell
    
    -- 在新窗口中输入claude命令
    do script "claude" in window 1
    
    -- 等待Claude启动
    delay 3
    
    -- 输入hello并发送
    tell application "System Events"
        -- 输入hello
        keystroke "hello"
        delay 0.5
        -- 按回车发送
        keystroke return
    end tell
end tell
EOF

echo "Claude交互脚本执行完成"