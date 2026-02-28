// ====================== 游戏常量 ======================
const GAME = {
    TITLE: '女子棒球 · 从入门到放弃',
    XIZHAO_STATUS: {
        NOT_STARTED: 0,
        DAY1: 1,
        DAY2: 2,
        DAY3: 3,
        FINISHED: 4,
    },
};
// ====================== 招募数据（纯数据） ======================
const RECRUIT_DATA = [
    {
        name: '卡卡',
        personality: '开朗活泼的程序员，总是第一个到球场，喜欢用笑容鼓励大家。',
        loyaltyRange: [30, 70],
        skillRange: [18, 28],
        introducerName: '小马',

        // 招募成功的影响
        effects: {
            relation: 10, // 人际关系变化
            spirit: 0, // 精神力变化
            skill: 0, // 创始人球技变化
            introducerLoyalty: 5, // 介绍人忠诚度变化
        },

        // 招募失败的影响
        noEffects: {
            relation: -3, // 人际关系变化
            spirit: 0, // 精神力变化
            introducerLoyalty: [-5, -10], // 介绍人忠诚度变化范围
        },
    },
    {
        name: '大涂',
        personality: '自由插画师，能守多个位置，性格佛系，追求快乐棒球。',
        loyaltyRange: [30, 70],
        skillRange: [30, 42],
        introducerName: '霏霏',
        effects: {
            relation: 15,
            spirit: 0,
            skill: 0,
            introducerLoyalty: 8,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-8, -12],
        },
    },
    {
        name: '小郁',
        personality: '冷静的审计师，前高校女垒队员。',
        loyaltyRange: [30, 70],
        skillRange: [42, 58],
        introducerName: '老郭',
        effects: {
            relation: -2,
            spirit: -5,
            skill: 0,
            introducerLoyalty: -3,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-5, -8],
        },
    },
    {
        name: '晓晴',
        personality: '生物学博士，现为医学院研究员。',
        loyaltyRange: [30, 70],
        skillRange: [65, 78],
        introducerName: '阿柏',
        effects: {
            relation: -10,
            spirit: -8,
            skill: 0,
            introducerLoyalty: -5,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-10, -15],
        },
    },
    {
        name: '阿雅',
        personality: '温柔的UI设计师，棒球知识丰富，擅长数据分析。',
        loyaltyRange: [30, 70],
        skillRange: [24, 35],
        introducerName: '五零',
        effects: {
            relation: 18,
            spirit: 0,
            skill: 5,
            introducerLoyalty: 10,
        },
        noEffects: {
            relation: -10,
            spirit: 0,
            introducerLoyalty: [-5, -10],
        },
    },
    {
        name: '烈璇',
        personality: '室内设计师，绰号「烈马」，内野拼劲十足。',
        loyaltyRange: [30, 70],
        skillRange: [40, 52],
        introducerName: '阿木',
        effects: {
            relation: 0,
            spirit: 8,
            skill: 0,
            introducerLoyalty: 5,
        },
        noEffects: {
            relation: 0,
            spirit: -10,
            introducerLoyalty: [-8, -12],
        },
    },
    {
        name: '水原琴音',
        personality: '日企市场专员，控球细腻的侧投。',
        loyaltyRange: [30, 70],
        skillRange: [48, 60],
        introducerName: '三习',
        effects: {
            relation: 8,
            spirit: 0,
            skill: 0,
            introducerLoyalty: 6,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-5, -10],
        },
    },
    {
        name: '金敏珠',
        personality: '韩国来的牙医，业余联赛全垒打王。',
        loyaltyRange: [30, 70],
        skillRange: [62, 74],
        introducerName: '之之',
        effects: {
            relation: -5,
            spirit: 0,
            skill: 0,
            introducerLoyalty: -3,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-8, -15],
        },
    },
    {
        name: '思含',
        personality: '大四实习律师，正在考Bar，但每周必到。',
        loyaltyRange: [30, 70],
        skillRange: [35, 45],
        introducerName: '贝尔',
        effects: {
            relation: 12,
            spirit: 5,
            skill: 0,
            introducerLoyalty: 8,
        },
        noEffects: {
            relation: 0,
            spirit: -8,
            introducerLoyalty: [-5, -10],
        },
    },
    {
        name: '阿真',
        personality: '广告策划总监，天赋极佳但容易紧张。',
        loyaltyRange: [30, 70],
        skillRange: [28, 40],
        introducerName: '小马',
        effects: {
            relation: 8,
            spirit: 0,
            skill: 0,
            introducerLoyalty: 5,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-5, -10],
        },
    },
    {
        name: '文君',
        personality: '土木工程师，力量惊人，常常给大家带夜宵。',
        loyaltyRange: [30, 70],
        skillRange: [20, 34],
        introducerName: '霏霏',
        effects: {
            relation: 20,
            spirit: 6,
            skill: 0,
            introducerLoyalty: 10,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-5, -10],
        },
    },
    {
        name: '阿萨',
        personality: '高中体育老师，擅长外野守备，喜欢带新人。',
        loyaltyRange: [30, 70],
        skillRange: [45, 58],
        introducerName: '老郭',
        effects: {
            relation: 10,
            spirit: 0,
            skill: 0,
            introducerLoyalty: 7,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-5, -10],
        },
    },
    {
        name: '沈鹿',
        personality: '兽医，跑垒速度极快，外号「小鹿」。',
        loyaltyRange: [30, 70],
        skillRange: [35, 48],
        introducerName: '阿柏',
        effects: {
            relation: 0,
            spirit: 4,
            skill: 0,
            introducerLoyalty: 5,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-5, -10],
        },
    },
    {
        name: '程橙',
        personality: '平面模特，力量型打者，挥棒姿势很好看。',
        loyaltyRange: [30, 70],
        skillRange: [50, 65],
        introducerName: '五零',
        effects: {
            relation: -2,
            spirit: 0,
            skill: 0,
            introducerLoyalty: -2,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-5, -10],
        },
    },
    {
        name: '陆恬',
        personality: '出版社编辑，性格温柔，队里的气氛调节器。',
        loyaltyRange: [30, 70],
        skillRange: [15, 25],
        introducerName: '阿木',
        effects: {
            relation: 20,
            spirit: 8,
            skill: 0,
            introducerLoyalty: 12,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-8, -15],
        },
    },
    {
        name: '赵荞',
        personality: '前垒球运动员，因伤退役，想用经验帮助球队。',
        loyaltyRange: [30, 70],
        skillRange: [55, 68],
        introducerName: '三习',
        effects: {
            relation: 8,
            spirit: 0,
            skill: 0,
            introducerLoyalty: 6,
        },
        noEffects: {
            relation: 0,
            spirit: 0,
            introducerLoyalty: [-5, -12],
        },
    },
];

