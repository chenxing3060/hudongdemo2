# 浏览器移动端测试指南

当 Android Studio 无法使用时，浏览器移动端模拟是最快速、最便捷的测试方案。

## 快速开始

### 1. 启动开发服务器
确保您的开发服务器正在运行：
```bash
npm run dev
```

访问地址：http://localhost:8000/game.html

### 2. Chrome DevTools 移动端调试

#### 基本步骤
1. 打开 Chrome 浏览器
2. 访问 http://localhost:8000/game.html
3. 按 `F12` 或右键选择「检查」
4. 点击设备模拟按钮 📱 (或按 `Ctrl+Shift+M`)
5. 选择设备型号进行测试

#### 推荐测试设备
- **iPhone SE (375×667)** - 小屏幕测试
- **iPhone 12 Pro (390×844)** - 现代iPhone
- **Pixel 5 (393×851)** - Android设备
- **iPad Air (820×1180)** - 平板测试
- **Galaxy S20 Ultra (412×915)** - 大屏Android

#### 高级调试功能
```javascript
// 在 Console 中测试移动端特性

// 检查触摸事件
console.log('Touch support:', 'ontouchstart' in window);

// 检查设备像素比
console.log('Device pixel ratio:', window.devicePixelRatio);

// 检查屏幕方向
console.log('Screen orientation:', screen.orientation?.type);

// 模拟触摸事件
function simulateTouch(element, eventType) {
    const touch = new Touch({
        identifier: Date.now(),
        target: element,
        clientX: element.offsetLeft + element.offsetWidth / 2,
        clientY: element.offsetTop + element.offsetHeight / 2,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
    });
    
    const touchEvent = new TouchEvent(eventType, {
        cancelable: true,
        bubbles: true,
        touches: [touch],
        targetTouches: [],
        changedTouches: [touch],
        shiftKey: true,
    });
    
    element.dispatchEvent(touchEvent);
}
```

### 3. Firefox 响应式设计模式

#### 基本步骤
1. 打开 Firefox 浏览器
2. 访问 http://localhost:8000/game.html
3. 按 `F12` 打开开发者工具
4. 点击响应式设计模式按钮 📱 (或按 `Ctrl+Shift+M`)
5. 选择设备或自定义尺寸

#### Firefox 独有功能
- **网络节流**: 模拟慢速网络
- **触摸模拟**: 更精确的触摸事件模拟
- **用户代理切换**: 测试不同浏览器识别

### 4. Safari 移动端调试 (macOS)

#### 基本步骤
1. 打开 Safari 浏览器
2. 访问 http://localhost:8000/game.html
3. 菜单栏选择「开发」>「进入响应式设计模式」
4. 选择 iOS 设备进行测试

## 移动端特性测试清单

### ✅ 基础功能测试
- [ ] 页面加载正常
- [ ] 视频播放功能
- [ ] 音频控制
- [ ] 触摸交互
- [ ] 按钮点击响应
- [ ] 滚动行为

### ✅ 响应式设计测试
- [ ] 不同屏幕尺寸适配
- [ ] 横屏/竖屏切换
- [ ] 字体大小适配
- [ ] 图片缩放正确
- [ ] 布局不重叠

### ✅ 性能测试
- [ ] 页面加载速度
- [ ] 动画流畅度
- [ ] 内存使用情况
- [ ] 网络请求优化

### ✅ 兼容性测试
- [ ] 不同浏览器内核
- [ ] 不同操作系统
- [ ] 不同设备像素比

## 常用调试技巧

### 1. 网络调试
```javascript
// 检查网络状态
navigator.onLine; // true/false

// 监听网络变化
window.addEventListener('online', () => console.log('网络已连接'));
window.addEventListener('offline', () => console.log('网络已断开'));
```

