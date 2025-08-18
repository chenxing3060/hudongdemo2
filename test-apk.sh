#!/bin/bash

# APK 测试脚本
# 使用方法: chmod +x test-apk.sh && ./test-apk.sh

APK_PATH="./android/app/build/outputs/apk/debug/thecodexwalker-v1.2.0-debug.apk"
PACKAGE_NAME="com.thecodexwalker.app"
MAIN_ACTIVITY=".MainActivity"

echo "🚀 APK 测试工具 v1.0"
echo "=============================="

# 检查 ADB 是否安装
check_adb() {
    if ! command -v adb &> /dev/null; then
        echo "❌ ADB 未安装"
        echo "请运行以下命令安装:"
        echo "brew install android-platform-tools"
        echo ""
        echo "或者手动下载 Android SDK Platform Tools:"
        echo "https://developer.android.com/studio/releases/platform-tools"
        return 1
    else
        echo "✅ ADB 已安装"
        adb version | head -1
        return 0
    fi
}

# 检查设备连接
check_devices() {
    echo "📱 检查连接的设备..."
    devices=$(adb devices | grep -v "List of devices" | grep -v "^$" | wc -l)
    
    if [ $devices -eq 0 ]; then
        echo "❌ 未找到连接的设备"
        echo ""
        echo "请确保:"
        echo "1. 设备已连接到电脑"
        echo "2. 已启用开发者选项"
        echo "3. 已启用 USB 调试"
        echo "4. 已授权此电脑进行调试"
        echo ""
        echo "设备设置路径: 设置 > 关于手机 > 连续点击版本号7次 > 返回 > 开发者选项 > USB调试"
        return 1
    else
        echo "✅ 找到 $devices 个设备:"
        adb devices
        return 0
    fi
}

# 检查 APK 文件
check_apk() {
    if [ ! -f "$APK_PATH" ]; then
        echo "❌ APK 文件不存在: $APK_PATH"
        echo ""
        echo "请先构建 APK:"
        echo "npx cap build android"
        echo "或者"
        echo "cd android && ./gradlew assembleDebug"
        return 1
    else
        echo "✅ 找到 APK 文件: $APK_PATH"
        ls -lh "$APK_PATH"
        return 0
    fi
}

# 安装 APK
install_apk() {
    echo "📦 安装 APK..."
    if adb install -r "$APK_PATH"; then
        echo "✅ APK 安装成功"
        return 0
    else
        echo "❌ APK 安装失败"
        echo ""
        echo "尝试卸载旧版本后重新安装:"
        adb uninstall "$PACKAGE_NAME" 2>/dev/null
        if adb install "$APK_PATH"; then
            echo "✅ APK 重新安装成功"
            return 0
        else
            echo "❌ APK 重新安装失败"
            return 1
        fi
    fi
}

# 启动应用
launch_app() {
    echo "🎮 启动应用..."
    if adb shell am start -n "$PACKAGE_NAME$MAIN_ACTIVITY"; then
        echo "✅ 应用启动成功"
        return 0
    else
        echo "❌ 应用启动失败"
        return 1
    fi
}

# 显示应用信息
show_app_info() {
    echo "📋 应用信息:"
    echo "包名: $PACKAGE_NAME"
    echo "主活动: $MAIN_ACTIVITY"
    echo "APK 路径: $APK_PATH"
    echo ""
}

# 实用工具菜单
show_utils_menu() {
    echo ""
    echo "🛠️  实用工具:"
    echo "1) 查看应用日志"
    echo "2) 截屏"
    echo "3) 卸载应用"
    echo "4) 重启应用"
    echo "5) 查看设备信息"
    echo "6) 查看已安装应用"
    echo "0) 退出"
    read -p "请选择 (0-6): " choice
    
    case $choice in
        1)
            echo "📋 显示应用日志 (按 Ctrl+C 停止):"
            adb logcat | grep -E "Capacitor|Cordova|WebView|$PACKAGE_NAME"
            ;;
        2)
            echo "📸 截屏..."
            timestamp=$(date +"%Y%m%d_%H%M%S")
            screenshot_name="screenshot_$timestamp.png"
            adb shell screencap -p "/sdcard/$screenshot_name"
            adb pull "/sdcard/$screenshot_name" "./"
            adb shell rm "/sdcard/$screenshot_name"
            echo "✅ 截屏保存为: $screenshot_name"
            ;;
        3)
            echo "🗑️  卸载应用..."
            if adb uninstall "$PACKAGE_NAME"; then
                echo "✅ 应用卸载成功"
            else
                echo "❌ 应用卸载失败"
            fi
            ;;
        4)
            echo "🔄 重启应用..."
            adb shell am force-stop "$PACKAGE_NAME"
            sleep 1
            launch_app
            ;;
        5)
            echo "📱 设备信息:"
            echo "设备型号: $(adb shell getprop ro.product.model)"
            echo "Android 版本: $(adb shell getprop ro.build.version.release)"
            echo "API 级别: $(adb shell getprop ro.build.version.sdk)"
            echo "屏幕分辨率: $(adb shell wm size | cut -d' ' -f3)"
            echo "屏幕密度: $(adb shell wm density | cut -d' ' -f3)"
            ;;
        6)
            echo "📱 已安装的应用 (包含关键词):"
            adb shell pm list packages | grep -E "thecodex|walker|game" || echo "未找到相关应用"
            ;;
        0)
            echo "👋 退出工具"
            exit 0
            ;;
        *)
            echo "❌ 无效选择"
            ;;
    esac
    
    echo ""
    read -p "按回车键继续..."
    show_utils_menu
}

# 主流程
main() {
    # 检查环境
    if ! check_adb; then
        exit 1
    fi
    
    echo ""
    if ! check_devices; then
        echo ""
        echo "💡 提示: 您也可以使用浏览器进行测试:"
        echo "1. 确保开发服务器正在运行: npm run dev"
        echo "2. 在移动设备浏览器中访问: http://YOUR_LOCAL_IP:8000/game.html"
        echo "3. 使用 Chrome DevTools 进行移动端调试"
        exit 1
    fi
    
    echo ""
    if ! check_apk; then
        exit 1
    fi
    
    echo ""
    show_app_info
    
    # 安装和启动
    if install_apk && launch_app; then
        echo ""
        echo "🎉 测试环境准备完成！"
        echo "应用已安装并启动，您可以在设备上进行测试。"
        
        # 显示实用工具菜单
        show_utils_menu
    else
        echo ""
        echo "❌ 测试环境设置失败"
        echo "请检查上述错误信息并重试"
        exit 1
    fi
}

# 运行主流程
main