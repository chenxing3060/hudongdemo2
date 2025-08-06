// 场景数据管理器
class SceneDataManager {
    constructor() {
        this.sceneData = this.initializeSceneData();
    }

    initializeSceneData() {
        return {
            // 男主演出阶段 - 使用test.mp4作为测试视频
            malePerformance: {
                intro: {
                    id: 'male_intro',
                    type: 'video',
                    video: 'test.mp4',
                    next: 'first_choice'
                }
            },

            // 第一个选择分支
            firstChoice: {
                choice: {
                    id: 'first_choice',
                    type: 'choice',
                    background: 'game/images/backgrounds/school_entrance.jpg',
                    speaker: '旁白',
                    text: '你现在想要做什么？',
                    choices: [
                        { 
                            text: '进入校园看看', 
                            next: 'heroine_first_meet'
                        },
                        { 
                            text: '回家睡觉', 
                            next: 'male_second_video'
                        }
                    ]
                }
            },

            // 男主二视频（回家睡觉分支）
            maleSecond: {
                video: {
                    id: 'male_second_video',
                    type: 'video',
                    video: 'test.mp4', // 使用test.mp4作为测试
                    next: 'heroine_first_meet'
                }
            },

            // 女主初见视频
            heroineFirstMeet: {
                video: {
                    id: 'heroine_first_meet',
                    type: 'video',
                    video: 'test.mp4', // 使用test.mp4作为测试
                    next: 'second_choice'
                }
            },

            // 第二个选择分支
            secondChoice: {
                choice: {
                    id: 'second_choice',
                    type: 'choice',
                    background: 'game/images/backgrounds/classroom.jpg',
                    speaker: '女主',
                    text: '你对我的第一印象是什么？',
                    choices: [
                        { 
                            text: '听说你是个怪人', 
                            next: 'dva_ending'
                        },
                        { 
                            text: '你在干什么', 
                            next: 'eva_ending'
                        },
                        { 
                            text: '我觉得你挺勇敢的', 
                            next: 'saber_ending'
                        },
                        { 
                            text: '拜拜了您内', 
                            next: 'bad_ending'
                        }
                    ]
                }
            },

            // 支线选择阶段
            branchSelection: {
                choice: {
                    id: 'branch_choice',
                    type: 'choice',
                    background: 'game/images/backgrounds/school_courtyard.jpg',
                    character: 'game/images/characters/heroine_hopeful.png',
                    question: '艾莉丝希望你能帮助她，你想从哪里开始？',
                    choices: [
                        { 
                            text: '帮助准备学园祭', 
                            route: 'route1', 
                            next: 'route1_start',
                            description: '学园祭即将到来，艾莉丝想要参与其中'
                        },
                        { 
                            text: '加入社团活动', 
                            route: 'route2', 
                            next: 'route2_start',
                            description: '通过社团活动更好地融入学校生活'
                        },
                        { 
                            text: '辅导学习功课', 
                            route: 'route3', 
                            next: 'route3_start',
                            description: '帮助艾莉丝适应地球的学习方式'
                        },
                        { 
                            text: '探索学校秘密', 
                            route: 'route4', 
                            next: 'route4_start',
                            description: '和艾莉丝一起发现学校隐藏的秘密'
                        }
                    ]
                }
            },

            // 路线1：学园祭准备
            route1: {
                start: {
                    id: 'route1_start',
                    type: 'dialogue',
                    background: 'game/images/backgrounds/festival_prep.jpg',
                    character: 'game/images/characters/heroine_excited.png',
                    speaker: '艾莉丝',
                    text: '学园祭！听起来很有趣！我们要准备什么呢？',
                    next: 'route1_planning'
                }
                // 更多场景...
            },

            // 路线2：社团活动
            route2: {
                start: {
                    id: 'route2_start',
                    type: 'dialogue',
                    background: 'game/images/backgrounds/club_room.jpg',
                    character: 'game/images/characters/heroine_curious.png',
                    speaker: '艾莉丝',
                    text: '社团活动？这是什么样的团体活动呢？',
                    next: 'route2_club_intro'
                }
                // 更多场景...
            },

            // 路线3：课业辅导
            route3: {
                start: {
                    id: 'route3_start',
                    type: 'dialogue',
                    background: 'game/images/backgrounds/library.jpg',
                    character: 'game/images/characters/heroine_studying.png',
                    speaker: '艾莉丝',
                    text: '地球的学习方式和我们星球很不一样呢...',
                    next: 'route3_study_begin'
                }
                // 更多场景...
            },

            // 路线4：秘密探索
            route4: {
                start: {
                    id: 'route4_start',
                    type: 'dialogue',
                    background: 'game/images/backgrounds/mysterious_corridor.jpg',
                    character: 'game/images/characters/heroine_mysterious.png',
                    speaker: '艾莉丝',
                    text: '我感觉到这所学校有一些...不寻常的能量...',
                    next: 'route4_investigation'
                }
                // 更多场景...
            },

            // 结局视频场景
            endings: {
                dva: {
                    id: 'dva_ending',
                    type: 'video',
                    video: 'test.mp4', // 使用test.mp4作为DVA视频测试
                    next: 'return_to_cover'
                },
                eva: {
                    id: 'eva_ending',
                    type: 'video',
                    video: 'test.mp4', // 使用test.mp4作为EVA视频测试
                    next: 'return_to_cover'
                },
                saber: {
                    id: 'saber_ending',
                    type: 'video',
                    video: 'test.mp4', // 使用test.mp4作为Saber视频测试
                    next: 'return_to_cover'
                },
                bad: {
                    id: 'bad_ending',
                    type: 'video',
                    video: 'test.mp4', // 使用test.mp4作为BadEnd视频测试
                    next: 'return_to_cover'
                },
                returnToCover: {
                    id: 'return_to_cover',
                    type: 'return_cover'
                }
            }
        };
    }

    // 获取特定阶段的场景
    getScenesByPhase(phase) {
        return this.sceneData[phase] || {};
    }

    // 获取特定场景
    getScene(phase, sceneKey) {
        const phaseData = this.sceneData[phase];
        return phaseData ? phaseData[sceneKey] : null;
    }

    // 获取场景通过ID
    getSceneById(sceneId) {
        // 遍历所有阶段查找场景
        for (const [phaseName, phase] of Object.entries(this.sceneData)) {
            for (const [key, sceneGroup] of Object.entries(phase)) {
                // 检查是否是直接的场景对象
                if (sceneGroup && sceneGroup.id === sceneId) {
                    return sceneGroup;
                }
                // 检查是否是嵌套的场景对象
                if (sceneGroup && typeof sceneGroup === 'object') {
                    for (const [subKey, scene] of Object.entries(sceneGroup)) {
                        if (scene && scene.id === sceneId) {
                            return scene;
                        }
                    }
                }
            }
        }
        console.error('未找到场景:', sceneId);
        return null;
    }
}

export default SceneDataManager;