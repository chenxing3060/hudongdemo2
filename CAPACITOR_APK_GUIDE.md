# Capacitor APK 打包指南

## 概述

由于PWA Builder在处理大型视频文件（850MB+）时遇到"状态码500，不支持的媒体类型"错误，我们推荐使用Capacitor作为替代方案。Capacitor是Ionic团队开发的跨平台应用运行时，专门为处理大型Web应用而设计。

## 为什么选择Capacitor？

### 优势
- ✅ **大文件支持**：原生支持大型视频文件，无文件大小限制
- ✅ **性能优化**：原生WebView性能，视频播放流畅
- ✅ **完整功能**：支持所有Web API和原生功能
- ✅ **灵活配置**：可自定义应用图标、启动画面、权限等
- ✅ **调试友好**：提供完整的调试工具和日志
- ✅ **持续维护**：活跃的开源项目，定期更新

### 与PWA Builder对比
| 特性 | PWA Builder | Capacitor |
|------|-------------|----------|
| 大文件支持 | ❌ 有限制 | ✅ 无限制 |
| 视频播放 | ⚠️ 可能有问题 | ✅ 原生支持 |
| 自定义程度 | 🔶 中等 | ✅ 高度自定义 |
| 调试能力 | 🔶 基础 | ✅ 完整工具链 |
| 学习成本 | ✅ 低 | 🔶 中等 |

## 环境准备

### 1. 安装Node.js和npm
```bash
# 检查是否已安装
node --version
npm --version

# 如果未安装，请访问 https://nodejs.org/ 下载安装
```

### 2. 安装Android开发环境

#### 安装Android Studio
1. 下载并安装 [Android Studio](https://developer.android.com/studio)
2. 启动Android Studio，完成初始设置
3. 安装Android SDK（API 33或更高版本）

#### 配置环境变量
```bash
# 添加到 ~/.zshrc 或 ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 重新加载配置
source ~/.zshrc
```

### 3. 安装Capacitor CLI
```bash
npm install -g @capacitor/cli
```

## 项目配置步骤

### 第1步：初始化Capacitor项目

在项目根目录执行：
```bash
# 初始化Capacitor
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init "万象行者" "com.thecodexwalker.app"
```

### 第2步：添加Android平台
```bash
npm install @capacitor/android
npx cap add android
```

### 第3步：配置capacitor.config.ts

创建或修改 `capacitor.config.ts`：
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thecodexwalker.app',
  appName: '万象行者',
  webDir: '.',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#0a0a14',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
```

### 第4步：优化项目结构

确保所有资源文件路径正确：
```bash
# 检查关键文件是否存在
ls -la index.html
ls -la manifest.json
ls -la game/videos/
```

### 第5步：构建和同步
```bash
# 同步Web资源到原生项目
npx cap sync

# 复制资源文件
npx cap copy
```

## APK构建过程

### 方法1：使用Android Studio（推荐）

1. **打开项目**
```bash
npx cap open android
```

2. **在Android Studio中**
   - 等待Gradle同步完成
   - 选择 `Build` → `Generate Signed Bundle / APK`
   - 选择 `APK`
   - 创建新的密钥库或使用现有密钥库
   - 选择 `release` 构建类型
   - 点击 `Finish`

3. **APK位置**
   - 构建完成后，APK文件位于：
   - `android/app/build/outputs/apk/release/app-release.apk`

### 方法2：命令行构建

```bash
# 进入Android项目目录
cd android

# 构建调试版APK
./gradlew assembleDebug

# 构建发布版APK（需要签名配置）
./gradlew assembleRelease
```

## 应用配置优化

### 1. 自定义应用图标

将图标文件放置在正确位置：
```
android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

### 2. 配置启动画面

编辑 `android/app/src/main/res/values/styles.xml`：
```xml
<style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
    <item name="android:background">@drawable/splash</item>
</style>
```

### 3. 权限配置

编辑 `android/app/src/main/AndroidManifest.xml`：
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## 视频文件优化建议

### 1. 视频压缩
```bash
# 使用ffmpeg压缩视频（如果需要）
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k output.mp4
```

### 2. 分包策略
- 将视频文件分为核心包和扩展包
- 实现按需下载机制
- 使用CDN加速视频加载

### 3. 缓存优化
- 配置Service Worker缓存策略
- 实现视频预加载机制
- 添加离线播放支持

## 测试和调试

### 1. 设备测试
```bash
# 在连接的Android设备上运行
npx cap run android

# 查看设备日志
adb logcat
```

### 2. 模拟器测试
```bash
# 启动Android模拟器
emulator -avd <AVD_NAME>

# 在模拟器中安装APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Web调试
- 在Chrome中打开 `chrome://inspect`
- 选择设备进行远程调试
- 查看控制台输出和网络请求

## 常见问题解决

### 1. 视频播放问题
```javascript
// 确保视频元素配置正确
const video = document.createElement('video');
video.setAttribute('playsinline', 'true');
video.setAttribute('webkit-playsinline', 'true');
video.setAttribute('preload', 'metadata');
```

### 2. 文件路径问题
```javascript
// 使用相对路径
const videoPath = './game/videos/cg/cg_intro.mp4';

// 或使用Capacitor的文件系统API
import { Filesystem, Directory } from '@capacitor/filesystem';
```

### 3. 性能优化
```javascript
// 实现视频预加载
const preloadVideo = (src) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = src;
};
```

## 发布准备

### 1. 签名配置
创建 `android/app/build.gradle` 签名配置：
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/keystore.jks')
            storePassword 'store_password'
            keyAlias 'key_alias'
            keyPassword 'key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 2. 版本管理
编辑 `android/app/build.gradle`：
```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

## 总结

Capacitor提供了比PWA Builder更强大和灵活的APK打包解决方案，特别适合处理大型视频文件的Web应用。虽然初始设置稍微复杂，但它提供了更好的性能、更多的自定义选项和更可靠的构建过程。

**预期结果**：
- APK大小：约850MB（包含所有视频文件）
- 性能：原生级别的视频播放体验
- 兼容性：支持Android 7.0+（API 24+）
- 功能：完整的游戏功能，包括音频、视频、存档等

**下一步**：按照本指南执行Capacitor配置，或者先尝试解决PWA Builder的问题（参考问题排查指南）。