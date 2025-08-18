#!/bin/bash

# CCUsage Dashboard Builder Script
# This script builds the CCUsage Dashboard macOS app

echo "🚀 Building CCUsage Dashboard..."

# Check if Swift is available
if ! command -v swift &> /dev/null; then
    echo "❌ Swift is not installed. Please install Xcode or Swift from the Mac App Store."
    exit 1
fi

# Check if ccusage is available
if ! command -v ccusage &> /dev/null; then
    echo "❌ ccusage is not installed. Please install it first:"
    echo "   npm install -g ccusage"
    exit 1
fi

echo "✅ Dependencies check passed"

# Navigate to project directory
cd "$(dirname "$0")/CCUsageDashboard"

# Build the Swift package
echo "🔨 Building Swift package..."
swift build -c release

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Create the app bundle
    APP_NAME="CCUsageDashboard.app"
    APP_DIR="/tmp/$APP_NAME"
    
    echo "📦 Creating app bundle..."
    
    # Create app structure
    mkdir -p "$APP_DIR/Contents/MacOS"
    mkdir -p "$APP_DIR/Contents/Resources"
    
    # Copy executable
    cp .build/release/CCUsageDashboard "$APP_DIR/Contents/MacOS/"
    
    # Create Info.plist
    cat > "$APP_DIR/Contents/Info.plist" << EOF
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
</dict>
</plist>
EOF
    
    # Move to Desktop
    mv "$APP_DIR" ~/Desktop/
    
    echo "🎉 App created successfully!"
    echo "📍 Location: ~/Desktop/CCUsageDashboard.app"
    echo ""
    echo "To run the app:"
    echo "1. Double-click ~/Desktop/CCUsageDashboard.app"
    echo "2. Or run: open ~/Desktop/CCUsageDashboard.app"
    echo ""
    echo "The app will automatically refresh data every 5 seconds."
else
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi