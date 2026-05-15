// =============================================
// STATS MODULE
// =============================================
const StatsModule = (function () {
  const STORAGE_KEY = 'letsfocus_stats';
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function loadStats() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch(e) { return {}; }
  }

  function saveStats(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  }

  // Called by TimerModule when a session ends
  function recordSession(durationSeconds, goalName) {
    const data = loadStats();
    const key = todayKey();

    data.totalSeconds = (data.totalSeconds || 0) + durationSeconds;
    data.sessionsCompleted = (data.sessionsCompleted || 0) + 1;

    // Daily log
    if (!data.daily) data.daily = {};
    data.daily[key] = (data.daily[key] || 0) + durationSeconds;

    // Streak
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);
    if (data.lastSessionDate === key) {
      // same day, no change to streak
    } else if (data.lastSessionDate === yKey) {
      data.streak = (data.streak || 0) + 1;
    } else {
      data.streak = 1;
    }
    data.lastSessionDate = key;

    // Best session
    if (!data.bestSession || durationSeconds > data.bestSession.seconds) {
      data.bestSession = { seconds: durationSeconds, goal: goalName, date: key };
    }

    saveStats(data);
    if (document.getElementById('tab-stats')?.classList.contains('active')) renderStats();
  }

  // Called by GoalsModule when a goal is completed
  function recordGoalComplete() {
    const data = loadStats();
    data.goalsCompleted = (data.goalsCompleted || 0) + 1;
    saveStats(data);
    if (document.getElementById('tab-stats')?.classList.contains('active')) renderStats();
  }

  function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  function renderStats() {
    const data = loadStats();

    // Summary cards
    const totalEl = document.getElementById('statTotalTime');
    const streakEl = document.getElementById('statStreak');
    const sessionsEl = document.getElementById('statSessions');
    const goalsEl = document.getElementById('statGoalsDone');
    const bestEl = document.getElementById('statBestSession');
    const chartEl = document.getElementById('statsBarChart');

    if (totalEl) totalEl.textContent = formatTime(data.totalSeconds || 0);
    if (streakEl) streakEl.textContent = (data.streak || 0) + (data.streak === 1 ? ' day' : ' days');
    if (sessionsEl) sessionsEl.textContent = data.sessionsCompleted || 0;
    if (goalsEl) goalsEl.textContent = data.goalsCompleted || 0;

    if (bestEl) {
      if (data.bestSession) {
        const d = new Date(data.bestSession.date + 'T00:00:00');
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        bestEl.textContent = `${formatTime(data.bestSession.seconds)} on ${dateStr}${data.bestSession.goal ? ' — ' + data.bestSession.goal : ''}`;
      } else {
        bestEl.textContent = 'No sessions yet — start your first focus session!';
      }
    }

    // Bar chart — last 7 days
    if (chartEl) {
      chartEl.innerHTML = '';
      const daily = data.daily || {};
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({ key, label: DAYS[d.getDay()], isToday: i === 0, secs: daily[key] || 0 });
      }
      const maxSecs = Math.max(...days.map(d => d.secs), 60);
      days.forEach(day => {
        const col = document.createElement('div');
        col.className = 'stats-bar-col';
        const heightPct = Math.max((day.secs / maxSecs) * 76, day.secs > 0 ? 6 : 0);
        const val = document.createElement('div');
        val.className = 'stats-bar-val';
        val.textContent = day.secs > 0 ? formatTime(day.secs) : '';
        const bar = document.createElement('div');
        bar.className = 'stats-bar' + (day.isToday ? ' today' : '');
        bar.style.height = heightPct + 'px';
        bar.title = day.label + ': ' + formatTime(day.secs);
        const lbl = document.createElement('div');
        lbl.className = 'stats-bar-day';
        lbl.textContent = day.isToday ? 'Today' : day.label;
        col.appendChild(val); col.appendChild(bar); col.appendChild(lbl);
        chartEl.appendChild(col);
      });
    }
  }

  function resetStats() {
    localStorage.removeItem(STORAGE_KEY);
    renderStats();
  }

  function init() {
    // Wire stats tab activation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.tab === 'stats') setTimeout(renderStats, 50);
      });
    });
    // Reset button
    document.getElementById('statsResetBtn')?.addEventListener('click', async () => {
      const ok = await showConfirm('Reset all focus stats? This cannot be undone.');
      if (ok) resetStats();
    });
  }

  return { init, recordSession, recordGoalComplete, renderStats };
})();
