import TransitionManager from './TransitionManager.js';

class UIManager {
    constructor({ musicManager }) {
        this.musicManager = musicManager;
        this.codexData = {}; // 用于存储名词解释数据
        this.initializeElements();
        this.textSpeed = 50; // 默认打字速度
        this.loadCodexData(); // 初始化时加载名词解释数据
        this.transitionManager = new TransitionManager();
    }

    async loadCodexData() {
        try {
            const response = await fetch('data/codex.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // 转换数据结构为便于查找的格式
            this.codexData = {};
            if (data.codex_entries) {
                data.codex_entries.forEach(entry => {
                    this.codexData[entry.id] = {
                        title: entry.title,
                        content: entry.description
                    };
                });
            }
            console.log('名词解释数据加载成功:', this.codexData);
        } catch (error) {
            console.error('加载名词解释数据失败:', error);
        }
    }

    initializeElements() {
        // 屏幕元素
        this.screens = {
            initialLoading: document.getElementById('initial-loading'),
            startMenu: document.getElementById('start-menu'),
            about: document.getElementById('about-screen'),
            game: document.getElementById('game-screen'),
            video: document.getElementById('video-player'),
            routeSelection: document.getElementById('route-selection'),
            saveMenu: document.getElementById('save-menu'),
            settings: document.getElementById('settings-menu'),
            gameMenu: document.getElementById('game-menu')
        };
        
        // 游戏界面元素
        this.gameElements = {
            background: document.getElementById('background'),
            dialogueContainer: document.getElementById('dialogue-box'),
            speakerName: document.getElementById('speaker-name'),
            dialogueText: document.getElementById('dialogue-text'),
            dialogueIndicator: document.getElementById('next-indicator'), // 更新ID
            choiceContainer: document.getElementById('choice-container'),
            videoPlayer: document.getElementById('video-player'),
            gameVideo: document.getElementById('game-video'),
            progressIndicator: document.getElementById('progress-indicator'),
            routeProgress: document.getElementById('route-progress'),
            progressFill: document.getElementById('progress-fill')
        };
        
        // 名词解释弹窗元素
        this.codexModal = {
            overlay: document.getElementById('codex-modal'),
            title: document.getElementById('codex-title'),
            content: document.getElementById('codex-content'),
            closeButton: document.getElementById('codex-close')
        };

        // 开始菜单元素
        this.startVideo = document.getElementById('start-video');
        this.gradientBg = document.getElementById('gradient-bg');
        
        // 加载界面元素
        this.loadingProgress = document.querySelector('.loading-progress');
        this.systemStatus = document.querySelector('.system-status');
        this.loadingFill = document.querySelector('.progress-fill');
        this.loadingText = document.querySelector('.loading-text');
        this.syncPercentage = document.querySelector('.sync-percentage');
        this.statusText = document.querySelector('.status-text');
        this.enterPrompt = document.getElementById('enter-prompt');
        this.enterPromptText = document.querySelector('.enter-prompt-text');
    }

    // 绑定UI事件，并连接到控制器提供的回调函数
    bindEvents(callbacks) {
        // 开始菜单按钮
        document.getElementById('start-game')?.addEventListener('click', callbacks.onStartGame);
        document.getElementById('about')?.addEventListener('click', () => this.showAboutScreen());
        
        // 游戏界面
        document.getElementById('back-to-menu')?.addEventListener('click', callbacks.onBackToMenu);
        
        // 智能图标点击事件 -> 切换自动播放状态
        this.gameElements.dialogueIndicator?.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡到下面的全屏点击
            callbacks.onToggleAutoplay();
        });
        
        // 游戏主屏幕点击事件 -> 手动进行下一句
        this.screens.game?.addEventListener('click', (e) => {
            // 如果点击的是名词解释，则显示弹窗
            if (e.target.classList.contains('codex-term')) {
                this.showCodexModal(e.target.dataset.term);
                return;
            }
            // 如果点击的是智能图标、选项按钮或顶部控制按钮，则不触发下一句
            if (e.target.closest('.next-indicator, .choice-button, .top-controls')) {
                return;
            }
            
            callbacks.onNextDialogue();
        });

        // 视频播放器
        document.getElementById('skip-video')?.addEventListener('click', callbacks.onSkipVideo);

