# 万象行者 - 安卓APK打包指南

本文档详细介绍如何将现有的PWA游戏项目"万象行者"打包为安卓APK文件。项目已经具备完整的PWA配置（manifest.json和service-worker.js），可以使用多种方案进行打包。

## 项目概述

- **项目名称**: 万象行者 (The Codex Walker)
- **项目类型**: HTML/JavaScript PWA游戏
- **现有配置**: manifest.json, service-worker.js
- **目标**: 生成可安装的安卓APK文件

## 方案一：PWA Builder（推荐）

### 优势
- 最简单快捷的方案
- 无需本地开发环境
- 自动处理PWA到APK的转换
- 支持Google Play Store发布

### 步骤

1. **访问PWA Builder网站**
   - 打开 https://www.pwabuilder.com/
   - 点击"Start Building"

2. **输入项目URL**
   - 如果项目已部署到网上，直接输入URL
   - 如果未部署，需要先将项目上传到GitHub Pages或其他托管服务

3. **分析PWA配置**
   - PWA Builder会自动分析manifest.json
   - 检查Service Worker配置
   - 验证PWA兼容性

4. **生成安卓包**
   - 选择"Android"平台
   - 配置应用信息（包名、版本等）
   - 点击"Generate Package"

5. **下载APK**
   - 下载生成的APK文件
   - 可选择签名版本或未签名版本

### 注意事项
- 需要项目在线可访问
- 生成的APK可能需要进一步优化
- 建议配置应用图标和启动画面

## 方案二：Capacitor

### 优势
- 原生功能集成能力强
- 支持插件扩展
- 现代化的开发体验
- 良好的性能表现

### 前置要求
- Node.js (已安装)
- Android Studio
- Java Development Kit (JDK)

### 步骤

1. **安装Capacitor CLI**
   ```bash
   npm install -g @capacitor/cli
   ```

2. **初始化Capacitor项目**
   ```bash
   cd /Users/sailf/Downloads/thecodexwalker
   npx cap init "万象行者" "com.example.codexwalker"
   ```

