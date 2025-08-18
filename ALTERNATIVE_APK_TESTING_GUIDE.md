# APK 测试替代方案指南

当 Android Studio 无法正常工作时，您可以使用以下替代方案来测试您的 APK 文件。

## 方案 1: ADB 命令行工具测试

### 安装 ADB
```bash
# 使用 Homebrew 安装
brew install android-platform-tools

# 或者下载 Android SDK Platform Tools
# https://developer.android.com/studio/releases/platform-tools
```

### 基本 ADB 命令
```bash
# 检查连接的设备
adb devices

# 安装 APK
adb install path/to/your/app.apk

# 卸载应用
adb uninstall com.your.package.name

# 启动应用
adb shell am start -n com.your.package.name/.MainActivity

# 查看应用日志
adb logcat | grep "YourAppTag"

# 截屏
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

### 使用物理设备
1. 在设备上启用开发者选项
2. 启用 USB 调试
3. 连接设备到电脑
4. 使用上述 ADB 命令

## 方案 2: 第三方 Android 模拟器

### Genymotion (推荐)
1. 下载并安装 Genymotion
2. 创建虚拟设备
3. 启动模拟器
4. 拖拽 APK 文件到模拟器安装

### BlueStacks
1. 下载并安装 BlueStacks
2. 启动 BlueStacks
3. 使用内置的 APK 安装器

### NoxPlayer
1. 下载并安装 NoxPlayer
2. 启动模拟器
3. 拖拽 APK 文件安装

## 方案 3: 浏览器移动端模拟

### Chrome DevTools
1. 打开 Chrome 浏览器
2. 访问您的应用 URL: http://localhost:8000/game.html
3. 按 F12 打开开发者工具
4. 点击设备模拟按钮 (📱)
5. 选择不同的设备型号测试

### Firefox 响应式设计模式
1. 打开 Firefox 浏览器
2. 访问您的应用 URL
3. 按 F12 打开开发者工具
4. 点击响应式设计模式按钮
5. 测试不同屏幕尺寸

## 方案 4: 在线测试工具

### BrowserStack
- 提供真实设备测试
- 支持多种 Android 版本
- 免费试用版本

### LambdaTest
- 在线跨浏览器测试
- 移动端设备模拟
- 实时测试功能

## 方案 5: 本地 Web 服务器测试

### 当前项目测试
您的项目已经配置了开发服务器，可以直接在移动设备浏览器中测试：

1. 确保开发服务器正在运行：
```bash
npm run dev
```

2. 获取您的本地 IP 地址：
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

3. 在移动设备上访问：
```
http://YOUR_LOCAL_IP:8000/game.html
```

### 移动设备远程调试
1. 在移动设备上启用 USB 调试
2. 连接到电脑
3. 在 Chrome 中访问 `chrome://inspect`
4. 选择您的设备进行调试

## 快速测试脚本

创建一个快速测试脚本 `test-apk.sh`：

```bash
#!/bin/bash

APK_PATH="./android/app/build/outputs/apk/debug/thecodexwalker-v1.2.0-debug.apk"
PACKAGE_NAME="com.thecodexwalker.app"

echo "🚀 开始 APK 测试流程"

# 检查 ADB
if ! command -v adb &> /dev/null; then
    echo "❌ ADB 未安装，请先安装 Android Platform Tools"
    echo "运行: brew install android-platform-tools"
    exit 1
fi

# 检查设备连接
echo "📱 检查连接的设备..."
adb devices

# 安装 APK
echo "📦 安装 APK..."
adb install -r "$APK_PATH"

# 启动应用
echo "🎮 启动应用..."
adb shell am start -n "$PACKAGE_NAME/.MainActivity"

# 显示日志
echo "📋 显示应用日志 (按 Ctrl+C 停止):"
adb logcat | grep "Capacitor\|Cordova\|WebView"
```

## 推荐测试流程

1. **首选方案**: 使用 ADB + 物理设备
   - 最接近真实用户体验
   - 性能测试准确
   - 支持所有功能

2. **备选方案**: 浏览器移动端模拟
   - 快速迭代测试
   - 无需额外安装
   - 适合 UI/UX 测试

3. **第三方模拟器**: 当没有物理设备时
   - Genymotion 性能最佳
   - 支持多种 Android 版本
   - 适合功能测试

## 故障排除

### ADB 连接问题
```bash
# 重启 ADB 服务
adb kill-server
adb start-server

# 检查设备授权
adb devices
# 如果显示 "unauthorized"，请在设备上确认调试授权
```

### 应用安装失败
```bash
# 卸载旧版本
adb uninstall com.thecodexwalker.app

# 重新安装
adb install -r path/to/apk
```

### 网络连接问题
```bash
# 检查防火墙设置
# 确保端口 8000 未被阻止
# 检查 WiFi 网络是否允许设备间通信
```

---

*选择最适合您当前环境的测试方案，建议从最简单的浏览器测试开始。*