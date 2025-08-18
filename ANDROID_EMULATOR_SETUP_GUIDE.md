# Android模拟器设置指南

## 当前状态检查结果

✅ **Android Studio已安装**: `/Applications/Android Studio.app`
✅ **Android SDK已安装**: `/Users/sailf/Library/Android/sdk`
❌ **缺少Emulator组件**: 需要安装
❌ **缺少Command Line Tools**: 需要安装
❌ **没有可用的AVD**: 需要创建

## 解决方案

### 方案1: 通过Android Studio安装组件（推荐）

1. **手动启动Android Studio**
   - 在Finder中打开 `/Applications`
   - 双击 `Android Studio.app` 启动
   - 如果启动失败，尝试右键点击 → "打开"

2. **安装SDK组件**
   - 启动Android Studio后，点击 "Configure" → "SDK Manager"
   - 在 "SDK Tools" 标签页中，勾选以下组件：
     - ✅ Android SDK Command-line Tools (latest)
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools
   - 点击 "Apply" 安装

3. **创建AVD**
   - 在Android Studio主界面，点击 "Configure" → "AVD Manager"
   - 点击 "Create Virtual Device"
   - 选择设备类型（推荐：Pixel 4）
   - 选择系统镜像（推荐：API 30 或更高版本）
   - 完成创建

### 方案2: 命令行安装（高级用户）

```bash
# 设置环境变量
export ANDROID_HOME=/Users/sailf/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 下载并安装cmdline-tools
cd $ANDROID_HOME
wget https://dl.google.com/android/repository/commandlinetools-mac-8512546_latest.zip
unzip commandlinetools-mac-8512546_latest.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/

# 安装emulator
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "emulator"
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "system-images;android-30;google_apis;x86_64"

# 创建AVD
$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd -n "Pixel_4_API_30" -k "system-images;android-30;google_apis;x86_64" -d "pixel_4"
```

### 方案3: 使用现有设备（最简单）

如果你有Android设备：

1. **启用开发者选项**
   - 设置 → 关于手机 → 连续点击"版本号"7次

2. **启用USB调试**
   - 设置 → 开发者选项 → USB调试

3. **连接设备**
   ```bash
   # 检查设备连接
   /Users/sailf/Library/Android/sdk/platform-tools/adb devices
   ```

## 启动模拟器

安装完成后，使用以下命令启动模拟器：

```bash
# 设置环境变量
export ANDROID_HOME=/Users/sailf/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

# 列出可用的AVD
$ANDROID_HOME/emulator/emulator -list-avds

# 启动模拟器（替换AVD_NAME为实际名称）
$ANDROID_HOME/emulator/emulator -avd AVD_NAME
```

## 测试APK

模拟器启动后，可以安装和测试APK：

```bash
# 安装APK
adb install path/to/your/app.apk

# 或者使用Capacitor live reload
npx cap run android --livereload
```

## 故障排除

### 常见问题

1. **Android Studio无法启动**
   - 检查Java版本：`java -version`
   - 重启电脑后再试
   - 检查磁盘空间是否充足

2. **模拟器启动慢**
   - 在AVD设置中启用硬件加速
   - 增加RAM分配
   - 使用x86_64镜像而不是ARM

3. **adb连接问题**
   ```bash
   adb kill-server
   adb start-server
   ```

## 下一步

完成设置后，你可以：
- 使用 `npx cap run android --livereload` 进行实时开发
- 直接在模拟器中安装和测试APK文件
- 使用Chrome DevTools进行远程调试

---

**注意**: 如果遇到权限问题，可能需要使用 `sudo` 命令或调整文件权限。