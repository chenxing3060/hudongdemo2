class ScenePlayer {
    constructor({ uiManager, stateManager, sceneDataManager, routeManager, assetLoader }) {
        this.uiManager = uiManager;
        this.stateManager = stateManager;
        this.sceneDataManager = sceneDataManager;
        this.routeManager = routeManager;
        this.assetLoader = assetLoader;

        this.currentScene = null;
    }

    async playScene(sceneId) {
        const scene = this.sceneDataManager.getSceneById(sceneId);
        if (!scene) {
            console.error(`无法播放场景，因为找不到ID为 "${sceneId}" 的场景。`);
            return;
        }

        const isBackgroundChanging = !this.currentScene || this.currentScene.background !== scene.background;
        const needsTransition = scene.type !== 'video' && isBackgroundChanging;

        if (needsTransition) {
            await this.uiManager.transitionManager.show('fade');
        }

        this.currentScene = scene;
        console.log('播放场景:', sceneId);

        if (scene.unlocksCodex) {
            if (this.stateManager.unlockCodexEntry(scene.unlocksCodex)) {
                const codexEntry = this.sceneDataManager.getCodexEntryById(scene.unlocksCodex);
                if (codexEntry) {
                    this.uiManager.showCodexUnlockToast(codexEntry.title);
                }
            }
        }

        this.preloadNextSceneAssets(scene);

        switch (scene.type) {
            case 'narration':
            case 'dialogue':
                this.uiManager.showScreen('game');
                this.uiManager.setVideoBackground(scene.background);
                this.uiManager.updateDialogue(scene.speaker, scene.text, () => this.onDialogueComplete(scene));
                break;
            case 'choice':
                this.uiManager.showScreen('game');
                this.uiManager.setVideoBackground(scene.background);
                this.uiManager.updateDialogue(scene.speaker, scene.text);
                this.uiManager.displayChoices(scene.choices, (choice, index) => this.makeChoice(choice, index));
                break;
            case 'video':
                this.uiManager.playFullscreenVideo(scene.video, () => {
                    if (scene.next) this.playScene(scene.next);
                });
                return; 
            case 'ending':
                this.uiManager.showScreen('game');
                this.uiManager.setVideoBackground(scene.background);
                this.uiManager.updateDialogue(scene.speaker, scene.text);
                break;
            case 'redirect':
                // 处理页面重定向
                if (scene.url) {
                    window.location.href = scene.url;
                } else {
                    console.error('重定向场景缺少URL:', scene);
                }
                return;
            default:
                console.error('未知场景类型:', scene.type);
        }

        if (needsTransition) {
            this.uiManager.transitionManager.hide('fade');
        }
    }

    makeChoice(choice, index) {
        this.stateManager.gameData.choices.push({
            sceneId: this.currentScene.id,
            choiceIndex: index,
            choiceText: choice.text
        });

        if (choice.route) {
            this.startRoute(choice.route);
        } else if (choice.next) {
            this.playScene(choice.next);
        }
    }

    startRoute(routeId) {
        this.stateManager.setState(`ROUTE_${routeId.slice(-1)}`);
        this.routeManager.startRoute(routeId, this.stateManager.gameData);
        this.playScene(`${routeId}_start`);
    }

    onDialogueComplete(scene) {
        // 如果场景自带自动前进，则遵循场景设定
        if (scene.next && scene.autoAdvance === true) {
            setTimeout(() => this.playScene(scene.next), 3000); // 稍作停留后自动播放
            return;
        }

        // 如果用户开启了自动播放模式
        if (this.stateManager.isAutoPlay && scene.next) {
            const video = this.uiManager.getCurrentBackgroundVideo();

            // 检查是否有正在播放的背景视频
            if (video && !video.paused && !video.ended) {
                // 如果视频正在播放，则等待其结束后再继续
                video.onended = () => {
                    // 清除事件监听器，避免重复触发
                    video.onended = null; 
                    this.playScene(scene.next);
                };
            } else {
                // 如果没有视频或视频已结束，则增加短暂延迟后继续
                setTimeout(() => this.playScene(scene.next), 1000);
            }
            return;
        }
        
        // 如果不自动前进，则显示指示器，等待玩家操作
        if (scene.next) {
            this.uiManager.showIndicator();
        }
    }

    preloadNextSceneAssets(currentScene) {
        // 预加载直接的下一个场景
        if (currentScene.next) {
            const nextScene = this.sceneDataManager.getSceneById(currentScene.next);
            this.assetLoader.preloadAssetsForScene(nextScene);
        }

        // 预加载所有选项指向的场景
        if (currentScene.choices) {
            currentScene.choices.forEach(choice => {
                if (choice.next) {
                    const choiceScene = this.sceneDataManager.getSceneById(choice.next);
                    this.assetLoader.preloadAssetsForScene(choiceScene);
                }
            });
        }
    }

    nextDialogue(isManual = true) {
        // 如果是玩家手动点击，并且自动播放已开启，则屏蔽该次点击
        if (isManual && this.stateManager.isAutoPlay) {
            console.log('手动播放被自动播放模式阻止。');
            return;
        }

        if (!this.currentScene) return;

        // 确保有下一场，并且该场景不是自带的自动前进类型（防止意外跳过）
        if (this.currentScene.next && this.currentScene.autoAdvance !== true) {
            this.playScene(this.currentScene.next);
        }
    }

    skipVideo() {
        if (this.currentScene && this.currentScene.next) {
            this.uiManager.stopAllBackgroundVideos(); // 停止视频播放
            this.playScene(this.currentScene.next);
        }
    }
}

// ScenePlayer类已定义，无需export
