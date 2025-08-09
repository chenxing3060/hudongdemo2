/**
 * 专业级页面过渡效果管理器
 * 提供多种电影级过渡动画，提升用户体验
 */
class TransitionManager {
    constructor() {
        this.overlay = document.getElementById('transition-overlay');
        this.textElement = document.getElementById('transition-text');
        this.isTransitioning = false;
        this.currentTransition = 'fade';
        
        // 过渡效果类型
        this.transitionTypes = {
            fade: 'fade-transition',
            cinematic: 'cinematic-transition',
            ripple: 'ripple-transition',
            particle: 'particle-transition',
            beam: 'beam-transition',
            glitch: 'glitch-transition'
        };
        
        // 过渡文本提示
        this.transitionTexts = {
            fade: '场景切换中...',
            cinematic: '进入游戏世界...',
            ripple: '时空涟漪展开...',
            particle: '粒子重组中...',
            beam: '光束扫描中...',
            glitch: '现实扭曲中...'
        };
        
        // 过渡持续时间（毫秒）
        this.transitionDurations = {
            fade: 800,
            cinematic: 1200,
            ripple: 1000,
            particle: 1000,
            beam: 1500,
            glitch: 800
        };
    }

    /**
     * 设置过渡效果类型
     * @param {string} type - 过渡效果类型
     */
    setTransitionType(type) {
        if (this.transitionTypes[type]) {
            this.currentTransition = type;
        }
    }

    /**
     * 根据场景智能选择过渡效果
     * @param {string} fromScene - 来源场景
     * @param {string} toScene - 目标场景
     */
    smartTransition(fromScene, toScene) {
        // 智能选择过渡效果
        if (fromScene === 'start' && toScene === 'game') {
            this.currentTransition = 'beam';
        } else if (toScene === 'video') {
            this.currentTransition = 'fade';
        } else if (toScene === 'route-selection') {
            this.currentTransition = 'ripple';
        } else if (toScene.includes('menu')) {
            this.currentTransition = 'particle';
        } else {
            this.currentTransition = 'fade';
        }
    }

    /**
     * 开始过渡效果
     * @param {string} transitionType - 过渡类型（可选）
     * @param {string} customText - 自定义文本（可选）
     * @returns {Promise} 过渡完成的Promise
     */
    async startTransition(transitionType = null, customText = null) {
        if (this.isTransitioning) {
            return Promise.resolve();
        }

        this.isTransitioning = true;
        
        // 设置过渡类型
        const type = transitionType || this.currentTransition;
        const transitionClass = this.transitionTypes[type];
        const duration = this.transitionDurations[type];
        
        // 清除之前的类
        Object.values(this.transitionTypes).forEach(cls => {
            this.overlay.classList.remove(cls);
        });
        
        // 设置新的过渡类和文本
        this.overlay.classList.add(transitionClass);
        this.textElement.textContent = customText || this.transitionTexts[type];
        
        // 触发过渡动画
        this.overlay.classList.add('active');
        
        // 添加音效（如果有的话）
        this.playTransitionSound(type);
        
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }

    /**
     * 结束过渡效果
     * @returns {Promise} 过渡结束的Promise
     */
    async endTransition() {
        if (!this.isTransitioning) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            this.overlay.classList.remove('active');
            
            setTimeout(() => {
                // 清除所有过渡类
                Object.values(this.transitionTypes).forEach(cls => {
                    this.overlay.classList.remove(cls);
                });
                this.isTransitioning = false;
                resolve();
            }, 300);
        });
    }

    /**
     * 完整的页面切换过渡
     * @param {Function} switchFunction - 页面切换函数
     * @param {string} fromScene - 来源场景
     * @param {string} toScene - 目标场景
     * @param {string} customTransition - 自定义过渡类型
     */
    async performTransition(switchFunction, fromScene = '', toScene = '', customTransition = null) {
        try {
            // 智能选择过渡效果
            if (!customTransition && fromScene && toScene) {
                this.smartTransition(fromScene, toScene);
            } else if (customTransition) {
                this.setTransitionType(customTransition);
            }

            // 开始过渡
            await this.startTransition();
            
            // 执行页面切换
            if (typeof switchFunction === 'function') {
                await switchFunction();
            }
            
            // 短暂延迟确保新页面加载完成
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // 结束过渡
            await this.endTransition();
            
        } catch (error) {
            console.error('过渡效果执行失败:', error);
            // 确保过渡状态被重置
            this.isTransitioning = false;
            this.overlay.classList.remove('active');
        }
    }

    /**
     * 播放过渡音效
     * @param {string} type - 过渡类型
     */
    playTransitionSound(type) {
        // 这里可以添加音效播放逻辑
        // 例如：根据不同的过渡类型播放不同的音效
        try {
            const audio = new Audio();
            switch (type) {
                case 'cinematic':
                    // audio.src = 'game/audio/sfx/cinematic-transition.mp3';
                    break;
                case 'beam':
                    // audio.src = 'game/audio/sfx/beam-transition.mp3';
                    break;
                case 'glitch':
                    // audio.src = 'game/audio/sfx/glitch-transition.mp3';
                    break;
                default:
                    // audio.src = 'game/audio/sfx/default-transition.mp3';
                    break;
            }
            // audio.volume = 0.3;
            // audio.play().catch(() => {}); // 忽略自动播放限制错误
        } catch (error) {
            // 音效播放失败不影响过渡效果
        }
    }

    /**
     * 获取当前是否正在过渡
     */
    get isActive() {
        return this.isTransitioning;
    }

    /**
     * 预设的场景过渡配置
     */
    static getSceneTransitions() {
        return {
            'start-to-game': 'beam',
            'game-to-video': 'fade',
            'video-to-game': 'fade',
            'game-to-route': 'ripple',
            'route-to-game': 'particle',
            'game-to-menu': 'particle',
            'menu-to-game': 'glitch',
            'any-to-save': 'fade',
            'any-to-settings': 'fade'
        };
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransitionManager;
}

// 全局实例
window.TransitionManager = TransitionManager;