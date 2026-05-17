// =============================================
// XP & LEVELING MODULE
// =============================================
const XPModule = (function () {

  const STORAGE_KEY = 'letsfocus_xp';
  const DAILY_CAP = 150;

  // ---- Ranks ----
  const RANKS = [
    { level: 1,  name: 'Café Newcomer',   icon: '☕',  xp: 0    },
    { level: 2,  name: 'Kitchen Helper',   icon: '🧼',  xp: 100  },
    { level: 3,  name: 'Milk Frother',     icon: '🥛',  xp: 250  },
    { level: 4,  name: 'Junior Barista',   icon: '☕',  xp: 500  },
    { level: 5,  name: 'Latte Artist',     icon: '🎨',  xp: 900  },
    { level: 6,  name: 'Senior Barista',   icon: '🏆',  xp: 1400 },
    { level: 7,  name: 'Head Barista',     icon: '⭐',  xp: 2000 },
    { level: 8,  name: 'Café Manager',     icon: '🌟',  xp: 3000 },
    { level: 9,  name: 'Master Roaster',   icon: '👑',  xp: 4500 },
    { level: 10, name: 'Legend of the Brew', icon: '🔥', xp: 7000 },
  ];

  // ---- Achievements ----
  const ACHIEVEMENTS = [
    { id: 'early_bird',    icon: '🌅', name: 'Early Bird',     desc: 'Complete 5 sessions before noon',           check: (d) => (d.earlyBirdSessions || 0) >= 5 },
    { id: 'on_fire',       icon: '🔥', name: 'On Fire',        desc: 'Reach a 7-day focus streak',                check: (d) => (d.streak || 0) >= 7 },
    { id: 'scholar',       icon: '📚', name: 'Scholar',        desc: 'Complete 20 Study goals',                   check: (d) => (d.studyGoalsDone || 0) >= 20 },
    { id: 'speed_run',     icon: '⚡', name: 'Speed Run',      desc: 'Complete 3 goals in one day',               check: (d) => (d.goalsToday || 0) >= 3 },
    { id: 'pomo_pro',      icon: '🍅', name: 'Pomodoro Pro',   desc: 'Complete 10 full Pomodoro cycles',           check: (d) => (d.pomoCycles || 0) >= 10 },
    { id: 'sharpshooter',  icon: '🎯', name: 'Sharpshooter',   desc: 'Complete 5 goals before their deadline',    check: (d) => (d.onTimeGoals || 0) >= 5 },
    { id: 'night_owl',     icon: '🌙', name: 'Night Owl',      desc: 'Complete 5 sessions after 9pm',             check: (d) => (d.nightSessions || 0) >= 5 },
    { id: 'comeback_kid',  icon: '💪', name: 'Comeback Kid',   desc: 'Complete a goal after a 3+ overdue streak', check: (d) => d.comebackKid === true },
  ];

  // ---- Load / Save ----
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch(e) { return {}; }
  }

  function save(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch(e) {}
  }

  function todayKey() { return new Date().toISOString().slice(0, 10); }

  // ---- XP Math ----
  function getRank(totalXP) {
    let rank = RANKS[0];
    for (const r of RANKS) { if (totalXP >= r.xp) rank = r; else break; }
    return rank;
  }

  function getNextRank(totalXP) {
    for (const r of RANKS) { if (totalXP < r.xp) return r; }
    return null; // max level
  }

  function addXP(amount, reason, data) {
    const key = todayKey();
    if (!data.dailyXP) data.dailyXP = {};
    const todayEarned = data.dailyXP[key] || 0;

    // Bonus XP (streaks, deadline bonuses) bypass daily cap
    const isBonus = reason.includes('BONUS') || reason.includes('streak') || reason.includes('Pomodoro');
    const effectiveAmount = (!isBonus && amount > 0)
      ? Math.min(amount, Math.max(0, DAILY_CAP - todayEarned))
      : amount;

    if (effectiveAmount === 0 && amount > 0 && !isBonus) {
      logXP(data, 0, reason + ' (daily cap reached)');
      return;
    }

    data.totalXP = Math.max(0, (data.totalXP || 0) + effectiveAmount);
    if (!isBonus && effectiveAmount > 0) data.dailyXP[key] = todayEarned + effectiveAmount;
    logXP(data, effectiveAmount, reason);
  }

  function logXP(data, amount, reason) {
    if (!data.xpLog) data.xpLog = [];
    data.xpLog.unshift({
      amount,
      reason,
      date: new Date().toISOString(),
    });
    data.xpLog = data.xpLog.slice(0, 200); // keep last 200 entries
  }

  // ---- Public XP Actions ----
  function onSessionComplete(elapsedSeconds, isPomodoroCycle, goalName) {
    const data = load();
    const oldXP = data.totalXP || 0;
    const oldRank = getRank(oldXP);

    const mins = Math.floor(elapsedSeconds / 60);
    const sessionXP = mins; // 1 XP per minute
    addXP(sessionXP, `Focus session (${mins} min)`);

    // First session today bonus
    const key = todayKey();
    if (!data.lastSessionDate || data.lastSessionDate !== key) {
      addXP(15, 'First session of the day BONUS', data);
    }
    data.lastSessionDate = key;

    // Time of day tracking
    const hour = new Date().getHours();
    if (hour < 12) { data.earlyBirdSessions = (data.earlyBirdSessions || 0) + 1; }
    if (hour >= 21) { data.nightSessions = (data.nightSessions || 0) + 1; }

    // Pomodoro full cycle bonus
    if (isPomodoroCycle) {
      data.pomoCycles = (data.pomoCycles || 0) + 1;
      addXP(50, 'Full Pomodoro cycle BONUS', data);
    }

    save(data);
    checkLevelUp(oldRank, data);
    checkAchievements(data);
    refreshUI();
  }

  function onGoalComplete(goal, isLate, overdueStreak) {
    const data = load();
    const oldXP = data.totalXP || 0;
    const oldRank = getRank(oldXP);

    if (isLate) {
      // Redemption bonus — 50% of normal
      addXP(10, `Goal completed (late redemption): ${goal.text}`, data);
      // Reset overdue streak on any completion
      data.overdueStreak = 0;
      // Comeback Kid achievement
      if ((overdueStreak || 0) >= 3) data.comebackKid = true;
    } else {
      addXP(20, `Goal completed: ${goal.text}`, data);
    }

    // Category tracking
    if (goal.category === 'Study') data.studyGoalsDone = (data.studyGoalsDone || 0) + 1;

    // On-time goals (has deadline, not overdue)
    if (goal.deadline && !isLate) {
      data.onTimeGoals = (data.onTimeGoals || 0) + 1;
      addXP(15, `Completed before deadline BONUS: ${goal.text}`, data);
    }

    // Sub-goals all done bonus
    if (goal.subgoals && goal.subgoals.length > 0 && goal.subgoals.every(s => s.completed)) {
      addXP(15, `All sub-goals completed BONUS`, data);
    }

    // Goals today tracking
    const key = todayKey();
    if (!data.goalsDateKey || data.goalsDateKey !== key) {
      data.goalsToday = 0; data.goalsDateKey = key;
    }
    data.goalsToday = (data.goalsToday || 0) + 1;

    save(data);
    checkLevelUp(oldRank, data);
    checkAchievements(data);
    refreshUI();
  }

  function onOverdueDetected(overdueCount, currentStreak) {
    if (overdueCount === 0) return;
    const data = load();
    const oldXP = data.totalXP || 0;
    const oldRank = getRank(oldXP);

    // XP deduction based on overdue streak
    let deductPerGoal = 5;
    if (currentStreak >= 7)      deductPerGoal = 35;
    else if (currentStreak >= 4) deductPerGoal = 20;
    else if (currentStreak >= 2) deductPerGoal = 10;

    const total = Math.min(overdueCount * deductPerGoal, 35 * overdueCount);
    addXP(-total, `${overdueCount} overdue goal${overdueCount > 1 ? 's' : ''} (streak: ${currentStreak})`, data);
    data.overdueStreak = currentStreak;

    save(data);
    checkLevelUp(oldRank, data);
    refreshUI();
  }

  // ---- Level Up ----
  let levelUpQueue = [];
  let levelUpPlaying = false;

  function checkLevelUp(oldRank, data) {
    const newRank = getRank(data.totalXP || 0);
    if (newRank.level > oldRank.level) {
      levelUpQueue.push({ oldRank, newRank });
      if (!levelUpPlaying) drainLevelUpQueue();
    }
  }

  function drainLevelUpQueue() {
    if (!levelUpQueue.length) { levelUpPlaying = false; return; }
    levelUpPlaying = true;
    const next = levelUpQueue.shift();
    // Wait for any current overlay to finish (sign flip is ~5s)
    const delay = document.getElementById('coffeeShopClosingOverlay') ? 5500 : 600;
    setTimeout(() => showLevelUpAnimation(next.oldRank, next.newRank), delay);
  }

  function showLevelUpAnimation(oldRank, newRank) {
    const overlay = document.createElement('div');
    overlay.id = 'levelUpOverlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:25000;
      background:rgba(20,10,5,0);
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;
      transition:background 0.8s ease;font-family:'Playfair Display',serif;
    `;

    overlay.innerHTML = `
      <style>
        @keyframes spotlightFade { from{opacity:0} to{opacity:1} }
        @keyframes badgeGlow { 0%,100%{box-shadow:0 0 20px rgba(212,165,116,0.4)} 50%{box-shadow:0 0 50px rgba(212,165,116,0.9),0 0 80px rgba(212,165,116,0.4)} }
        @keyframes rankReveal { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes beanRain { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
        @keyframes lu-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        #lu-badge-wrap { perspective:600px; }
        #lu-badge-inner { width:160px;height:160px;position:relative;transform-style:preserve-3d;transition:transform 0.8s cubic-bezier(0.4,0,0.2,1); }
        .lu-badge-face { position:absolute;inset:0;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;backface-visibility:hidden;border:4px solid rgba(212,165,116,0.6);box-shadow:0 8px 30px rgba(0,0,0,0.5); }
        #lu-face-old { background:radial-gradient(circle at 35% 35%,#5c4020,#2a1a0a);font-size:3.5rem;filter:brightness(0.6); }
        #lu-face-new { background:radial-gradient(circle at 35% 35%,#d4a574,#8b6f47);font-size:3.5rem;transform:rotateY(180deg);animation:lu-pulse 2s ease-in-out infinite; }
        #lu-spotlight { position:fixed;top:0;left:50%;transform:translateX(-50%);width:300px;height:60vh;background:radial-gradient(ellipse at 50% 0%,rgba(212,165,116,0.18) 0%,transparent 70%);pointer-events:none;opacity:0;transition:opacity 1s ease; }
      </style>

      <div id="lu-spotlight"></div>

      <div id="lu-badge-wrap">
        <div id="lu-badge-inner">
          <div class="lu-badge-face" id="lu-face-old">
            <span>${oldRank.icon}</span>
            <span style="font-size:0.7rem;color:rgba(212,165,116,0.6);margin-top:6px;letter-spacing:1px;">LV.${oldRank.level}</span>
          </div>
          <div class="lu-badge-face" id="lu-face-new">
            <span>${newRank.icon}</span>
            <span style="font-size:0.7rem;color:rgba(255,255,255,0.8);margin-top:6px;letter-spacing:1px;">LV.${newRank.level}</span>
          </div>
        </div>
      </div>

      <div id="lu-text" style="text-align:center;opacity:0;">
        <div style="font-size:0.75rem;color:rgba(212,165,116,0.7);letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Rank Up!</div>
        <div style="font-size:1.8rem;color:#f5e8d0;font-weight:700;">${newRank.icon} ${newRank.name}</div>
        <div style="font-size:0.9rem;color:rgba(212,165,116,0.7);margin-top:8px;font-style:italic;">You're brewing something great.</div>
      </div>

      <button id="lu-continue" style="opacity:0;padding:13px 36px;border:none;border-radius:14px;background:linear-gradient(135deg,#d4a574,#8b6f47);color:#fff;font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(139,111,71,0.4);transition:all 0.2s ease;">
        Continue ✓
      </button>
    `;

    document.body.appendChild(overlay);

    const badgeInner = overlay.querySelector('#lu-badge-inner');
    const spotlight  = overlay.querySelector('#lu-spotlight');
    const luText     = overlay.querySelector('#lu-text');
    const luContinue = overlay.querySelector('#lu-continue');

    // Step 0 — dim screen
    requestAnimationFrame(() => { overlay.style.background = 'rgba(20,10,5,0.94)'; });

    // Step 1 (0.8s) — spotlight on
    setTimeout(() => { spotlight.style.opacity = '1'; }, 800);

    // Step 2 (1.5s) — badge flip
    setTimeout(() => { badgeInner.style.transform = 'rotateY(180deg)'; }, 1500);

    // Step 3 (2.4s) — rank text reveals
    setTimeout(() => { luText.style.animation = 'rankReveal 0.7s ease-out forwards'; }, 2400);

    // Step 4 (2.8s) — coffee bean rain
    setTimeout(() => spawnBeans(overlay), 2800);

    // Step 5 (3.4s) — continue button
    setTimeout(() => { luContinue.style.animation = 'rankReveal 0.5s ease-out forwards'; }, 3400);

    luContinue.addEventListener('mouseover', () => { luContinue.style.transform = 'translateY(-2px)'; luContinue.style.boxShadow = '0 8px 24px rgba(139,111,71,0.5)'; });
    luContinue.addEventListener('mouseout',  () => { luContinue.style.transform = ''; luContinue.style.boxShadow = ''; });
    luContinue.addEventListener('click', () => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => { overlay.remove(); drainLevelUpQueue(); }, 400);
    });
  }

  function spawnBeans(overlay) {
    const beans = ['☕','🫘','✨','⭐','🌟'];
    for (let i = 0; i < 18; i++) {
      const b = document.createElement('div');
      b.textContent = beans[Math.floor(Math.random() * beans.length)];
      b.style.cssText = `
        position:fixed;top:-30px;
        left:${Math.random() * 100}vw;
        font-size:${0.9 + Math.random() * 1.2}rem;
        pointer-events:none;z-index:25001;
        animation:beanRain ${2 + Math.random() * 2}s ease-in ${Math.random() * 1.5}s forwards;
      `;
      overlay.appendChild(b);
      b.addEventListener('animationend', () => b.remove());
    }
  }

  // ---- Achievements ----
  function checkAchievements(data) {
    if (!data.unlockedAchievements) data.unlockedAchievements = [];
    const statsRaw = JSON.parse(localStorage.getItem('letsfocus_stats') || '{}');
    // Merge XP data with stats data so all fields are available
    const merged = {
      ...data,
      streak: statsRaw.streak || 0,
      sessionsCompleted: statsRaw.sessionsCompleted || 0,
    };
    const newlyUnlocked = [];
    ACHIEVEMENTS.forEach(ach => {
      if (data.unlockedAchievements.includes(ach.id)) return;
      if (ach.check(merged)) {
        data.unlockedAchievements.push(ach.id);
        addXP(30, `Achievement unlocked: ${ach.name} BONUS`, data);
        newlyUnlocked.push(ach);
      }
    });
    save(data);
    // Show toasts with delay between each
    newlyUnlocked.forEach((ach, i) => {
      setTimeout(() => showAchievementToast(ach), 500 + i * 800);
    });
  }

  // ---- Minecraft-style Achievement Toast ----
  function showAchievementToast(ach) {
    // Play chime
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [880, 1100].forEach((freq, i) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = 'sine';
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.35);
      });
    } catch(e) {}

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="ach-icon-panel">
        <div class="ach-foam-drip"></div>
        <div class="ach-icon-inner">${ach.icon}</div>
      </div>
      <div class="ach-text-panel">
        <div class="ach-label">Achievement Unlocked!</div>
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
      </div>
    `;

    // Stack multiple toasts
    const existing = document.querySelectorAll('.achievement-toast');
    const topOffset = 20 + existing.length * 90;
    toast.style.top = topOffset + 'px';

    document.body.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; toast.style.opacity = '1'; });

    // Click to dismiss early
    toast.addEventListener('click', () => dismissToast(toast));

    // Auto dismiss after 4s
    setTimeout(() => dismissToast(toast), 4500);
  }

  function dismissToast(toast) {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }

  // ---- Opening-time overdue check ----
  function checkOverdueOnOpen() {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const today = new Date(); today.setHours(0,0,0,0);
    const data = load();
    const lastCheck = data.lastOverdueCheck;
    const todayStr = todayKey();
    if (lastCheck === todayStr) return; // already checked today

    const overdueGoals = goals.filter(g => {
      if (!g.deadline || g.completed) return false;
      const dl = new Date(g.deadline + 'T00:00:00');
      return dl < today;
    });

    if (overdueGoals.length > 0) {
      const streak = (data.overdueStreak || 0) + 1;
      data.overdueStreak = streak;
      data.lastOverdueCheck = todayStr;
      save(data);
      onOverdueDetected(overdueGoals.length, streak);
      // Refresh deadlines tab to show streak
      if (typeof GoalsModule !== 'undefined') setTimeout(() => GoalsModule.renderDeadlinesTab(), 100);
    } else {
      data.lastOverdueCheck = todayStr;
      // Reset overdue streak if no overdue goals
      if ((data.overdueStreak || 0) > 0) { data.overdueStreak = 0; }
      save(data);
    }
  }

  // ---- UI Rendering ----
  function refreshUI() {
    renderXPBar();
    renderBadgeOnBoard();
  }

  function renderXPBar() {
    const data = load();
    const totalXP = data.totalXP || 0;
    const rank = getRank(totalXP);
    const nextRank = getNextRank(totalXP);

    const rankEl    = document.getElementById('xpRankBadge');
    const barEl     = document.getElementById('xpProgressBar');
    const labelEl   = document.getElementById('xpProgressLabel');
    const xpValEl   = document.getElementById('xpCurrentValue');

    if (rankEl) {
      rankEl.innerHTML = `
        <div class="xp-rank-icon">${rank.icon}</div>
        <div class="xp-rank-info">
          <div class="xp-rank-level">Level ${rank.level}</div>
          <div class="xp-rank-name">${rank.name}</div>
        </div>
      `;
    }

    if (barEl && nextRank) {
      const fromXP = rank.xp, toXP = nextRank.xp;
      const pct = Math.round(((totalXP - fromXP) / (toXP - fromXP)) * 100);
      barEl.style.width = pct + '%';
      if (labelEl) labelEl.textContent = `${totalXP - fromXP} / ${toXP - fromXP} XP to ${nextRank.name}`;
    } else if (barEl) {
      barEl.style.width = '100%';
      if (labelEl) labelEl.textContent = '🔥 Maximum rank achieved!';
    }

    if (xpValEl) xpValEl.textContent = totalXP + ' XP';
  }

  function renderBadgeOnBoard() {
    const el = document.getElementById('billBoardBadge');
    if (!el) return;
    const data = load();
    const rank = getRank(data.totalXP || 0);
    el.innerHTML = `
      <span class="bb-badge-icon">${rank.icon}</span>
      <span class="bb-badge-info">Lv.${rank.level} · ${rank.name}</span>
    `;
  }

  function renderXPLog() {
    const data = load();
    const log = data.xpLog || [];
    const todayStr = todayKey();
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const container = document.getElementById('xpLogList');
    const todayTab  = document.getElementById('xpLogTabToday');
    const weekTab   = document.getElementById('xpLogTabWeek');
    if (!container) return;

    let activeTab = container.dataset.activeTab || 'today';

    function render(tab) {
      container.dataset.activeTab = tab;
      todayTab?.classList.toggle('active', tab === 'today');
      weekTab?.classList.toggle('active', tab === 'week');

      const filtered = log.filter(entry => {
        const d = new Date(entry.date);
        if (tab === 'today') return d.toISOString().slice(0,10) === todayStr;
        return d >= sevenDaysAgo;
      });

      container.innerHTML = '';
      if (!filtered.length) {
        container.innerHTML = `<div class="xp-log-empty">No XP activity ${tab === 'today' ? 'today' : 'this week'} yet</div>`;
        return;
      }

      filtered.forEach(entry => {
        const row = document.createElement('div');
        row.className = `xp-log-row ${entry.amount > 0 ? 'xp-gain' : entry.amount < 0 ? 'xp-loss' : 'xp-neutral'}`;
        const time = new Date(entry.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const dateStr = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        row.innerHTML = `
          <span class="xp-log-amount">${entry.amount > 0 ? '+' : ''}${entry.amount} XP</span>
          <span class="xp-log-reason">${entry.reason}</span>
          <span class="xp-log-time">${tab === 'week' ? dateStr + ' ' : ''}${time}</span>
        `;
        container.appendChild(row);
      });
    }

    render(activeTab);
    todayTab?.addEventListener('click', () => render('today'));
    weekTab?.addEventListener('click',  () => render('week'));
  }

  function renderAchievements() {
    const data = load();
    const unlocked = data.unlockedAchievements || [];
    const el = document.getElementById('achievementsList');
    if (!el) return;
    el.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = unlocked.includes(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="achievement-card-icon">${ach.icon}</div>
        <div class="achievement-card-info">
          <div class="achievement-card-name">${ach.name}</div>
          <div class="achievement-card-desc">${ach.desc}</div>
        </div>
        ${isUnlocked ? '<div class="achievement-card-check">✓</div>' : '<div class="achievement-card-lock">🔒</div>'}
      `;
      el.appendChild(card);
    });
  }

  function getOverdueStreak() {
    return load().overdueStreak || 0;
  }

  function init() {
    checkOverdueOnOpen();
    setTimeout(refreshUI, 100);

    // Re-render on stats tab open
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.tab === 'stats') {
          setTimeout(() => { renderXPBar(); renderXPLog(); renderAchievements(); }, 60);
        }
      });
    });
  }

  return {
    init,
    onSessionComplete,
    onGoalComplete,
    onOverdueDetected,
    checkAchievements,
    getOverdueStreak,
    refreshUI,
    renderXPLog,
    renderAchievements,
    renderXPBar,
    renderBadgeOnBoard,
    getRank,
    load,
  };
})();
