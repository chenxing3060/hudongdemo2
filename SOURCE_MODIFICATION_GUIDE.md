# 源代码修改和配置指南

## 📁 项目结构说明

```
万象行者/
├── src/                    # 游戏源代码
│   ├── index.html         # 主页面
│   ├── js/                # JavaScript文件
│   ├── css/               # 样式文件
│   ├── images/            # 图片资源
│   └── videos/            # 视频资源
├── android/               # Android原生项目
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/       # Android资源
│   │   └── build.gradle   # 应用构建配置
│   └── build.gradle       # 项目构建配置
├── capacitor.config.ts    # Capacitor配置
└── package.json           # 项目依赖
```

## 🔧 常见修改场景

### 1. 游戏内容修改

#### 修改游戏文本
```bash
# 查找包含特定文本的文件
grep -r "要修改的文本" src/

# 批量替换文本
sed -i '' 's/旧文本/新文本/g' src/js/*.js
```

#### 替换图片资源
```bash
# 替换图片（保持文件名相同）
cp 新图片.png src/images/原图片.png

# 批量优化图片大小
for img in src/images/*.png; do
    convert "$img" -quality 85 "$img"
done
```

#### 替换视频资源
```bash
# 替换视频文件
cp 新视频.mp4 src/videos/原视频.mp4

# 压缩视频减小APK大小
ffmpeg -i src/videos/原视频.mp4 -c:v libx264 -crf 28 src/videos/压缩视频.mp4
```

### 2. 应用配置修改

#### 修改应用名称和图标
```typescript
// capacitor.config.ts
export default {
  appId: 'com.codexwalker.game',
  appName: '新的应用名称',  // 修改这里
  webDir: 'src',
  // ...
};
```

#### 修改Android配置
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application
    android:label="新的应用名称"  <!-- 修改这里 -->
    android:icon="@mipmap/ic_launcher">
```

#### 修改应用图标
```bash
# 替换应用图标（需要不同尺寸）
# 将新图标放入对应目录：
# android/app/src/main/res/mipmap-hdpi/ic_launcher.png (72x72)
# android/app/src/main/res/mipmap-mdpi/ic_launcher.png (48x48)
# android/app/src/main/res/mipmap-xhdpi/ic_launcher.png (96x96)
# android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png (144x144)
# android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png (192x192)
```

### 3. 权限配置

#### 添加新权限
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

#### 网络安全配置
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<application
    android:networkSecurityConfig="@xml/network_security_config">
```

### 4. 性能优化

#### 启用代码压缩
```gradle
// android/app/build.gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 资源优化
```gradle
// android/app/build.gradle
android {
    buildTypes {
        release {
            shrinkResources true
            minifyEnabled true
        }
    }
}
```

## 🔄 修改后的构建流程

### 1. 快速测试修改
```bash
# 1. 在Web预览中测试
python3 -m http.server 8080
# 访问 http://localhost:8080 测试修改

# 2. 同步到Android项目
npx cap sync android

# 3. 构建APK
cd android && ./gradlew assembleDebug
```

### 2. 完整构建流程
```bash
# 1. 清理之前的构建
cd android && ./gradlew clean

# 2. 同步资源
cd .. && npx cap sync android

# 3. 构建发布版APK
cd android && ./gradlew assembleRelease
```

## 📝 配置文件详解

### capacitor.config.ts
```typescript
export default {
  appId: 'com.codexwalker.game',        // 应用包名
  appName: '万象行者',                   // 应用名称
  webDir: 'src',                        // Web资源目录
  server: {
    androidScheme: 'https'              // Android URL方案
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,          // 启动画面显示时间
      backgroundColor: '#000000'         // 启动画面背景色
    }
  }
};
```

### Android Gradle配置
```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.codexwalker.game"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

## 🚀 快速修改脚本

创建快速修改脚本：
```bash
#!/bin/bash
# quick_modify.sh

echo "🔄 同步资源到Android项目..."
npx cap sync android

echo "🏗️ 构建APK..."
cd android && ./gradlew assembleDebug

echo "✅ APK构建完成！"
echo "📱 APK位置: android/app/build/outputs/apk/debug/app-debug.apk"
```

## ⚠️ 注意事项

1. **备份重要文件**: 修改前先备份原始文件
2. **测试修改**: 先在Web预览中测试，再构建APK
3. **资源路径**: 确保修改后的资源路径正确
4. **权限检查**: 新功能可能需要额外权限
5. **版本管理**: 重要修改后更新版本号

---

💡 **提示**: 建议使用版本控制系统（如Git）来管理代码修改，这样可以轻松回滚到之前的版本。