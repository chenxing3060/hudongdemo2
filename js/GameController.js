// GameController now uses dynamic imports to defeat aggressive caching.
class GameController {
    constructor() {
        // The constructor is now very simple, just kicking off the async initialization.
        this.initializeGame();
    }

    async initializeGame() {
        // 1. Dynamically import all modules with a cache-busting query string
        const version = 'v=' + Date.now(); // Use a timestamp for a guaranteed new version
        const [
            GameStateManagerModule,
            RouteManagerModule,
            SceneDataManagerModule,
            MusicManagerModule,
            UIManagerModule,
            ScenePlayerModule,
            AssetLoaderModule
        ] = await Promise.all([
            import(`./GameStateManager.js?${version}`),
            import(`./RouteManager.js?${version}`),
            import(`./SceneDataManager.js?${version}`),
            import(`./MusicManager.js?${version}`),
            import(`./UIManager.js?${version}`),
            import(`./ScenePlayer.js?${version}`),
            import(`./AssetLoader.js?${version}`)
        ]);

        // Extract the default exports from the loaded modules
        const GameStateManager = GameStateManagerModule.default;
        const RouteManager = RouteManagerModule.default;
        const SceneDataManager = SceneDataManagerModule.default;
        const MusicManager = MusicManagerModule.default;
        const UIManager = UIManagerModule.default;
        const ScenePlayer = ScenePlayerModule.default;
        const AssetLoader = AssetLoaderModule.default;

        // 2. Now that modules are loaded, initialize all managers
        this.stateManager = new GameStateManager();
        this.routeManager = new RouteManager();
        this.sceneDataManager = new SceneDataManager();
        this.musicManager = new MusicManager();
        this.uiManager = new UIManager({ musicManager: this.musicManager });
        this.assetLoader = new AssetLoader();
        
        // 3. Initialize the scene player with its dependencies
        this.scenePlayer = new ScenePlayer({
            uiManager: this.uiManager,
            stateManager: this.stateManager,
            sceneDataManager: this.sceneDataManager,
            routeManager: this.routeManager,
            assetLoader: this.assetLoader
        });
        
        // Set a global for debugging purposes
        window.gameController = this;
        
        // 4. Bind UI events to the correct handlers
        this.uiManager.bindEvents({
            onStartGame: () => this.startGame(),
            onShowAbout: () => this.showAbout(),
            onBackToMenu: () => this.uiManager.showStartMenu(),
            onNextDialogue: () => this.scenePlayer.nextDialogue(true), // 明确是手动调用
            onSkipVideo: () => this.scenePlayer.skipVideo(),
            onToggleAutoplay: () => this.toggleAutoplay()
        });

        // 5. Load the external scene data
        await this.sceneDataManager.loadScenes();

        // 6. Start the visual loading animation
        this.startInitialLoading();
    }

    // 切换自动播放状态
    toggleAutoplay() {
        const isAutoPlay = this.stateManager.toggleAutoPlay();
        this.uiManager.updateAutoplayIndicator(isAutoPlay);
        
        // 如果刚开启自动播放，则立即触发下一句
        if (isAutoPlay) {
            this.scenePlayer.nextDialogue(false); // 程序化调用
        }
    }

    // Method to start a new game
    startGame() {
        console.log('开始新游戏');
        this.stateManager.resetGame();
        this.stateManager.setState('ACT1');
        this.scenePlayer.playScene('dream_prologue_1_1');
    }
    
    // Placeholder for the "About" page
    showAbout() {
        console.log('显示关于页面');
        alert('关于页面正在施工中...');
    }

    // Logic for the initial loading animation
    startInitialLoading() {
        let progress = 0;
        const loadingStages = [
            { text: '正在初始化法典连接...', status: '现实稳定度检测中...', minProgress: 0 },
            { text: '正在同步认知参数...', status: '建立量子纠缠链路...', minProgress: 15 },
            { text: '正在加载故事原型库...', status: '扫描叙事碎片...', minProgress: 30 },
            { text: '正在构建认知圈境...', status: '符文阵列初始化中...', minProgress: 50 },
            { text: '正在校准现实锚点...', status: '蚀影体威胁评估中...', minProgress: 70 },
            { text: '正在激活万象行者协议...', status: '认知敏感度测试完成', minProgress: 85 },
            { text: '法典连接已建立', status: '系统就绪，欢迎行者', minProgress: 100 }
        ];
        let currentStage = 0;

        const updateProgress = () => {
            if (progress < 100) {
                progress += Math.random() * 8 + 2;
                if (progress > 100) progress = 100;

                if (currentStage < loadingStages.length - 1 && progress >= loadingStages[currentStage + 1].minProgress) {
                    currentStage++;
                }
                
                this.uiManager.updateLoadingAnimation(progress, loadingStages[currentStage].text, loadingStages[currentStage].status);
                setTimeout(updateProgress, 200);
            } else {
                setTimeout(() => this.finishInitialLoading(), 1500);
            }
        };
        
        setTimeout(updateProgress, 800);
    }
    
    // Logic to run after the loading animation finishes
    finishInitialLoading() {
        if (!this.sceneDataManager.scenesLoaded) {
            console.error("错误：加载动画完成，但场景数据尚未准备好！");
            this.uiManager.showLoadingError('关键数据加载失败。请检查浏览器开发者控制台获取详细错误信息，或尝试刷新页面。');
            return;
        }

        // 1. 隐藏加载进度条和状态文本
        this.uiManager.hideLoadingDetails();

        // 2. 显示“点击进入”提示
        this.uiManager.showEnterPrompt('连接已建立，点击进入法典世界');

        // 3. 将整个加载界面设为可点击区域
        const loadingScreen = this.uiManager.screens.initialLoading;
        if (loadingScreen) {
            loadingScreen.style.cursor = 'pointer'; // 将鼠标指针变为手型

            loadingScreen.addEventListener('click', () => {
                console.log("用户点击进入，开始播放音频并显示主菜单。");

                // a. 解锁音频
                this.musicManager.unmuteVideos();

                // b. 平滑过渡到主菜单
                loadingScreen.style.transition = 'opacity 0.8s ease-in-out';
                loadingScreen.style.opacity = '0';
                
                // c. 在淡出动画结束后，显示主菜单并隐藏加载界面
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    this.uiManager.showStartMenu();
                }, 800); // 时间应与CSS过渡时间匹配

            }, { once: true }); // 确保事件只触发一次
        }
    }
}

// Instantiate the controller to start the game.
// This runs automatically when the module is loaded by the browser.
new GameController();