3. **添加安卓平台**
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```

4. **构建Web资源**
   ```bash
   # 如果有构建脚本
   npm run build
   # 或者直接同步现有文件
   npx cap sync
   ```

5. **配置capacitor.config.ts**
   ```typescript
   import { CapacitorConfig } from '@capacitor/cli';
   
   const config: CapacitorConfig = {
     appId: 'com.example.codexwalker',
     appName: '万象行者',
     webDir: '.', // 指向项目根目录
     server: {
       androidScheme: 'https'
     }
   };
   
   export default config;
   ```

6. **打开Android Studio**
   ```bash
   npx cap open android
   ```

7. **构建APK**
   - 在Android Studio中选择"Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)"
   - 等待构建完成
   - APK文件位于 `android/app/build/outputs/apk/debug/`

### 配置优化
- 修改 `android/app/src/main/res/values/strings.xml` 设置应用名称
- 替换 `android/app/src/main/res/mipmap-*/` 中的图标文件
- 配置 `android/app/src/main/AndroidManifest.xml` 权限

## 方案三：Apache Cordova

### 优势
- 成熟稳定的跨平台方案
- 丰富的插件生态
- 广泛的社区支持

### 前置要求
- Node.js (已安装)
- Android SDK
- Java Development Kit (JDK)

### 步骤

1. **安装Cordova CLI**
   ```bash
   npm install -g cordova
   ```

2. **创建Cordova项目**
   ```bash
   cordova create codexwalker com.example.codexwalker "万象行者"
   cd codexwalker
   ```

3. **复制项目文件**
   ```bash
   # 删除默认的www目录内容
   rm -rf www/*
   # 复制游戏文件到www目录
   cp -r /Users/sailf/Downloads/thecodexwalker/* www/
   ```

4. **添加安卓平台**
   ```bash
   cordova platform add android
   ```

5. **配置config.xml**
   ```xml
   <?xml version='1.0' encoding='utf-8'?>
   <widget id="com.example.codexwalker" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
       <name>万象行者</name>
       <description>探索隐藏在日常之下的奇异世界</description>
       <author email="dev@example.com" href="http://example.com">开发团队</author>
       <content src="index.html" />
       <access origin="*" />
       <preference name="Fullscreen" value="true" />
       <preference name="Orientation" value="portrait" />
   </widget>
   ```

6. **构建APK**
   ```bash
   cordova build android
   ```

7. **生成发布版本**
   ```bash
   cordova build android --release
   ```

### APK位置
- Debug版本: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- Release版本: `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 方案四：Android Studio TWA (Trusted Web Activities)

### 优势
- 原生应用体验
- 自动更新Web内容
- 最小的APK体积
- Google推荐的PWA打包方案

### 前置要求
- Android Studio
- 项目需要部署到HTTPS域名

### 步骤

1. **安装Android Studio**
   - 下载并安装最新版Android Studio
   - 配置Android SDK

2. **使用TWA模板**
   - 打开Android Studio
   - 选择"New Project"
   - 选择"Trusted Web Activity"模板

3. **配置TWA参数**
   ```kotlin
   // app/src/main/java/.../MainActivity.kt
   class MainActivity : LauncherActivity() {
       override fun getLauncherActivityMetadata(): LauncherActivityMetadata {
           return LauncherActivityMetadata.builder()
               .setWebUri(Uri.parse("https://your-domain.com")) // 替换为实际域名
               .build()
       }
   }
   ```

4. **配置AndroidManifest.xml**
   ```xml
   <activity
       android:name=".MainActivity"
       android:exported="true"
       android:theme="@style/Theme.LauncherActivity">
       <intent-filter android:autoVerify="true">
           <action android:name="android.intent.action.VIEW" />
           <category android:name="android.intent.category.DEFAULT" />
           <category android:name="android.intent.category.BROWSABLE" />
           <data android:scheme="https"
                 android:host="your-domain.com" />
       </intent-filter>
   </activity>
   ```

5. **配置Digital Asset Links**
   - 在网站根目录创建 `.well-known/assetlinks.json`
   - 配置应用签名验证

6. **构建APK**
   - 在Android Studio中构建项目
   - 生成签名的APK文件

## 签名和发布

### 生成签名密钥
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```

### 签名APK
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name
```

### 优化APK
```bash
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## 测试和调试

### 安装测试
```bash
adb install app-debug.apk
```

### 日志查看
```bash
adb logcat
```

### 性能分析
- 使用Chrome DevTools远程调试
- Android Studio Profiler
- Firebase Performance Monitoring

## 常见问题解决

### 1. 网络请求失败
- 检查网络安全配置
- 添加CORS头部
- 配置Content Security Policy

### 2. 文件路径问题
- 使用相对路径
- 检查大小写敏感性
- 确保所有资源文件包含在内

### 3. 性能优化
- 压缩图片和视频资源
- 启用资源缓存
- 优化JavaScript代码

### 4. 权限配置
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 推荐方案选择

| 方案 | 适用场景 | 难度 | 功能完整性 |
|------|----------|------|------------|
| PWA Builder | 快速原型，简单应用 | ⭐ | ⭐⭐⭐ |
| Capacitor | 需要原生功能集成 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Cordova | 传统项目，稳定性要求高 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| TWA | 纯Web应用，最佳性能 | ⭐⭐ | ⭐⭐⭐ |

## 总结

对于"万象行者"这样的PWA游戏项目，推荐使用以下方案：

1. **快速测试**: PWA Builder
2. **生产发布**: Capacitor + Android Studio
3. **最佳性能**: TWA (需要先部署到线上)

选择合适的方案后，按照对应的步骤进行操作，即可成功将PWA项目打包为安卓APK文件。