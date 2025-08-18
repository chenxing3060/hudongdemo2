# 移动端测试指南

本指南提供多种方法来测试移动端适配问题，避免频繁打包APK。

## 方法一：Android Studio模拟器（推荐）

### 1. 安装Android Studio
```bash
# 下载Android Studio
# 访问：https://developer.android.com/studio
# 安装完成后，打开Android Studio
```

### 2. 创建虚拟设备
```bash
# 在Android Studio中：
# 1. 打开 Tools > AVD Manager
# 2. 点击 "Create Virtual Device"
# 3. 选择设备类型（推荐配置）：
#    - Pixel 6 (1080 x 2400, 411 dpi)
#    - Pixel 4 (1080 x 2280, 440 dpi) 
#    - Nexus 5X (1080 x 1920, 420 dpi)
# 4. 选择系统镜像（推荐 API 30+）
# 5. 完成创建
```

### 3. 启动模拟器并运行应用
```bash
# 启动模拟器
# 在AVD Manager中点击启动按钮

# 在项目目录运行
npm run android:run

# 或者分步执行
npm run build
npx cap sync android
npx cap run android
```

## 方法二：Capacitor Live Reload（实时预览）

### 1. 配置Capacitor实时重载
```bash
# 安装Capacitor CLI（如果未安装）
npm install -g @capacitor/cli

# 启动开发服务器
npm run dev

# 在另一个终端中，启动带实时重载的Android应用
npx cap run android --livereload --external
```

### 2. 修改capacitor.config.json（临时配置）
```json
{
  "appId": "com.thecodexwalker.app",
  "appName": "万象行者",
  "webDir": "dist",
  "server": {
    "url": "http://YOUR_LOCAL_IP:8080",
    "cleartext": true
  }
}
```

## 方法三：Chrome DevTools移动端调试

### 1. 浏览器设备模拟
```bash
# 1. 打开Chrome浏览器
# 2. 访问 http://localhost:8080/game.html
# 3. 按F12打开开发者工具
# 4. 点击设备图标（Toggle device toolbar）
# 5. 选择不同设备进行测试：
#    - iPhone 12 Pro (390 x 844)
#    - Samsung Galaxy S20 Ultra (412 x 915)
#    - iPad Air (820 x 1180)
```

### 2. 自定义设备尺寸
```bash
# 在Chrome DevTools中：
# 1. 点击设备下拉菜单
# 2. 选择 "Edit..."
# 3. 添加自定义设备：
#    - 小屏手机: 360 x 640
#    - 中屏手机: 375 x 667
#    - 大屏手机: 414 x 896
#    - 平板: 768 x 1024
```

## 方法四：真机远程调试

### 1. USB调试设置
```bash
# Android设备设置：
# 1. 开启开发者选项
# 2. 启用USB调试
# 3. 连接电脑

# 验证设备连接
adb devices

# 运行应用到真机
npx cap run android --target=DEVICE_ID
```

### 2. Chrome远程调试
```bash
# 1. 在Chrome中访问 chrome://inspect
# 2. 确保"Discover USB devices"已启用
# 3. 在手机上打开应用
# 4. 在Chrome中点击"inspect"进行调试
```

## 快速测试脚本

### 创建测试脚本
```bash
# 创建 scripts/test-mobile.sh
#!/bin/bash

echo "🚀 启动移动端测试环境..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 同步到Android
echo "🔄 同步到Android项目..."
npx cap sync android

# 启动开发服务器
echo "🌐 启动开发服务器..."
npm run dev &
DEV_PID=$!

# 等待服务器启动
sleep 3

# 启动Android模拟器（如果未运行）
echo "📱 检查Android模拟器..."
if ! adb devices | grep -q "emulator"; then
    echo "启动Android模拟器..."
    emulator -avd Pixel_6_API_30 &
    sleep 10
fi

# 运行应用
echo "🎮 启动应用..."
npx cap run android

echo "✅ 测试环境已启动！"
echo "💡 提示：修改代码后，应用会自动重载"

# 清理函数
cleanup() {
    echo "🧹 清理进程..."
    kill $DEV_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM
wait
```

## 6. 远程调试 (真机调试)

### 6.1 准备工作

1. **安装ADB工具**
   ```bash
   # 通过Android Studio安装
   # 或下载Platform Tools: https://developer.android.com/studio/releases/platform-tools
   ```

2. **开启设备调试模式**
   - 设置 > 关于手机 > 连续点击版本号7次开启开发者选项
   - 设置 > 开发者选项 > 开启USB调试
   - 连接USB线时授权调试

### 6.2 远程调试命令

