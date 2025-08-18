#!/bin/bash
# 开发调试环境设置脚本

echo "🚀 万象行者 - 开发调试环境设置"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 已安装${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 未安装${NC}"
        return 1
    fi
}

# 检查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 存在${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 不存在${NC}"
        return 1
    fi
}

echo -e "${BLUE}📋 检查开发环境...${NC}"

# 检查基础工具
echo "\n🔧 基础工具检查:"
check_command "node"
check_command "npm"
check_command "java"
check_command "adb"
check_command "python3"

# 检查Java环境
echo "\n☕ Java环境检查:"
if [ -n "$JAVA_HOME" ]; then
    echo -e "${GREEN}✅ JAVA_HOME: $JAVA_HOME${NC}"
else
    echo -e "${RED}❌ JAVA_HOME 未设置${NC}"
fi

# 检查Android SDK
echo "\n🤖 Android SDK检查:"
if [ -n "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✅ ANDROID_HOME: $ANDROID_HOME${NC}"
else
    echo -e "${RED}❌ ANDROID_HOME 未设置${NC}"
fi

# 检查项目文件
echo "\n📁 项目文件检查:"
check_file "capacitor.config.ts"
check_file "android/local.properties"
check_file "android/gradlew"
check_file "src/index.html"

# 检查设备连接
echo "\n📱 设备连接检查:"
if adb devices | grep -q "device$"; then
    echo -e "${GREEN}✅ Android设备已连接${NC}"
    adb devices
else
    echo -e "${YELLOW}⚠️ 未检测到Android设备${NC}"
fi

# 提供修复建议
echo "\n🔧 环境修复建议:"

if ! command -v java &> /dev/null; then
    echo -e "${YELLOW}📥 安装Java JDK:${NC}"
    echo "   brew install openjdk@11"
fi

if [ -z "$JAVA_HOME" ]; then
    echo -e "${YELLOW}⚙️ 设置JAVA_HOME:${NC}"
    echo "   export JAVA_HOME=/opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk/Contents/Home"
fi

if [ -z "$ANDROID_HOME" ]; then
    echo -e "${YELLOW}⚙️ 设置ANDROID_HOME:${NC}"
    echo "   export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools"
fi

if ! adb devices | grep -q "device$"; then
    echo -e "${YELLOW}📱 连接Android设备:${NC}"
    echo "   1. 启用开发者选项"
    echo "   2. 启用USB调试"
    echo "   3. 连接设备并授权"
fi

# 快速设置选项
echo "\n🚀 快速设置选项:"
echo "1) 设置环境变量"
echo "2) 安装开发依赖"
echo "3) 启动Web预览"
echo "4) 启动文件监控"
echo "5) 完整开发环境"
echo "6) 跳过设置"

read -p "请选择 (1-6): " choice

case $choice in
    1)
        echo -e "${BLUE}⚙️ 设置环境变量...${NC}"
        
        # 创建环境变量文件
        cat > .env.dev << EOF
# 万象行者开发环境变量
export JAVA_HOME=/opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export PATH=\$JAVA_HOME/bin:\$ANDROID_HOME/tools:\$ANDROID_HOME/platform-tools:\$PATH
EOF
        
        echo -e "${GREEN}✅ 环境变量已保存到 .env.dev${NC}"
        echo -e "${YELLOW}💡 运行 'source .env.dev' 来加载环境变量${NC}"
        ;;
    2)
        echo -e "${BLUE}📦 安装开发依赖...${NC}"
        
        # 安装全局工具
        npm install -g live-server nodemon
        
        # 安装本地依赖
        if [ ! -f "package.json" ]; then
            npm init -y
        fi
        
        npm install --save-dev @capacitor/cli
        
        echo -e "${GREEN}✅ 开发依赖安装完成${NC}"
        ;;
    3)
        echo -e "${BLUE}🌐 启动Web预览...${NC}"
        
        # 检查端口是否被占用
        if lsof -i :8080 &> /dev/null; then
            echo -e "${YELLOW}⚠️ 端口8080已被占用，尝试使用8081${NC}"
            python3 -m http.server 8081 &
            echo -e "${GREEN}✅ Web预览已启动: http://localhost:8081${NC}"
        else
            python3 -m http.server 8080 &
            echo -e "${GREEN}✅ Web预览已启动: http://localhost:8080${NC}"
        fi
        ;;
    4)
        echo -e "${BLUE}👀 启动文件监控...${NC}"
        
        # 创建文件监控脚本
        cat > watch_files.sh << 'EOF'
#!/bin/bash
echo "👀 监控文件变化..."
if command -v fswatch &> /dev/null; then
    fswatch -o src/ | while read num; do
        echo "🔄 检测到文件变化，同步资源..."
        npx cap sync android
    done
else
    echo "⚠️ fswatch未安装，使用基础监控"
    while true; do
        sleep 5
        if [ src -nt android/app/src/main/assets/public ]; then
            echo "🔄 检测到文件变化，同步资源..."
            npx cap sync android
        fi
    done
fi
EOF
        
        chmod +x watch_files.sh
        ./watch_files.sh &
        
        echo -e "${GREEN}✅ 文件监控已启动${NC}"
        ;;
    5)
        echo -e "${BLUE}🚀 设置完整开发环境...${NC}"
        
        # 设置环境变量
        source .env.dev 2>/dev/null || true
        
        # 启动Web服务器
        python3 -m http.server 8080 &
        WEB_PID=$!
        
        # 启动文件监控
        ./watch_files.sh &
        WATCH_PID=$!
        
        echo -e "${GREEN}✅ 完整开发环境已启动${NC}"
        echo -e "${BLUE}🌐 Web预览: http://localhost:8080${NC}"
        echo -e "${BLUE}👀 文件监控: 已启动${NC}"
        echo -e "${YELLOW}💡 按 Ctrl+C 停止所有服务${NC}"
        
        # 捕获中断信号
        trap "kill $WEB_PID $WATCH_PID 2>/dev/null; exit" INT
        
        # 等待用户中断
        wait
        ;;
    6)
        echo -e "${BLUE}⏭️ 跳过环境设置${NC}"
        ;;
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        ;;
esac

echo "\n📚 有用的命令:"
echo "  Web预览:     python3 -m http.server 8080"
echo "  同步资源:    npx cap sync android"
echo "  构建APK:     cd android && ./gradlew assembleDebug"
echo "  安装APK:     adb install -r android/app/build/outputs/apk/debug/app-debug.apk"
echo "  查看日志:    adb logcat | grep 万象行者"
echo "  设备列表:    adb devices"

echo "\n📖 文档参考:"
echo "  APK分析:     cat APK_ANALYSIS_GUIDE.md"
echo "  源码修改:    cat SOURCE_MODIFICATION_GUIDE.md"
echo "  增量构建:    cat INCREMENTAL_BUILD_GUIDE.md"
echo "  问题诊断:    cat APK_DEBUG_REPAIR_GUIDE.md"

echo -e "\n${GREEN}🎉 开发环境设置完成！${NC}"