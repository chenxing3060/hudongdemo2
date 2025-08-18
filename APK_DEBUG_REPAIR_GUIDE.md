# APK 问题诊断和修复指南

## 🔍 常见问题诊断

### 1. 应用无法启动

#### 症状
- APK安装成功但点击图标无反应
- 应用启动后立即崩溃
- 显示"应用已停止运行"

#### 诊断步骤
```bash
# 1. 查看崩溃日志
adb logcat | grep -E "AndroidRuntime|FATAL|万象行者"

# 2. 检查应用是否正确安装
adb shell pm list packages | grep codexwalker

# 3. 查看应用详细信息
adb shell dumpsys package com.codexwalker.game
```

#### 常见原因和解决方案

**原因1: 权限问题**
```xml
<!-- 检查 android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**原因2: 资源文件缺失**
```bash
# 重新同步资源
npx cap sync android

# 检查资源是否正确复制
ls -la android/app/src/main/assets/public/
```

**原因3: 版本兼容性**
```gradle
// android/app/build.gradle
android {
    defaultConfig {
        minSdkVersion 22  // 确保支持目标设备
        targetSdkVersion 34
    }
}
```

### 2. 游戏功能异常

#### 症状
- 图片无法显示
- 视频无法播放
- 音频没有声音
- 触摸事件无响应

#### 诊断步骤
```bash
# 1. 对比Web版本功能
# 在浏览器中访问 http://localhost:8080 测试

# 2. 检查控制台错误
adb logcat | grep -E "Console|JavaScript|Error"

# 3. 检查网络请求
adb logcat | grep -E "XMLHttpRequest|fetch|network"
```

#### 解决方案

**图片显示问题**
```javascript
// 检查图片路径是否正确
// 错误: src="/images/bg.png"
// 正确: src="./images/bg.png" 或 src="images/bg.png"
```

**视频播放问题**
```html
<!-- 添加多种格式支持 -->
<video controls>
    <source src="videos/intro.mp4" type="video/mp4">
    <source src="videos/intro.webm" type="video/webm">
    您的浏览器不支持视频播放。
</video>
```

**音频问题**
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### 3. 性能问题

#### 症状
- 应用启动缓慢
- 游戏运行卡顿
- 内存占用过高
- 电池消耗快

#### 诊断工具
```bash
# 1. 监控内存使用
adb shell dumpsys meminfo com.codexwalker.game

# 2. 监控CPU使用
adb shell top | grep codexwalker

