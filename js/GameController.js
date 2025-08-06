// 主游戏控制器
import GameStateManager from './GameStateManager.js';
import RouteManager from './RouteManager.js';
import SceneDataManager from './SceneDataManager.js';

class GameController {
    constructor() {
        this.stateManager = new GameStateManager();
        this.routeManager = new RouteManager();
        this.sceneManager = new SceneDataManager();
        this.transitionManager = new TransitionManager();
        
        this.currentScene = null;
        this.isPlaying = false;
        this.autoMode = false;
        this.textSpeed = 50;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeVideos();
        this.showCover();
    }

    initializeElements() {
        // 屏幕元素
        this.screens = {
            cover: document.getElementById('cover-screen'),
            startMenu: document.getElementById('start-menu'),
            game: document.getElementById('game-screen'),
            video: document.getElementById('video-player'),
            routeSelection: document.getElementById('route-selection'),
            saveMenu: document.getElementById('save-menu'),
            settings: document.getElementById('settings-menu'),
            gameMenu: document.getElementById('game-menu')
        };
        
        this.gameElements = {
            background: document.getElementById('game-background'),
            characterSprite: document.getElementById('character-sprite'),
            dialogueContainer: document.getElementById('dialogue-container'),
            speakerName: document.getElementById('speaker-name'),
            dialogueText: document.getElementById('dialogue-text'),
            choiceContainer: document.getElementById('choice-container'),
            videoPlayer: document.getElementById('video-player'),
            progressIndicator: document.getElementById('progress-indicator'),
            routeProgress: document.getElementById('route-progress'),
            progressFill: document.getElementById('progress-fill')
        };
        
        // 封面和开始菜单元素
        this.coverVideo = document.getElementById('cover-video');
        this.startVideo = document.getElementById('start-video');
        this.gradientBg = document.getElementById('gradient-bg');
        this.backToCoverBtn = document.getElementById('back-to-cover');
        
        this.musicControl = document.getElementById('music-toggle');
        this.musicIcon = document.getElementById('music-icon');
    }