        // 名词解释弹窗关闭事件
        this.codexModal.closeButton?.addEventListener('click', () => this.hideCodexModal());
        this.codexModal.overlay?.addEventListener('click', (e) => {
            if (e.target === this.codexModal.overlay) {
                this.hideCodexModal();
            }
        });
    }

    // 更新加载动画
    updateLoadingAnimation(progress, text, status) {
        if (this.loadingFill) this.loadingFill.style.width = progress + '%';
        if (this.syncPercentage) this.syncPercentage.textContent = Math.floor(progress) + '%';
        if (this.loadingText) this.loadingText.textContent = text;
        if (this.statusText) this.statusText.textContent = status;
    }

    // 隐藏所有屏幕
    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
                screen.style.display = 'none';
            }
        });
        this.stopAllBackgroundVideos();
    }
    
    // 显示特定屏幕
    showScreen(screenName) {
        this.hideAllScreens();
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            // 移除内联display样式，让CSS文件中的规则（如 flex）生效
            this.screens[screenName].style.display = '';
        }
    }

    // 隐藏加载进度并显示进入提示
    hideLoadingDetails() {
        if (this.loadingProgress) {
            this.loadingProgress.style.transition = 'opacity 0.5s ease-out';
            this.loadingProgress.style.opacity = '0';
        }
        if (this.systemStatus) {
            this.systemStatus.style.transition = 'opacity 0.5s ease-out';
            this.systemStatus.style.opacity = '0';
        }
    }

    // 显示进入提示
    showEnterPrompt(text) {
        if (this.enterPrompt && this.enterPromptText) {
            this.enterPromptText.textContent = text;
            this.enterPrompt.classList.remove('hidden');
            this.enterPrompt.style.opacity = '0';
            setTimeout(() => {
                if (this.enterPrompt) {
                    this.enterPrompt.style.transition = 'opacity 0.5s ease-in';
                    this.enterPrompt.style.opacity = '1';
                }
            }, 500); // 等待进度条淡出
        }
    }

    // 显示加载错误信息
    showLoadingError(message) {
        // 复用进入提示的UI来显示错误
        this.showEnterPrompt(message);
        // 可以添加一些特定的错误样式，比如改变颜色
        if (this.enterPrompt) {
            this.enterPrompt.classList.add('error');
        }
    }

    // 动态加载并显示“关于”页面
    async showAboutScreen() {
        this.showScreen('about'); // 先显示容器
        const aboutContainer = this.screens.about;
        aboutContainer.innerHTML = '<div class="loading-text">正在加载内容...</div>'; // 显示加载提示

        try {
            const response = await fetch('about.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            
            // 使用DOMParser解析HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 提取body内容和style内容
            const bodyContent = doc.body.innerHTML;
            const styleContent = doc.head.querySelector('style')?.innerHTML || '';

            // 将样式和内容一起注入
            aboutContainer.innerHTML = `
                <style>${styleContent}</style>
                ${bodyContent}
            `;

            // 动态为新加载的返回按钮绑定事件
            const backButton = aboutContainer.querySelector('.top-back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault(); // 阻止<a>标签的默认跳转行为
                    this.showStartMenu();
                });
            } else {
                console.warn('未在 about.html 中找到返回按钮 (.top-back-button)');
            }
        } catch (error) {
            console.error('加载 about.html 失败:', error);
            aboutContainer.innerHTML = `
                <div class="about-content" style="color: white; padding: 20px;">
                    <h1>加载失败</h1>
                    <p>无法加载“关于”页面内容。请检查文件是否存在或网络连接是否正常。</p>
                    <button id="back-from-error" class="menu-button">返回</button>
                </div>
            `;
            // 为错误页面中的返回按钮绑定事件
            aboutContainer.querySelector('#back-from-error')?.addEventListener('click', () => this.showStartMenu());
        }
    }

    // 显示开始菜单
    showStartMenu() {
        this.showScreen('startMenu');
        if (this.startVideo) {
            this.startVideo.currentTime = 0;
            // 移除强制静音，音频状态现在由MusicManager和用户交互决定
            this.startVideo.play().catch(e => {
                console.log('开始菜单视频播放失败:', e);
                this.showFallbackBackground();
            });
        }
    }
    
    // 显示备用背景
    showFallbackBackground() {
        if (this.startVideo) this.startVideo.style.display = 'none';
        if (this.gradientBg) this.gradientBg.style.display = 'block';
    }

    // 停止所有背景视频
    stopAllBackgroundVideos() {
        this.startVideo?.pause();
        this.gameElements.background?.querySelector('video')?.pause();
        this.gameElements.gameVideo?.pause();
    }

    // 设置游戏背景
    setVideoBackground(videoPath) {
        const backgroundElement = this.gameElements.background;
        if (!backgroundElement) return;

        const currentVideo = backgroundElement.querySelector('video');
        // 如果请求的是同一个视频，并且它已暂停，则重新播放
        if (currentVideo && currentVideo.src.endsWith(videoPath)) {
            if (currentVideo.paused) {
                currentVideo.play().catch(e => console.error('恢复视频播放失败:', e));
            }
            return;
        }
        
        // 清理旧的背景
        backgroundElement.innerHTML = '';
        backgroundElement.style.backgroundColor = 'transparent';
        
        const video = document.createElement('video');
        video.src = videoPath;
        video.loop = true;
        video.playsInline = true;
        // 使用 MusicManager 的静音状态
        video.muted = this.musicManager.getIsMuted();
        video.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1; opacity: 0; transition: opacity 0.5s;';
        
        // 将新视频添加到 MusicManager 进行统一管理
        this.musicManager.addVideo(video);

        // 监听 canplay 事件，确保视频已准备好播放
        video.addEventListener('canplay', () => {
            video.play()
                .then(() => {
                    video.style.opacity = '1'; // 播放成功后淡入
                })
                .catch(e => {
                    console.error('背景视频播放失败:', e);
                    backgroundElement.style.backgroundColor = '#000'; // 设置备用背景色
                });
        });

        // 监听视频加载错误
        video.addEventListener('error', (e) => {
            console.error('视频加载错误:', e);
            backgroundElement.style.backgroundColor = '#000';
        });

        backgroundElement.appendChild(video);
    }

    // 更新对话框内容
    updateDialogue(speaker, text, onComplete) {
        this.gameElements.dialogueContainer.style.display = 'block';
        this.hideIndicator(); // 在开始时明确隐藏
        this.gameElements.speakerName.textContent = speaker || '';
        
        const processedText = this.highlightCodexTerms(text);
        this.typewriterEffect(this.gameElements.dialogueText, processedText, onComplete);
    }

    // 显示选项
    displayChoices(choices, onChoiceSelected) {
        const container = this.gameElements.choiceContainer;
        container.style.display = 'block';
        container.innerHTML = '';

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                container.style.display = 'none';
                onChoiceSelected(choice, index);
            });
            container.appendChild(button);
        });
    }

    // 播放全屏视频
    playFullscreenVideo(videoPath, onEnded) {
        this.showScreen('video');
        const video = this.gameElements.gameVideo;
        if (video) {
            video.src = videoPath;
            video.onended = onEnded;
            video.play().catch(e => console.error('视频播放失败:', e));
        }
    }

    // 高亮文本中的名词解释
    highlightCodexTerms(text) {
        if (!this.codexData || Object.keys(this.codexData).length === 0) {
            return text;
        }
        
        const terms = Object.keys(this.codexData).join('|');
        const regex = new RegExp(`\\b(${terms})\\b`, 'g');
        
        return text.replace(regex, (match) => {
            return `<strong class="codex-term" data-term="${match}">${match}</strong>`;
        });
    }

    // 显示名词解释弹窗
    showCodexModal(term) {
        const termData = this.codexData[term];
        if (!termData || !this.codexModal.overlay) return;

        this.codexModal.title.textContent = termData.title;
        this.codexModal.content.textContent = termData.content;
        this.codexModal.overlay.classList.remove('hidden');
    }

    // 隐藏名词解释弹窗
    hideCodexModal() {
        if (this.codexModal.overlay) {
            this.codexModal.overlay.classList.add('hidden');
        }
    }

    // 打字机效果（支持特效标签和高亮标签）
    typewriterEffect(element, text, onComplete) {
        element.innerHTML = '';
        let i = 0;
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = text;
        const nodes = Array.from(tempContainer.childNodes);
        let nodeIndex = 0;
        let textIndex = 0;

        const type = () => {
            if (nodeIndex >= nodes.length) {
                clearInterval(intervalId);
                // 不再由打字机效果控制显示，交由ScenePlayer控制
                if (onComplete) onComplete();
                return;
            }

            const currentNode = nodes[nodeIndex];

            if (currentNode.nodeType === Node.TEXT_NODE) {
                if (textIndex < currentNode.textContent.length) {
                    element.innerHTML += currentNode.textContent[textIndex];
                    textIndex++;
                } else {
                    nodeIndex++;
                    textIndex = 0;
                }
            } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                // 对于HTML元素（如<strong>），一次性完整显示
                element.appendChild(currentNode.cloneNode(true));
                nodeIndex++;
            } else {
                nodeIndex++;
            }
        };

        const intervalId = setInterval(type, this.textSpeed);
    }

    // 更新自动播放状态的视觉指示器
    updateAutoplayIndicator(isAutoPlay) {
        document.body.classList.toggle('auto-play-active', isAutoPlay);
    }

    // 显示/隐藏播放指示器
    showIndicator() {
        this.gameElements.dialogueIndicator?.classList.remove('indicator-hidden');
    }

    hideIndicator() {
        this.gameElements.dialogueIndicator?.classList.add('indicator-hidden');
    }

    // 显示法典解锁提示
    showCodexUnlockToast(title) {
        const toast = document.createElement('div');
        toast.className = 'codex-toast';
        toast.innerHTML = `
            <span class="codex-toast-icon">📖</span>
            <span class="codex-toast-text">新法典已解锁: <strong>${title}</strong></span>
        `;
        
        document.body.appendChild(toast);

        // 动画效果
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // 4秒后自动移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }
}

export default UIManager;