# 3. 分析启动时间
adb shell am start -W com.codexwalker.game/.MainActivity
```

#### 优化方案

**资源优化**
```bash
# 压缩图片
for img in src/images/*.png; do
    pngquant --quality=65-80 "$img" --output "${img%.png}_compressed.png"
done

# 压缩视频
ffmpeg -i src/videos/large.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k src/videos/optimized.mp4
```

**代码优化**
```javascript
// 使用图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}
```

### 4. 网络连接问题

#### 症状
- 无法加载在线资源
- API请求失败
- 图片加载超时

#### 诊断步骤
```bash
# 1. 检查网络权限
grep -r "INTERNET" android/app/src/main/AndroidManifest.xml

# 2. 测试网络连接
adb shell ping google.com

# 3. 检查网络安全配置
cat android/app/src/main/res/xml/network_security_config.xml
```

#### 解决方案

**网络安全配置**
```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

**CORS问题解决**
```javascript
// 使用相对路径而不是绝对路径
// 错误: fetch('http://localhost:8080/api/data')
// 正确: fetch('./api/data')
```

## 🛠️ 自动化诊断脚本

### 综合诊断脚本
```bash
#!/bin/bash
# apk_diagnosis.sh

echo "🔍 APK 问题诊断工具"
echo "==================="

# 检查APK是否存在
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK文件不存在: $APK_PATH"
    echo "请先构建APK: cd android && ./gradlew assembleDebug"
    exit 1
fi

echo "✅ APK文件存在"

# 检查APK基本信息
echo "\n📱 APK基本信息:"
aapt dump badging "$APK_PATH" | grep -E "package|application-label|versionName"

# 检查权限
echo "\n🔐 应用权限:"
aapt dump permissions "$APK_PATH"

# 检查文件大小
echo "\n📊 APK大小:"
ls -lh "$APK_PATH" | awk '{print $5}'

# 检查设备连接
echo "\n📱 设备连接状态:"
if adb devices | grep -q "device$"; then
    echo "✅ 设备已连接"
    
    # 检查应用是否已安装
    if adb shell pm list packages | grep -q "codexwalker"; then
        echo "✅ 应用已安装"
        
        # 检查应用状态
        echo "\n🔍 应用运行状态:"
        adb shell ps | grep codexwalker || echo "应用未运行"
        
        # 检查最近的崩溃日志
        echo "\n📋 最近的错误日志:"
        adb logcat -d | grep -E "AndroidRuntime|FATAL" | tail -10
    else
        echo "⚠️ 应用未安装"
        echo "安装命令: adb install -r $APK_PATH"
    fi
else
    echo "❌ 未检测到设备连接"
    echo "请确保:"
    echo "1. 设备已连接并启用USB调试"
    echo "2. 运行 'adb devices' 确认设备状态"
fi

echo "\n🔧 建议的修复步骤:"
echo "1. 检查Web版本是否正常: http://localhost:8080"
echo "2. 重新同步资源: npx cap sync android"
echo "3. 清理并重新构建: cd android && ./gradlew clean assembleDebug"
echo "4. 查看详细日志: adb logcat | grep 万象行者"
```

### 快速修复脚本
```bash
#!/bin/bash
# quick_fix.sh

echo "🔧 APK快速修复工具"
echo "================="

echo "选择修复方案:"
echo "1) 重新同步资源"
echo "2) 清理并重新构建"
echo "3) 重新安装APK"
echo "4) 查看实时日志"
echo "5) 完整重置"

read -p "请选择 (1-5): " choice

case $choice in
    1)
        echo "🔄 重新同步资源..."
        npx cap sync android
        echo "✅ 同步完成"
        ;;
    2)
        echo "🧹 清理并重新构建..."
        cd android
        ./gradlew clean
        ./gradlew assembleDebug
        cd ..
        echo "✅ 构建完成"
        ;;
    3)
        echo "📱 重新安装APK..."
        adb uninstall com.codexwalker.game
        adb install android/app/build/outputs/apk/debug/app-debug.apk
        echo "✅ 安装完成"
        ;;
    4)
        echo "📋 查看实时日志 (按Ctrl+C停止)..."
        adb logcat | grep -E "万象行者|Capacitor|AndroidRuntime"
        ;;
    5)
        echo "🔄 完整重置..."
        rm -rf android/app/src/main/assets/public
        npx cap sync android
        cd android
        ./gradlew clean assembleDebug
        cd ..
        adb uninstall com.codexwalker.game
        adb install android/app/build/outputs/apk/debug/app-debug.apk
        echo "✅ 重置完成"
        ;;
    *)
        echo "❌ 无效选择"
        ;;
esac
```

## 📋 问题排查清单

### 构建问题
- [ ] Java环境是否正确配置
- [ ] Android SDK路径是否正确
- [ ] Gradle构建是否成功
- [ ] 资源文件是否完整同步

### 安装问题
- [ ] 设备是否启用USB调试
- [ ] 应用签名是否正确
- [ ] 设备存储空间是否充足
- [ ] Android版本是否兼容

### 运行问题
- [ ] 必要权限是否已授予
- [ ] 网络连接是否正常
- [ ] 资源文件路径是否正确
- [ ] JavaScript错误是否存在

### 性能问题
- [ ] 资源文件是否过大
- [ ] 内存使用是否合理
- [ ] CPU占用是否正常
- [ ] 电池消耗是否异常

---

💡 **提示**: 遇到问题时，建议按照"Web预览 → 资源同步 → 重新构建 → 重新安装"的顺序进行排查，这样可以快速定位问题所在。