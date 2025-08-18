# PWA Builder 问题排查和解决指南

## 问题描述

在使用PWA Builder生成Windows测试包时遇到以下错误：
```
Error: Failed. Status code 500
System.Net.Http.HttpRequestException: Response status code does not indicate success: 415 (Unsupported Media Type).
```

## 错误分析

### 根本原因
1. **文件大小限制**：PWA Builder对单个文件和总项目大小有限制
2. **媒体类型问题**：大型视频文件（.mp4）可能不被支持或超出处理能力
3. **服务器限制**：PWA Builder的服务器无法处理850MB+的视频内容

### 具体问题
- **总视频大小**：850MB（bg: 330MB + cg: 482MB + ui: 38MB）
- **最大单文件**：73MB（bg_heroine_ritual.mp4, cg_heroine_ritual_scene.mp4）
- **文件数量**：30个视频文件

## 解决方案

### 方案1：视频文件优化（推荐尝试）

#### 1.1 压缩视频文件
```bash
# 安装ffmpeg（如果未安装）
brew install ffmpeg

# 批量压缩视频文件
for file in game/videos/**/*.mp4; do
    ffmpeg -i "$file" -c:v libx264 -crf 28 -c:a aac -b:a 128k "${file%.mp4}_compressed.mp4"
done
```

#### 1.2 创建轻量版本
创建一个只包含核心视频的轻量版本：
```bash
# 创建轻量版目录
mkdir -p game/videos_lite/bg game/videos_lite/cg game/videos_lite/ui

# 只保留关键视频文件（总大小<200MB）
cp game/videos/ui/ui_opening.mp4 game/videos_lite/ui/
cp game/videos/cg/cg_first_choice.mp4 game/videos_lite/cg/
cp game/videos/bg/bg_final_choice.mp4 game/videos_lite/bg/
# ... 选择其他关键视频
```

#### 1.3 修改代码引用
临时修改视频引用路径：
```javascript
// 在UIManager.js中添加轻量模式
const LITE_MODE = true; // 临时启用轻量模式

setVideoBackground(videoPath, playOnce = false) {
    if (LITE_MODE) {
        videoPath = videoPath.replace('/videos/', '/videos_lite/');
    }
    // ... 其余代码
}
```

### 方案2：分包策略

#### 2.1 创建核心包
```bash
# 创建核心包目录
mkdir thecodexwalker-core

# 复制核心文件（不包含视频）
cp -r css data js game/icon-* game/screenshot-* *.html *.json *.md thecodexwalker-core/

# 创建占位视频文件
mkdir -p thecodexwalker-core/game/videos/{bg,cg,ui}
touch thecodexwalker-core/game/videos/bg/placeholder.mp4
touch thecodexwalker-core/game/videos/cg/placeholder.mp4
touch thecodexwalker-core/game/videos/ui/placeholder.mp4
```

#### 2.2 实现动态加载
```javascript
// 添加视频动态加载功能
class VideoLoader {
    constructor() {
        this.baseUrl = 'https://chenxing3060.github.io/hudongdemo2/';
        this.cache = new Map();
    }
    
    async loadVideo(videoPath) {
        if (this.cache.has(videoPath)) {
            return this.cache.get(videoPath);
        }
        
        try {
            const response = await fetch(this.baseUrl + videoPath);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            this.cache.set(videoPath, url);
            return url;
        } catch (error) {
            console.error('视频加载失败:', error);
            return null;
        }
    }
}
```

### 方案3：使用替代服务

#### 3.1 Bubblewrap（Google推荐）
```bash
# 安装Bubblewrap
npm install -g @bubblewrap/cli

# 初始化TWA项目
bubblewrap init --manifest https://chenxing3060.github.io/hudongdemo2/manifest.json

# 构建APK
bubblewrap build
```

