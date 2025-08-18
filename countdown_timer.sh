#!/bin/bash

# 获取用户输入的时间
echo "请输入倒计时时间（例如: 30s, 5min, 2h, 1h30min, 5min30s）："
read time_input

# 解析时间输入的函数
parse_time() {
    local input="$1"
    local total_seconds=0
    
    # 匹配小时
    if [[ "$input" =~ ([0-9]+)h ]]; then
        total_seconds=$((total_seconds + ${BASH_REMATCH[1]} * 3600))
        input="${input//${BASH_REMATCH[0]}/}"
    fi
    
    # 匹配分钟
    if [[ "$input" =~ ([0-9]+)min ]]; then
        total_seconds=$((total_seconds + ${BASH_REMATCH[1]} * 60))
        input="${input//${BASH_REMATCH[0]}/}"
    fi
    
    # 匹配秒
    if [[ "$input" =~ ([0-9]+)s ]]; then
        total_seconds=$((total_seconds + ${BASH_REMATCH[1]}))
        input="${input//${BASH_REMATCH[0]}/}"
    fi
    
    # 如果输入是纯数字，视为秒
    if [[ "$input" =~ ^[0-9]+$ ]]; then
        total_seconds=$((total_seconds + input))
        input=""
    fi
    
    # 检查是否有剩余未解析的内容
    if [[ -n "$input" && ! "$input" =~ ^[[:space:]]*$ ]]; then
        echo "0"
        return 1
    fi
    
    echo "$total_seconds"
    return 0
}

# 解析输入的时间
seconds=$(parse_time "$time_input")

if [[ "$seconds" -eq 0 ]]; then
    echo "错误：请输入有效的时间格式（例如: 30s, 5min, 2h, 1h30min, 5min30s）"
    exit 1
fi

echo "开始倒计时 $time_input（总计 $seconds 秒）..."

# 使用caffeinate命令防止Mac休眠
# -d 防止显示器休眠
# -i 防止系统空闲休眠
# -m 防止磁盘休眠
caffeinate -dim bash -c "
    start_time=\$(date +%s)
    end_time=\$((start_time + $seconds))
    
    while [ \$(date +%s) -lt \$end_time ]; do
        remaining=\$((end_time - \$(date +%s)))
        hours=\$((remaining / 3600))
        minutes=\$(((remaining % 3600) / 60))
        secs=\$((remaining % 60))
        
        # 清除当前行并显示倒计时
        printf '\r剩余时间: %02d:%02d:%02d' \$hours \$minutes \$secs
        
        sleep 1
    done
    
    echo -e '\n倒计时结束！'
"

# 倒计时结束后启动Claude交互脚本
echo "正在启动Claude交互脚本..."
./claude_interaction.sh