    bindEvents() {
        // 封面点击事件
        if (this.screens.cover) {
            this.screens.cover.addEventListener('click', (e) => {
                if (e.target !== this.musicControl && !this.musicControl.contains(e.target)) {
                    this.playCoverVideo();
                    this.showStartMenu();
                }
            });
        }
        
        // 返回封面按钮
        if (this.backToCoverBtn) {
            this.backToCoverBtn.addEventListener('click', () => this.showCover());
        }
        
        // 新的返回按钮（游戏界面中的）
        const backToMenuBtn = document.getElementById('back-to-menu');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => this.showStartMenu());
        }
        
        // 音乐控制
        if (this.musicControl) {
            this.musicControl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMusic();
            });
        }
        
        // 开始菜单按钮事件
        const startGameBtn = document.getElementById('start-game');
        const aboutBtn = document.getElementById('about');
        
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => this.startGame());
        }
        
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => this.showAbout());
        }
        
        // 跳过视频按钮
        const skipVideoBtn = document.getElementById('skip-video');
        if (skipVideoBtn) {
            skipVideoBtn.addEventListener('click', () => this.skipVideo());
        }
        


        // 其他UI事件
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    initializeVideos() {
        // 初始化封面视频
        if (this.coverVideo) {
            this.coverVideo.addEventListener('loadstart', () => {
                console.log('封面视频开始加载');
            });
            
            this.coverVideo.addEventListener('canplay', () => {
                console.log('封面视频可以播放');
            });
            
            this.coverVideo.addEventListener('error', (e) => {
                console.log('封面视频加载失败:', e);
            });
            
            // 设置初始音频状态
            this.coverVideo.muted = true;
        }
        
        // 初始化开始菜单视频
        if (this.startVideo) {
            this.startVideo.addEventListener('loadstart', () => {
                console.log('开始菜单视频开始加载');
            });
            
            this.startVideo.addEventListener('error', (e) => {
                console.log('开始菜单视频加载失败:', e);
                this.showFallbackBackground();
            });
            
            // 设置初始音频状态
            this.startVideo.muted = true;
        }
        
        // 更新音乐按钮状态
        this.updateMusicButton();
    }
    
    playStartVideo() {
        if (!this.startVideo) return;
        
        const playPromise = this.startVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('开始菜单视频播放成功');
            }).catch(error => {
                console.log('开始菜单视频播放失败:', error);
                if (error.name === 'NotAllowedError') {
                    console.log('浏览器阻止自动播放，尝试静音播放');
                    this.startVideo.muted = true;
                    this.startVideo.play().then(() => {
                        console.log('静音播放成功');
                    }).catch(e => {
                        console.log('静音播放也失败:', e);
                        this.showFallbackBackground();
                    });
                } else {
                    this.showFallbackBackground();
                }
            });
        }
    }
    
    showFallbackBackground() {
        console.log('显示渐变背景作为备选方案');
        if (this.startVideo) {
            this.startVideo.style.display = 'none';
        }
        if (this.gradientBg) {
            this.gradientBg.style.display = 'block';
        }
    }
    
    toggleMusic() {
        this.stateManager.isMusicEnabled = !this.stateManager.isMusicEnabled;
        this.updateMusicButton();
        
        // 更新所有视频的音频状态
        if (this.coverVideo) {
            this.coverVideo.muted = !this.stateManager.isMusicEnabled;
        }
        if (this.startVideo) {
            this.startVideo.muted = !this.stateManager.isMusicEnabled;
        }
    }
    
    playCoverVideo() {
        if (this.coverVideo && this.coverVideo.paused) {
            this.coverVideo.play().catch(e => console.error('封面视频播放失败:', e));
        }
    }

    updateMusicButton() {
        if (!this.musicControl || !this.musicIcon) return;
        
        if (this.stateManager.isMusicEnabled) {
            this.musicIcon.textContent = '🔊';
            this.musicControl.classList.remove('muted');
        } else {
            this.musicIcon.textContent = '🔇';
            this.musicControl.classList.add('muted');
        }
    }

    // 开始新游戏
    async startGame() {
        console.log('开始新游戏');
        
        await this.transitionManager.performTransition(async () => {
            // 停止所有背景视频
            if (this.coverVideo) {
                this.coverVideo.pause();
            }
            if (this.startVideo) {
                this.startVideo.pause();
            }
            
            this.stateManager.setState('MALE_PERFORMANCE');
            this.showGameScreen();
            this.playScene('male_intro');
        }, 'start', 'game', 'beam');
    }

    // 继续游戏
    continueGame() {
        if (this.stateManager.loadGame()) {
            this.showGameScreen();
            this.resumeFromState();
        } else {
            alert('没有找到存档！');
        }
    }

    // 从当前状态恢复
    resumeFromState() {
        const state = this.stateManager.currentState;
        switch(state) {
            case 'MALE_PERFORMANCE':
                this.playScene('male_intro');
                break;
            case 'MEET_HEROINE':
                this.playScene('heroine_appears');
                break;
            case 'BRANCH_SELECTION':
                this.showRouteSelection();
                break;
            default:
                if (state.startsWith('ROUTE_')) {
                    const routeNum = state.split('_')[1];
                    this.continueRoute(routeNum);
                }
                break;
        }
    }

    // 播放场景
    playScene(sceneId) {
        console.log('尝试播放场景:', sceneId);
        const scene = this.sceneManager.getSceneById(sceneId);
        console.log('找到的场景:', scene);
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return;
        }

        this.currentScene = scene;

        switch(scene.type) {
            case 'dialogue':
                this.showDialogue(scene);
                break;
            case 'choice':
                this.showChoice(scene);
                break;
            case 'video':
                this.playVideo(scene);
                break;
            case 'ending':
                this.showEnding(scene);
                break;
            case 'return_cover':
                this.returnToCover();
                break;
        }
    }

    // 返回封面
    returnToCover() {
        console.log('返回封面');
        this.showCover();
    }

    // 显示对话
    async showDialogue(scene) {
        // 对于对话场景，使用更轻微的过渡效果
        if (this.currentScene && this.currentScene.type === 'dialogue') {
            // 如果当前已经在对话场景，使用快速淡入淡出
            await this.transitionManager.performTransition(() => {
                this.updateDialogueContent(scene);
            }, 'dialogue', 'dialogue', 'fade');
        } else {
            // 从其他场景切换到对话场景
            await this.transitionManager.performTransition(() => {
                this.hideAllScreens();
                this.screens.game.classList.remove('hidden');
                this.screens.game.style.display = 'block';
                this.updateDialogueContent(scene);
            }, 'video', 'game', 'fade');
        }
    }

    // 更新对话内容（提取为独立方法）
    updateDialogueContent(scene) {
        const dialogueContainer = this.gameElements.dialogueContainer;
        if (dialogueContainer) {
            dialogueContainer.style.display = 'block';
        }

        // 设置背景
        if (scene.background && this.gameElements.background) {
            this.gameElements.background.style.backgroundImage = `url(${scene.background})`;
        }

        // 设置角色
        if (scene.character && this.gameElements.characterSprite) {
            this.gameElements.characterSprite.src = scene.character;
            this.gameElements.characterSprite.style.display = 'block';
        } else if (this.gameElements.characterSprite) {
            this.gameElements.characterSprite.style.display = 'none';
        }

        // 设置对话
        if (this.gameElements.speakerName) {
            this.gameElements.speakerName.textContent = scene.speaker || '';
        }
        if (scene.text) {
            this.typewriterEffect(scene.text);
        }
    }

    // 显示选择
    showChoice(scene) {
        this.showDialogue(scene);
        const choiceContainer = this.gameElements.choiceContainer;
        if (choiceContainer) {
            choiceContainer.style.display = 'block';
            choiceContainer.innerHTML = '';

            scene.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'choice-button';
                button.textContent = choice.text;
                button.addEventListener('click', () => {
                    this.makeChoice(choice, index);
                });
                choiceContainer.appendChild(button);
            });
        }
    }

    // 做出选择
    makeChoice(choice, index) {
        // 记录选择
        this.stateManager.gameData.choices.push({
            sceneId: this.currentScene.id,
            choiceIndex: index,
            choiceText: choice.text
        });

        const choiceContainer = this.gameElements.choiceContainer;
        if (choiceContainer) {
            choiceContainer.style.display = 'none';
        }

        // 处理路线选择
        if (choice.route) {
            this.startRoute(choice.route);
        } else if (choice.next) {
            this.playScene(choice.next);
        }
    }

    // 开始路线
    startRoute(routeId) {
        this.stateManager.setState(`ROUTE_${routeId.slice(-1)}`);
        this.routeManager.startRoute(routeId, this.stateManager.gameData);
        this.playScene(`${routeId}_start`);
    }

    // 显示路线选择界面
    async showRouteSelection() {
        await this.transitionManager.performTransition(() => {
            this.hideAllScreens();
            this.screens.routeSelection.classList.remove('hidden');
            this.screens.routeSelection.style.display = 'block';
            
            const availableRoutes = this.routeManager.getAvailableRoutes(this.stateManager.gameData);
            this.renderRouteSelection(availableRoutes);
        }, 'game', 'route-selection', 'ripple');
    }

    // 渲染路线选择
    renderRouteSelection(routes) {
        const container = document.getElementById('route-list');
        container.innerHTML = '';

        routes.forEach(route => {
            const routeElement = document.createElement('div');
            routeElement.className = 'route-option';
            routeElement.innerHTML = `
                <h3>${route.name}</h3>
                <p>${route.description}</p>
                <button onclick="gameController.selectRoute('${route.id}')">选择此路线</button>
            `;
            container.appendChild(routeElement);
        });
    }

    // 选择路线
    selectRoute(routeId) {
        this.startRoute(routeId);
    }

    // 打字机效果
    typewriterEffect(text) {
        const dialogueText = this.gameElements.dialogueText;
        if (!dialogueText) return;
        
        dialogueText.textContent = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                dialogueText.textContent += text[index];
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, this.textSpeed);
    }

    // 下一段对话
    nextDialogue() {
        if (this.currentScene && this.currentScene.next) {
            this.playScene(this.currentScene.next);
        }
    }

    // 播放视频
    async playVideo(scene) {
        console.log('播放视频:', scene.video);
        console.log('视频屏幕元素:', this.screens.video);
        
        await this.transitionManager.performTransition(() => {
            this.hideAllScreens();
            this.screens.video.classList.remove('hidden');
            this.screens.video.style.display = 'block';
            
            const video = this.screens.video.querySelector('video');
            console.log('找到的视频元素:', video);
            if (video) {
                video.src = scene.video;
                console.log('设置视频源为:', video.src);
                
                // 清除之前的事件监听器
                video.onended = null;
                
                // 设置新的结束事件
                video.onended = () => {
                    console.log('视频播放结束，下一个场景:', scene.next);
                    if (scene.next) {
                        this.playScene(scene.next);
                    }
                };
                
                // 播放视频
                video.play().then(() => {
                    console.log('视频开始播放成功');
                }).catch(e => {
                    console.error('视频播放失败:', e);
                });
            } else {
                console.error('找不到视频元素');
                console.error('视频屏幕:', this.screens.video);
            }
        }, 'game', 'video', 'fade');
    }

    // 跳过视频
    skipVideo() {
        const video = this.screens.video.querySelector('video');
        if (video && this.currentScene) {
            console.log('跳过视频，进入下一个场景:', this.currentScene.next);
            video.pause();
            if (this.currentScene.next) {
                this.playScene(this.currentScene.next);
            }
        }
    }

    // 显示结局
    showEnding(scene) {
        this.showDialogue(scene);
        // 可以添加特殊的结局效果
    }



    // 显示界面方法
    async showCover() {
        await this.transitionManager.performTransition(() => {
            this.hideAllScreens();
            this.screens.cover.classList.remove('hidden');
            
            // 停止开始菜单视频
            if (this.startVideo) {
                this.startVideo.pause();
            }
            
            // 播放封面视频
            if (this.coverVideo) {
                this.coverVideo.play().catch(e => {
                    console.log('封面视频播放失败:', e);
                });
            }
        }, 'start', 'cover', 'cinematic');
    }

    async showStartMenu() {
        await this.transitionManager.performTransition(() => {
            this.hideAllScreens();
            this.screens.startMenu.classList.remove('hidden');
            
            // 停止封面视频
            if (this.coverVideo) {
                this.coverVideo.pause();
            }
            
            // 播放开始菜单视频
            if (this.startVideo) {
                this.playStartVideo();
            }
        }, 'cover', 'start', 'cinematic');
    }

    // 隐藏所有屏幕
    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
            }
        });
    }

    // 显示游戏菜单
    showGameMenu() {
        // 实现游戏内菜单
        const menuOptions = ['继续游戏', '保存游戏', '读取游戏', '返回标题'];
        // ... 菜单逻辑
    }

    // 切换自动模式
    toggleAutoMode() {
        this.autoMode = !this.autoMode;
        this.autoButton.textContent = this.autoMode ? '停止自动' : '自动模式';
    }

    // 显示保存菜单
    async showSaveMenu() {
        await this.transitionManager.performTransition(() => {
            this.hideAllScreens();
            this.screens.saveMenu.classList.remove('hidden');
            this.renderSaveSlots();
        }, 'game', 'save-menu', 'particle');
    }

    // 显示读取菜单
    async showLoadMenu() {
        await this.transitionManager.performTransition(() => {
            this.hideAllScreens();
            this.screens.saveMenu.classList.remove('hidden');
            this.renderSaveSlots(true);
        }, 'game', 'save-menu', 'particle');
    }

    // 渲染存档槽
    renderSaveSlots(isLoad = false) {
        const container = document.getElementById('save-slots');
        container.innerHTML = '';

        for (let i = 1; i <= this.stateManager.saveSlots; i++) {
            const saveInfo = this.stateManager.getSaveInfo(i);
            const slotElement = document.createElement('div');
            slotElement.className = 'save-slot';
            
            if (saveInfo.exists) {
                slotElement.innerHTML = `
                    <h4>存档 ${i}</h4>
                    <p>状态: ${saveInfo.state}</p>
                    <p>时间: ${new Date(saveInfo.timestamp).toLocaleString()}</p>
                    <button onclick="gameController.${isLoad ? 'loadFromSlot' : 'saveToSlot'}(${i})">
                        ${isLoad ? '读取' : '覆盖'}
                    </button>
                `;
            } else {
                slotElement.innerHTML = `
                    <h4>存档 ${i}</h4>
                    <p>空存档</p>
                    <button onclick="gameController.${isLoad ? 'loadFromSlot' : 'saveToSlot'}(${i})" 
                            ${isLoad ? 'disabled' : ''}>
                        ${isLoad ? '无存档' : '保存'}
                    </button>
                `;
            }
            
            container.appendChild(slotElement);
        }
    }

    // 保存到指定槽
    saveToSlot(slot) {
        if (this.stateManager.saveGame(slot)) {
            alert(`游戏已保存到存档 ${slot}！`);
            this.screens.saveMenu.classList.add('hidden');
        }
    }

    // 从指定槽读取
    loadFromSlot(slot) {
        if (this.stateManager.loadGame(slot)) {
            alert(`存档 ${slot} 已读取！`);
            this.screens.saveMenu.classList.add('hidden');
            this.resumeFromState();
        }
    }

    // 显示设置菜单
    async showSettings() {
        await this.transitionManager.performTransition(() => {
            this.hideAllScreens();
            this.screens.settings.classList.remove('hidden');
        }, 'game', 'settings-menu', 'fade');
    }

    // 显示关于页面
    showAbout() {
        window.open('about.html', '_blank');
    }

    // 显示游戏屏幕
    showGameScreen() {
        this.hideAllScreens();
        this.screens.game.classList.remove('hidden');
    }

    // 键盘事件处理
    handleKeydown(e) {
        switch(e.key) {
            case 'Enter':
            case ' ':
                if (this.currentScene && this.currentScene.type === 'dialogue') {
                    this.nextDialogue();
                }
                break;
            case 'Escape':
                this.showGameMenu();
                break;
        }
    }
}

// 全局游戏控制器实例
window.gameController = new GameController();

export default GameController;