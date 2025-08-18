# APK 分析和调试工具指南

## 🔍 APK 分析工具

### 1. APK 基本信息查看
```bash
# 查看APK基本信息
aapt dump badging android/app/build/outputs/apk/debug/app-debug.apk

# 查看APK权限
aapt dump permissions android/app/build/outputs/apk/debug/app-debug.apk

# 查看APK文件大小
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. APK 内容分析
```bash
# 解压APK查看内容结构
unzip -l android/app/build/outputs/apk/debug/app-debug.apk

# 提取APK到临时目录
mkdir -p temp_apk
unzip android/app/build/outputs/apk/debug/app-debug.apk -d temp_apk/
```

### 3. 在线APK分析工具
- **APK Analyzer** (Android Studio内置)
- **APKTool**: 反编译APK
- **Jadx**: Java反编译器
- **APK Mirror**: 在线APK信息查看

## 🐛 调试方法

### 1. Chrome DevTools 调试
```bash
# 启用USB调试后，在Chrome中访问
chrome://inspect/#devices
```

### 2. Android Studio 调试
```bash
# 连接设备后运行
npx cap run android
```

### 3. 日志查看
```bash
# 查看设备日志
adb logcat | grep "万象行者"

# 查看Capacitor日志
adb logcat | grep "Capacitor"
```

## 📱 设备测试

### 1. 安装APK
```bash
# 通过ADB安装
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 强制重新安装
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. 卸载APK
```bash
# 卸载应用
adb uninstall com.codexwalker.game
```

### 3. 应用信息查看
```bash
# 查看已安装应用
adb shell pm list packages | grep codexwalker

# 查看应用详细信息
adb shell dumpsys package com.codexwalker.game
```

## 🔧 常见问题诊断

### 1. 应用无法启动
- 检查权限配置
- 查看崩溃日志
- 验证资源文件完整性

### 2. 功能异常
- 使用Web预览对比
- 检查Capacitor插件配置
- 验证原生功能调用

### 3. 性能问题
- 使用Chrome DevTools性能分析
- 检查内存使用情况
- 分析资源加载时间

## 📊 性能分析

### 1. APK大小分析
```bash
# 分析APK组成
aapt dump --values resources android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. 启动时间测试
```bash
# 测量应用启动时间
adb shell am start -W com.codexwalker.game/.MainActivity
```

### 3. 内存使用监控
```bash
# 监控内存使用
adb shell dumpsys meminfo com.codexwalker.game
```

## 🛠️ 修复建议

1. **资源优化**: 压缩图片和视频文件
2. **代码优化**: 移除未使用的代码和依赖
3. **配置调整**: 优化Capacitor和Android配置
4. **权限检查**: 确保必要权限已正确配置
5. **兼容性测试**: 在不同设备和Android版本上测试

---

💡 **提示**: 使用这些工具可以帮助您快速定位和解决APK中的问题。建议先在Web预览中测试功能，然后再进行APK调试。