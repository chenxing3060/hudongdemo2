# 🚀 万象行者 Android APK 构建指南

## ❌ 常见错误说明

### 问题：在终端中执行GUI菜单命令
```bash
$ Build > Build Bundle(s)/APK(s) > Build APK(s)
zsh: no matches found: Bundle(s)/APK(s)
```

**错误原因**：
- `Build > Build Bundle(s)/APK(s) > Build APK(s)` 是 Android Studio 的 **GUI 菜单操作**
- 这不是终端命令，无法在命令行中执行
- 需要在 Android Studio 图形界面中点击菜单

## ✅ 正确的APK构建方法

### 方法一：Android Studio GUI构建（推荐）

#### 1. 安装 Android Studio
```bash
# 下载地址
https://developer.android.com/studio
```

#### 2. 打开Android项目
```bash
# 在项目根目录执行
npx cap open android
```

#### 3. 在Android Studio中构建APK
1. 等待项目加载完成
2. 点击菜单：**Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
3. 等待构建完成
4. APK文件位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### 方法二：命令行构建

#### 前提条件
1. 安装 Android SDK
2. 配置环境变量 `ANDROID_HOME`
3. 安装 Java JDK 8+

#### 构建命令
```bash
# 进入Android项目目录
cd android

# 构建Debug APK
./gradlew assembleDebug

# 构建Release APK（需要签名配置）
./gradlew assembleRelease
```

### 方法三：使用项目脚本

#### 快速构建脚本
```bash
# 使用项目提供的构建脚本
./build-apk.sh

# 或者
./build_apk.sh
```

## 🔧 环境检查

### 检查Node.js和npm
```bash
node --version  # 应显示 v24.5.0
npm --version   # 应显示npm版本
```

### 检查Capacitor
```bash
npx cap --version
```

### 检查Android SDK（可选）
```bash
echo $ANDROID_HOME
adb --version
```

## 📱 构建结果

### 成功构建后的文件位置
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

### APK信息
- **应用名称**: 万象行者
- **包名**: com.codexwalker.game
- **预估大小**: ~850MB（包含完整游戏资源）

## 🎯 推荐流程

1. **首次构建**：使用 Android Studio GUI 方法
2. **后续构建**：可使用命令行或脚本方法
3. **发布版本**：使用 Android Studio 配置签名后构建

## 🔍 故障排除

### 常见问题
1. **Gradle构建失败**：检查网络连接，清理缓存 `./gradlew clean`
2. **内存不足**：增加Gradle内存设置
3. **SDK版本问题**：确保Android SDK版本兼容

### 获取帮助
- 查看构建日志：`./gradlew assembleDebug --info`
- 清理项目：`./gradlew clean`
- 重新同步：`npx cap sync android`

---

**记住**：GUI菜单操作只能在图形界面中执行，不能在终端中运行！