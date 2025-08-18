#!/bin/bash

# Android Studio 修复脚本
# 使用方法: chmod +x fix-android-studio.sh && ./fix-android-studio.sh

echo "🔧 Android Studio 修复工具"
echo "=============================="

# 检查系统信息
echo "📋 检查系统信息..."
echo "macOS 版本:"
sw_vers
echo ""

# 检查 Java 版本
echo "☕ 检查 Java 版本..."
if command -v java &> /dev/null; then
    java -version
else
    echo "❌ 未找到 Java，请安装 JDK"
    echo "建议安装: brew install openjdk@17"
fi
echo ""

# 检查 Android Studio 是否存在
echo "🔍 检查 Android Studio 安装..."
if [ -d "/Applications/Android Studio.app" ]; then
    echo "✅ 找到 Android Studio 安装目录"
else
    echo "❌ 未找到 Android Studio，请重新安装"
    exit 1
fi
echo ""

# 提供修复选项
echo "🛠️  请选择修复方案:"
echo "1) 修复应用程序权限"
echo "2) 清理配置文件和缓存"
echo "3) 重置 Gatekeeper 权限"
echo "4) 从命令行启动诊断"
echo "5) 全部执行"
echo "0) 退出"
read -p "请输入选择 (0-5): " choice

case $choice in
    1)
        echo "🔐 修复应用程序权限..."
        sudo chmod -R 755 "/Applications/Android Studio.app"
        echo "✅ 权限修复完成"
        ;;
    2)
        echo "🧹 清理配置文件和缓存..."
        rm -rf ~/Library/Application\ Support/Google/AndroidStudio*
        rm -rf ~/Library/Preferences/com.google.android.studio*
        rm -rf ~/Library/Logs/Google/AndroidStudio*
        rm -rf ~/Library/Caches/Google/AndroidStudio*
        echo "✅ 清理完成"
        ;;
    3)
        echo "🛡️  重置 Gatekeeper 权限..."
        sudo xattr -rd com.apple.quarantine "/Applications/Android Studio.app"
        echo "✅ Gatekeeper 权限重置完成"
        ;;
    4)
        echo "🖥️  从命令行启动 Android Studio..."
        echo "如果出现错误信息，请记录下来用于进一步诊断"
        "/Applications/Android Studio.app/Contents/bin/studio.sh"
        ;;
    5)
        echo "🔄 执行全部修复方案..."
        echo "1. 修复权限..."
        sudo chmod -R 755 "/Applications/Android Studio.app"
        
        echo "2. 清理配置文件..."
        rm -rf ~/Library/Application\ Support/Google/AndroidStudio*
        rm -rf ~/Library/Preferences/com.google.android.studio*
        rm -rf ~/Library/Logs/Google/AndroidStudio*
        rm -rf ~/Library/Caches/Google/AndroidStudio*
        
        echo "3. 重置 Gatekeeper..."
        sudo xattr -rd com.apple.quarantine "/Applications/Android Studio.app"
        
        echo "✅ 全部修复完成，请尝试启动 Android Studio"
        ;;
    0)
        echo "👋 退出修复工具"
        exit 0
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 修复完成！请尝试启动 Android Studio"
echo "如果问题仍然存在，请查看 ANDROID_STUDIO_TROUBLESHOOTING.md 获取更多解决方案"
echo "或使用替代测试方案进行 APK 测试"