// ====================== 招募处理器 ======================
const RecruitProcessor = {
    // 统一处理招募成功
    processYes: function (state, recruit, introducer) {
        // 1. 保存旧值
        let oldMood = state.mood;
        let oldTeamLevel = state.teamLevel;
        let oldRelation = state.relation;
        let oldSpirit = state.spirit;
        let oldSkill = state.skill;

        // 2. 应用效果（除了 teamLevel）
        if (recruit.effects.relation) {
            state.relation += recruit.effects.relation;
        }
        if (recruit.effects.spirit) {
            state.spirit += recruit.effects.spirit;
        }
        if (recruit.effects.skill) {
            state.skill += recruit.effects.skill;
        }

        // 3. 处理介绍人
        if (introducer && recruit.effects.introducerLoyalty) {
            let delta = recruit.effects.introducerLoyalty;
            if (Array.isArray(delta)) {
                delta = Game.randomDelta(delta[0], delta[1]);
            }
            introducer.loyalty = Math.min(100, Math.max(0, introducer.loyalty + delta));
            setTimeout(() => UI.showPlayerFloat(introducer.id, 'loyalty', delta), 150);
        }

        // 4. 重新计算球队实力（基于球员球技）
        Game.updateTeamLevel();

        // 5. 重新计算气氛
        Game.updateMoodFromRelationships();

        // 6. 计算实际变化量
        let moodDelta = state.mood - oldMood;
        let teamLevelDelta = state.teamLevel - oldTeamLevel;
        let relationDelta = state.relation - oldRelation;
        let spiritDelta = state.spirit - oldSpirit;
        let skillDelta = state.skill - oldSkill;

        // 7. 显示变化
        if (moodDelta !== 0) UI.showFloat('mood', moodDelta);
        if (teamLevelDelta !== 0) UI.showFloat('teamLevel', teamLevelDelta);
        if (relationDelta !== 0) UI.showFloat('relation', relationDelta);
        if (spiritDelta !== 0) UI.showFloat('spirit', spiritDelta);
        if (skillDelta !== 0) UI.showFloat('skill', skillDelta);

        // 8. 返回所有变化（用于日志）
        return {
            mood: moodDelta,
            teamLevel: teamLevelDelta,
            relation: relationDelta,
            spirit: spiritDelta,
            skill: skillDelta,
        };
    },

    // 统一处理招募失败
    processNo: function (state, recruit, introducer) {
        // 1. 保存旧值
        let oldMood = state.mood;
        let oldTeamLevel = state.teamLevel;
        let oldRelation = state.relation;
        let oldSpirit = state.spirit;

        // 2. 应用效果
        if (recruit.noEffects.relation) {
            state.relation += recruit.noEffects.relation;
        }
        if (recruit.noEffects.spirit) {
            state.spirit += recruit.noEffects.spirit;
        }

        // 3. 处理介绍人
        if (introducer && recruit.noEffects.introducerLoyalty) {
            let delta = recruit.noEffects.introducerLoyalty;
            if (Array.isArray(delta)) {
                delta = Game.randomDelta(delta[0], delta[1]);
            }
            introducer.loyalty = Math.max(0, introducer.loyalty + delta);
            setTimeout(() => UI.showPlayerFloat(introducer.id, 'loyalty', delta), 150);
        }

        // 4. 重新计算球队实力
        Game.updateTeamLevel();

        // 5. 重新计算气氛
        Game.updateMoodFromRelationships();

        // 6. 计算实际变化量
        let moodDelta = state.mood - oldMood;
        let teamLevelDelta = state.teamLevel - oldTeamLevel;
        let relationDelta = state.relation - oldRelation;
        let spiritDelta = state.spirit - oldSpirit;

        // 7. 显示变化
        if (moodDelta !== 0) UI.showFloat('mood', moodDelta);
        if (teamLevelDelta !== 0) UI.showFloat('teamLevel', teamLevelDelta);
        if (relationDelta !== 0) UI.showFloat('relation', relationDelta);
        if (spiritDelta !== 0) UI.showFloat('spirit', spiritDelta);

        // 8. 返回所有变化
        return {
            mood: moodDelta,
            teamLevel: teamLevelDelta,
            relation: relationDelta,
            spirit: spiritDelta,
        };
    },
};

// ====================== 招募池（动态生成） ======================
const RECRUIT_POOL = RECRUIT_DATA.map((recruit) => ({
    // 复制所有数据字段
    name: recruit.name,
    personality: recruit.personality,
    loyaltyRange: recruit.loyaltyRange,
    skillRange: recruit.skillRange,
    introducerName: recruit.introducerName,

    // 动态生成 yesEffect
    yesEffect: function (state, introducer) {
        let changes = RecruitProcessor.processYes(state, recruit, introducer);

        // 添加日志
        UI.addLog(`✅ ${this.name} 加入球队`, changes);
    },

    // 动态生成 noEffect
    noEffect: function (state, introducer) {
        let changes = RecruitProcessor.processNo(state, recruit, introducer);

        // 添加日志
        UI.addLog(`❌ 拒绝了 ${this.name}`, changes);
    },
}));

