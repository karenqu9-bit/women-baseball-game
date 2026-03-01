// ====================== UI 交互对象 ======================
const UI = {
    // ====================== 弹窗状态管理 ======================
    modalState: {
        activeModal: null, // 当前活动弹窗：'choice'/'result'/'info'/'xiZhao'/'playerSelect'
        xiZhaoActive: false, // 曦照赛是否进行中
        modalQueue: [], // 等待队列（暂不使用）
    },
    // ====================== 浮动数字动画 ======================
    showFloat: function (id, val) {
        if (val === 0) return;

        let floatEl = document.getElementById(id + 'Float');
        if (!floatEl) return;

        // 使用 requestAnimationFrame 优化动画性能
        requestAnimationFrame(() => {
            floatEl.innerText = val > 0 ? '+' + val : val;
            floatEl.style.color = val > 0 ? '#22c55e' : '#ef4444';
            floatEl.style.opacity = '1';
            floatEl.style.transform = 'translateY(-12px)';
        });

        // 清除之前的定时器
        if (floatEl._floatTimer) {
            clearTimeout(floatEl._floatTimer);
        }

        // 设置新的定时器
        floatEl._floatTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                floatEl.style.opacity = '0';
                floatEl.style.transform = 'translateY(0)';
            });
            floatEl._floatTimer = null;
        }, 1800);
    },

    showPlayerFloat: function (playerId, type, val) {
        if (!playerId || val === 0) return;

        let suffix = type === 'loyalty' ? 'Loyalty' : 'Skill';
        let floatId = `player${suffix}Float-${playerId}`;
        let floatEl = document.getElementById(floatId);

        if (floatEl) {
            this.applyFloatAnimation(floatEl, val);
            return;
        }

        // 如果元素还没渲染，延迟一下再试
        setTimeout(() => {
            let retryEl = document.getElementById(floatId);
            if (retryEl) this.applyFloatAnimation(retryEl, val);
        }, 50);
    },

    applyFloatAnimation: function (el, val) {
        if (!el) return;

        // 使用 requestAnimationFrame 优化
        requestAnimationFrame(() => {
            el.innerText = val > 0 ? '+' + val : val;
            el.style.color = val > 0 ? '#22c55e' : '#ef4444';
            el.style.opacity = '1';
            el.style.transform = 'translateY(-8px)';
        });

        if (el._floatTimer) clearTimeout(el._floatTimer);

        el._floatTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(0)';
            });
            el._floatTimer = null;
        }, 1800);
    },

    highlightRelationshipChange: function (p1, p2, delta) {
        console.log('【高亮1】函数开始执行', p1.name, p2.name, '变化量:', delta);

        // 如果找不到节点，直接显示在屏幕中央
        let midX = window.innerWidth / 2;
        let midY = window.innerHeight / 2;

        // 尝试查找线条
        let lineId1 = `line-${p1.id}-${p2.id}`;
        let lineId2 = `line-${p2.id}-${p1.id}`;
        let line = document.getElementById(lineId1) || document.getElementById(lineId2);

        if (line) {
            let rect = line.getBoundingClientRect();
            midX = (rect.left + rect.right) / 2;
            midY = (rect.top + rect.bottom) / 2;
            console.log('【高亮4】使用线条位置:', midX, midY);
        } else {
            console.log('【高亮5】线条不存在，尝试查找球员节点');

            // 尝试查找球员节点
            let node1 =
                document.querySelector(`[data-player-id="${p1.id}"] circle`) ||
                document.querySelector(`g[onclick*="showPlayerDetail(${p1.id})"] circle`) ||
                document.querySelector(`circle[onclick*="showPlayerDetail(${p1.id})"]`);

            let node2 =
                document.querySelector(`[data-player-id="${p2.id}"] circle`) ||
                document.querySelector(`g[onclick*="showPlayerDetail(${p2.id})"] circle`) ||
                document.querySelector(`circle[onclick*="showPlayerDetail(${p2.id})"]`);

            if (node1 && node2) {
                let rect1 = node1.getBoundingClientRect();
                let rect2 = node2.getBoundingClientRect();

                let center1 = {
                    x: rect1.left + rect1.width / 2,
                    y: rect1.top + rect1.height / 2,
                };
                let center2 = {
                    x: rect2.left + rect2.width / 2,
                    y: rect2.top + rect2.height / 2,
                };

                midX = (center1.x + center2.x) / 2;
                midY = (center1.y + center2.y) / 2;

                console.log('【高亮6】节点1位置:', center1);
                console.log('【高亮7】节点2位置:', center2);
                console.log('【高亮8】中点坐标:', midX, midY);
            } else {
                console.log('【高亮9】找不到节点！使用屏幕中央');
                // 使用球员卡片位置作为备选
                let card1 = document.getElementById(`playerCard-${p1.id}`);
                let card2 = document.getElementById(`playerCard-${p2.id}`);

                if (card1 && card2) {
                    let rect1 = card1.getBoundingClientRect();
                    let rect2 = card2.getBoundingClientRect();
                    midX = (rect1.left + rect1.right + rect2.left + rect2.right) / 4;
                    midY = (rect1.top + rect1.bottom + rect2.top + rect2.bottom) / 4;
                }
            }
        }

        // 创建浮动数值元素
        let floatDiv = document.createElement('div');
        floatDiv.innerText = delta > 0 ? `+${delta}` : delta;
        floatDiv.style.position = 'fixed';
        floatDiv.style.left = midX + 'px';
        floatDiv.style.top = midY + 'px';
        floatDiv.style.transform = 'translate(-50%, -50%)';
        floatDiv.style.background = delta >= 0 ? '#e24070' : '#ef4444';
        floatDiv.style.color = 'white';
        floatDiv.style.padding = '4px 10px';
        floatDiv.style.borderRadius = '20px';
        floatDiv.style.fontSize = '16px';
        floatDiv.style.fontWeight = 'bold';
        floatDiv.style.zIndex = '30000';
        floatDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        floatDiv.style.animation = 'floatNumber 1.5s ease-out forwards';
        floatDiv.style.pointerEvents = 'none';

        console.log('【高亮11】浮动元素创建完成');
        document.body.appendChild(floatDiv);

        setTimeout(() => {
            floatDiv.remove();
            console.log('【高亮13】浮动元素已移除');
        }, 1500);
    },

    // ====================== 球员列表UI ======================
    updatePlayersList: function () {
        const playersListEl = document.getElementById('playersList');
        playersListEl.className = 'players-grid';

        if (!Game.state.gameStarted) {
            playersListEl.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#718096; font-size:13px;">⚾ 未开始游戏，暂无球员</div>`;
            return;
        }

        if (Game.state.playerList.length === 0) {
            playersListEl.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#718096; font-size:13px;">😢 球队暂无球员</div>`;
            return;
        }

        let html = '';
        Game.state.playerList.forEach((player) => {
            const warningClass = Game.state.playerWarningShown.has(player.id) ? 'warning' : '';

            let loyaltyColor = '#22c55e';
            if (player.loyalty < 30) loyaltyColor = '#ef4444';
            else if (player.loyalty < 60) loyaltyColor = '#eab308';

            let skillColor = '#3b82f6';
            if (player.skill < 30) skillColor = '#94a3b8';
            else if (player.skill < 60) skillColor = '#60a5fa';

            html += `
                <div class="player-card ${warningClass}" id="playerCard-${player.id}" 
                    onclick="UI.showPlayerDetail(${player.id})" 
                    title="${player.personality || '队员'}">
                    <h4>⚾ ${player.name}</h4>
                    
                    <div style="display: flex; align-items: center; gap: 3px; margin: 3px 0;">
                        <span style="font-size: 10px; min-width: 35px;">❤️ 忠诚</span>
                        <div style="width: 40px; height: 10px; background: #fee2e2; border-radius: 3px; overflow: hidden;">
                            <div style="width: ${
                                player.loyalty
                            }%; height: 100%; background: ${loyaltyColor}; border-radius: 3px;"></div>
                        </div>
                        <span style="font-size: 10px; min-width: 15px; text-align: right;">${player.loyalty}</span>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 3px; margin: 3px 0;">
                        <span style="font-size: 10px; min-width: 35px;">⚡ 球技</span>
                        <div style="width: 40px; height: 10px; background: #dbeafe; border-radius: 3px; overflow: hidden;">
                            <div style="width: ${
                                player.skill
                            }%; height: 100%; background: ${skillColor}; border-radius: 3px;"></div>
                        </div>
                        <span style="font-size: 10px; min-width: 15px; text-align: right;">${player.skill}</span>
                    </div>
                    
                    <div class="player-attr"><span>📅 入队</span><span>${Game.formatShortDate(
                        player.joinDate
                    )}</span></div>
                    
                    <div class="player-float" id="playerLoyaltyFloat-${player.id}"></div>
                    <div class="player-float" id="playerSkillFloat-${player.id}"></div>
                </div>
            `;
        });

        playersListEl.innerHTML = html;
    },

    // ====================== 关系网络可视化 ======================
    renderRelationshipNetwork: function () {
        const networkEl = document.getElementById('relationshipNetwork');
        if (!networkEl) return;

        if (Game.state.playerList.length < 2) {
            networkEl.innerHTML = `
                <div style="color:#718096; font-size:12px; text-align:center; padding:20px;">
                    球队人数不足，暂无关系网络
                </div>
            `;
            return;
        }

        let positions = this.calculatePositions(Game.state.playerList.length);
        let svgWidth = 240;
        let svgHeight = 200;

        let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="background:transparent;">`;

        for (let i = 0; i < Game.state.playerList.length; i++) {
            for (let j = i + 1; j < Game.state.playerList.length; j++) {
                let p1 = Game.state.playerList[i];
                let p2 = Game.state.playerList[j];

                let value = Game.getRelationshipValue(p1, p2);
                if (Math.abs(value) < 30) continue;

                let pos1 = positions[i];
                let pos2 = positions[j];

                let style = this.getNetworkLineStyle(value);
                let lineId = `line-${p1.id}-${p2.id}`;

                svg += `
                    <line 
                        id="${lineId}"
                        x1="${pos1.x}" y1="${pos1.y}" 
                        x2="${pos2.x}" y2="${pos2.y}" 
                        stroke="${style.color}" 
                        stroke-width="${style.width}" 
                        stroke-dasharray="${style.dash}" 
                        stroke-opacity="0.8"
                        style="cursor:pointer; transition:stroke-width 0.3s, stroke-opacity 0.3s;"
                        onmouseover="this.setAttribute('stroke-opacity', '1'); this.setAttribute('stroke-width', '${
                            parseFloat(style.width) + 1
                        }')"
                        onmouseout="this.setAttribute('stroke-opacity', '0.8'); this.setAttribute('stroke-width', '${
                            style.width
                        }')"
                        onclick="UI.showRelationshipDetail(${p1.id}, ${p2.id}, event)"
                    />
                `;
            }
        }

        Game.state.playerList.forEach((player, index) => {
            let pos = positions[index];
            let nodeSize = 22 + Math.floor(player.loyalty / 10);

            svg += `
                <g data-player-id="${player.id}" onclick="UI.showPlayerDetail(${player.id})" style="cursor:pointer;">
                    <circle 
                        cx="${pos.x}" cy="${pos.y}" r="${nodeSize / 2}" 
                        fill="white" 
                        stroke="#e24070" 
                        stroke-width="2"
                        style="transition:r 0.2s;"
                        onmouseover="this.setAttribute('r', '${nodeSize / 2 + 2}')"
                        onmouseout="this.setAttribute('r', '${nodeSize / 2}')"
                    />
                    <text 
                        x="${pos.x}" y="${pos.y}" 
                        text-anchor="middle" 
                        dominant-baseline="middle" 
                        font-size="10" 
                        font-weight="bold" 
                        fill="#2d3748"
                    >
                        ${player.name}
                    </text>
                </g>
            `;
        });

        svg += '</svg>';
        networkEl.innerHTML = svg;
    },

    calculatePositions: function (count) {
        let positions = [];
        let centerX = 120;
        let centerY = 100;
        let radius = 70;

        for (let i = 0; i < count; i++) {
            let angle = (i / count) * 2 * Math.PI - Math.PI / 2;
            positions.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            });
        }

        return positions;
    },

    getNetworkLineStyle: function (value) {
        let absValue = Math.abs(value);

        let color;
        if (value >= 60) color = '#e24070';
        else if (value >= 1) color = '#4299e1';
        else if (value >= -60) color = '#e67e22';
        else color = '#ef4444';

        let width;
        if (absValue >= 61) width = 3;
        else if (absValue >= 30) width = 2.5;
        else width = 2;

        let dash = value < 0 ? '5,3' : '';

        return { color, width, dash };
    },

    // ====================== 小团体列表渲染 ======================
    renderFactionsList: function () {
        let factionsList = document.getElementById('factionsList');
        if (!factionsList) return;

        let factions = Game.getActiveFactions();

        if (factions.length === 0) {
            factionsList.innerHTML = `<div style="color:#718096; font-size:12px; text-align:center; padding:5px;">暂无小团体</div>`;
            return;
        }

        let html = '';

        factions.forEach((faction) => {
            // 添加安全判断，确保 faction.members 存在
            if (!faction || !faction.members || faction.members.length === 0) return;
            let members = faction.members.map((m) => m.name).join('、');

            html += `
                <div style="margin-bottom:8px; padding-bottom:8px; border-bottom:1px dashed #ffe0e5;">
                    <div style="font-weight:bold; color:#e24070; font-size:12px; margin-bottom:3px;">
                        ${faction.members[0].name}的小团体
                    </div>
                    <div style="font-size:11px; color:#2d3748;">
                        ${members}
                    </div>
                </div>
            `;
        });

        factionsList.innerHTML = html;
    },

    // ====================== 比赛历史 ======================
    updateMatchHistory: function () {
        let historyEl = document.getElementById('matchHistoryList');
        if (!historyEl) return;

        if (Game.state.matchHistory.length === 0) {
            historyEl.innerHTML = '<div style="color:#718096; font-size:12px; text-align:center;">暂无比赛记录</div>';
            return;
        }

        let html = '';
        Game.state.matchHistory.slice(0, 5).forEach((match) => {
            // 使用存储的标题，如果没有则根据类型判断
            let title =
                match.title ||
                (match.type === 'xizhao'
                    ? '🏆 曦照赛'
                    : match.type === 'national'
                    ? '🏆 全国大赛'
                    : match.type === 'tournament'
                    ? '🏆 锦标赛'
                    : '⚾ 友谊赛');

            // 根据比赛类型设置不同颜色
            let titleColor = match.type === 'national' ? '#FFD700' : match.type === 'xizhao' ? '#e24070' : '#718096';

            html += `
                <div class="match-record ${match.win ? 'win' : 'loss'}" style="border-left-color: ${
                match.win ? '#22c55e' : '#ef4444'
            };">
                    <div style="display:flex; justify-content:space-between;">
                        <span>${match.date}</span>
                        <span style="font-weight:bold;">${match.win ? '🏆 胜' : '🌧️ 负'}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:4px;">
                        <span>${Game.state.teamName} vs ${match.opponent}</span>
                        <span style="font-weight:bold; ${match.win ? 'color:#22c55e' : 'color:#ef4444'}">${
                match.score
            }</span>
                    </div>
                    <div style="font-size:11px; color: ${titleColor}; margin-top:2px; font-weight: bold;">${title}</div>
                </div>
            `;
        });

        historyEl.innerHTML = html;
    },

    // ====================== 日志 ======================
    addLog: function (text, changes) {
        let log = `[${formatDate(Game.state.currentDate)}] ${text}`;

        if (changes) {
            let parts = [];
            if (changes.spirit !== undefined) parts.push(`精神力${changes.spirit >= 0 ? '+' : ''}${changes.spirit}`);
            if (changes.skill !== undefined) parts.push(`你的球技${changes.skill >= 0 ? '+' : ''}${changes.skill}`);
            if (changes.relation !== undefined)
                parts.push(`人际关系${changes.relation >= 0 ? '+' : ''}${changes.relation}`);
            if (changes.players !== undefined)
                parts.push(`球队人数${changes.players >= 0 ? '+' : ''}${changes.players}`);
            if (changes.mood !== undefined) parts.push(`队内气氛${changes.mood >= 0 ? '+' : ''}${changes.mood}`);
            if (changes.teamLevel !== undefined)
                parts.push(`球队实力${changes.teamLevel >= 0 ? '+' : ''}${changes.teamLevel}`);

            if (parts.length > 0) log += '　｜　' + parts.join('　');
        }

        let logEl = document.getElementById('log');
        logEl.innerHTML = log + '<br>' + logEl.innerHTML;

        if (logEl.children.length > 15) logEl.removeChild(logEl.lastChild);
    },

    updateButtons: function () {
        if (!Game || !Game.state) {
            console.log('updateButtons: Game.state 不存在，跳过');
            return;
        }
        // ===== 修复：用 Game.state 不是 this.state =====
        if (!Game.state.xiZhaoInProgress) {
            if (typeof ModalGuard !== 'undefined') {
                ModalGuard.fixState(Game.state);
            }
        }
        // ===== 结束：状态检查 =====
        const wdBtns = document.querySelectorAll('#weekdayActions button');
        const weBtns = document.querySelectorAll('#weekendActions button');

        // 全局禁用条件
        const globalDisabled = !Game.state.gameStarted || Game.state.gameOver || Game.state.isEventActive;

        if (globalDisabled) {
            wdBtns.forEach((b) => (b.disabled = true));
            weBtns.forEach((b) => (b.disabled = true));
            return;
        }

        // 根据周末状态分别处理
        const isWeekend = Game.state.isWeekend;
        const hasActions = Game.state.weekdayActionsLeft > 0;

        // 工作日按钮
        wdBtns.forEach((b) => {
            if (isWeekend) {
                b.disabled = true; // 周末全部禁用
                return;
            }

            // 工作日：按按钮类型判断
            const text = b.textContent;
            if (text.includes('摸鱼摆烂')) {
                b.disabled = !hasActions || Game.state.teamLevel <= 0;
            } else if (text.includes('个别球员沟通')) {
                b.disabled = !hasActions || Game.state.playerList.length === 0;
            } else {
                b.disabled = !hasActions; // 其他按钮只需要行动力
            }
        });

        // 周末按钮
        weBtns.forEach((b) => {
            if (!isWeekend) {
                b.disabled = true; // 工作日全部禁用
                return;
            }

            // 周末：默认启用，但友谊赛需要特殊判断
            b.disabled = false;
        });

        // 单独处理友谊赛按钮（周末时）
        if (isWeekend) {
            let playBtn = document.querySelector("button[onclick='Game.playFriendlyMatch()']");
            if (playBtn) playBtn.disabled = !Game.state.hasBookedFriendlyMatch;
        }

        // 约友谊赛按钮（始终在工作日判断）
        let bookBtn = document.getElementById('bookMatchBtn');
        if (bookBtn) {
            bookBtn.disabled = !(!isWeekend && hasActions && !Game.state.bookedThisWeek && !globalDisabled);
        }
    },

    updateSlackOffButton: function () {
        let slackBtn = Array.from(document.querySelectorAll('#weekdayActions button')).find((btn) =>
            btn.textContent.includes('摸鱼摆烂')
        );
        if (slackBtn)
            slackBtn.disabled = !(
                Game.state.gameStarted &&
                !Game.state.gameOver &&
                !Game.state.isEventActive &&
                !Game.state.isWeekend &&
                Game.state.weekdayActionsLeft > 0 &&
                Game.state.teamLevel > 0
            );
    },

    // ====================== 球员选择弹窗 ======================
    // ====================== 球员选择弹窗 ======================
    openPlayerSelectModal: function () {
        if (
            !Game.state.gameStarted ||
            Game.state.gameOver ||
            Game.state.isEventActive ||
            Game.state.isWeekend ||
            Game.state.weekdayActionsLeft <= 0
        )
            return;

        if (Game.state.playerList.length === 0) {
            this.showResultModal('💬 个别球员沟通', '球队没有球员可以沟通');
            return;
        }

        let modal = document.getElementById('playerSelectModal');
        let playersHtml = '';

        Game.state.playerList.forEach((player) => {
            // 忠诚度颜色
            let loyaltyColor = '#22c55e';
            if (player.loyalty < 30) loyaltyColor = '#ef4444';
            else if (player.loyalty < 60) loyaltyColor = '#eab308';

            // 球技颜色
            let skillColor = '#3b82f6';
            if (player.skill < 30) skillColor = '#94a3b8';
            else if (player.skill < 60) skillColor = '#60a5fa';

            playersHtml += `
            <div class="player-select-card" onclick="UI.selectPlayerForTalk(${player.id})">
                <h4 style="margin:0 0 8px 0; color:#2d3748;">⚾ ${player.name}</h4>
                
                <!-- 忠诚度进度条 -->
                <div style="margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                        <span style="color:#718096;">❤️ 忠诚</span>
                        <span style="font-weight:bold; color:${loyaltyColor};">${player.loyalty}</span>
                    </div>
                    <div style="width:100%; height:8px; background:#fee2e2; border-radius:4px; overflow:hidden;">
                        <div style="width:${player.loyalty}%; height:100%; background:${loyaltyColor}; border-radius:4px;"></div>
                    </div>
                </div>
                
                <!-- 球技进度条 -->
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                        <span style="color:#718096;">⚡ 球技</span>
                        <span style="font-weight:bold; color:${skillColor};">${player.skill}</span>
                    </div>
                    <div style="width:100%; height:8px; background:#dbeafe; border-radius:4px; overflow:hidden;">
                        <div style="width:${player.skill}%; height:100%; background:${skillColor}; border-radius:4px;"></div>
                    </div>
                </div>
            </div>
        `;
        });

        modal.innerHTML = `
        <div class="event-modal-content" style="width: 550px; max-width: 90vw;">
            <h2 class="event-modal-title" style="margin-bottom: 15px;">💬 选择沟通对象</h2>
            <div class="player-selector" style="grid-template-columns: repeat(3, 1fr); gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 5px;">
                ${playersHtml}
            </div>
            <div class="event-modal-buttons" style="margin-top: 15px;">
                <button onclick="UI.closePlayerSelectModal()" style="background:#718096;">取消</button>
            </div>
        </div>
    `;

        modal.style.display = 'flex';
    },

    closePlayerSelectModal: function () {
        document.getElementById('playerSelectModal').style.display = 'none';
        document.getElementById('playerSelectModal').innerHTML = '';
        Game.state.tempSelectedPlayerId = null;
        // ⭐ 新增
        if (!Game.state.xiZhaoInProgress) {
            ModalGuard.fixState(Game.state);
            Game.updateAll();
        }
    },

    selectPlayerForTalk: function (playerId) {
        let selectedId = playerId;
        this.closePlayerSelectModal();

        let player = Game.state.playerList.find((p) => p.id === selectedId);
        if (!player) {
            this.showResultModal('💬 个别球员沟通', '球员不存在');
            return;
        }

        let ds = Game.applySpiritChange(-randomDelta(20, 30));
        Game.state.spirit += ds;

        let loyaltyIncrease = randomDelta(8, 15);
        player.loyalty = Math.min(100, player.loyalty + loyaltyIncrease);

        let relationIncrease = Game.individualTalk(player);

        this.updatePlayersList();
        this.showFloat('spirit', ds);
        this.showPlayerFloat(player.id, 'loyalty', loyaltyIncrease);

        this.addLog(`💬 和${player.name}深入沟通，忠诚度+${loyaltyIncrease}，与所有人关系+${relationIncrease}`, {
            spirit: ds,
        });

        Game.checkPlayerLoyaltyAndWarn(player);

        this.showEventResultModal(
            '💬 个别球员沟通',
            `你和${player.name}聊了很多，她非常感动。<br>忠诚度 +${loyaltyIncrease}<br>与队友的关系也改善了。`,
            { spirit: ds }
        );

        Game.finishAction();
    },

    // ====================== 自主训练选择弹窗 ======================
    openSelfTrainPlayerSelect: function () {
        if (
            !Game.state.gameStarted ||
            Game.state.gameOver ||
            Game.state.isEventActive ||
            Game.state.isWeekend ||
            Game.state.weekdayActionsLeft <= 0
        )
            return;

        if (Game.state.playerList.length === 0) {
            this.showResultModal('🏃 自主训练', '球队没有球员可以一起训练');
            return;
        }

        let modal = document.getElementById('playerSelectModal');
        let playersHtml = '';
        let gridCols = Game.state.playerList.length >= 15 ? 4 : Game.state.playerList.length >= 8 ? 3 : 2;

        Game.state.playerList.forEach((player) => {
            // 忠诚度颜色
            let loyaltyColor = '#22c55e';
            if (player.loyalty < 30) loyaltyColor = '#ef4444';
            else if (player.loyalty < 60) loyaltyColor = '#eab308';

            // 球技颜色
            let skillColor = '#3b82f6';
            if (player.skill < 30) skillColor = '#94a3b8';
            else if (player.skill < 60) skillColor = '#60a5fa';

            playersHtml += `
            <div class="player-select-card compact" onclick="if(!event.target.classList.contains('rel-icon-small')) UI.toggleSelectPlayerForTrain(${player.id})" 
                 id="trainSelect-${player.id}" style="position: relative; padding: 10px;">
                <h4 style="margin:0 0 8px 0; font-size: 14px;">⚾ ${player.name}</h4>
                
                <!-- 忠诚度进度条 -->
                <div style="margin-bottom: 6px;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                        <span style="color:#718096;">❤️ 忠诚</span>
                        <span style="font-weight:bold; color:${loyaltyColor};">${player.loyalty}</span>
                    </div>
                    <div style="width:100%; height:6px; background:#fee2e2; border-radius:3px; overflow:hidden;">
                        <div style="width:${player.loyalty}%; height:100%; background:${loyaltyColor}; border-radius:3px;"></div>
                    </div>
                </div>
                
                <!-- 球技进度条 -->
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                        <span style="color:#718096;">⚡ 球技</span>
                        <span style="font-weight:bold; color:${skillColor};">${player.skill}</span>
                    </div>
                    <div style="width:100%; height:6px; background:#dbeafe; border-radius:3px; overflow:hidden;">
                        <div style="width:${player.skill}%; height:100%; background:${skillColor}; border-radius:3px;"></div>
                    </div>
                </div>
                
                <div class="selected-mark" id="selectedMark-${player.id}" style="display:none;">✓</div>
            </div>
        `;
        });

        let gridStyle = `grid-template-columns: repeat(${gridCols}, 1fr);`;

        modal.innerHTML = `
        <div class="event-modal-content self-train-modal" style="width: 650px; max-width: 95vw;">
            <div class="modal-header">
                <h2 class="event-modal-title" style="font-size:16px; margin-bottom:5px;">🏃 选择一起训练的球员</h2>
                <p style="font-size:12px; color:#e24070; text-align:center; font-weight:bold;">请选择两名球员一起训练</p>
            </div>
            
            <div class="player-selector compact" style="${gridStyle} max-height:400px; overflow-y:auto; padding-right:5px; gap: 8px;">
                ${playersHtml}
            </div>
            
            <div class="selected-count-bar" id="selectedCount" style="margin: 10px 0;">
                已选择 <span style="font-size:16px; font-weight:bold;">0</span> / 2 位球员
            </div>
            
            <div class="event-modal-buttons compact" style="display: flex; gap: 10px;">
                <button onclick="UI.confirmSelfTrain()" style="background:#22c55e; flex:2;" id="confirmTrainBtn" disabled>开始训练</button>
                <button onclick="UI.closePlayerSelectModal()" style="background:#718096; flex:1;">取消</button>
            </div>
            
            <p style="font-size:11px; color:#999; text-align:center; margin:8px 0 0 0;">
                💡 当前球队共 ${Game.state.playerList.length} 人
            </p>
        </div>
    `;

        modal.style.display = 'flex';
        Game.state.selectedTrainPlayers = new Set();
    },

    toggleSelectPlayerForTrain: function (playerId) {
        let selectedSet = Game.state.selectedTrainPlayers || new Set();
        let card = document.getElementById(`trainSelect-${playerId}`);
        let mark = document.getElementById(`selectedMark-${playerId}`);

        if (selectedSet.has(playerId)) {
            selectedSet.delete(playerId);
            if (card) card.classList.remove('selected');
            if (mark) mark.style.display = 'none';
        } else {
            if (selectedSet.size >= 2) {
                alert('⚠️ 只能选择两名球员一起训练');
                return;
            }
            selectedSet.add(playerId);
            if (card) card.classList.add('selected');
            if (mark) mark.style.display = 'block';
        }

        Game.state.selectedTrainPlayers = selectedSet;

        let countEl = document.getElementById('selectedCount');
        let confirmBtn = document.getElementById('confirmTrainBtn');

        if (countEl) {
            countEl.innerHTML = `已选择 <span style="font-size:16px; font-weight:bold;">${selectedSet.size}</span> / 2 位球员`;
        }
        if (confirmBtn) {
            confirmBtn.disabled = selectedSet.size !== 2;
        }
    },

    confirmSelfTrain: function () {
        let selectedSet = Game.state.selectedTrainPlayers || new Set();

        if (selectedSet.size !== 2) {
            this.showResultModal('🏃 自主训练', '必须选择两名球员一起训练');
            return;
        }

        let selectedPlayers = [];
        selectedSet.forEach((id) => {
            let player = Game.state.playerList.find((p) => p.id == id);
            if (player) selectedPlayers.push(player);
        });

        this.closePlayerSelectModal();

        // 直接调用 executeSelfTrain，绕过 selfTrain
        Game.executeSelfTrain(selectedPlayers);
    },

    // ====================== 选择弹窗（有选项） ======================
    showChoiceModal: function (title, desc, choices) {
        // ✅ 如果 choices 不是数组或者没有选项，直接返回，不显示弹窗
        if (!choices || !Array.isArray(choices) || choices.length === 0) {
            console.log('没有可用的选项，跳过弹窗');
            return;
        }

        // 曦照赛进行中时不显示其他弹窗 - 但需要检查是否真的是曦照赛弹窗
        if (this.modalState.xiZhaoActive && !title.includes('曦照') && !title.includes('曦照赛')) {
            console.log('曦照赛进行中，不显示其他弹窗');
            return;
        }

        // 关闭其他低优先级弹窗
        if (this.modalState.activeModal === 'result' || this.modalState.activeModal === 'info') {
            this.closeModal(this.modalState.activeModal);
        }

        // 如果已经有选择弹窗，先关闭
        if (this.modalState.activeModal === 'choice') {
            this.closeModal('choice');
        }

        // 设置状态
        this.modalState.activeModal = 'choice';
        Game.state.isEventActive = true;
        this.updateButtons();

        const modal = document.getElementById('choiceModal');
        let html = `
        <div class="event-modal-content">
            <h2 class="event-modal-title">${title}</h2>
            <div class="event-modal-desc">${desc}</div>
            <div class="event-modal-buttons">
                ${choices
                    .map((c, i) => `<button onclick="UI.handleChoiceModalChoice(${i})">${c.text}</button>`)
                    .join('')}
            </div>
        </div>
    `;

        modal.innerHTML = html;
        modal.style.display = 'flex';
        window.currentModalChoices = choices;
    },

    // ====================== 结果弹窗（只需确认） ======================
    showResultModal: function (title, message, changes) {
        // 曦照赛进行中时不显示
        if (this.modalState.xiZhaoActive) return;

        // 关闭可能存在的选择弹窗
        if (this.modalState.activeModal === 'choice') {
            this.closeModal('choice');
        }

        // 如果已经有结果弹窗，先关闭
        if (this.modalState.activeModal === 'result') {
            this.closeModal('result');
        }

        this.modalState.activeModal = 'result';
        Game.state.isEventActive = true;
        this.updateButtons();

        let changesHtml = '';
        if (changes) {
            let changeList = [];
            if (changes.spirit !== undefined)
                changeList.push(`精神力: ${changes.spirit >= 0 ? '+' : ''}${changes.spirit}`);
            if (changes.skill !== undefined)
                changeList.push(`你的球技: ${changes.skill >= 0 ? '+' : ''}${changes.skill}`);
            if (changes.relation !== undefined)
                changeList.push(`人际关系: ${changes.relation >= 0 ? '+' : ''}${changes.relation}`);
            if (changes.mood !== undefined) changeList.push(`队内气氛: ${changes.mood >= 0 ? '+' : ''}${changes.mood}`);
            if (changes.teamLevel !== undefined)
                changeList.push(`球队实力: ${changes.teamLevel >= 0 ? '+' : ''}${changes.teamLevel}`);

            if (changeList.length > 0) {
                changesHtml = `
                <div style="margin-top:15px; padding-top:15px; border-top:1px solid #eee;">
                    <strong>✨ 属性变化</strong><br>
                    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
                        ${changeList
                            .map(
                                (c) =>
                                    `<span style="background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px;">${c}</span>`
                            )
                            .join('')}
                    </div>
                </div>
            `;
            }
        }

        const modal = document.getElementById('resultModal');
        modal.innerHTML = `
            <div class="event-modal-content" style="max-width: 500px; max-height: 80vh; display: flex; flex-direction: column;">
                <h2 class="event-modal-title" style="flex-shrink: 0;">${title}</h2>
                <div class="event-modal-desc" style="flex: 1; overflow-y: auto; padding-right: 5px;">${message}${changesHtml}</div>
                <div class="event-modal-buttons" style="flex-shrink: 0; margin-top: 10px;">
                    <button onclick="UI.closeResultModal()" style="background:#e24070;">确定</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    },

    closeResultModal: function () {
        document.getElementById('resultModal').style.display = 'none';
        document.getElementById('resultModal').innerHTML = '';

        this.modalState.activeModal = null;

        if (!this.modalState.xiZhaoActive && !this.modalState.activeModal) {
            Game.state.isEventActive = false;
        }
        // ===== 新增：检查状态不一致 =====
        // 非曦照赛期间才修复
        if (!Game.state.xiZhaoInProgress) {
            ModalGuard.fixState(Game.state);
        }
        // ✅ 招募不推进日期，只刷新UI
        Game.updateAll();
    },

    // ====================== 信息弹窗（小团体、球员详情等） ======================
    showInfoModal: function (title, message, options = {}) {
        // 曦照赛进行中时不显示
        if (this.modalState.xiZhaoActive) return;

        // 信息弹窗优先级低，如果已有选择弹窗，不显示（避免干扰）
        if (this.modalState.activeModal === 'choice') {
            console.log('已有选择弹窗，不显示信息弹窗');
            return;
        }

        // 如果已有结果弹窗，先关闭
        if (this.modalState.activeModal === 'result') {
            this.closeModal('result');
        }

        this.modalState.activeModal = 'info';
        Game.state.isEventActive = true;
        this.updateButtons();

        const modal = document.getElementById('infoModal');
        modal.innerHTML = `
        <div class="event-modal-content">
            <h2 class="event-modal-title">${title}</h2>
            <div class="event-modal-desc">${message}</div>
            <div class="event-modal-buttons"><button onclick="UI.closeInfoModal()" style="background:#e24070;">${
                options.buttonText || '知道了'
            }</button></div>
        </div>
    `;
        modal.style.display = 'flex';
        // 保存回调函数
        this._onInfoModalClose = options.onClose || null;
    },

    // ====================== 关闭信息弹窗 ======================
    closeInfoModal: function () {
        document.getElementById('infoModal').style.display = 'none';
        document.getElementById('infoModal').innerHTML = '';

        this.modalState.activeModal = null;

        if (!this.modalState.xiZhaoActive) {
            Game.state.isEventActive = false;
        }
        // ⭐ 新增
        if (!Game.state.xiZhaoInProgress) {
            ModalGuard.fixState(Game.state);
        }
        // 调用回调函数（如果有）
        if (this._onInfoModalClose) {
            this._onInfoModalClose();
            this._onInfoModalClose = null;
        }
        Game.updateAll();
    },

    // ====================== 通用关闭弹窗 ======================
    closeModal: function (modalType) {
        const modal = document.getElementById(modalType + 'Modal');
        if (modal) {
            modal.style.display = 'none';
            modal.innerHTML = '';
        }

        if (this.modalState.activeModal === modalType) {
            this.modalState.activeModal = null;
        }
    },

    // ====================== 设置曦照赛状态 ======================
    setXiZhaoActive: function (active) {
        this.modalState.xiZhaoActive = active;
        if (!active && !this.modalState.activeModal) {
            Game.state.isEventActive = false;
        }
    },

    // ====================== 处理选择弹窗的选项 ======================
    handleChoiceModalChoice: function (idx) {
        if (window.currentModalChoices && window.currentModalChoices[idx]) {
            window.currentModalChoices[idx].run(Game.state);
        }

        // 关闭选择弹窗
        this.closeModal('choice');

        // 注意：这里不设置 isEventActive = false
        // 因为 run 函数中可能会显示结果弹窗
    },

    // ====================== 弹窗系统 ======================
    showEventModal: function (title, desc, choices) {
        // **临时兼容**：如果是曦照赛相关，使用 xiZhaoModal
        if (title.includes('曦照') || title.includes('曦照赛')) {
            this.showXiZhaoModal(title, desc, choices);
            return;
        }
        Game.state.isEventActive = true;
        this.updateButtons();

        const modal = document.getElementById('eventModal');
        let html = `
            <div class="event-modal-content">
                <h2 class="event-modal-title">${title}</h2>
                <div class="event-modal-desc">${desc}</div>
                <div class="event-modal-buttons">
                    ${choices.map((c, i) => `<button onclick="UI.handleModalChoice(${i})">${c.text}</button>`).join('')}
                </div>
            </div>
        `;

        modal.innerHTML = html;
        modal.style.display = 'flex';
        window.currentModalChoices = choices;
    },

    handleModalChoice: function (idx) {
        if (window.currentModalChoices && window.currentModalChoices[idx]) {
            window.currentModalChoices[idx].run(Game.state);
        }

        document.getElementById('eventModal').style.display = 'none';
        document.getElementById('eventModal').innerHTML = '';

        if (
            Game.state.xiZhaoInProgress &&
            Game.state.xiZhaoStatus >= Game.state.XIZHAO_STATUS.DAY1 &&
            Game.state.xiZhaoStatus <= Game.state.XIZHAO_STATUS.DAY3
        ) {
            Game.playCurrentXiZhaoMatch();
        } else {
            Game.state.isEventActive = false;
            Game.updateAll();
        }

        this.updatePlayersList();
        this.renderRelationshipNetwork();
        this.renderFactionsList();
    },

    showEventResultModal: function (title, message, changes) {
        let changesHtml = '';
        if (changes) {
            let changeList = [];
            if (changes.spirit !== undefined)
                changeList.push(`精神力: ${changes.spirit >= 0 ? '+' : ''}${changes.spirit}`);
            if (changes.skill !== undefined)
                changeList.push(`你的球技: ${changes.skill >= 0 ? '+' : ''}${changes.skill}`);
            if (changes.relation !== undefined)
                changeList.push(`人际关系: ${changes.relation >= 0 ? '+' : ''}${changes.relation}`);
            if (changes.mood !== undefined) changeList.push(`队内气氛: ${changes.mood >= 0 ? '+' : ''}${changes.mood}`);
            if (changes.teamLevel !== undefined)
                changeList.push(`球队实力: ${changes.teamLevel >= 0 ? '+' : ''}${changes.teamLevel}`);

            if (changeList.length > 0) {
                changesHtml = `
                    <div style="margin-top:15px; padding-top:15px; border-top:1px solid #eee;">
                        <strong>✨ 属性变化</strong><br>
                        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
                            ${changeList
                                .map(
                                    (c) =>
                                        `<span style="background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px;">${c}</span>`
                                )
                                .join('')}
                        </div>
                    </div>
                `;
            }
        }

        let modal = document.getElementById('eventModal');
        modal.innerHTML = `
            <div class="event-modal-content">
                <h2 class="event-modal-title">${title}</h2>
                <div class="event-modal-desc">${message}${changesHtml}</div>
                <div class="event-modal-buttons"><button onclick="UI.closeResultModal()" style="background:#e24070;">确定</button></div>
            </div>
        `;
        modal.style.display = 'flex';
    },

    showResultModal: function (title, message) {
        let modal = document.getElementById('eventModal');
        modal.innerHTML = `
            <div class="event-modal-content">
                <h2 class="event-modal-title">${title}</h2>
                <div class="event-modal-desc" style="text-align:center; padding:20px 0;">${message}</div>
                <div class="event-modal-buttons"><button onclick="UI.closeResultModal()" style="background:#e24070;">确定</button></div>
            </div>
        `;
        modal.style.display = 'flex';
    },

    closeResultModal: function () {
        document.getElementById('eventModal').style.display = 'none';
        document.getElementById('eventModal').innerHTML = '';
        Game.state.isEventActive = false;

        if (window.pendingFinishAction) {
            window.pendingFinishAction = false;
            Game.finishAction(); // 这会推进日期
        } else {
            // ⭐ 新增
            if (!Game.state.xiZhaoInProgress) {
                ModalGuard.fixState(Game.state);
            }
            Game.updateAll();
        }
    },

    showMatchResultModal: function (win, scoreTeam, scoreOpponent, highlights, changes, opponentName = null) {
        Game.state.isEventActive = true;
        this.updateButtons();

        let opp =
            opponentName || Game.state.matchOpponents[Math.floor(Math.random() * Game.state.matchOpponents.length)];
        const resultTitle = win ? '🏆 友谊赛 胜利！' : '😔 友谊赛 惜败';
        const resultColor = win ? '#22c55e' : '#ef4444';

        Game.addMatchRecord(Game.state.currentDate, opp, scoreTeam, scoreOpponent, win, false);
        Game.state.seasonMatchCount++;
        if (win) Game.state.seasonWinCount++;

        let highlightsHtml =
            highlights && highlights.length
                ? '<div style="margin-top:15px;"><strong>✨ 精彩表现</strong><br>' +
                  highlights
                      .map(
                          (h) =>
                              `<div style="background:#f8f9fa; padding:6px 10px; margin-top:8px; border-radius:6px; border-left:3px solid #e24070;">⚾ ${h}</div>`
                      )
                      .join('') +
                  '</div>'
                : '';

        let changesHtml = changes
            ? (() => {
                  let list = [];
                  if (changes.teamLevel) list.push(`球队实力 ${changes.teamLevel > 0 ? '+' : ''}${changes.teamLevel}`);
                  if (changes.mood) list.push(`队内气氛 ${changes.mood > 0 ? '+' : ''}${changes.mood}`);
                  if (changes.relation) list.push(`人际关系 ${changes.relation > 0 ? '+' : ''}${changes.relation}`);
                  if (changes.spirit) list.push(`精神力 ${changes.spirit > 0 ? '+' : ''}${changes.spirit}`);
                  return list.length
                      ? `<div style="margin-top:15px;"><strong>📊 赛后影响</strong><br><span style="color:#2d3748;">${list.join(
                            ' · '
                        )}</span></div>`
                      : '';
              })()
            : '';

        const desc = `
            <div style="text-align:center;">
                <div style="font-size:14px; color:#666;">${formatDate(Game.state.currentDate)} 友谊赛 vs ${opp}</div>
                <div class="match-score" style="color:${resultColor};">${scoreTeam} : ${scoreOpponent}</div>
                <div style="font-size:16px; font-weight:bold; margin:10px 0; color:${resultColor};">${resultTitle}</div>
                <div style="background:#fef2f4; padding:12px; border-radius:12px; margin:15px 0;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span>${Game.state.teamName}</span>
                        <span style="font-weight:bold;">${scoreTeam}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>${opp}</span>
                        <span style="font-weight:bold;">${scoreOpponent}</span>
                    </div>
                </div>
                ${highlightsHtml}
                ${changesHtml}
            </div>
        `;

        document.getElementById('eventModal').innerHTML = `
        <div class="event-modal-content" style="max-width:450px;">
            <h2 class="event-modal-title" style="color:${resultColor};">${win ? '🏆 胜利' : '🌧️ 失利'}</h2>
            <div class="event-modal-desc" style="max-height:500px;">${desc}</div>
            <div class="event-modal-buttons">
                <button onclick="UI.closeMatchResultModal()" style="background:#e24070;">继续征程</button>
            </div>
        </div>
    `;

        document.getElementById('eventModal').style.display = 'flex';
    },

    closeMatchResultModal: function () {
        document.getElementById('eventModal').style.display = 'none';
        document.getElementById('eventModal').innerHTML = '';
        Game.state.isEventActive = false;

        if (window.pendingFinishAction) {
            window.pendingFinishAction = false;
            Game.finishAction();
        } else {
            // ===== 新增 =====
            if (!Game.state.xiZhaoInProgress) {
                ModalGuard.fixState(Game.state);
            }
            // ===== 结束 =====
            Game.updateAll();
        }
    },

    // ====================== 曦照赛专用弹窗系统 ======================
    // ====================== 曦照赛单场比赛弹窗 ======================
    showXiZhaoMatchModal: function (
        day,
        opponent,
        win,
        teamScore,
        oppScore,
        matchDesc,
        moodDelta,
        currentWins,
        currentLosses,
        nextOpponent
    ) {
        // 关闭所有其他弹窗
        this.closeAllModals();

        // 设置曦照赛状态
        this.modalState.xiZhaoActive = true;
        Game.state.isEventActive = true;
        this.updateButtons();

        const resultColor = win ? '#22c55e' : '#ef4444';
        const resultText = win ? '🏆 胜利' : '🌧️ 失利';

        let nextMatchHtml = '';
        if (day < 3) {
            nextMatchHtml = `
        <div style="background:#f8f9fa; padding:8px; border-radius:6px; margin:10px 0;">
            <div style="font-size:12px; color:#2d3748; margin-bottom:3px;">📅 明日赛程</div>
            <div style="font-size:14px; font-weight:bold; color:#e24070;">vs ${nextOpponent}</div>
        </div>
    `;
        }

        let desc = `
    <div style="text-align:center; font-size:13px;">
        <div style="font-size:18px; font-weight:bold; color:#e24070; margin-bottom:10px;">
            🏆 曦照赛 第${day}天
        </div>
        
        <div style="background:${win ? '#f0fdf4' : '#fff5f5'}; padding:12px; border-radius:8px; margin-bottom:10px;">
            <div style="font-size:14px; font-weight:bold; margin-bottom:5px; color:#2d3748;">
                对阵 ${opponent}
            </div>
            <div style="font-size:32px; font-weight:bold; color:${resultColor}; margin:5px 0;">
                ${teamScore} : ${oppScore}
            </div>
            <div style="font-size:16px; font-weight:bold; color:${resultColor}; margin:5px 0;">
                ${resultText}
            </div>
            <div style="margin-top:8px; color:#666; font-size:12px; line-height:1.4;">
                ${matchDesc}
            </div>
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed ${resultColor};">
                <div style="font-size:11px; color:#718096; margin-bottom:2px;">📊 队内气氛变化</div>
                <div style="font-size:16px; font-weight:bold; color:${moodDelta >= 0 ? '#22c55e' : '#ef4444'};">
                    ${moodDelta > 0 ? '+' : ''}${moodDelta}
                </div>
            </div>
        </div>
        
        <div style="background:linear-gradient(135deg, #fef2f4 0%, #ffe0e5 100%); padding:10px; border-radius:8px; margin:10px 0;">
            <div style="font-weight:bold; font-size:14px; color:#e24070; margin-bottom:5px;">
                当前战绩
            </div>
            <div style="display:flex; justify-content:center; gap:30px;">
                <div>
                    <div style="font-size:11px; color:#718096;">胜场</div>
                    <div style="font-size:24px; font-weight:bold; color:#22c55e;">${currentWins}</div>
                </div>
                <div>
                    <div style="font-size:11px; color:#718096;">负场</div>
                    <div style="font-size:24px; font-weight:bold; color:#ef4444;">${currentLosses}</div>
                </div>
            </div>
        </div>
        
        ${nextMatchHtml}
    </div>
`;

        // 使用专门的曦照赛弹窗容器
        const modal = document.getElementById('xiZhaoModal');

        if (day < 3) {
            // 第1、2天显示"明日再战"
            modal.innerHTML = `
        <div style="
            width: 450px;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            max-height: 85vh;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        ">
            <!-- 头部 - 固定 -->
            <div style="
                background: #e24070;
                color: white;
                padding: 12px 15px;
                text-align: center;
                flex-shrink: 0;
            ">
                <span style="font-size: 18px; font-weight: bold;">⚾ 曦照女子棒球赛 ⚾</span>
            </div>
            
            <!-- 内容 - 滚动区域 -->
            <div style="
                padding: 15px;
                overflow-y: auto;
                flex: 1;
            ">
                ${desc}
            </div>
            
            <!-- 按钮 - 固定 -->
            <div style="
                padding: 0 15px 15px 15px;
                flex-shrink: 0;
            ">
                <button onclick="UI.handleXiZhaoNextDay()" 
                        style="
                            width: 100%;
                            background: #22c55e;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: bold;
                            cursor: pointer;
                        ">
                    明日再战 →
                </button>
            </div>
        </div>
    `;
        } else {
            // 第3天显示"查看总成绩"，将在 finishXiZhaoTournament 中处理
            modal.innerHTML = '';
            this.finishXiZhaoTournament();
            return;
        }

        modal.style.display = 'flex';

        // 保存当前比赛数据供后续使用
        this._currentXiZhaoDay = day;
        this._currentXiZhaoWin = win;
    },

    // ====================== 处理明日再战 ======================
    handleXiZhaoNextDay: function () {
        // 关闭曦照赛弹窗
        document.getElementById('xiZhaoModal').style.display = 'none';
        document.getElementById('xiZhaoModal').innerHTML = '';

        // 更新状态到下一日
        Game.state.xiZhaoStatus++;

        // 播放下一场比赛
        setTimeout(() => {
            Game.playCurrentXiZhaoMatch();
        }, 100);
    },

    // ====================== 曦照赛总结弹窗 ======================
    // ====================== 曦照赛总结弹窗 ======================
    showXiZhaoSummaryModal: function (wins, matches, rewards, moodDelta, teamDelta, spiritDelta, relationDelta) {
        // 关闭所有弹窗
        this.closeAllModals();

        this.modalState.xiZhaoActive = true;
        Game.state.isEventActive = true;
        this.updateButtons();

        let titleText = '';
        let titleColor = '';
        if (wins === 3) {
            titleText = '🏆 冠军';
            titleColor = '#FFD700';
        } else if (wins === 2) {
            titleText = '🥈 亚军';
            titleColor = '#C0C0C0';
        } else if (wins === 1) {
            titleText = '🥉 季军';
            titleColor = '#CD7F32';
        } else {
            titleText = '🌧️ 参与奖';
            titleColor = '#718096';
        }

        // 比赛详情
        let matchesHtml = matches
            .map((m, idx) => {
                let bgColor = m.win ? '#f0fdf4' : '#fff5f5';
                let borderColor = m.win ? '#22c55e' : '#ef4444';
                return `
        <div style="background:${bgColor}; padding:8px 10px; margin-bottom:4px; border-radius:4px; border-left:3px solid ${borderColor}; display:flex; justify-content:space-between; align-items:center; font-size:12px;">
            <div style="font-weight:500; color:#2d3748;">第${idx + 1}天 vs ${m.opponent}</div>
            <div style="font-size:14px; font-weight:bold; color:${m.win ? '#22c55e' : '#ef4444'};">${m.teamScore}:${
                    m.oppScore
                }</div>
        </div>
    `;
            })
            .join('');

        // 奖励格子
        let rewardItems = [];
        if (moodDelta !== 0) {
            rewardItems.push(`
        <div style="background:#f8f9fa; padding:5px; border-radius:4px; text-align:center;">
            <div style="font-size:10px; color:#718096; margin-bottom:2px;">队内气氛</div>
            <div style="font-size:14px; font-weight:bold; color:${moodDelta >= 0 ? '#22c55e' : '#ef4444'};">${
                moodDelta > 0 ? '+' : ''
            }${moodDelta}</div>
        </div>
    `);
        }
        if (teamDelta !== 0) {
            rewardItems.push(`
        <div style="background:#f8f9fa; padding:5px; border-radius:4px; text-align:center;">
            <div style="font-size:10px; color:#718096; margin-bottom:2px;">球队实力</div>
            <div style="font-size:14px; font-weight:bold; color:${teamDelta >= 0 ? '#22c55e' : '#ef4444'};">${
                teamDelta > 0 ? '+' : ''
            }${teamDelta}</div>
        </div>
    `);
        }
        if (spiritDelta !== 0) {
            rewardItems.push(`
        <div style="background:#f8f9fa; padding:5px; border-radius:4px; text-align:center;">
            <div style="font-size:10px; color:#718096; margin-bottom:2px;">精神力</div>
            <div style="font-size:14px; font-weight:bold; color:${spiritDelta >= 0 ? '#22c55e' : '#ef4444'};">${
                spiritDelta > 0 ? '+' : ''
            }${spiritDelta}</div>
        </div>
    `);
        }
        if (relationDelta !== 0) {
            rewardItems.push(`
        <div style="background:#f8f9fa; padding:5px; border-radius:4px; text-align:center;">
            <div style="font-size:10px; color:#718096; margin-bottom:2px;">人际关系</div>
            <div style="font-size:14px; font-weight:bold; color:${relationDelta >= 0 ? '#22c55e' : '#ef4444'};">${
                relationDelta > 0 ? '+' : ''
            }${relationDelta}</div>
        </div>
    `);
        }

        let rewardsHtml =
            rewardItems.length > 0
                ? `<div style="display:grid; grid-template-columns:repeat(${Math.min(
                      2,
                      rewardItems.length
                  )}, 1fr); gap:5px; margin-top:8px;">${rewardItems.join('')}</div>`
                : '';

        // 评语
        let comment = '';
        if (wins === 3) comment = '🎉 恭喜夺冠！球队士气大振！';
        else if (wins === 2) comment = '✨ 表现不错，明年再战！';
        else if (wins === 1) comment = '💪 积累了宝贵经验！';
        else comment = '😢 好好总结，来年再战！';

        let desc = `
    <div style="font-size:12px; line-height:1.4;">
        <!-- 标题 -->
        <div style="text-align:center; margin-bottom:8px;">
            <span style="font-size:20px; font-weight:bold; color:${titleColor};">${titleText}</span>
        </div>
        
        <!-- 战绩卡片 -->
        <div style="background:linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding:10px; border-radius:8px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-around; align-items:center;">
                <div style="text-align:center;">
                    <div style="font-size:10px; color:#718096; margin-bottom:2px;">胜场</div>
                    <div style="font-size:24px; font-weight:bold; color:#22c55e; line-height:1;">${wins}</div>
                </div>
                <div style="width:1px; height:24px; background:#ddd;"></div>
                <div style="text-align:center;">
                    <div style="font-size:10px; color:#718096; margin-bottom:2px;">负场</div>
                    <div style="font-size:24px; font-weight:bold; color:#ef4444; line-height:1;">${3 - wins}</div>
                </div>
            </div>
        </div>
        
        <!-- 比赛详情 -->
        <div style="margin-bottom:8px;">
            <div style="font-size:11px; font-weight:600; color:#2d3748; margin-bottom:4px;">📋 比赛详情</div>
            ${matchesHtml}
        </div>
        
        <!-- 赛事奖励 -->
        ${
            rewardsHtml
                ? `
        <div style="margin-bottom:8px;">
            <div style="font-size:11px; font-weight:600; color:#2d3748; margin-bottom:4px;">🎁 赛事奖励</div>
            ${rewardsHtml}
        </div>
        `
                : ''
        }
        
        <!-- 评语 -->
        <div style="background:#f8f9fa; padding:5px 8px; border-radius:4px; font-size:11px; color:#2d3748; text-align:center; border-left:3px solid #e24070;">
            ${comment}
        </div>

        <!-- 晋级全国大赛通知 -->
        ${
            wins >= 1
                ? `
        <div style="background: linear-gradient(90deg, #FFD70020, #FFA50020); border: 2px solid #FFD700; border-radius: 10px; padding: 12px; margin: 12px 0; text-align: center;">
            <div style="font-size: 22px; margin-bottom: 5px;">🎉</div>
            <div style="color: #FFD700; font-weight: bold; font-size: 16px;">恭喜获得曦照赛${
                wins === 3 ? '冠军' : wins === 2 ? '亚军' : '季军'
            }！</div>
            <div style="color: #e24070; font-size: 14px; font-weight: bold; margin-top: 5px;">✨ 成功进军全国大赛！ ✨</div>
            <div style="color: #666; font-size: 12px; margin-top: 8px;">7月1日，全国女子棒球城市联赛见！</div>
        </div>
        `
                : ''
        }
    </div>
`;

        const modal = document.getElementById('xiZhaoModal');
        modal.innerHTML = `
    <div style="
        width: 500px;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        max-height: 85vh;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    ">
        <!-- 头部 - 固定 -->
        <div style="
            background: #e24070;
            color: white;
            padding: 12px 15px;
            text-align: center;
            flex-shrink: 0;
        ">
            <span style="font-size: 16px; font-weight: bold;">🏆 曦照赛 圆满落幕</span>
        </div>
        
        <!-- 内容 - 滚动区域 -->
        <div style="
            padding: 15px;
            overflow-y: auto;
            flex: 1;
        ">
            ${desc}
        </div>
        
        <!-- 按钮 - 固定 -->
        <div style="
            padding: 0 15px 15px 15px;
            flex-shrink: 0;
        ">
            <button onclick="UI.handleXiZhaoFinish()" 
                    style="
                        width: 100%;
                        background: #e24070;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                继续征程 →
            </button>
        </div>
    </div>
`;

        modal.style.display = 'flex';
    },

    // ====================== 处理曦照赛结束 ======================
    handleXiZhaoFinish: function () {
        Game.handleXiZhaoFinish(); // 只调用 Game 的方法
    },

    // ====================== 关闭所有弹窗 ======================
    closeAllModals: function () {
        const modals = ['choiceModal', 'resultModal', 'infoModal', 'xiZhaoModal', 'eventModal', 'playerSelectModal'];
        modals.forEach((id) => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.style.display = 'none';
                modal.innerHTML = '';
            }
        });
        this.modalState.activeModal = null;
    },

    // ====================== 球员详情弹窗 ======================
    showPlayerDetail: function (playerId) {
        let player = Game.state.playerList.find((p) => p.id === playerId);
        if (!player) return;

        let introducer = null;
        if (player.introducerId) {
            introducer = Game.state.playerList.find((p) => p.id === player.introducerId);
        }

        let introducedByPlayer = Game.state.playerList.filter((p) => p.introducerId === player.id);

        let relations = [];
        Game.state.playerList.forEach((other) => {
            if (other.id === player.id) return;
            let value = Game.getRelationshipValue(player, other);
            if (Math.abs(value) >= 30) {
                relations.push({
                    name: other.name,
                    value: value,
                    icon: Game.getRelationshipIcon(value),
                });
            }
        });

        relations.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

        let introducerHtml = '';
        if (introducer) {
            let relValue = Game.getRelationshipValue(player, introducer);
            let relIcon = Game.getRelationshipIcon(relValue);
            introducerHtml = `
            <div style="background:#fef2f4; padding:12px; border-radius:8px; margin-bottom:15px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="font-size:24px;">👋</div>
                    <div style="flex:1;">
                        <div style="font-size:12px; color:#718096;">介绍人</div>
                        <div style="font-size:18px; font-weight:bold; color:#e24070;">${introducer.name}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:12px; color:#718096;">当前关系</div>
                        <div style="font-size:16px; font-weight:bold; display:flex; align-items:center; gap:4px;">
                            <span>${relIcon}</span>
                            <span style="color:${relValue >= 0 ? '#e24070' : '#ef4444'};">${relValue}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        } else if (player.introducerName && !introducer) {
            introducerHtml = `
            <div style="background:#f8f9fa; padding:12px; border-radius:8px; margin-bottom:15px; border-left:4px solid #ffb3c1;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="font-size:24px;">⏳</div>
                    <div>
                        <div style="font-size:12px; color:#718096;">介绍人（已退队）</div>
                        <div style="font-size:16px; font-weight:bold; color:#e24070;">${player.introducerName}</div>
                    </div>
                </div>
            </div>
        `;
        }

        let introducedHtml = '';
        if (introducedByPlayer.length > 0) {
            introducedHtml = `
            <div style="background:#f8f9fa; padding:12px; border-radius:8px; margin:15px 0;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                    <span style="font-size:18px;">🌟</span>
                    <span style="font-weight:bold; color:#e24070;">介绍入队的队友</span>
                    <span style="background:#ffe0e5; color:#e24070; padding:2px 8px; border-radius:12px; font-size:11px;">${
                        introducedByPlayer.length
                    }人</span>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                    ${introducedByPlayer
                        .map((p) => {
                            let relValue = Game.getRelationshipValue(player, p);
                            let relIcon = Game.getRelationshipIcon(relValue);
                            return `
                            <span style="background:white; padding:4px 8px; border-radius:12px; border:1px solid #ffe0e5; font-size:12px; display:inline-flex; align-items:center; gap:4px;">
                                ${p.name} ${relIcon} ${relValue}
                            </span>
                        `;
                        })
                        .join('')}
                </div>
            </div>
        `;
        }

        let relationsHtml = '';
        if (relations.length > 0) {
            relationsHtml = '<div style="margin-top:15px;"><strong>🤝 重要关系</strong><br>';
            relations.forEach((r) => {
                let color = r.value >= 0 ? '#e24070' : '#ef4444';
                relationsHtml += `
                <div style="display:flex; justify-content:space-between; margin-top:5px; padding:4px 0; border-bottom:1px dashed #f0f0f0;">
                    <span>${r.icon} ${r.name}</span>
                    <span style="color:${color};">${r.value > 0 ? '+' : ''}${r.value}</span>
                </div>
            `;
            });
            relationsHtml += '</div>';
        }

        let desc = `
        <div style="text-align:center;">
            <div style="font-size:24px; font-weight:bold; color:#e24070; margin-bottom:10px;">
                ⚾ ${player.name}
            </div>
            
            ${introducerHtml}
            
            <div style="display:flex; justify-content:center; gap:20px; margin:15px 0;">
                <div>
                    <div style="font-size:12px; color:#718096;">❤️ 忠诚</div>
                    <div style="font-size:20px; font-weight:bold;">${player.loyalty}</div>
                </div>
                <div>
                    <div style="font-size:12px; color:#718096;">⚡ 球技</div>
                    <div style="font-size:20px; font-weight:bold;">${player.skill}</div>
                </div>
                <div>
                    <div style="font-size:12px; color:#718096;">📅 入队</div>
                    <div style="font-size:16px;">${formatShortDate(player.joinDate)}</div>
                </div>
            </div>
            
            <div style="background:#f8f9fa; padding:12px; border-radius:8px;">
                <div style="font-size:12px; color:#718096; margin-bottom:4px;">💬 个性描述</div>
                <div style="font-size:14px; line-height:1.5;">${player.personality || '一个普通的棒球少女'}</div>
            </div>
            
            ${introducedHtml}
            ${relationsHtml}
            
            <div style="margin-top:15px; font-size:11px; color:#999;">
                ID: ${player.id} · 入队天数: ${Math.floor(
            (Game.state.currentDate - new Date(player.joinDate)) / (1000 * 3600 * 24)
        )}天
            </div>
        </div>
    `;

        UI.showInfoModal(`👤 球员档案`, desc, { buttonText: '关闭' });
    },

    showRelationshipDetail: function (player1Id, player2Id, event) {
        if (event) event.stopPropagation();

        let p1 = Game.state.playerList.find((p) => p.id === player1Id);
        let p2 = Game.state.playerList.find((p) => p.id === player2Id);

        if (!p1 || !p2) return;

        let value = Game.getRelationshipValue(p1, p2);
        let type = Game.getRelationshipType(value);
        let icon = Game.getRelationshipIcon(value);

        let color = value >= 61 ? '#e24070' : value >= 1 ? '#4299e1' : value >= -60 ? '#e67e22' : '#ef4444';

        let p1Join = formatShortDate(p1.joinDate);
        let p2Join = formatShortDate(p2.joinDate);

        let description = '';
        if (value >= 61) {
            description = '🌟 她们是最好的朋友！一起训练时球技额外+1~3。';
        } else if (value >= 1) {
            description = '👋 普通朋友关系，相处融洽。';
        } else if (value >= -60) {
            description = '⚔️ 互相看不顺眼，容易发生摩擦。每天有10%概率触发冲突。';
        } else {
            description = '💢 水火不容！随时可能爆发激烈冲突，可能导致其中一人离队。';
        }

        let historyHtml = this.getRelationshipHistory(p1, p2);

        let desc = `
        <div style="text-align:center;">
            <div style="display:flex; justify-content:space-around; margin:20px 0; align-items:center;">
                <div style="text-align:center;">
                    <div style="font-size:20px; font-weight:bold; color:#e24070;">${p1.name}</div>
                    <div style="font-size:12px; color:#718096;">❤️ ${p1.loyalty}  ⚡ ${p1.skill}</div>
                    <div style="font-size:11px; color:#718096;">📅 ${p1Join}</div>
                </div>
                
                <div style="font-size:36px; color:${color};">${icon}</div>
                
                <div style="text-align:center;">
                    <div style="font-size:20px; font-weight:bold; color:#e24070;">${p2.name}</div>
                    <div style="font-size:12px; color:#718096;">❤️ ${p2.loyalty}  ⚡ ${p2.skill}</div>
                    <div style="font-size:11px; color:#718096;">📅 ${p2Join}</div>
                </div>
            </div>
            
            <div style="background:${color}10; padding:15px; border-radius:10px; margin:15px 0;">
                <div style="font-size:24px; font-weight:bold; color:${color};">${type}</div>
                <div style="font-size:18px; margin-top:5px;">关系值: ${value}</div>
            </div>
            
            <div style="background:#f8f9fa; padding:15px; border-radius:8px; text-align:left; margin:15px 0;">
                ${description}
            </div>
            
            ${historyHtml}
        </div>
    `;

        UI.showInfoModal(`✨ 关系详情`, desc, { buttonText: '关闭' });
    },

    getRelationshipHistory: function (p1, p2) {
        let relatedHistory = Game.state.relationshipHistory
            .filter(
                (record) =>
                    (record.p1Id === p1.id && record.p2Id === p2.id) || (record.p1Id === p2.id && record.p2Id === p1.id)
            )
            .slice(0, 5);

        if (relatedHistory.length === 0) {
            return `
            <div style="margin-top:15px; padding-top:15px; border-top:1px solid #eee;">
                <div style="font-weight:bold; margin-bottom:8px;">📊 最近变化</div>
                <div style="font-size:12px; color:#718096; text-align:center;">
                    暂无历史记录
                </div>
            </div>
        `;
        }

        let historyHtml = '';
        relatedHistory.forEach((record) => {
            let changeColor = record.delta > 0 ? '#22c55e' : '#ef4444';
            let changeSign = record.delta > 0 ? '+' : '';
            historyHtml += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding:4px 0; border-bottom:1px dashed #eee;">
                <div style="font-size:11px; color:#718096;">${record.date}</div>
                <div style="font-size:12px;">
                    <span style="color:#2d3748;">${record.oldValue} → </span>
                    <span style="color:#e24070; font-weight:bold;">${record.newValue}</span>
                    <span style="color:${changeColor}; margin-left:5px;">(${changeSign}${record.delta})</span>
                </div>
            </div>
        `;
        });

        return `
        <div style="margin-top:15px; padding-top:15px; border-top:1px solid #eee;">
            <div style="font-weight:bold; margin-bottom:8px;">📊 最近变化</div>
            ${historyHtml}
        </div>
    `;
    },

    // ====================== 全国大赛弹窗 ======================

    // ====================== 全国大赛单场比赛结果弹窗 ======================
    // ====================== 全国大赛单场比赛结果弹窗 ======================
    showNationalMatchModal: function (data) {
        // 关闭其他弹窗
        this.closeAllModals();

        Game.state.isEventActive = true;
        this.updateButtons();

        // 获取弹窗容器
        const modal = document.getElementById('nationalModal');
        if (!modal) {
            console.error('错误：找不到 nationalModal 元素，请在 HTML 中添加');
            return;
        }

        const resultColor = data.win ? '#22c55e' : '#ef4444';
        const resultText = data.win ? '🎉 胜利' : '🌧️ 失利';
        const resultBg = data.win ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';

        // 生成球员成长摘要
        let playerGrowthHtml = '';
        if (data.changes && Game.state.playerList && Game.state.playerList.length > 0) {
            // 获取球技最高的3名球员
            let topPlayers = [...Game.state.playerList].sort((a, b) => b.skill - a.skill).slice(0, 3);

            let playersHtml = '';
            for (let i = 0; i < topPlayers.length; i++) {
                let p = topPlayers[i];
                playersHtml += `
                <div style="text-align: center;">
                    <div style="color: #4A2C00; font-weight: bold; font-size: 15px;">${p.name}</div>
                    <div style="color: #22c55e; font-size: 13px;">⚡ +${Math.floor(p.skill / 10) + 2}</div>
                </div>
            `;
            }

            playerGrowthHtml = `
            <div style="background: #FFE5B4; border-radius: 16px; padding: 15px; margin-top: 15px; border: 1px solid #FFD700;">
                <div style="color: #4A2C00; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 5px; font-weight: bold;">
                    <span>⭐</span>
                    <span>表现突出的球员</span>
                </div>
                <div style="display: flex; justify-content: space-around;">
                    ${playersHtml}
                </div>
            </div>
        `;
        }

        modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #FFF9E6 0%, #FFF0D4 100%);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            border: 3px solid #FFD700;
            width: 600px;
            display: flex;
            flex-direction: column;
            max-height: 85vh;
        ">
            
            <!-- 头部 - 固定 -->
            <div style="
                background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
                padding: 18px 25px;
                text-align: center;
                flex-shrink: 0;
            ">
                <div style="font-size: 24px; font-weight: bold; color: #4A2C00;">🏆 全国女子棒球城市联赛 🏆</div>
                <div style="font-size: 16px; color: #4A2C00; margin-top: 5px;">第 ${data.day}/5 日 · ${
            data.opponent.name
        }</div>
            </div>
            
            <!-- 内容 - 滚动区域 -->
            <div style="
                padding: 20px 25px;
                overflow-y: auto;
                flex: 1;
            ">
                
                <!-- 比分卡片 -->
                <div style="background: ${resultBg}; border-radius: 20px; padding: 20px; border: 2px solid ${resultColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    
                    <!-- VS 显示 -->
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="text-align: center; flex: 1;">
                            <div style="color: #4A2C00; font-size: 18px; font-weight: bold; margin-bottom: 8px;">${
                                Game.state.teamName
                            }</div>
                            <div style="font-size: 52px; font-weight: bold; color: ${
                                data.win ? resultColor : '#4A2C00'
                            };">${data.teamScore}</div>
                        </div>
                        
                        <div style="font-size: 28px; font-weight: bold; color: #FFA500; padding: 0 15px;">VS</div>
                        
                        <div style="text-align: center; flex: 1;">
                            <div style="color: #4A2C00; font-size: 18px; font-weight: bold; margin-bottom: 8px;">${
                                data.opponent.name
                            }</div>
                            <div style="font-size: 52px; font-weight: bold; color: ${
                                !data.win ? resultColor : '#4A2C00'
                            };">${data.oppScore}</div>
                        </div>
                    </div>
                    
                    <!-- 比赛结果标签 -->
                    <div style="text-align: center; margin-top: 15px;">
                        <span style="background: ${resultColor}; color: white; font-weight: bold; padding: 5px 25px; border-radius: 30px; font-size: 16px;">
                            ${resultText}
                        </span>
                    </div>
                </div>
                
                <!-- 比赛精彩瞬间 -->
                <div style="background: #FFE5B4; border-radius: 16px; padding: 12px; margin-top: 15px; border-left: 4px solid #FFD700;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="color: #FFA500; font-size: 18px;">⚾</span>
                        <span style="color: #4A2C00; font-weight: bold; font-size: 14px;">精彩瞬间</span>
                    </div>
                    <div style="color: #4A2C00; font-size: 13px; line-height: 1.5;">
                        ${
                            data.win
                                ? '九局下半，再见安打！全队冲入场内欢呼庆祝！'
                                : '虽然落败，但年轻球员展现出了惊人的潜力。'
                        }
                    </div>
                </div>
                
                <!-- 成长数据 -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 15px;">
                    <div style="background: #FFE5B4; border-radius: 16px; padding: 12px; text-align: center; border: 1px solid #FFD700;">
                        <div style="color: #4A2C00; font-size: 12px; margin-bottom: 4px;">⚡ 创始人球技</div>
                        <div style="color: ${
                            data.changes && data.changes.skill > 0 ? '#22c55e' : '#ef4444'
                        }; font-size: 24px; font-weight: bold;">
                            ${
                                data.changes && data.changes.skill
                                    ? (data.changes.skill > 0 ? '+' : '') + data.changes.skill
                                    : 0
                            }
                        </div>
                    </div>
                    <div style="background: #FFE5B4; border-radius: 16px; padding: 12px; text-align: center; border: 1px solid #FFD700;">
                        <div style="color: #4A2C00; font-size: 12px; margin-bottom: 4px;">✨ 精神力</div>
                        <div style="color: ${
                            data.changes && data.changes.spirit > 0 ? '#22c55e' : '#ef4444'
                        }; font-size: 24px; font-weight: bold;">
                            ${
                                data.changes && data.changes.spirit
                                    ? (data.changes.spirit > 0 ? '+' : '') + data.changes.spirit
                                    : 0
                            }
                        </div>
                    </div>
                </div>
                
                <!-- 球员表现 -->
                ${playerGrowthHtml}
                
            </div>
            
            <!-- 按钮 - 固定 -->
            <div style="
                padding: 0 25px 25px 25px;
                flex-shrink: 0;
            ">
                <button onclick="UI.handleNationalNextDay()" 
                    style="
                        width: 100%;
                        background: linear-gradient(90deg, #FFD700, #FFA500);
                        border: none;
                        padding: 14px;
                        border-radius: 50px;
                        color: #4A2C00;
                        font-weight: bold;
                        font-size: 16px;
                        cursor: pointer;
                        border: 1px solid #FFD700;
                    ">
                    ⚾ 明日再战 → ⚾
                </button>
            </div>
            
        </div>
    `;

        modal.style.display = 'flex';
    },

    // ====================== 全国大赛总结弹窗 ======================
    showNationalSummaryModal: function (data) {
        this.closeAllModals();

        Game.state.isEventActive = true;
        this.updateButtons();

        const modal = document.getElementById('nationalModal');
        if (!modal) {
            console.error('错误：找不到 nationalModal 元素');
            return;
        }

        // 根据排名设置不同的颜色
        const rankColors = {
            '🏆 全国冠军': { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#4A2C00', shadow: '#FFD700' },
            '🥈 全国亚军': { bg: 'linear-gradient(135deg, #C0C0C0, #E0E0E0)', color: '#2C2C2C', shadow: '#C0C0C0' },
            '🥉 全国季军': { bg: 'linear-gradient(135deg, #CD7F32, #B87333)', color: '#2C1B0E', shadow: '#CD7F32' },
            全国第四: { bg: 'linear-gradient(135deg, #4A90E2, #357ABD)', color: 'white', shadow: '#4A90E2' },
            全国第五: { bg: 'linear-gradient(135deg, #50C878, #3CB371)', color: 'white', shadow: '#50C878' },
            全国第六: { bg: 'linear-gradient(135deg, #9CA3AF, #6B7280)', color: 'white', shadow: '#9CA3AF' },
        };

        const rankStyle = rankColors[data.rank] || rankColors['全国第六'];

        // 生成比赛列表
        let matchesHtml = '';
        data.matches.forEach((m, index) => {
            const isWin = m.win;
            const bgColor = isWin ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            const borderColor = isWin ? '#22c55e' : '#ef4444';
            const scoreColor = isWin ? '#22c55e' : '#ef4444';

            matchesHtml += `
            <div style="background: ${bgColor}; border-left: 6px solid ${borderColor}; border-radius: 12px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 20px;">${isWin ? '🏆' : '🌧️'}</div>
                    <div>
                        <div style="color: #4A2C00; font-weight: bold; font-size: 14px;">第${index + 1}日 vs ${
                m.opponent
            }</div>
                        <div style="color: #666; font-size: 11px;">${isWin ? '精彩胜利' : '遗憾落败'}</div>
                    </div>
                </div>
                <div style="font-size: 22px; font-weight: bold; color: ${scoreColor};">${m.teamScore}:${
                m.oppScore
            }</div>
            </div>
        `;
        });

        // 计算总胜场
        const wins = data.matches.filter((m) => m.win).length;
        const losses = 5 - wins;

        modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #FFF9E6 0%, #FFF0D4 100%);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            border: 3px solid ${rankStyle.shadow};
            width: 620px;
            display: flex;
            flex-direction: column;
            max-height: 85vh;
        ">
            
            <!-- 头部 - 固定 -->
            <div style="
                background: ${rankStyle.bg};
                padding: 20px;
                text-align: center;
                flex-shrink: 0;
            ">
                <div style="font-size: 42px; margin-bottom: 5px;">🏆</div>
                <div style="font-size: 28px; font-weight: bold; color: ${rankStyle.color};">${data.rank}</div>
                <div style="font-size: 14px; color: ${rankStyle.color}; margin-top: 5px;">全国女子棒球城市联赛</div>
            </div>
            
            <!-- 内容 - 滚动区域 -->
            <div style="
                padding: 20px 25px;
                overflow-y: auto;
                flex: 1;
            ">
                
                <!-- 战绩统计卡片 -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="background: #FFE5B4; border-radius: 16px; padding: 15px; text-align: center; border: 2px solid #22c55e;">
                        <div style="color: #22c55e; font-size: 13px; font-weight: bold; margin-bottom: 5px;">胜场</div>
                        <div style="color: #4A2C00; font-size: 36px; font-weight: bold;">${wins}</div>
                    </div>
                    <div style="background: #FFE5B4; border-radius: 16px; padding: 15px; text-align: center; border: 2px solid #ef4444;">
                        <div style="color: #ef4444; font-size: 13px; font-weight: bold; margin-bottom: 5px;">负场</div>
                        <div style="color: #4A2C00; font-size: 36px; font-weight: bold;">${losses}</div>
                    </div>
                </div>
                
                <!-- 比赛详情标题 -->
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <span style="color: #FFA500; font-size: 18px;">📋</span>
                    <span style="color: #4A2C00; font-weight: bold; font-size: 16px;">五场征程</span>
                </div>
                
                <!-- 比赛列表 -->
                ${matchesHtml}
                
                <!-- 大赛收获 -->
                <div style="background: #FFE5B4; border-radius: 16px; padding: 18px; margin-top: 20px; border: 2px solid #FFD700;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <span style="color: #FFA500; font-size: 18px;">📈</span>
                        <span style="color: #4A2C00; font-weight: bold; font-size: 15px;">大赛收获</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div style="text-align: center;">
                            <div style="color: #4A2C00; font-size: 12px; margin-bottom: 4px;">✨ 精神力成长</div>
                            <div style="color: ${
                                data.spiritReward >= 0 ? '#22c55e' : '#ef4444'
                            }; font-size: 26px; font-weight: bold;">
                                ${data.spiritReward > 0 ? '+' : ''}${data.spiritReward}
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #4A2C00; font-size: 12px; margin-bottom: 4px;">❤️ 人际关系成长</div>
                            <div style="color: ${
                                data.relationReward >= 0 ? '#22c55e' : '#ef4444'
                            }; font-size: 26px; font-weight: bold;">
                                ${data.relationReward > 0 ? '+' : ''}${data.relationReward}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 球员成长摘要 -->
                    <div style="margin-top: 15px; padding-top: 12px; border-top: 2px dashed #FFD700; text-align: center;">
                        <div style="color: #4A2C00; font-size: 12px; margin-bottom: 5px;">⚡ 球员球技平均提升</div>
                        <div style="color: #22c55e; font-size: 22px; font-weight: bold;">+${Math.round(
                            Math.random() * 3 + 4
                        )}</div>
                    </div>
                </div>
                
            </div>
            
            <!-- 按钮 - 固定 -->
            <div style="
                padding: 0 25px 25px 25px;
                flex-shrink: 0;
            ">
                <button onclick="UI.handleNationalFinish()" 
                    style="
                        width: 100%;
                        background: linear-gradient(90deg, #FFD700, #FFA500);
                        border: none;
                        padding: 14px;
                        border-radius: 50px;
                        color: #4A2C00;
                        font-weight: bold;
                        font-size: 16px;
                        cursor: pointer;
                        border: 1px solid #FFD700;
                    ">
                    继续征程 →
                </button>
            </div>
            
            <!-- 底部装饰 -->
            <div style="height: 4px; background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700); flex-shrink: 0;"></div>
            
        </div>
    `;

        modal.style.display = 'flex';
    },

    // 处理明日再战
    handleNationalNextDay: function () {
        Game.handleNationalNextDay();
    },

    // 处理比赛结束
    handleNationalFinish: function () {
        Game.handleNationalFinish();
    },
};

// ====================== 导出全局访问 ======================
window.UI = UI;
