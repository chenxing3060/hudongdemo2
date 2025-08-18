#!/bin/bash

# 远程调试脚本
# 用于连接真实Android设备进行调试

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查ADB是否安装
check_adb() {
    if ! command -v adb &> /dev/null; then
        log_error "ADB未安装"
        log_info "请安装Android SDK Platform Tools:"
        log_info "1. 下载Android Studio: https://developer.android.com/studio"
        log_info "2. 或单独安装Platform Tools: https://developer.android.com/studio/releases/platform-tools"
        log_info "3. 将adb添加到PATH环境变量"
        exit 1
    fi
    log_success "ADB已安装"
}

# 检查设备连接
check_devices() {
    log_info "检查连接的设备..."
    
    # 重启ADB服务
    adb kill-server
    adb start-server
    
    # 获取设备列表
    DEVICES=$(adb devices | grep -v "List of devices" | grep "device$" | wc -l | tr -d ' ')
    
    if [ "$DEVICES" -eq 0 ]; then
        log_error "未检测到连接的Android设备"
        log_info "请确保:"
        log_info "1. 设备已通过USB连接到电脑"
        log_info "2. 设备已开启开发者选项"
        log_info "3. 设备已启用USB调试"
        log_info "4. 已授权USB调试（设备上会弹出确认对话框）"
        log_info ""
        log_info "开启开发者选项的方法:"
        log_info "设置 > 关于手机 > 连续点击版本号7次"
        log_info ""
        log_info "开启USB调试的方法:"
        log_info "设置 > 开发者选项 > USB调试"
        exit 1
    fi
    
    log_success "检测到 $DEVICES 个设备"
    
    # 显示设备信息
    log_info "设备列表:"
    adb devices -l | grep "device$" | while read line; do
        device_id=$(echo $line | awk '{print $1}')
        device_info=$(echo $line | cut -d' ' -f2-)
        log_info "  📱 $device_id - $device_info"
    done
}

# 获取设备信息
get_device_info() {
    local device_id=$1
    
    log_info "获取设备信息: $device_id"
    
    # 获取设备型号
    local model=$(adb -s $device_id shell getprop ro.product.model 2>/dev/null | tr -d '\r')
    # 获取Android版本
    local android_version=$(adb -s $device_id shell getprop ro.build.version.release 2>/dev/null | tr -d '\r')
    # 获取API级别
    local api_level=$(adb -s $device_id shell getprop ro.build.version.sdk 2>/dev/null | tr -d '\r')
    # 获取屏幕分辨率
    local resolution=$(adb -s $device_id shell wm size 2>/dev/null | grep "Physical size" | cut -d: -f2 | tr -d ' \r')
    # 获取屏幕密度
    local density=$(adb -s $device_id shell wm density 2>/dev/null | grep "Physical density" | cut -d: -f2 | tr -d ' \r')
    
    echo "设备型号: $model"
    echo "Android版本: $android_version (API $api_level)"
    echo "屏幕分辨率: $resolution"
    echo "屏幕密度: ${density}dpi"
}

# 设置端口转发
setup_port_forwarding() {
    local device_id=$1
    local local_port=${2:-8080}
    local remote_port=${3:-8080}
    
    log_info "设置端口转发: localhost:$local_port -> device:$remote_port"
    
    # 清除现有的端口转发
    adb -s $device_id forward --remove tcp:$local_port 2>/dev/null || true
    
    # 设置新的端口转发
    adb -s $device_id forward tcp:$local_port tcp:$remote_port
    
    log_success "端口转发已设置"
}

# 启动Chrome远程调试
start_chrome_debugging() {
    local device_id=$1
    
    log_info "启动Chrome远程调试..."
    
    # 检查Chrome是否在设备上运行
    local chrome_running=$(adb -s $device_id shell "ps | grep chrome" | wc -l)
    
    if [ "$chrome_running" -eq 0 ]; then
        log_warning "Chrome未在设备上运行"
        log_info "请在设备上打开Chrome浏览器"
    fi
    
    # 设置Chrome调试端口转发
    adb -s $device_id forward tcp:9222 localabstract:chrome_devtools_remote
    
    log_success "Chrome远程调试已启动"
    log_info "在电脑Chrome中访问: chrome://inspect"
    log_info "或直接访问: http://localhost:9222"
}

# 安装APK到设备
install_apk() {
    local device_id=$1
    local apk_path="android/app/build/outputs/apk/debug/app-debug.apk"
    
    if [ ! -f "$apk_path" ]; then
        log_error "APK文件不存在: $apk_path"
        log_info "请先构建APK: npm run android:build"
        return 1
    fi
    
    log_info "安装APK到设备: $device_id"
    
    # 卸载旧版本（如果存在）
    adb -s $device_id uninstall com.thecodexwalker.app 2>/dev/null || true
    
    # 安装新版本
    adb -s $device_id install "$apk_path"
    
    log_success "APK安装完成"
}

# 启动应用
launch_app() {
    local device_id=$1
    local package_name="com.thecodexwalker.app"
    local activity_name=".MainActivity"
    
    log_info "启动应用..."
    
    adb -s $device_id shell am start -n "$package_name/$activity_name"
    
    log_success "应用已启动"
}

