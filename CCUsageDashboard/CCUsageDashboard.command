#!/bin/bash

# CCUsage Dashboard - Double-click to run
# This script creates and launches the CCUsage Dashboard

# Change to the script's directory
cd "$(dirname "$0")"

# Check if the app already exists
if [ -d "CCUsageDashboard.app" ]; then
    echo "🚀 Launching existing CCUsage Dashboard..."
    open "CCUsageDashboard.app"
    exit 0
fi

# Create the app bundle
APP_NAME="CCUsageDashboard.app"
APP_DIR="./$APP_NAME"

echo "🎯 Creating CCUsage Dashboard..."

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

# Build the Swift package
echo "🔨 Building Swift package..."
swift build -c release --package-path CCUsageDashboard

if [ $? -ne 0 ]; then
    osascript -e 'tell app "System Events" to display dialog "Build failed. Please check terminal for errors." buttons {"OK"} default button 1 with icon stop'
    exit 1
fi

# Create app structure
echo "📦 Creating app bundle..."
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Copy executable
cp CCUsageDashboard/.build/release/CCUsageDashboard "$APP_DIR/Contents/MacOS/"

# Create Info.plist
cat > "$APP_DIR/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>CCUsageDashboard</string>
    <key>CFBundleIdentifier</key>
    <string>com.rocalight.ccusage-dashboard</string>
    <key>CFBundleName</key>
    <string>CCUsage Dashboard</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSMinimumSystemVersion</key>
    <string>12.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
</dict>
</plist>
EOF

# Set executable permissions
chmod +x "$APP_DIR/Contents/MacOS/CCUsageDashboard"

echo "✅ CCUsage Dashboard created successfully!"

# Launch the app
open "$APP_DIR"

# Show success message
osascript -e 'tell app "System Events" to display dialog "CCUsage Dashboard is now running!\n\nThe app will automatically refresh your usage data every 5 seconds." buttons {"OK"} default button 1 with icon note'

exit 0