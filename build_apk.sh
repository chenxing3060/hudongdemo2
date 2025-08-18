#!/bin/bash

# 万象行者 - Capacitor Android APK 构建脚本
# The Codex Walker - Capacitor Android APK Build Script

echo "🎮 万象行者 - Android APK 构建脚本"
echo "================================="

# 检查是否在正确的目录
if [ ! -f "capacitor.config.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Capacitor CLI
if ! command -v cap &> /dev/null; then
    echo "❌ 错误：Capacitor CLI 未安装"
    echo "请运行：npm install -g @capacitor/cli"
    exit 1
fi

echo "📦 步骤 1: 更新 Web 资源..."
# 确保 dist 目录是最新的
cp -r *.html *.css *.js manifest.json service-worker.js css/ js/ data/ game/ dist/ 2>/dev/null

echo "🔄 步骤 2: 同步到 Android 项目..."
npx cap sync android

if [ $? -eq 0 ]; then
    echo "✅ 同步完成！"
else
    echo "❌ 同步失败"
    exit 1
fi

echo "🏗️  步骤 3: 检查构建环境..."

# 检查 Android Studio
if command -v studio &> /dev/null || [ -d "/Applications/Android Studio.app" ]; then
    echo "📱 Android Studio 已安装"
    echo "🚀 选择构建方式："
    echo "1) 使用 Android Studio（推荐）"
    echo "2) 使用命令行构建"
    read -p "请选择 (1 或 2): " choice
    
    case $choice in
        1)
            echo "🎯 正在打开 Android Studio..."
            npx cap open android
            echo "📋 在 Android Studio 中："
            echo "   1. 等待 Gradle 同步完成"
            echo "   2. 点击 Build → Build Bundle(s) / APK(s) → Build APK(s)"
            echo "   3. APK 文件将生成在：android/app/build/outputs/apk/debug/"
            ;;
        2)
            echo "🔨 使用命令行构建..."
            cd android
            if [ -f "gradlew" ]; then
                echo "📦 构建 Debug APK..."
                ./gradlew assembleDebug
                if [ $? -eq 0 ]; then
                    echo "🎉 构建成功！"
                    echo "📱 APK 文件位置：android/app/build/outputs/apk/debug/app-debug.apk"
                    
                    # 检查文件大小
                    if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
                        size=$(du -h app/build/outputs/apk/debug/app-debug.apk | cut -f1)
                        echo "📊 APK 大小：$size"
                    fi
                else
                    echo "❌ 构建失败，请检查错误信息"
                fi
            else
                echo "❌ 错误：找不到 gradlew 文件"
            fi
            ;;
        *)
            echo "❌ 无效选择"
            ;;
    esac
else
    echo "⚠️  Android Studio 未安装"
    echo "📥 请先安装 Android Studio："
    echo "   https://developer.android.com/studio"
    echo ""
    echo "🔧 或者配置 Android SDK 环境变量后使用命令行构建"
fi

echo ""
echo "📚 更多信息请查看：CAPACITOR_BUILD_GUIDE.md"
echo "🎮 万象行者 APK 构建完成！"