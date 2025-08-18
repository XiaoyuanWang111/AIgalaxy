#!/bin/bash

# CCUsage Dashboard - Universal Launch Script
# This script can be run from anywhere and will find the correct path

# Get the absolute path to this script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/CCUsageDashboard"

# Change to project directory
cd "$PROJECT_DIR"

echo "🎯 Starting CCUsage Dashboard from: $PROJECT_DIR"

# Check if Swift is available
if ! command -v swift > /dev/null 2>&1; then
    osascript -e 'tell app "System Events" to display dialog "Swift is not installed. Please install Xcode from the Mac App Store." buttons {"OK"} default button 1 with icon stop'
    exit 1
fi

# Check if ccusage is available
if ! command -v ccusage > /dev/null 2>&1; then
    osascript -e 'tell app "System Events" to display dialog "ccusage is not installed. Please install it first:\n\nnpm install -g ccusage" buttons {"OK"} default button 1 with icon stop'
    exit 1
fi

# Check if already built
if [ -f ".build/release/CCUsageDashboard" ]; then
    echo "✅ Using existing build..."
else
    echo "🔨 Building Swift package..."
    swift build -c release
    
    if [ $? -ne 0 ]; then
        osascript -e 'tell app "System Events" to display dialog "Build failed. Please check terminal for errors." buttons {"OK"} default button 1 with icon stop'
        exit 1
    fi
fi

# Run the app directly
echo "🚀 Launching CCUsage Dashboard..."
.build/release/CCUsageDashboard

exit 0