# 增量构建和热重载方案

## 🚀 快速开发工作流

### 1. 开发环境设置

#### 启动Web预览服务器
```bash
# 方法1: 使用Python HTTP服务器
python3 -m http.server 8080

# 方法2: 使用Node.js serve包
npx serve src -p 8080

# 方法3: 使用Live Server (支持热重载)
npx live-server src --port=8080
```

#### 文件监控和自动同步
```bash
# 安装文件监控工具
npm install -g nodemon

# 监控文件变化并自动同步
nodemon --watch src --exec "npx cap sync android"
```

### 2. 增量构建策略

#### 快速构建脚本
```bash
#!/bin/bash
# incremental_build.sh

echo "🔍 检查文件变化..."

# 检查是否有源文件变化
if [ src -nt android/app/src/main/assets/public ]; then
    echo "📁 检测到源文件变化，同步资源..."
    npx cap sync android
else
    echo "✅ 源文件无变化，跳过同步"
fi

# 增量构建APK
echo "🏗️ 开始增量构建..."
cd android

# 使用Gradle增量构建
./gradlew assembleDebug --build-cache --parallel

echo "✅ 构建完成！"
```

#### 智能同步脚本
```bash
#!/bin/bash
# smart_sync.sh

# 检查特定文件类型的变化
check_changes() {
    local file_type=$1
    local last_sync_file=".last_sync_${file_type}"
    
    if [ ! -f "$last_sync_file" ]; then
        touch "$last_sync_file"
        return 0
    fi
    
    find src -name "*.$file_type" -newer "$last_sync_file" | grep -q .
}

# 检查HTML/CSS/JS变化
if check_changes "html" || check_changes "css" || check_changes "js"; then
    echo "🔄 代码文件有变化，同步中..."
    npx cap sync android
    touch .last_sync_code
fi

# 检查资源文件变化
if check_changes "png" || check_changes "jpg" || check_changes "mp4"; then
    echo "🖼️ 资源文件有变化，同步中..."
    npx cap sync android
    touch .last_sync_assets
fi
```

### 3. 热重载开发环境

#### 使用Capacitor Live Reload
```bash
# 启动带热重载的开发服务器
npx cap run android --livereload --external

# 或者指定IP地址
npx cap run android --livereload --host=192.168.1.100
```

#### 配置Live Reload
```typescript
// capacitor.config.ts
export default {
  appId: 'com.codexwalker.game',
  appName: '万象行者',
  webDir: 'src',
  server: {
    // 开发时启用
    url: 'http://localhost:8080',
    cleartext: true
  }
};
```

### 4. 文件监控自动化

#### 使用fswatch监控文件变化
```bash
# 安装fswatch (macOS)
brew install fswatch

# 监控源文件变化
fswatch -o src/ | xargs -n1 -I{} ./smart_sync.sh
```

#### 使用inotify监控 (Linux)
```bash
# 安装inotify-tools
sudo apt-get install inotify-tools

# 监控文件变化
inotifywait -m -r -e modify,create,delete src/ |
while read path action file; do
    echo "文件变化: $path$file ($action)"
    ./smart_sync.sh
done
```

### 5. 开发工作流优化

#### 并行开发流程
```bash
#!/bin/bash
# parallel_dev.sh

# 启动Web服务器（后台）
python3 -m http.server 8080 &
WEB_PID=$!

# 启动文件监控（后台）
fswatch -o src/ | xargs -n1 -I{} ./smart_sync.sh &
WATCH_PID=$!

echo "🌐 Web预览: http://localhost:8080"
echo "👀 文件监控已启动"
echo "按 Ctrl+C 停止所有服务"

# 捕获中断信号
trap "kill $WEB_PID $WATCH_PID; exit" INT

# 等待用户中断
wait
```

#### 快速测试循环
```bash
#!/bin/bash
# quick_test.sh

echo "🔄 快速测试循环"

while true; do
    echo "选择操作:"
    echo "1) Web预览测试"
    echo "2) 同步并构建APK"
    echo "3) 安装到设备"
    echo "4) 查看日志"
    echo "5) 退出"
    
    read -p "请选择 (1-5): " choice
    
    case $choice in
        1)
            echo "🌐 打开Web预览..."
            open http://localhost:8080
            ;;
        2)
            echo "🏗️ 同步并构建..."
            npx cap sync android
            cd android && ./gradlew assembleDebug
            cd ..
            ;;
        3)
            echo "📱 安装到设备..."
            adb install -r android/app/build/outputs/apk/debug/app-debug.apk
            ;;
        4)
            echo "📋 查看应用日志..."
            adb logcat | grep "万象行者\|Capacitor"
            ;;
        5)
            echo "👋 退出"
            break
            ;;
        *)
            echo "❌ 无效选择"
            ;;
    esac
    
    echo ""
done
```

### 6. 构建缓存优化

#### Gradle构建缓存配置
```gradle
// android/gradle.properties
org.gradle.caching=true
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.jvmargs=-Xmx4g -XX:MaxPermSize=512m
```

#### 清理和重置脚本
```bash
#!/bin/bash
# clean_build.sh

echo "🧹 清理构建缓存..."

# 清理Gradle缓存
cd android
./gradlew clean
./gradlew --stop

# 清理Capacitor缓存
cd ..
rm -rf android/app/src/main/assets/public

# 重新同步
echo "🔄 重新同步资源..."
npx cap sync android

echo "✅ 清理完成！"
```

### 7. 性能监控

#### 构建时间监控
```bash
#!/bin/bash
# build_timer.sh

start_time=$(date +%s)

echo "⏱️ 开始构建计时..."

# 执行构建
cd android && ./gradlew assembleDebug

end_time=$(date +%s)
build_time=$((end_time - start_time))

echo "✅ 构建完成！用时: ${build_time}秒"

# 记录构建时间
echo "$(date): ${build_time}秒" >> build_times.log
```

## 🎯 最佳实践

### 开发阶段建议
1. **使用Web预览**: 优先在浏览器中测试功能
2. **增量同步**: 只在必要时同步资源到Android项目
3. **并行开发**: 同时运行Web服务器和文件监控
4. **缓存利用**: 启用Gradle构建缓存加速构建
5. **日志监控**: 实时查看应用运行日志

### 构建优化技巧
1. **分离资源**: 将大型资源文件单独处理
2. **压缩资源**: 在构建前压缩图片和视频
3. **模块化构建**: 只构建变化的模块
4. **并行构建**: 利用多核CPU加速构建
5. **智能缓存**: 基于文件变化智能决定是否重新构建

---

💡 **提示**: 合理使用这些工具可以将开发-测试-构建的循环时间从几分钟缩短到几秒钟，大大提高开发效率！