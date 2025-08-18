# Capacitor Android APK 构建指南

## 🎯 项目状态

✅ **Capacitor 项目已完全配置完成！**

- ✅ Capacitor CLI 已安装
- ✅ Android 平台已添加
- ✅ 项目配置已完成
- ✅ Web 资源已同步
- ✅ 应用图标已配置
- ✅ 所有游戏资源（包括850MB视频文件）已打包

## 📱 下一步：构建 APK

### 方法一：使用 Android Studio（推荐）

#### 1. 安装 Android Studio
```bash
# 下载并安装 Android Studio
# https://developer.android.com/studio
```

#### 2. 打开项目
```bash
# 在项目根目录执行
npx cap open android
```

#### 3. 在 Android Studio 中构建
1. 等待 Gradle 同步完成
2. 点击 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. 构建完成后，APK 文件位于：
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### 方法二：命令行构建（需要 Android SDK）

#### 1. 设置环境变量
```bash
# 添加到 ~/.zshrc 或 ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

#### 2. 构建 Debug APK
```bash
cd android
./gradlew assembleDebug
```

#### 3. 构建 Release APK（需要签名）
```bash
cd android
./gradlew assembleRelease
```

## 🔧 高级配置

### 应用签名（Release 版本）

1. 生成密钥库：
```bash
keytool -genkey -v -keystore thecodexwalker-release-key.keystore -alias thecodexwalker -keyalg RSA -keysize 2048 -validity 10000
```

2. 配置签名（在 `android/app/build.gradle` 中）：
```gradle
android {
    signingConfigs {
        release {
            storeFile file('thecodexwalker-release-key.keystore')
            storePassword 'your_store_password'
            keyAlias 'thecodexwalker'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 优化 APK 大小

1. 启用代码压缩：
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
    }
}
```

2. 分包策略（如果需要）：
```gradle
android {
    bundle {
        density {
            enableSplit true
        }
        abi {
            enableSplit true
        }
    }
}
```

## 📊 项目信息

- **应用名称**: 万象行者
- **包名**: com.thecodexwalker.app
- **预估 APK 大小**: ~850MB（包含所有游戏视频）
- **支持平台**: Android 5.0+ (API 21+)
- **架构**: WebView + 原生容器

## 🚀 部署选项

### 1. 直接安装
```bash
# 安装到连接的 Android 设备
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. 上传到应用商店
- Google Play Store
- 华为应用市场
- 小米应用商店
- 其他第三方应用市场

## 🔍 故障排除

### 常见问题

1. **Gradle 同步失败**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew build
   ```

2. **内存不足**
   - 在 `android/gradle.properties` 中增加：
   ```
   org.gradle.jvmargs=-Xmx4096m
   ```

3. **构建超时**
   - 增加超时时间：
   ```
   org.gradle.daemon.idletimeout=60000
   ```

## 📝 注意事项

1. **首次构建**可能需要下载大量依赖，请确保网络连接稳定
2. **APK 大小**约为 850MB，主要由游戏视频文件构成
3. **性能优化**：所有资源已本地化，无需网络连接即可运行
4. **兼容性**：支持 Android 5.0 及以上版本

## 🎉 完成！

恭喜！您的「万象行者」游戏已成功配置为 Capacitor Android 项目。
现在可以使用 Android Studio 或命令行工具构建高质量的 Android APK 了！

---

**项目路径**: `/Users/sailf/Downloads/thecodexwalker/android/`
**配置文件**: `capacitor.config.json`
**构建输出**: `android/app/build/outputs/apk/`