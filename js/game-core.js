// ====================== 弹窗守护器 ======================
const ModalGuard = {
    // 检查当前是否有弹窗显示
    isAnyModalVisible: function () {
        return ['choiceModal', 'resultModal', 'infoModal', 'xiZhaoModal', 'playerSelectModal', 'eventModal'].some(
            (id) => {
                const modal = document.getElementById(id);
                return modal && modal.style.display === 'flex' && modal.innerHTML !== '';
            }
        );
    },

    // 修复状态不一致
    fixState: function (gameState) {
        const hasModal = this.isAnyModalVisible();
        // ===== 新增：安全判断 =====
        if (!gameState) {
            console.log('ModalGuard: gameState 不存在，跳过');
            return false;
        }
        // ===== 结束 =====
        if (!hasModal && gameState.isEventActive) {
            console.log('🔧 修复：无弹窗但已锁定 → 解锁');
            gameState.isEventActive = false;
            return true;
        }

        if (hasModal && !gameState.isEventActive) {
            console.log('🔧 修复：有弹窗但未锁定 → 锁定');
            gameState.isEventActive = true;
            return true;
        }

        return false;
    },
};

// ====================== 游戏核心对象 ======================
const Game = {
    // ====================== 游戏状态 ======================
    state: {
        gameStarted: false,
        gameOver: false,
        playerName: '',
        teamName: '',

        // 创始人属性
        spirit: 0,
        skill: 0,
        relation: 0,

        // 球队属性
        mood: 0,
        teamLevel: 0,

        // 时间和行动
        currentDate: new Date(2024, 2, 8),
        weekdayActionsLeft: 5,
        isWeekend: false,
        hasBookedFriendlyMatch: false,
        bookedThisWeek: false,
        actionCount: 0,
        talkToOtherTeamCount: 0,

        // 训练和随机事件
        trainPlanCountThisWeek: 0,
        randomEventCountThisWeek: 0,
        maxRandomEventPerWeek: 2,
        daysSinceLastEvent: 999,
        isEventActive: false,

        // 招募系统
        lastRecruitTime: null,
        spiritDoubleTime: null,
        recruitedPlayersHistory: {},
        RECRUIT_COOLDOWN: 45,
        BEST_FRIENDS: ['林桃', '江蓠'],
        MAX_RELATIONSHIPS_PER_PLAYER: 5,
        RELATIONSHIP_WEIGHT: {
            挚友: 100,
            疏远: 90,
            师徒: 80,
            竞争: 60,
            信任: 40,
            普通: 20,
        },
        isBestFriendsEvent: false,

        // 赛季系统
        seasonStartDate: new Date(2024, 2, 8),
        seasonMatchCount: 0,
        seasonWinCount: 0,
        seasonJoinCount: 0,
        seasonLeaveCount: 0,

        maxPlayers: 0, // 历史最多球员数
        startDate: null, // 游戏开始日期（用于计算存活天数）

        // 比赛历史
        matchHistory: [],

        // 友谊赛对手池
        matchOpponents: ['少女队', '同基队', '橘几队'],

        // 约友谊赛失败文案池
        bookFailMessages: [
            '对方球队人数不足，凑不齐9个人。记得和其他球队多交流哦',
            '对手本周已经有安排了。平时要多和其他球队交流',
            '本周没有比赛场地了',
            '对方队长出差中，没人对接。要多和其他队长联系啊！',
            '天气不太好，对方建议改期。要和其他球队多教练啊',
            '对手正在备战其他比赛。别忘了要多和其他球队交流。',
            '联系了三个队，时间都对不上',
        ],

        weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

        // 曦照女子棒球赛
        XIZHAO_STATUS: {
            NOT_STARTED: 0,
            DAY1: 1,
            DAY2: 2,
            DAY3: 3,
            FINISHED: 4,
        },

        hasXiZhaoEventThisYear: false,
        willJoinXiZhao: false,
        xiZhaoInProgress: false,
        xiZhaoStatus: 0,
        xiZhaoMatches: [],
        xiZhaoOpponents: ['少女队', '同基队', '橘几队'],

        // 全国大赛状态
        national: {
            canJoin: false, // 是否有资格参加（曦照赛前三名）
            inProgress: false, // 是否进行中
            day: 0, // 当前比赛日 (1-5)
            matches: [], // 比赛记录
            opponents: [
                { name: '上海正大凤队', color: '#E83F6F' },
                { name: '厦门海妖队', color: '#2C9A9E' },
                { name: '福州女侠队', color: '#F4A261' },
                { name: '深圳红袜队', color: '#E76F51' },
                { name: '长沙旺囡队', color: '#9C89B8' },
            ],
            rewards: {
                spirit: 0,
                relation: 0,
            },
        },

        // 在 state 对象中，与曦照赛和全国大赛放在一起
        countdown: {
            type: null, // 'xizhao' 或 'national'
            targetDate: null, // 目标日期
            daysLeft: 0, // 剩余天数
        },
        // 球员列表
        playerList: [],
        recruitedNames: new Set(),
        recruitedOriginalNames: new Set(),
        tempSelectedPlayerId: null,

        // 初始球员
        initPlayerNames: ['小马', '霏霏', '老郭', '阿柏', '五零', '阿木', '三习', '之之', '贝尔'],

        // 警告标志
        skillWarningShown: false,
        skillLowEffectActive: false,
        teamLevelWarningShown: false,
        teamLevelLowEffectActive: false,
        relationWarningShown: false,
        playerWarningShown: new Set(),
        moodWarningShown: false,
        hasShownLargeTeamThresholdAlert: false,

        // 随机事件冷却
        randomEventCooldown: new Map(),

        eventQueue: [], // 事件队列
        processingQueue: false, // 是否正在处理队列

        // 关系历史
        relationshipHistory: [],
        MAX_HISTORY_ITEMS: 100,

        // 离队球员历史
        departedPlayersHistory: [],

        // 小团体
        factions: [],

        // 资源冲突
        recentConflict: false,

        // 精力值警告
        spiritWarningShown: {
            mild: false,
            severe: false,
        },

        // 训练选中的球员
        selectedTrainPlayers: new Set(),
    },

    // ====================== 工具函数 ======================
    checkIfWeekend: function () {
        let d = this.state.currentDate.getDay();
        return d === 0 || d === 6;
    },

    randomDelta: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // ====================== 事件队列系统 ======================
    queueEvent: function (type, ...args) {
        console.log(`📋 加入队列: ${type}`, args);
        this.state.eventQueue.push({ type, args, timestamp: Date.now() });
        this.processEventQueue();
    },

    processEventQueue: function () {
        // 如果正在处理中，或队列为空，或已有活动弹窗，则返回
        if (this.state.processingQueue) {
            console.log('⏳ 正在处理队列，等待中');
            return;
        }
        if (this.state.eventQueue.length === 0) {
            console.log('📭 队列为空');
            return;
        }
        if (this.state.isEventActive) {
            console.log('⏸️ 有活动弹窗，等待关闭');
            return;
        }

        console.log(`🔄 开始处理队列，剩余${this.state.eventQueue.length}个事件`);
        this.state.processingQueue = true;
        let nextEvent = this.state.eventQueue.shift();

        // 根据类型显示不同弹窗
        switch (nextEvent.type) {
            case 'deadFriend':
                UI.showInfoModal('💕 新的死党', nextEvent.args[0], {
                    onClose: () => this.onModalClose(),
                });
                break;
            case 'faction':
                UI.showInfoModal('🤝 小团体诞生', nextEvent.args[0], {
                    onClose: () => this.onModalClose(),
                });
                break;
            case 'factionJoin':
                UI.showInfoModal('👋 新成员加入', nextEvent.args[0], {
                    onClose: () => this.onModalClose(),
                });
                break;
            case 'factionMerge':
                UI.showInfoModal('🔄 小团体合并', nextEvent.args[0], {
                    onClose: () => this.onModalClose(),
                });
                break;
            default:
                console.warn('未知的事件类型:', nextEvent.type);
                this.state.processingQueue = false;
                this.processEventQueue();
        }
    },

    onModalClose: function () {
        console.log('✅ 弹窗关闭，继续处理队列');
        this.state.processingQueue = false;
        // 延迟一点点再处理，避免状态未完全更新
        setTimeout(() => {
            this.processEventQueue();
        }, 50);
    },

    formatDate: function (date) {
        let y = date.getFullYear();
        let m = String(date.getMonth() + 1).padStart(2, '0');
        let d = String(date.getDate()).padStart(2, '0');
        let w = this.state.weekdays[date.getDay()];
        return `${y}-${m}-${d} (${w})`;
    },

    formatShortDate: function (dateStr) {
        // 如果已经是 YYYY-MM-DD 格式
        if (dateStr.includes('-')) {
            // 去掉可能的时间部分
            let cleanDate = dateStr.split(' ')[0];
            let parts = cleanDate.split('-');
            if (parts.length === 3) {
                return `${parts[1]}-${parts[2]}`;
            }
        }
        return dateStr;
    },

    getUniquePlayerName: function (baseName) {
        if (!this.state.recruitedNames.has(baseName)) return baseName;
        let alternatives = ['小' + baseName, '阿' + baseName, baseName + '酱', baseName + '桑'];
        for (let alt of alternatives) {
            if (!this.state.recruitedNames.has(alt)) return alt;
        }
        let suffix = 1;
        while (this.state.recruitedNames.has(baseName + suffix)) suffix++;
        return baseName + suffix;
    },

    applySpiritChange: function (baseDelta) {
        if (!this.state.gameStarted) return baseDelta;
        let finalDelta = baseDelta;
        if (baseDelta < 0 && this.state.playerList.length >= 19) {
            finalDelta = baseDelta * 2;
            if (!this.state.hasShownLargeTeamThresholdAlert && !this.state.isEventActive && !this.state.gameOver) {
                this.state.hasShownLargeTeamThresholdAlert = true;
                setTimeout(() => {
                    if (this.state.gameStarted && !this.state.gameOver && this.state.playerList.length >= 19) {
                        UI.showEventModal(
                            '🧘‍♀️ 精力管理警报',
                            `球队人数已达到 ${this.state.playerList.length} 人，此后所有消耗精神力的行动都会翻倍。`,
                            [{ text: '明白了', run: function () {} }]
                        );
                    }
                }, 100);
            }
        }
        return finalDelta;
    },

    getAveragePlayerSkill: function () {
        if (this.state.playerList.length === 0) return 0;
        return this.state.playerList.reduce((sum, p) => sum + p.skill, 0) / this.state.playerList.length;
    },

    // ====================== 根据关系重新计算队内气氛 ======================
    updateMoodFromRelationships: function () {
        if (this.state.playerList.length < 2) {
            this.state.mood = 50;
            return;
        }

        let totalPairs = 0;
        let positiveScore = 0;
        let negativeScore = 0;

        // 遍历所有两人关系
        for (let i = 0; i < this.state.playerList.length; i++) {
            for (let j = i + 1; j < this.state.playerList.length; j++) {
                let p1 = this.state.playerList[i];
                let p2 = this.state.playerList[j];
                let relValue = this.getRelationshipValue(p1, p2);

                totalPairs++;

                // 根据关系值给分
                if (relValue >= 61) positiveScore += 3; // 死党 +3
                else if (relValue >= 30) positiveScore += 1; // 朋友 +1
                else if (relValue <= -60) negativeScore += 3; // 仇敌 -3
                else if (relValue <= -30) negativeScore += 1; // 竞争 -1
                // 普通关系（-29~29）不加分也不减分
            }
        }

        // 基础分50，加上正负分
        let mood = 50 + positiveScore * 2 - negativeScore * 2;

        // 小团体影响：每个小团体成员 +1
        let factions = this.getActiveFactions();
        factions.forEach((faction) => {
            mood += faction.members.length;
        });

        // 小团体之间的仇敌关系 -2/对
        for (let i = 0; i < factions.length; i++) {
            for (let j = i + 1; j < factions.length; j++) {
                let f1 = factions[i];
                let f2 = factions[j];

                let hasEnmity = false;
                f1.members.forEach((m1) => {
                    f2.members.forEach((m2) => {
                        if (this.getRelationshipValue(m1, m2) <= -60) {
                            hasEnmity = true;
                        }
                    });
                });

                if (hasEnmity) mood -= 2;
            }
        }

        // 限制在0-100之间
        this.state.mood = Math.max(0, Math.min(100, Math.round(mood)));
    },

    // ====================== 更新球队实力 ======================
    updateTeamLevel: function () {
        // 获取所有成员的球技（球员 + 创始人）
        let allMembers = [];
        // 添加球员
        if (this.state.playerList.length > 0) {
            allMembers = [...this.state.playerList];
        }

        // 添加创始人（如果游戏已开始）
        if (this.state.gameStarted && this.state.playerName) {
            allMembers.push({
                skill: this.state.skill,
                name: this.state.playerName,
                isFounder: true,
            });
        }

        // 如果没有成员，球队实力为0
        if (allMembers.length === 0) {
            this.state.teamLevel = 0;
            return;
        }

        // 计算所有成员的平均球技
        let total = allMembers.reduce((sum, member) => sum + member.skill, 0);
        this.state.teamLevel = Math.round(total / allMembers.length);

        // 确保在0-100范围内
        this.state.teamLevel = Math.max(0, Math.min(100, this.state.teamLevel));

        // 调试日志（可注释掉）
        // console.log(`球队实力计算：创始人球技 ${this.state.skill}，球员平均 ${this.state.playerList.length > 0 ? Math.round(this.state.playerList.reduce((sum,p)=>sum+p.skill,0)/this.state.playerList.length) : 0}，综合 ${this.state.teamLevel}`);
    },

    calculateWinRate: function () {
        // 气氛占30%，球队实力占70%（球队实力已包含创始人）
        let baseRate = (this.state.mood * 0.3 + this.state.teamLevel * 0.7) / 100;
        return Math.min(0.7, baseRate);
    },

    // ====================== 关系系统 ======================
    getRelationshipValue: function (p1, p2) {
        if (!p1 || !p2) return 0;
        return p1.relationships?.[p2.id]?.value || 0;
    },

    setRelationshipValue: function (p1, p2, value) {
        value = Math.max(-100, Math.min(100, value));

        if (!p1.relationships) p1.relationships = {};
        if (!p2.relationships) p2.relationships = {};

        p1.relationships[p2.id] = { value: value };
        p2.relationships[p1.id] = { value: value };
    },

    modifyRelationship: function (p1, p2, delta) {
        let current = this.getRelationshipValue(p1, p2);
        let newValue = current + delta;
        this.setRelationshipValue(p1, p2, newValue);

        this.addRelationshipHistory(p1, p2, delta, current, newValue);

        // 检查是否成为死党
        if (newValue >= 61 && current < 61) {
            UI.addLog(`💕 ${p1.name}和${p2.name}成为死党！`, {});

            // ✅ 使用队列系统，而不是直接显示弹窗
            this.queueEvent('deadFriend', `${p1.name}和${p2.name}成为了死党！她们以后一起训练效果会更好。`);

            // 查找所有通过死党关系连通的人
            let connectedGroup = this.findAllConnectedBestFriends(p1);

            // 如果连通组有至少3个人，形成/合并小团体
            if (connectedGroup.length >= 3) {
                this.formOrMergeFaction(connectedGroup);
            }

            UI.renderFactionsList();
        }

        UI.renderRelationshipNetwork();
        return newValue;
    },

    addRelationshipHistory: function (p1, p2, delta, oldValue, newValue) {
        let record = {
            date: this.formatDate(this.state.currentDate),
            p1Id: p1.id,
            p1Name: p1.name,
            p2Id: p2.id,
            p2Name: p2.name,
            delta: delta,
            oldValue: oldValue,
            newValue: newValue,
            timestamp: Date.now(),
        };

        this.state.relationshipHistory.unshift(record);

        if (this.state.relationshipHistory.length > this.state.MAX_HISTORY_ITEMS) {
            this.state.relationshipHistory.pop();
        }
    },

    encourageTeam: function () {
        console.log('encourageTeam 被调用');

        let ds = this.applySpiritChange(-this.randomDelta(15, 25));
        console.log('精神力变化 ds =', ds);

        let dr = this.randomDelta(5, 10);

        this.state.spirit += ds;
        this.state.relation += dr;

        console.log('当前精神力 =', this.state.spirit);

        // 所有球员之间关系 +1~2
        this.encourageTeamRelationships();

        // 所有球员忠诚度 +3~8
        this.batchUpdatePlayers(this.state.playerList, () => this.randomDelta(3, 8), null);

        // 重新计算气氛
        this.updateMoodFromRelationships();

        UI.showFloat('spirit', ds);
        UI.showFloat('relation', dr);

        UI.addLog('📣 队内公开鼓励', {
            spirit: ds,
            relation: dr,
        });

        console.log('准备调用 finishAction');
        this.finishAction();
    },

    // 一起训练：两人关系 +3~6
    trainTogether: function (p1, p2) {
        console.log('【调试1】trainTogether 被调用', p1.name, p2.name);

        let delta = this.randomDelta(3, 6);
        console.log('【调试2】随机增量 delta =', delta);

        let current = this.getRelationshipValue(p1, p2);
        console.log('【调试3】当前关系值 =', current);

        if (current >= 61) {
            delta += this.randomDelta(1, 2);
            console.log('【调试4】死党加成后 delta =', delta);
        }

        let newValue = this.modifyRelationship(p1, p2, delta);
        console.log('【调试5】新关系值 =', newValue);

        console.log('【调试6】准备调用 highlightRelationshipChange，delta =', delta);
        UI.highlightRelationshipChange(p1, p2, delta);
        console.log('【调试7】highlightRelationshipChange 调用完成');

        if (current < 61 && newValue >= 61) {
            UI.showEventModal('💕 新的死党', `${p1.name}和${p2.name}的关系越来越好，现在已经成了无话不说的死党！`, [
                { text: '太好啦', run: function () {} },
            ]);
        }

        if (current < 0 && newValue >= 0) {
            UI.addLog(`😌 ${p1.name}和${p2.name}的关系有所缓和`, {});
        }

        UI.renderRelationshipNetwork();
        return delta;
    },

    // 个别沟通：被沟通球员与所有人的关系 +3~7
    individualTalk: function (player) {
        let increase = this.randomDelta(3, 7);
        let count = 0;

        this.state.playerList.forEach((other) => {
            if (other.id === player.id) return;

            let current = this.getRelationshipValue(player, other);
            let newValue = this.modifyRelationship(player, other, increase);
            count++;

            UI.highlightRelationshipChange(player, other, increase);

            if (current < 61 && newValue >= 61) {
                UI.showEventModal(
                    '💕 新的死党',
                    `${player.name}和${other.name}的关系越来越好，现在已经成了无话不说的死党！`,
                    [{ text: '太好啦', run: function () {} }]
                );
            }

            if (current < 0 && newValue >= 0) {
                UI.addLog(`😌 ${player.name}和${other.name}的关系有所缓和`, {});
            }
        });

        UI.addLog(`💬 ${player.name}与${count}位队友关系+${increase}`, {});
        UI.renderRelationshipNetwork();
        return increase;
    },

    // 比赛胜利：所有关系 +1~3
    matchVictoryRelationships: function () {
        let totalIncrease = 0;

        for (let i = 0; i < this.state.playerList.length; i++) {
            for (let j = i + 1; j < this.state.playerList.length; j++) {
                let p1 = this.state.playerList[i];
                let p2 = this.state.playerList[j];

                let current = this.getRelationshipValue(p1, p2);
                let increase = this.randomDelta(1, 3);

                if (current < 0) {
                    increase += 1;
                }

                if (current >= 61) {
                    increase += 1;
                }

                this.modifyRelationship(p1, p2, increase);
                UI.highlightRelationshipChange(p1, p2, increase);
                totalIncrease += increase;
            }
        }

        UI.addLog(`🏆 比赛胜利，全队关系升温`, {});
        UI.renderRelationshipNetwork();
        return totalIncrease;
    },

    // 比赛失利：所有关系 -1~3
    matchLossRelationships: function () {
        let totalDecrease = 0;

        for (let i = 0; i < this.state.playerList.length; i++) {
            for (let j = i + 1; j < this.state.playerList.length; j++) {
                let p1 = this.state.playerList[i];
                let p2 = this.state.playerList[j];

                let current = this.getRelationshipValue(p1, p2);
                let decrease = this.randomDelta(1, 2);

                if (current < 0) {
                    decrease += this.randomDelta(1, 2);
                }

                if (current > 50) {
                    decrease = Math.max(1, decrease - 1);
                }

                this.modifyRelationship(p1, p2, -decrease);
                UI.highlightRelationshipChange(p1, p2, -decrease);
                totalDecrease += decrease;
            }
        }

        UI.addLog(`🌧️ 比赛失利，全队关系下降`, {});
        UI.renderRelationshipNetwork();
        return totalDecrease;
    },

    batchProcessRelationshipChanges: function (changes) {
        if (!changes || changes.length === 0) return;

        console.log(`批量处理 ${changes.length} 个关系变化`);

        // 1. 找出所有新成为死党的关系对
        let newDeadFriends = changes.filter((c) => c.oldValue < 61 && c.newValue >= 61);

        // 2. 如果有新死党，检查连通组
        if (newDeadFriends.length > 0) {
            // 取第一个新死党对中的一个作为起点
            let startPlayer = newDeadFriends[0].p1;
            let connectedGroup = this.findAllConnectedBestFriends(startPlayer);

            if (connectedGroup.length >= 3) {
                this.formOrMergeFaction(connectedGroup);
            }

            // 显示部分高亮动画
            let showHighlights = newDeadFriends.slice(0, 5);
            showHighlights.forEach((c, index) => {
                setTimeout(() => {
                    UI.highlightRelationshipChange(c.p1, c.p2, c.delta);
                }, index * 200);
            });

            // 记录日志
            newDeadFriends.forEach((c) => {
                UI.addLog(`💕 ${c.p1.name}和${c.p2.name}成为死党！`, {});
            });
        }

        // 3. 最后只渲染一次关系网络
        setTimeout(() => {
            UI.renderRelationshipNetwork();
            UI.renderFactionsList();
        }, 100);
    },

    // 发生冲突：两人关系 -5~15
    triggerConflict: function (p1, p2, reason = '日常摩擦') {
        let decrease = this.randomDelta(5, 15);
        let current = this.getRelationshipValue(p1, p2);

        if (current <= -61) {
            decrease += this.randomDelta(5, 10);
        }

        let newValue = this.modifyRelationship(p1, p2, -decrease);
        UI.highlightRelationshipChange(p1, p2, -decrease);

        UI.addLog(`💥 ${p1.name}和${p2.name}发生冲突，关系-${decrease}（${reason}）`, {});

        if (newValue <= -80) {
            this.triggerFierceConflict(p1, p2);
        }

        if (current > -61 && newValue <= -61) {
            UI.showEventModal('💢 关系恶化', `${p1.name}和${p2.name}的矛盾越来越深，现在已经到了水火不容的地步...`, [
                { text: '得想想办法', run: function () {} },
            ]);
        }
        UI.renderRelationshipNetwork();
        return decrease;
    },

    // 每天结束时检查仇敌关系
    checkDailyConflicts: function () {
        if (!this.state.gameStarted || this.state.gameOver || this.state.isEventActive) return;

        let conflictCount = 0;

        for (let i = 0; i < this.state.playerList.length; i++) {
            for (let j = i + 1; j < this.state.playerList.length; j++) {
                let p1 = this.state.playerList[i];
                let p2 = this.state.playerList[j];

                let value = this.getRelationshipValue(p1, p2);

                if (value <= -61 && Math.random() < 0.08) {
                    this.triggerConflict(p1, p2, '日常摩擦');
                    conflictCount++;
                }
            }
        }

        if (conflictCount > 0) {
            UI.addLog(`⚡ 今天发生了 ${conflictCount} 起冲突`, {});
        }
    },

    // 激烈冲突事件
    triggerFierceConflict: function (p1, p2) {
        if (this.state.isEventActive) return;

        this.state.isEventActive = true;
        UI.updateButtons();

        UI.showChoiceModal('💥 激烈冲突', `${p1.name}和${p2.name}的矛盾终于爆发了...`, [
            {
                text: '🤝 严厉调解',
                run: () => {
                    let ds = this.applySpiritChange(-this.randomDelta(20, 30));
                    this.state.spirit += ds;

                    let success = Math.random() < 0.5;

                    if (success) {
                        this.modifyRelationship(p1, p2, 30);
                        p1.loyalty = Math.max(0, p1.loyalty - 5);
                        p2.loyalty = Math.max(0, p2.loyalty - 5);

                        UI.addLog(`🤝 成功调解${p1.name}和${p2.name}的矛盾`, { spirit: ds });
                        UI.showResultModal(
                            '🤝 调解成功',
                            `在你的严厉批评下，两人勉强握手言和。虽然都有些不情愿，但至少暂时平息了。`,
                            { spirit: ds }
                        );
                    } else {
                        UI.addLog(`😥 调解失败，矛盾无法调和`, { spirit: ds });

                        let leaver = Math.random() < 0.5 ? p1 : p2;
                        let stayer = leaver === p1 ? p2 : p1;

                        this.handleEnemyDeparture(leaver, stayer);
                    }

                    this.state.isEventActive = false;
                    this.updateAll();
                },
            },
            {
                text: '👀 先冷静一下',
                run: () => {
                    this.modifyRelationship(p1, p2, -10);

                    if (this.getRelationshipValue(p1, p2) <= -90) {
                        let leaver = Math.random() < 0.5 ? p1 : p2;
                        let stayer = leaver === p1 ? p2 : p1;

                        this.handleEnemyDeparture(leaver, stayer);
                    } else {
                        UI.addLog(`👀 暂时不管${p1.name}和${p2.name}的矛盾`, {});
                        UI.showResultModal('👀 暂时不管', `你选择让他们先冷静一下，但问题并没有解决...`, {});
                    }

                    this.state.isEventActive = false;
                    this.updateAll();
                },
            },
        ]);
    },

    // 完整的离队处理
    handleEnemyDeparture: function (leaver, culprit) {
        console.log('【离队调试】', leaver.name, '离队，调用栈：', new Error().stack);

        let index = this.state.playerList.findIndex((p) => p.id === leaver.id);
        if (index === -1) return;

        // 保存旧的状态
        let oldMood = this.state.mood; // ← 记录旧气氛
        let oldTeamLevel = this.state.teamLevel; // ← 记录旧球队实力

        let negativeRelations = [];
        this.state.playerList.forEach((other) => {
            if (other.id === leaver.id) return;
            let rel = this.getRelationshipValue(leaver, other);
            if (rel < 0) {
                negativeRelations.push({
                    playerId: other.id,
                    value: rel,
                });
            }
        });

        // 重要：在移除球员前，先处理小团体
        if (leaver.faction) {
            this.handleFactionDeparture(leaver);
        }

        // 移除球员
        this.state.playerList.splice(index, 1);
        this.state.seasonLeaveCount++;

        UI.renderFactionsList();

        this.state.departedPlayersHistory.push({
            id: leaver.id,
            name: leaver.name,
            joinDate: leaver.joinDate,
            leaveDate: this.formatDate(this.state.currentDate),
            loyalty: leaver.loyalty,
            skill: leaver.skill,
            personality: leaver.personality,
            introducerId: leaver.introducerId,
            introducerName: leaver.introducerName,
            negativeRelations: negativeRelations,
        });

        // 处理其他球员的反应（会影响关系）
        this.state.playerList.forEach((p) => {
            if (p.id === culprit.id) return;

            let relWithLeaver = this.getRelationshipValue(p, leaver);
            let relWithCulprit = this.getRelationshipValue(p, culprit);

            if (relWithLeaver > 30) {
                if (relWithCulprit > 50) {
                    this.modifyRelationship(p, culprit, -25);
                    p.loyalty = Math.max(0, p.loyalty - 15);
                    UI.addLog(`😔 ${p.name}因好朋友${leaver.name}离队而陷入两难`, {});
                    this.triggerDilemmaEvent(p, culprit, leaver);
                } else if (relWithCulprit < -30) {
                    this.modifyRelationship(p, culprit, -15);
                    UI.addLog(`⚔️ ${p.name}更加仇视${culprit.name}`, {});
                } else {
                    this.setRelationshipValue(p, culprit, -35);
                    UI.addLog(`🤨 ${p.name}因${leaver.name}离队而开始敌视${culprit.name}`, {});
                }
            }
        });

        // 移除离队者的关系
        this.state.playerList.forEach((p) => {
            delete p.relationships[leaver.id];
        });

        // 计算人际关系变化
        let relationDelta = -this.randomDelta(3, 8);
        this.state.relation += relationDelta;

        // ===== 关键：重新计算球队实力和气氛 =====
        this.updateTeamLevel();
        this.updateMoodFromRelationships(); // ← 重新计算气氛

        // 计算实际变化量
        let teamLevelDelta = this.state.teamLevel - oldTeamLevel;
        let moodDelta = this.state.mood - oldMood; // ← 计算气氛变化

        // 显示浮动数字（包括气氛）
        UI.showFloat('mood', moodDelta);
        UI.showFloat('relation', relationDelta);
        UI.showFloat('teamLevel', teamLevelDelta);

        // 更新UI
        UI.updatePlayersList();
        UI.renderRelationshipNetwork();

        // 记录日志（包括气氛）
        UI.addLog(`🚪 ${leaver.name} 离开了球队`, {
            mood: moodDelta,
            relation: relationDelta,
            teamLevel: teamLevelDelta,
        });

        // 显示离队弹窗（包括气氛）
        UI.showEventModal(
            '😢 队员离队',
            `${leaver.name} 因为与 ${culprit.name} 的矛盾无法调和，最终选择离开球队。<br><br>` +
                `<strong>离队带来的影响：</strong><br>` +
                `• 队内气氛: ${moodDelta > 0 ? '+' : ''}${moodDelta}<br>` +
                `• 人际关系: ${relationDelta > 0 ? '+' : ''}${relationDelta}<br>` +
                `• 球队实力: ${teamLevelDelta > 0 ? '+' : ''}${teamLevelDelta}<br>` +
                `• 当前队员数: ${this.state.playerList.length}人`,
            [{ text: '......', run: function () {} }]
        );

        this.checkGameOver();
    },

    // 两难事件
    triggerDilemmaEvent: function (bridge, culprit, leaver) {
        UI.showEventModal(
            '😢 左右为难',
            `${bridge.name}找到你：「队长，${leaver.name}走了...我知道她和${culprit.name}一直有矛盾，` +
                `但没想到会这样。我现在不知道该怎么面对${culprit.name}...」`,
            [
                {
                    text: '🤝 劝她以团队为重',
                    run: () => {
                        bridge.loyalty = Math.max(0, bridge.loyalty - 10);
                        this.modifyRelationship(bridge, culprit, -10);
                        UI.addLog(`🤝 劝${bridge.name}以团队为重，但她似乎更难过了`, {});
                        UI.showResultModal(
                            '🤝 以团队为重',
                            `你劝她放下个人情感，以球队利益为重。她点点头，但眼神里还是有些难过。`,
                            {}
                        );
                    },
                },
                {
                    text: '💬 让她和凶手谈谈',
                    run: () => {
                        let success = Math.random() < 0.4;
                        if (success) {
                            this.modifyRelationship(bridge, culprit, 15);
                            bridge.loyalty += 5;
                            UI.addLog(`💬 ${bridge.name}和${culprit.name}坦诚交谈，关系缓和`, {});
                            UI.showResultModal(
                                '💬 坦诚交谈',
                                `她鼓起勇气和${culprit.name}谈了谈，两人说开了很多事，关系反而有所改善。`,
                                {}
                            );
                        } else {
                            this.modifyRelationship(bridge, culprit, -10);
                            bridge.loyalty -= 5;
                            UI.addLog(`💬 ${bridge.name}和${culprit.name}谈崩了，关系更糟`, {});
                            UI.showResultModal('💬 谈崩了', `谈话并不顺利，两人不欢而散，${bridge.name}更难过了。`, {});
                        }
                    },
                },
                {
                    text: '😔 给她放个假',
                    run: () => {
                        bridge.loyalty = Math.min(100, bridge.loyalty + 10);
                        bridge.temporaryLeave = 3;
                        UI.addLog(`😔 给${bridge.name}放了3天假，让她静静`, {});
                        UI.showResultModal(
                            '😔 放假休息',
                            `你批准她休息几天。她感激地说：「谢谢队长，我需要时间消化一下。」`,
                            {}
                        );
                    },
                },
            ]
        );
    },

    // ====================== 小团体系统 ======================
    getActiveFactions: function () {
        // 先收集所有有小团体的球员
        let factions = this.state.playerList
            .filter((p) => p.faction)
            .map((p) => p.faction)
            .filter((f, i, self) => self.findIndex((f2) => f2.id === f.id) === i);

        // 过滤掉成员数量为0的小团体
        factions = factions.filter((f) => f.members && f.members.length > 0);

        // 修复可能损坏的小团体（成员不在球员列表中）
        factions.forEach((faction) => {
            faction.members = faction.members.filter((member) => this.state.playerList.some((p) => p.id === member.id));
        });

        // 再次过滤空的小团体
        return factions.filter((f) => f.members && f.members.length > 0);
    },

    // ====================== 找到连通组中的中心人物 ======================
    findCenterPlayer: function (players) {
        if (players.length === 0) return null;
        if (players.length === 1) return players[0];

        let maxConnections = -1;
        let centerPlayer = players[0];

        players.forEach((p1) => {
            // 计算p1在这个组里有多少个死党
            let connections = 0;
            players.forEach((p2) => {
                if (p1.id !== p2.id && this.getRelationshipValue(p1, p2) >= 61) {
                    connections++;
                }
            });

            // 如果连接数更多，或者是相同连接数但ID更小（保持确定性）
            if (connections > maxConnections || (connections === maxConnections && p1.id < centerPlayer.id)) {
                maxConnections = connections;
                centerPlayer = p1;
            }
        });

        console.log(`【小团体】中心人物是 ${centerPlayer.name}，有 ${maxConnections} 个死党连接`);
        return centerPlayer;
    },

    // ====================== 查找所有通过死党关系连通的人 ======================
    findAllConnectedBestFriends: function (startPlayer) {
        if (!startPlayer) return [];

        let visited = new Set();
        let queue = [startPlayer];
        let connected = [];

        while (queue.length > 0) {
            let current = queue.shift();
            if (visited.has(current.id)) continue;

            visited.add(current.id);
            connected.push(current);

            // 找出当前球员的所有死党（关系≥61）
            this.state.playerList.forEach((other) => {
                if (visited.has(other.id)) return;
                if (other.id === current.id) return;

                let relValue = this.getRelationshipValue(current, other);
                if (relValue >= 61) {
                    queue.push(other);
                }
            });
        }

        return connected;
    },

    // ====================== 形成或合并小团体 ======================
    formOrMergeFaction: function (connectedGroup) {
        if (!connectedGroup || connectedGroup.length < 3) return;

        // 找出组中已有小团体的成员
        let existingFactions = new Set();
        let playersWithFaction = [];
        let playersWithoutFaction = [];

        connectedGroup.forEach((player) => {
            if (player.faction) {
                existingFactions.add(player.faction);
                playersWithFaction.push(player);
            } else {
                playersWithoutFaction.push(player);
            }
        });

        // 情况1：没有人有小团体 - 创建新小团体
        if (existingFactions.size === 0) {
            // ===== 修改：找到中心人物（和最多人是死党） =====
            let centerPlayer = this.findCenterPlayer(connectedGroup);

            // 取中心人物和另外两人（按原顺序取，但中心人物固定）
            let otherPlayers = connectedGroup.filter((p) => p.id !== centerPlayer.id).slice(0, 2);
            let [a, b, c] = [centerPlayer, ...otherPlayers];

            this.createFaction(a, b, c);

            // 其他剩余的人加入
            for (let i = 3; i < connectedGroup.length; i++) {
                this.joinFaction(connectedGroup[i], a.faction);
            }

            UI.addLog(`🤝 以${centerPlayer.name}为中心形成了小团体！`, {});

            // 使用队列系统
            this.queueEvent('faction', `${centerPlayer.name}的小团体成立了！她们会成为球队的核心吗？`);
            return;
        }

        // 情况2：只有一个人有小团体 - 其他人加入
        if (existingFactions.size === 1) {
            let targetFaction = Array.from(existingFactions)[0];
            playersWithoutFaction.forEach((player) => {
                this.joinFaction(player, targetFaction);
            });

            UI.addLog(
                `👋 ${playersWithoutFaction.map((p) => p.name).join('、')}加入了${
                    targetFaction.members[0].name
                }的小团体`,
                {}
            );

            // ✅ 使用队列系统（只显示第一个加入的人，避免太多弹窗）
            if (playersWithoutFaction.length > 0) {
                this.queueEvent(
                    'factionJoin',
                    `${playersWithoutFaction[0].name}加入了${targetFaction.members[0].name}的小团体！`
                );
            }
            return;
        }

        // 情况3：多人有小团体 - 需要合并
        if (existingFactions.size > 1) {
            // 选择最大的小团体作为目标
            let factions = Array.from(existingFactions);
            let targetFaction = factions.reduce((max, f) => (f.members.length > max.members.length ? f : max));
            // ===== 新增：先记录所有被合并的小团体的核心人物名字 =====
            let mergedFactionNames = [];
            factions.forEach((faction) => {
                if (faction.id === targetFaction.id) return;
                // 保存核心人物名字（第一个成员）
                if (faction.members && faction.members.length > 0 && faction.members[0]) {
                    mergedFactionNames.push(faction.members[0].name);
                }
            });
            // ===== 结束 =====
            // 将所有其他小团体的成员合并到目标小团体
            factions.forEach((faction) => {
                if (faction.id === targetFaction.id) return;

                // 复制成员列表，避免遍历时修改
                let membersToMove = [...faction.members];
                membersToMove.forEach((member) => {
                    // 从原小团体移除
                    const index = faction.members.findIndex((m) => m.id === member.id);
                    if (index !== -1) faction.members.splice(index, 1);

                    // 加入目标小团体
                    member.faction = targetFaction;
                    if (!targetFaction.members.includes(member)) {
                        targetFaction.members.push(member);
                    }
                });
            });
            // ===== 新增：批量记录合并日志 =====
            mergedFactionNames.forEach((name) => {
                if (name) {
                    UI.addLog(`🔄 ${name}的小团体并入了${targetFaction.members[0].name}的小团体`, {});
                }
            });
            // ===== 结束 =====

            // 确保所有连通组的成员都在目标小团体中
            connectedGroup.forEach((player) => {
                if (player.faction !== targetFaction) {
                    player.faction = targetFaction;
                    if (!targetFaction.members.includes(player)) {
                        targetFaction.members.push(player);
                    }
                }
            });

            UI.addLog(`🤝 ${connectedGroup.map((p) => p.name).join('、')}现在都在同一个小团体！`, {});

            // ✅ 使用队列系统
            this.queueEvent('factionMerge', `两个小团体合并了！现在她们是一个大家庭。`);
        }
    },

    checkFactionFormation: function (player) {
        // 这个方法现在由 findAllConnectedBestFriends 和 formOrMergeFaction 替代
        // 保留为空函数或简单检查，避免报错
        return;
    },

    // ====================== 检查是否能通过好友加入小团体 ======================
    checkJoinFactionByFriendship: function (player, friend) {
        // 如果player已经有小团体，不用再加入
        if (player.faction) return;

        // 如果friend没有小团体，无法加入
        if (!friend.faction) return;

        let targetFaction = friend.faction;

        // ✅ 新逻辑：只要和朋友是死党，就直接加入
        // 不需要检查和其他人的关系
        this.joinFaction(player, targetFaction);

        // 记录加入事件
        UI.addLog(`👋 ${player.name}加入了${targetFaction.members[0].name}的小团体`, {});

        // 检查和其他成员的关系，给出提示（非必要，但增加趣味性）
        let notFriends = targetFaction.members.filter(
            (m) =>
                m.id !== friend.id &&
                m.id !== player.id && // 排除自己
                this.getRelationshipValue(player, m) < 30 // 关系普通或更差
        );

        if (notFriends.length > 0) {
            let names = notFriends.map((m) => m.name).join('、');
            UI.addLog(`💬 ${player.name}和${names}还需要时间熟悉`, {});
        }
    },

    createFaction: function (a, b, c) {
        let factionId = `faction_${Date.now()}_${a.id}_${b.id}_${c.id}`;
        let faction = {
            id: factionId,
            members: [a, b, c],
            created: new Date(this.state.currentDate),
        };

        a.faction = faction;
        b.faction = faction;
        c.faction = faction;

        UI.addLog(`🤝 ${a.name}、${b.name}、${c.name}形成了小团体`, {});
    },

    joinFaction: function (player, faction) {
        // 1. 先确保数组成立（防止报错）
        if (!faction.members) faction.members = [];

        // 2. 检查player是否已有团体
        if (player.faction) {
            console.log(`${player.name}已经有小团体，不能加入`);
            return;
        }

        // 3. 检查是否已在团里
        if (faction.members.includes(player)) return;

        // 4. 加入小团体
        faction.members.push(player);
        player.faction = faction;

        // 5. 日志（注意：这里用 faction.members[0] 是安全的，因为已经至少有一个成员）
        UI.renderFactionsList();
    },

    checkFactionExpansion: function (p1, p2) {
        if (p1.faction && !p2.faction) {
            this.joinFaction(p2, p1.faction);
        } else if (p2.faction && !p1.faction) {
            this.joinFaction(p1, p2.faction);
        }
    },

    areBestFriends: function (p1, p2) {
        return this.getRelationshipValue(p1, p2) >= 61;
    },

    // 调试函数：打印所有球员的关系
    printAllRelationships: function () {
        console.log('========== 当前关系网络 ==========');
        for (let i = 0; i < this.state.playerList.length; i++) {
            for (let j = i + 1; j < this.state.playerList.length; j++) {
                let p1 = this.state.playerList[i];
                let p2 = this.state.playerList[j];
                let value = this.getRelationshipValue(p1, p2);
                if (value !== 0) {
                    console.log(`${p1.name}-${p2.name}: ${value}`);
                }
            }
        }
        console.log('=================================');
    },

    // 获取关系类型
    getRelationshipType: function (value) {
        if (value >= 61) return '死党';
        if (value >= 1) return '朋友';
        if (value >= -60) return '竞争';
        return '仇敌';
    },

    // 获取关系图标
    getRelationshipIcon: function (value) {
        if (value >= 80) return '💕';
        if (value >= 61) return '💞';
        if (value >= 30) return '🤝';
        if (value >= 1) return '👋';
        if (value >= -30) return '😐';
        if (value >= -60) return '⚔️';
        if (value >= -80) return '💢';
        return '💀';
    },

    // ====================== 球员初始化 ======================
    initPlayers: function () {
        this.state.playerList = [];
        this.state.recruitedNames.clear();
        this.state.playerWarningShown.clear();
        this.state.tempSelectedPlayerId = null;

        this.state.initPlayerNames.forEach((name, index) => {
            this.state.playerList.push({
                id: index + 1,
                name: name,
                joinDate: '2024-03-08',
                loyalty: this.randomDelta(30, 70),
                skill: this.randomDelta(10, 25),
                personality: '元老队员',
                relationships: {},
            });
            this.state.recruitedNames.add(name);
        });

        this.initRelationships();
        this.updateTeamLevel(); // ← 添加这一行，计算初始球队实力
        UI.updatePlayersList();
    },

    initRelationships: function () {
        this.state.playerList.forEach((p) => {
            p.relationships = {};
        });

        // 小马=1, 霏霏=2, 老郭=3, 阿柏=4, 五零=5, 阿木=6, 三习=7, 之之=8, 贝尔=9
        this.setRelationshipValue(this.state.playerList[0], this.state.playerList[1], 52);
        this.setRelationshipValue(this.state.playerList[1], this.state.playerList[2], 48);
        this.setRelationshipValue(this.state.playerList[4], this.state.playerList[5], 45);
        this.setRelationshipValue(this.state.playerList[6], this.state.playerList[7], 50);
        this.setRelationshipValue(this.state.playerList[7], this.state.playerList[8], 53);

        this.setRelationshipValue(this.state.playerList[2], this.state.playerList[6], -35);
        this.setRelationshipValue(this.state.playerList[5], this.state.playerList[8], -45);
        this.setRelationshipValue(this.state.playerList[4], this.state.playerList[1], -40);
    },

    // ====================== 添加球员 ======================
    addNewPlayerWithPersonality: function (recruitItem) {
        if (this.state.recruitedOriginalNames.has(recruitItem.name)) {
            UI.addLog(`❌ ${recruitItem.name} 已经招募过了`, {});
            return null;
        }

        if (this.state.playerList.some((p) => p.name === recruitItem.name)) {
            UI.addLog(`❌ ${recruitItem.name} 名字已被占用`, {});
            return null;
        }

        const newId = this.state.playerList.length > 0 ? Math.max(...this.state.playerList.map((p) => p.id)) + 1 : 1;
        const loyaltyVal = this.randomDelta(recruitItem.loyaltyRange[0], recruitItem.loyaltyRange[1]);
        const skillVal = this.randomDelta(recruitItem.skillRange[0], recruitItem.skillRange[1]);

        let joinDate = this.formatDate(this.state.currentDate);

        let introducer = this.state.playerList.find((p) => p.name === recruitItem.introducerName);
        let introducerId = introducer ? introducer.id : null;

        let newPlayer = {
            id: newId,
            name: recruitItem.name,
            joinDate: joinDate,
            loyalty: Math.min(100, loyaltyVal),
            skill: Math.min(100, skillVal),
            personality: recruitItem.personality,
            relationships: {},
            introducerId: introducerId,
            introducerName: recruitItem.introducerName,
        };

        // 保存旧的球队实力
        let oldTeamLevel = this.state.teamLevel;

        this.state.playerList.push(newPlayer);
        this.state.seasonJoinCount++; // 新增：赛季加入人数+1

        // ===== 新增：更新最多球员记录 =====
        if (this.state.playerList.length > this.state.stats.maxPlayers) {
            this.state.stats.maxPlayers = this.state.playerList.length;
        }
        this.state.recruitedOriginalNames.add(recruitItem.name);

        let currentDateObj = new Date(this.state.currentDate);
        let hostileOldTimers = [];

        this.state.playerList.forEach((existingPlayer) => {
            if (existingPlayer.id === newPlayer.id) return;
            if (existingPlayer.id === introducer?.id) return;

            let joinDate = new Date(existingPlayer.joinDate);
            let daysDiff = Math.floor((currentDateObj - joinDate) / (1000 * 3600 * 24));

            if (daysDiff > 30) {
                let hostility = -this.randomDelta(5, 10);
                let currentRel = this.getRelationshipValue(newPlayer, existingPlayer);
                let newRel = currentRel + hostility;
                this.setRelationshipValue(newPlayer, existingPlayer, newRel);
                hostileOldTimers.push(existingPlayer.name);
            }
        });

        if (hostileOldTimers.length > 0) {
            UI.addLog(`👀 ${newPlayer.name}和老队员${hostileOldTimers.join('、')}似乎有点气场不合`, {});
        }

        if (introducer) {
            let initialValue = this.randomDelta(50, 70);
            this.setRelationshipValue(newPlayer, introducer, initialValue);
            UI.addLog(`👋 ${recruitItem.name} 由 ${introducer.name} 介绍入队，两人成为朋友！`, {});

            // 如果达到死党阈值，检查小团体
            if (initialValue >= 61) {
                // 检查新球员是否能形成新小团体
                this.checkFactionFormation(newPlayer);

                // 检查是否能通过介绍人加入小团体
                this.checkJoinFactionByFriendship(newPlayer, introducer);

                // 同时也检查介绍人那边是否有变化
                this.checkFactionFormation(introducer);
            }

            setTimeout(() => {
                UI.highlightRelationshipChange(newPlayer, introducer, initialValue);
            }, 100);

            introducer.loyalty = Math.min(100, introducer.loyalty + this.randomDelta(3, 6));
            setTimeout(() => UI.showPlayerFloat(introducer.id, 'loyalty', this.randomDelta(3, 6)), 150);
        }

        if (introducer) {
            let enemies = [];
            this.state.playerList.forEach((otherPlayer) => {
                if (otherPlayer.id === introducer.id) return;
                let relWithIntroducer = this.getRelationshipValue(introducer, otherPlayer);
                if (relWithIntroducer < 0) {
                    this.setRelationshipValue(newPlayer, otherPlayer, relWithIntroducer);
                    enemies.push(otherPlayer.name);
                }
            });

            if (enemies.length > 0) {
                UI.addLog(`👀 ${newPlayer.name}受${introducer.name}影响，对${enemies.join('、')}有敌意`, {});
            }
        }

        UI.updatePlayersList();
        UI.renderFactionsList();

        // 更新球队实力
        this.updateTeamLevel();

        // 计算实际变化量
        let teamLevelDelta = this.state.teamLevel - oldTeamLevel;

        // 如果球队实力有变化，在日志中显示
        if (teamLevelDelta !== 0) {
            UI.addLog(`📊 球队实力${teamLevelDelta > 0 ? '+' : ''}${teamLevelDelta}`, {});
        }

        setTimeout(() => {
            UI.showPlayerFloat(newId, 'loyalty', loyaltyVal);
            UI.showPlayerFloat(newId, 'skill', skillVal);
        }, 30);

        this.state.recruitedPlayersHistory[recruitItem.name] = this.formatDate(this.state.currentDate);

        return newPlayer;
    },

    removeRandomPlayer: function () {
        if (this.state.playerList.length === 0) return null;

        let bestFriend1 = this.state.playerList.find((p) => p.name.includes('林桃'));
        let bestFriend2 = this.state.playerList.find((p) => p.name.includes('江蓠'));

        if (bestFriend1 && bestFriend2 && Math.random() < 0.3) {
            let removed1 = null,
                removed2 = null;
            const index1 = this.state.playerList.findIndex((p) => p.id === bestFriend1.id);
            if (index1 !== -1) {
                removed1 = this.state.playerList.splice(index1, 1)[0];
                this.state.playerWarningShown.delete(removed1.id);
                this.state.seasonLeaveCount++;
                if (removed1.faction) {
                    this.handleFactionDeparture(removed1);
                }
            }

            const index2 = this.state.playerList.findIndex((p) => p.id === bestFriend2.id);
            if (index2 !== -1) {
                removed2 = this.state.playerList.splice(index2, 1)[0];
                this.state.playerWarningShown.delete(removed2.id);
                this.state.seasonLeaveCount++;
                if (removed2.faction) {
                    this.handleFactionDeparture(removed2);
                }
            }

            if (removedPlayer.faction) {
                this.handleFactionDeparture(removedPlayer);
            }

            UI.updatePlayersList();
            return removed1 || removed2;
        }

        const randomIdx = Math.floor(Math.random() * this.state.playerList.length);
        const removedPlayer = this.state.playerList.splice(randomIdx, 1)[0];

        let negativeRelations = [];
        this.state.playerList.forEach((other) => {
            if (other.id === removedPlayer.id) return;
            let rel = this.getRelationshipValue(removedPlayer, other);
            if (rel < 0) {
                negativeRelations.push({
                    playerId: other.id,
                    value: rel,
                });
            }
        });

        this.state.departedPlayersHistory.push({
            id: removedPlayer.id,
            name: removedPlayer.name,
            joinDate: removedPlayer.joinDate,
            leaveDate: this.formatDate(this.state.currentDate),
            loyalty: removedPlayer.loyalty,
            skill: removedPlayer.skill,
            personality: removedPlayer.personality,
            introducerId: removedPlayer.introducerId,
            introducerName: removedPlayer.introducerName,
            negativeRelations: negativeRelations,
        });

        this.state.playerWarningShown.delete(removedPlayer.id);
        this.state.seasonLeaveCount++;

        if (removedPlayer.faction) {
            this.handleFactionDeparture(removedPlayer);
        }

        UI.updatePlayersList();
        return removedPlayer;
    },

    randomUpdatePlayerAttr: function () {
        if (this.state.playerList.length === 0) return;
        const randomIdx = Math.floor(Math.random() * this.state.playerList.length);
        const player = this.state.playerList[randomIdx];
        const isAdd = Math.random() > 0.4;
        const loyaltyDelta = isAdd ? this.randomDelta(3, 8) : -this.randomDelta(2, 5);
        const skillDelta = isAdd ? this.randomDelta(2, 5) : -this.randomDelta(1, 3);

        player.loyalty = Math.max(0, Math.min(100, player.loyalty + loyaltyDelta));
        player.skill = Math.max(0, Math.min(100, player.skill + skillDelta));

        UI.updatePlayersList();
        this.updateTeamLevel(); // ← 添加这一行，球员属性变化后重新计算

        setTimeout(() => {
            UI.showPlayerFloat(player.id, 'loyalty', loyaltyDelta);
            UI.showPlayerFloat(player.id, 'skill', skillDelta);
        }, 20);

        this.checkPlayerLoyaltyAndWarn(player);
    },

    batchUpdatePlayers: function (playersArray, loyaltyDeltaFn, skillDeltaFn) {
        if (!playersArray || playersArray.length === 0) return;
        playersArray.forEach((player) => {
            if (loyaltyDeltaFn) {
                let delta = typeof loyaltyDeltaFn === 'function' ? loyaltyDeltaFn() : loyaltyDeltaFn;
                player.loyalty = Math.max(0, Math.min(100, player.loyalty + delta));
            }
            if (skillDeltaFn) {
                let delta = typeof skillDeltaFn === 'function' ? skillDeltaFn() : skillDeltaFn;
                player.skill = Math.max(0, Math.min(100, player.skill + delta));
            }
        });
        UI.updatePlayersList();
        this.updateTeamLevel(); // ← 添加这一行，批量更新后重新计算

        setTimeout(() => {
            playersArray.forEach((player) => {
                if (loyaltyDeltaFn) {
                    let delta = typeof loyaltyDeltaFn === 'function' ? loyaltyDeltaFn() : loyaltyDeltaFn;
                    if (delta !== 0) UI.showPlayerFloat(player.id, 'loyalty', delta);
                }
                if (skillDeltaFn) {
                    let delta = typeof skillDeltaFn === 'function' ? skillDeltaFn() : skillDeltaFn;
                    if (delta !== 0) UI.showPlayerFloat(player.id, 'skill', delta);
                }
            });
        }, 20);
        playersArray.forEach((player) => this.checkPlayerLoyaltyAndWarn(player));
    },

    // ====================== 处理小团体成员离队 ======================
    handleFactionDeparture: function (leaver) {
        let faction = leaver.faction;
        if (!faction) {
            console.log('离队者没有小团体:', leaver.name);
            return;
        }

        console.log('处理小团体离队:', leaver.name, faction);

        // 保存旧的状态
        let oldMood = this.state.mood;
        let oldTeamLevel = this.state.teamLevel;

        // 1. 从小团体中移除离队者
        const memberIndex = faction.members.findIndex((m) => m && m.id === leaver.id);
        if (memberIndex !== -1) {
            faction.members.splice(memberIndex, 1);
            console.log(`已从${faction.members[0]?.name}的小团体中移除${leaver.name}`);
        }

        // 2. 检查小团体是否应该解散
        if (faction.members.length <= 1) {
            // 小团体解散
            console.log(`小团体因成员离队而解散，剩余成员:`, faction.members);

            // 移除所有剩余成员的 faction 引用
            faction.members.forEach((member) => {
                if (member) {
                    member.faction = null;
                    console.log(`  移除${member.name}的小团体引用`);
                }
            });

            UI.addLog(`💔 小团体因成员离队而解散`, {});
        } else {
            // 小团体继续存在，但需要处理剩余成员的情绪
            console.log(
                `小团体继续存在，剩余成员:`,
                faction.members.map((m) => m.name)
            );

            // 剩余成员忠诚度和球技下降
            let affectedMembers = [];
            faction.members.forEach((member) => {
                if (member.id === leaver.id) return;

                let loyaltyDelta = -Game.randomDelta(20, 30);
                member.loyalty = Math.max(0, member.loyalty + loyaltyDelta);
                UI.showPlayerFloat(member.id, 'loyalty', loyaltyDelta);

                let skillDelta = -Game.randomDelta(3, 8);
                member.skill = Math.max(0, member.skill + skillDelta);
                UI.showPlayerFloat(member.id, 'skill', skillDelta);

                affectedMembers.push(member.name);
            });

            if (affectedMembers.length > 0) {
                let names = affectedMembers.join('、');
                UI.addLog(`😢 ${names}因好友${leaver.name}离队而消沉`, {});
            }

            // 小团体内部关系变化（互相责怪）
            for (let i = 0; i < faction.members.length; i++) {
                for (let j = i + 1; j < faction.members.length; j++) {
                    if (faction.members[i].id === leaver.id || faction.members[j].id === leaver.id) continue;

                    let delta = -Game.randomDelta(5, 15);
                    this.modifyRelationship(faction.members[i], faction.members[j], delta);
                }
            }
        }

        // 3. 离队对全队的影响（人际关系和精力）
        let relationDelta = -Game.randomDelta(10, 20);
        let spiritDelta = this.applySpiritChange(-Game.randomDelta(20, 30));

        this.state.relation += relationDelta;
        this.state.spirit += spiritDelta;

        // 4. 外部球员对离队的反应
        this.state.playerList.forEach((p) => {
            if (p.faction?.id === faction?.id) return; // 小团体内部已处理

            let relWithLeaver = this.getRelationshipValue(p, leaver);

            if (relWithLeaver < -30) {
                // 有仇的人开心
                let loyaltyDelta = Game.randomDelta(5, 10);
                p.loyalty = Math.min(100, p.loyalty + loyaltyDelta);
                UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta);

                if (faction) {
                    faction.members.forEach((member) => {
                        if (member.id === leaver.id) return;
                        this.modifyRelationship(p, member, -Game.randomDelta(10, 20));
                    });
                }

                UI.addLog(`😏 ${p.name}觉得${leaver.name}离队活该`, {});
            } else if (relWithLeaver <= 30 && relWithLeaver > -30) {
                // 中立球员
                let loyaltyDelta = -Game.randomDelta(5, 10);
                p.loyalty = Math.max(0, p.loyalty + loyaltyDelta);
                UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta);
            }
        });

        // 5. 重新计算球队实力和气氛（基于所有变化）
        this.updateTeamLevel();
        this.updateMoodFromRelationships();

        // 6. 计算实际变化量
        let teamDelta = this.state.teamLevel - oldTeamLevel;
        let moodDelta = this.state.mood - oldMood;

        // 7. 显示浮动数字（包括间接影响的气氛变化）
        UI.showFloat('mood', moodDelta);
        UI.showFloat('teamLevel', teamDelta);
        UI.showFloat('relation', relationDelta);
        UI.showFloat('spirit', spiritDelta);

        // 8. 强制刷新UI
        UI.updatePlayersList();
        UI.renderFactionsList();
        UI.renderRelationshipNetwork();

        // 9. 记录日志（包括间接影响的气氛变化）
        UI.addLog(`🚪 ${leaver.name} 离开了球队`, {
            mood: moodDelta,
            relation: relationDelta,
            teamLevel: teamDelta,
            spirit: spiritDelta,
        });

        // 10. 显示离队影响弹窗（显示实际的气氛变化）
        if (faction && faction.members.length > 1) {
            UI.showEventModal(
                '😢 小团体成员离队',
                `${leaver.name}离队给球队带来了巨大冲击。<br><br>` +
                    `<strong>影响：</strong><br>` +
                    `• 队内气氛: ${moodDelta > 0 ? '+' : ''}${moodDelta}<br>` +
                    `• 人际关系: ${relationDelta > 0 ? '+' : ''}${relationDelta}<br>` +
                    `• 球队实力: ${teamDelta > 0 ? '+' : ''}${teamDelta}<br>` +
                    `• 你的精力: ${spiritDelta > 0 ? '+' : ''}${spiritDelta}<br><br>` +
                    `<strong>小团体剩余成员:</strong> 忠诚度大幅下降，球技下滑`,
                [{ text: '......', run: function () {} }]
            );
        }
    },

    // ====================== 预警系统 ======================
    checkRelationAndWarn: function () {
        if (!this.state.gameStarted || this.state.gameOver) return;
        if (this.state.relation <= 0) {
            this.state.relation = 0;
            this.state.gameOver = true;
            // ===== 使用统一的统计函数 =====
            const stats = this.getGameOverStats('人际关系归零', '和队员连普通朋友都算不上了……');
            this.showGameOverModal('人际关系归零', '和队员连普通朋友都算不上了……', stats);
            return;
        }
        if (this.state.relation < 10 && this.state.relation > 0 && !this.state.relationWarningShown) {
            this.state.relationWarningShown = true;
            UI.showInfoModal(
                '⚠️ 人际关系危机',
                `当前人际关系：${this.state.relation}<br><br>再这样下去，你可能会无法服众……`,
                { buttonText: '我知道了' }
            );
        }
        if (this.state.relation >= 10) this.state.relationWarningShown = false;
    },

    checkMoodAndWarn: function () {
        if (!this.state.gameStarted || this.state.gameOver) return;
        if (this.state.mood < 10 && this.state.mood > 0 && !this.state.moodWarningShown) {
            this.state.moodWarningShown = true;
            // ===== 使用统一的统计函数 =====
            const stats = this.getGameOverStats('队内气氛归零', '大家见面都不打招呼了。');
            this.showGameOverModal('队内气氛归零', '大家见面都不打招呼了。', stats);
            return;
            UI.showInfoModal('⚠️ 队内气氛低迷', `球队气氛只剩 ${this.state.mood} 了。`, { buttonText: '我知道了' });
        }
        if (this.state.mood >= 10) this.state.moodWarningShown = false;
    },

    checkPlayerLoyaltyAndWarn: function (player) {
        if (!this.state.gameStarted || this.state.gameOver || !player) return false;

        if (player.loyalty <= 0) {
            player.loyalty = 0;
            const index = this.state.playerList.findIndex((p) => p.id === player.id);
            if (index !== -1) {
                // 保存旧的状态
                let oldMood = this.state.mood; // ← 新增
                let oldTeamLevel = this.state.teamLevel;

                // 先处理小团体
                if (player.faction) {
                    this.handleFactionDeparture(player);
                }

                const removed = this.state.playerList.splice(index, 1)[0];
                this.state.seasonLeaveCount++;

                // ... 其他代码（departedPlayersHistory等）...

                UI.renderFactionsList();

                // 人际关系变化
                const relationDelta = -this.randomDelta(2, 5);
                this.state.relation += relationDelta;

                // ===== 重新计算球队实力和气氛 =====
                this.updateTeamLevel();
                this.updateMoodFromRelationships(); // ← 新增

                let teamLevelDelta = this.state.teamLevel - oldTeamLevel;
                let moodDelta = this.state.mood - oldMood; // ← 计算气氛变化

                // 记录日志（加入 mood）
                UI.addLog(`🚪 ${removed.name} 忠诚度归零，离开了球队`, {
                    mood: moodDelta,
                    teamLevel: teamLevelDelta,
                    relation: relationDelta,
                });

                UI.updatePlayersList();
                this.state.playerWarningShown.delete(removed.id);
                this.checkGameOver();

                // 显示弹窗（加入 mood）
                UI.showInfoModal(
                    '😢 队员离队',
                    `${removed.name} 因为忠诚度完全丧失，选择离开球队。<br><br>` +
                        `<strong>离队带来的影响：</strong><br>` +
                        `• 队内气氛: ${moodDelta > 0 ? '+' : ''}${moodDelta}<br>` +
                        `• 球队实力: ${teamLevelDelta > 0 ? '+' : ''}${teamLevelDelta}<br>` +
                        `• 人际关系: ${relationDelta > 0 ? '+' : ''}${relationDelta}<br>` +
                        `• 当前队员数: ${this.state.playerList.length}人`,
                    { buttonText: '我知道了' }
                );

                // 显示浮动数字（加入 mood）
                UI.showFloat('mood', moodDelta);
                UI.showFloat('teamLevel', teamLevelDelta);
                UI.showFloat('relation', relationDelta);
            }
            return true;
        }

        if (player.loyalty < 10 && !this.state.playerWarningShown.has(player.id)) {
            this.state.playerWarningShown.add(player.id);
            setTimeout(() => {
                const card = document.getElementById(`playerCard-${player.id}`);
                if (card) card.classList.add('warning');
            }, 50);
            UI.showInfoModal('⚠️ 忠诚度危机', `${player.name} 的忠诚度已降至 ${player.loyalty}。`, {
                buttonText: '我知道了',
            });
            return false;
        }

        if (player.loyalty >= 10 && this.state.playerWarningShown.has(player.id)) {
            this.state.playerWarningShown.delete(player.id);
            const card = document.getElementById(`playerCard-${player.id}`);
            if (card) card.classList.remove('warning');
        }

        if (player.loyalty <= 0) {
            UI.updatePlayersList();
            UI.renderRelationshipNetwork();
            UI.renderFactionsList();
        }
        return false;
    },

    checkSkillAndWarn: function () {
        if (!this.state.gameStarted || this.state.gameOver) return;
        if (this.state.skill < 0) this.state.skill = 0;

        if (this.state.skill < 10) {
            if (!this.state.skillWarningShown) {
                this.state.skillWarningShown = true;
                UI.showInfoModal('⚠️ 球技危机', `你的球技已降至 ${this.state.skill} ！人际关系每天都会下降！`, {
                    buttonText: '我知道了',
                });
            }
            document.getElementById('skillWarningArea').style.display = 'block';
            this.state.skillLowEffectActive = true;
        } else {
            this.state.skillWarningShown = false;
            document.getElementById('skillWarningArea').style.display = 'none';
            this.state.skillLowEffectActive = false;
        }
    },

    checkTeamLevelAndWarn: function () {
        if (!this.state.gameStarted || this.state.gameOver) return;
        if (this.state.teamLevel < 0) this.state.teamLevel = 0;

        if (this.state.teamLevel < 10) {
            if (!this.state.teamLevelWarningShown) {
                this.state.teamLevelWarningShown = true;
                UI.showInfoModal(
                    '⚠️ 球队实力危机',
                    `球队实力已降至 ${this.state.teamLevel} ！人际关系、球员忠诚度每天都会下降！`,
                    { buttonText: '我知道了' }
                );
            }
            document.getElementById('teamLevelWarningArea').style.display = 'block';
            this.state.teamLevelLowEffectActive = true;
        } else {
            this.state.teamLevelWarningShown = false;
            document.getElementById('teamLevelWarningArea').style.display = 'none';
            this.state.teamLevelLowEffectActive = false;
        }
    },

    checkSpiritWarnings: function () {
        if (!this.state.gameStarted || this.state.gameOver || this.state.isEventActive) return;

        if (this.state.spirit > 30) {
            this.state.spiritWarningShown.mild = false;
        }
        if (this.state.spirit > 15) {
            this.state.spiritWarningShown.severe = false;
        }

        if (this.state.spirit <= 30 && this.state.spirit > 0 && !this.state.spiritWarningShown.mild) {
            this.state.spiritWarningShown.mild = true;
            UI.showInfoModal(
                '⚡ 精力值偏低',
                `当前精力值：${this.state.spirit}<br><br>` + `最近带队有点累，要注意休息了。`,
                { buttonText: '我知道了' }
            );
        }

        if (this.state.spirit <= 15 && this.state.spirit > 0 && !this.state.spiritWarningShown.severe) {
            this.state.spiritWarningShown.severe = true;
            UI.showInfoModal(
                '⚠️ 精力值告急',
                `当前精力值：${this.state.spirit}<br><br>` + `精力严重不足！再这样下去会崩溃的！`,
                { buttonText: '我知道了' }
            );
        }
    },

    applyLowStatusEffects: function () {
        if (!this.state.gameStarted || this.state.gameOver) return;

        if (this.state.skillLowEffectActive) {
            // 只影响人际关系
            let relationDelta = -this.randomDelta(2, 5);
            this.state.relation += relationDelta;

            // ❌ 删除所有其他影响
            // let moodDelta = ...
            // let teamDelta = ...
            // 球员忠诚度变化...

            UI.showFloat('relation', relationDelta);

            UI.addLog('⚠️ 创始人球技过低，人际关系下滑', {
                relation: relationDelta,
            });
        }

        if (this.state.teamLevelLowEffectActive) {
            // 只影响人际关系
            let relationDelta = -this.randomDelta(5, 10);
            this.state.relation += relationDelta;

            // ❌ 删除所有其他影响
            // let moodDelta = ...
            // 球员忠诚度变化...

            UI.showFloat('relation', relationDelta);

            UI.addLog('⚠️ 球队实力过低，人际关系下滑', {
                relation: relationDelta,
            });
        }
    },

    // ====================== 比赛历史 ======================
    addMatchRecord: function (
        date,
        opponent,
        scoreTeam,
        scoreOpponent,
        win,
        isTournament = false,
        tournamentType = ''
    ) {
        let title = '';
        if (tournamentType === 'xizhao') {
            title = '🏆 曦照赛';
        } else if (tournamentType === 'national') {
            title = '🏆 全国大赛';
        } else if (isTournament) {
            title = '🏆 锦标赛';
        } else {
            title = '⚾ 友谊赛';
        }

        this.state.matchHistory.unshift({
            date: this.formatDate(date),
            opponent: opponent,
            score: `${scoreTeam} : ${scoreOpponent}`,
            win: win,
            title: title, // 新增：直接存储标题
            type: tournamentType || (isTournament ? 'tournament' : 'friendly'),
        });

        if (this.state.matchHistory.length > 30) this.state.matchHistory.pop();
        UI.updateMatchHistory();
    },

    // ====================== 行动结束 ======================
    finishAction: function () {
        if (this.state.gameOver) return;

        this.applyLowStatusEffects();
        this.checkDailyConflicts();

        //this.state.actionCount++;//
        this.state.daysSinceLastEvent++;

        if (!this.state.isWeekend) {
            this.state.weekdayActionsLeft--;
            if (this.state.weekdayActionsLeft <= 0) {
                this.state.isWeekend = true;
                this.state.randomEventCountThisWeek = 0;
                this.state.bookedThisWeek = false;
                while (this.state.currentDate.getDay() !== 6)
                    this.state.currentDate.setDate(this.state.currentDate.getDate() + 1);
                UI.addLog('📅 工作日结束，进入周末！', {});
            } else {
                this.state.currentDate.setDate(this.state.currentDate.getDate() + 1);
                this.state.isWeekend = this.checkIfWeekend();
            }
        } else {
            this.state.isWeekend = false;
            while (this.state.currentDate.getDay() !== 1)
                this.state.currentDate.setDate(this.state.currentDate.getDate() + 1);
            this.state.weekdayActionsLeft = 5;
            this.state.hasBookedFriendlyMatch = false;
            // ✅ 周末结束后，新的一周开始，重置计划次数
            this.state.trainPlanCountThisWeek = 0;
            UI.addLog('📅 周末结束，新一周开始！', {});
        }

        this.checkSeasonEnd();
        this.updateAll(); // 确保调用的是 this.updateAll()
        // 每天结束时重新计算气氛（关系可能已变化）
        this.updateMoodFromRelationships();
        // 强制更新UI
        UI.updateButtons();
        UI.updatePlayersList();
        UI.updateMatchHistory();
        UI.updateSlackOffButton();

        // 更新日期显示
        let dateStr = this.formatDate(this.state.currentDate);
        let status = this.state.isWeekend ? '周末' : '工作日';
        document.getElementById('dateInfo').innerText = `日期：${dateStr} | 状态：${status}`;

        let actText = this.state.isWeekend ? '🏖️ 周末行动' : `💼 工作日剩余行动：${this.state.weekdayActionsLeft}`;
        let matchText = this.state.hasBookedFriendlyMatch ? '本周已预约' : '本周未预约';
        document.getElementById('actionInfo').innerText = `${actText} | 友谊赛：${matchText}`;
    },

    // ====================== 赛季结束检查 ======================
    checkSeasonEnd: function () {
        if (!this.state.gameStarted || this.state.gameOver) return;

        // 计算从赛季开始到现在经过的月份
        let monthsPassed =
            (this.state.currentDate.getFullYear() - this.state.seasonStartDate.getFullYear()) * 12 +
            (this.state.currentDate.getMonth() - this.state.seasonStartDate.getMonth());

        // 每3个月结算一次
        if (monthsPassed >= 3) {
            this.showSeasonSummary();
            // 重置赛季开始时间
            this.state.seasonStartDate = new Date(this.state.currentDate);
            this.state.seasonMatchCount = 0;
            this.state.seasonWinCount = 0;
            this.state.seasonJoinCount = 0;
            this.state.seasonLeaveCount = 0;
        }
    },

    // ====================== 赛季总结弹窗 ======================
    // ====================== 赛季总结弹窗 ======================
    showSeasonSummary: function () {
        this.state.isEventActive = true;
        UI.updateButtons();

        let oldMood = this.state.mood;
        let oldSkill = this.state.skill;
        let oldRelation = this.state.relation;
        let oldTeamLevel = this.state.teamLevel;
        let oldSpirit = this.state.spirit;

        // 计算赛季数据
        let totalMatches = this.state.seasonMatchCount;
        let winRate = totalMatches > 0 ? Math.round((this.state.seasonWinCount / totalMatches) * 100) : 0;
        let netChange = this.state.seasonJoinCount - this.state.seasonLeaveCount;

        // 根据赛季表现给予奖励或惩罚
        let spiritBonus = 0;
        let skillBonus = 0;
        let relationBonus = 0;
        let teamLevelBonus = 0;

        // 胜率奖励
        if (winRate >= 60) {
            spiritBonus += 20;
            skillBonus += 8; // 创始人球技奖励
            relationBonus += 10;
            // teamLevelBonus 删除，通过球员成长间接影响
        } else if (winRate >= 40) {
            spiritBonus += 10;
            skillBonus += 5;
            relationBonus += 5;
        } else if (winRate >= 20) {
            spiritBonus += 5;
            skillBonus += 2;
            relationBonus += 2;
        } else {
            spiritBonus -= 5;
            skillBonus -= 3;
            relationBonus -= 3;
        }

        // 人员变动影响
        if (netChange > 0) {
            relationBonus += netChange * 3;
            spiritBonus += netChange * 2; // 新人加入让创始人更有精神
        } else if (netChange < 0) {
            relationBonus += netChange * 4;
            spiritBonus += netChange * 3; // 人员流失打击精神
        }

        // 比赛场次奖励
        if (totalMatches >= 5) {
            skillBonus += 5;
            spiritBonus += 5; // 多比赛积累经验，精神更好
        }

        // 应用奖励到创始人属性
        this.state.spirit += spiritBonus;
        this.state.skill += skillBonus;
        this.state.relation += relationBonus;
        // this.state.teamLevel += teamLevelBonus;  // 删除，不直接加

        // 赛季总结影响球员
        if (winRate >= 60) {
            // 高胜率赛季：全员成长
            this.batchUpdatePlayers(
                this.state.playerList,
                () => this.randomDelta(5, 10), // 忠诚度 +5~10
                () => this.randomDelta(3, 7) // 球技 +3~7
            );

            // 关系提升
            for (let i = 0; i < this.state.playerList.length; i++) {
                for (let j = i + 1; j < this.state.playerList.length; j++) {
                    let relDelta = this.randomDelta(2, 5);
                    this.modifyRelationship(this.state.playerList[i], this.state.playerList[j], relDelta);
                }
            }
        } else if (winRate >= 40) {
            // 中胜率赛季：部分球员成长
            let shuffled = [...this.state.playerList].sort(() => 0.5 - Math.random());
            let improvedPlayers = shuffled.slice(0, Math.min(5, shuffled.length));
            this.batchUpdatePlayers(
                improvedPlayers,
                () => this.randomDelta(3, 6), // 忠诚度 +3~6
                () => this.randomDelta(2, 5) // 球技 +2~5
            );
        } else if (winRate <= 20) {
            // 低胜率赛季：部分球员下降
            let shuffled = [...this.state.playerList].sort(() => 0.5 - Math.random());
            let affectedPlayers = shuffled.slice(0, Math.min(3, shuffled.length));
            this.batchUpdatePlayers(
                affectedPlayers,
                () => -this.randomDelta(5, 10), // 忠诚度 -5~10
                () => -this.randomDelta(2, 4) // 球技 -2~4
            );

            // 关系变差
            for (let i = 0; i < this.state.playerList.length; i++) {
                for (let j = i + 1; j < this.state.playerList.length; j++) {
                    if (Math.random() < 0.3) {
                        let relDelta = -this.randomDelta(3, 6);
                        this.modifyRelationship(this.state.playerList[i], this.state.playerList[j], relDelta);
                    }
                }
            }
        }

        // 重新计算球队实力和气氛
        this.updateTeamLevel();
        this.updateMoodFromRelationships();

        // 计算实际变化量
        let moodDelta = this.state.mood - oldMood;
        let skillDelta = this.state.skill - oldSkill;
        let relationDelta = this.state.relation - oldRelation;
        let teamDelta = this.state.teamLevel - oldTeamLevel;
        let spiritDelta = this.state.spirit - oldSpirit;

        // 显示浮动数值
        if (spiritDelta !== 0) UI.showFloat('spirit', spiritDelta);
        if (skillDelta !== 0) UI.showFloat('skill', skillDelta);
        if (relationDelta !== 0) UI.showFloat('relation', relationDelta);
        if (moodDelta !== 0) UI.showFloat('mood', moodDelta);
        if (teamDelta !== 0) UI.showFloat('teamLevel', teamDelta);

        // 生成赛季序号
        let seasonNumber = Math.floor((this.state.currentDate - new Date(2024, 2, 8)) / (1000 * 3600 * 24 * 90)) + 1;

        // 根据胜率确定颜色
        const resultColor = winRate >= 50 ? '#22c55e' : '#ef4444';
        const resultTitle = winRate >= 50 ? '🏆 精彩的赛季！' : '🌧️ 略带遗憾的赛季...';

        // 构建赛季总结弹窗
        let desc = `
        <div style="text-align:center;">
            <div style="font-size:22px; font-weight:bold; color:#e24070; margin:10px 0;">
                🏆 第 ${seasonNumber} 赛季
            </div>
            
            <div style="background:#fef2f4; padding:15px; border-radius:12px; margin:15px 0;">
                <div style="font-size:14px; color:#718096; margin-bottom:5px;">赛季胜率</div>
                <div style="font-size:36px; font-weight:bold; color:${resultColor}; margin:5px 0;">
                    ${winRate}%
                </div>
                <div style="font-size:16px; font-weight:bold; color:${resultColor};">
                    ${resultTitle}
                </div>
                <div style="display:flex; justify-content:center; gap:20px; margin-top:10px; font-size:13px;">
                    <span>${this.state.seasonWinCount}胜 ${totalMatches - this.state.seasonWinCount}负</span>
                    <span>${totalMatches}场</span>
                </div>
            </div>
            
            <div style="background:#f8f9fa; padding:12px; border-radius:8px; margin:15px 0;">
                <div style="font-weight:bold; color:#2d3748; margin-bottom:8px;">人员变动</div>
                <div style="display:flex; justify-content:space-around;">
                    <div>
                        <div style="font-size:12px; color:#718096;">加入</div>
                        <div style="font-size:20px; font-weight:bold; color:#22c55e;">+${
                            this.state.seasonJoinCount
                        }</div>
                    </div>
                    <div>
                        <div style="font-size:12px; color:#718096;">离队</div>
                        <div style="font-size:20px; font-weight:bold; color:#ef4444;">-${
                            this.state.seasonLeaveCount
                        }</div>
                    </div>
                    <div>
                        <div style="font-size:12px; color:#718096;">净变化</div>
                        <div style="font-size:20px; font-weight:bold; color:${netChange >= 0 ? '#22c55e' : '#ef4444'};">
                            ${netChange >= 0 ? '+' + netChange : netChange}
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin:15px 0;">
                <div style="font-weight:bold; color:#2d3748; margin-bottom:8px; text-align:left;">🎁 赛季奖励</div>
                <div style="background:white; border:1px solid #ffe0e5; border-radius:8px; padding:10px;">
                    <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">
                        ${
                            spiritDelta !== 0
                                ? `<span style="background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px;">精神力 ${
                                      spiritDelta > 0 ? '+' + spiritDelta : spiritDelta
                                  }</span>`
                                : ''
                        }
                        ${
                            skillDelta !== 0
                                ? `<span style="background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px;">球技 ${
                                      skillDelta > 0 ? '+' + skillDelta : skillDelta
                                  }</span>`
                                : ''
                        }
                        ${
                            relationDelta !== 0
                                ? `<span style="background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px;">人际关系 ${
                                      relationDelta > 0 ? '+' + relationDelta : relationDelta
                                  }</span>`
                                : ''
                        }
                        ${
                            moodDelta !== 0
                                ? `<span style="background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px;">队内气氛 ${
                                      moodDelta > 0 ? '+' + moodDelta : moodDelta
                                  }</span>`
                                : ''
                        }
                        ${
                            teamDelta !== 0
                                ? `<span style="background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px;">球队实力 ${
                                      teamDelta > 0 ? '+' + teamDelta : teamDelta
                                  }</span>`
                                : ''
                        }
                    </div>
                </div>
            </div>
            
            <div class="match-highlight" style="margin-top:15px; text-align:left;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:18px;">${
                        winRate >= 60 ? '🏆' : winRate >= 40 ? '📈' : winRate >= 20 ? '💪' : '🌧️'
                    }</span>
                    <span style="font-weight:bold; color:#e24070;">赛季评语</span>
                </div>
                <div style="margin-top:8px; font-size:13px; color:#2d3748;">
                    ${
                        winRate >= 60
                            ? '本赛季表现优异！球队整体实力大幅提升！'
                            : winRate >= 40
                            ? '中规中矩的一个赛季，保持稳定就是胜利。'
                            : winRate >= 20
                            ? '虽然战绩不佳，但积累了宝贵经验。'
                            : '需要好好反思，下个赛季重新出发。'
                    }
                </div>
            </div>
        </div>
    `;

        UI.showChoiceModal(`📋 第 ${seasonNumber} 赛季总结`, desc, [
            {
                text: '继续征程',
                run: () => {
                    UI.addLog(`📊 第 ${seasonNumber} 赛季结束`, {
                        spirit: spiritDelta,
                        skill: skillDelta,
                        relation: relationDelta,
                        mood: moodDelta,
                        teamLevel: teamDelta,
                    });
                    this.state.isEventActive = false;
                    this.updateAll();
                },
            },
        ]);
    },
    // ====================== 游戏结束检查 ======================
    checkGameOver: function () {
        if (this.state.gameOver) return;

        console.log('检查游戏结束:', {
            spirit: this.state.spirit,
            playerCount: this.state.playerList.length,
            mood: this.state.mood,
            relation: this.state.relation,
        });

        let reason = '';
        let message = '';

        if (this.state.spirit <= 0) {
            this.state.spirit = 0;
            reason = '精神力归零';
            message = '业余球队这么卷干什么，又不是打奥运会！';
        } else if (this.state.playerList.length < 5) {
            reason = '球员不足';
            message = '凑不齐首发九人……解散吧。';
        } else if (this.state.mood <= 0) {
            this.state.mood = 0;
            reason = '队内气氛归零';
            message = '大家见面都不打招呼了。';
        } else if (this.state.relation <= 0) {
            this.state.relation = 0;
            reason = '人际关系归零';
            message = '和队员连普通朋友都算不上了……';
        } else {
            return; // 游戏未结束
        }

        // 游戏结束
        this.state.gameOver = true;

        // 使用统一的统计函数
        const stats = this.getGameOverStats(reason, message);

        this.showGameOverModal(reason, message, stats);
    },

    // ====================== 获取游戏结束统计数据 ======================
    getGameOverStats: function (reason, message) {
        console.log('【调试】stats对象:', this.state.stats);
        console.log('【调试】maxPlayers:', this.state.stats?.maxPlayers);
        console.log('【调试】当前球员数:', this.state.playerList.length);
        // 计算存活天数
        const startDate = this.state.stats?.startDate || this.state.seasonStartDate;
        const endDate = this.state.currentDate;
        const daysSurvived = Math.floor((endDate - startDate) / (1000 * 3600 * 24));

        // 计算死党和仇敌对数
        let deadFriendPairs = 0;
        let enemyPairs = 0;
        for (let i = 0; i < this.state.playerList.length; i++) {
            for (let j = i + 1; j < this.state.playerList.length; j++) {
                let value = this.getRelationshipValue(this.state.playerList[i], this.state.playerList[j]);
                if (value >= 61) deadFriendPairs++;
                if (value <= -60) enemyPairs++;
            }
        }

        // 小团体数量
        const factionsCount = this.getActiveFactions().length;

        // ===== 修改：从 matchHistory 获取总比赛数据 =====
        const totalMatches = this.state.matchHistory.length;
        const wins = this.state.matchHistory.filter((m) => m.win).length;
        const losses = totalMatches - wins;
        const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
        // ===== 结束 =====
        return {
            reason: reason,
            message: message,
            daysSurvived: daysSurvived,
            maxPlayers: this.state.stats?.maxPlayers || this.state.playerList.length,
            deadFriendPairs: deadFriendPairs,
            enemyPairs: enemyPairs,
            factionsCount: factionsCount,
            totalMatches: totalMatches,
            wins: wins,
            losses: losses,
            winRate: winRate,
        };
    },
    // ====================== 游戏结束弹窗 ======================
    showGameOverModal: function (reason, message, stats) {
        this.state.isEventActive = true;
        UI.updateButtons();

        // ===== 如果没有传入 stats，现场计算（兼容旧调用） =====
        if (!stats) {
            stats = this.getGameOverStats(reason, message);
        }
        // ===== 结束 =====

        // 构建统计数据的HTML
        const statsHtml = `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px dashed #ffcdd2;">
                <div style="font-size: 16px; font-weight: bold; color: #c62828; margin-bottom: 12px; text-align: center;">
                    📊 赛季数据
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                    <div style="background: #fff5f5; padding: 8px; border-radius: 6px;">
                        <span style="color: #666;">⏱️ 存活天数</span><br>
                        <span style="font-size: 18px; font-weight: bold; color: #c62828;">${stats.daysSurvived}天</span>
                    </div>
                    <div style="background: #fff5f5; padding: 8px; border-radius: 6px;">
                        <span style="color: #666;">👥 最多球员</span><br>
                        <span style="font-size: 18px; font-weight: bold; color: #c62828;">${stats.maxPlayers}人</span>
                    </div>
                    <div style="background: #fff5f5; padding: 8px; border-radius: 6px;">
                        <span style="color: #666;">💕 死党</span><br>
                        <span style="font-size: 18px; font-weight: bold; color: #c62828;">${
                            stats.deadFriendPairs
                        }对</span>
                    </div>
                    <div style="background: #fff5f5; padding: 8px; border-radius: 6px;">
                        <span style="color: #666;">💢 仇敌</span><br>
                        <span style="font-size: 18px; font-weight: bold; color: #c62828;">${stats.enemyPairs}对</span>
                    </div>
                    <div style="background: #fff5f5; padding: 8px; border-radius: 6px;">
                        <span style="color: #666;">👥 小团体</span><br>
                        <span style="font-size: 18px; font-weight: bold; color: #c62828;">${
                            stats.factionsCount
                        }个</span>
                    </div>
                    <div style="background: #fff5f5; padding: 8px; border-radius: 6px; grid-column: span 2;">
                        <div style="display: flex; justify-content: space-around; text-align: center;">
                            <div>
                                <span style="color: #666;">⚾ 总场次</span><br>
                                <span style="font-size: 16px; font-weight: bold; color: #c62828;">${
                                    stats.totalMatches
                                }</span>
                            </div>
                            <div>
                                <span style="color: #666;">🏆 胜场</span><br>
                                <span style="font-size: 16px; font-weight: bold; color: #2e7d32;">${stats.wins}</span>
                            </div>
                            <div>
                                <span style="color: #666;">🌧️ 负场</span><br>
                                <span style="font-size: 16px; font-weight: bold; color: #c62828;">${stats.losses}</span>
                            </div>
                            <div>
                                <span style="color: #666;">📊 胜率</span><br>
                                <span style="font-size: 16px; font-weight: bold; color: ${
                                    stats.winRate >= 50 ? '#2e7d32' : '#c62828'
                                };">${stats.winRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        let desc = `
            <div style="text-align:center;">
                <div style="margin-bottom: 15px;">
                    <span style="background:#ffebee; padding:6px 12px; border-radius:20px; color:#c62828; font-weight:bold;">${reason}</span>
                </div>
                <div style="text-align:center; font-size: 14px; color: #333;">${message}</div>
                ${statsHtml}
            </div>
        `;

        // ===== 唯一需要修改的地方：把按钮的 onclick 改一下 =====
        const modal = document.getElementById('resultModal');
        modal.innerHTML = `
            <div class="event-modal-content" style="max-width: 500px;">
                <h2 class="event-modal-title" style="color: #c62828;">💔 游戏结束</h2>
                <div class="event-modal-desc" style="max-height: none; overflow: visible; padding: 0 10px;">${desc}</div>
                <div class="event-modal-buttons" style="margin-top: 10px;">
                    <!-- 把原来的 UI.closeResultModal() 改成这个简单的函数 -->
                    <button onclick="Game.simpleCloseModal()" style="background:#e24070;">确定</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';

        document.getElementById('gameOverArea').innerHTML = `<div class="game-over">💔 ${reason}，游戏结束！</div>`;
    },

    // ===== 新增一个超级简单的关闭函数 =====
    simpleCloseModal: function () {
        const modal = document.getElementById('resultModal');
        if (modal) {
            modal.style.display = 'none';
            modal.innerHTML = '';
        }
        this.state.isEventActive = false;
        // 不调用任何可能推进日期的函数
        // 不更新按钮（保持禁用状态）
    },

    closeGameOverModal: function () {
        document.getElementById('eventModal').style.display = 'none';
        document.getElementById('eventModal').innerHTML = '';
        this.state.isEventActive = false;
        this.startGame();
    },

    clampFounderAttributes: function () {
        // 精神力限制 0-100
        if (this.state.spirit > 100) this.state.spirit = 100;
        if (this.state.spirit < 0) this.state.spirit = 0;

        // 球技限制 0-100
        if (this.state.skill > 100) this.state.skill = 100;
        if (this.state.skill < 0) this.state.skill = 0;

        // 人际关系限制 0-100
        if (this.state.relation > 100) this.state.relation = 100;
        if (this.state.relation < 0) this.state.relation = 0;
    },

    // ====================== 更新所有UI ======================
    // ====================== 更新倒计时显示 ======================
    updateCountdownDisplay: function () {
        const countdownEl = document.getElementById('eventCountdown');
        const countdownText = document.getElementById('countdownText');

        if (!countdownEl || !countdownText) return;

        if (!this.state.countdown || !this.state.countdown.type) {
            countdownEl.style.display = 'none';
            return;
        }

        // 重新计算剩余天数（考虑日期可能变化）
        const today = new Date(this.state.currentDate);
        const targetDate = this.state.countdown.targetDate;
        const daysLeft = Math.ceil((targetDate - today) / (1000 * 3600 * 24));

        this.state.countdown.daysLeft = daysLeft;

        // 如果已经过了目标日期，隐藏倒计时
        if (daysLeft < 0) {
            countdownEl.style.display = 'none';
            return;
        }

        // 根据赛事类型设置不同样式和文案
        if (this.state.countdown.type === 'xizhao') {
            countdownEl.className = 'countdown-bar xizhao';
            countdownText.innerHTML = `⚾ 距离曦照女子棒球赛还有 <strong style="font-size: 20px; margin: 0 5px;">${daysLeft}</strong> 天 ⚾`;
        } else if (this.state.countdown.type === 'national') {
            countdownEl.className = 'countdown-bar national';
            countdownText.innerHTML = `🏆 距离全国女子棒球城市联赛还有 <strong style="font-size: 20px; margin: 0 5px;">${daysLeft}</strong> 天 🏆`;
        }

        countdownEl.style.display = 'block';
    },

    updateAll: function () {
        if (this.state.gameStarted && !this.state.gameOver) {
            const beforeCount = this.state.playerList.length;
            this.state.playerList = this.state.playerList.filter((p) => p.loyalty > 0);

            if (beforeCount !== this.state.playerList.length) {
                console.log(`【过滤】移除了 ${beforeCount - this.state.playerList.length} 名忠诚度归零的球员`);
                UI.updatePlayersList();
                UI.renderRelationshipNetwork();
                UI.renderFactionsList();
            }
        }

        if (!this.state.gameStarted) return;

        // ✅ 添加这一行：限制创始人属性范围
        this.clampFounderAttributes();

        if (this.state.relation > 100) this.state.relation = 100;
        if (this.state.mood > 100) this.state.mood = 100;

        this.checkRelationAndWarn();
        this.checkMoodAndWarn();
        this.checkSkillAndWarn();
        this.checkTeamLevelAndWarn();
        this.checkSpiritWarnings();

        if (this.state.gameOver) {
            document.getElementById('spirit').innerText = this.state.spirit;
            document.getElementById('skill').innerText = this.state.skill;
            document.getElementById('relation').innerText = this.state.relation;
            document.getElementById('players').innerText = this.state.playerList.length;
            document.getElementById('mood').innerText = this.state.mood;
            document.getElementById('teamLevel').innerText = this.state.teamLevel;
            UI.updateButtons();
            UI.updatePlayersList();
            UI.updateMatchHistory();
            return;
        }

        this.checkGameOver();
        // ✨✨✨ 在这里添加曦照赛报名检查 ✨✨✨
        let month = this.state.currentDate.getMonth() + 1;
        let day = this.state.currentDate.getDate();

        // 如果是4月4日，且还没报名过，直接触发报名
        if (month === 4 && day === 4 && !this.state.hasXiZhaoEventThisYear) {
            console.log('4月4日到了，触发曦照赛报名');
            this.triggerXiZhaoChoose();
            return; // 触发后直接返回，不再继续检查其他事件
        }
        // ===== 新增：全国大赛触发检查 =====
        // 7月1日：开始全国大赛（如果有资格）
        if (month === 7 && day === 1 && this.state.national.canJoin && !this.state.national.inProgress) {
            console.log('🏆 全国大赛开始！');
            this.startNationalTournament();
            return;
        }

        // ✨ 在这里添加！重新计算球队实力和气氛
        this.updateTeamLevel();
        this.updateMoodFromRelationships();

        document.getElementById('spirit').innerText = this.state.spirit;
        document.getElementById('skill').innerText = this.state.skill;
        document.getElementById('relation').innerText = this.state.relation;
        document.getElementById('players').innerText = this.state.playerList.length;
        document.getElementById('mood').innerText = this.state.mood;
        document.getElementById('teamLevel').innerText = this.state.teamLevel;

        let dateStr = this.formatDate(this.state.currentDate);
        let status = this.state.isWeekend ? '周末' : '工作日';
        document.getElementById('dateInfo').innerText = `日期：${dateStr} | 状态：${status}`;

        let actText = this.state.isWeekend ? '🏖️ 周末行动' : `💼 工作日剩余行动：${this.state.weekdayActionsLeft}`;
        let matchText = this.state.hasBookedFriendlyMatch ? '本周已预约' : '本周未预约';
        document.getElementById('actionInfo').innerText = `${actText} | 友谊赛：${matchText}`;

        UI.updateButtons();
        UI.updatePlayersList();
        UI.updateMatchHistory();
        UI.updateSlackOffButton();

        if (!this.state.isEventActive && !this.state.gameOver && this.state.gameStarted) {
            this.checkRandomEvent();
            this.checkRecruitEvent();
            this.checkXiZhaoEvent();
        }

        UI.renderRelationshipNetwork();
        UI.renderFactionsList();
        // ===== 新增：更新倒计时 =====
        this.updateCountdownDisplay();
        // ===== 结束 =====
    },
    // ====================== 曦照赛系统 ======================
    checkXiZhaoEvent: function () {
        if (this.state.gameOver || this.state.isWeekend || this.state.isEventActive) return;
        let month = this.state.currentDate.getMonth() + 1,
            day = this.state.currentDate.getDate();

        // 5月1日：开始比赛（如果报名了）
        if (month === 5 && day === 1 && this.state.willJoinXiZhao && !this.state.xiZhaoInProgress) {
            this.state.xiZhaoInProgress = true;
            this.state.xiZhaoStatus = this.state.XIZHAO_STATUS.DAY1;
            this.state.isEventActive = true;

            // 延迟一点执行，确保状态完全设置好
            setTimeout(() => {
                this.playCurrentXiZhaoMatch();
            }, 100);
        }
    },

    triggerXiZhaoChoose: function () {
        this.state.isEventActive = true;
        this.state.hasXiZhaoEventThisYear = true;
        this.updateAll(); // 更新按钮状态

        UI.showChoiceModal(
            '🏆 曦照女子棒球赛 报名通知',
            `现在是4月初，官方开启了「曦照女子棒球赛」报名通道，比赛将在5月初举行。曦照赛冠亚军可获资格报名7月份全国大赛。是否报名？`,
            [
                {
                    text: '✅ 报名参赛',
                    run: () => {
                        this.state.willJoinXiZhao = true;
                        // ===== 新增：设置曦照赛倒计时 =====
                        // 当前日期是4月4日，曦照赛5月1日开始
                        const today = new Date(this.state.currentDate);
                        const xiZhaoDate = new Date(2024, 4, 1); // 5月1日
                        const daysLeft = Math.ceil((xiZhaoDate - today) / (1000 * 3600 * 24));

                        this.state.countdown = {
                            type: 'xizhao',
                            targetDate: xiZhaoDate,
                            daysLeft: daysLeft,
                        };
                        this.updateCountdownDisplay();
                        // ===== 结束 =====

                        UI.addLog('📝 球队成功报名曦照女子棒球赛！', {});
                        UI.showResultModal('✅ 报名成功', '报名通过了！5月1日-3日迎战！', {});
                        // ✅ 添加：报名完成后释放锁定
                        UI.modalState.xiZhaoActive = false;
                        this.state.isEventActive = false;
                        this.updateAll(); // ← 关键：手动刷新UI
                    },
                },
                {
                    text: '❌ 放弃参赛',
                    run: () => {
                        this.state.willJoinXiZhao = false;
                        UI.showFloat('mood', -5);
                        UI.addLog('🚫 放弃参加曦照赛');
                        UI.showResultModal('❌ 放弃参赛', '大家有点遗憾。');
                        // ✅ 添加：放弃后也释放锁定
                        UI.modalState.xiZhaoActive = false;
                        this.state.isEventActive = false;
                        this.updateAll(); // ← 关键：手动刷新UI
                    },
                },
            ]
        );
    },

    runXiZhaoTournament: function () {
        this.state.xiZhaoInProgress = true;
        this.state.xiZhaoStatus = this.state.XIZHAO_STATUS.DAY1;
        this.state.isEventActive = true;
        this.playCurrentXiZhaoMatch();
    },

    // 修改 playCurrentXiZhaoMatch 函数
    playCurrentXiZhaoMatch: function () {
        let day;
        switch (this.state.xiZhaoStatus) {
            case this.state.XIZHAO_STATUS.DAY1:
                day = 1;
                break;
            case this.state.XIZHAO_STATUS.DAY2:
                day = 2;
                break;
            case this.state.XIZHAO_STATUS.DAY3:
                day = 3;
                break;
            default:
                return;
        }
        // ===== 新增：清除曦照赛倒计时（放在这里！）=====
        // 只在第一天清除倒计时
        if (day === 1) {
            this.state.countdown = { type: null };
            this.updateCountdownDisplay();
        }
        // ===== 结束 =====

        let oldMood = this.state.mood;

        let opponent = this.state.xiZhaoOpponents[day - 1];
        let win = Math.random() < this.calculateWinRate();
        let teamScore = win ? this.randomDelta(3, 8) : this.randomDelta(0, 3);
        let oppScore = win ? this.randomDelta(0, 2) : this.randomDelta(4, 9);

        let matchDesc = '';
        if (win) {
            let descs = [
                '全队打线爆发，安打串联！',
                '投手精彩完投，表现完美！',
                '关键局打出再见安打！',
                '守备滴水不漏，零失误！',
                '开局就领先，一路保持优势',
            ];
            matchDesc = descs[Math.floor(Math.random() * descs.length)];
            this.matchVictoryRelationships();
        } else {
            let descs = [
                '打线被对方投手压制',
                '守备出现几次失误',
                '比分紧咬，可惜最后被逆转',
                '开局落后，追分不及',
                '得点圈机会没能把握',
            ];
            matchDesc = descs[Math.floor(Math.random() * descs.length)];
            this.matchLossRelationships();
            this.afterMatchLoss();
            this.checkSkillGapAfterLoss();
        }

        this.state.xiZhaoMatches.push({ day, opponent, win, teamScore, oppScore });
        this.addMatchRecord(
            new Date(
                this.state.currentDate.getFullYear(),
                this.state.currentDate.getMonth(),
                this.state.currentDate.getDate() + (day - 1)
            ),
            opponent,
            teamScore,
            oppScore,
            win,
            true,
            'xizhao'
        );
        this.state.seasonMatchCount++;
        if (win) this.state.seasonWinCount++;

        this.updateMoodFromRelationships();
        let moodDelta = this.state.mood - oldMood;

        let currentWins = this.state.xiZhaoMatches.filter((m) => m.win).length;
        let currentLosses = this.state.xiZhaoMatches.length - currentWins;

        // 使用新的曦照赛专用弹窗
        if (day < 3) {
            // 第1、2天：显示比赛结果，有"明日再战"按钮
            UI.showXiZhaoMatchModal(
                day,
                opponent,
                win,
                teamScore,
                oppScore,
                matchDesc,
                moodDelta,
                currentWins,
                currentLosses,
                this.state.xiZhaoOpponents[day] // 下一个对手
            );
        } else {
            // 第3天：直接进入总结
            this.finishXiZhaoTournament();
        }
    },

    // 修改 finishXiZhaoTournament 函数
    finishXiZhaoTournament: function () {
        let oldMood = this.state.mood;
        let oldTeamLevel = this.state.teamLevel;
        let oldRelation = this.state.relation;
        let oldSpirit = this.state.spirit;

        let wins = this.state.xiZhaoMatches.filter((m) => m.win).length;
        // ===== 新增：检查是否获得全国赛资格 =====
        if (wins >= 1) {
            // 前三名（1-3胜）
            this.state.national.canJoin = true;

            // 设置全国赛倒计时
            const today = new Date(this.state.currentDate); // 5月3日
            const nationalDate = new Date(2024, 6, 1); // 7月1日
            const daysLeft = Math.ceil((nationalDate - today) / (1000 * 3600 * 24));

            this.state.countdown = {
                type: 'national',
                targetDate: nationalDate,
                daysLeft: daysLeft,
            };
            this.updateCountdownDisplay();

            console.log('🎉 获得全国大赛参赛资格！');
        }
        // ===== 结束 =====
        let rewards =
            wins === 3
                ? { spirit: 25, relation: 30 }
                : wins === 2
                ? { spirit: 15, relation: 18 }
                : wins === 1
                ? { spirit: 8, relation: 10 }
                : { spirit: -8, relation: -5 };

        if (wins >= 2) {
            this.matchVictoryRelationships();
        } else if (wins <= 1) {
            this.matchLossRelationships();
        }

        this.state.spirit += rewards.spirit || 0;
        this.state.relation += rewards.relation || 0;

        if (wins > 0) {
            this.batchUpdatePlayers(
                this.state.playerList,
                () => this.randomDelta(3, 8),
                () => this.randomDelta(5, 12)
            );
        }

        this.updateMoodFromRelationships();

        let moodDelta = this.state.mood - oldMood;
        let teamDelta = this.state.teamLevel - oldTeamLevel;
        let relationDelta = this.state.relation - oldRelation;
        let spiritDelta = this.state.spirit - oldSpirit;

        UI.showFloat('mood', moodDelta);
        UI.showFloat('teamLevel', teamDelta);
        UI.showFloat('spirit', spiritDelta);
        UI.showFloat('relation', relationDelta);

        // 使用曦照赛总结弹窗
        UI.showXiZhaoSummaryModal(wins, this.state.xiZhaoMatches, moodDelta, teamDelta, spiritDelta, relationDelta);

        // 记录日志
        UI.addLog(
            `🏆【曦照赛】${wins}胜 ${wins === 3 ? '冠军' : wins === 2 ? '亚军' : wins === 1 ? '季军' : '未获奖'}`,
            {
                mood: moodDelta,
                teamLevel: teamDelta,
                spirit: spiritDelta,
                relation: relationDelta,
            }
        );
    },

    // ====================== 全国大赛 ======================
    startNationalTournament: function () {
        this.state.national.inProgress = true;
        this.state.national.day = 1;
        this.state.national.matches = [];
        this.state.national.rewards.spirit = 0;
        this.state.national.rewards.relation = 0;
        // ===== 新增：清除全国赛倒计时 =====
        this.state.countdown = { type: null };
        this.updateCountdownDisplay();
        // ===== 结束 =====
        this.state.isEventActive = true;

        // 延迟一点开始第一场比赛
        setTimeout(() => {
            this.playNationalMatch(1);
        }, 100);
    },

    playNationalMatch: function (day) {
        // 保存赛前状态
        let oldMood = this.state.mood;
        let oldTeamLevel = this.state.teamLevel;
        let oldRelation = this.state.relation;
        let oldSpirit = this.state.spirit;
        let oldSkill = this.state.skill;

        let opponent = this.state.national.opponents[day - 1];
        let winRate = this.calculateWinRate() + 0.1; // 全国大赛胜率加成
        let win = Math.random() < winRate;

        // 生成比分
        let teamScore = win ? this.randomDelta(4, 10) : this.randomDelta(0, 4);
        let oppScore = win ? this.randomDelta(0, 3) : this.randomDelta(5, 12);

        // 根据胜负产生不同影响
        if (win) {
            this.nationalVictory(day, opponent);
        } else {
            this.nationalLoss(day, opponent);
        }

        // 记录比赛
        this.state.national.matches.push({
            day: day,
            opponent: opponent.name,
            win: win,
            teamScore: teamScore,
            oppScore: oppScore,
        });

        // ===== 修改：使用正确的日期 =====
        // 全国赛从7月1日开始，第day天就是 7月1日 + (day-1)天
        let matchDate = new Date(2024, 6, 1); // 7月1日
        matchDate.setDate(matchDate.getDate() + (day - 1)); // 加上天数偏移
        // ===== 新增：添加到比赛历史 =====
        this.addMatchRecord(
            matchDate, // 当前日期
            opponent.name, // 对手
            teamScore, // 我方得分
            oppScore, // 对方得分
            win, // 是否胜利
            true, // 是大赛（用true标记，或者新增一个类型）
            'national' // 新增参数：比赛类型
        );

        // 重新计算球队实力和气氛
        this.updateTeamLevel();
        this.updateMoodFromRelationships();

        // 计算变化
        let changes = {
            mood: this.state.mood - oldMood,
            teamLevel: this.state.teamLevel - oldTeamLevel,
            relation: this.state.relation - oldRelation,
            spirit: this.state.spirit - oldSpirit,
            skill: this.state.skill - oldSkill,
        };

        // 累计奖励（用于总结）
        this.state.national.rewards.spirit += changes.spirit;
        this.state.national.rewards.relation += changes.relation;

        // 记录到赛季统计
        this.state.seasonMatchCount++;
        if (win) this.state.seasonWinCount++;

        // 显示比赛结果
        if (day < 5) {
            UI.showNationalMatchModal({
                day: day,
                opponent: opponent,
                win: win,
                teamScore: teamScore,
                oppScore: oppScore,
                changes: changes,
                nextOpponent: this.state.national.opponents[day],
            });
        } else {
            // 最后一天，直接进入总结
            this.finishNationalTournament();
        }
    },

    nationalVictory: function (day, opponent) {
        // 1. 所有球员球技提升
        this.state.playerList.forEach((player) => {
            let skillUp = this.randomDelta(3, 6);
            player.skill = Math.min(100, player.skill + skillUp);
            setTimeout(() => UI.showPlayerFloat(player.id, 'skill', skillUp), 10);

            // 忠诚度提升
            let loyaltyUp = this.randomDelta(2, 5);
            player.loyalty = Math.min(100, player.loyalty + loyaltyUp);
            setTimeout(() => UI.showPlayerFloat(player.id, 'loyalty', loyaltyUp), 10);
        });

        // 2. 创始人成长
        let founderSkillUp = this.randomDelta(4, 8);
        let founderSpiritUp = this.randomDelta(5, 10);
        this.state.skill += founderSkillUp;
        this.state.spirit += founderSpiritUp;

        // 3. 关系提升
        for (let i = 0; i < this.state.playerList.length; i++) {
            for (let j = i + 1; j < this.state.playerList.length; j++) {
                if (Math.random() < 0.3) {
                    let relUp = this.randomDelta(3, 6);
                    this.modifyRelationship(this.state.playerList[i], this.state.playerList[j], relUp);
                }
            }
        }

        UI.addLog(`🏆 全国大赛第${day}日战胜${opponent.name}`, {
            skill: founderSkillUp,
            spirit: founderSpiritUp,
        });
    },

    nationalLoss: function (day, opponent) {
        // 1. 部分球员有少量成长
        this.state.playerList.forEach((player) => {
            if (Math.random() < 0.6) {
                let skillUp = this.randomDelta(1, 3);
                player.skill = Math.min(100, player.skill + skillUp);
                setTimeout(() => UI.showPlayerFloat(player.id, 'skill', skillUp), 10);
            }

            // 可能忠诚度下降
            if (Math.random() < 0.3) {
                let loyaltyDown = -this.randomDelta(2, 4);
                player.loyalty = Math.max(0, player.loyalty + loyaltyDown);
                setTimeout(() => UI.showPlayerFloat(player.id, 'loyalty', loyaltyDown), 10);
            }
        });

        // 2. 创始人少量成长，但精力下降
        let founderSkillUp = this.randomDelta(1, 3);
        let founderSpiritDown = -this.randomDelta(3, 8);
        this.state.skill += founderSkillUp;
        this.state.spirit += founderSpiritDown;

        // 3. 关系可能变差
        for (let i = 0; i < this.state.playerList.length; i++) {
            for (let j = i + 1; j < this.state.playerList.length; j++) {
                if (Math.random() < 0.1) {
                    let relDown = -this.randomDelta(2, 4);
                    this.modifyRelationship(this.state.playerList[i], this.state.playerList[j], relDown);
                }
            }
        }

        UI.addLog(`🌧️ 全国大赛第${day}日惜败${opponent.name}`, {
            spirit: founderSpiritDown,
            skill: founderSkillUp,
        });
    },

    finishNationalTournament: function () {
        let wins = this.state.national.matches.filter((m) => m.win).length;

        // 计算最终排名
        let rank = '';
        let rankColor = '';
        if (wins === 5) {
            rank = '🏆 全国冠军';
            rankColor = '#FFD700';
        } else if (wins === 4) {
            rank = '🥈 全国亚军';
            rankColor = '#C0C0C0';
        } else if (wins === 3) {
            rank = '🥉 全国季军';
            rankColor = '#CD7F32';
        } else if (wins === 2) {
            rank = '全国第四';
            rankColor = '#4A90E2';
        } else if (wins === 1) {
            rank = '全国第五';
            rankColor = '#50C878';
        } else {
            rank = '全国第六';
            rankColor = '#9CA3AF';
        }

        // 显示总结弹窗
        UI.showNationalSummaryModal({
            rank: rank,
            rankColor: rankColor,
            wins: wins,
            matches: this.state.national.matches,
            spiritReward: this.state.national.rewards.spirit,
            relationReward: this.state.national.rewards.relation,
        });
    },

    handleNationalNextDay: function () {
        // 关闭当前弹窗
        document.getElementById('nationalModal').style.display = 'none';
        document.getElementById('nationalModal').innerHTML = '';

        // 进入下一天
        this.state.national.day++;

        // 进行下一场比赛
        setTimeout(() => {
            Game.playNationalMatch(Game.state.national.day);
        }, 100);
    },

    // ====================== 处理曦照赛结束 ======================
    handleXiZhaoFinish: function () {
        // 关闭曦照赛弹窗
        document.getElementById('xiZhaoModal').style.display = 'none';
        document.getElementById('xiZhaoModal').innerHTML = '';

        // 设置日期到5月4日
        this.state.currentDate = new Date(2024, 4, 4);
        this.state.isWeekend = this.checkIfWeekend();
        this.state.weekdayActionsLeft = 5;
        this.state.hasBookedFriendlyMatch = false;
        this.state.bookedThisWeek = false;

        // 结束曦照赛状态
        this.state.xiZhaoInProgress = false;
        this.state.xiZhaoStatus = this.state.XIZHAO_STATUS.FINISHED;

        this.state.isEventActive = false;
        UI.modalState.xiZhaoActive = false;
        UI.modalState.activeModal = null;

        this.state.eventQueue = [];
        this.state.processingQueue = false;

        // 清除曦照赛倒计时，保留全国赛倒计时
        if (this.state.countdown && this.state.countdown.type === 'xizhao') {
            this.state.countdown = { type: null };
            this.updateCountdownDisplay();
        }

        this.updateAll();
        UI.updateButtons();
    },

    handleNationalFinish: function () {
        // 关闭总结弹窗
        document.getElementById('nationalModal').style.display = 'none';
        document.getElementById('nationalModal').innerHTML = '';

        // 设置日期到7月6日
        this.state.currentDate = new Date(2024, 6, 6); // 月份从0开始，6=7月
        this.state.isWeekend = this.checkIfWeekend();
        this.state.weekdayActionsLeft = 5;
        this.state.hasBookedFriendlyMatch = false;
        this.state.bookedThisWeek = false;

        // 结束全国大赛状态
        this.state.national.inProgress = false;
        this.state.isEventActive = false;
        // ===== 新增：清除全国赛倒计时 =====
        this.state.countdown = { type: null };
        this.updateCountdownDisplay();
        // ===== 结束 =====

        // 刷新游戏
        this.updateAll();
        UI.updateButtons();
    },
    // ====================== 随机事件检查 ======================
    checkRandomEvent: function () {
        // 临时修复：每天最多触发一次随机事件
        if (this.state._lastEventDate && this.formatDate(this.state.currentDate) === this.state._lastEventDate) {
            return; // 今天已经触发过事件了
        }
        if (this.state.isWeekend || this.state.gameOver || this.state.isEventActive || !this.state.gameStarted) return;
        if (this.state.randomEventCountThisWeek >= this.state.maxRandomEventPerWeek) return;
        if (this.state.daysSinceLastEvent < 3) return;

        if (Math.random() < 0.22) {
            // 从 RANDOM_EVENT_POOL 中随机选择一个事件
            let eventTemplate = RANDOM_EVENT_POOL[Math.floor(Math.random() * RANDOM_EVENT_POOL.length)];

            // 记录冷却
            let lastDate = this.state.randomEventCooldown.get(eventTemplate.title);
            if (lastDate) {
                let daysSince = Math.floor((this.state.currentDate - lastDate) / (1000 * 3600 * 24));
                if (daysSince < 15) return;
            }
            this.state.randomEventCooldown.set(eventTemplate.title, new Date(this.state.currentDate));

            // 根据事件类型处理
            if (eventTemplate.title === '😠 两名队友吵起来了') {
                let players = eventTemplate.getPlayers();
                if (players.length < 2) return;
                let p1 = players[0],
                    p2 = players[1];
                UI.showChoiceModal(eventTemplate.title, eventTemplate.getDesc(), eventTemplate.choices(p1, p2));
            } else if (eventTemplate.title === '💘 有队友向你表白！') {
                let isCrush = Math.random() > 0.5;
                UI.showChoiceModal(eventTemplate.title, eventTemplate.desc, eventTemplate.generateChoices(isCrush));
            } else if (eventTemplate.title === '🏡 前队友想归队') {
                let departedPlayer = eventTemplate.getDepartedPlayer();
                if (!departedPlayer) return;
                UI.showChoiceModal(eventTemplate.title, eventTemplate.getDesc(), eventTemplate.choices(departedPlayer));
            } else if (eventTemplate.title === '👥 队员带了朋友来玩球') {
                let introducer = eventTemplate.getIntroducer();
                if (!introducer) return;
                UI.showChoiceModal(eventTemplate.title, eventTemplate.desc, eventTemplate.choices(introducer));
            } else {
                UI.showChoiceModal(eventTemplate.title, eventTemplate.desc, eventTemplate.choices);
            }

            this.state.randomEventCountThisWeek++;
            this.state.daysSinceLastEvent = 0;
            this.state.isEventActive = true;
            UI.updateButtons();
        }
    },

    // ====================== 招募事件检查 ======================
    checkRecruitEvent: function () {
        if (this.state.gameOver || this.state.isWeekend || this.state.isEventActive || !this.state.gameStarted) return;

        // 检查冷却时间
        if (this.state.lastRecruitTime) {
            let daysSinceLastRecruit = Math.floor(
                (this.state.currentDate - this.state.lastRecruitTime) / (1000 * 3600 * 24)
            );
            let baseCooldown =
                this.state.spiritDoubleTime &&
                Math.floor((this.state.currentDate - this.state.spiritDoubleTime) / (1000 * 3600 * 24)) < 30
                    ? this.randomDelta(5, 15)
                    : this.randomDelta(3, 7);
            if (daysSinceLastRecruit < baseCooldown) return;
        }

        // 随机触发招募（20%概率）
        if (Math.random() < 0.2) {
            // 从 RECRUIT_POOL 中过滤出可招募的球员
            let availableRecruits = RECRUIT_POOL.filter((recruit) => {
                // 1. 检查介绍人是否在队中
                let hasIntroducer = this.state.playerList.some((p) => p.name === recruit.introducerName);
                if (!hasIntroducer) return false;

                // 2. 检查历史上是否已经招募过（只能招募一次）
                if (this.state.recruitedOriginalNames.has(recruit.name)) {
                    return false;
                }

                // 3. 检查当前是否有同名球员
                let hasSameName = this.state.playerList.some((p) => p.name === recruit.name);

                return !hasSameName;
            });

            // 如果没有可招募的球员，就不触发
            if (availableRecruits.length === 0) {
                return;
            }

            // 从可招募的球员中随机选择一个
            let recruit = availableRecruits[Math.floor(Math.random() * availableRecruits.length)];
            // 找到介绍人
            let introducer = this.state.playerList.find((p) => p.name === recruit.introducerName);

            // 触发招募弹窗
            this.showRecruitModal(recruit, introducer);
            this.state.lastRecruitTime = new Date(this.state.currentDate);
        }
    },

    // ====================== 新增：每天开始时检查随机事件 ======================
    checkDailyRandomEvent: function () {
        // 每天开始时检查随机事件
        if (this.state.gameOver || this.state.isEventActive || !this.state.gameStarted) return;

        // 只在工作日触发（周末不触发随机事件）
        if (this.state.isWeekend) return;

        // 本周已达上限
        if (this.state.randomEventCountThisWeek >= this.state.maxRandomEventPerWeek) return;

        // 冷却检查（距离上次事件至少3天）
        if (this.state.daysSinceLastEvent < 3) return;

        // 22%概率触发
        if (Math.random() < 0.22) {
            // ✅ 完全复制原来的 checkRandomEvent 中的内容
            // 从 RANDOM_EVENT_POOL 中随机选择一个事件
            let eventTemplate = RANDOM_EVENT_POOL[Math.floor(Math.random() * RANDOM_EVENT_POOL.length)];

            // 记录冷却
            let lastDate = this.state.randomEventCooldown.get(eventTemplate.title);
            if (lastDate) {
                let daysSince = Math.floor((this.state.currentDate - lastDate) / (1000 * 3600 * 24));
                if (daysSince < 15) return;
            }
            this.state.randomEventCooldown.set(eventTemplate.title, new Date(this.state.currentDate));

            // 根据事件类型处理
            if (eventTemplate.title === '😠 两名队友吵起来了') {
                let players = eventTemplate.getPlayers();
                if (players.length < 2) return;
                let p1 = players[0],
                    p2 = players[1];
                UI.showChoiceModal(eventTemplate.title, eventTemplate.getDesc(), eventTemplate.choices(p1, p2));
            } else if (eventTemplate.title === '💘 有队友向你表白！') {
                let isCrush = Math.random() > 0.5;
                UI.showChoiceModal(eventTemplate.title, eventTemplate.desc, eventTemplate.generateChoices(isCrush));
            } else if (eventTemplate.title === '🏡 前队友想归队') {
                let departedPlayer = eventTemplate.getDepartedPlayer();
                if (!departedPlayer) return;
                UI.showChoiceModal(eventTemplate.title, eventTemplate.getDesc(), eventTemplate.choices(departedPlayer));
            } else if (eventTemplate.title === '👥 队员带了朋友来玩球') {
                let introducer = eventTemplate.getIntroducer();
                if (!introducer) return;
                UI.showChoiceModal(eventTemplate.title, eventTemplate.desc, eventTemplate.choices(introducer));
            } else {
                UI.showChoiceModal(eventTemplate.title, eventTemplate.desc, eventTemplate.choices);
            }

            this.state.randomEventCountThisWeek++;
            this.state.daysSinceLastEvent = 0;
            this.state.isEventActive = true;
            UI.updateButtons();
        }
    },

    // ====================== 新增：每天行动后检查招募事件 ======================
    checkRecruitAfterAction: function () {
        // 每天行动结束后检查招募事件
        if (this.state.gameOver || this.state.isEventActive || !this.state.gameStarted) return;

        // 只在工作日触发（周末不触发招募）
        if (this.state.isWeekend) return;

        // ✅ 完全复制原来的 checkRecruitEvent 中的内容
        // 检查冷却时间
        if (this.state.lastRecruitTime) {
            let daysSinceLastRecruit = Math.floor(
                (this.state.currentDate - this.state.lastRecruitTime) / (1000 * 3600 * 24)
            );
            let baseCooldown =
                this.state.spiritDoubleTime &&
                Math.floor((this.state.currentDate - this.state.spiritDoubleTime) / (1000 * 3600 * 24)) < 30
                    ? this.randomDelta(5, 15)
                    : this.randomDelta(3, 7);
            if (daysSinceLastRecruit < baseCooldown) return;
        }

        // 随机触发招募（20%概率）
        if (Math.random() < 0.2) {
            // 从 RECRUIT_POOL 中过滤出可招募的球员
            let availableRecruits = RECRUIT_POOL.filter((recruit) => {
                // 1. 检查介绍人是否在队中
                let hasIntroducer = this.state.playerList.some((p) => p.name === recruit.introducerName);
                if (!hasIntroducer) return false;

                // 2. 检查历史上是否已经招募过（只能招募一次）
                if (this.state.recruitedOriginalNames.has(recruit.name)) {
                    return false;
                }

                // 3. 检查当前是否有同名球员
                let hasSameName = this.state.playerList.some((p) => p.name === recruit.name);

                return !hasSameName;
            });

            // 如果没有可招募的球员，就不触发
            if (availableRecruits.length === 0) {
                return;
            }

            // 从可招募的球员中随机选择一个
            let recruit = availableRecruits[Math.floor(Math.random() * availableRecruits.length)];
            // 找到介绍人
            let introducer = this.state.playerList.find((p) => p.name === recruit.introducerName);

            // 触发招募弹窗
            this.showRecruitModal(recruit, introducer);
            this.state.lastRecruitTime = new Date(this.state.currentDate);
        }
    },

    // ====================== 显示招募弹窗 ======================
    showRecruitModal: function (recruit, introducer) {
        // 检查是否是双人事件（林桃和江蓠的特殊事件）
        let isBestFriendEvent = false,
            bestFriendRecruit1 = null,
            bestFriendRecruit2 = null;
        if (CONSTANTS.BEST_FRIENDS.includes(recruit.name) && !this.state.isBestFriendsEvent && Math.random() < 0.2) {
            let otherFriendName = CONSTANTS.BEST_FRIENDS.find((name) => name !== recruit.name);
            let otherFriend = RECRUIT_POOL.find((r) => r.name === otherFriendName);

            let otherIntroducerExists = this.state.playerList.some((p) => p.name === otherFriend.introducerName);

            if (otherIntroducerExists) {
                isBestFriendEvent = true;
                this.state.isBestFriendsEvent = true;
                bestFriendRecruit1 = recruit;
                bestFriendRecruit2 = otherFriend;
            }
        }

        let title, desc;

        if (isBestFriendEvent) {
            let intro1 = this.state.playerList.find((p) => p.name === bestFriendRecruit1.introducerName);
            let intro2 = this.state.playerList.find((p) => p.name === bestFriendRecruit2.introducerName);

            title = '👭 好朋友一起来申请！';

            // 生成准确数值
            let loyalty1 = this.randomDelta(bestFriendRecruit1.loyaltyRange[0], bestFriendRecruit1.loyaltyRange[1]);
            let skill1 = this.randomDelta(bestFriendRecruit1.skillRange[0], bestFriendRecruit1.skillRange[1]);
            let loyalty2 = this.randomDelta(bestFriendRecruit2.loyaltyRange[0], bestFriendRecruit2.loyaltyRange[1]);
            let skill2 = this.randomDelta(bestFriendRecruit2.skillRange[0], bestFriendRecruit2.skillRange[1]);

            desc = `「${bestFriendRecruit1.name}」和「${bestFriendRecruit2.name}」是一起打球的好朋友，想一起加入球队！<br><br>
                ${bestFriendRecruit1.name}：${bestFriendRecruit1.personality}<br>
                ❤️ 忠诚度：${loyalty1}<br>
                ⚡ 球技：${skill1}<br>
                👋 介绍人：${bestFriendRecruit1.introducerName}（${intro1.name}）<br><br>
                ${bestFriendRecruit2.name}：${bestFriendRecruit2.personality}<br>
                ❤️ 忠诚度：${loyalty2}<br>
                ⚡ 球技：${skill2}<br>
                👋 介绍人：${bestFriendRecruit2.introducerName}（${intro2.name}）`;
        } else {
            title = '👥 收到新人入队申请';

            // 生成准确数值
            let loyalty = this.randomDelta(recruit.loyaltyRange[0], recruit.loyaltyRange[1]);
            let skill = this.randomDelta(recruit.skillRange[0], recruit.skillRange[1]);

            desc = `「${recruit.name}」的自我介绍：<br><br>
                “${recruit.personality}”<br><br>
                ❤️ 忠诚度：${loyalty}<br>
                ⚡ 球技：${skill}<br><br>
                👋 <strong>介绍人：${recruit.introducerName}（${introducer.name}）</strong>`;
        }

        UI.showChoiceModal(title, desc, [
            {
                text: '✅ 同意',
                run: () => {
                    let oldMood = this.state.mood; // 保存旧的 mood

                    if (isBestFriendEvent) {
                        // ✅ 使用双人招募处理器
                        this.handleDoubleRecruit(bestFriendRecruit1, bestFriendRecruit2);
                    } else {
                        // ✅ 1. 先添加球员（不触发效果）
                        let newPlayer = this.addNewPlayerWithPersonality(recruit);

                        // ✅ 2. 再处理招募效果（通过 yesEffect）
                        if (recruit.yesEffect) {
                            recruit.yesEffect(this.state, introducer);
                        }

                        // ✅ 3. 重新计算 mood（确保）
                        this.updateMoodFromRelationships();
                        let moodDelta = this.state.mood - oldMood;

                        // ✅ 4. 显示结果弹窗
                        UI.showResultModal(
                            '✅ 新队员加入',
                            `${recruit.name}加入了球队！由${introducer.name}介绍入队，两人成为了朋友。<br><br>` +
                                `📊 队内气氛变化: ${moodDelta > 0 ? '+' : ''}${moodDelta}`,
                            { mood: moodDelta, players: 1 }
                        );
                    }
                },
            },
            {
                text: '❌ 拒绝',
                run: () => {
                    let oldMood = this.state.mood; // 保存旧的 mood
                    let oldRelation = this.state.relation;
                    let oldTeamLevel = this.state.teamLevel;

                    if (isBestFriendEvent) {
                        let intro1 = this.state.playerList.find((p) => p.name === bestFriendRecruit1.introducerName);
                        let intro2 = this.state.playerList.find((p) => p.name === bestFriendRecruit2.introducerName);

                        if (bestFriendRecruit1.noEffect) {
                            bestFriendRecruit1.noEffect(this.state, intro1);
                        }
                        if (bestFriendRecruit2.noEffect) {
                            bestFriendRecruit2.noEffect(this.state, intro2);
                        }

                        if (intro1 && intro2 && intro1.id !== intro2.id) {
                            let relDelta = -this.randomDelta(5, 10);
                            this.modifyRelationship(intro1, intro2, relDelta);
                            UI.addLog(`💔 因推荐被拒，${intro1.name}和${intro2.name}的关系也变差了`, {});
                        }
                    } else {
                        if (recruit.noEffect) {
                            recruit.noEffect(this.state, introducer);
                        } else {
                            UI.addLog(`❌ 拒绝了${recruit.name}`, {});
                        }
                    }

                    // 重新计算 mood
                    this.updateMoodFromRelationships();
                    let moodDelta = this.state.mood - oldMood;
                    let relationDelta = this.state.relation - oldRelation;
                    let teamDelta = this.state.teamLevel - oldTeamLevel;

                    this.state.isBestFriendsEvent = false;

                    // 显示拒绝结果弹窗
                    let changes = [];
                    if (moodDelta !== 0) changes.push(`队内气氛: ${moodDelta > 0 ? '+' : ''}${moodDelta}`);
                    if (relationDelta !== 0) changes.push(`人际关系: ${relationDelta > 0 ? '+' : ''}${relationDelta}`);
                    if (teamDelta !== 0) changes.push(`球队实力: ${teamDelta > 0 ? '+' : ''}${teamDelta}`);

                    let changesText = changes.length > 0 ? '<br><br>📊 变化：<br>' + changes.join('<br>') : '';

                    UI.showResultModal(
                        '❌ 拒绝申请',
                        `你婉拒了${isBestFriendEvent ? '两人的' : ''}入队申请。${changesText}`,
                        {
                            mood: moodDelta,
                            relation: relationDelta,
                            teamLevel: teamDelta,
                        }
                    );

                    document.getElementById('eventModal').style.display = 'none';
                    document.getElementById('eventModal').innerHTML = '';
                    this.state.isEventActive = false;
                    this.updateAll();
                },
            },
        ]);
    },

    // ====================== 处理双人招募 ======================
    handleDoubleRecruit: function (recruit1, recruit2) {
        let oldMood = this.state.mood;
        let oldTeamLevel = this.state.teamLevel;
        let oldRelation = this.state.relation;

        if (
            this.state.recruitedOriginalNames.has(recruit1.name) ||
            this.state.recruitedOriginalNames.has(recruit2.name)
        ) {
            UI.addLog(`❌ 有球员已经招募过了`, {});
            return;
        }

        if (
            this.state.playerList.some((p) => p.name === recruit1.name) ||
            this.state.playerList.some((p) => p.name === recruit2.name)
        ) {
            UI.addLog(`❌ 有同名球员`, {});
            return;
        }

        let intro1 = this.state.playerList.find((p) => p.name === recruit1.introducerName);
        let intro2 = this.state.playerList.find((p) => p.name === recruit2.introducerName);

        // ✅ 1. 先添加两个球员（不触发效果）
        let newPlayer1 = this.addNewPlayerWithPersonality(recruit1);
        let newPlayer2 = this.addNewPlayerWithPersonality(recruit2);

        // ✅ 2. 再处理招募效果
        if (recruit1.yesEffect) {
            recruit1.yesEffect(this.state, intro1);
        }
        if (recruit2.yesEffect) {
            recruit2.yesEffect(this.state, intro2);
        }

        UI.addLog(`👭 ${recruit1.name}和${recruit2.name}加入！`, {});
        this.state.isBestFriendsEvent = false;

        // ✅ 3. 处理介绍人之间的关系
        if (intro1 && intro2 && intro1.id !== intro2.id) {
            this.modifyRelationship(intro1, intro2, this.randomDelta(15, 25));
            UI.addLog(`👥 因介绍新人，${intro1.name}和${intro2.name}也成为了朋友`, {});
        }

        // ✅ 4. 重新计算所有属性
        this.updateTeamLevel();
        this.updateMoodFromRelationships();

        // ✅ 5. 计算实际变化量
        let moodDelta = this.state.mood - oldMood;
        let teamDelta = this.state.teamLevel - oldTeamLevel;
        let relationDelta = this.state.relation - oldRelation;

        // ✅ 6. 显示变化
        UI.showFloat('mood', moodDelta);
        UI.showFloat('teamLevel', teamDelta);
        UI.showFloat('relation', relationDelta);

        // ✅ 7. 显示结果弹窗
        UI.showResultModal(
            '👭 好友入队',
            `${recruit1.name}和${recruit2.name}一起加入了球队！<br><br>` +
                `${recruit1.name}由${intro1.name}介绍<br>` +
                `${recruit2.name}由${intro2.name}介绍<br><br>` +
                `📊 队内气氛变化: ${moodDelta > 0 ? '+' : ''}${moodDelta}<br>` +
                `📊 球队实力变化: ${teamDelta > 0 ? '+' : ''}${teamDelta}<br>` +
                `📊 人际关系变化: ${relationDelta > 0 ? '+' : ''}${relationDelta}`,
            { mood: moodDelta, teamLevel: teamDelta, relation: relationDelta, players: 2 }
        );
    },

    // ====================== 工作日行动 ======================
    slackOff: function () {
        let ds = this.applySpiritChange(this.randomDelta(20, 30));
        let dSkill = -this.randomDelta(5, 10);
        let dr = -this.randomDelta(4, 8);

        this.state.spirit += ds;
        this.state.skill += dSkill;
        this.state.relation += dr;

        // 保存旧的气氛值
        let oldMood = this.state.mood;
        let oldTeamLevel = this.state.teamLevel;

        if (this.state.playerList.length > 0) {
            let sortedPlayers = [...this.state.playerList].sort((a, b) => a.loyalty - b.loyalty);
            let targetIdx = Math.floor(Math.random() * Math.min(3, sortedPlayers.length));
            let player = sortedPlayers[targetIdx];

            // 降低忠诚度影响
            let baseDelta = -this.randomDelta(5, 10);
            let loyaltyFactor = 1 + (1 - player.loyalty / 100);
            let loyaltyDelta = Math.floor(baseDelta * loyaltyFactor);

            // 设置更合理的上下限
            loyaltyDelta = Math.max(-20, Math.min(-5, loyaltyDelta));

            player.loyalty = Math.max(0, player.loyalty + loyaltyDelta);

            // 这名球员与其他球员的关系下降
            this.state.playerList.forEach((other) => {
                if (other.id !== player.id) {
                    let relDelta = -this.randomDelta(2, 5);
                    this.modifyRelationship(player, other, relDelta);
                }
            });

            UI.updatePlayersList();
            setTimeout(() => UI.showPlayerFloat(player.id, 'loyalty', loyaltyDelta), 20);
            UI.addLog(`😴 摸鱼摆烂，${player.name}忠诚度${loyaltyDelta}，与队友关系恶化`, {});
            this.checkPlayerLoyaltyAndWarn(player);
        }

        // 重新计算气氛
        this.updateMoodFromRelationships();
        this.updateTeamLevel();

        // 计算实际变化量
        let teamLevelDelta = this.state.teamLevel - oldTeamLevel;

        UI.showFloat('spirit', ds);
        UI.showFloat('skill', dSkill);
        UI.showFloat('teamLevel', teamLevelDelta);
        UI.showFloat('relation', dr);

        UI.addLog('🛌 摸鱼摆烂', {
            spirit: ds,
            skill: dSkill,
            teamLevel: teamLevelDelta,
            relation: dr,
        });

        this.finishAction();
    },

    talkToOtherTeam: function () {
        this.state.talkToOtherTeamCount++;
        let ds = this.applySpiritChange(-this.randomDelta(15, 20));
        let dr = this.randomDelta(8, 15);

        this.state.spirit += ds;
        this.state.relation += dr;

        UI.showFloat('spirit', ds);
        UI.showFloat('relation', dr);
        UI.addLog('🤝 和其他球队交流', { spirit: ds, relation: dr });

        this.finishAction();
    },

    encourageTeam: function () {
        console.log('encourageTeam 被调用');

        let ds = this.applySpiritChange(-this.randomDelta(15, 25));
        console.log('精神力变化 ds =', ds);

        let dr = this.randomDelta(5, 10);

        this.state.spirit += ds;
        this.state.relation += dr;

        console.log('当前精神力 =', this.state.spirit);

        // 保存旧的气氛值
        let oldMood = this.state.mood;

        // 所有球员忠诚度 +3~8
        this.batchUpdatePlayers(this.state.playerList, () => this.randomDelta(3, 8), null);

        // 重新计算气氛
        this.updateMoodFromRelationships();

        // 计算实际变化量
        let moodDelta = this.state.mood - oldMood;

        UI.showFloat('spirit', ds);
        UI.showFloat('relation', dr);

        UI.addLog('📣 队内公开鼓励', {
            spirit: ds,
            relation: dr,
        });

        console.log('准备调用 finishAction');
        this.finishAction();
    },

    socialMedia: function () {
        let ds = this.applySpiritChange(-this.randomDelta(10, 15));
        let dr = this.randomDelta(8, 15);

        this.state.spirit += ds;
        this.state.relation += dr;

        // 保存旧的气氛值
        let oldMood = this.state.mood;

        // 新增：球队知名度提升，随机2-3名球员忠诚度上升
        if (this.state.playerList.length > 0) {
            let shuffled = [...this.state.playerList].sort(() => 0.5 - Math.random());
            let affectedPlayers = shuffled.slice(0, Math.min(3, shuffled.length));

            affectedPlayers.forEach((player) => {
                let loyaltyIncrease = this.randomDelta(3, 6);
                player.loyalty = Math.min(100, player.loyalty + loyaltyIncrease);
                setTimeout(() => UI.showPlayerFloat(player.id, 'loyalty', loyaltyIncrease), 10);
            });

            console.log(`社交媒体提升忠诚度的球员: ${affectedPlayers.map((p) => p.name).join('、')}`);
        }

        // 新增：随机1-2对普通关系变成朋友
        if (this.state.playerList.length >= 2) {
            let shuffled = [...this.state.playerList].sort(() => 0.5 - Math.random());
            let p1 = shuffled[0];
            let p2 = shuffled[1];

            let currentRel = this.getRelationshipValue(p1, p2);
            if (currentRel < 30 && currentRel > -30) {
                let increase = this.randomDelta(10, 20);
                this.modifyRelationship(p1, p2, increase);
                UI.addLog(`📱 ${p1.name}和${p2.name}因为共同话题成为朋友`, {});
            }
        }

        // 重新计算气氛
        this.updateMoodFromRelationships();

        // 计算实际变化量
        let moodDelta = this.state.mood - oldMood;

        UI.showFloat('spirit', ds);
        UI.showFloat('relation', dr);
        UI.showFloat('mood', moodDelta); // 显示实际变化量

        UI.addLog('📱 发小红书录播客', {
            spirit: ds,
            relation: dr,
            mood: moodDelta, // 记录实际变化量
        });

        this.finishAction();
    },

    handleTeamStuff: function () {
        let oldTeamLevel = this.state.teamLevel;
        let ds = this.applySpiritChange(-this.randomDelta(8, 15));
        let dr = this.randomDelta(5, 10);

        this.state.spirit += ds;
        this.state.relation += dr;

        UI.showFloat('spirit', ds);
        UI.showFloat('relation', dr);
        UI.addLog('🧾 处理球队杂事', { spirit: ds, relation: dr });

        this.finishAction();
    },

    // ====================== 制定训练计划 ======================
    makeTrainPlan: function () {
        // 保存旧值
        let oldTeamLevel = this.state.teamLevel;
        let oldSpirit = this.state.spirit;
        let oldSkill = this.state.skill;

        // 创始人属性变化
        let ds = this.applySpiritChange(-this.randomDelta(8, 12)); // 精神力 -8~12
        let dk = this.randomDelta(2, 5); // 创始人球技 +2~5

        this.state.spirit += ds;
        this.state.skill += dk;

        // 增加本周训练计划次数（影响周末训练）
        this.state.trainPlanCountThisWeek++;

        // 随机1名球员属性变化（60%增益/40%减益）
        this.randomUpdatePlayerAttr();

        // 重新计算球队实力（基于所有成员的最新球技）
        this.updateTeamLevel();

        // 计算实际变化量
        let spiritDelta = this.state.spirit - oldSpirit;
        let skillDelta = this.state.skill - oldSkill;
        let teamLevelDelta = this.state.teamLevel - oldTeamLevel;

        // 显示浮动数字
        UI.showFloat('spirit', spiritDelta);
        UI.showFloat('skill', skillDelta);
        if (teamLevelDelta !== 0) {
            UI.showFloat('teamLevel', teamLevelDelta);
        }

        // 记录日志
        let logData = {
            spirit: spiritDelta,
            skill: skillDelta,
        };
        if (teamLevelDelta !== 0) {
            logData.teamLevel = teamLevelDelta;
        }
        UI.addLog('📚 进行技术理论学习', logData);

        // 构建弹窗消息
        let message = `你花时间研究了新的棒球技术理论，本周末训练效果会更好！<br>`;
        message += `✨ 你的球技 ${skillDelta > 0 ? '+' : ''}${skillDelta}<br>`;
        if (teamLevelDelta !== 0) {
            message += `📊 球队实力 ${teamLevelDelta > 0 ? '+' : ''}${teamLevelDelta}`;
        }

        // 显示结果弹窗
        UI.showResultModal('📚 技术理论学习', message, {
            spirit: spiritDelta,
            skill: skillDelta,
            teamLevel: teamLevelDelta !== 0 ? teamLevelDelta : undefined,
        });

        // ✅ 设置标志，等结果弹窗关闭后再执行 finishAction
        window.pendingFinishAction = true;
    },

    // ====================== 自主训练 ======================
    selfTrain: function (selectedPlayers) {
        if (selectedPlayers) {
            // 如果有传入球员，直接执行训练
            this.executeSelfTrain(selectedPlayers);
        } else {
            // 否则打开选择弹窗
            UI.openSelfTrainPlayerSelect();
        }
    },

    // ====================== 自主训练 ======================
    executeSelfTrain: function (selectedPlayers) {
        let success = true;
        let failReason = '';

        if (Math.random() < 0.04) {
            success = false;
            failReason = '突然下大雨';
        } else if (Math.random() < 0.03) {
            success = false;
            failReason = '场地被其他队伍预定了';
        }

        // 保存旧的值
        let oldMood = this.state.mood;
        let oldTeamLevel = this.state.teamLevel; // ✅ 添加这行

        if (success) {
            // 自主训练成功 - 数值更新
            let ds = this.applySpiritChange(-this.randomDelta(15, 20));
            let dk = this.randomDelta(5, 10);
            let dm = this.randomDelta(3, 7);

            // 更新创始人属性
            this.state.spirit += ds;
            this.state.skill += dk;

            // 更新球员属性
            let playerSkillLogs = [];
            let relationshipLogs = [];

            if (selectedPlayers && selectedPlayers.length === 2) {
                let p1 = selectedPlayers[0];
                let p2 = selectedPlayers[1];

                let skillDelta1 = this.randomDelta(2, 5);
                let skillDelta2 = this.randomDelta(2, 5);
                p1.skill = Math.min(100, p1.skill + skillDelta1);
                p2.skill = Math.min(100, p2.skill + skillDelta2);

                // 一起训练，关系增加
                let relationIncrease = this.trainTogether(p1, p2);
                this.checkSkillGapDuringTrain(p1, p2);

                playerSkillLogs.push(`${p1.name}+${skillDelta1}, ${p2.name}+${skillDelta2}`);
                relationshipLogs.push(`❤️ 关系+${relationIncrease}`);

                setTimeout(() => UI.showPlayerFloat(p1.id, 'skill', skillDelta1), 20);
                setTimeout(() => UI.showPlayerFloat(p2.id, 'skill', skillDelta2), 30);
            } else if (selectedPlayers && selectedPlayers.length === 1) {
                let p = selectedPlayers[0];
                let skillDelta = this.randomDelta(3, 7);
                p.skill = Math.min(100, p.skill + skillDelta);
                playerSkillLogs.push(`${p.name}+${skillDelta}`);
                setTimeout(() => UI.showPlayerFloat(p.id, 'skill', skillDelta), 20);
                relationshipLogs.push(`👤 独自训练，无关系变化`);
            }

            // 重新计算球队实力和气氛
            this.updateTeamLevel();
            this.updateMoodFromRelationships();

            // 计算实际变化量
            let moodDelta = this.state.mood - oldMood;
            // ✅ 修正这里：用正确的计算方式
            let teamLevelDelta = this.state.teamLevel - oldTeamLevel;

            // 更新UI
            UI.updatePlayersList();
            UI.showFloat('spirit', ds);
            UI.showFloat('skill', dk);
            UI.showFloat('mood', moodDelta);
            UI.showFloat('teamLevel', teamLevelDelta); // ✅ 这一行本来就是对的

            let playersText = selectedPlayers.length > 0 ? selectedPlayers.map((p) => p.name).join('、') : '没有队友';
            // ✅ 修改这里：在日志中添加球员球技和关系变化
            let playerSkillText = playerSkillLogs.length > 0 ? `球员球技: ${playerSkillLogs.join('，')}` : '';

            let relationshipText = relationshipLogs.length > 0 ? `球员关系: ${relationshipLogs.join('，')}` : '';

            let logMessage = `🏃 自主训练成功（和${playersText}一起）`;
            if (playerSkillText) {
                logMessage += ` | ${playerSkillText}`;
            }
            if (relationshipText) {
                logMessage += ` | ${relationshipText}`;
            }
            // ✅ 使用 logMessage 记录日志
            UI.addLog(logMessage, {
                spirit: ds,
                skill: dk,
                mood: moodDelta,
                teamLevel: teamLevelDelta,
            });

            this.state.isEventActive = true;
            UI.updateButtons();

            let playerSkillHtml =
                playerSkillLogs.length > 0
                    ? `<div style="margin-top:10px;"><strong>✨ 球员球技提升</strong><br>${playerSkillLogs
                          .map((s) => `⚾ ${s}`)
                          .join('　')}</div>`
                    : '';

            let relationshipHtml =
                relationshipLogs.length > 0
                    ? `<div style="margin-top:10px;"><strong>💞 球员关系变化</strong><br>${relationshipLogs
                          .map((s) => `✨ ${s}`)
                          .join('<br>')}</div>`
                    : '';

            UI.showResultModal(
                '🏃 自主训练成功',
                `和${playersText}一起训练，效果不错！${playerSkillHtml}${relationshipHtml}`,
                { spirit: ds, skill: dk, mood: moodDelta, teamLevel: teamLevelDelta }
            );
        } else {
            // 训练失败
            let dm = -this.randomDelta(5, 10);
            let dr = -this.randomDelta(8, 15);

            this.state.relation += dr;

            // 重新计算气氛（虽然失败，但关系可能已经变化）
            this.updateMoodFromRelationships();

            // 计算实际变化量
            let moodDelta = this.state.mood - oldMood;

            UI.addLog(`🏃 自主训练失败：${failReason}`, { mood: moodDelta, relation: dr });

            this.afterTrainFail(selectedPlayers, failReason);

            UI.showFloat('mood', moodDelta); // 显示实际变化量
            UI.showFloat('relation', dr);

            let playerLoyaltyLogs = [];
            if (selectedPlayers && selectedPlayers.length > 0) {
                selectedPlayers.forEach((player, index) => {
                    let loyaltyDelta = -this.randomDelta(2, 5);
                    player.loyalty = Math.max(0, player.loyalty + loyaltyDelta);
                    setTimeout(() => UI.showPlayerFloat(player.id, 'loyalty', loyaltyDelta), 20 + index * 10);
                    playerLoyaltyLogs.push(`${player.name}${loyaltyDelta}`);
                    this.checkPlayerLoyaltyAndWarn(player);
                });
                UI.updatePlayersList();
            }

            this.state.isEventActive = true;
            UI.updateButtons();

            let playerLoyaltyHtml =
                playerLoyaltyLogs.length > 0
                    ? `<div style="margin-top:10px;"><strong>😔 队友感到失望</strong><br>${playerLoyaltyLogs
                          .map((s) => `💔忠诚 ${s}`)
                          .join('　')}</div>`
                    : '';

            UI.showResultModal(
                '🏃 自主训练失败',
                `${failReason}，训练取消。${
                    selectedPlayers.length > 0 ? '和你约好的队友们有点失望。' : ''
                }${playerLoyaltyHtml}`,
                { mood: moodDelta, relation: dr }
            );
        }

        // 标记需要结束行动
        window.pendingFinishAction = true;
    },

    checkSkillGapDuringTrain: function (p1, p2) {
        let skillGap = Math.abs(p1.skill - p2.skill);

        if (skillGap > 30 && Math.random() < 0.3) {
            let higher = p1.skill > p2.skill ? p1 : p2;
            let lower = p1.skill > p2.skill ? p2 : p1;

            if (Math.random() < 0.5) {
                this.modifyRelationship(higher, lower, -this.randomDelta(2, 5));
                UI.addLog(`😒 ${higher.name}觉得${lower.name}训练拖后腿`, {});
            } else {
                this.modifyRelationship(lower, higher, -this.randomDelta(2, 5));
                UI.addLog(`😒 ${lower.name}觉得${higher.name}太出风头`, {});
            }
        }
    },

    afterTrainFail: function (selectedPlayers, reason) {
        let factions = this.getActiveFactions();
        if (factions.length === 0) return;

        factions.forEach((faction) => {
            let factionMembersInTrain = faction.members.filter((m) => selectedPlayers.includes(m));
            if (factionMembersInTrain.length === 0) return;

            if (reason.includes('下雨') || reason.includes('场地')) {
                if (factionMembersInTrain.length >= 2) {
                    let p1 = factionMembersInTrain[0];
                    let p2 = factionMembersInTrain[1];
                    this.modifyRelationship(p1, p2, -this.randomDelta(2, 5));
                    UI.addLog(`😒 ${p1.name}和${p2.name}互相抱怨运气不好`, {});
                }
            } else {
                let outsiders = this.state.playerList.filter(
                    (p) => !faction.members.includes(p) && !selectedPlayers.includes(p)
                );
                if (outsiders.length === 0) return;

                let scapegoat = outsiders[Math.floor(Math.random() * outsiders.length)];

                faction.members.forEach((member) => {
                    let delta = -this.randomDelta(3, 8);
                    this.modifyRelationship(member, scapegoat, delta);
                });

                UI.addLog(`😠 ${faction.members[0].name}的小团体觉得训练组团失败是因为${scapegoat.name}放鸽子`, {});
            }
        });
    },

    // ====================== 友谊赛 ======================
    bookFriendlyMatch: function () {
        if (this.state.bookedThisWeek) {
            UI.showResultModal('❌ 约友谊赛', '本周已经约过比赛了，下周再试吧。');
            UI.addLog('❌ 本周已经约过友谊赛了', {});
            this.finishAction();
            return;
        }

        let rate = 0.3;
        if (this.state.talkToOtherTeamCount >= 3) rate = 0.8;
        else if (this.state.talkToOtherTeamCount >= 1) rate = 0.5;

        let ok = Math.random() < rate;

        if (ok) {
            this.state.hasBookedFriendlyMatch = true;
            this.state.bookedThisWeek = true;

            let ds = this.applySpiritChange(this.randomDelta(10, 20));
            this.state.spirit += ds;

            let rInc = this.randomDelta(3, 5);
            let mInc = this.randomDelta(3, 5);
            this.state.relation += rInc;

            UI.showFloat('spirit', ds);
            UI.showFloat('relation', rInc);
            UI.showFloat('mood', mInc);
            UI.addLog('✅ 约友谊赛成功！人际关系提升了', { spirit: ds, relation: rInc });

            if (this.getActiveFactions().length > 0) {
                this.checkResourceConflict();
            }

            UI.showResultModal('✅ 约友谊赛成功', `成功约到比赛！人际关系 +${rInc}`, {
                relation: rInc,
                mood: mInc,
            });
        } else {
            let ds = this.applySpiritChange(-this.randomDelta(10, 20));
            this.state.spirit += ds;
            UI.showFloat('spirit', ds);

            let failMsg = this.state.bookFailMessages[Math.floor(Math.random() * this.state.bookFailMessages.length)];
            UI.addLog(`❌ 约友谊赛失败：${failMsg}`, { spirit: ds });

            if (this.getActiveFactions().length > 0) {
                this.checkResourceConflict();
            }

            UI.showResultModal('❌ 约友谊赛失败', failMsg + '，下次再约吧。');
        }
        this.finishAction();
    },

    // ====================== 友谊赛 ======================
    playFriendlyMatch: function () {
        let ds = this.applySpiritChange(-this.randomDelta(20, 30));
        let winRate = this.calculateWinRate();
        let win = Math.random() < winRate;

        if (win) {
            let spiritGain = this.randomDelta(20, 25);
            ds += spiritGain;
            UI.addLog(`🏆 胜利额外精神力+${spiritGain}`, {});
        }

        this.state.spirit += ds;

        let opponent = this.state.matchOpponents[Math.floor(Math.random() * this.state.matchOpponents.length)];
        let teamScore,
            oppScore,
            highlights = [];

        // 存储变化量
        let teamLevelChange = 0;
        let relationChange = 0;

        // ✅ 保存旧的值（用于计算实际变化）
        let oldTeamLevel = this.state.teamLevel;
        let oldMood = this.state.mood;
        let oldRelation = this.state.relation;
        let oldSkill = this.state.skill;

        if (win) {
            teamScore = this.randomDelta(5, 12);
            oppScore = this.randomDelta(0, 4);

            teamLevelChange = this.randomDelta(10, 15);
            relationChange = this.randomDelta(5, 10);

            this.state.teamLevel += teamLevelChange;
            this.state.relation += relationChange;

            let starPlayer =
                this.state.playerList.length > 0
                    ? this.state.playerList[Math.floor(Math.random() * this.state.playerList.length)]
                    : null;
            if (starPlayer) highlights.push(`${starPlayer.name}打出关键安打`);
            highlights.push(`全队完成${this.randomDelta(2, 5)}次双杀`);

            this.batchUpdatePlayers(
                this.state.playerList,
                () => this.randomDelta(2, 5),
                () => this.randomDelta(3, 8)
            );
            // 创始人属性提升
            this.state.skill += this.randomDelta(2, 5);
            this.state.relation += this.randomDelta(5, 10);
            this.matchVictoryRelationships();
        } else {
            teamScore = this.randomDelta(1, 4);
            oppScore = this.randomDelta(6, 10);

            // 球员属性下降
            if (this.state.playerList.length > 0) {
                let count = Math.min(2, this.state.playerList.length);
                let shuffled = [...this.state.playerList].sort(() => 0.5 - Math.random());
                for (let i = 0; i < count; i++) {
                    let p = shuffled[i];
                    let loyaltyDelta = -this.randomDelta(5, 15);
                    p.loyalty = Math.max(0, p.loyalty + loyaltyDelta);

                    let skillDelta = -this.randomDelta(1, 3);
                    p.skill = Math.max(0, p.skill + skillDelta);

                    setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20 + i * 10);
                    highlights.push(`${p.name}状态不佳`);
                    this.checkPlayerLoyaltyAndWarn(p);
                }
            }

            // 创始人属性下降
            this.state.skill += -this.randomDelta(1, 3);
            this.state.relation += -this.randomDelta(3, 5);

            highlights.push(`打线仅得${teamScore}分`);

            // 全队关系下降（会影响气氛）
            this.matchLossRelationships();
            this.afterMatchLoss();
            this.checkSkillGapAfterLoss();
        }

        // ✅ 关键：重新计算球队实力（包含创始人）
        this.updateTeamLevel();

        // ✅ 关键：重新计算队内气氛（基于所有关系变化）
        this.updateMoodFromRelationships();

        // ✅ 限制属性范围
        this.clampFounderAttributes();

        // ✅ 计算实际变化量（使用重新计算后的值）
        let actualTeamLevelDelta = this.state.teamLevel - oldTeamLevel;
        let actualMoodDelta = this.state.mood - oldMood;
        let actualRelationDelta = this.state.relation - oldRelation;
        let actualSkillDelta = this.state.skill - oldSkill;

        // 更新球员列表UI
        UI.updatePlayersList();

        // 显示浮动数字
        UI.showFloat('spirit', ds);
        UI.showFloat('teamLevel', actualTeamLevelDelta);
        UI.showFloat('relation', actualRelationDelta);
        UI.showFloat('mood', actualMoodDelta);
        if (actualSkillDelta !== 0) {
            UI.showFloat('skill', actualSkillDelta);
        }

        // ✅ 构建变化对象（使用实际变化量）
        let changes = {
            teamLevel: actualTeamLevelDelta,
            relation: actualRelationDelta,
            mood: actualMoodDelta,
            spirit: ds,
            skill: actualSkillDelta !== 0 ? actualSkillDelta : undefined,
        };

        UI.showMatchResultModal(win, teamScore, oppScore, highlights, changes, opponent);

        this.state.hasBookedFriendlyMatch = false;
        window.pendingFinishAction = true;
    },

    afterMatchLoss: function () {
        let factions = this.getActiveFactions();
        if (factions.length === 0) return;

        factions.forEach((faction) => {
            let outsiders = this.state.playerList.filter((p) => !faction.members.includes(p));
            if (outsiders.length === 0) return;

            let scapegoat = outsiders[Math.floor(Math.random() * outsiders.length)];

            faction.members.forEach((member) => {
                let delta = -this.randomDelta(5, 10);
                this.modifyRelationship(member, scapegoat, delta);
            });

            if (scapegoat.faction) {
                faction.members.forEach((m1) => {
                    scapegoat.faction.members.forEach((m2) => {
                        if (m1.id === m2.id) return;
                        let delta = -this.randomDelta(3, 5);
                        this.modifyRelationship(m1, m2, delta);
                    });
                });

                UI.addLog(
                    `⚔️ ${faction.members[0].name}的小团体和${scapegoat.faction.members[0].name}的小团体关系恶化`,
                    {}
                );
            } else {
                UI.addLog(`😤 ${faction.members[0].name}的小团体觉得输球是因为${scapegoat.name}`, {});
            }
        });
        this.checkSkillGapAfterLoss();
    },

    checkSkillGapAfterLoss: function () {
        let pairs = [];
        let players = [...this.state.playerList];

        for (let i = 0; i < 3; i++) {
            if (players.length < 2) break;

            let idx1 = Math.floor(Math.random() * players.length);
            let p1 = players[idx1];
            players.splice(idx1, 1);

            let idx2 = Math.floor(Math.random() * players.length);
            let p2 = players[idx2];
            players.splice(idx2, 1);

            pairs.push([p1, p2]);
        }

        pairs.forEach(([p1, p2]) => {
            let skillGap = Math.abs(p1.skill - p2.skill);

            if (skillGap > 30) {
                this.modifyRelationship(p1, p2, -this.randomDelta(5, 10));
                UI.addLog(`😠 输球后${p1.name}和${p2.name}互相指责`, {});
            }
        });
    },

    // ====================== 资源冲突事件 ======================
    checkResourceConflict: function () {
        let baseChance = 0.2;
        if (this.getActiveFactions().length > 0) baseChance += 0.1;
        if (window.recentConflict) baseChance += 0.1;

        if (Math.random() > baseChance) return;

        let factions = this.getActiveFactions();
        if (factions.length === 0) return;

        let faction = factions[Math.floor(Math.random() * factions.length)];
        let a = faction.members[Math.floor(Math.random() * faction.members.length)];

        let outsiders = this.state.playerList.filter((p) => !faction.members.includes(p));
        if (outsiders.length === 0) return;
        let b = outsiders[Math.floor(Math.random() * outsiders.length)];

        this.showResourceConflictEvent(a, b, faction);
    },

    showResourceConflictEvent: function (a, b, faction) {
        this.state.isEventActive = true;
        UI.updateButtons();

        let desc =
            `距离周末比赛还有两天，${a.name}和${b.name}都希望自己能担任先发投手。<br><br>` +
            `${a.name}的小团体（${faction.members.map((m) => m.name).join('、')}）在背后支持她，训练时有意无意孤立${
                b.name
            }.<br><br>` +
            `你现在需要决定：`;

        let choices = [
            {
                text: `支持 ${a.name}`,
                run: () => {
                    a.loyalty = Math.min(100, a.loyalty + 15);
                    b.loyalty = Math.max(0, b.loyalty - 15);

                    faction.members.forEach((member) => {
                        if (member.id === a.id) return;
                        this.modifyRelationship(member, b, -10);
                    });

                    UI.addLog(`⚖️ 支持${a.name}打先发，${b.name}很不满`, {});
                    UI.showResultModal('⚖️ 决定', `你指定${a.name}为先发投手。${b.name}很不服气，但暂时接受。`, {});

                    window.recentConflict = true;
                    setTimeout(() => {
                        window.recentConflict = false;
                    }, 7 * 24 * 60 * 60 * 1000);
                    this.state.isEventActive = false;
                    this.updateAll();
                },
            },
            {
                text: `支持 ${b.name}`,
                run: () => {
                    a.loyalty = Math.max(0, a.loyalty - 15);
                    b.loyalty = Math.min(100, b.loyalty + 15);

                    faction.members.forEach((member) => {
                        if (member.id === a.id) return;
                        this.modifyRelationship(member, b, 5);
                    });

                    UI.addLog(`⚖️ 支持${b.name}打先发，${a.name}的小团体有点不爽`, {});
                    UI.showResultModal(
                        '⚖️ 决定',
                        `你指定${b.name}为先发投手。${a.name}的小团体虽然不爽，但也没话说。`,
                        {}
                    );

                    window.recentConflict = true;
                    setTimeout(() => {
                        window.recentConflict = false;
                    }, 7 * 24 * 60 * 60 * 1000);
                    this.state.isEventActive = false;
                    this.updateAll();
                },
            },
            {
                text: '轮换制（两人各投一半）',
                run: () => {
                    let ds = this.applySpiritChange(-20);
                    this.state.spirit += ds;

                    a.loyalty = Math.max(0, a.loyalty - 3);
                    b.loyalty = Math.max(0, b.loyalty - 3);

                    faction.members.forEach((member) => {
                        if (member.id === a.id) return;
                        this.modifyRelationship(member, b, -5);
                    });

                    UI.addLog(`🔄 采用轮换制，消耗精力20`, { spirit: ds });
                    UI.showResultModal('🔄 轮换制', `你决定让两人各投一半。两人都有些不满，但至少都上场了。`, {
                        spirit: ds,
                    });

                    window.recentConflict = true;
                    setTimeout(() => {
                        window.recentConflict = false;
                    }, 7 * 24 * 60 * 60 * 1000);
                    this.state.isEventActive = false;
                    this.updateAll();
                },
            },
            {
                text: '让她们自己决定',
                run: () => {
                    this.modifyRelationship(a, b, -15);

                    UI.addLog(`👀 让${a.name}和${b.name}自己决定，两人关系恶化`, {});
                    UI.showResultModal('👀 不干预', `你让她们自己解决。结果两人大吵一架，关系变差了。`, {});

                    window.recentConflict = true;
                    setTimeout(() => {
                        window.recentConflict = false;
                    }, 7 * 24 * 60 * 60 * 1000);
                    this.state.isEventActive = false;
                    this.updateAll();
                },
            },
        ];

        UI.showChoiceModal('⚔️ 谁打先发投手？', desc, choices);
    },

    joinTraining: function () {
        // 创始人属性变化
        let ds = this.applySpiritChange(-this.randomDelta(8, 15));
        let dk = this.randomDelta(3, 8);
        let planBonus = this.state.trainPlanCountThisWeek * 2;

        // 保存旧的球队实力和气氛
        let oldTeamLevel = this.state.teamLevel;
        let oldMood = this.state.mood;

        // 创始人提升
        dk += planBonus;
        this.state.skill += dk;
        this.state.spirit += ds;

        // 随机5名球员球技上升
        let trainedPlayers = [];

        if (this.state.playerList.length > 0) {
            let shuffled = [...this.state.playerList].sort(() => 0.5 - Math.random());
            trainedPlayers = shuffled.slice(0, Math.min(5, shuffled.length));

            trainedPlayers.forEach((player) => {
                let skillIncrease = this.randomDelta(2, 5);
                player.skill = Math.min(100, player.skill + skillIncrease);

                // 训练也会小幅提升忠诚度
                let loyaltyIncrease = this.randomDelta(1, 3);
                player.loyalty = Math.min(100, player.loyalty + loyaltyIncrease);

                setTimeout(() => {
                    UI.showPlayerFloat(player.id, 'skill', skillIncrease);
                    UI.showPlayerFloat(player.id, 'loyalty', loyaltyIncrease);
                }, 10);
            });
        }

        // 重新计算球队实力和气氛
        this.updateTeamLevel();
        this.updateMoodFromRelationships();

        // 计算实际变化量
        let teamLevelDelta = this.state.teamLevel - oldTeamLevel;
        let moodDelta = this.state.mood - oldMood;

        // 更新球员列表UI
        UI.updatePlayersList();

        // 显示浮动数字
        UI.showFloat('spirit', ds);
        UI.showFloat('skill', dk);
        UI.showFloat('teamLevel', teamLevelDelta);
        UI.showFloat('mood', moodDelta);

        // 构建训练球员名单
        let trainedPlayersText = trainedPlayers.length > 0 ? trainedPlayers.map((p) => p.name).join('、') : '无';

        // 构建计划加成显示
        let planBonusText = '';
        if (this.state.trainPlanCountThisWeek > 0) {
            planBonusText = `<br>📚 本周进行了 ${this.state.trainPlanCountThisWeek} 次技术理论学习，额外获得球技 +${planBonus}！`;
        }
        console.log('技术理论学习:', this.state.trainPlanCountThisWeek, '加成:', planBonus, '文字:', planBonusText);
        // 弹窗
        UI.showEventResultModal(
            '🏋️ 参加训练',
            `训练圆满结束！<br><br>` +
                `✨ ${this.state.playerName} 球技 +${dk}<br>` +
                `${planBonusText}<br>` + // 显示计划加成后加换行
                `🎯 ${trainedPlayersText} 球技提升<br>` +
                `📊 球队实力 ${teamLevelDelta > 0 ? '+' : ''}${teamLevelDelta}`,
            {
                spirit: ds,
                skill: dk,
                teamLevel: teamLevelDelta,
            }
        );

        // 日志
        UI.addLog(
            `🏋️ 参加训练 - 精神${ds > 0 ? '+' : ''}${ds} 球技+${dk}${moodDelta} 球队实力${
                teamLevelDelta > 0 ? '+' : ''
            }${teamLevelDelta} `,
            {}
        );

        this.finishAction();
    },

    skipTraining: function () {
        let oldTeamLevel = this.state.teamLevel;
        let ds = this.applySpiritChange(this.randomDelta(25, 40));
        let dSkill = -this.randomDelta(8, 15);
        let dr = -this.randomDelta(10, 20);

        this.state.spirit += ds;
        this.state.skill += dSkill;
        this.state.relation += dr;

        const randomPlayers = [...this.state.playerList].sort(() => 0.5 - Math.random()).slice(0, 2);
        this.batchUpdatePlayers(randomPlayers, () => -this.randomDelta(8, 15), null);

        // 重新计算球队实力和气氛（基于球员属性变化）
        this.updateTeamLevel();
        let teamLevelDelta = this.state.teamLevel - oldTeamLevel;

        UI.addLog(`😜 翘训练摆烂，${randomPlayers.map((p) => p.name).join('、')}忠诚度下降`, {});
        UI.showFloat('spirit', ds);
        UI.showFloat('skill', dSkill);
        UI.showFloat('teamLevel', teamLevelDelta);
        UI.showFloat('relation', dr);
        UI.addLog('😜 翘训练摆烂', { spirit: ds, skill: dSkill, teamLevel: teamLevelDelta, relation: dr });
        UI.showResultModal('😤 翘训练摆烂', `今天不想训练，回家躺平……`, {
            spirit: ds,
            skill: dSkill,
            teamLevel: teamLevelDelta,
            relation: dr,
        });

        this.finishAction();
    },

    // ====================== 开始新游戏 ======================
    showStartGameModal: function () {
        UI.showChoiceModal(
            '⚾ 开始新游戏',
            `
            <div style="padding: 10px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #e24070; font-weight: bold;">你的名字：</label>
                    <input type="text" id="modalPlayerName" value="小酒" style="width: 100%; padding: 8px; border: 1px solid #ffe0e5; border-radius: 6px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #e24070; font-weight: bold;">球队名字：</label>
                    <input type="text" id="modalTeamName" value="巫师" style="width: 100%; padding: 8px; border: 1px solid #ffe0e5; border-radius: 6px;">
                </div>
            </div>
            `,
            [
                {
                    text: '✅ 开始游戏',
                    run: () => {
                        let playerName = document.getElementById('modalPlayerName').value.trim();
                        let teamName = document.getElementById('modalTeamName').value.trim();
                        if (!playerName || !teamName) {
                            alert('请填写名字和球队名');
                            return;
                        }
                        document.getElementById('eventModal').style.display = 'none';
                        document.getElementById('eventModal').innerHTML = '';
                        this.startGameWithName(playerName, teamName);
                    },
                },
                {
                    text: '❌ 取消',
                    run: () => {
                        document.getElementById('eventModal').style.display = 'none';
                        document.getElementById('eventModal').innerHTML = '';
                    },
                },
            ]
        );
    },

    startGameWithName: function (pName, tName) {
        this.state.playerName = pName;
        this.state.teamName = tName;

        // 初始化创始人属性
        this.state.spirit = 100;
        this.state.skill = 20;
        this.state.relation = 50;
        this.state.mood = 50;
        // ===== 关键修复：重置所有日期 =====
        const startDate = new Date(2024, 2, 8); // 2024-03-08
        this.state.currentDate = new Date(startDate);
        this.state.seasonStartDate = new Date(startDate);

        this.state.stats = {
            maxPlayers: this.state.playerList.length,
            startDate: new Date(startDate), // 使用同一个日期
        };
        // ===== 结束 =====

        this.state.isWeekend = this.checkIfWeekend();
        this.state.weekdayActionsLeft = 5;
        this.state.hasBookedFriendlyMatch = false;
        this.state.bookedThisWeek = false;
        this.state.trainPlanCountThisWeek = 0;
        this.state.actionCount = 0;
        this.state.talkToOtherTeamCount = 0;
        this.state.randomEventCountThisWeek = 0;
        this.state.daysSinceLastEvent = 0;
        this.state.hasXiZhaoEventThisYear = false;
        this.state.willJoinXiZhao = false;
        this.state.xiZhaoInProgress = false;
        this.state.xiZhaoStatus = this.state.XIZHAO_STATUS.NOT_STARTED;
        this.state.xiZhaoMatches = [];
        this.state.gameOver = false;
        this.state.gameStarted = true;
        this.state.isEventActive = false;
        this.state.lastRecruitTime = new Date(2024, 2, 8);
        this.state.spiritDoubleTime = null;
        this.state.recruitedPlayersHistory = {};
        this.state.isBestFriendsEvent = false;
        this.state._lastEventDate = null;
        this.state.countdown = { type: null, targetDate: null, daysLeft: 0 };

        if (this.state.recruitedOriginalNames) {
            this.state.recruitedOriginalNames.clear();
        }

        this.state.seasonMatchCount = 0;
        this.state.seasonWinCount = 0;
        this.state.seasonJoinCount = 0;
        this.state.seasonLeaveCount = 0;
        this.state.matchHistory = [];
        this.state.relationWarningShown = false;
        this.state.moodWarningShown = false;
        this.state.playerWarningShown.clear();
        this.state.skillWarningShown = false;
        this.state.skillLowEffectActive = false;
        this.state.teamLevelWarningShown = false;
        this.state.teamLevelLowEffectActive = false;
        this.state.hasShownLargeTeamThresholdAlert = false;
        this.state.tempSelectedPlayerId = null;
        this.state.randomEventCooldown.clear();

        document.getElementById('gameOverArea').innerHTML = '';
        document.getElementById('skillWarningArea').style.display = 'none';
        document.getElementById('teamLevelWarningArea').style.display = 'none';

        // 初始化球员
        this.initPlayers();

        // 计算球队实力（包含创始人）
        this.updateTeamLevel();

        // 确保属性在范围内
        this.clampFounderAttributes();

        // 更新所有UI
        this.updateAll();

        document.getElementById('founderNameDisplay').innerText = this.state.playerName;
        document.getElementById('teamNameDisplay').innerText = this.state.teamName;

        // ✅ 修改这里：使用实际的状态值
        UI.addLog(
            `🎉 ${this.state.playerName} 的 ${this.state.teamName} 业余女子棒球队正式成立！她们喊着友情和羁绊冲过来了！目标是7月全国大赛！`,
            {
                spirit: this.state.spirit, // 100
                skill: this.state.skill, // 20
                relation: this.state.relation, // 50
                mood: this.state.mood, // 50
                teamLevel: this.state.teamLevel, // 计算后的值
                players: this.state.playerList.length, // 9
            }
        );
    },
    // ====================== 初始化函数 ======================
    init: function () {
        console.log('Game.init 被调用');

        // 设置默认值
        let playerNameInput = document.getElementById('playerName');
        let teamNameInput = document.getElementById('teamName');

        if (playerNameInput) {
            playerNameInput.value = '小酒';
        }
        if (teamNameInput) {
            teamNameInput.value = '巫师';
        }

        // ===== 新增：守护定时器 =====
        setInterval(() => {
            // 游戏未开始时不检查
            if (!this.state.gameStarted) return;

            // ⭐ 曦照赛进行中，不干预！（保护曦照赛逻辑）
            if (this.state.xiZhaoInProgress) {
                return;
            }

            // 检查并修复状态不一致
            if (ModalGuard.fixState(this.state)) {
                // 如果修复了状态，更新按钮
                UI.updateButtons();
            }
        }, 500); // 每500ms检查一次
        // ===== 结束：守护定时器 =====
    },
};
// ====================== 导出全局访问 ======================
window.Game = Game;
