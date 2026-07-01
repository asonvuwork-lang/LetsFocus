// =============================================
// GOALS MODULE
// =============================================

const GoalsModule = (function() {

  let goals = JSON.parse(localStorage.getItem('goals')) || [];
  let selectedCategory = null;
  let selectedGoalId = null;
  let selectedParentId = null;
  let sortBy = 'none';
  let sortDirection = 'asc';
  let activeFilters = [];
  let completionFilter = null;
  let noDeadlineFilter = false;

  // ---- Deadlines tab view state ----
  let deadlinesView = 'list'; // 'list' | 'column'

  // ---- Priority constants ----
  const PRIORITIES = {
    crucial:    { label: 'Crucial',     color: '#ef4444', soft: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.55)',   outline: '#ef4444' },
    upcoming:   { label: 'Upcoming',    color: '#f59e0b', soft: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.50)',  outline: '#f59e0b' },
    interested: { label: 'Interested',  color: '#3b82f6', soft: 'rgba(59,130,246,0.09)',  border: 'rgba(59,130,246,0.40)',  outline: '#60a5fa' },
    someday:    { label: 'Someday',     color: '#6b7280', soft: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.35)', outline: '#9ca3af' },
  };
  const PRIORITY_ORDER = ['crucial', 'upcoming', 'interested', 'someday'];

  // ---- Early-shift config ----
  const EARLY_SHIFT_KEY = 'letsfocus_early_shift';
  function loadEarlyShift() {
    try { return JSON.parse(localStorage.getItem(EARLY_SHIFT_KEY) || 'null'); } catch(e) { return null; }
  }
  function saveEarlyShift(cfg) {
    localStorage.setItem(EARLY_SHIFT_KEY, JSON.stringify(cfg));
  }

  // Returns the DISPLAY deadline for a goal (shifted if applicable), never mutates goal.deadline
  function getDisplayDeadline(goal) {
    if (!goal.deadline) return null;
    const cfg = loadEarlyShift();
    if (!cfg || !cfg.enabled) return goal.deadline;

    // Only shift if:
    //  1. Goal category is in the selected categories (or categories list is empty = all)
    //  2. Deadline is > 7 days from today
    //  3. The config was set at least 1 day ago
    const today = new Date(); today.setHours(0,0,0,0);
    const configuredDate = new Date(cfg.configuredAt + 'T00:00:00');
    const dayAfterConfig = new Date(configuredDate); dayAfterConfig.setDate(dayAfterConfig.getDate() + 1);
    if (today < dayAfterConfig) return goal.deadline; // not yet active

    const dl = new Date(goal.deadline + 'T00:00:00');
    const daysAway = Math.round((dl - today) / 86400000);
    if (daysAway <= 7) return goal.deadline; // too close — don't shift

    const catMatch = !cfg.categories || cfg.categories.length === 0 ||
      (goal.category && cfg.categories.includes(goal.category));
    if (!catMatch) return goal.deadline;

    // Shift by cfg.days (1 or 2)
    const shifted = new Date(dl);
    shifted.setDate(shifted.getDate() - (cfg.days || 1));
    return shifted.toISOString().slice(0, 10);
  }

  function saveData() {
    localStorage.setItem('goals', JSON.stringify(goals));
    document.dispatchEvent(new CustomEvent('letsfocus:datasave', { detail: { key: 'goals' } }));
    if (typeof DrinkModule !== 'undefined') setTimeout(() => DrinkModule.renderBillBoard(), 50);
  }

  function getCategoryList() {
    if (typeof CategoriesModule !== 'undefined') return CategoriesModule.getAll().map(c => c.name);
    return JSON.parse(localStorage.getItem('categories') || '["Work","Personal","Fitness"]');
  }

  function getCategoryColor(name) {
    if (!name) return null;
    if (typeof CategoriesModule !== 'undefined') return CategoriesModule.getColor(name);
    return '#8a6a5a';
  }

  function checkRecurringGoals() {
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const weekKey  = `${now.getFullYear()}-W${getWeekNumber(now)}`;
    let changed = false;

    goals.forEach(goal => {
      if (!goal.recurring) return;
      if (goal.recurring === 'daily') {
        if (goal.lastResetDate !== todayKey) {
          goal.completed = false;
          if (goal.subgoals) goal.subgoals.forEach(sg => sg.completed = false);
          goal.lastResetDate = todayKey;
          goal.refreshedToday = true;
          changed = true;
        }
      } else if (goal.recurring === 'weekly') {
        if (goal.lastResetWeek !== weekKey) {
          goal.completed = false;
          if (goal.subgoals) goal.subgoals.forEach(sg => sg.completed = false);
          goal.lastResetWeek = weekKey;
          goal.refreshedToday = true;
          changed = true;
        }
      }
    });

    if (changed) { saveData(); }
  }

  function getWeekNumber(d) {
    const onejan = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  }

  function onCategoryDeleted(catName) {
    goals.forEach(g => { if (g.category === catName) g.category = null; });
    saveData(); renderGoals();
  }

  function addGoalProgrammatic(text, category) {
    goals.push({ id: Date.now() + Math.random(), text, category: category || null, completed: false, subgoals: [], deadline: null, priority: null });
    saveData(); updateMainProgress(); renderGoals(); renderDeadlinesTab();
  }

  function getGoals() { return goals; }
  function getCompletionRate() {
    if (!goals.length) return 0;
    return Math.round((goals.filter(g => g.completed).length / goals.length) * 100);
  }

  // ---- Deadline urgency helpers (use display deadline) ----
  function getDeadlineUrgency(deadline) {
    if (!deadline) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const dl = new Date(deadline + 'T00:00:00');
    const diff = Math.round((dl - today) / (1000 * 60 * 60 * 24));
    if (diff < 0)  return 'overdue';
    if (diff <= 2) return 'urgent';
    if (diff <= 5) return 'soon';
    return 'safe';
  }

  function getDeadlineDaysLabel(deadline) {
    if (!deadline) return '';
    const today = new Date(); today.setHours(0,0,0,0);
    const dl = new Date(deadline + 'T00:00:00');
    const diff = Math.round((dl - today) / (1000 * 60 * 60 * 24));
    if (diff < 0)  return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return 'Due today!';
    if (diff === 1) return 'Due tomorrow!';
    return `${diff}d left`;
  }

  function formatDeadlineDisplay(deadline) {
    if (!deadline) return '';
    const d = new Date(deadline + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // ---- Priority pill renderer ----
  function buildPriorityPill(priority) {
    if (!priority) return '';
    const p = PRIORITIES[priority];
    if (!p) return '';
    return `<span class="goal-priority-pill priority-${priority}">${p.label}</span>`;
  }

  // ---- Rendering ----
  function renderGoals() {
    const container = document.getElementById('goalsContainer');
    if (!container) return;
    container.innerHTML = '';

    let filtered = [...goals];
    if (activeFilters.length > 0) filtered = filtered.filter(g => activeFilters.includes(g.category));
    if (completionFilter === 'completed') filtered = filtered.filter(g => g.completed);
    else if (completionFilter === 'incomplete') filtered = filtered.filter(g => !g.completed);
    if (noDeadlineFilter) filtered = filtered.filter(g => !g.deadline);

    if (filtered.length === 0) {
      container.innerHTML = `<p class="no-goals-message">${activeFilters.length || completionFilter || noDeadlineFilter ? 'No goals match filters' : 'No goals yet. Add your first goal!'}</p>`;
      return;
    }

    filtered.forEach(goal => {
      const displayDl = getDisplayDeadline(goal);
      const urgency = getDeadlineUrgency(displayDl);
      const el = document.createElement('div');
      el.className = `goal-item ${goal.completed ? 'completed' : ''} ${selectedGoalId === goal.id ? 'selected' : ''} ${urgency && !goal.completed ? 'deadline-' + urgency : ''}`;
      if (goal.priority && !goal.completed) el.classList.add('priority-' + goal.priority);
      el.dataset.id = goal.id;

      const content = document.createElement('div');
      content.className = 'goal-content';

      const chk = document.createElement('input');
      chk.type = 'checkbox'; chk.className = 'goal-checkbox'; chk.checked = goal.completed;
      chk.addEventListener('change', function() {
        const wasCompleted = goal.completed;
        goal.completed = this.checked;
        if (goal.subgoals && goal.subgoals.length) goal.subgoals.forEach(sg => sg.completed = this.checked);
        if (!wasCompleted && goal.completed) {
          const _today = new Date(); _today.setHours(0, 0, 0, 0);
          const isLate = goal.deadline && new Date(goal.deadline + 'T00:00:00') < _today;
          const overdueStreak = typeof XPModule !== 'undefined' ? XPModule.getOverdueStreak() : 0;
          if (typeof XPModule !== 'undefined') XPModule.onGoalComplete(goal, isLate, overdueStreak);
          if (typeof StatsModule !== 'undefined') StatsModule.recordGoalComplete();
          if (goal.completed && goal.deadline) flashDeadlineCard(goal.id);
        }
        saveData(); updateMainProgress(); renderGoals(); renderDeadlinesTab();
      });

      const span = document.createElement('span');
      span.className = `goal-text ${goal.completed ? 'completed' : ''}`;
      span.textContent = goal.text;

      content.appendChild(chk);
      content.appendChild(span);

      if (goal.priority) {
        const pill = document.createElement('span');
        pill.className = `goal-priority-pill priority-${goal.priority}`;
        pill.textContent = PRIORITIES[goal.priority]?.label || goal.priority;
        content.appendChild(pill);
      }

      if (goal.category) {
        const catBadge = document.createElement('span');
        catBadge.className = 'goal-category';
        catBadge.textContent = goal.category;
        catBadge.dataset.cat = goal.category;
        const color = getCategoryColor(goal.category);
        if (color) {
          catBadge.style.background = color + '22';
          catBadge.style.color = color;
          catBadge.style.borderColor = color + '55';
        }
        content.appendChild(catBadge);
      }

      if (goal.recurring) {
        const recBadge = document.createElement('span');
        recBadge.className = 'goal-recurring-badge';
        recBadge.title = `Resets ${goal.recurring}`;
        recBadge.textContent = goal.recurring === 'daily' ? '↺ Daily' : '↺ Weekly';
        if (goal.refreshedToday) {
          recBadge.classList.add('refreshed');
          recBadge.title = '✨ Refreshed today';
        }
        content.appendChild(recBadge);
      }

      if (displayDl && !goal.completed) {
        const badgeWrap = document.createElement('span');
        badgeWrap.style.cssText = 'display:inline-flex;align-items:center;gap:4px;';

        const ringWrap = document.createElement('span');
        ringWrap.className = 'deadline-ring-wrap';
        const daysLeft = Math.ceil((new Date(displayDl + 'T00:00:00') - new Date()) / 86400000);
        const totalDays = Math.ceil((new Date(displayDl + 'T00:00:00') - new Date(goal.id)) / 86400000) || 30;
        const pct = Math.max(0, Math.min(1, daysLeft / Math.max(totalDays, 1)));
        const r = 11, circ = 2 * Math.PI * r;
        const strokeColor = urgency === 'overdue' ? '#ef4444' : urgency === 'urgent' ? '#f97316' : urgency === 'soon' ? '#f59e0b' : '#22c55e';
        ringWrap.innerHTML = `<svg class="deadline-ring-svg" viewBox="0 0 28 28">
          <circle class="deadline-ring-bg" cx="14" cy="14" r="${r}"/>
          <circle class="deadline-ring-fill" cx="14" cy="14" r="${r}"
            stroke="${strokeColor}"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${circ * (1 - pct)}"/>
        </svg>`;
        badgeWrap.appendChild(ringWrap);

        const badge = document.createElement('span');
        badge.className = `deadline-badge deadline-badge-${urgency}`;
        badge.title = 'Click to change deadline';
        const isShifted = displayDl !== goal.deadline;
        badge.innerHTML = `📅 ${formatDeadlineDisplay(displayDl)}${isShifted ? ' <span class="deadline-shifted-tag" title="Shifted earlier to help you finish ahead of time">⚡</span>' : ''} <span class="deadline-days">(${getDeadlineDaysLabel(displayDl)})</span>`;
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          openInlineDeadlinePicker(goal, badge);
        });
        badgeWrap.appendChild(badge);
        content.appendChild(badgeWrap);
      }

      const del = document.createElement('button');
      del.className = 'delete-goal-btn'; del.innerHTML = '&times;';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        goals = goals.filter(g => g.id !== goal.id);
        if (selectedGoalId === goal.id) selectedGoalId = null;
        saveData(); updateMainProgress(); renderGoals(); renderDeadlinesTab();
      });
      content.appendChild(del);
      el.appendChild(content);

      // Inline deadline setter
      if (!goal.deadline && !goal.completed) {
        const setDl = document.createElement('span');
        setDl.className = `goal-set-deadline-inline ${selectedGoalId === goal.id ? '' : 'hidden'}`;
        setDl.innerHTML = `<button class="set-deadline-link">📅 Set deadline</button><input type="date" class="inline-deadline-input hidden">`;
        setDl.querySelector('.set-deadline-link').addEventListener('click', (e) => {
          e.stopPropagation();
          const inp = setDl.querySelector('.inline-deadline-input');
          inp.classList.toggle('hidden');
          if (!inp.classList.contains('hidden')) inp.focus();
        });
        setDl.querySelector('.inline-deadline-input').addEventListener('change', (e) => {
          goal.deadline = e.target.value || null;
          saveData(); renderGoals(); renderDeadlinesTab();
        });
        content.appendChild(setDl);
      }

      // Priority selector (shown when goal is selected)
      if (!goal.completed && selectedGoalId === goal.id) {
        const prioRow = document.createElement('div');
        prioRow.className = 'goal-priority-row';
        prioRow.innerHTML = `
          <span class="goal-priority-label">🎯 Priority:</span>
          <button class="goal-prio-btn ${!goal.priority ? 'active' : ''}" data-val="">None</button>
          ${PRIORITY_ORDER.map(p => `<button class="goal-prio-btn prio-${p} ${goal.priority === p ? 'active' : ''}" data-val="${p}">${PRIORITIES[p].label}</button>`).join('')}
        `;
        prioRow.querySelectorAll('.goal-prio-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            goal.priority = btn.dataset.val || null;
            saveData(); renderGoals();
          });
        });
        el.appendChild(prioRow);
      }

      // Recurring toggle
      if (!goal.completed && selectedGoalId === goal.id) {
        const recRow = document.createElement('div');
        recRow.className = 'goal-recurring-row';
        recRow.innerHTML = `
          <span class="goal-recurring-label">↺ Repeat:</span>
          <button class="goal-rec-btn ${!goal.recurring ? 'active' : ''}" data-val="">None</button>
          <button class="goal-rec-btn ${goal.recurring === 'daily' ? 'active' : ''}" data-val="daily">Daily</button>
          <button class="goal-rec-btn ${goal.recurring === 'weekly' ? 'active' : ''}" data-val="weekly">Weekly</button>
        `;
        recRow.querySelectorAll('.goal-rec-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            goal.recurring = btn.dataset.val || null;
            if (!goal.recurring) goal.refreshedToday = false;
            saveData(); renderGoals();
          });
        });
        el.appendChild(recRow);
      }

      // Subgoals
      if (goal.subgoals && goal.subgoals.length) {
        const prog = document.createElement('div'); prog.className = 'goal-progress-container';
        const progBar = document.createElement('div'); progBar.className = 'goal-progress-bar';
        const progFill = document.createElement('div'); progFill.className = 'goal-progress';
        progFill.style.width = calcSubgoalProgress(goal) + '%';
        progBar.appendChild(progFill); prog.appendChild(progBar); el.appendChild(prog);

        const subs = document.createElement('div'); subs.className = 'subgoals-container';
        goal.subgoals.forEach(sg => {
          const subEl = document.createElement('div'); subEl.className = 'subgoal-item';
          const sChk = document.createElement('input'); sChk.type = 'checkbox'; sChk.className = 'goal-checkbox'; sChk.checked = sg.completed;
          sChk.addEventListener('change', function() {
            sg.completed = this.checked;
            goal.completed = goal.subgoals.every(s => s.completed);
            saveData(); updateMainProgress(); renderGoals(); renderDeadlinesTab();
          });
          const sSpan = document.createElement('span'); sSpan.className = `goal-text ${sg.completed ? 'completed' : ''}`; sSpan.textContent = sg.text;
          const sDel = document.createElement('button'); sDel.className = 'delete-goal-btn'; sDel.innerHTML = '&times;';
          sDel.addEventListener('click', (e) => {
            e.stopPropagation();
            goal.subgoals = goal.subgoals.filter(s => s.id !== sg.id);
            saveData(); renderGoals();
          });
          subEl.appendChild(sChk); subEl.appendChild(sSpan);
          if (sg.category) { const b = document.createElement('span'); b.className = 'goal-category'; b.textContent = sg.category; subEl.appendChild(b); }
          subEl.appendChild(sDel); subs.appendChild(subEl);
        });
        el.appendChild(subs);
      }

      // Inline add subgoal
      if (!goal.completed && selectedGoalId === goal.id) {
        const addSubRow = document.createElement('div');
        addSubRow.className = 'goal-add-subgoal-row';
        addSubRow.innerHTML = `
          <input type="text" class="subgoal-inline-input" placeholder="Add a subgoal…" autocomplete="off">
          <button class="subgoal-inline-add">+</button>
        `;
        const subInp = addSubRow.querySelector('.subgoal-inline-input');
        const subAdd = addSubRow.querySelector('.subgoal-inline-add');
        const doAdd = () => {
          const txt = subInp.value.trim();
          if (!txt) return;
          if (!goal.subgoals) goal.subgoals = [];
          goal.subgoals.push({ id: Date.now().toString(), text: txt, completed: false });
          saveData(); renderGoals();
        };
        subAdd.addEventListener('click', (e) => { e.stopPropagation(); doAdd(); });
        subInp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.stopPropagation(); doAdd(); } });
        subInp.addEventListener('click', (e) => e.stopPropagation());
        el.appendChild(addSubRow);
      }

      // Drag handle
      const dragHandle = document.createElement('span');
      dragHandle.className = 'drag-handle';
      dragHandle.innerHTML = '⠿';
      dragHandle.title = 'Drag to reorder';
      el.insertBefore(dragHandle, el.firstChild);

      el.setAttribute('draggable', 'true');
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', goal.id);
        setTimeout(() => el.classList.add('dragging'), 0);
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
      el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('drag-over'); });
      el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('drag-over');
        const fromId = e.dataTransfer.getData('text/plain');
        const toId = goal.id;
        if (fromId === toId) return;
        const fromIdx = goals.findIndex(g => g.id === fromId);
        const toIdx = goals.findIndex(g => g.id === toId);
        if (fromIdx === -1 || toIdx === -1) return;
        const [moved] = goals.splice(fromIdx, 1);
        goals.splice(toIdx, 0, moved);
        saveData(); renderGoals();
      });

      content.addEventListener('click', (e) => {
        if (e.target !== chk && e.target !== del) {
          selectedGoalId = selectedGoalId === goal.id ? null : goal.id;
          renderGoals();
        }
      });

      container.appendChild(el);
    });

    renderParentGoalDropdown();
  }

  // ---- Bill Board (board view) with priority outlines ----
  // This patch applies priority outline to bills via inline style on the note element.
  // It hooks into DrinkModule.renderBillBoard via saveData triggering the timeout.
  // We override here to inject priority borders post-render.
  function applyPriorityOutlinesToBoard() {
    setTimeout(() => {
      const board = document.getElementById('billBoard');
      if (!board) return;
      goals.forEach(goal => {
        if (!goal.priority) return;
        const note = board.querySelector(`.bill-square[data-goal-id="${goal.id}"]`);
        if (!note) return;
        const p = PRIORITIES[goal.priority];
        if (!p) return;
        note.style.boxShadow = `inset 0 0 0 3px ${p.outline}, 2px 3px 8px rgba(0,0,0,0.35)`;
        note.style.outline = 'none';
      });
    }, 80);
  }

  function flashDeadlineCard(goalId) {
    setTimeout(() => {
      const card = document.querySelector(`.deadline-card[data-goal-id="${goalId}"]`);
      if (card) { card.classList.add('completing'); setTimeout(() => card.classList.remove('completing'), 900); }
    }, 100);
  }

  function openInlineDeadlinePicker(goal, badgeEl) {
    document.querySelectorAll('.floating-deadline-picker').forEach(el => el.remove());
    const picker = document.createElement('div');
    picker.className = 'floating-deadline-picker';
    picker.innerHTML = `
      <label>Change deadline</label>
      <input type="date" value="${goal.deadline || ''}">
      <div class="fdp-actions">
        <button class="fdp-save">Save</button>
        <button class="fdp-remove">Remove</button>
        <button class="fdp-cancel">Cancel</button>
      </div>`;
    badgeEl.style.position = 'relative';
    badgeEl.appendChild(picker);
    picker.querySelector('input').focus();
    picker.querySelector('.fdp-save').addEventListener('click', (e) => {
      e.stopPropagation();
      const val = picker.querySelector('input').value;
      goal.deadline = val || null;
      saveData(); renderGoals(); renderDeadlinesTab(); picker.remove();
    });
    picker.querySelector('.fdp-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      goal.deadline = null;
      saveData(); renderGoals(); renderDeadlinesTab(); picker.remove();
    });
    picker.querySelector('.fdp-cancel').addEventListener('click', (e) => {
      e.stopPropagation(); picker.remove();
    });
  }

  function calcSubgoalProgress(goal) {
    if (!goal.subgoals || !goal.subgoals.length) return 0;
    return (goal.subgoals.filter(s => s.completed).length / goal.subgoals.length) * 100;
  }

  let _allDoneCelebrated = false;

  function updateMainProgress() {
    const bar = document.querySelector('.progress');
    const clearBtn = document.getElementById('clearAllGoalsBtn');
    if (!bar) return;
    if (!goals.length) {
      bar.style.width = '0%';
      if (clearBtn) clearBtn.classList.add('hidden');
      _allDoneCelebrated = false;
      return;
    }
    const pct = goals.filter(g => g.completed).length / goals.length * 100;
    bar.style.width = pct + '%';
    const allDone = goals.every(g => g.completed);
    if (clearBtn) clearBtn.classList.toggle('hidden', !allDone);

    if (!allDone) {
      _allDoneCelebrated = false;
      return;
    }

    const timerPageVisible = !document.getElementById('timerPage')?.classList.contains('hidden');
    if (!_allDoneCelebrated && !timerPageVisible) {
      _allDoneCelebrated = true;
      triggerCelebration();
    }
  }

  // ================================================================
  // DEADLINES TAB
  // ================================================================
  function renderDeadlinesTab() {
    renderOverdueNotifications();
    renderUpcomingAlerts();
    renderDeadlinesViewContent();
  }

  function renderDeadlinesViewContent() {
    if (deadlinesView === 'column') {
      renderDeadlinesColumn();
    } else {
      renderDeadlinesList();
    }
  }

  // ---- Overdue Notifications ----
  function renderOverdueNotifications() {
    const container = document.getElementById('overdueNotifications');
    if (!container) return;
    container.innerHTML = '';
    const overdueGoals = goals.filter(g => {
      if (g.completed) return false;
      const dl = getDisplayDeadline(g);
      return getDeadlineUrgency(dl) === 'overdue';
    });
    if (!overdueGoals.length) return;

    overdueGoals.forEach(goal => {
      const dl = getDisplayDeadline(goal);
      const card = document.createElement('div');
      card.className = 'overdue-notification-card';
      const today = new Date(); today.setHours(0,0,0,0);
      const dlDate = new Date(dl + 'T00:00:00');
      const daysOver = Math.abs(Math.round((dlDate - today) / (1000 * 60 * 60 * 24)));
      card.innerHTML = `
        <div class="overdue-icon">⏰</div>
        <div class="overdue-body">
          <div class="overdue-title">Deadline passed: <strong>${goal.text}</strong></div>
          <div class="overdue-meta">Was due ${formatDeadlineDisplay(dl)} · ${daysOver} day${daysOver !== 1 ? 's' : ''} ago</div>
        </div>
        <div class="overdue-actions">
          <button class="overdue-btn change">📅 New Date</button>
          <button class="overdue-btn remove">✕ Remove Deadline</button>
        </div>`;

      card.querySelector('.overdue-btn.change').addEventListener('click', () => {
        showDatePickerModal(goal, () => { renderGoals(); renderDeadlinesTab(); });
      });
      card.querySelector('.overdue-btn.remove').addEventListener('click', () => {
        goal.deadline = null;
        saveData(); renderGoals(); renderDeadlinesTab();
      });

      container.appendChild(card);
    });
  }

  function showDatePickerModal(goal, callback) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(74,52,41,0.5);backdrop-filter:blur(3px);z-index:10000;display:flex;align-items:center;justify-content:center;';
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:rgba(245,241,235,0.98);border-radius:16px;padding:2rem;max-width:360px;width:90%;box-shadow:0 12px 35px rgba(139,111,71,0.25);border:2px solid rgba(139,111,71,0.3);text-align:center;';
    dialog.innerHTML = `
      <p style="font-family:'Playfair Display',serif;font-size:1.1rem;color:#6b5139;margin-bottom:1rem;">📅 Set new deadline for<br><strong>${goal.text}</strong></p>
      <input type="date" id="modalDateInput" value="${goal.deadline || ''}" style="width:100%;padding:10px 14px;border:2px solid rgba(139,111,71,0.3);border-radius:10px;font-size:1rem;margin-bottom:1.5rem;background:rgba(245,241,235,0.9);color:#4a3429;font-family:'Source Sans Pro',sans-serif;">
      <div style="display:flex;gap:10px;justify-content:center;">
        <button id="modalDateSave" style="background:linear-gradient(135deg,#8b6f47,#6b5139);color:#f5f1eb;border:none;padding:10px 22px;border-radius:10px;font-family:'Playfair Display',serif;cursor:pointer;font-size:1rem;">Save</button>
        <button id="modalDateCancel" style="background:rgba(245,241,235,0.8);color:#6b5139;border:2px solid rgba(139,111,71,0.3);padding:10px 22px;border-radius:10px;font-family:'Playfair Display',serif;cursor:pointer;font-size:1rem;">Cancel</button>
      </div>`;
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    dialog.querySelector('#modalDateSave').addEventListener('click', () => {
      const val = dialog.querySelector('#modalDateInput').value;
      goal.deadline = val || null;
      saveData(); document.body.removeChild(modal); callback();
    });
    dialog.querySelector('#modalDateCancel').addEventListener('click', () => document.body.removeChild(modal));
  }

  // ---- Upcoming Alerts ----
  function renderUpcomingAlerts() {
    const container = document.getElementById('upcomingAlerts');
    if (!container) return;
    container.innerHTML = '';
    const alertGoals = goals.filter(g => {
      if (g.completed) return false;
      const dl = getDisplayDeadline(g);
      const u = getDeadlineUrgency(dl);
      return u === 'urgent' || u === 'soon';
    });
    if (!alertGoals.length) return;

    const banner = document.createElement('div');
    banner.className = 'upcoming-alerts-banner';
    banner.innerHTML = `<div class="upcoming-alerts-title">☕ Heads up — goals coming up soon</div>`;
    alertGoals.forEach(g => {
      const dl = getDisplayDeadline(g);
      const row = document.createElement('div');
      row.className = `upcoming-alert-row alert-${getDeadlineUrgency(dl)}`;
      row.innerHTML = `<span class="upcoming-alert-dot"></span><strong>${g.text}</strong><span class="upcoming-alert-when">${getDeadlineDaysLabel(dl)}</span>`;
      banner.appendChild(row);
    });
    container.appendChild(banner);
  }

  // ================================================================
  // LIST VIEW — deadlines sorted closest to furthest
  // ================================================================
  function renderDeadlinesList() {
    const container = document.getElementById('deadlinesList');
    if (!container) return;
    container.innerHTML = '';

    const withDeadline = goals.filter(g => g.deadline);
    const emptyEl = document.getElementById('deadlinesEmpty');
    if (!withDeadline.length) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }
    if (emptyEl) emptyEl.classList.add('hidden');

    const sorted = [...withDeadline].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const da = getDisplayDeadline(a), db = getDisplayDeadline(b);
      return new Date(da) - new Date(db);
    });

    sorted.forEach(goal => buildDeadlineCard(goal, container));
  }

  // ================================================================
  // COLUMN VIEW — 4 urgency columns
  // ================================================================
  function renderDeadlinesColumn() {
    const container = document.getElementById('deadlinesList');
    if (!container) return;
    container.innerHTML = '';

    const withDeadline = goals.filter(g => g.deadline);
    const emptyEl = document.getElementById('deadlinesEmpty');
    if (!withDeadline.length) {
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }
    if (emptyEl) emptyEl.classList.add('hidden');

    // Sort each column closest to furthest
    const cols = {
      overdue:   { label: '🔴 Overdue',   goals: [], class: 'col-overdue'  },
      urgent:    { label: '🟠 Urgent',     goals: [], class: 'col-urgent'   },
      soon:      { label: '🟡 Soon',       goals: [], class: 'col-soon'     },
      safe:      { label: '🟢 On Track',   goals: [], class: 'col-safe'     },
      completed: { label: '✅ Done',       goals: [], class: 'col-done'     },
    };

    withDeadline.forEach(goal => {
      if (goal.completed) { cols.completed.goals.push(goal); return; }
      const dl = getDisplayDeadline(goal);
      const u = getDeadlineUrgency(dl) || 'safe';
      cols[u].goals.push(goal);
    });

    // Sort each column by display deadline
    Object.values(cols).forEach(col => {
      col.goals.sort((a, b) => new Date(getDisplayDeadline(a)) - new Date(getDisplayDeadline(b)));
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'deadlines-column-view';

    Object.entries(cols).forEach(([key, col]) => {
      const colEl = document.createElement('div');
      colEl.className = `dl-column ${col.class}`;
      colEl.innerHTML = `
        <div class="dl-column-header">
          <span class="dl-column-title">${col.label}</span>
          <span class="dl-column-count">${col.goals.length}</span>
        </div>
        <div class="dl-column-body" data-col="${key}"></div>
      `;
      const body = colEl.querySelector('.dl-column-body');
      if (!col.goals.length) {
        body.innerHTML = `<div class="dl-column-empty">Nothing here ☕</div>`;
      } else {
        col.goals.forEach(goal => buildDeadlineCard(goal, body, true));
      }
      wrapper.appendChild(colEl);
    });

    container.appendChild(wrapper);
  }

  // ================================================================
  // DEADLINE CARD BUILDER (shared by list + column)
  // ================================================================
  function buildDeadlineCard(goal, container, compact = false) {
    const displayDl = getDisplayDeadline(goal);
    const urgency = goal.completed ? 'done' : (getDeadlineUrgency(displayDl) || 'safe');
    const isShifted = displayDl && displayDl !== goal.deadline;

    const card = document.createElement('div');
    card.className = `deadline-card-v2 ${goal.completed ? 'dl-completed' : 'dl-' + urgency}${compact ? ' dl-compact' : ''}`;
    card.dataset.goalId = goal.id;

    if (goal.priority && !goal.completed) card.classList.add('dl-priority-' + goal.priority);

    const overdueStreak = typeof XPModule !== 'undefined' ? XPModule.getOverdueStreak() : 0;
    const overduePill = (urgency === 'overdue' && overdueStreak > 0) ? `
      <div class="overdue-streak-pill" title="Overdue streak — reduces XP gain">
        🔥 ${overdueStreak} overdue
        <span class="overdue-streak-xp">−${overdueStreak >= 7 ? 35 : overdueStreak >= 4 ? 20 : overdueStreak >= 2 ? 10 : 5} XP</span>
      </div>` : '';

    const subCount = goal.subgoals ? goal.subgoals.length : 0;
    const subDone  = goal.subgoals ? goal.subgoals.filter(s => s.completed).length : 0;
    const priorityBadge = goal.priority ? `<span class="dl-priority-badge priority-${goal.priority}">${PRIORITIES[goal.priority]?.label}</span>` : '';

    // Category badge
    const catColor = getCategoryColor(goal.category);
    const catBadge = goal.category ? `<span class="goal-category" data-cat="${goal.category}" style="background:${catColor}22;color:${catColor};border-color:${catColor}55">${goal.category}</span>` : '';

    // Shifted indicator
    const shiftBadge = isShifted ? `<span class="dl-shifted-badge" title="Deadline shifted 1–2 days earlier to help you finish on time">⚡ Early shift</span>` : '';

    card.innerHTML = `
      <div class="dl-card-accent"></div>
      <div class="dl-card-body">
        <div class="dl-card-top">
          <div class="dl-card-title-row">
            <span class="dl-card-title ${goal.completed ? 'completed' : ''}">${goal.text}</span>
            ${priorityBadge}
          </div>
          <div class="dl-card-meta">
            ${catBadge}
            ${subCount ? `<span class="dl-card-sub">${subDone}/${subCount} subtasks</span>` : ''}
            ${shiftBadge}
          </div>
          ${overduePill}
        </div>
        <div class="dl-card-right">
          <div class="dl-card-date-block">
            <div class="dl-card-month">${displayDl ? formatDeadlineDisplay(displayDl).split(' ')[0] : '—'}</div>
            <div class="dl-card-day">${displayDl ? new Date(displayDl + 'T00:00:00').getDate() : ''}</div>
          </div>
          <div class="dl-card-days-label dl-days-${urgency}">${goal.completed ? '✓ Done' : (displayDl ? getDeadlineDaysLabel(displayDl) : '')}</div>
          ${!goal.completed && displayDl ? `<button class="dl-card-edit-btn">✏️</button>` : ''}
        </div>
      </div>
    `;

    if (!goal.completed && displayDl) {
      card.querySelector('.dl-card-edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showDatePickerModal(goal, () => { renderGoals(); renderDeadlinesTab(); });
      });
    }

    container.appendChild(card);
  }

  // ================================================================
  // EARLY-SHIFT MODAL
  // ================================================================
  function showEarlyShiftModal() {
    const existing = document.getElementById('earlyShiftModal');
    if (existing) { existing.remove(); return; }

    const cfg = loadEarlyShift() || { enabled: false, categories: [], days: 1 };
    const cats = getCategoryList();

    const modal = document.createElement('div');
    modal.id = 'earlyShiftModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(40,22,10,0.72);backdrop-filter:blur(4px);z-index:20000;display:flex;align-items:center;justify-content:center;padding:20px;';

    const box = document.createElement('div');
    box.style.cssText = `
      background: linear-gradient(160deg, #2a1a0e 0%, #3d2410 60%, #1e1108 100%);
      border-radius: 20px; padding: 2rem 2.2rem; max-width: 480px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1.5px solid rgba(212,165,116,0.25);
      font-family: 'Playfair Display', serif; color: #f5e8d0;
    `;

    box.innerHTML = `
      <div style="font-size:2rem;margin-bottom:0.5rem;text-align:center;">⚡</div>
      <h3 style="text-align:center;font-size:1.4rem;font-style:italic;margin-bottom:0.5rem;color:#d4a574;">Early Shift</h3>
      <p style="font-family:'Source Sans Pro',sans-serif;font-size:0.85rem;color:rgba(212,165,116,0.6);text-align:center;margin-bottom:1.5rem;line-height:1.5;">
        Automatically show deadlines 1–2 days earlier than set — so you always finish ahead of time.<br>
        Only applies to goals due more than 7 days away, starting the day after you save this.
      </p>

      <label style="display:flex;align-items:center;gap:10px;margin-bottom:1.2rem;cursor:pointer;">
        <input type="checkbox" id="esEnabled" ${cfg.enabled ? 'checked' : ''} style="width:18px;height:18px;accent-color:#d4a574;cursor:pointer;">
        <span style="font-size:1rem;">Enable Early Shift</span>
      </label>

      <div id="esOptions" style="${cfg.enabled ? '' : 'opacity:0.38;pointer-events:none;'}">
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:1.5px;color:rgba(212,165,116,0.55);margin-bottom:8px;">Shift by</div>
          <div style="display:flex;gap:10px;">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-family:'Source Sans Pro',sans-serif;font-size:0.9rem;">
              <input type="radio" name="esDays" value="1" ${(cfg.days||1)===1?'checked':''} style="accent-color:#d4a574;"> 1 day earlier
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-family:'Source Sans Pro',sans-serif;font-size:0.9rem;">
              <input type="radio" name="esDays" value="2" ${cfg.days===2?'checked':''} style="accent-color:#d4a574;"> 2 days earlier
            </label>
          </div>
        </div>

        <div>
          <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:1.5px;color:rgba(212,165,116,0.55);margin-bottom:8px;">Apply to categories (leave empty = all)</div>
          <div id="esCatList" style="display:flex;flex-wrap:wrap;gap:7px;">
            ${cats.map(c => `
              <label style="display:flex;align-items:center;gap:5px;cursor:pointer;
                background:rgba(212,165,116,0.10);border:1px solid rgba(212,165,116,0.25);
                border-radius:20px;padding:5px 12px;font-family:'Source Sans Pro',sans-serif;font-size:0.82rem;">
                <input type="checkbox" name="esCat" value="${c}" ${cfg.categories && cfg.categories.includes(c) ? 'checked' : ''} style="accent-color:#d4a574;">
                ${c}
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <div style="display:flex;gap:10px;margin-top:1.6rem;justify-content:center;">
        <button id="esSave" style="
          background:linear-gradient(135deg,#d4a574,#8b6f47);color:#fff;border:none;
          padding:11px 28px;border-radius:12px;font-family:'Playfair Display',serif;
          font-size:0.95rem;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(212,165,116,0.3);">
          Save Settings
        </button>
        <button id="esCancel" style="
          background:rgba(212,165,116,0.10);color:rgba(212,165,116,0.7);
          border:1px solid rgba(212,165,116,0.25);padding:11px 22px;border-radius:12px;
          font-family:'Playfair Display',serif;font-size:0.95rem;cursor:pointer;">
          Cancel
        </button>
      </div>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    const enabledCb = box.querySelector('#esEnabled');
    const optionsDiv = box.querySelector('#esOptions');
    enabledCb.addEventListener('change', () => {
      optionsDiv.style.opacity = enabledCb.checked ? '1' : '0.38';
      optionsDiv.style.pointerEvents = enabledCb.checked ? 'all' : 'none';
    });

    box.querySelector('#esSave').addEventListener('click', () => {
      const enabled = enabledCb.checked;
      const days = parseInt(box.querySelector('input[name="esDays"]:checked')?.value || '1');
      const categories = [...box.querySelectorAll('input[name="esCat"]:checked')].map(i => i.value);
      const today = new Date().toISOString().slice(0, 10);
      saveEarlyShift({ enabled, days, categories, configuredAt: today });
      modal.remove();
      renderDeadlinesTab();
      showCustomAlert(`⚡ Early Shift ${enabled ? 'enabled' : 'disabled'}! Deadlines will be ${enabled ? `shifted ${days} day${days>1?'s':''} earlier` : 'shown as set'}.`);
    });
    box.querySelector('#esCancel').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  // ---- Goal actions ----
  function addGoal() {
    const input = document.getElementById('newGoalInput');
    const text = input.value.trim();
    if (!text) return;

    const deadlineInput = document.getElementById('newGoalDeadline');
    const deadline = deadlineInput ? deadlineInput.value || null : null;

    if (selectedParentId) {
      const parent = goals.find(g => g.id === selectedParentId);
      if (parent) {
        if (!parent.subgoals) parent.subgoals = [];
        parent.subgoals.push({ id: Date.now(), text, completed: false, category: parent.category });
        saveData(); renderGoals(); renderDeadlinesTab();
        input.value = '';
        if (deadlineInput) { deadlineInput.value = ''; deadlineInput.classList.add('hidden'); }
        const dlBtnSub = document.getElementById('deadlineDateToggle');
        if (dlBtnSub) dlBtnSub.innerHTML = '📅 Deadline';
        resetParentSelection();
        input.focus();
        return;
      }
    }

    goals.push({ id: Date.now(), text, category: selectedCategory, completed: false, subgoals: [], deadline: deadline, priority: null });
    saveData(); updateMainProgress(); renderGoals(); renderDeadlinesTab();
    input.value = '';
    if (deadlineInput) { deadlineInput.value = ''; deadlineInput.classList.add('hidden'); }
    const dlBtnMain = document.getElementById('deadlineDateToggle');
    if (dlBtnMain) dlBtnMain.innerHTML = '📅 Deadline';
    resetParentSelection();
    input.classList.remove('expanded');
    input.focus();
  }

  function resetParentSelection() {
    selectedParentId = null;
    document.querySelectorAll('.parent-goal-option').forEach(el => el.classList.remove('active'));
    const noneOpt = document.querySelector('.parent-goal-none');
    if (noneOpt) noneOpt.classList.add('active');
    const addBtn = document.getElementById('addGoalBtn');
    if (addBtn) addBtn.textContent = '+';
  }

  function handleAddGoal() {
    addGoal();
    document.getElementById('addGoalBtn')?.classList.add('clicked');
    setTimeout(() => document.getElementById('addGoalBtn')?.classList.remove('clicked'), 300);
  }

  function renderParentGoalDropdown() {
    const list = document.getElementById('parentGoalList');
    if (!list) return;
    list.innerHTML = '';
    const inputVal = (document.getElementById('newGoalInput')?.value || '').toLowerCase();
    const candidates = goals.filter(g => !g.completed && (!inputVal || g.text.toLowerCase().includes(inputVal)));

    if (!candidates.length) {
      list.innerHTML = '<div class="parent-goal-empty">No matching goals</div>';
      return;
    }
    candidates.forEach(g => {
      const opt = document.createElement('div');
      opt.className = `parent-goal-option ${selectedParentId === g.id ? 'active' : ''}`;
      opt.dataset.id = g.id;
      opt.innerHTML = `<span class="parent-icon">↳</span><span class="parent-goal-text">${g.text}</span>${g.category ? `<span class="goal-category" style="font-size:0.75rem;padding:2px 8px;margin-left:auto;">${g.category}</span>` : ''}`;
      opt.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectedParentId = selectedParentId === g.id ? null : g.id;
        renderParentGoalDropdown();
        const addBtn = document.getElementById('addGoalBtn');
        if (addBtn) addBtn.textContent = selectedParentId ? '↳+' : '+';
        document.querySelector('.parent-goal-none')?.classList.toggle('active', !selectedParentId);
      });
      list.appendChild(opt);
    });
  }

  function initParentGoalDropdown() {
    const input = document.getElementById('newGoalInput');
    const dropdown = document.getElementById('parentGoalDropdown');
    if (!input || !dropdown) return;

    input.addEventListener('focus', () => { renderParentGoalDropdown(); dropdown.classList.remove('hidden'); });
    input.addEventListener('input', () => { renderParentGoalDropdown(); });
    input.addEventListener('blur', () => { setTimeout(() => dropdown.classList.add('hidden'), 200); });

    const noneOpt = dropdown.querySelector('.parent-goal-none');
    if (noneOpt) {
      noneOpt.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectedParentId = null;
        renderParentGoalDropdown();
        noneOpt.classList.add('active');
        const addBtn = document.getElementById('addGoalBtn');
        if (addBtn) addBtn.textContent = '+';
      });
    }
  }

  function initDeadlineDateToggle() {
    const btn = document.getElementById('deadlineDateToggle');
    const inp = document.getElementById('newGoalDeadline');
    if (!btn || !inp) return;

    inp.classList.add('toolbar-date');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const visible = !inp.classList.contains('hidden');
      inp.classList.toggle('hidden', visible);
      if (!visible) inp.focus();
      btn.classList.toggle('active', !visible);
    });

    inp.addEventListener('click', (e) => e.stopPropagation());
    inp.addEventListener('change', () => {
      const val = inp.value;
      if (val) {
        const d = new Date(val + 'T00:00:00');
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        btn.innerHTML = `📅 ${label}`;
      } else {
        btn.innerHTML = '📅 Deadline';
      }
      inp.classList.add('hidden');
      btn.classList.remove('active');
    });

    document.addEventListener('click', () => {
      inp.classList.add('hidden');
      btn.classList.remove('active');
    });
  }

  // ---- Categories ----
  function renderPickCategories() {
    const list = document.getElementById('pickCategoryList');
    if (!list) return;
    list.innerHTML = '';
    const cats = getCategoryList();
    const addTag = (name, isNull = false) => {
      const el = document.createElement('div');
      el.className = `category-tag ${(isNull && !selectedCategory) || selectedCategory === name ? 'active' : ''}`;
      el.textContent = isNull ? 'No Category' : name;
      if (!isNull) {
        const color = getCategoryColor(name);
        if (color) { el.style.borderLeft = `4px solid ${color}`; }
      }
      el.addEventListener('click', () => {
        selectedCategory = isNull ? null : (selectedCategory === name ? null : name);
        renderPickCategories();
      });
      list.appendChild(el);
    };
    addTag(null, true);
    cats.forEach(c => addTag(c));
  }

  function renderFilterCategories() {
    const list = document.getElementById('filterCategoryList');
    if (!list) return;
    list.innerHTML = '';

    const compSec = document.createElement('div'); compSec.className = 'filter-section';
    const compTitle = document.createElement('div'); compTitle.className = 'filter-section-title'; compTitle.textContent = 'Status';
    const compTags = document.createElement('div'); compTags.className = 'filter-tags';
    [['all', 'All'], ['completed', 'Completed ✓'], ['incomplete', 'Incomplete']].forEach(([val, label]) => {
      const t = document.createElement('span');
      t.className = `filter-tag ${(val === 'all' && !completionFilter) || completionFilter === val ? 'active' : ''}`;
      t.textContent = label;
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        completionFilter = val === 'all' ? null : val;
        renderFilterCategories(); renderGoals();
      });
      compTags.appendChild(t);
    });
    compSec.appendChild(compTitle); compSec.appendChild(compTags); list.appendChild(compSec);

    const catSec = document.createElement('div'); catSec.className = 'filter-section';
    const catTitle = document.createElement('div'); catTitle.className = 'filter-section-title'; catTitle.textContent = 'Category';
    const catTags = document.createElement('div'); catTags.className = 'filter-tags';
    const allTag = document.createElement('span'); allTag.className = `filter-tag ${activeFilters.length === 0 ? 'active' : ''}`; allTag.textContent = 'All Categories';
    allTag.addEventListener('click', (e) => { e.stopPropagation(); activeFilters = []; renderFilterCategories(); renderGoals(); });
    catTags.appendChild(allTag);
    const categories = getCategoryList();
    categories.forEach(cat => {
      const t = document.createElement('span');
      const color = getCategoryColor(cat);
      t.className = `filter-tag ${activeFilters.includes(cat) ? 'active' : ''}`;
      t.textContent = cat;
      t.dataset.cat = cat;
      if (color && activeFilters.includes(cat)) { t.style.background = color + '33'; t.style.color = color; t.style.borderColor = color; }
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeFilters.includes(cat)) activeFilters = activeFilters.filter(f => f !== cat);
        else activeFilters.push(cat);
        renderFilterCategories(); renderGoals();
      });
      catTags.appendChild(t);
    });
    catSec.appendChild(catTitle); catSec.appendChild(catTags); list.appendChild(catSec);

    const dlSec = document.createElement('div'); dlSec.className = 'filter-section';
    const dlTitle = document.createElement('div'); dlTitle.className = 'filter-section-title'; dlTitle.textContent = 'Deadline';
    const dlTags = document.createElement('div'); dlTags.className = 'filter-tags';
    const dlAllTag = document.createElement('span');
    dlAllTag.className = `filter-tag ${!noDeadlineFilter ? 'active' : ''}`; dlAllTag.textContent = 'All Goals';
    dlAllTag.addEventListener('click', (e) => { e.stopPropagation(); noDeadlineFilter = false; renderFilterCategories(); renderGoals(); });
    const dlNoTag = document.createElement('span');
    dlNoTag.className = `filter-tag ${noDeadlineFilter ? 'active' : ''}`; dlNoTag.textContent = '📅 No Deadline Set';
    dlNoTag.addEventListener('click', (e) => { e.stopPropagation(); noDeadlineFilter = !noDeadlineFilter; renderFilterCategories(); renderGoals(); });
    dlTags.appendChild(dlAllTag); dlTags.appendChild(dlNoTag);
    dlSec.appendChild(dlTitle); dlSec.appendChild(dlTags); list.appendChild(dlSec);
  }

  async function addNewCategory() {
    const btn = document.querySelector('.tab-btn[data-tab="categories"]');
    if (btn) btn.click();
    else showCustomAlert('Open the Categories tab to manage categories.');
  }

  // ---- Sort ----
  function initSortDropdown() {
    const btn = document.getElementById('sortGoalsBtn');
    if (!btn) return;
    const sortDropdown = document.createElement('div');
    sortDropdown.className = 'sort-dropdown hidden'; sortDropdown.id = 'sortDropdown';

    const sortLabels = { category: 'Category', completion: 'Completion', text: 'Name', deadline: '📅 Deadline' };
    ['category', 'completion', 'text', 'deadline'].forEach(opt => {
      const el = document.createElement('div');
      el.className = `sort-option ${sortBy === opt ? 'active' : ''}`; el.dataset.sortBy = opt;
      el.innerHTML = `${sortLabels[opt]} <span class="sort-arrow">${sortBy === opt ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</span>`;
      el.addEventListener('click', () => {
        if (sortBy === opt) sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        else { sortBy = opt; sortDirection = 'asc'; }
        updateSortUI(); sortGoals();
      });
      sortDropdown.appendChild(el);
    });

    btn.insertAdjacentElement('afterend', sortDropdown);
    wrapDropdown(btn, sortDropdown);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns(btn);
      sortDropdown.classList.toggle('visible');
      sortDropdown.classList.toggle('hidden');
      btn.classList.toggle('active');
    });
  }

  function updateSortUI() {
    document.querySelectorAll('.sort-option').forEach(opt => {
      const sb = opt.dataset.sortBy; opt.classList.toggle('active', sortBy === sb);
      const arrow = opt.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = sortBy === sb ? (sortDirection === 'asc' ? '↑' : '↓') : '';
    });
  }

  function sortGoals() {
    if (sortBy === 'none') goals.sort((a,b) => a.id - b.id);
    else goals.sort((a,b) => {
      let cmp = 0;
      if (sortBy === 'category') cmp = (a.category||'zzz').localeCompare(b.category||'zzz');
      else if (sortBy === 'completion') cmp = a.completed === b.completed ? 0 : (a.completed ? 1 : -1);
      else if (sortBy === 'text') cmp = a.text.localeCompare(b.text);
      else if (sortBy === 'deadline') {
        const da = a.deadline ? new Date(a.deadline) : new Date('9999-12-31');
        const db = b.deadline ? new Date(b.deadline) : new Date('9999-12-31');
        cmp = da - db;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    saveData(); renderGoals();
  }

  function wrapDropdown(button, dropdown) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;display:inline-block;';
    button.parentNode.insertBefore(wrapper, button);
    wrapper.appendChild(button); wrapper.appendChild(dropdown);
  }

  function closeAllDropdowns(except) {
    const items = [
      { btn: document.getElementById('pickCategoryToggle'), dd: document.getElementById('pickCategoryDropdown') },
      { btn: document.getElementById('sortGoalsBtn'), dd: document.getElementById('sortDropdown') },
      { btn: document.getElementById('filterCategoryBtn'), dd: document.getElementById('filterCategoryDropdown') },
    ];
    items.forEach(item => {
      if (!item.btn || !item.dd) return;
      if (item.btn !== except) {
        item.dd.classList.remove('visible'); item.dd.classList.add('hidden');
        item.btn.classList.remove('active');
      }
    });
  }

  function checkDeadlinesOnLoad() {
    renderDeadlinesTab();
    setInterval(renderDeadlinesTab, 60 * 60 * 1000);
  }

  function init() {
    const addGoalBtn = document.getElementById('addGoalBtn');
    const newGoalInput = document.getElementById('newGoalInput');
    const pickCategoryToggle = document.getElementById('pickCategoryToggle');
    const pickCategoryDropdown = document.getElementById('pickCategoryDropdown');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const filterCategoryBtn = document.getElementById('filterCategoryBtn');
    const filterCategoryDropdown = document.getElementById('filterCategoryDropdown');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const clearAllGoalsBtn = document.getElementById('clearAllGoalsBtn');

    if (!addGoalBtn) return;

    wrapDropdown(pickCategoryToggle, pickCategoryDropdown);
    wrapDropdown(filterCategoryBtn, filterCategoryDropdown);

    addGoalBtn.addEventListener('click', handleAddGoal);
    newGoalInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAddGoal(); });

    pickCategoryToggle.addEventListener('click', (e) => {
      e.stopPropagation(); closeAllDropdowns(pickCategoryToggle);
      pickCategoryDropdown.classList.toggle('visible');
      pickCategoryDropdown.classList.toggle('hidden');
      pickCategoryToggle.classList.toggle('active');
    });

    addCategoryBtn.addEventListener('click', addNewCategory);

    filterCategoryBtn.addEventListener('click', (e) => {
      e.stopPropagation(); closeAllDropdowns(filterCategoryBtn);
      filterCategoryDropdown.classList.toggle('visible');
      filterCategoryDropdown.classList.toggle('hidden');
      filterCategoryBtn.classList.toggle('active');
    });

    clearFiltersBtn.addEventListener('click', () => {
      activeFilters = []; completionFilter = null; noDeadlineFilter = false;
      renderFilterCategories(); renderGoals();
      filterCategoryDropdown.classList.remove('visible'); filterCategoryDropdown.classList.add('hidden');
      filterCategoryBtn.classList.remove('active');
    });

    clearAllGoalsBtn.addEventListener('click', async () => {
      const ok = await showConfirm('Clear all goals? This cannot be undone.');
      if (ok) { goals = []; selectedGoalId = null; saveData(); updateMainProgress(); renderGoals(); renderDeadlinesTab(); }
    });

    document.addEventListener('click', (e) => {
      if (!pickCategoryToggle.contains(e.target) && !pickCategoryDropdown.contains(e.target)) {
        pickCategoryDropdown.classList.remove('visible'); pickCategoryDropdown.classList.add('hidden'); pickCategoryToggle.classList.remove('active');
      }
      if (!filterCategoryBtn.contains(e.target) && !filterCategoryDropdown.contains(e.target)) {
        filterCategoryDropdown.classList.remove('visible'); filterCategoryDropdown.classList.add('hidden'); filterCategoryBtn.classList.remove('active');
      }
      const sd = document.getElementById('sortDropdown');
      const sb = document.getElementById('sortGoalsBtn');
      if (sd && sb && !sb.contains(e.target) && !sd.contains(e.target)) {
        sd.classList.remove('visible'); sd.classList.add('hidden'); sb.classList.remove('active');
      }
    });

    // Wire deadlines view toggle
    document.getElementById('dlViewListBtn')?.addEventListener('click', () => {
      deadlinesView = 'list';
      document.getElementById('dlViewListBtn').classList.add('active');
      document.getElementById('dlViewColBtn').classList.remove('active');
      renderDeadlinesViewContent();
    });
    document.getElementById('dlViewColBtn')?.addEventListener('click', () => {
      deadlinesView = 'column';
      document.getElementById('dlViewColBtn').classList.add('active');
      document.getElementById('dlViewListBtn').classList.remove('active');
      renderDeadlinesViewContent();
    });

    // Wire early shift button
    document.getElementById('dlEarlyShiftBtn')?.addEventListener('click', showEarlyShiftModal);

    initSortDropdown();
    initDeadlineDateToggle();
    checkRecurringGoals();
    renderGoals();
    renderPickCategories();
    renderFilterCategories();
    updateMainProgress();
    checkDeadlinesOnLoad();
    newGoalInput.focus();
  }

  function completeGoalByIndex(goalIndex, subgoalDoneStates) {
    const goal = goals[goalIndex];
    if (!goal) return;
    goal.completed = true;
    if (goal.subgoals && goal.subgoals.length && subgoalDoneStates && subgoalDoneStates.length) {
      goal.subgoals.forEach((sg, i) => {
        if (subgoalDoneStates[i] != null) sg.completed = subgoalDoneStates[i];
      });
    }
    saveData();
  }

  return { init, renderGoals, updateMainProgress, getGoals, getCompletionRate,
           completeGoalByIndex, renderDeadlinesTab, addGoalProgrammatic,
           onCategoryDeleted, renderPickCategories, renderFilterCategories,
           applyPriorityOutlinesToBoard };
})();
