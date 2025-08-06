# 校园奇遇记 - 互动视觉小说

## 项目概述
一个基于HTML5的互动视觉小说游戏，采用模块化架构设计，支持多分支剧情和视频播放。

## 技术栈
- **前端**: HTML5 + CSS3 + ES6 JavaScript
- **架构**: 模块化设计，MVC模式
- **视频格式**: MP4格式支持
- **部署**: 本地HTTP服务器

## 游戏特色
- 🎬 视频驱动的剧情展示
- 🎯 多分支选择系统
- 💾 游戏存档功能
- 🎵 音频控制系统
- 📱 响应式界面设计

## 核心架构

### 主要模块
1. **GameController.js** - 游戏主控制器
   - 管理游戏状态和界面切换
   - 处理用户交互和事件
   - 协调各个模块的工作

2. **SceneDataManager.js** - 场景数据管理器
   - 存储和管理所有剧情数据
   - 提供场景查询和获取功能
   - 支持分阶段的场景组织

3. **GameStateManager.js** - 游戏状态管理器
   - 管理游戏进度和存档
   - 处理路线选择和分支逻辑
   - 维护玩家选择历史

4. **RouteManager.js** - 路线管理器
   - 处理多分支剧情逻辑
   - 管理角色好感度系统
   - 计算和推荐路线

### 剧情分支设计
游戏包含多个阶段和分支：

1. **男主表演阶段** (`malePerformance`)
   - 开场介绍场景
   - 多个选择分支

2. **男主二阶段** (`maleSecond`)
   - 深入剧情发展
   - 视频场景展示

3. **女主初见阶段** (`heroineFirstMeet`)
   - 关键角色登场
   - 重要选择节点

4. **多重结局** 
   - EVA线结局
   - Saber线结局
   - D.Va线结局
   - Bad End结局

## 文件结构
```
hudongdemo/
├── game.html               # 游戏主页面
├── about.html              # 关于页面
├── style.css               # 主样式文件
├── css/
│   └── game-ui.css         # 游戏界面样式
├── js/                     # JavaScript模块
│   ├── GameController.js   # 游戏主控制器
│   ├── SceneDataManager.js # 场景数据管理
│   ├── GameStateManager.js # 游戏状态管理
│   └── RouteManager.js     # 路线管理
├── game/                   # 游戏资源目录
│   ├── videos/             # 视频文件
│   ├── images/             # 图片资源
│   │   ├── characters/     # 角色立绘
│   │   ├── backgrounds/    # 背景图
│   │   └── ui/             # 界面元素
│   └── audio/              # 音频资源
│       ├── bgm/            # 背景音乐
│       ├── sfx/            # 音效
│       └── voice/          # 语音
├── test.mp4                # 测试视频文件
├── opening.mp4             # 开场视频
└── start.mp4               # 启动视频
```

## 🚀 快速开始

### 环境要求
- 现代浏览器（支持ES6+）
- 本地HTTP服务器（推荐使用Python或Node.js）

### 启动游戏
1. 在项目根目录启动HTTP服务器：
   ```bash
   # 使用Python 3
   python -m http.server 8000
   
   # 或使用Node.js
   npx serve .
   ```

2. 在浏览器中访问：`http://localhost:8000/game.html`

### 游戏操作
- **封面页面**: 点击屏幕进入开始菜单
- **开始菜单**: 点击"开始游戏"开始新游戏
- **游戏中**: 点击对话框继续剧情，选择选项影响故事走向
- **视频播放**: 支持跳过功能

## 📁 数据结构

### 场景数据格式
```javascript
{
  id: "scene_id",           // 场景唯一标识
  type: "video|choice",     // 场景类型
  video: "filename.mp4",    // 视频文件（video类型）
  choices: [...],           // 选择选项（choice类型）
  nextScene: "next_id"      // 下一个场景ID
}
```

### 存档数据格式
```javascript
{
  currentScene: "scene_id", // 当前场景
  gamePhase: "phase_name",  // 当前游戏阶段
  choices: [...],           // 玩家选择历史
  timestamp: 1234567890     // 存档时间戳
}
```

## 🔧 开发状态

### 已完成功能 ✅
- [x] 模块化游戏架构
- [x] 场景数据管理系统
- [x] 视频播放功能
- [x] 多分支选择系统
- [x] 游戏状态管理
- [x] 存档/读档功能
- [x] 响应式界面设计
- [x] 音频控制系统

### 开发中功能 🚧
- [ ] 角色立绘显示
- [ ] 背景音乐播放
- [ ] 音效系统
- [ ] 更多剧情内容
- [ ] 成就系统

### 计划功能 📋
- [ ] 多语言支持
- [ ] 移动端优化
- [ ] 云存档功能
- [ ] 社交分享功能

## 🎮 立即体验
游戏已经可以运行！访问：http://localhost:8000/game.html

## 📝 更新日志

### v1.0.0 (当前版本)
- 实现基础游戏框架
- 支持视频播放和分支选择
- 完成存档系统
- 添加多个游戏阶段和结局

## 🤝 贡献指南
欢迎提交Issue和Pull Request来改进游戏！

## 📄 许可证
本项目仅供学习和演示使用。