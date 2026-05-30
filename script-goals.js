// =============================================
// GOALS MODULE
// =============================================

const GoalsModule = (function() {

  let goals = JSON.parse(localStorage.getItem('goals')) || [];
  // categories now stored in CategoriesModule; keep local list as names only for legacy
  let selectedCategory = null;
  let selectedGoalId = null;
  let selectedParentId = null;
  let sortBy = 'none';
  let sortDirection = 'asc';
  let activeFilters = [];
  let completionFilter = null;
  let noDeadlineFilter = false;

  function saveData() {
    localStorage.setItem('goals', JSON.stringify(goals));
    // Keep bill board in sync
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

  // ---- Recurring goals — check & reset at day/week boundary ----
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
    goals.push({ id: Date.now() + Math.random(), text, category: category || null, completed: false, subgoals: [], deadline: null });
    saveData(); updateMainProgress(); renderGoals(); renderDeadlinesTab();
  }

  function getGoals() { return goals; }
  function getCompletionRate() {
    if (!goals.length) return 0;
    return Math.round((goals.filter(g => g.completed).length / goals.length) * 100);
  }

  // ---- Deadline urgency helpers ----
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
      const urgency = getDeadlineUrgency(goal.deadline);
      const el = document.createElement('div');
      el.className = `goal-item ${goal.completed ? 'completed' : ''} ${selectedGoalId === goal.id ? 'selected' : ''} ${urgency && !goal.completed ? 'deadline-' + urgency : ''}`;
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
          // Check if overdue
          const isLate = goal.deadline && new Date(goal.deadline + 'T00:00:00') < new Date();
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

      // Recurring badge
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

      // Deadline badge + progress ring on the goal card
      if (goal.deadline && !goal.completed) {
        const badgeWrap = document.createElement('span');
        badgeWrap.style.cssText = 'display:inline-flex;align-items:center;gap:4px;';

        // Progress ring
        const ringWrap = document.createElement('span');
        ringWrap.className = 'deadline-ring-wrap';
        const daysLeft = Math.ceil((new Date(goal.deadline + 'T00:00:00') - new Date()) / 86400000);
        const totalDays = Math.ceil((new Date(goal.deadline + 'T00:00:00') - new Date(goal.id)) / 86400000) || 30;
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
        badge.innerHTML = `📅 ${formatDeadlineDisplay(goal.deadline)} <span class="deadline-days">(${getDeadlineDaysLabel(goal.deadline)})</span>`;
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

      // Inline deadline setter (shown when goal is selected, no deadline yet)
      if (!goal.deadline && !goal.completed) {
        const setDl = document.createElement('div');
        setDl.className = `goal-set-deadline ${selectedGoalId === goal.id ? '' : 'hidden'}`;
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
        el.appendChild(setDl);
      }

      // Recurring toggle (shown when goal is selected)
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

      // Inline "add subgoal" row (shown when goal is selected)
      if (!goal.completed && selectedGoalId === goal.id) {
        const addSubRow = document.createElement('div');
        addSubRow.className = 'goal-add-subgoal-row';
        addSubRow.innerHTML = `
          <input type="text" class="subgoal-inline-input" placeholder="Add a subgoal…" autocomplete="off">
          <button class="subgoal-inline-add">+</button>
        `;
        const subInp = addSubRow.querySelector('.subgoal-inline-input');
        const subAdd = addSubRow.querySelector('.subgoal-inline-add');
        const doAddSubgoal = () => {
          const txt = subInp.value.trim();
          if (!txt) return;
          if (!goal.subgoals) goal.subgoals = [];
          goal.subgoals.push({ id: Date.now().toString(), text: txt, completed: false });
          saveData(); renderGoals();
        };
        subAdd.addEventListener('click', (e) => { e.stopPropagation(); doAddSubgoal(); });
        subInp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.stopPropagation(); doAddSubgoal(); } });
        subInp.addEventListener('click', (e) => e.stopPropagation());
        el.appendChild(addSubRow);
      }

      // Drag handle
      const dragHandle = document.createElement('span');
      dragHandle.className = 'drag-handle';
      dragHandle.innerHTML = '⠿';
      dragHandle.title = 'Drag to reorder';
      el.insertBefore(dragHandle, el.firstChild);

      // Drag-to-reorder
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

    // also refresh parent goal dropdown options if visible
    renderParentGoalDropdown();
  }

  function flashDeadlineCard(goalId) {
    // Wait for deadline tab to re-render then flash
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

  function updateMainProgress() {
    const bar = document.querySelector('.progress');
    const clearBtn = document.getElementById('clearAllGoalsBtn');
    if (!bar) return;
    if (!goals.length) { bar.style.width = '0%'; if (clearBtn) clearBtn.classList.add('hidden'); return; }
    const pct = goals.filter(g => g.completed).length / goals.length * 100;
    bar.style.width = pct + '%';
    const allDone = goals.length > 0 && goals.every(g => g.completed);
    if (clearBtn) { clearBtn.classList.toggle('hidden', !allDone); }
    if (allDone) triggerCelebration();
  }

  // ---- Deadlines tab ----
  function renderDeadlinesTab() {
    renderOverdueNotifications();
    renderUpcomingAlerts();
    renderDeadlinesList();
  }

  function renderOverdueNotifications() {
    const container = document.getElementById('overdueNotifications');
    if (!container) return;
    container.innerHTML = '';
    const overdueGoals = goals.filter(g => !g.completed && getDeadlineUrgency(g.deadline) === 'overdue');
    if (!overdueGoals.length) return;

    overdueGoals.forEach(goal => {
      const card = document.createElement('div');
      card.className = 'overdue-notification-card';
      const today = new Date(); today.setHours(0,0,0,0);
      const dl = new Date(goal.deadline + 'T00:00:00');
      const daysOver = Math.abs(Math.round((dl - today) / (1000 * 60 * 60 * 24)));
      card.innerHTML = `
        <div class="overdue-icon">⏰</div>
        <div class="overdue-body">
          <div class="overdue-title">Deadline passed: <strong>${goal.text}</strong></div>
          <div class="overdue-meta">Was due ${formatDeadlineDisplay(goal.deadline)} · ${daysOver} day${daysOver !== 1 ? 's' : ''} ago</div>
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

  function renderUpcomingAlerts() {
    const container = document.getElementById('upcomingAlerts');
    if (!container) return;
    container.innerHTML = '';
    const alertGoals = goals.filter(g => {
      if (g.completed) return false;
      const u = getDeadlineUrgency(g.deadline);
      return u === 'urgent' || u === 'soon';
    });
    if (!alertGoals.length) return;

    const banner = document.createElement('div');
    banner.className = 'upcoming-alerts-banner';
    banner.innerHTML = `<div class="upcoming-alerts-title">☕ Heads up — goals coming up soon</div>`;
    alertGoals.forEach(g => {
      const row = document.createElement('div');
      row.className = `upcoming-alert-row alert-${getDeadlineUrgency(g.deadline)}`;
      row.innerHTML = `<span class="upcoming-alert-dot"></span><strong>${g.text}</strong><span class="upcoming-alert-when">${getDeadlineDaysLabel(g.deadline)}</span>`;
      banner.appendChild(row);
    });
    container.appendChild(banner);
  }

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
      return new Date(a.deadline) - new Date(b.deadline);
    });

    sorted.forEach(goal => {
      const urgency = getDeadlineUrgency(goal.deadline);
      const card = document.createElement('div');
      card.className = `deadline-card ${goal.completed ? 'completed' : 'deadline-' + urgency}`;
      card.dataset.goalId = goal.id;

      // Build overdue streak pill if applicable
      const overdueStreak = typeof XPModule !== 'undefined' ? XPModule.getOverdueStreak() : 0;
      const overduePill = (urgency === 'overdue' && overdueStreak > 0) ? `
        <div class="overdue-streak-pill" title="You have ${overdueStreak} consecutive overdue goal${overdueStreak > 1 ? 's' : ''} — this reduces your XP gain">
          🔥 ${overdueStreak} overdue streak
          <span class="overdue-streak-xp">−${overdueStreak >= 7 ? 35 : overdueStreak >= 4 ? 20 : overdueStreak >= 2 ? 10 : 5} XP/goal</span>
        </div>` : '';

      const subCount = goal.subgoals ? goal.subgoals.length : 0;
      const subDone = goal.subgoals ? goal.subgoals.filter(s => s.completed).length : 0;

      card.innerHTML = `
        <div class="deadline-card-left">
          <div class="deadline-card-urgency-bar"></div>
          <div class="deadline-card-body">
            <div class="deadline-card-title ${goal.completed ? 'completed' : ''}">${goal.text}</div>
            ${goal.category ? `<span class="goal-category" data-cat="${goal.category}" style="background:${getCategoryColor(goal.category)}22;color:${getCategoryColor(goal.category)};border-color:${getCategoryColor(goal.category)}55">${goal.category}</span>` : ''}
            ${subCount ? `<div class="deadline-card-sub">${subDone}/${subCount} subtasks done</div>` : ''}
            ${overduePill}
          </div>
        </div>
        <div class="deadline-card-right">
          <div class="deadline-card-date">${formatDeadlineDisplay(goal.deadline)}</div>
          <div class="deadline-card-days deadline-days-${urgency}">${goal.completed ? '✓ Done' : getDeadlineDaysLabel(goal.deadline)}</div>
          ${!goal.completed ? `<button class="deadline-card-edit-btn">📅 Edit</button>` : ''}
        </div>`;

      card.querySelector('.deadline-card-edit-btn') && card.querySelector('.deadline-card-edit-btn').addEventListener('click', () => {
        showDatePickerModal(goal, () => { renderGoals(); renderDeadlinesTab(); });
      });

      container.appendChild(card);
    });
  }

  // ---- Goal actions ----
  function addGoal() {
    const input = document.getElementById('newGoalInput');
    const text = input.value.trim();
    if (!text) return;

    const deadlineInput = document.getElementById('newGoalDeadline');
    const deadline = deadlineInput ? deadlineInput.value || null : null;

    // If a parent goal is selected → add as subgoal
    if (selectedParentId) {
      const parent = goals.find(g => g.id === selectedParentId);
      if (parent) {
        if (!parent.subgoals) parent.subgoals = [];
        parent.subgoals.push({ id: Date.now(), text, completed: false, category: parent.category });
        saveData(); renderGoals(); renderDeadlinesTab();
        input.value = '';
        if (deadlineInput) { deadlineInput.value = ''; deadlineInput.classList.add('hidden'); }
        resetParentSelection();
        input.focus();
        return;
      }
    }

    // Normal new goal
    goals.push({ id: Date.now(), text, category: selectedCategory, completed: false, subgoals: [], deadline: deadline });
    saveData(); updateMainProgress(); renderGoals(); renderDeadlinesTab();
    input.value = '';
    if (deadlineInput) { deadlineInput.value = ''; deadlineInput.classList.add('hidden'); }
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

  // ---- Parent goal dropdown ----
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
        // Mark none option
        document.querySelector('.parent-goal-none')?.classList.toggle('active', !selectedParentId);
      });
      list.appendChild(opt);
    });
  }

  function initParentGoalDropdown() {
    const input = document.getElementById('newGoalInput');
    const dropdown = document.getElementById('parentGoalDropdown');
    if (!input || !dropdown) return;

    input.addEventListener('focus', () => {
      renderParentGoalDropdown();
      dropdown.classList.remove('hidden');
    });
    input.addEventListener('input', () => {
      renderParentGoalDropdown();
    });
    input.addEventListener('blur', () => {
      setTimeout(() => dropdown.classList.add('hidden'), 200);
    });

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
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      inp.classList.toggle('hidden');
      if (!inp.classList.contains('hidden')) inp.focus();
    });
    inp.addEventListener('click', (e) => e.stopPropagation());
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

    // Suggestion D: no-deadline filter
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
    // Redirect to Categories tab
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

    initSortDropdown();
    initParentGoalDropdown();
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

  return { init, renderGoals, updateMainProgress, getGoals, getCompletionRate, completeGoalByIndex, renderDeadlinesTab, addGoalProgrammatic, onCategoryDeleted, renderPickCategories, renderFilterCategories };
})();
