#!/bin/bash

# CCUsage Dashboard - Terminal Version
# Simple terminal-based dashboard using ccusage commands directly

clear
echo "🎯 CCUsage Dashboard - Terminal Version"
echo "========================================"

# Function to display real-time data
show_realtime() {
    echo "📊 Real-time Session Data:"
    echo "-------------------------"
    ccusage blocks --live --refresh-interval 5 2> /dev/null | head -20
    echo ""
}

# Function to show daily usage
show_daily() {
    echo "📈 Daily Usage (Last 30 days):"
    echo "-----------------------------"
    ccusage daily --since $(date -v-30d +%Y%m%d) 2> /dev/null
    echo ""
}

# Function to show monthly summary
show_monthly() {
    echo "📅 This Month Summary:"
    echo "---------------------"
    
    # Get current month data
    current_month=$(date +%Y%m)
    ccusage daily --since ${current_month}01 2> /dev/null | while read line; do
        echo "$line"
    done
    
    # Calculate totals
    total_tokens=$(ccusage daily --since ${current_month}01 --json 2> /dev/null | grep -o '"tokens":[0-9]*' | sed 's/"tokens"://' | awk '{sum+=$1} END {print sum}')
    total_cost=$(ccusage daily --since ${current_month}01 --json 2> /dev/null | grep -o '"cost":[0-9.]*' | sed 's/"cost"://' | awk '{sum+=$1} END {print sum}')
    total_sessions=$(ccusage daily --since ${current_month}01 --json 2> /dev/null | grep -o '"sessions":[0-9]*' | sed 's/"sessions"://' | awk '{sum+=$1} END {print sum}')
    
    if [ -n "$total_tokens" ] && [ "$total_tokens" != "0" ]; then
        echo ""
        echo "📊 Monthly Totals:"
        echo "   Total Tokens: $(printf "%'d" $total_tokens)"
        echo "   Total Cost: \$$total_cost"
        echo "   Total Sessions: $total_sessions"
    else
        echo "   No data available for this month"
    fi
    echo ""
}

# Function to show simple dashboard
show_dashboard() {
    clear
    echo "🎯 CCUsage Dashboard - Terminal Version"
    echo "========================================"
    echo "$(date)"
    echo ""
    
    show_monthly
    show_daily
    
    echo "🔄 Press Ctrl+C to exit, or wait 30 seconds for refresh..."
    echo "   Press 'r' + Enter for real-time mode"
    echo "   Press 'd' + Enter for daily view"
    echo "   Press 'q' + Enter to quit"
}

# Check if ccusage is available
if ! command -v ccusage > /dev/null 2>&1; then
    echo "❌ ccusage is not installed. Please install it first:"
    echo "   npm install -g ccusage"
    exit 1
fi

# Main menu
while true; do
    show_dashboard
    
    # Read user input with timeout
    if read -t 30 -n 1 key; then
        case $key in
            q|Q)
                echo ""
                echo "👋 Goodbye!"
                exit 0
                ;;
            r|R)
                echo ""
                echo "🔄 Entering real-time mode (Ctrl+C to exit)..."
                ccusage blocks --live
                ;;
            d|D)
                echo ""
                echo "📅 Daily view..."
                show_daily
                read -p "Press Enter to continue..."
                ;;
            *)
                continue
                ;;
        esac
    fi
done