// ====================== 随机事件池 ======================
const RANDOM_EVENT_POOL = [
    // 表白事件
    {
        title: '💘 有队友向你表白！',
        desc: '是你偷偷喜欢的人？还是不太熟的队友？',
        generateChoices: function (isCrush) {
            return [
                {
                    text: '💕 接受',
                    run: function (state) {
                        let oldMood = state.mood;
                        let oldTeamLevel = state.teamLevel;

                        if (isCrush) {
                            let ds = Game.applySpiritChange(20);
                            state.spirit += ds;
                            // 关系变化（双向奔赴）
                            if (state.playerList.length) {
                                let p = state.playerList[Math.floor(Math.random() * state.playerList.length)];
                                let delta = 25;
                                p.loyalty = Math.min(100, p.loyalty + delta);
                                UI.updatePlayersList();
                                setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', delta), 20);
                                UI.addLog(`❤️ 双向奔赴！${p.name}忠诚度+${delta}`, { spirit: ds });
                                Game.checkPlayerLoyaltyAndWarn(p);
                            }

                            // 重新计算 mood
                            Game.updateMoodFromRelationships();
                            let moodDelta = state.mood - oldMood;

                            UI.showFloat('spirit', ds);
                            UI.showFloat('mood', moodDelta);
                            UI.addLog(`❤️ 双向奔赴！`, { spirit: ds });
                            UI.showEventResultModal('💕 接受', '你们在一起了！球队气氛变得更加温暖。', {
                                spirit: ds,
                            });
                        } else {
                            let ds = Game.applySpiritChange(-10);
                            state.spirit += ds;
                            if (state.playerList.length) {
                                let p = state.playerList[Math.floor(Math.random() * state.playerList.length)];
                                let delta = -5;
                                p.loyalty = Math.max(0, p.loyalty + delta);
                                UI.updatePlayersList();
                                setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', delta), 20);
                                UI.addLog(`💔 勉强接受，${p.name}忠诚度${delta}`, { spirit: ds });
                                Game.checkPlayerLoyaltyAndWarn(p);
                            }

                            // 重新计算 mood
                            Game.updateMoodFromRelationships();
                            let moodDelta = state.mood - oldMood;

                            UI.showFloat('spirit', ds);
                            UI.showFloat('mood', moodDelta);
                            UI.addLog(`💔 勉强接受`, { spirit: ds, mood: moodDelta });
                            UI.showEventResultModal('💕 接受', '你接受了表白，但感觉好像不是特别喜欢……', {
                                spirit: ds,
                                mood: moodDelta,
                            });
                        }
                    },
                },
                {
                    text: '🚫 拒绝',
                    run: function (state) {
                        let oldMood = state.mood;
                        let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                        if (isCrush) {
                            let ds = Game.applySpiritChange(-20);
                            state.spirit += ds;
                            if (state.playerList.length) {
                                let p = state.playerList[Math.floor(Math.random() * state.playerList.length)];
                                let delta = -15;
                                p.loyalty = Math.max(0, p.loyalty + delta);
                                UI.updatePlayersList();
                                setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', delta), 20);
                                UI.addLog(`😭 忍痛拒绝！${p.name}忠诚度${delta}`, { spirit: ds });
                                Game.checkPlayerLoyaltyAndWarn(p);
                            }

                            // 重新计算 mood
                            Game.updateMoodFromRelationships();
                            let moodDelta = state.mood - oldMood;

                            UI.showFloat('spirit', ds);
                            UI.showFloat('mood', moodDelta);
                            UI.addLog(`😭 忍痛拒绝！`, { spirit: ds, mood: moodDelta });
                            UI.showEventResultModal('🚫 拒绝', '你拒绝了喜欢的人……心里空落落的。', {
                                spirit: ds,
                                mood: moodDelta,
                            });
                        } else {
                            let ds = Game.applySpiritChange(10);
                            state.spirit += ds;

                            // 重新计算 mood
                            Game.updateMoodFromRelationships();
                            let moodDelta = state.mood - oldMood;

                            UI.showFloat('spirit', ds);
                            UI.showFloat('mood', moodDelta);
                            UI.addLog('😌 坦然拒绝', { spirit: ds, mood: moodDelta });
                            UI.showEventResultModal('🚫 拒绝', '你礼貌地拒绝了，对方表示理解。', {
                                spirit: ds,
                                mood: moodDelta,
                            });
                        }
                    },
                },
            ];
        },
    },
    // 吵架事件
    {
        title: '😠 两名队友吵起来了',
        players: null,

        getDesc: function () {
            if (Game.state.playerList.length < 2) return '队里人太少，吵不起来了。';
            let shuffled = [...Game.state.playerList].sort(() => 0.5 - Math.random());
            this.players = [shuffled[0], shuffled[1]];
            return `「${shuffled[0].name}」和「${shuffled[1].name}」因为训练时间的事吵得很凶，气氛很僵。`;
        },

        getPlayers: function () {
            return this.players || [];
        },
        choices: function (p1, p2) {
            return [
                {
                    text: '🤝 认真劝和',
                    run: function (state) {
                        let oldMood = state.mood;
                        let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                        let ds = Game.applySpiritChange(-25);
                        state.spirit += ds;
                        state.relation += Game.randomDelta(5, 8);

                        // 重新计算 mood
                        Game.updateMoodFromRelationships();
                        let moodDelta = state.mood - oldMood;

                        UI.showFloat('spirit', ds);
                        UI.showFloat('mood', moodDelta);
                        UI.showFloat('relation', Game.randomDelta(5, 8));
                        UI.addLog(`🤝 劝和成功，人际关系改善`, {
                            spirit: ds,
                            mood: moodDelta,
                            relation: Game.randomDelta(5, 8),
                        });
                        UI.showResultModal('🤝 认真劝和', '你花了很多精力调解，两人终于和解了，关系也更好了。', {
                            spirit: ds,
                            mood: moodDelta,
                            relation: Game.randomDelta(5, 8),
                        });
                    },
                },
                {
                    text: '👀 不管',
                    run: function (state) {
                        let oldMood = state.mood;
                        let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                        let ds = Game.applySpiritChange(Game.randomDelta(12, 18));
                        state.spirit += ds;
                        let relationDelta = -Game.randomDelta(3, 8);
                        state.relation += relationDelta;
                        let leaveChance = Game.randomDelta(80, 100) / 100;
                        let removedPlayer = null;

                        if (Math.random() < leaveChance) {
                            let leaver = Math.random() < 0.5 ? p1 : p2;
                            let index = state.playerList.findIndex((p) => p.id === leaver.id);
                            if (index !== -1) {
                                removedPlayer = state.playerList.splice(index, 1)[0];
                                Game.state.playerWarningShown.delete(removedPlayer.id);
                                state.seasonLeaveCount++;

                                Game.state.departedPlayersHistory.push({
                                    id: removedPlayer.id,
                                    name: removedPlayer.name,
                                    joinDate: removedPlayer.joinDate,
                                    leaveDate: Game.formatDate(state.currentDate),
                                    loyalty: removedPlayer.loyalty,
                                    skill: removedPlayer.skill,
                                    personality: removedPlayer.personality,
                                    introducerId: removedPlayer.introducerId,
                                    introducerName: removedPlayer.introducerName,
                                });

                                state.playerList.forEach((p) => {
                                    let relValue = Game.getRelationshipValue(p, removedPlayer);
                                    if (relValue > 30) {
                                        let loyaltyDelta = -10;
                                        p.loyalty = Math.max(0, p.loyalty + loyaltyDelta);
                                        setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                                        UI.addLog(
                                            `😔 ${p.name}因好友${removedPlayer.name}离队而消沉，忠诚度${loyaltyDelta}`,
                                            {}
                                        );
                                        Game.checkPlayerLoyaltyAndWarn(p);
                                    }
                                });
                            }
                        }

                        // 重新计算 mood
                        Game.updateMoodFromRelationships();
                        let moodDelta = state.mood - oldMood;

                        let logMsg = `💢 没人调解，矛盾激化`;
                        if (removedPlayer) {
                            logMsg += `，${removedPlayer.name}选择离队！`;
                        } else {
                            logMsg += `，但没人离队。`;
                        }

                        UI.addLog(logMsg, {
                            spirit: ds,
                            mood: moodDelta,
                            relation: relationDelta,
                        });
                        UI.showFloat('spirit', ds);
                        UI.showFloat('mood', moodDelta);
                        UI.showFloat('relation', relationDelta);

                        let resultMsg = `矛盾激化，${
                            removedPlayer ? removedPlayer.name + '选择了离队' : '好在最后没人离队'
                        }……`;
                        UI.showResultModal('👀 不管', resultMsg, {
                            spirit: ds,
                            mood: moodDelta,
                            relation: relationDelta,
                        });

                        if (removedPlayer) {
                            UI.updatePlayersList();
                        }
                    },
                },
            ];
        },
    },
    // 教学视频
    {
        title: '📺 刷到棒球教学视频',
        desc: '讲解很细，正好是你们缺的技巧。',
        choices: [
            {
                text: '📚 认真学',
                run: function (state) {
                    // 保存旧的值
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldSkill = state.skill;

                    // 创始人属性变化
                    let ds = Game.applySpiritChange(-12);
                    state.skill += 10; // 创始人球技+10
                    state.spirit += ds;

                    // 随机球员属性变化
                    Game.randomUpdatePlayerAttr();

                    // 重新计算球队实力（基于所有成员的最新球技）
                    Game.updateTeamLevel();

                    // 重新计算气氛
                    Game.updateMoodFromRelationships();

                    // 计算实际变化量
                    let moodDelta = state.mood - oldMood;
                    let teamLevelDelta = state.teamLevel - oldTeamLevel;
                    let skillDelta = state.skill - oldSkill; // 实际变化量

                    // 显示浮动数字
                    UI.showFloat('skill', skillDelta);
                    UI.showFloat('spirit', ds);
                    UI.showFloat('mood', moodDelta);
                    if (teamLevelDelta !== 0) {
                        UI.showFloat('teamLevel', teamLevelDelta);
                    }

                    // 记录日志
                    UI.addLog('📚 学到新技巧', {
                        skill: skillDelta,
                        spirit: ds,
                        mood: moodDelta,
                        teamLevel: teamLevelDelta !== 0 ? teamLevelDelta : undefined,
                    });

                    // 显示结果弹窗
                    let teamLevelText =
                        teamLevelDelta !== 0
                            ? `<br>📊 球队实力变化: ${teamLevelDelta > 0 ? '+' : ''}${teamLevelDelta}`
                            : '';
                    UI.showResultModal('📚 认真学', `你认真看完视频，球技提升了！${teamLevelText}`, {
                        skill: skillDelta,
                        spirit: ds,
                        mood: moodDelta,
                        teamLevel: teamLevelDelta !== 0 ? teamLevelDelta : undefined,
                    });
                },
            },
            {
                text: '👀 随便看看',
                run: function (state) {
                    // 保存旧的值
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldSkill = state.skill;

                    let ds = Game.applySpiritChange(8);
                    state.spirit += ds;

                    // 重新计算球队实力和气氛
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();

                    // 计算实际变化量
                    let teamLevelDelta = state.teamLevel - oldTeamLevel;
                    let moodDelta = state.mood - oldMood;
                    let skillDelta = state.skill - oldSkill;

                    // 显示浮动数字
                    UI.showFloat('spirit', ds);
                    UI.showFloat('mood', moodDelta);
                    if (teamLevelDelta !== 0) {
                        UI.showFloat('teamLevel', teamLevelDelta);
                    }
                    // 球技有变化才显示
                    if (skillDelta !== 0) {
                        UI.showFloat('skill', skillDelta);
                    }
                    // ===== 第6步：记录日志 =====
                    let logData = {
                        spirit: ds,
                        mood: moodDelta,
                        teamLevel: teamLevelDelta,
                    };

                    if (skillDelta !== 0) {
                        logData.skill = skillDelta;
                    }

                    UI.addLog('😌 放松一下', logData);

                    // ===== 第7步：显示结果弹窗 =====
                    let changes = {
                        spirit: ds,
                        mood: moodDelta,
                        teamLevel: teamLevelDelta,
                    };

                    let extraText = `<br>📊 球队实力变化: ${teamLevelDelta > 0 ? '+' : ''}${teamLevelDelta}`;

                    if (skillDelta !== 0) {
                        changes.skill = skillDelta;
                        extraText += `<br>⚡ 球技变化: ${skillDelta > 0 ? '+' : ''}${skillDelta}`;
                    }

                    UI.showResultModal('👀 随便看看', `看了十分钟就犯困了……${extraText}`, changes);
                },
            },
        ],
    },
    // 中彩票
    {
        title: '🎰 你买的中了彩票！',
        desc: '税后到手8000块。是买新款Switch还是买新款棒球手套？',
        choices: [
            {
                text: '🎮 买Switch',
                run: function (state) {
                    // 保存旧的值
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;

                    let ds = Game.applySpiritChange(20);
                    state.spirit += ds;

                    // 买Switch会邀请队友一起玩，影响关系
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let affectedPlayers = shuffled.slice(0, Math.min(2, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let loyaltyDelta = Game.randomDelta(5, 10);
                            p.loyalty = Math.min(100, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                            UI.addLog(`🎮 邀请${p.name}一起玩Switch，忠诚度+${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        });
                    }

                    // 重新计算球队实力和气氛
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();

                    // 计算实际变化量
                    let moodDelta = state.mood - oldMood;
                    let teamLevelDelta = state.teamLevel - oldTeamLevel;

                    // 显示浮动数字
                    UI.showFloat('spirit', ds);
                    UI.showFloat('mood', moodDelta);
                    if (teamLevelDelta !== 0) {
                        UI.showFloat('teamLevel', teamLevelDelta);
                    }

                    // 记录日志
                    UI.addLog('🎮 买了Switch，周末打游戏好快乐', {
                        spirit: ds,
                        mood: moodDelta,
                        teamLevel: teamLevelDelta !== 0 ? teamLevelDelta : undefined,
                    });

                    // 显示结果弹窗
                    let teamLevelText =
                        teamLevelDelta !== 0
                            ? `<br>📊 球队实力变化: ${teamLevelDelta > 0 ? '+' : ''}${teamLevelDelta}`
                            : '';
                    UI.showResultModal('🎮 买Switch', `周末拉上队友一起玩动森，气氛变好了！${teamLevelText}`, {
                        spirit: ds,
                        mood: moodDelta,
                        teamLevel: teamLevelDelta !== 0 ? teamLevelDelta : undefined,
                    });
                },
            },
            {
                text: '🧤 买棒球手套',
                run: function (state) {
                    // 保存旧的值
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldSkill = state.skill;

                    let ds = Game.applySpiritChange(-15);
                    let dSkill = Game.randomDelta(10, 18);
                    state.spirit += ds;
                    state.skill += dSkill;

                    // 买了新手套，训练效果更好
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let trainedPlayers = shuffled.slice(0, Math.min(2, shuffled.length));
                        trainedPlayers.forEach((p) => {
                            let skillDelta = Game.randomDelta(1, 3);
                            p.skill = Math.min(100, p.skill + skillDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'skill', skillDelta), 20);
                            UI.addLog(`🧤 ${p.name}用新手套练习，球技+${skillDelta}`, {});
                        });
                    }

                    // 重新计算球队实力和气氛
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();

                    // 计算实际变化量
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;
                    let skillDelta = state.skill - oldSkill;

                    // 显示浮动数字
                    UI.showFloat('spirit', ds);
                    UI.showFloat('skill', skillDelta);
                    UI.showFloat('mood', moodDelta);
                    if (teamDelta !== 0) {
                        UI.showFloat('teamLevel', teamDelta);
                    }

                    // 记录日志
                    UI.addLog('🧤 买了高级手套，球技提升', {
                        spirit: ds,
                        skill: skillDelta,
                        mood: moodDelta,
                        teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                    });

                    // 显示结果弹窗
                    let teamLevelText =
                        teamDelta !== 0 ? `<br>📊 球队实力变化: ${teamDelta > 0 ? '+' : ''}${teamDelta}` : '';
                    UI.showResultModal('🧤 买棒球手套', `新手套手感超棒，你的球技提升了！${teamLevelText}`, {
                        spirit: ds,
                        skill: skillDelta,
                        mood: moodDelta,
                        teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                    });
                },
            },
        ],
    },
    // 签名球
    {
        title: '⚾ 意外获得女垒队李欢的签名球',
        desc: '这可是珍品！是自己偷偷收藏，还是奖励给表现出色的队友？',
        choices: [
            {
                text: '🏠 偷偷收藏',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    let ds = Game.applySpiritChange(25);
                    state.spirit += ds;

                    // 重新计算 mood（偷偷收藏不影响关系）
                    Game.updateMoodFromRelationships();
                    let moodDelta = state.mood - oldMood;

                    UI.showFloat('spirit', ds);
                    UI.showFloat('mood', moodDelta);
                    UI.addLog('🏠 把签名球放在家里珍藏', { spirit: ds, mood: moodDelta });
                    UI.showResultModal('🏠 偷偷收藏', '每天看到签名球就有了继续努力的动力。', {
                        spirit: ds,
                        mood: moodDelta,
                    });
                },
            },
            {
                text: '🎁 奖励队友',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    if (state.playerList.length > 0) {
                        let p = state.playerList[Math.floor(Math.random() * state.playerList.length)];
                        let delta = Game.randomDelta(20, 30);
                        p.loyalty = Math.min(100, p.loyalty + delta);
                        UI.updatePlayersList();
                        setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', delta), 20);

                        state.relation += 10;

                        let ds = Game.applySpiritChange(-25);
                        state.spirit += ds;

                        // 重新计算 mood
                        Game.updateMoodFromRelationships();
                        let moodDelta = state.mood - oldMood;

                        UI.showFloat('spirit', ds);
                        UI.showFloat('mood', moodDelta);
                        UI.showFloat('relation', 10);

                        UI.addLog(`🎁 把签名球送给${p.name}`, {
                            spirit: ds,
                            mood: moodDelta,
                            relation: 10,
                        });

                        Game.checkPlayerLoyaltyAndWarn(p);

                        UI.showResultModal('🎁 奖励队友', `${p.name}收到礼物时眼睛都亮了：「我会珍惜一辈子的！」`, {
                            spirit: ds,
                            mood: moodDelta,
                            relation: 10,
                        });
                    }
                },
            },
        ],
    },
    // 外队邀请
    {
        title: '🏃 其他球队邀请你去打球',
        desc: '对手的正式邀请，但过去可能会让队员觉得你偏爱外队。',
        choices: [
            {
                text: '✅ 去',
                run: function (state) {
                    // 保存旧的值
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldSkill = state.skill;
                    let oldRelation = state.relation;

                    let ds = Game.applySpiritChange(-25);
                    let dSkill = Game.randomDelta(20, 30);
                    let relationDelta = -Game.randomDelta(20, 30);
                    state.spirit += ds;
                    state.skill += dSkill;
                    state.relation += relationDelta;

                    // 处理球员忠诚度变化
                    if (state.playerList.length > 0) {
                        let p = state.playerList[Math.floor(Math.random() * state.playerList.length)];
                        let loyaltyDelta = -Game.randomDelta(10, 15);
                        p.loyalty = Math.max(0, p.loyalty + loyaltyDelta);
                        setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                        UI.addLog(`🏃 去外队打球，${p.name}忠诚度${loyaltyDelta}`, {});
                        Game.checkPlayerLoyaltyAndWarn(p);
                    }

                    // 重新计算球队实力和气氛
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();

                    // 计算实际变化量
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;
                    let skillDelta = state.skill - oldSkill;
                    let actualRelationDelta = state.relation - oldRelation;

                    // 显示浮动数字
                    UI.showFloat('spirit', ds);
                    UI.showFloat('skill', skillDelta);
                    UI.showFloat('mood', moodDelta);
                    UI.showFloat('relation', actualRelationDelta);
                    if (teamDelta !== 0) {
                        UI.showFloat('teamLevel', teamDelta);
                    }

                    // 记录日志
                    UI.addLog(`🏃 去外队打球，球技+${skillDelta}`, {
                        spirit: ds,
                        skill: skillDelta,
                        mood: moodDelta,
                        relation: actualRelationDelta,
                        teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                    });

                    // 显示结果弹窗
                    let teamLevelText =
                        teamDelta !== 0 ? `<br>📊 球队实力变化: ${teamDelta > 0 ? '+' : ''}${teamDelta}` : '';
                    UI.showResultModal('✅ 去', `和外队打了一场，学到新技巧，但队内氛围变差了。${teamLevelText}`, {
                        spirit: ds,
                        skill: skillDelta,
                        mood: moodDelta,
                        relation: actualRelationDelta,
                        teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                    });
                },
            },
            {
                text: '❌ 不去',
                run: function (state) {
                    // 保存旧的值
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldSkill = state.skill;
                    let oldRelation = state.relation;

                    let ds = Game.applySpiritChange(5);
                    let dSkill = -Game.randomDelta(5, 10);
                    let relationDelta = Game.randomDelta(5, 10);
                    state.spirit += ds;
                    state.skill += dSkill;
                    state.relation += relationDelta;

                    // 处理球员忠诚度变化
                    if (state.playerList.length > 0) {
                        let p = state.playerList[Math.floor(Math.random() * state.playerList.length)];
                        let loyaltyDelta = Game.randomDelta(10, 20);
                        p.loyalty = Math.min(100, p.loyalty + loyaltyDelta);
                        setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                        UI.addLog(`❌ 拒绝邀请，${p.name}忠诚度+${loyaltyDelta}`, {});
                        Game.checkPlayerLoyaltyAndWarn(p);
                    }

                    // 重新计算球队实力和气氛
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();

                    // 计算实际变化量
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;
                    let skillDelta = state.skill - oldSkill;
                    let actualRelationDelta = state.relation - oldRelation;

                    // 显示浮动数字
                    UI.showFloat('spirit', ds);
                    UI.showFloat('skill', skillDelta);
                    UI.showFloat('mood', moodDelta);
                    UI.showFloat('relation', actualRelationDelta);
                    if (teamDelta !== 0) {
                        UI.showFloat('teamLevel', teamDelta);
                    }

                    // 记录日志
                    UI.addLog(`❌ 拒绝邀请`, {
                        spirit: ds,
                        skill: skillDelta,
                        mood: moodDelta,
                        relation: actualRelationDelta,
                        teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                    });

                    // 显示结果弹窗
                    let teamLevelText =
                        teamDelta !== 0 ? `<br>📊 球队实力变化: ${teamDelta > 0 ? '+' : ''}${teamDelta}` : '';
                    UI.showResultModal('❌ 不去', `你婉拒了邀请，继续陪自己队员训练。${teamLevelText}`, {
                        spirit: ds,
                        skill: skillDelta,
                        mood: moodDelta,
                        relation: actualRelationDelta,
                        teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                    });
                },
            },
        ],
    },
    {
        title: '🤕 队员训练时扭伤了脚',
        injuredPlayer: null,

        getDesc: function () {
            if (Game.state.playerList.length === 0) return '没有球员可以受伤';
            let shuffled = [...Game.state.playerList].sort(() => 0.5 - Math.random());
            this.injuredPlayer = shuffled[0];
            return `${this.injuredPlayer.name}训练时扭伤了脚，需要休息一段时间，但她很焦虑怕拖累球队。`;
        },

        choices: function () {
            let injured = this.injuredPlayer;
            if (!injured) return [];

            return [
                {
                    text: '💪 劝她好好休息',
                    run: function (state) {
                        let oldMood = state.mood;
                        let ds = Game.applySpiritChange(-15);
                        state.spirit += ds;

                        let delta = Game.randomDelta(10, 18);
                        injured.loyalty = Math.min(100, injured.loyalty + delta);

                        Game.updateMoodFromRelationships();
                        let moodDelta = state.mood - oldMood;

                        // ✅ 先关闭事件选择窗口
                        document.getElementById('eventModal').style.display = 'none';
                        document.getElementById('eventModal').innerHTML = '';

                        // 然后显示结果弹窗
                        UI.showResultModal(
                            '💪 劝她好好休息',
                            `「谢谢队长……我会尽快回来的！」<br><br>📊 队内气氛变化: ${
                                moodDelta > 0 ? '+' : ''
                            }${moodDelta}`,
                            { spirit: ds, mood: moodDelta }
                        );
                    },
                },
                {
                    text: '📋 邀请她养伤期间做球队后勤',
                    run: function (state) {
                        let oldMood = state.mood;
                        let oldTeamLevel = state.teamLevel;

                        let relationDelta = Game.randomDelta(0, 10);
                        state.relation += relationDelta;

                        let loyaltyDelta = Game.randomDelta(-5, 10);
                        injured.loyalty = Math.max(0, Math.min(100, injured.loyalty + loyaltyDelta));

                        Game.updateTeamLevel();
                        Game.updateMoodFromRelationships();
                        let moodDelta = state.mood - oldMood;
                        let teamDelta = state.teamLevel - oldTeamLevel;

                        // ✅ 先关闭事件选择窗口
                        document.getElementById('eventModal').style.display = 'none';
                        document.getElementById('eventModal').innerHTML = '';

                        let resultMsg =
                            loyaltyDelta > 0
                                ? '她欣然接受，把后勤工作做得井井有条。'
                                : '她不太情愿，但还是答应了帮忙。';

                        // 然后显示结果弹窗
                        UI.showResultModal('📋 邀请她做后勤', resultMsg, {
                            relation: relationDelta,
                            mood: moodDelta,
                            teamLevel: teamDelta,
                        });
                    },
                },
            ];
        },
    },
    // 公司加班
    {
        title: '💼 公司突然通知全员加班',
        desc: '这周末的训练可能去不了了。',
        choices: [
            {
                text: '😫 球队不能没有我...硬着头皮和公司请假',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    let ds = Game.applySpiritChange(-30);
                    state.spirit += ds;

                    // 请假成功，队员感受到队长的付出
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let affectedPlayers = shuffled.slice(0, Math.min(2, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let loyaltyDelta = Game.randomDelta(3, 6);
                            p.loyalty = Math.min(100, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                            UI.addLog(`😫 ${p.name}感受到你的付出，忠诚度+${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        });
                    }

                    // 重新计算 mood
                    Game.updateMoodFromRelationships();
                    let moodDelta = state.mood - oldMood;

                    UI.showFloat('spirit', ds);
                    UI.showFloat('mood', moodDelta);

                    UI.addLog('💼 顶着压力请假，精神透支', { spirit: ds, mood: moodDelta });
                    UI.showResultModal('😫 硬着头皮请假', '领导脸色不太好，但你还是请假成功了。', {
                        spirit: ds,
                        mood: moodDelta,
                    });
                },
            },
            {
                text: '😔 老老实实去加班',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    let skillDelta = -Game.randomDelta(8, 12);
                    state.skill += skillDelta;

                    // 队员对队长缺席训练的反应
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let affectedPlayers = shuffled.slice(0, Math.min(2, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let loyaltyDelta = -Game.randomDelta(3, 8);
                            p.loyalty = Math.max(0, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                            UI.addLog(`😔 ${p.name}因你缺席训练，忠诚度${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        });
                    }

                    // 重新计算 mood 和 teamLevel
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;

                    UI.showFloat('mood', moodDelta);
                    UI.showFloat('teamLevel', teamDelta);
                    UI.showFloat('skill', skillDelta);

                    UI.addLog('💼 去加班，球队训练受影响', {
                        mood: moodDelta,
                        teamLevel: teamDelta,
                        skill: skillDelta,
                    });

                    UI.showResultModal('😔 去加班', `你坐在工位上，心却飞到了球场。`, {
                        mood: moodDelta,
                        teamLevel: teamDelta,
                        skill: skillDelta,
                    });
                },
            },
        ],
    },
    // 朋友来体验
    {
        title: '👥 队员带了朋友来玩球',
        getDesc: function () {
            if (Game.state.playerList.length === 0) return '没有队员可以介绍朋友';

            // 随机选择介绍人
            let shuffled = [...Game.state.playerList].sort(() => 0.5 - Math.random());
            let introducer = shuffled[0];
            this.introducer = introducer; // 保存起来供 choices 使用

            // 生成朋友的信息
            let tempNames = ['小萌', '阿遥', '琪琪', '柚子', '糖糖'];
            let friendName = Game.getUniquePlayerName(tempNames[Math.floor(Math.random() * tempNames.length)]);
            this.friendName = friendName; // 保存起来

            let loyalty = Game.randomDelta(70, 85);
            let skill = Game.randomDelta(15, 25);

            this.friendLoyalty = loyalty;
            this.friendSkill = skill;

            return `${introducer.name}带了朋友「${friendName}」来玩球！<br><br>
                    📋 朋友信息：<br>
                    • ❤️ 忠诚度：${loyalty}<br>
                    • ⚡ 球技：${skill}<br>
                    • 💬 性格：被朋友拉来玩，意外喜欢上棒球的职场新人<br><br>
                    她玩得很开心，似乎对棒球产生了兴趣。`;
        },
        getIntroducer: function () {
            return this.introducer || null;
        },
        choices: function (introducer) {
            // 使用 this.friendName, this.friendLoyalty, this.friendSkill
            if (!introducer) {
                return [
                    {
                        text: '……',
                        run: function (state) {
                            UI.showResultModal('😢 无人介绍', '球队没有队员可以介绍朋友。', {});
                        },
                    },
                ];
            }

            return [
                {
                    text: '🎉 热情邀请入队',
                    run: function (state) {
                        let oldMood = state.mood;
                        let oldTeamLevel = state.teamLevel;

                        // 使用保存的朋友信息
                        let newName = this.friendName;
                        let loyalty = this.friendLoyalty;
                        let skill = this.friendSkill;

                        // ... 其余代码保持不变 ...

                        UI.showResultModal(
                            '🎉 新队员加入',
                            `${newName} 爽快地答应了！由 ${introducer.name} 介绍入队，两人成为了好朋友。<br><br>` +
                                `📋 球员信息：<br>` +
                                `• 姓名：${newName}<br>` +
                                `• ❤️ 忠诚度：${loyalty}<br>` +
                                `• ⚡ 球技：${skill}`,
                            { mood: moodDelta, teamLevel: teamDelta, players: 1 }
                        );
                    },
                },
                {
                    text: '🤝 欢迎常来玩',
                    run: function (state) {
                        // ... 现有代码 ...
                    },
                },
            ];
        },
    },
    // 球场被占用
    {
        title: '🏟️ 常去的球场被预定了',
        desc: '今天没法训练了。',
        choices: [
            {
                text: '临时找备用场地',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    let ds = Game.applySpiritChange(-25);
                    state.spirit += ds;

                    // 找到备用场地，队员感受到队长的努力
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let affectedPlayers = shuffled.slice(0, Math.min(2, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let loyaltyDelta = Game.randomDelta(2, 5);
                            p.loyalty = Math.min(100, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                            UI.addLog(`🏟️ ${p.name}感谢你找到备用场地，忠诚度+${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        });
                    }

                    // 重新计算 mood
                    Game.updateMoodFromRelationships();
                    let moodDelta = state.mood - oldMood;

                    UI.showFloat('spirit', ds);
                    UI.showFloat('mood', moodDelta);

                    UI.addLog('🏟️ 折腾半天找到备用场地，好累', { spirit: ds, mood: moodDelta });
                    UI.showResultModal('🏃 临时找备用场地', '辗转打了十几个电话，终于找到一个小公园。', {
                        spirit: ds,
                        mood: moodDelta,
                    });
                },
            },
            {
                text: '🍺 改成聚餐',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    state.relation += 10;

                    // 聚餐增进感情
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        for (let i = 0; i < shuffled.length; i++) {
                            for (let j = i + 1; j < shuffled.length; j++) {
                                if (Math.random() < 0.3) {
                                    let relDelta = Game.randomDelta(2, 5);
                                    Game.modifyRelationship(shuffled[i], shuffled[j], relDelta);
                                }
                            }
                        }
                    }

                    // 重新计算 mood
                    Game.updateMoodFromRelationships();
                    let moodDelta = state.mood - oldMood;

                    UI.showFloat('mood', moodDelta);
                    UI.showFloat('relation', 10);

                    UI.addLog('🍺 改成聚餐，气氛很好', { mood: moodDelta, relation: 10 });
                    UI.showResultModal('🍺 改成聚餐', `大家边吃烧烤边聊棒球，感情更好了。`, {
                        mood: moodDelta,
                        relation: 10,
                    });
                },
            },
            {
                text: '❌ 训练取消',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    // 训练取消，队员有点失望
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let affectedPlayers = shuffled.slice(0, Math.min(2, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let loyaltyDelta = -Game.randomDelta(2, 5);
                            p.loyalty = Math.max(0, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                            UI.addLog(`🏟️ ${p.name}因训练取消而失望，忠诚度${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        });
                    }

                    // 重新计算 mood 和 teamLevel
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;

                    UI.showFloat('mood', moodDelta);
                    UI.showFloat('teamLevel', teamDelta);

                    UI.addLog('🏟️ 训练取消，大家各自回家了', { mood: moodDelta, teamLevel: teamDelta });
                    UI.showResultModal('❌ 训练取消', `今天没法训练，大家各自回家了。`, {
                        mood: moodDelta,
                        teamLevel: teamDelta,
                    });
                },
            },
        ],
    },
    // 前队友归队事件
    {
        title: '🏡 前队友想归队',
        departedPlayer: null,

        getDesc: function () {
            if (Game.state.departedPlayersHistory.length === 0) {
                return '暂时没有离队的队友。';
            }
            let randomIndex = Math.floor(Math.random() * Game.state.departedPlayersHistory.length);
            this.departedPlayer = Game.state.departedPlayersHistory[randomIndex];
            return `之前因故离队的「${this.departedPlayer.name}」联系你，说非常想念大家，问现在还能回来吗？`;
        },

        getDepartedPlayer: function () {
            return this.departedPlayer;
        },
        choices: function (departedPlayer) {
            if (!departedPlayer) {
                return [
                    {
                        text: '……',
                        run: function (state) {
                            UI.showResultModal('😢 无人归队', '暂时没有离队的队友。', {});
                        },
                    },
                ];
            }

            let introducerStillHere = null;
            if (departedPlayer.introducerName) {
                introducerStillHere = Game.state.playerList.find((p) => p.name === departedPlayer.introducerName);
            }

            return [
                {
                    text: '✅ 欢迎回来',
                    run: function (state) {
                        let oldMood = state.mood;
                        let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                        let newId =
                            state.playerList.length > 0 ? Math.max(...state.playerList.map((p) => p.id)) + 1 : 1;
                        let joinDate = Game.formatDate(state.currentDate);
                        let returnedPlayer = {
                            id: newId,
                            name: departedPlayer.name,
                            joinDate: joinDate,
                            loyalty: Game.randomDelta(60, 80),
                            skill: departedPlayer.skill,
                            personality: departedPlayer.personality,
                            relationships: {},
                            introducerId: departedPlayer.introducerId,
                            introducerName: departedPlayer.introducerName,
                        };

                        state.playerList.push(returnedPlayer);
                        if (departedPlayer.negativeRelations) {
                            departedPlayer.negativeRelations.forEach((rel) => {
                                let otherPlayer = state.playerList.find((p) => p.id === rel.playerId);
                                if (otherPlayer) {
                                    Game.setRelationshipValue(returnedPlayer, otherPlayer, rel.value);
                                    UI.addLog(`👀 ${otherPlayer.name}还记得和${returnedPlayer.name}的旧怨`, {});
                                }
                            });
                        }
                        Game.updateTeamLevel();
                        Game.updateMoodFromRelationships();
                        Game.state.recruitedNames.add(departedPlayer.name);
                        state.seasonJoinCount++;
                        // ✅ 新增：计算球队实力变化
                        let moodDelta = state.mood - oldMood;
                        let teamDelta = state.teamLevel - oldTeamLevel;
                        if (introducerStillHere) {
                            let relValue = Game.randomDelta(40, 60);
                            Game.setRelationshipValue(returnedPlayer, introducerStillHere, relValue);
                            setTimeout(() => {
                                UI.highlightRelationshipChange(returnedPlayer, introducerStillHere, relValue);
                            }, 100);
                            UI.addLog(`👋 ${departedPlayer.name}归队，与介绍人${introducerStillHere.name}重逢`, {});
                        }

                        let historyIndex = Game.state.departedPlayersHistory.findIndex(
                            (p) => p.name === departedPlayer.name
                        );
                        if (historyIndex !== -1) {
                            Game.state.departedPlayersHistory.splice(historyIndex, 1);
                        }

                        UI.updatePlayersList();
                        UI.showFloat('mood', moodDelta);

                        UI.addLog(`🏡 ${departedPlayer.name} 归队！`, { mood: moodDelta, players: 1 });

                        let introducerMsg = introducerStillHere
                            ? `<br>介绍人${introducerStillHere.name}非常开心，两人重逢了。`
                            : departedPlayer.introducerName
                            ? `<br>可惜介绍人${departedPlayer.introducerName}已经不在队中了。`
                            : '';

                        UI.showResultModal(
                            '✅ 欢迎回来',
                            `${departedPlayer.name}回到了球队！大家都很高兴。${introducerMsg}`,
                            {
                                mood: moodDelta,
                                players: 1,
                                // ✅ 新增：添加球队实力到弹窗
                                teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                            }
                        );
                    },
                },
                {
                    text: '😥 委婉拒绝',
                    run: function (state) {
                        let oldMood = state.mood;
                        let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                        // 拒绝归队，老队员更珍惜现在
                        let count = Math.min(3, state.playerList.length);
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        for (let i = 0; i < count; i++) {
                            let p = shuffled[i];
                            let loyaltyDelta = Game.randomDelta(2, 5);
                            p.loyalty = Math.min(100, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20 + i * 10);
                            UI.addLog(`😥 拒绝了归队请求，${p.name}忠诚度+${loyaltyDelta}`, {});
                        }

                        if (introducerStillHere) {
                            let loyaltyDelta = -Game.randomDelta(8, 15);
                            introducerStillHere.loyalty = Math.max(0, introducerStillHere.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(introducerStillHere.id, 'loyalty', loyaltyDelta), 50);
                            UI.addLog(
                                `💔 拒绝了归队请求，介绍人${introducerStillHere.name}很伤心，忠诚度${loyaltyDelta}`,
                                {}
                            );
                        }

                        // 重新计算 mood
                        Game.updateMoodFromRelationships();
                        let moodDelta = state.mood - oldMood;

                        UI.showFloat('mood', moodDelta);

                        let introducerMsg = introducerStillHere
                            ? `<br>介绍人${introducerStillHere.name}显得很失落。`
                            : '';

                        UI.showResultModal(
                            '😥 委婉拒绝',
                            `你婉拒了${departedPlayer.name}的归队请求。${introducerMsg}<br>几个老队员反而更珍惜现在了。`,
                            { mood: moodDelta }
                        );

                        UI.updatePlayersList();
                    },
                },
            ];
        },
    },
    // 自媒体采访
    {
        title: '🎥 有自媒体想采访球队',
        desc: '女子棒球的话题最近有点热度。',
        choices: [
            {
                text: '📸 接受采访',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    let rInc = Game.randomDelta(3, 7);
                    state.relation += rInc;

                    // 采访后球员感到自豪
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let affectedPlayers = shuffled.slice(0, Math.min(3, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let loyaltyDelta = Game.randomDelta(2, 4);
                            p.loyalty = Math.min(100, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                            UI.addLog(`📸 ${p.name}因采访感到自豪，忠诚度+${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        });
                    }

                    // 重新计算 mood
                    Game.updateMoodFromRelationships();
                    let moodDelta = state.mood - oldMood;

                    UI.showFloat('relation', rInc);
                    UI.showFloat('mood', moodDelta);

                    UI.addLog('📸 采访播出后，球队知名度上升', { relation: rInc, mood: moodDelta });
                    UI.showResultModal('📸 接受采访', `报道发出后，有人留言说想来看你们打球！`, {
                        relation: rInc,
                        mood: moodDelta,
                    });
                },
            },
            {
                text: '🙈 婉拒',
                run: function (state) {
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel; // 保存旧的 mood

                    let ds = Game.applySpiritChange(10);
                    state.spirit += ds;

                    // 重新计算 mood
                    Game.updateMoodFromRelationships();
                    let moodDelta = state.mood - oldMood;

                    UI.showFloat('spirit', ds);
                    UI.showFloat('mood', moodDelta);

                    UI.addLog('🙈 低调低调', { spirit: ds, mood: moodDelta });
                    UI.showResultModal('🙈 婉拒', '你们决定还是专注训练，不被外界打扰。', {
                        spirit: ds,
                        mood: moodDelta,
                    });
                },
            },
        ],
    },
    // 装备打折
    {
        title: '🛒 棒球装备店周年庆',
        desc: '平时舍不得买的高端手套打六折！',
        choices: [
            {
                text: '💸 自费买一个',
                run: function (state) {
                    // 保存旧的值
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldSkill = state.skill;

                    let ds = Game.applySpiritChange(-15);
                    let dSkill = Game.randomDelta(8, 15);
                    state.spirit += ds;
                    state.skill += dSkill;

                    // 自费买装备，可以借给队友用
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let affectedPlayers = shuffled.slice(0, Math.min(2, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let skillDelta = Game.randomDelta(1, 3);
                            p.skill = Math.min(100, p.skill + skillDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'skill', skillDelta), 20);
                            UI.addLog(`🛒 ${p.name}借用了你的新手套，球技+${skillDelta}`, {});
                        });
                    }

                    // 重新计算球队实力和气氛
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();

                    // 计算实际变化量
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;
                    let skillDelta = state.skill - oldSkill;

                    // 显示浮动数字
                    UI.showFloat('spirit', ds);
                    UI.showFloat('skill', skillDelta);
                    UI.showFloat('mood', moodDelta);
                    if (teamDelta !== 0) {
                        UI.showFloat('teamLevel', teamDelta);
                    }

                    // 记录日志
                    UI.addLog('🛒 自费买了新手套，球技提升', {
                        spirit: ds,
                        skill: skillDelta,
                        mood: moodDelta,
                        teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                    });

                    // 显示结果弹窗
                    let teamLevelText =
                        teamDelta !== 0 ? `<br>📊 球队实力变化: ${teamDelta > 0 ? '+' : ''}${teamDelta}` : '';
                    UI.showResultModal(
                        '💸 自费买一个',
                        `虽然肉疼，但新手套真香，你的球感明显变好了。${teamLevelText}`,
                        {
                            spirit: ds,
                            skill: skillDelta,
                            mood: moodDelta,
                            teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                        }
                    );
                },
            },
            {
                text: '💰 怂恿队费出',
                run: function (state) {
                    // 保存旧的值
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldSkill = state.skill;
                    let oldRelation = state.relation;

                    let skillUp = Game.randomDelta(3, 7);
                    state.skill += skillUp;
                    let relationDelta = -Game.randomDelta(10, 20);
                    state.relation += relationDelta;

                    // 用队费买装备，有人不满
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        let affectedPlayers = shuffled.slice(0, Math.min(2, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let loyaltyDelta = -Game.randomDelta(5, 10);
                            p.loyalty = Math.max(0, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                            UI.addLog(`💰 ${p.name}对动用队费不满，忠诚度${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        });
                    }

                    // 重新计算球队实力和气氛
                    Game.updateTeamLevel();
                    Game.updateMoodFromRelationships();

                    // 计算实际变化量
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;
                    let skillDelta = state.skill - oldSkill;
                    let actualRelationDelta = state.relation - oldRelation;

                    // 显示浮动数字
                    UI.showFloat('mood', moodDelta);
                    UI.showFloat('skill', skillDelta);
                    UI.showFloat('relation', actualRelationDelta);
                    if (teamDelta !== 0) {
                        UI.showFloat('teamLevel', teamDelta);
                    }

                    // 记录日志
                    UI.addLog('💰 用队费买装备，有人觉得不该花这笔钱，但你的球技提升了', {
                        mood: moodDelta,
                        skill: skillDelta,
                        relation: actualRelationDelta,
                        teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                    });

                    // 显示结果弹窗
                    let teamLevelText =
                        teamDelta !== 0 ? `<br>📊 球队实力变化: ${teamDelta > 0 ? '+' : ''}${teamDelta}` : '';
                    UI.showResultModal(
                        '💰 怂恿队费出',
                        `手套买了，但有队员小声嘀咕队费不够了。不过你偷偷练了一下，球技涨了。${teamLevelText}`,
                        {
                            mood: moodDelta,
                            skill: skillDelta,
                            relation: actualRelationDelta,
                            teamLevel: teamDelta !== 0 ? teamDelta : undefined,
                        }
                    );
                },
            },
        ],
    },
    // 添置新装备
    {
        title: '🛡️ 球队需要添置新装备',
        desc: '训练用的捕手护具已经破旧不堪，需要更换。是强制征收队费，还是让大家自主募资？',
        choices: [
            {
                text: '💰 强制征收队费',
                run: function (state) {
                    // ===== 第1步：保存所有旧值 =====
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldRelation = state.relation;
                    let oldSkill = state.skill;

                    // ===== 第2步：记录球员球技总变化 =====
                    let totalPlayerSkillIncrease = 0;

                    // ===== 第3步：强制征收，多人不满（忠诚度下降） =====
                    if (state.playerList.length > 0) {
                        let count = Math.min(2, state.playerList.length);
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());
                        for (let i = 0; i < count; i++) {
                            let p = shuffled[i];
                            let loyaltyDelta = -Game.randomDelta(3, 7);
                            p.loyalty = Math.max(0, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20 + i * 10);
                            UI.addLog(`💰 强制征收队费，${p.name}忠诚度${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        }
                    }

                    // ===== 第4步：新装备提升球员球技（这才是合理的！） =====
                    if (state.playerList.length > 0) {
                        // 所有球员球技小幅提升（新装备帮助训练）
                        state.playerList.forEach((p) => {
                            let skillIncrease = Game.randomDelta(8, 13);
                            p.skill = Math.min(100, p.skill + skillIncrease);
                            totalPlayerSkillIncrease += skillIncrease;
                            setTimeout(() => UI.showPlayerFloat(p.id, 'skill', skillIncrease), 10);
                        });

                        UI.addLog(`📊 新装备让全队球技提升了！`, {});
                    }

                    // ===== 第5步：创始人球技也可能提升（用新装备练习） =====
                    let founderSkillIncrease = Game.randomDelta(4, 7);
                    state.skill += founderSkillIncrease;

                    // ===== 第6步：人际关系下降（强制征收引起不满） =====
                    state.relation += -10;

                    // ===== 第7步：重新计算所有数值 =====
                    Game.updateTeamLevel(); // 重新计算球队实力（基于所有成员最新球技）
                    Game.updateMoodFromRelationships(); // 重新计算队内气氛

                    // ===== 第8步：计算实际变化量 =====
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;
                    let relationDelta = state.relation - oldRelation;
                    let skillDelta = state.skill - oldSkill;

                    // ===== 第9步：获取创始人名字 =====
                    let founderName = state.playerName || '创始人';

                    // ===== 第10步：显示浮动数字 =====
                    UI.showFloat('teamLevel', teamDelta);
                    UI.showFloat('mood', moodDelta);
                    UI.showFloat('relation', relationDelta);
                    if (skillDelta !== 0) {
                        UI.showFloat('skill', skillDelta);
                    }

                    // ===== 第11步：记录日志 =====
                    UI.addLog('💰 强制征收队费，装备升级但队内不满', {
                        teamLevel: teamDelta,
                        mood: moodDelta,
                        relation: relationDelta,
                        skill: skillDelta !== 0 ? skillDelta : undefined,
                    });

                    // ===== 第12步：显示结果弹窗 =====
                    let extraText = '';
                    let changes = {
                        teamLevel: teamDelta,
                        mood: moodDelta,
                        relation: relationDelta,
                    };

                    if (skillDelta !== 0) {
                        changes.skill = skillDelta;
                        extraText += `<br>⚡ ${founderName}的球技变化: ${skillDelta > 0 ? '+' : ''}${skillDelta}`;
                    }

                    UI.showResultModal(
                        '💰 强制征收队费',
                        `新装备到位了，全队球技提升！但好几个队员私下抱怨队费太高。${extraText}`,
                        changes
                    );
                },
            },
            {
                text: '🤝 自主募资',
                run: function (state) {
                    // ===== 第1步：保存所有旧值 =====
                    let oldMood = state.mood;
                    let oldTeamLevel = state.teamLevel;
                    let oldRelation = state.relation;
                    let oldSkill = state.skill;

                    // ===== 第2步：记录球员球技总变化 =====
                    let totalPlayerSkillIncrease = 0;

                    // ===== 第3步：自主募资，大家更团结（关系提升） =====
                    if (state.playerList.length > 0) {
                        let shuffled = [...state.playerList].sort(() => 0.5 - Math.random());

                        // 球员之间关系提升
                        for (let i = 0; i < shuffled.length; i++) {
                            for (let j = i + 1; j < shuffled.length; j++) {
                                if (Math.random() < 0.3) {
                                    // 提高概率到30%
                                    let relDelta = Game.randomDelta(3, 6);
                                    Game.modifyRelationship(shuffled[i], shuffled[j], relDelta);
                                }
                            }
                        }

                        // 部分球员忠诚度提升
                        let affectedPlayers = shuffled.slice(0, Math.min(3, shuffled.length));
                        affectedPlayers.forEach((p) => {
                            let loyaltyDelta = Game.randomDelta(5, 10); // 提高幅度
                            p.loyalty = Math.min(100, p.loyalty + loyaltyDelta);
                            setTimeout(() => UI.showPlayerFloat(p.id, 'loyalty', loyaltyDelta), 20);
                            UI.addLog(`🤝 ${p.name}因大家齐心募资而感动，忠诚度+${loyaltyDelta}`, {});
                            Game.checkPlayerLoyaltyAndWarn(p);
                        });
                    }

                    // ===== 第4步：新装备提升球员球技（比强制征收效果更好，因为大家更愿意用） =====
                    if (state.playerList.length > 0) {
                        // 所有球员球技提升（新装备帮助训练）
                        state.playerList.forEach((p) => {
                            let skillIncrease = Game.randomDelta(3, 6); // 比强制征收略高
                            p.skill = Math.min(100, p.skill + skillIncrease);
                            totalPlayerSkillIncrease += skillIncrease;
                            setTimeout(() => UI.showPlayerFloat(p.id, 'skill', skillIncrease), 10);
                        });

                        UI.addLog(`📊 新装备让全队球技大幅提升！`, {});
                    }

                    // ===== 第5步：创始人球技也提升更多（团队氛围好，训练效果更好） =====
                    let founderSkillIncrease = Game.randomDelta(2, 4);
                    state.skill += founderSkillIncrease;

                    // ===== 第6步：人际关系大幅提升（自主募资增进感情） =====
                    state.relation += 20;

                    // ===== 第7步：重新计算所有数值 =====
                    Game.updateTeamLevel(); // 重新计算球队实力（基于所有成员最新球技）
                    Game.updateMoodFromRelationships(); // 重新计算队内气氛

                    // ===== 第8步：计算实际变化量 =====
                    let moodDelta = state.mood - oldMood;
                    let teamDelta = state.teamLevel - oldTeamLevel;
                    let relationDelta = state.relation - oldRelation;
                    let skillDelta = state.skill - oldSkill;

                    // ===== 第9步：获取创始人名字 =====
                    let founderName = state.playerName || '创始人';

                    // ===== 第10步：显示浮动数字 =====
                    UI.showFloat('teamLevel', teamDelta);
                    UI.showFloat('mood', moodDelta);
                    UI.showFloat('relation', relationDelta);
                    if (skillDelta !== 0) {
                        UI.showFloat('skill', skillDelta);
                    }

                    // ===== 第11步：记录日志 =====
                    UI.addLog('🤝 大家主动凑钱买了新装备，队内更团结了', {
                        teamLevel: teamDelta,
                        mood: moodDelta,
                        relation: relationDelta,
                        skill: skillDelta !== 0 ? skillDelta : undefined,
                    });

                    // ===== 第12步：显示结果弹窗 =====
                    let extraText = '';
                    let changes = {
                        teamLevel: teamDelta,
                        mood: moodDelta,
                        relation: relationDelta,
                    };

                    if (skillDelta !== 0) {
                        changes.skill = skillDelta;
                        extraText += `<br>⚡ ${founderName}的球技变化: ${skillDelta > 0 ? '+' : ''}${skillDelta}`;
                    }

                    UI.showResultModal(
                        '🤝 自主募资',
                        `大家你一点我一点凑够了钱，新装备到了，全队球技提升，感情也更好了！${extraText}`,
                        changes
                    );
                },
            },
        ],
    },
];

// ====================== 其他常量 ======================
const CONSTANTS = {
    BEST_FRIENDS: ['林桃', '江蓠'],
    MAX_RELATIONSHIPS_PER_PLAYER: 5,
    RECRUIT_COOLDOWN: 45,
    MAX_RANDOM_EVENT_PER_WEEK: 2,
    MATCH_OPPONENTS: ['永远少女队', '同济女垒队', '橘子队'],
    XIZHAO_OPPONENTS: ['永远少女队', '同济女垒队', '橘子队'],
    WEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    INIT_PLAYER_NAMES: ['小马', '霏霏', '老郭', '阿柏', '五零', '阿木', '三习', '之之', '贝尔'],
};

// ====================== 工具函数 ======================
function randomDelta(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
    let y = date.getFullYear();
    let m = String(date.getMonth() + 1).padStart(2, '0');
    let d = String(date.getDate()).padStart(2, '0');
    let w = CONSTANTS.WEEKDAYS[date.getDay()];
    return `${y}-${m}-${d} (${w})`;
}

function formatShortDate(dateStr) {
    if (!dateStr) return '03-08';
    let parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[1]}-${parts[2]}`;
    }
    return dateStr;
}

function getRelationshipType(value) {
    if (value >= 61) return '死党';
    if (value >= 1) return '朋友';
    if (value >= -60) return '竞争';
    return '仇敌';
}

function getRelationshipIcon(value) {
    if (value >= 80) return '💕';
    if (value >= 61) return '💞';
    if (value >= 30) return '🤝';
    if (value >= 1) return '👋';
    if (value >= -30) return '😐';
    if (value >= -60) return '⚔️';
    if (value >= -80) return '💢';
    return '💀';
}
