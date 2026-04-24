// =============================================
// TIMER MODULE
// =============================================
const TimerModule = (function() {

  let timerHours = 0, timerMinutes = 25, timerSeconds = 0;
  let totalSeconds = 0, remainingSeconds = 0;
  let timerRunning = false, timerInterval = null;
  let elapsedSeconds = 0;
  let configHours = 0, configMinutes = 25, configSeconds = 0;
  let selectedGoal = null; // { text, subgoals: [{text, done}] }

  // ---- Motivational quotes for timer end ----
  const MOTIVATIONAL_QUOTES = [
    { text: "You didn't come this far to only come this far.", author: "" },
    { text: "One more push. The finish line is closer than you think.", author: "" },
    { text: "Tired means you're trying. Keep going.", author: "" },
    { text: "The difference between done and not done is just a little more time.", author: "" },
    { text: "You've already done the hard part — starting. Finish what you began.", author: "" },
    { text: "Small steps still move you forward. Keep stepping.", author: "" },
    { text: "Progress is progress, no matter how small. Add more time.", author: "" },
    { text: "The best time to finish was yesterday. The second best time is now.", author: "" },
    { text: "Champions keep going when they have nothing left.", author: "" },
    { text: "A little more coffee and a little more focus — you've got this. ☕", author: "" },
  ];

  // ---- Progress Quotes ----
  const PROGRESS_QUOTES = [
    { pct: 0,   text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { pct: 10,  text: "Push yourself, because no one else is going to do it for you.", author: "" },
    { pct: 20,  text: "Great things never come from comfort zones.", author: "" },
    { pct: 30,  text: "Dream it. Wish it. Do it. The hustle is real.", author: "" },
    { pct: 40,  text: "Success doesn't just find you. You have to go out and get it.", author: "" },
    { pct: 50,  text: "Halfway there — keep the fire burning. You're doing great.", author: "" },
    { pct: 60,  text: "Don't stop when you're tired. Stop when you're done.", author: "" },
    { pct: 70,  text: "Your future is created by what you do today, not tomorrow.", author: "" },
    { pct: 80,  text: "Almost there. Every extra minute now compounds forever.", author: "" },
    { pct: 90,  text: "The last 10% is what separates the good from the great.", author: "" },
    { pct: 100, text: "Session complete! Hard work always pays off. ☕", author: "" },
  ];

  let lastQuoteMilestone = -1;

  // ---- Soft chime (Web Audio) ----
  function playSoftChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Soft bowl-like chime: gentle sine waves, low volume, slow fade
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startT = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, startT);
        gain.gain.linearRampToValueAtTime(0.15, startT + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 1.8);
        osc.start(startT);
        osc.stop(startT + 1.8);
      });
    } catch(e) {}
  }

  // ---- Goal picker ----
  function populateGoalPicker() {
    const list = document.getElementById('goalPickerList');
    const nextBtn = document.getElementById('goalPickerNextBtn');
    if (!list) return;

    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    if (!goals.length) {
      list.innerHTML = '<p class="goal-picker-empty">No goals yet — add one on the Goals tab first!</p>';
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    list.innerHTML = '';
    goals.forEach((goal, i) => {
      const item = document.createElement('div');
      item.className = 'goal-picker-item';
      item.innerHTML = `<span class="goal-picker-text">${goal.text}</span>
        ${goal.subgoals?.length ? `<span class="goal-picker-sub">${goal.subgoals.length} subtask${goal.subgoals.length !== 1 ? 's' : ''}</span>` : ''}`;
      item.addEventListener('click', () => {
        document.querySelectorAll('.goal-picker-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        selectedGoal = {
          index: i,
          text: goal.text,
          subgoals: (goal.subgoals || []).map(s => ({ text: s.text || s, done: s.done || false }))
        };
        if (nextBtn) nextBtn.disabled = false;
        const preview = document.getElementById('selectedGoalPreview');
        if (preview) preview.textContent = '🎯 ' + goal.text;
      });
      list.appendChild(item);
    });
  }

  // ---- Render focused goal on timer page ----
  function renderFocusGoal() {
    const titleEl = document.getElementById('focusGoalTitle');
    const subgoalsEl = document.getElementById('focusSubgoals');
    if (!titleEl) return;

    if (!selectedGoal) {
      titleEl.textContent = 'No goal selected';
      if (subgoalsEl) subgoalsEl.innerHTML = '';
      return;
    }

    titleEl.textContent = selectedGoal.text;
    if (!subgoalsEl) return;
    subgoalsEl.innerHTML = '';

    if (!selectedGoal.subgoals?.length) {
      subgoalsEl.innerHTML = '<p class="no-subgoals">No subtasks — just focus and finish! 💪</p>';
      return;
    }

    selectedGoal.subgoals.forEach((sub, i) => {
      const item = document.createElement('div');
      item.className = 'focus-subgoal-item' + (sub.done ? ' done' : '');
      item.innerHTML = `<label class="focus-subgoal-label">
        <input type="checkbox" class="focus-subgoal-check" ${sub.done ? 'checked' : ''}>
        <span>${sub.text}</span>
      </label>`;
      item.querySelector('input').addEventListener('change', (e) => {
        selectedGoal.subgoals[i].done = e.target.checked;
        item.classList.toggle('done', e.target.checked);
        checkAllSubgoalsDone();
      });
      subgoalsEl.appendChild(item);
    });
  }

  function checkAllSubgoalsDone() {
    if (!selectedGoal?.subgoals?.length) return;
    const allDone = selectedGoal.subgoals.every(s => s.done);
    if (allDone) triggerGoalComplete();
  }

  function triggerGoalComplete() {
    clearInterval(timerInterval); timerRunning = false;
    const btn = document.getElementById('startPauseBtn');
    if (btn) { btn.textContent = '▶ Start'; btn.classList.remove('pause'); }
    playSoftChime();
    triggerCelebration();
    showGoalCompleteModal();
  }

  function showGoalCompleteModal() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(40,22,10,0.72);z-index:10000;display:flex;align-items:center;justify-content:center;';
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:rgba(245,241,235,0.98);border-radius:20px;padding:2.5rem;max-width:440px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);border:2px solid rgba(139,111,71,0.3);text-align:center;';
    dialog.innerHTML = `
      <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:#4a3429;margin-bottom:0.5rem;">Goal Complete!</h2>
      <p style="font-family:'Playfair Display',serif;font-size:1.1rem;color:#6b5139;margin-bottom:1.5rem;font-style:italic;">"${selectedGoal?.text || 'Your goal'}"</p>
      <p style="font-family:'Source Sans Pro',sans-serif;color:#8b6f47;margin-bottom:2rem;">Amazing work! You crushed it. ☕</p>
      <button id="goalCompleteOk" style="background:linear-gradient(135deg,#8b6f47,#6b5139);color:#f5f1eb;border:none;padding:14px 32px;border-radius:14px;font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(139,111,71,0.4);">Back to Goals ☕</button>`;
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    document.getElementById('goalCompleteOk').addEventListener('click', () => {
      document.body.removeChild(modal);
      hideTimerPage();
    });
  }

  // ---- Timer end modal (goal not done) ----
  function showTimerEndModal() {
    playSoftChime();
    const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(40,22,10,0.72);z-index:10000;display:flex;align-items:center;justify-content:center;';
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:rgba(245,241,235,0.98);border-radius:20px;padding:2.5rem;max-width:460px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);border:2px solid rgba(139,111,71,0.3);text-align:center;';
    dialog.innerHTML = `
      <div style="font-size:2.5rem;margin-bottom:1rem;">⏰</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:#4a3429;margin-bottom:1rem;">Time's Up!</h2>
      <p style="font-family:'Playfair Display',serif;font-size:1.1rem;color:#6b5139;font-style:italic;margin-bottom:0.5rem;">"${quote.text}"</p>
      <p style="font-family:'Source Sans Pro',sans-serif;font-size:0.85rem;color:rgba(107,81,57,0.7);margin-bottom:2rem;">Still working on: <strong>${selectedGoal?.text || 'your goal'}</strong></p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button id="timerEndMoreTime" style="background:linear-gradient(135deg,#8b6f47,#6b5139);color:#f5f1eb;border:none;padding:12px 24px;border-radius:12px;font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(139,111,71,0.4);">+ Add More Time</button>
        <button id="timerEndDone" style="background:rgba(245,241,235,0.8);color:#6b5139;border:2px solid rgba(139,111,71,0.3);padding:12px 24px;border-radius:12px;font-family:'Playfair Display',serif;font-size:1rem;cursor:pointer;">I'm Done ✓</button>
      </div>`;
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    document.getElementById('timerEndMoreTime').addEventListener('click', () => {
      document.body.removeChild(modal);
      // Re-open config overlay on step 2 (keep same goal)
      const overlay = document.getElementById('timerConfirmOverlay');
      const saved = loadTimerData();
      configHours = saved.hours ?? 0;
      configMinutes = saved.minutes ?? 25;
      configSeconds = saved.seconds ?? 0;
      updateConfigDisplay();
      showConfigStep(2);
      overlay?.classList.remove('hidden');
    });

    document.getElementById('timerEndDone').addEventListener('click', () => {
      document.body.removeChild(modal);
      triggerCelebration();
      showGoalCompleteModal();
    });
  }

  // ---- Config overlay steps ----
  function showConfigStep(step) {
    document.getElementById('configStep1')?.classList.toggle('hidden', step !== 1);
    document.getElementById('configStep2')?.classList.toggle('hidden', step !== 2);
  }

  function updateProgressQuote(pct) {
    const textEl = document.getElementById('progressQuoteText');
    const milestoneEl = document.getElementById('progressQuoteMilestone');
    const box = document.getElementById('progressQuoteBox');
    if (!textEl) return;
    const milestone = Math.floor(pct / 10) * 10;
    if (milestone === lastQuoteMilestone) return;
    lastQuoteMilestone = milestone;
    const entry = PROGRESS_QUOTES.find(q => q.pct === milestone) || PROGRESS_QUOTES[0];
    if (box) box.classList.add('quote-fade-out');
    setTimeout(() => {
      textEl.textContent = '"' + entry.text + '"';
      if (milestoneEl) milestoneEl.textContent = entry.author ? '— ' + entry.author : milestone + '% complete';
      if (box) { box.classList.remove('quote-fade-out'); box.classList.add('quote-fade-in'); }
      setTimeout(() => { if (box) box.classList.remove('quote-fade-in'); }, 600);
    }, 300);
  }

  function saveTimerData(h, m, s) {
    localStorage.setItem('timerData', JSON.stringify({ hours: h, minutes: m, seconds: s }));
  }

  function loadTimerData() {
    const saved = JSON.parse(localStorage.getItem('timerData'));
    if (saved && ('seconds' in saved)) return saved;
    return { hours: 0, minutes: 25, seconds: 0 };
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateTimerDisplay() {
    const h = document.getElementById('timerHours');
    const m = document.getElementById('timerMinutes');
    const s = document.getElementById('timerSeconds');
    if (h) h.textContent = pad(timerHours);
    if (m) m.textContent = pad(timerMinutes);
    if (s) s.textContent = pad(timerSeconds);
  }

  function updateTimerProgress() {
    const fill = document.getElementById('timerProgressFill');
    const pctEl = document.getElementById('progressPctDisplay');
    const elapsed = document.getElementById('elapsedDisplay');
    if (!fill) return;
    if (totalSeconds > 0) {
      const pct = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
      fill.style.width = pct + '%';
      if (pctEl) pctEl.textContent = Math.round(pct) + '%';
      updateProgressQuote(pct);
    } else {
      fill.style.width = '0%';
      if (pctEl) pctEl.textContent = '0%';
    }
    if (elapsed) {
      const e = totalSeconds - remainingSeconds;
      const eh = Math.floor(e / 3600), em = Math.floor((e % 3600) / 60), es = e % 60;
      elapsed.textContent = eh > 0 ? (pad(eh)+':'+pad(em)+':'+pad(es)) : (pad(em)+':'+pad(es));
    }
  }

  function updateSessionGoalDisplay() {
    const el = document.getElementById('sessionGoalDisplay');
    if (!el) return;
    const d = loadTimerData();
    const total = d.hours * 3600 + d.minutes * 60 + d.seconds;
    if (!total) { el.textContent = '—'; return; }
    el.textContent = d.hours > 0 ? (pad(d.hours)+':'+pad(d.minutes)+':'+pad(d.seconds)) : (pad(d.minutes)+':'+pad(d.seconds));
  }

  function updateConfigDisplay() {
    const h = document.getElementById('configHours');
    const m = document.getElementById('configMinutes');
    const s = document.getElementById('configSeconds');
    if (h) h.textContent = pad(configHours);
    if (m) m.textContent = pad(configMinutes);
    if (s) s.textContent = pad(configSeconds);
  }

  function initConfigOverlay() {
    const overlay = document.getElementById('timerConfirmOverlay');
    const cup = document.getElementById('coffeeCup');
    if (!overlay || !cup) return;

    cup.addEventListener('click', () => {
      const saved = loadTimerData();
      configHours = saved.hours ?? 0;
      configMinutes = saved.minutes ?? 25;
      configSeconds = saved.seconds ?? 0;
      updateConfigDisplay();
      selectedGoal = null;
      populateGoalPicker();
      showConfigStep(1);
      overlay.classList.remove('hidden');
    });

    // Step 1 → Step 2
    document.getElementById('goalPickerNextBtn')?.addEventListener('click', () => {
      if (!selectedGoal) return;
      showConfigStep(2);
    });
    document.getElementById('goalPickerCancelBtn')?.addEventListener('click', () => overlay.classList.add('hidden'));

    // Step 2 → Start
    document.getElementById('confirmStartBtn')?.addEventListener('click', () => {
      saveTimerData(configHours, configMinutes, configSeconds);
      cup.classList.add('latte');
      overlay.classList.add('hidden');
      showTimerPage();
    });
    document.getElementById('confirmBackBtn')?.addEventListener('click', () => showConfigStep(1));

    // Time adjustment buttons
    overlay.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.dataset.target;
        const isUp = btn.classList.contains('up');
        if (target === 'hours')   configHours   = isUp ? Math.min(configHours + 1, 23)   : Math.max(configHours - 1, 0);
        if (target === 'minutes') configMinutes = isUp ? Math.min(configMinutes + 1, 59) : Math.max(configMinutes - 1, 0);
        if (target === 'seconds') configSeconds = isUp ? Math.min(configSeconds + 1, 59) : Math.max(configSeconds - 1, 0);
        updateConfigDisplay();
      });
    });

    ['configHours','configMinutes','configSeconds'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function() {
        let val = this.textContent.replace(/\D/g,'');
        if (val.length > 2) val = val.slice(0,2);
        if (val === '') val = '0';
        let num = parseInt(val, 10);
        const max = id === 'configHours' ? 23 : 59;
        if (num > max) num = max;
        this.textContent = pad(num);
        if (id === 'configHours') configHours = num;
        else if (id === 'configMinutes') configMinutes = num;
        else configSeconds = num;
      });
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { this.blur(); e.preventDefault(); }
        if (!/[\d]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault();
      });
      el.addEventListener('blur', function() {
        let val = this.textContent.replace(/\D/g,'');
        if (val === '') val = '0';
        let num = parseInt(val, 10);
        const max = id === 'configHours' ? 23 : 59;
        if (num > max) num = max;
        this.textContent = pad(num);
        if (id === 'configHours') configHours = num;
        else if (id === 'configMinutes') configMinutes = num;
        else configSeconds = num;
      });
    });
  }

  function showTimerPage() {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('timerPage').classList.remove('hidden');
    const saved = loadTimerData();
    timerHours = saved.hours ?? 0;
    timerMinutes = saved.minutes ?? 0;
    timerSeconds = saved.seconds ?? 0;
    totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    remainingSeconds = totalSeconds;
    elapsedSeconds = 0;
    lastQuoteMilestone = -1;
    const textEl = document.getElementById('progressQuoteText');
    const milestoneEl = document.getElementById('progressQuoteMilestone');
    if (textEl) textEl.textContent = '"The secret of getting ahead is getting started."';
    if (milestoneEl) milestoneEl.textContent = '— Mark Twain';
    updateTimerDisplay();
    updateTimerProgress();
    updateSessionGoalDisplay();
    renderFocusGoal();
    MusicModule.loadPlaylist();
  }

  function hideTimerPage() {
    document.getElementById('timerPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    if (timerRunning) { clearInterval(timerInterval); timerRunning = false; }
    MusicModule.stopAllAudio();
    const btn = document.getElementById('startPauseBtn');
    if (btn) { btn.textContent = '▶ Start'; btn.classList.remove('pause'); }
  }

  function toggleTimer() {
    const btn = document.getElementById('startPauseBtn');
    if (!timerRunning) {
      if (remainingSeconds <= 0) { showCustomAlert('Timer is at zero — reset it first.'); return; }
      timerRunning = true;
      if (btn) { btn.textContent = '⏸ Pause'; btn.classList.add('pause'); }
      timerInterval = setInterval(() => {
        remainingSeconds--;
        if (remainingSeconds < 0) {
          clearInterval(timerInterval); timerRunning = false;
          if (btn) { btn.textContent = '▶ Start'; btn.classList.remove('pause'); }
          onTimerComplete(); return;
        }
        timerHours = Math.floor(remainingSeconds / 3600);
        timerMinutes = Math.floor((remainingSeconds % 3600) / 60);
        timerSeconds = remainingSeconds % 60;
        updateTimerDisplay(); updateTimerProgress();
      }, 1000);
    } else {
      clearInterval(timerInterval); timerRunning = false;
      if (btn) { btn.textContent = '▶ Start'; btn.classList.remove('pause'); }
    }
  }

  function resetTimer() {
    clearInterval(timerInterval); timerRunning = false;
    lastQuoteMilestone = -1;
    const btn = document.getElementById('startPauseBtn');
    if (btn) { btn.textContent = '▶ Start'; btn.classList.remove('pause'); }
    const saved = loadTimerData();
    timerHours = saved.hours ?? 0; timerMinutes = saved.minutes ?? 0; timerSeconds = saved.seconds ?? 0;
    totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    remainingSeconds = totalSeconds;
    const fill = document.getElementById('timerProgressFill');
    if (fill) fill.style.width = '0%';
    const pctEl = document.getElementById('progressPctDisplay');
    if (pctEl) pctEl.textContent = '0%';
    const elapsed = document.getElementById('elapsedDisplay');
    if (elapsed) elapsed.textContent = '00:00';
    document.getElementById('timerPage')?.classList.remove('timer-complete');
    const textEl = document.getElementById('progressQuoteText');
    const milestoneEl = document.getElementById('progressQuoteMilestone');
    if (textEl) textEl.textContent = '"The secret of getting ahead is getting started."';
    if (milestoneEl) milestoneEl.textContent = '— Mark Twain';
    updateTimerDisplay(); updateTimerProgress();
  }

  function onTimerComplete() {
    updateProgressQuote(100);
    const tp = document.getElementById('timerPage');
    if (tp) { tp.classList.add('timer-complete'); setTimeout(() => tp.classList.remove('timer-complete'), 3000); }
    // Check if goal is done
    if (selectedGoal?.subgoals?.length && selectedGoal.subgoals.every(s => s.done)) {
      triggerGoalComplete();
    } else {
      showTimerEndModal();
    }
  }

  function init() {
    initConfigOverlay();
    document.getElementById('backToGoals')?.addEventListener('click', hideTimerPage);
    document.getElementById('startPauseBtn')?.addEventListener('click', toggleTimer);
    document.getElementById('resetBtn')?.addEventListener('click', resetTimer);
    document.getElementById('focusGoalDoneBtn')?.addEventListener('click', () => {
      triggerGoalComplete();
    });
  }

  return { init, showTimerPage, hideTimerPage };
})();