# 查看应用日志
view_logs() {
    local device_id=$1
    local package_name="com.thecodexwalker.app"
    
    log_info "查看应用日志 (按Ctrl+C停止)..."
    
    # 清除旧日志
    adb -s $device_id logcat -c
    
    # 显示应用日志
    adb -s $device_id logcat | grep "$package_name\|chromium\|Console\|WebView"
}

# 截屏
take_screenshot() {
    local device_id=$1
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local filename="screenshot_${timestamp}.png"
    
    log_info "截屏保存为: $filename"
    
    adb -s $device_id shell screencap -p /sdcard/screenshot.png
    adb -s $device_id pull /sdcard/screenshot.png "$filename"
    adb -s $device_id shell rm /sdcard/screenshot.png
    
    log_success "截屏已保存: $filename"
}

# 录制屏幕
record_screen() {
    local device_id=$1
    local duration=${2:-30}
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local filename="screenrecord_${timestamp}.mp4"
    
    log_info "开始录制屏幕 (${duration}秒)..."
    
    adb -s $device_id shell screenrecord --time-limit $duration /sdcard/screenrecord.mp4 &
    local record_pid=$!
    
    # 等待录制完成
    wait $record_pid
    
    # 下载录制文件
    adb -s $device_id pull /sdcard/screenrecord.mp4 "$filename"
    adb -s $device_id shell rm /sdcard/screenrecord.mp4
    
    log_success "屏幕录制已保存: $filename"
}

# 显示帮助信息
show_help() {
    echo "远程调试脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 [命令] [设备ID] [参数]"
    echo ""
    echo "可用命令:"
    echo "  check      - 检查设备连接状态"
    echo "  info       - 显示设备信息"
    echo "  install    - 安装APK到设备"
    echo "  launch     - 启动应用"
    echo "  debug      - 启动完整调试会话"
    echo "  chrome     - 启动Chrome远程调试"
    echo "  logs       - 查看应用日志"
    echo "  screenshot - 截屏"
    echo "  record     - 录制屏幕"
    echo "  help       - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 check                    # 检查设备连接"
    echo "  $0 debug                    # 启动完整调试会话"
    echo "  $0 info DEVICE_ID           # 显示指定设备信息"
    echo "  $0 record DEVICE_ID 60      # 录制60秒屏幕"
}

# 完整调试会话
start_debug_session() {
    local device_id=$1
    
    if [ -z "$device_id" ]; then
        # 如果没有指定设备ID，使用第一个设备
        device_id=$(adb devices | grep "device$" | head -1 | awk '{print $1}')
    fi
    
    if [ -z "$device_id" ]; then
        log_error "没有可用的设备"
        exit 1
    fi
    
    log_info "开始调试会话: $device_id"
    
    # 显示设备信息
    get_device_info $device_id
    echo ""
    
    # 设置端口转发
    setup_port_forwarding $device_id
    
    # 启动Chrome调试
    start_chrome_debugging $device_id
    
    # 安装APK
    if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
        install_apk $device_id
        launch_app $device_id
    else
        log_warning "APK文件不存在，跳过安装"
    fi
    
    log_success "调试会话已启动！"
    log_info ""
    log_info "📱 设备: $device_id"
    log_info "🌐 Chrome调试: chrome://inspect"
    log_info "📊 端口转发: localhost:8080 -> device:8080"
    log_info ""
    log_info "可用操作:"
    log_info "  $0 logs $device_id        # 查看日志"
    log_info "  $0 screenshot $device_id  # 截屏"
    log_info "  $0 record $device_id      # 录制屏幕"
}

# 主函数
main() {
    check_adb
    
    case "${1:-debug}" in
        "check")
            check_devices
            ;;
        "info")
            check_devices
            if [ -n "$2" ]; then
                get_device_info $2
            else
                log_error "请指定设备ID"
                exit 1
            fi
            ;;
        "install")
            check_devices
            device_id=${2:-$(adb devices | grep "device$" | head -1 | awk '{print $1}')}
            install_apk $device_id
            ;;
        "launch")
            check_devices
            device_id=${2:-$(adb devices | grep "device$" | head -1 | awk '{print $1}')}
            launch_app $device_id
            ;;
        "debug")
            check_devices
            start_debug_session $2
            ;;
        "chrome")
            check_devices
            device_id=${2:-$(adb devices | grep "device$" | head -1 | awk '{print $1}')}
            start_chrome_debugging $device_id
            ;;
        "logs")
            check_devices
            device_id=${2:-$(adb devices | grep "device$" | head -1 | awk '{print $1}')}
            view_logs $device_id
            ;;
        "screenshot")
            check_devices
            device_id=${2:-$(adb devices | grep "device$" | head -1 | awk '{print $1}')}
            take_screenshot $device_id
            ;;
        "record")
            check_devices
            device_id=${2:-$(adb devices | grep "device$" | head -1 | awk '{print $1}')}
            duration=${3:-30}
            record_screen $device_id $duration
            ;;
        "help")
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"