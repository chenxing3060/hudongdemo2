// 游戏状态管理器
class GameStateManager {
    constructor() {
        this.currentState = 'COVER'; // COVER, START_MENU, MALE_PERFORMANCE, MEET_HEROINE, BRANCH_SELECTION, ROUTE_1, ROUTE_2, ROUTE_3, ROUTE_4, ENDING
        this.isMusicEnabled = true; // 音乐开关状态
        this.gameData = {
            playerName: '',
            heroineRelationship: 0,
            completedRoutes: [],
            currentRoute: null,
            routeProgress: {},
            choices: [],
            flags: {}
        };
        this.saveSlots = 5; // 支持5个存档位
    }

    // 状态转换
    setState(newState, data = {}) {
        console.log(`状态转换: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        
        // 触发状态变化事件
        this.onStateChange(newState, data);
    }

    // 状态变化回调
    onStateChange(state, data) {
        switch(state) {
            case 'MALE_PERFORMANCE':
                this.startMalePerformance(data);
                break;
            case 'MEET_HEROINE':
                this.startHeroineEncounter(data);
                break;
            case 'BRANCH_SELECTION':
                this.showBranchSelection(data);
                break;
            case 'ROUTE_1':
            case 'ROUTE_2':
            case 'ROUTE_3':
            case 'ROUTE_4':
                this.startRoute(state, data);
                break;
            case 'ENDING':
                this.showEnding(data);
                break;
        }
    }

    // 男主演出阶段
    startMalePerformance(data) {
        // 播放男主介绍视频/对话
        console.log('开始男主演出阶段');
    }

    // 与女主相遇阶段
    startHeroineEncounter(data) {
        // 播放相遇剧情
        console.log('开始与女主相遇阶段');
    }

    // 显示支线选择
    showBranchSelection(data) {
        // 显示四条支线任务选择界面
        console.log('显示支线选择界面');
    }

    // 开始特定路线
    startRoute(routeState, data) {
        const routeNumber = routeState.split('_')[1];
        this.gameData.currentRoute = routeNumber;
        console.log(`开始路线 ${routeNumber}`);
    }

    // 显示结局
    showEnding(data) {
        console.log('显示结局');
    }

    // 保存游戏
    saveGame(slot = 1) {
        const saveData = {
            state: this.currentState,
            gameData: this.gameData,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(`game_save_${slot}`, JSON.stringify(saveData));
        return true;
    }

    // 读取游戏
    loadGame(slot = 1) {
        const saveData = localStorage.getItem(`game_save_${slot}`);
        if (saveData) {
            const data = JSON.parse(saveData);
            this.currentState = data.state;
            this.gameData = data.gameData;
            return true;
        }
        return false;
    }

    // 获取存档信息
    getSaveInfo(slot) {
        const saveData = localStorage.getItem(`game_save_${slot}`);
        if (saveData) {
            const data = JSON.parse(saveData);
            return {
                exists: true,
                timestamp: data.timestamp,
                state: data.state,
                route: data.gameData.currentRoute
            };
        }
        return { exists: false };
    }
}

export default GameStateManager;