### 2. 触摸事件调试
```javascript
// 添加触摸事件监听
document.addEventListener('touchstart', (e) => {
    console.log('Touch start:', e.touches.length, 'fingers');
});

document.addEventListener('touchmove', (e) => {
    console.log('Touch move:', e.touches[0].clientX, e.touches[0].clientY);
});

document.addEventListener('touchend', (e) => {
    console.log('Touch end');
});
```

### 3. 设备信息获取
```javascript
// 获取设备信息
const deviceInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: screen.width,
    screenHeight: screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    touchSupport: 'ontouchstart' in window
};

console.table(deviceInfo);
```

### 4. 性能监控
```javascript
// 页面加载性能
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('页面加载时间:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
});

// 内存使用情况 (Chrome)
if ('memory' in performance) {
    console.log('内存使用:', performance.memory);
}
```

## 远程设备调试

### 1. 同网络设备访问

#### 获取本地 IP 地址
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# 或者使用
hostname -I
```

#### 移动设备访问
在移动设备浏览器中访问：
```
http://YOUR_LOCAL_IP:8000/game.html
```

### 2. Chrome 远程调试

#### Android 设备
1. 启用 USB 调试
2. 连接到电脑
3. Chrome 访问 `chrome://inspect`
4. 选择设备进行调试

#### iOS 设备 (需要 Safari)
1. 启用 Web 检查器
2. 连接到 Mac
3. Safari 菜单「开发」> 选择设备

## 测试自动化脚本

创建 `browser-test.js` 自动化测试脚本：

```javascript
// 移动端功能测试脚本
class MobileTestSuite {
    constructor() {
        this.results = [];
    }
    
    // 测试触摸事件
    async testTouchEvents() {
        const button = document.querySelector('.start-button');
        if (!button) {
            this.results.push({ test: 'Touch Events', status: 'FAIL', reason: 'Button not found' });
            return;
        }
        
        let touchTriggered = false;
        button.addEventListener('touchstart', () => touchTriggered = true);
        
        // 模拟触摸
        const touch = new Touch({
            identifier: 1,
            target: button,
            clientX: button.offsetLeft + 10,
            clientY: button.offsetTop + 10
        });
        
        const touchEvent = new TouchEvent('touchstart', {
            touches: [touch],
            changedTouches: [touch]
        });
        
        button.dispatchEvent(touchEvent);
        
        this.results.push({
            test: 'Touch Events',
            status: touchTriggered ? 'PASS' : 'FAIL'
        });
    }
    
    // 测试响应式设计
    testResponsiveDesign() {
        const viewportWidth = window.innerWidth;
        const isMobile = viewportWidth <= 768;
        
        this.results.push({
            test: 'Responsive Design',
            status: 'INFO',
            info: `Viewport: ${viewportWidth}px, Mobile: ${isMobile}`
        });
    }
    
    // 运行所有测试
    async runAllTests() {
        console.log('🧪 开始移动端测试...');
        
        await this.testTouchEvents();
        this.testResponsiveDesign();
        
        console.table(this.results);
        return this.results;
    }
}

// 使用方法
// const tester = new MobileTestSuite();
// tester.runAllTests();
```

## 常见问题解决

### 1. 触摸事件不响应
```css
/* 确保元素可以接收触摸事件 */
.interactive-element {
    touch-action: manipulation;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}
```

### 2. 视频播放问题
```javascript
// 移动端视频播放需要用户交互
const video = document.querySelector('video');
video.muted = true; // 静音可以自动播放
video.playsInline = true; // iOS 内联播放
```

### 3. 100vh 问题
```css
/* 避免移动端地址栏影响 */
.full-height {
    height: 100vh;
    height: 100dvh; /* 动态视口高度 */
}
```

## 推荐工作流程

1. **开发阶段**: 使用 Chrome DevTools 快速迭代
2. **测试阶段**: 多浏览器、多设备尺寸测试
3. **验证阶段**: 真实设备远程调试
4. **发布前**: 性能和兼容性最终检查

---

*浏览器移动端测试是最便捷的方案，建议优先使用此方法进行开发和测试。*