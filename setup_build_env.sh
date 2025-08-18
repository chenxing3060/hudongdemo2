#!/bin/bash

# 万象行者 Android APK 构建环境设置脚本

echo "🚀 万象行者 Android APK 构建环境检查"
echo "==========================================="

# 检查Node.js
echo "📦 检查 Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js 已安装: $(node --version)"
else
    echo "❌ Node.js 未安装"
    echo "请访问 https://nodejs.org 安装 Node.js"
    exit 1
fi

# 检查npm
echo "📦 检查 npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm 已安装: $(npm --version)"
else
    echo "❌ npm 未安装"
    exit 1
fi

# 检查Capacitor
echo "📦 检查 Capacitor..."
if npx cap --version &> /dev/null; then
    echo "✅ Capacitor 已安装: $(npx cap --version)"
else
    echo "❌ Capacitor 未安装，正在安装..."
    npm install @capacitor/core @capacitor/cli @capacitor/android
fi

# 检查Java
echo "☕ 检查 Java..."
if command -v java &> /dev/null; then
    echo "✅ Java 已安装: $(java -version 2>&1 | head -n 1)"
else
    echo "❌ Java 未安装"
    echo "请安装 Java JDK 8 或更高版本"
    echo "推荐使用 Homebrew: brew install openjdk@11"
    echo "或访问: https://adoptium.net/"
fi

# 检查Android SDK
echo "📱 检查 Android SDK..."
if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
    echo "✅ Android SDK 已配置: $ANDROID_HOME"
else
    echo "❌ Android SDK 未配置"
    echo "请安装 Android Studio 并设置 ANDROID_HOME 环境变量"
    echo "或使用 Homebrew: brew install android-studio"
fi

# 检查项目依赖
echo "📋 检查项目依赖..."
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
    if [ -d "node_modules" ]; then
        echo "✅ node_modules 存在"
    else
        echo "⚠️  node_modules 不存在，正在安装依赖..."
        npm install
    fi
else
    echo "❌ package.json 不存在"
    exit 1
fi

# 检查Android项目
echo "📱 检查 Android 项目..."
if [ -d "android" ]; then
    echo "✅ Android 项目目录存在"
else
    echo "❌ Android 项目目录不存在"
    echo "请运行: npx cap add android"
fi

echo "==========================================="
echo "🎯 构建建议:"
echo ""
echo "如果所有检查都通过:"
echo "  方法1: ./build-apk.sh (推荐)"
echo "  方法2: npx cap open android (使用 Android Studio)"
echo "  方法3: cd android && ./gradlew assembleDebug"
echo ""
echo "如果缺少依赖:"
echo "  1. 安装 Android Studio: https://developer.android.com/studio"
echo "  2. 安装 Java JDK: brew install openjdk@11"
echo "  3. 配置环境变量 ANDROID_HOME"
echo ""
echo "📖 详细指南请查看: APK_BUILD_INSTRUCTIONS.md"