```bash
# 检查设备连接
npm run debug:check

# 启动完整调试会话
npm run debug:remote

# 安装APK到设备
npm run debug:install

# 查看应用日志
npm run debug:logs

# 截屏
npm run debug:screenshot

# 录制屏幕 (30秒)
./scripts/remote-debug.sh record DEVICE_ID 30
```

### 6.3 Chrome远程调试

1. **启动Chrome调试**
   ```bash
   ./scripts/remote-debug.sh chrome
   ```

2. **在Chrome中访问**
   - 打开 `chrome://inspect`
   - 或直接访问 `http://localhost:9222`

3. **调试WebView**
   - 在设备上打开应用
   - 在Chrome DevTools中选择对应的WebView
   - 进行实时调试和性能分析

### 6.4 设备信息查看

```bash
# 查看设备详细信息
./scripts/remote-debug.sh info DEVICE_ID

# 输出示例:
# 设备型号: SM-G973F
# Android版本: 11 (API 30)
# 屏幕分辨率: 1440x3040
# 屏幕密度: 550dpi
```

### 6.5 端口转发

远程调试脚本会自动设置端口转发：
- `localhost:8080` -> `device:8080` (应用服务)
- `localhost:9222` -> `device:chrome_devtools_remote` (Chrome调试)

## 7. 设备配置文件

项目包含预定义的设备配置文件 `config/device-profiles.json`，包含：

### 7.1 支持的设备类型
- **手机**: iPhone 12 Pro, Samsung Galaxy S21, Google Pixel 6, 小米11, 华为P40
- **平板**: iPad Air, Samsung Galaxy Tab S7
- **通用**: 小屏/中屏/大屏手机

### 7.2 测试配置
- **性能测试**: 页面加载时间、内存使用、CPU使用率
- **兼容性测试**: 不同设备和浏览器的兼容性
- **响应式测试**: 不同屏幕尺寸的布局适配
- **触摸交互测试**: 点击、滑动、缩放等手势

### 7.3 网络配置
- WiFi、4G、3G、慢速3G、离线模式
- 可模拟不同网络条件下的应用表现

## 8. 故障排除

### 常见问题

1. **模拟器启动失败**
   - 检查Android Studio是否正确安装
   - 确认ANDROID_HOME环境变量设置正确
   - 尝试重启Android Studio

2. **实时重载不工作**
   - 检查防火墙设置
   - 确认设备和电脑在同一网络
   - 检查IP地址是否正确

3. **Chrome DevTools连接失败**
   - 确认Chrome版本支持远程调试
   - 检查USB调试是否开启
   - 尝试重启Chrome浏览器

4. **ADB设备未检测到**
   - 检查USB线连接
   - 重新授权USB调试
   - 运行 `adb kill-server && adb start-server`

5. **应用安装失败**
   - 检查设备存储空间
   - 卸载旧版本应用
   - 确认APK文件完整性

### 常见问题解决

### 1. 模拟器启动失败
```bash
# 检查HAXM是否安装（Intel处理器）
# 或检查Hyper-V设置（Windows）

# macOS用户可能需要：
sudo xcode-select --install
```

### 2. 实时重载不工作
```bash
# 确保防火墙允许端口8080
# 检查网络连接
# 重启开发服务器

# 获取本机IP地址
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### 3. 设备连接问题
```bash
# 重启adb服务
adb kill-server
adb start-server

# 检查USB驱动
adb devices -l
```

## 性能优化建议

### 1. 减少资源大小
   - 压缩图片和视频
   - 使用适当的图片格式
   - 启用代码分割

### 2. 优化加载速度
   - 使用懒加载
   - 减少HTTP请求
   - 启用缓存策略

### 3. 改善用户体验
   - 添加加载指示器
   - 优化触摸交互
   - 确保响应式设计

### 4. 模拟器性能优化
```bash
# 在AVD配置中：
# - 启用硬件加速
# - 分配足够的RAM（4GB+）
# - 启用GPU加速
```

### 5. 开发效率提升
```bash
# 使用热重载减少等待时间
# 配置多个模拟器测试不同尺寸
# 使用Chrome DevTools进行快速调试
```

## 测试检查清单

- [ ] 不同屏幕尺寸适配
- [ ] 横竖屏切换
- [ ] 触摸交互响应
- [ ] 字体大小适配
- [ ] 按钮点击区域
- [ ] 视频播放效果
- [ ] 页面加载性能
- [ ] 网络状态处理

---

通过以上方法，您可以在本地快速测试移动端适配问题，大大减少APK打包和安装的时间。推荐优先使用Android Studio模拟器配合Capacitor实时重载功能。