#### 3.2 PWA2APK在线服务
访问以下在线服务：
- [PWA2APK](https://pwa2apk.com/)
- [APK Generator](https://appmaker.xyz/pwa-to-apk/)
- [Appy Pie](https://www.appypie.com/)

### 方案4：本地TWA构建

#### 4.1 使用Android Studio
```bash
# 克隆TWA模板
git clone https://github.com/GoogleChromeLabs/android-browser-helper.git
cd android-browser-helper/demos/twa-basic

# 修改配置
# 编辑 app/src/main/res/values/strings.xml
# 设置 twa_url 为 https://chenxing3060.github.io/hudongdemo2/
```

#### 4.2 配置TWA参数
```xml
<!-- app/src/main/res/values/strings.xml -->
<resources>
    <string name="app_name">万象行者</string>
    <string name="twa_url">https://chenxing3060.github.io/hudongdemo2/</string>
    <string name="twa_theme_color">#7e57c2</string>
    <string name="twa_background_color">#0a0a14</string>
</resources>
```

## 临时解决方案

### 快速测试方案

1. **创建最小化版本**
```bash
# 备份原始视频
mv game/videos game/videos_backup

# 创建空视频目录
mkdir -p game/videos/{bg,cg,ui}

# 创建1秒的占位视频
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 game/videos/ui/ui_opening.mp4
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 game/videos/cg/cg_first_choice.mp4
ffmpeg -f lavfi -i color=black:size=1280x720:duration=1 -c:v libx264 game/videos/bg/bg_final_choice.mp4
```

2. **重新部署到GitHub Pages**
```bash
git add .
git commit -m "临时移除大型视频文件用于PWA Builder测试"
git push origin main
```

3. **在PWA Builder中重新测试**
   - 等待GitHub Pages更新（约5分钟）
   - 重新在PWA Builder中输入URL
   - 尝试生成测试包

4. **恢复原始文件**
```bash
# 测试完成后恢复
rm -rf game/videos
mv game/videos_backup game/videos
git add .
git commit -m "恢复原始视频文件"
git push origin main
```

## 长期解决方案

### 推荐方案：Capacitor

基于项目的特点（大型视频文件、复杂交互），强烈推荐使用Capacitor：

1. **优势**
   - 原生支持大型文件
   - 更好的视频播放性能
   - 完整的调试工具
   - 灵活的配置选项

2. **实施步骤**
   - 参考 `CAPACITOR_APK_GUIDE.md`
   - 预计设置时间：2-3小时
   - 预计APK大小：850MB

### 备选方案：分包部署

1. **核心包**（PWA Builder）
   - 包含游戏逻辑和UI
   - 大小<50MB
   - 快速安装和启动

2. **资源包**（动态下载）
   - 视频文件按需下载
   - 支持离线缓存
   - 渐进式加载体验

## 监控和诊断

### 检查项目大小
```bash
# 检查总大小
du -sh .

# 检查各目录大小
du -sh */ | sort -hr

# 检查大文件
find . -type f -size +10M -exec ls -lh {} + | sort -k5 -hr
```

### 验证PWA配置
```bash
# 检查manifest.json
cat manifest.json | jq .

# 验证Service Worker
curl -I https://chenxing3060.github.io/hudongdemo2/sw.js

# 检查资源可访问性
curl -I https://chenxing3060.github.io/hudongdemo2/game/videos/ui/ui_opening.mp4
```

## 总结

**立即可尝试的方案**：
1. 创建轻量版本进行PWA Builder测试
2. 使用Bubblewrap作为替代工具
3. 尝试其他在线PWA转APK服务

**长期推荐方案**：
1. **Capacitor**（最佳选择）- 完整功能，原生性能
2. **分包策略** - 保持PWA优势，优化加载体验
3. **视频优化** - 压缩文件，提升整体性能

**预期结果**：
- 轻量版本：PWA Builder可能成功生成APK
- Capacitor方案：100%成功，完整功能
- 分包方案：渐进式体验，更好的用户体验

选择哪种方案取决于您的优先级：快速测试选择轻量版本，完整功能选择Capacitor，最佳用户体验选择分包策略。