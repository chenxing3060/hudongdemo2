#!/bin/bash

# 移动端测试脚本
# 使用方法: ./scripts/test-mobile.sh [模式]
# 模式: emulator | livereload | chrome | device

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

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    if ! command -v npx &> /dev/null; then
        log_error "npx 未安装，请先安装 Node.js"
        exit 1
    fi
    
    if ! command -v adb &> /dev/null; then
        log_warning "adb 未安装，真机调试功能将不可用"
    fi
    
    log_success "依赖检查完成"
}

# 构建项目
build_project() {
    log_info "构建项目..."
    npm run build
    log_success "项目构建完成"
}

# 获取本机IP地址
get_local_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
    else
        # Linux
        LOCAL_IP=$(hostname -I | awk '{print $1}')
    fi
    echo $LOCAL_IP
}

# 模拟器模式
run_emulator() {
    log_info "启动Android模拟器模式..."
    
    build_project
    npx cap sync android
    
    # 检查模拟器是否运行
    if ! adb devices | grep -q "emulator"; then
        log_warning "未检测到运行中的模拟器"
        log_info "请手动启动Android Studio模拟器，然后重新运行此脚本"
        exit 1
    fi
    
    log_info "在模拟器中启动应用..."
    npx cap run android
    log_success "应用已在模拟器中启动"
}

# 实时重载模式
run_livereload() {
    log_info "启动实时重载模式..."
    
    LOCAL_IP=$(get_local_ip)
    log_info "本机IP地址: $LOCAL_IP"
    
    # 备份原配置文件
    cp capacitor.config.json capacitor.config.backup.json
    
    # 创建临时配置文件
    cat > capacitor.config.temp.json << EOF
{
  "appId": "com.thecodexwalker.app",
  "appName": "万象行者",
  "webDir": "dist",
  "server": {
    "url": "http://$LOCAL_IP:8080",
    "cleartext": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 3000,
      "launchAutoHide": true,
      "backgroundColor": "#ffffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP"
    }
  }
}
EOF
    
    # 使用临时配置
    mv capacitor.config.json capacitor.config.prod.json
    mv capacitor.config.temp.json capacitor.config.json
    
    build_project
    npx cap sync android
    
    # 启动开发服务器
    log_info "启动开发服务器..."
    npm run dev &
    DEV_PID=$!
    
    # 等待服务器启动
    sleep 3
    
    # 清理函数
    cleanup() {
        log_info "清理环境..."
        kill $DEV_PID 2>/dev/null || true
        
        # 恢复原配置文件
        mv capacitor.config.json capacitor.config.dev.json
        mv capacitor.config.prod.json capacitor.config.json
        
        log_success "环境已清理"
        exit
    }
    
    trap cleanup SIGINT SIGTERM
    
    log_info "在设备/模拟器中启动应用..."
    npx cap run android
    
    log_success "实时重载模式已启动！"
    log_info "修改代码后，应用会自动重载"
    log_info "按 Ctrl+C 停止服务"
    
    wait
}

# Chrome调试模式
run_chrome() {
    log_info "启动Chrome调试模式..."
    
    build_project
    
    # 启动开发服务器
    log_info "启动开发服务器..."
    npm run dev &
    DEV_PID=$!
    
    # 等待服务器启动
    sleep 3
    
    log_success "开发服务器已启动: http://localhost:8080"
    log_info "请在Chrome中打开以下地址进行调试:"
    log_info "🌐 http://localhost:8080/game.html"
    log_info "📱 按F12打开开发者工具，点击设备图标进行移动端模拟"
    
    # 尝试自动打开浏览器
    if command -v open &> /dev/null; then
        # macOS
        open "http://localhost:8080/game.html"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "http://localhost:8080/game.html"
    fi
    
    # 清理函数
    cleanup() {
        log_info "停止开发服务器..."
        kill $DEV_PID 2>/dev/null || true
        log_success "服务已停止"
        exit
    }
    
    trap cleanup SIGINT SIGTERM
    
    log_info "按 Ctrl+C 停止服务"
    wait
}

# 真机调试模式
run_device() {
    log_info "启动真机调试模式..."
    
    if ! command -v adb &> /dev/null; then
        log_error "adb 未安装，无法进行真机调试"
        log_info "请安装Android SDK Platform Tools"
        exit 1
    fi
    
    # 检查设备连接
    DEVICES=$(adb devices | grep -v "List of devices" | grep "device$" | wc -l)
    if [ $DEVICES -eq 0 ]; then
        log_error "未检测到连接的Android设备"
        log_info "请确保:"
        log_info "1. 设备已开启USB调试"
        log_info "2. 设备已通过USB连接到电脑"
        log_info "3. 已授权USB调试"
        exit 1
    fi
    
    log_success "检测到 $DEVICES 个设备"
    
    LOCAL_IP=$(get_local_ip)
    log_info "本机IP地址: $LOCAL_IP"
    
    # 备份并修改配置
    cp capacitor.config.json capacitor.config.backup.json
    
    cat > capacitor.config.temp.json << EOF
{
  "appId": "com.thecodexwalker.app",
  "appName": "万象行者",
  "webDir": "dist",
  "server": {
    "url": "http://$LOCAL_IP:8080",
    "cleartext": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 3000,
      "launchAutoHide": true,
      "backgroundColor": "#ffffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP"
    }
  }
}
EOF
    
    mv capacitor.config.json capacitor.config.prod.json
    mv capacitor.config.temp.json capacitor.config.json
    
    build_project
    npx cap sync android
    
    # 启动开发服务器
    log_info "启动开发服务器..."
    npm run dev &
    DEV_PID=$!
    
    sleep 3
    
    # 清理函数
    cleanup() {
        log_info "清理环境..."
        kill $DEV_PID 2>/dev/null || true
        
        # 恢复配置
        mv capacitor.config.json capacitor.config.dev.json
        mv capacitor.config.prod.json capacitor.config.json
        
        log_success "环境已清理"
        exit
    }
    
    trap cleanup SIGINT SIGTERM
    
    log_info "在真机上启动应用..."
    npx cap run android
    
    log_success "真机调试模式已启动！"
    log_info "Chrome远程调试地址: chrome://inspect"
    log_info "修改代码后，应用会自动重载"
    log_info "按 Ctrl+C 停止服务"
    
    wait
}

# 显示帮助信息
show_help() {
    echo "移动端测试脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 [模式]"
    echo ""
    echo "可用模式:"
    echo "  emulator   - Android模拟器模式"
    echo "  livereload - 实时重载模式（推荐）"
    echo "  chrome     - Chrome浏览器调试模式"
    echo "  device     - 真机调试模式"
    echo "  help       - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 livereload  # 启动实时重载模式"
    echo "  $0 chrome      # 启动Chrome调试模式"
}

# 主函数
main() {
    check_dependencies
    
    case "${1:-livereload}" in
        "emulator")
            run_emulator
            ;;
        "livereload")
            run_livereload
            ;;
        "chrome")
            run_chrome
            ;;
        "device")
            run_device
            ;;
        "help")
            show_help
            ;;
        *)
            log_error "未知模式: $1"
            show_help
            exit 1
            ;;
    esac
}

# 确保脚本目录存在
mkdir -p scripts

# 运行主函数
main "$@"