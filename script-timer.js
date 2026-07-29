// =============================================
// TIMER MODULE
// =============================================
const TimerModule = (function() {

  let timerHours = 0, timerMinutes = 25, timerSeconds = 0;
  let totalSeconds = 0, remainingSeconds = 0;
  let timerRunning = false, timerInterval = null;
  let elapsedSeconds = 0;
  let sessionStatsRecorded = false;
  let configHours = 0, configMinutes = 25, configSeconds = 0;
  let selectedGoal = null;
  let popOutWindow = null;

  // Pomodoro state
  let pomodoroMode = false;
  const POMO_WORK = 25 * 60;   // 25 min
  const POMO_BREAK = 5 * 60;   //  5 min
  const POMO_CYCLES = 4;
  let pomoCurrentCycle = 1;     // 1-based
  let pomoIsWork = true;        // true = work phase

  // ---- Sync key for pop-out ----
  const SYNC_KEY = 'letsfocus_timer_sync';

  function broadcastState(extra) {
    try {
      localStorage.setItem(SYNC_KEY, JSON.stringify({
        remaining: remainingSeconds,
        total: totalSeconds,
        running: timerRunning,
        h: timerHours, m: timerMinutes, s: timerSeconds,
        ts: Date.now(),
        ...extra
      }));
    } catch(e) {}
  }

  // ---- Motivational quotes ----
  const MOTIVATIONAL_QUOTES = [
    { text: "You didn't come this far to only come this far." },
    { text: "One more push. The finish line is closer than you think." },
    { text: "Tired means you're trying. Keep going." },
    { text: "The difference between done and not done is just a little more time." },
    { text: "You've already done the hard part — starting. Finish what you began." },
    { text: "Small steps still move you forward. Keep stepping." },
    { text: "Progress is progress, no matter how small. Add more time." },
    { text: "The best time to finish was yesterday. The second best time is now." },
    { text: "Champions keep going when they have nothing left." },
    { text: "A little more coffee and a little more focus — you've got this. ☕" },
  ];

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

  // ---- Audio ----
  function playSoftChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = 'sine';
        const t = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
        osc.start(t); osc.stop(t + 1.8);
      });
    } catch(e) {}
  }

  // ---- Goal picker ----
  function populateGoalPicker() {
    const list = document.getElementById('goalPickerList');
    const nextBtn = document.getElementById('goalPickerNextBtn');
    if (!list) return;
    const goals = (typeof GoalsModule !== 'undefined') ? GoalsModule.getGoals() : (JSON.parse(localStorage.getItem('goals')) || []);
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
        selectedGoal = { index: i, text: goal.text, category: goal.category || null, subgoals: (goal.subgoals || []).map(s => ({ text: s.text || s, done: s.completed || false })) };
        if (nextBtn) nextBtn.disabled = false;
        const preview = document.getElementById('selectedGoalPreview');
        if (preview) preview.textContent = '🎯 ' + goal.text;
      });
      list.appendChild(item);
    });
  }

  function renderFocusGoal() {
    const titleEl = document.getElementById('focusGoalTitle');
    const subgoalsEl = document.getElementById('focusSubgoals');
    if (!titleEl) return;
    if (!selectedGoal) { titleEl.textContent = 'No goal selected'; if (subgoalsEl) subgoalsEl.innerHTML = ''; return; }
    titleEl.textContent = selectedGoal.text;
    if (!subgoalsEl) return;
    subgoalsEl.innerHTML = '';
    if (!selectedGoal.subgoals?.length) {
      subgoalsEl.innerHTML = '<p class="no-subgoals">No subtasks — just focus and finish! 💪</p>'; return;
    }
    selectedGoal.subgoals.forEach((sub, i) => {
      const item = document.createElement('div');
      item.className = 'focus-subgoal-item' + (sub.done ? ' done' : '');
      item.innerHTML = `<label class="focus-subgoal-label"><input type="checkbox" class="focus-subgoal-check" ${sub.done ? 'checked' : ''}><span>${sub.text}</span></label>`;
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
    if (selectedGoal.subgoals.every(s => s.done)) triggerGoalComplete();
  }

  function triggerGoalComplete() {
    clearInterval(timerInterval); timerRunning = false;
    broadcastState({ action: 'complete' });
    const btn = document.getElementById('startPauseBtn');
    if (btn) { btn.textContent = '▶ Start'; btn.classList.remove('pause'); }
    // Record stats if not already done (handles mid-session goal completion path)
    if (!sessionStatsRecorded) {
      sessionStatsRecorded = true;
      if (typeof StatsModule !== 'undefined') StatsModule.recordSession(elapsedSeconds, selectedGoal?.text || '');
      if (typeof XPModule !== 'undefined') XPModule.onSessionComplete(elapsedSeconds, false, selectedGoal?.text || '');
      if (typeof DrinkShelfModule !== 'undefined') DrinkShelfModule.addCup(elapsedSeconds);
    }
    if (selectedGoal?.index != null) GoalsModule.completeGoalByIndex(selectedGoal.index, selectedGoal.subgoals?.map(s => s.done) || []);
    playSoftChime(); showGoalCompleteModal();
  }

  function showGoalCompleteModal() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(40,22,10,0.72);z-index:10000;display:flex;align-items:center;justify-content:center;';
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:rgba(245,241,235,0.98);border-radius:20px;padding:2.5rem;max-width:440px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);border:2px solid rgba(139,111,71,0.3);text-align:center;';
    dialog.innerHTML = `<div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:#4a3429;margin-bottom:0.5rem;">Goal Complete!</h2>
      <p style="font-family:'Playfair Display',serif;font-size:1.1rem;color:#6b5139;margin-bottom:1.5rem;font-style:italic;">"${selectedGoal?.text || 'Your goal'}"</p>
      <p style="font-family:'Source Sans Pro',sans-serif;color:#8b6f47;margin-bottom:2rem;">Amazing work! You crushed it. ☕</p>
      <button id="goalCompleteOk" style="background:linear-gradient(135deg,#8b6f47,#6b5139);color:#f5f1eb;border:none;padding:14px 32px;border-radius:14px;font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:600;cursor:pointer;">Back to Goals ☕</button>`;
    modal.appendChild(dialog); document.body.appendChild(modal);
    document.getElementById('goalCompleteOk').addEventListener('click', () => { document.body.removeChild(modal); hideTimerPage(); });
  }

  function showTimerEndModal(skipXPAndStats = false) {
    playSoftChime();
    // Record stats + XP once — guarded so Pomodoro path (which calls us with skipXPAndStats=true)
    // and mid-session completions never double-count.
    if (!skipXPAndStats && !sessionStatsRecorded) {
      sessionStatsRecorded = true;
      if (typeof StatsModule !== 'undefined') StatsModule.recordSession(elapsedSeconds, selectedGoal?.text || '');
      if (typeof XPModule !== 'undefined') XPModule.onSessionComplete(elapsedSeconds, false, selectedGoal?.text || '');
      if (typeof DrinkShelfModule !== 'undefined') DrinkShelfModule.addCup(elapsedSeconds);
    }
    const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(40,22,10,0.72);z-index:10000;display:flex;align-items:center;justify-content:center;';
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:rgba(245,241,235,0.98);border-radius:20px;padding:2.5rem;max-width:460px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.4);border:2px solid rgba(139,111,71,0.3);text-align:center;';
    dialog.innerHTML = `<div style="font-size:2.5rem;margin-bottom:1rem;">⏰</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:#4a3429;margin-bottom:1rem;">Time's Up!</h2>
      <p style="font-family:'Playfair Display',serif;font-size:1.1rem;color:#6b5139;font-style:italic;margin-bottom:0.5rem;">"${quote.text}"</p>
      <p style="font-family:'Source Sans Pro',sans-serif;font-size:0.85rem;color:rgba(107,81,57,0.7);margin-bottom:2rem;">Still working on: <strong>${selectedGoal?.text || 'your goal'}</strong></p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button id="timerEndMoreTime" style="background:linear-gradient(135deg,#8b6f47,#6b5139);color:#f5f1eb;border:none;padding:12px 24px;border-radius:12px;font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;cursor:pointer;">+ Add More Time</button>
        <button id="timerEndDone" style="background:rgba(245,241,235,0.8);color:#6b5139;border:2px solid rgba(139,111,71,0.3);padding:12px 24px;border-radius:12px;font-family:'Playfair Display',serif;font-size:1rem;cursor:pointer;">I'm Done ✓</button>
      </div>`;
    modal.appendChild(dialog); document.body.appendChild(modal);
    document.getElementById('timerEndMoreTime').addEventListener('click', () => {
      document.body.removeChild(modal);
      const overlay = document.getElementById('timerConfirmOverlay');
      const saved = loadTimerData();
      configHours = saved.hours ?? 0; configMinutes = saved.minutes ?? 25; configSeconds = saved.seconds ?? 0;
      updateSegmentDisplay(); showConfigStep(2); overlay?.classList.remove('hidden');
    });
    document.getElementById('timerEndDone').addEventListener('click', () => { document.body.removeChild(modal); triggerGoalComplete(); });
  }

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

  function saveTimerData(h, m, s) { localStorage.setItem('timerData', JSON.stringify({ hours: h, minutes: m, seconds: s })); }
  function loadTimerData() {
    const saved = JSON.parse(localStorage.getItem('timerData'));
    return (saved && 'seconds' in saved) ? saved : { hours: 0, minutes: 25, seconds: 0 };
  }
  function pad(n) { return String(n).padStart(2, '0'); }

  function updateTimerDisplay() {
    const h = document.getElementById('timerHours'), m = document.getElementById('timerMinutes'), s = document.getElementById('timerSeconds');
    if (h) h.textContent = pad(timerHours);
    if (m) m.textContent = pad(timerMinutes);
    if (s) s.textContent = pad(timerSeconds);
    broadcastState();
  }

  function updateTimerProgress() {
    const fill = document.getElementById('timerProgressFill'), pctEl = document.getElementById('progressPctDisplay'), elapsed = document.getElementById('elapsedDisplay');
    if (!fill) return;
    if (totalSeconds > 0) {
      const pct = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
      fill.style.width = pct + '%';
      if (pctEl) pctEl.textContent = Math.round(pct) + '%';
      updateProgressQuote(pct);
      // Update drink progress
      if (typeof DrinkModule !== 'undefined') DrinkModule.onProgressUpdate(pct);
    } else { fill.style.width = '0%'; if (pctEl) pctEl.textContent = '0%'; }
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

  // ============================================================
  // SEGMENTED INPUT (Desktop HH : MM : SS boxes)
  // ============================================================
  const segState = { hours: 0, minutes: 25, seconds: 0 };
  const segBuffer = { hours: '', minutes: '', seconds: '' };
  const segOrder = ['hours', 'minutes', 'seconds'];
  const segIds = { hours: 'segHours', minutes: 'segMinutes', seconds: 'segSeconds' };
  const segMax = { hours: 23, minutes: 59, seconds: 59 };

  function updateSegmentDisplay() {
    Object.keys(segIds).forEach(k => {
      const el = document.getElementById(segIds[k]);
      if (el) el.textContent = pad(segState[k]);
    });
    configHours = segState.hours; configMinutes = segState.minutes; configSeconds = segState.seconds;
  }

  function focusSegment(key) {
    Object.keys(segIds).forEach(k => {
      const el = document.getElementById(segIds[k]);
      if (el) el.classList.toggle('active', k === key);
    });
    segBuffer[key] = '';
    document.getElementById(segIds[key])?.focus();
  }

  function blurAllSegments() {
    Object.keys(segIds).forEach(k => {
      const el = document.getElementById(segIds[k]);
      if (el) el.classList.remove('active');
    });
  }

  function commitSegmentBuffer(key) {
    if (segBuffer[key] !== '') {
      let val = parseInt(segBuffer[key], 10);
      if (isNaN(val)) val = 0;
      if (val > segMax[key]) val = segMax[key];
      segState[key] = val;
      segBuffer[key] = '';
      updateSegmentDisplay();
    }
  }

  function initSegmentedInput() {
    segOrder.forEach((key, idx) => {
      const el = document.getElementById(segIds[key]);
      if (!el) return;

      el.addEventListener('click', (e) => { e.stopPropagation(); focusSegment(key); });
      el.addEventListener('focus', () => { focusSegment(key); });
      el.addEventListener('blur', () => { commitSegmentBuffer(key); blurAllSegments(); });

      el.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
          e.preventDefault();
          segBuffer[key] += e.key;
          // Show partial entry
          const partial = parseInt(segBuffer[key], 10);
          el.textContent = pad(Math.min(partial, segMax[key]));

          // Auto-advance after 2 digits or if adding another digit would exceed max
          const twoDigits = segBuffer[key].length >= 2;
          const wouldExceed = segBuffer[key].length === 1 && parseInt(e.key, 10) > Math.floor(segMax[key] / 10);
          if (twoDigits || wouldExceed) {
            commitSegmentBuffer(key);
            const next = segOrder[idx + 1];
            if (next) { setTimeout(() => focusSegment(next), 0); }
            else blurAllSegments();
          }
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          if (segBuffer[key].length > 0) {
            segBuffer[key] = segBuffer[key].slice(0, -1);
            el.textContent = segBuffer[key] === '' ? pad(segState[key]) : pad(parseInt(segBuffer[key] || '0', 10));
          } else {
            const prev = segOrder[idx - 1];
            if (prev) { commitSegmentBuffer(key); setTimeout(() => focusSegment(prev), 0); }
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          commitSegmentBuffer(key);
          const target = e.shiftKey ? segOrder[idx - 1] : segOrder[idx + 1];
          if (target) setTimeout(() => focusSegment(target), 0);
          else blurAllSegments();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          segState[key] = Math.min(segState[key] + 1, segMax[key]);
          updateSegmentDisplay();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          segState[key] = Math.max(segState[key] - 1, 0);
          updateSegmentDisplay();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          commitSegmentBuffer(key);
          blurAllSegments();
          document.getElementById('confirmStartBtn')?.click();
        }
      });
    });

    // Click outside → blur
    document.addEventListener('click', (e) => {
      if (!['segHours','segMinutes','segSeconds'].some(id => document.getElementById(id)?.contains(e.target))) {
        segOrder.forEach(k => commitSegmentBuffer(k));
        blurAllSegments();
      }
    });
  }

  function syncSegmentsFromConfig() {
    segState.hours = configHours; segState.minutes = configMinutes; segState.seconds = configSeconds;
    updateSegmentDisplay();
  }

  // ============================================================
  // SCROLL WHEEL (Touch/iPad)
  // ============================================================
  function buildScrollWheel(wheelEl) {
    const target = wheelEl.dataset.target;
    const max = parseInt(wheelEl.dataset.max, 10);
    wheelEl.innerHTML = '';
    wheelEl.style.cssText = 'height:180px;overflow:hidden;position:relative;cursor:grab;user-select:none;';

    const drum = document.createElement('div');
    drum.className = 'scroll-wheel-drum';
    drum.style.cssText = 'position:absolute;top:0;left:0;width:100%;transition:transform 0.15s ease;';

    const itemH = 44;
    const visibleCount = 5; // items visible at once, center is selected

    // Populate with looping items (3 full cycles for infinite feel)
    const totalItems = max + 1;
    for (let rep = 0; rep < 3; rep++) {
      for (let i = 0; i <= max; i++) {
        const item = document.createElement('div');
        item.className = 'scroll-wheel-item';
        item.textContent = pad(i);
        item.style.cssText = `height:${itemH}px;line-height:${itemH}px;text-align:center;font-family:'Courier New',monospace;font-size:2rem;font-weight:bold;color:rgba(212,165,116,0.5);transition:color 0.2s,font-size 0.2s;`;
        drum.appendChild(item);
      }
    }
    wheelEl.appendChild(drum);

    // Selected highlight overlay
    const highlight = document.createElement('div');
    highlight.style.cssText = `position:absolute;top:${(Math.floor(visibleCount/2))*itemH}px;left:0;width:100%;height:${itemH}px;border-top:2px solid rgba(212,165,116,0.6);border-bottom:2px solid rgba(212,165,116,0.6);pointer-events:none;background:rgba(212,165,116,0.08);`;
    wheelEl.appendChild(highlight);

    // Current value from segState
    let currentVal = segState[target] || 0;
    // Start drum at middle cycle
    let offset = -(currentVal + totalItems) * itemH + Math.floor(visibleCount / 2) * itemH;
    drum.style.transform = `translateY(${offset}px)`;
    updateWheelItems(drum, currentVal, totalItems, max, itemH);

    function setVal(v) {
      let val = ((v % (max + 1)) + (max + 1)) % (max + 1);
      segState[target] = val;
      configHours = segState.hours; configMinutes = segState.minutes; configSeconds = segState.seconds;
      updateWheelItems(drum, val, totalItems, max, itemH);
    }

    // Snap to nearest value
    function snapToNearest() {
      const centerOffset = Math.floor(visibleCount / 2) * itemH;
      const rawIndex = (-offset + centerOffset) / itemH;
      const snappedIndex = Math.round(rawIndex);
      const val = ((snappedIndex % (max + 1)) + (max + 1)) % (max + 1);
      const newOffset = -(snappedIndex) * itemH + centerOffset;

      // Keep in middle cycle range to allow looping
      const midStart = -totalItems * itemH + centerOffset;
      const midEnd = -(totalItems * 2 + max) * itemH + centerOffset;
      let finalIndex = snappedIndex;
      if (newOffset > midStart + itemH * (max + 1)) finalIndex += totalItems;
      if (newOffset < midEnd - itemH * (max + 1)) finalIndex -= totalItems;

      offset = -finalIndex * itemH + centerOffset;
      drum.style.transition = 'transform 0.25s cubic-bezier(0.25,0.1,0.25,1)';
      drum.style.transform = `translateY(${offset}px)`;
      setVal(finalIndex);
    }

    // Touch events
    let startY = 0, startOffset = 0, lastY = 0, velocity = 0, lastTime = 0, isDragging = false;

    wheelEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDragging = true;
      startY = e.touches[0].clientY;
      startOffset = offset;
      lastY = startY; lastTime = Date.now(); velocity = 0;
      drum.style.transition = 'none';
    }, { passive: false });

    wheelEl.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!isDragging) return;
      const now = Date.now();
      const dy = e.touches[0].clientY - lastY;
      velocity = dy / (now - lastTime + 1);
      lastY = e.touches[0].clientY;
      lastTime = now;
      offset = startOffset + (e.touches[0].clientY - startY);
      drum.style.transform = `translateY(${offset}px)`;
    }, { passive: false });

    wheelEl.addEventListener('touchend', () => {
      isDragging = false;
      // Apply momentum
      offset += velocity * 80;
      snapToNearest();
    });

    // Mouse wheel for desktop testing
    wheelEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      drum.style.transition = 'none';
      offset -= e.deltaY * 0.5;
      drum.style.transform = `translateY(${offset}px)`;
      clearTimeout(wheelEl._snapTimer);
      wheelEl._snapTimer = setTimeout(snapToNearest, 150);
    }, { passive: false });
  }

  function updateWheelItems(drum, currentVal, totalItems, max, itemH) {
    Array.from(drum.children).forEach((item, i) => {
      const v = i % (max + 1);
      const isCenter = v === currentVal;
      item.style.color = isCenter ? '#d4a574' : 'rgba(212,165,116,0.4)';
      item.style.fontSize = isCenter ? '2.2rem' : '1.7rem';
      item.style.fontWeight = isCenter ? 'bold' : 'normal';
    });
  }

  function initScrollWheels() {
    ['wheelHours', 'wheelMinutes', 'wheelSeconds'].forEach(id => {
      const el = document.getElementById(id);
      if (el) buildScrollWheel(el);
    });
  }

  function syncWheelsFromConfig() {
    // Rebuild wheels with current config values
    initScrollWheels();
  }

  // ---- Detect touch device for input mode ----
  function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
  }

  function initInputMode() {
    const desktop = document.querySelector('.timer-config-desktop');
    const touch = document.querySelector('.timer-config-touch');
    if (!desktop || !touch) return;
    if (isTouchDevice() || window.innerWidth <= 1024) {
      desktop.classList.add('hidden');
      touch.classList.remove('hidden');
      initScrollWheels();
    } else {
      desktop.classList.remove('hidden');
      touch.classList.add('hidden');
      initSegmentedInput();
    }
    // Also listen for resize to switch modes
    window.addEventListener('resize', () => {
      const nowTouch = isTouchDevice() || window.innerWidth <= 1024;
      if (nowTouch) { desktop.classList.add('hidden'); touch.classList.remove('hidden'); }
      else { desktop.classList.remove('hidden'); touch.classList.add('hidden'); }
    });
  }

  // ============================================================
  // POP-OUT WINDOW
  // ============================================================

  // Simplified live drink cup SVG for the pop-out window.
  // IMPORTANT: this must stay a pure, self-contained function (only using its
  // own params + Math/Array/JSON) — its source is reused verbatim inside the
  // pop-out's own <script> via buildPoCupSVG.toString(), since the pop-out is
  // a separate document with no access to this module or script-drink.js.
  // ---- Pop-out cup renderer — mirrors renderCup()'s structure/art using the
  // rich visual snapshot broadcast by DrinkModule.getCurrentDrinkVisual().
  // MUST stay fully self-contained: this function is serialized via
  // .toString() into the pop-out's own <script>, a separate document with
  // no access to anything outside its own body — every helper it needs has
  // to be nested inside it, not a sibling function in this file.
  function buildPoCupSVG(dv, pct) {
    if (!dv) {
      return `<svg width="96" height="112" viewBox="0 0 150 175" xmlns="http://www.w3.org/2000/svg">
        <text x="75" y="90" text-anchor="middle" font-family="Source Sans Pro,sans-serif" font-size="11" fill="rgba(212,165,116,0.4)">No drink yet</text>
      </svg>`;
    }
    const p = Math.max(0, Math.min(100, pct || 0));

    // Same "looks continuous across re-renders" trick as the main cup's ao():
    // offsets an infinite animation's start point by current real time so it
    // doesn't visibly restart from frame 0 every tick (this SVG is rebuilt
    // fresh every second).
    function ao(dur) { return `-${((Date.now() / 1000) % dur).toFixed(2)}s`; }

    // ---- Birthday Cake bypasses the normal cup entirely — same as the main
    // page's buildBirthdayCakeLiveSVG. Ported verbatim (same tier geometry,
    // same fixed drizzle drops — intentionally NOT randomized, this one stays
    // exactly as designed). Only needs (pct, tier); nothing else from dv.
    if (dv.type === 'birthday_cake') {
      const cx = 75, eH = 8;
      const t1 = { cx, by: 155, h: 35, w: 92 };
      const t2 = { cx, by: 120, h: 32, w: 70 };
      const t3 = { cx, by: 88,  h: 30, w: 50 };
      function pf(start, end) { if (p < start) return 0; return Math.min(1, (p - start) / (end - start)); }
      const f1 = pf(0, 20), f2 = pf(20, 50), f3 = pf(50, 70);
      const drizzPh = pf(70, 85);
      const showFrost = p >= 85 && f3 > 0.80, showSprink = p >= 94 && f3 > 0.90, showCandle = p >= 98;
      const bodyC = ['#2c1005','#321208','#2a0e04'], topC = ['#3d1808','#421a0a','#3a1608'], rimC = '#8b4020', drizzC = '#1a0600';
      function buildTier(t, frac, bodyFill, topFill) {
        if (frac <= 0) return '';
        const h = t.h * frac, hw = t.w / 2, topY = t.by - h, op = Math.min(1, frac * 3).toFixed(2);
        const b1Y = topY + h * 0.35, b2Y = topY + h * 0.68;
        const bands = frac > 0.50 ? `<line x1="${(t.cx-hw+2).toFixed(1)}" y1="${b1Y.toFixed(1)}" x2="${(t.cx+hw-2).toFixed(1)}" y2="${b1Y.toFixed(1)}" stroke="rgba(255,220,180,0.16)" stroke-width="1.2"/><line x1="${(t.cx-hw+2).toFixed(1)}" y1="${b2Y.toFixed(1)}" x2="${(t.cx+hw-2).toFixed(1)}" y2="${b2Y.toFixed(1)}" stroke="rgba(255,220,180,0.11)" stroke-width="0.9"/>` : '';
        return `<ellipse cx="${t.cx}" cy="${t.by}" rx="${(hw+4).toFixed(1)}" ry="${(eH*0.55).toFixed(1)}" fill="rgba(0,0,0,0.20)" opacity="${op}"/>
          <rect x="${(t.cx-hw).toFixed(1)}" y="${topY.toFixed(1)}" width="${t.w}" height="${h.toFixed(1)}" fill="${bodyFill}" opacity="${op}"/>
          ${bands}
          <rect x="${(t.cx-hw).toFixed(1)}" y="${topY.toFixed(1)}" width="6" height="${h.toFixed(1)}" fill="rgba(255,255,255,0.07)" opacity="${op}"/>
          <rect x="${(t.cx+hw-6).toFixed(1)}" y="${topY.toFixed(1)}" width="6" height="${h.toFixed(1)}" fill="rgba(0,0,0,0.18)" opacity="${op}"/>
          <ellipse cx="${t.cx}" cy="${topY.toFixed(1)}" rx="${hw}" ry="${eH}" fill="${topFill}" opacity="${op}"/>
          <ellipse cx="${t.cx}" cy="${topY.toFixed(1)}" rx="${hw}" ry="${eH}" fill="none" stroke="${rimC}" stroke-width="1.3" opacity="${(Math.min(1, parseFloat(op))*0.55).toFixed(2)}"/>`;
      }
      function buildDrizzle(t, frac, phase) {
        if (frac < 0.90 || phase <= 0) return '';
        const hw = t.w / 2, topY = t.by - t.h * frac, op = phase.toFixed(2);
        const drops = [{dx:-hw*0.76,len:16,wob:2},{dx:-hw*0.42,len:11,wob:-2},{dx:-hw*0.10,len:18,wob:3},{dx:hw*0.22,len:12,wob:-2},{dx:hw*0.56,len:16,wob:3},{dx:hw*0.82,len:10,wob:-3}];
        return drops.map(({dx,len,wob}) => {
          const x = t.cx + dx, y0 = topY + eH - 1;
          const cp1x=(x+wob*0.3).toFixed(1), cp1y=(y0+len*0.3).toFixed(1), cp2x=(x+wob*0.7).toFixed(1), cp2y=(y0+len*0.7).toFixed(1), ex=(x+wob).toFixed(1), ey=(y0+len).toFixed(1);
          return `<path d="M${x.toFixed(1)},${y0.toFixed(1)} C${cp1x},${cp1y} ${cp2x},${cp2y} ${ex},${ey}" stroke="${drizzC}" stroke-width="3.8" fill="none" stroke-linecap="round" opacity="${(parseFloat(op)*0.88).toFixed(2)}"/><circle cx="${ex}" cy="${(parseFloat(ey)+2.2).toFixed(1)}" r="2.4" fill="${drizzC}" opacity="${(parseFloat(op)*0.75).toFixed(2)}"/>`;
        }).join('');
      }
      const tier1SVG = buildTier(t1, f1, bodyC[0], topC[0]), tier2SVG = buildTier(t2, f2, bodyC[1], topC[1]), tier3SVG = buildTier(t3, f3, bodyC[2], topC[2]);
      const drizzle1 = buildDrizzle(t1, f1, drizzPh), drizzle2 = buildDrizzle(t2, f2, drizzPh), drizzle3 = buildDrizzle(t3, f3, drizzPh);
      const frostSVG = showFrost ? `<ellipse cx="${t3.cx}" cy="${(t3.by-t3.h).toFixed(1)}" rx="${(t3.w/2-2).toFixed(1)}" ry="${eH-1}" fill="#f8f2ec" opacity="0.93"/><ellipse cx="${t3.cx}" cy="${(t3.by-t3.h).toFixed(1)}" rx="${(t3.w/2-6).toFixed(1)}" ry="${(eH-2.5).toFixed(1)}" fill="rgba(255,255,255,0.30)"/>` : '';
      const curlSVG = showFrost ? (() => {
        const ty = t3.by - t3.h - eH + 1;
        function curl(ox, oy, dir) { return `<path d="M${(cx+ox).toFixed(1)},${(ty+oy).toFixed(1)} C${(cx+ox+dir*5).toFixed(1)},${(ty+oy-7).toFixed(1)} ${(cx+ox+dir*11).toFixed(1)},${(ty+oy-5).toFixed(1)} ${(cx+ox+dir*8).toFixed(1)},${(ty+oy+2).toFixed(1)}" stroke="#3d1808" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.86"/>`; }
        return curl(-11,0,1)+curl(0,-4,-1)+curl(11,1,1)+curl(-5,-8,1)+curl(6,-7,-1);
      })() : '';
      const spCols = ['#ff3b3b','#ff9900','#ffe033','#33cc44','#3399ff','#cc44ff','#ff66aa'];
      const sprSVG = showSprink ? (() => {
        const ty = t3.by - t3.h - eH + 3, hw2 = t3.w / 2 - 6;
        return [[-hw2*0.8,0,30,spCols[0]],[-hw2*0.4,-2,-20,spCols[1]],[0,1,55,spCols[2]],[hw2*0.4,-1,-40,spCols[3]],[hw2*0.8,0,25,spCols[4]],[-hw2*0.6,3,70,spCols[5]],[hw2*0.2,-3,-60,spCols[6]]]
          .map(([dx,dy,a,c]) => { const x=cx+dx, y=ty+dy; return `<rect x="${(x-4.5).toFixed(1)}" y="${(y-1.2).toFixed(1)}" width="9" height="2.4" rx="1.2" fill="${c}" transform="rotate(${a},${x.toFixed(1)},${y.toFixed(1)})" opacity="0.90"/>`; }).join('');
      })() : '';
      const candleSVG = showCandle ? (() => {
        const cy3 = t3.by - t3.h - eH - 2;
        return `<rect x="${(cx-3).toFixed(1)}" y="${(cy3-20).toFixed(1)}" width="6" height="17" rx="3" fill="#f8b4d9"/>
          <path d="M${(cx-3).toFixed(1)},${(cy3-13).toFixed(1)} Q${(cx-4).toFixed(1)},${(cy3-9).toFixed(1)} ${(cx-2).toFixed(1)},${(cy3-6).toFixed(1)}" stroke="#f8d7ea" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.65"/>
          <ellipse cx="${cx}" cy="${(cy3-26).toFixed(1)}" rx="4.5" ry="7" fill="#ffb700" opacity="0.92"/>
          <ellipse cx="${cx}" cy="${(cy3-25).toFixed(1)}" rx="2.8" ry="4.5" fill="#fff0a0" opacity="0.88"/>
          <ellipse cx="${cx}" cy="${(cy3-25.5).toFixed(1)}" rx="1.4" ry="2.5" fill="#ffffff" opacity="0.72"/>`;
      })() : '';
      const plateSVG = f1 > 0 ? `<ellipse cx="${cx}" cy="${(t1.by+7).toFixed(1)}" rx="${(t1.w/2+9).toFixed(1)}" ry="8" fill="#e8ddd0" opacity="${Math.min(0.90,f1*4).toFixed(2)}"/><ellipse cx="${cx}" cy="${(t1.by+7).toFixed(1)}" rx="${(t1.w/2+9).toFixed(1)}" ry="8" fill="none" stroke="#c4a882" stroke-width="1.1" opacity="${Math.min(0.60,f1*2.5).toFixed(2)}"/>` : '';
      const tierBadge = dv.tier && dv.tier !== 'house' ? `<text x="145" y="16" text-anchor="end" font-family="Source Sans Pro,sans-serif" font-size="7.5" font-weight="700" fill="${dv.tier === 'mastercraft' ? '#fbbf24' : 'rgba(212,165,116,0.9)'}">${dv.tier === 'mastercraft' ? '👑 MASTER' : '✦ SIG'}</text>` : '';
      const pctText = p > 15 ? `<text x="${cx}" y="${(t1.by-9).toFixed(1)}" text-anchor="middle" font-family="Playfair Display,serif" font-size="13" font-weight="600" fill="rgba(255,255,255,0.88)">${Math.round(p)}%</text>` : '';
      const cakeSparkles = p >= 100 ? `<text x="18" y="20" font-size="12" style="animation:poSparkle 1.6s ease-in-out infinite ${ao(1.6)}">✨</text><text x="118" y="16" font-size="10" style="animation:poSparkle 2.0s ease-in-out infinite ${ao(2.0)}">⭐</text><text x="70" y="10" font-size="9" style="animation:poSparkle 1.3s ease-in-out infinite ${ao(1.3)}">✦</text>` : '';
      return `<svg width="96" height="112" viewBox="0 0 150 175" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        ${tierBadge}
        <ellipse cx="${cx}" cy="${(t1.by+10).toFixed(1)}" rx="56" ry="8" fill="rgba(0,0,0,0.15)"/>
        ${plateSVG}${tier1SVG}${drizzle1}${tier2SVG}${drizzle2}${tier3SVG}${drizzle3}${frostSVG}${curlSVG}${sprSVG}${candleSVG}${pctText}${cakeSparkles}
      </svg>`;
    }

    const CX = 20, CW = 100, CTY = 30, CBY = 155;
    const fillH = Math.max(0, (p / 100) * (CBY - CTY - 20));
    const fillY = CBY - fillH;
    const lc  = dv.liquidColor  || '#8b6f47';
    const lc2 = dv.liquidColor2 || lc;
    const cupTint = dv.cupTint || '#8b6f47';
    const isCold = !!(dv.hasIce || dv.bobas);

    function wavePath(y, amp, flipPhase) {
      const x0 = CX + 4, x1 = CX + CW - 4, mid = (x0 + x1) / 2;
      const a = flipPhase ? -amp : amp;
      return `M${x0},${y} Q${(x0+mid)/2},${y-a} ${mid},${y} Q${(mid+x1)/2},${y+a} ${x1},${y} L${x1},${CBY} L${x0},${CBY} Z`;
    }

    // ---- organic bezier drizzle (same math as buildOrgDrizzle on the main page) ----
    function orgDrizzle(streams, opacity) {
      return streams.map(({ x0, y0, color, width, len, wobX }) => {
        const cp1x = (x0 + wobX * 0.3).toFixed(1), cp1y = (y0 + len * 0.28).toFixed(1);
        const cp2x = (x0 + wobX * 0.75).toFixed(1), cp2y = (y0 + len * 0.68).toFixed(1);
        const ex   = (x0 + wobX).toFixed(1),          ey   = (y0 + len).toFixed(1);
        return `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} C${cp1x},${cp1y} ${cp2x},${cp2y} ${ex},${ey}"
          stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" opacity="${opacity}"/>`;
      }).join('');
    }
    function drizzleFromLayout(layout, color, y0base, dropH, opacity) {
      if (!layout || !layout.length) return '';
      const streams = layout.map(({ xFrac, y0Jit, widthPx, lenFrac, wobX }) => ({
        x0: CX + xFrac * CW, y0: y0base + y0Jit, color, width: widthPx, len: dropH * lenFrac, wobX,
      }));
      return orgDrizzle(streams, opacity);
    }

    // ---- boba — same session-seeded layout as the main cup, same shake-burst-then-float ----
    function bobaSVG(layout, sessionStartTs, bottomY, color) {
      if (!layout || !layout.length) return '';
      const elapsed = sessionStartTs ? (Date.now() - sessionStartTs) : 99999;
      const inBurst = elapsed >= 0 && elapsed < 1200;
      return layout.map(({ dx, offsetFromBottom, dur, burstDur, burstDelay }) => {
        const bx = CX + dx, by = bottomY - offsetFromBottom;
        if (by <= fillY + 4) return '';
        const anim = inBurst
          ? `poBobaBurst ${burstDur}s cubic-bezier(.36,.07,.19,.97) ${burstDelay}s 1 both`
          : `poBoba ${dur}s ease-in-out infinite ${ao(dur)}`;
        return `<g style="animation:${anim};transform-origin:${bx.toFixed(1)}px ${by.toFixed(1)}px">
          <circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="5" fill="${color}" opacity="0.9"/>
          <circle cx="${(bx-1).toFixed(1)}" cy="${(by-1).toFixed(1)}" r="1.5" fill="rgba(255,255,255,0.2)"/>
        </g>`;
      }).join('');
    }

    // ---- floating ice cubes (idle bob, same visual language as boba) ----
    function iceFloatSVG() {
      const cubes = [
        { x: CX+12, y: fillY+5, w:18, h:12, anim:'poIce1', dur:3.0 },
        { x: CX+42, y: fillY+9, w:15, h:10, anim:'poIce2', dur:3.8 },
        { x: CX+68, y: fillY+4, w:18, h:12, anim:'poIce3', dur:3.2 },
      ];
      return cubes.map(({x,y,w,h,anim,dur}) => `<g style="animation:${anim} ${dur}s ease-in-out infinite ${ao(dur)}">
        <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" rx="3" fill="rgba(210,240,255,0.70)" stroke="rgba(180,220,255,0.5)" stroke-width="1"/>
      </g>`).join('');
    }

    // ---- 3D walls (generic light/dark overlay — works across every drink
    // without needing the full per-type color table the main page uses) ----
    function wallsSVG() {
      const WT = 8, WB = 5;
      const lt = isCold ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.20)';
      const dk = isCold ? 'rgba(0,0,0,0.14)'        : 'rgba(0,0,0,0.24)';
      const lWall  = `${CX},${CTY} ${CX+WT},${CTY} ${CX+8+WB},${CBY} ${CX+8},${CBY}`;
      const rWall  = `${CX+CW-WT},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+CW-8-WB},${CBY}`;
      const botBar = `${CX+8},${CBY-4} ${CX+CW-8},${CBY-4} ${CX+CW-8},${CBY} ${CX+8},${CBY}`;
      return `<polygon points="${lWall}" fill="${lt}"/><polygon points="${rWall}" fill="${dk}"/><polygon points="${botBar}" fill="${dk}"/>`;
    }

    // ---- 3D rim ----
    function rimSVG() {
      const cx = CX + CW / 2, rx = CW / 2 + 5, ry = 7;
      const rimFill = isCold ? 'rgba(220,240,255,0.28)' : cupTint;
      return `<ellipse cx="${cx}" cy="${CTY}" rx="${rx}" ry="${ry}" fill="${rimFill}" opacity="${isCold ? 1 : 0.88}"/>
        <ellipse cx="${cx}" cy="${CTY+1}" rx="${rx-12}" ry="${ry-2.5}" fill="rgba(0,0,0,0.22)"/>
        <ellipse cx="${cx-8}" cy="${CTY-1.5}" rx="${rx*0.55}" ry="${ry*0.38}" fill="rgba(255,255,255,0.32)"/>`;
    }

    // ---- small left-wall icon, keyed by drink type ----
    function decorSVG() {
      const lx = CX + 4, midY = (CTY + CBY) / 2 + 10, op = 0.20;
      switch (dv.type) {
        case 'coffee': return `<g opacity="${op}"><ellipse cx="${lx+6}" cy="${midY}" rx="4" ry="6" fill="${cupTint}" transform="rotate(-20,${lx+6},${midY})"/></g>`;
        case 'matcha': return `<g opacity="${op}"><path d="M${lx+6},${midY+7} C${lx+2},${midY-5} ${lx+11},${midY-12} ${lx+9},${midY+3} S${lx+4},${midY+12} ${lx+6},${midY+7}" fill="${cupTint}"/></g>`;
        case 'milktea': return [[lx+6,midY-14],[lx+5,midY],[lx+7,midY+13]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${cupTint}" opacity="${op}"/>`).join('');
        case 'chamomile': return `<g opacity="${op}" transform="translate(${lx+6},${midY})">${[0,60,120,180,240,300].map(a => { const r = a*Math.PI/180; const px=(Math.cos(r)*5).toFixed(1), py=(Math.sin(r)*5).toFixed(1); return `<ellipse cx="${px}" cy="${py}" rx="2" ry="3.4" fill="${cupTint}" transform="rotate(${a},${px},${py})"/>`; }).join('')}<circle r="1.8" fill="rgba(255,220,80,0.8)"/></g>`;
        case 'smoothie': case 'lemonade': case 'oj': return `<g opacity="${op}"><circle cx="${lx+6}" cy="${midY}" r="7" fill="${cupTint}"/></g>`;
        default: return '';
      }
    }

    // ---- foam — by explicit shape flag first, generic fallback otherwise ----
    // (accepts an override color so recipe-driven foamFill100 can take precedence)
    function foamSVG(colorOverride) {
      const fc = colorOverride || dv.foamColor;
      if (!fc || p < 5) return '';
      const cx = CX + CW / 2;
      if (dv.thickFoam) return `<ellipse cx="${cx}" cy="${fillY}" rx="${CW*0.44}" ry="10" fill="${fc}" opacity="0.95"/><ellipse cx="${cx-12}" cy="${fillY-2}" rx="9" ry="6" fill="${fc}" opacity="0.75"/><ellipse cx="${cx+13}" cy="${fillY-1}" rx="8" ry="5.5" fill="${fc}" opacity="0.78"/>`;
      if (dv.spotFoam)  return `<ellipse cx="${cx}" cy="${fillY+1}" rx="${CW*0.22}" ry="5" fill="${fc}" opacity="0.82"/>`;
      if (dv.whipCream) return `<ellipse cx="${cx}" cy="${fillY-2}" rx="${CW*0.38}" ry="9" fill="${fc}" opacity="0.95"/><ellipse cx="${cx}" cy="${fillY-6}" rx="${CW*0.26}" ry="6" fill="${fc}" opacity="0.90"/>`;
      return `<ellipse cx="${cx}" cy="${fillY+2}" rx="${CW*0.42}" ry="7" fill="${fc}" opacity="0.88"/><ellipse cx="${cx-12}" cy="${fillY}" rx="9" ry="5.5" fill="${fc}" opacity="0.68"/><ellipse cx="${cx+13}" cy="${fillY+1}" rx="8" ry="5" fill="${fc}" opacity="0.70"/>`;
    }

    // ---- steam (non-cold drinks only, before completion) ----
    function steamSVG() {
      if (isCold || p <= 0 || p >= 100) return '';
      const sc = 'rgba(220,195,165,0.5)';
      return `<path d="M${CX+16},${CTY-3} C${CX+13},${CTY-13} ${CX+19},${CTY-20} ${CX+15},${CTY-29}" stroke="${sc}" stroke-width="2.2" fill="none" stroke-linecap="round" style="animation:poSteam 2.5s ease-out infinite ${ao(2.5)}"/>
        <path d="${'M'+(CX+CW/2)+','+(CTY-6)+' C'+(CX+CW/2-3)+','+(CTY-16)+' '+(CX+CW/2+4)+','+(CTY-23)+' '+(CX+CW/2-1)+','+(CTY-33)}" stroke="${sc}" stroke-width="2.2" fill="none" stroke-linecap="round" style="animation:poSteam 2.8s ease-out infinite ${ao(2.8)}"/>`;
    }

    // ---- condensation (cold drinks only) — a couple of drops, kept light ----
    function condensationSVG() {
      if (!isCold || p < 30) return '';
      const lx = CX - 1, rx = CX + CW + 1;
      return `<ellipse cx="${lx}" cy="${(CTY+60).toFixed(1)}" rx="1.1" ry="2.6" fill="rgba(200,228,248,0.5)" style="animation:poDropL 3.4s ease-in-out infinite ${ao(3.4)}"/>
        <ellipse cx="${rx}" cy="${(CTY+90).toFixed(1)}" rx="1.1" ry="2.6" fill="rgba(200,228,248,0.5)" style="animation:poDropR 3.9s ease-in-out infinite ${ao(3.9)}"/>`;
    }

    // ---- Void — cosmic star field + orbit rings (ported from buildLiquid's
    // dedicated `type === 'void'` branch; pure pct-driven, no recipe data needed) ----
    function voidLiquidSVG() {
      const wSpd = 10, wOff1 = ao(wSpd), wP1 = wavePath(fillY, 1, false);
      const starSeeds = [
        [36,135,1.2,1.5],[62,88,0.9,2.2],[78,148,1.5,1.8],[44,72,1.0,2.5],
        [97,118,1.2,1.2],[112,84,0.9,2.0],[54,140,1.4,1.6],[88,96,1.1,1.9],
        [72,62,0.8,2.3],[104,143,1.5,1.4],[32,104,1.0,2.1],[118,112,1.2,1.7],
        [58,76,0.9,2.4],[92,132,1.3,1.5],[48,118,1.1,2.0],[108,68,0.8,1.9],
        [68,148,1.4,1.3],[82,78,1.0,2.2],[114,98,0.9,2.6],[40,90,1.1,1.4],
      ];
      const starCount = Math.floor(3 + (p / 100) * 17);
      const stars = starSeeds.slice(0, Math.min(starCount, starSeeds.length)).map(([sx,sy,sr,sdur]) => {
        const sy2 = Math.max(fillY + 6, Math.min(CBY - 6, sy));
        return `<circle cx="${sx}" cy="${sy2}" r="${sr}" fill="rgba(255,255,255,${(0.2 + Math.min(0.6, p/150)).toFixed(2)})" style="animation:voidStar ${sdur}s ease-in-out infinite ${ao(sdur)}"/>`;
      }).join('');
      const orbitY = fillY + 7, orbitRx = CW * 0.42, ocx = CX + CW / 2;
      return `<rect x="${CX-1}" y="${fillY.toFixed(1)}" width="${CW+2}" height="${(CBY-fillY+5).toFixed(1)}" fill="url(#poLiqGrad)" opacity="0.96"/>
        <rect x="${CX-1}" y="${fillY.toFixed(1)}" width="${CW+2}" height="${(CBY-fillY+5).toFixed(1)}" fill="rgba(50,15,90,0.18)"/>
        <path d="${wP1}" fill="rgba(70,25,110,0.50)" style="animation:poWaveMove 10s ease-in-out infinite ${wOff1}"/>
        ${stars}
        ${p > 25 ? `<ellipse cx="${ocx.toFixed(1)}" cy="${orbitY.toFixed(1)}" rx="${orbitRx.toFixed(1)}" ry="5" fill="none" stroke="rgba(212,165,8,0.65)" stroke-width="1.8" stroke-dasharray="32 200" style="animation:voidOrbitOuter 7s linear infinite ${ao(7)}"/>` : ''}
        ${p > 60 ? `<ellipse cx="${ocx.toFixed(1)}" cy="${(orbitY+4).toFixed(1)}" rx="${(orbitRx*0.62).toFixed(1)}" ry="3.5" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2" stroke-dasharray="20 125" style="animation:voidOrbitInner 11s linear infinite ${ao(11)}"/>` : ''}`;
    }

    // ---- Aurora — northern-lights color bands (ported from buildLiquid's
    // dedicated `type === 'aurora'` branch) ----
    function auroraLiquidSVG() {
      const wSpd = 5, wOff1 = ao(wSpd), wOff2 = ao(wSpd*1.3);
      const wP1 = wavePath(fillY, 2, false), wP2 = wavePath(fillY, 2, true);
      const band1Ph = Math.min(1, p/40), band2Ph = Math.min(1, Math.max(0,(p-28)/42)), band3Ph = Math.min(1, Math.max(0,(p-55)/38));
      const aCX = CX + CW/2, y1 = fillY+fillH*0.45, y2 = fillY+fillH*0.62, y3 = fillY+fillH*0.28;
      return `<rect x="${CX-1}" y="${fillY.toFixed(1)}" width="${CW+2}" height="${(CBY-fillY+5).toFixed(1)}" fill="url(#poLiqGrad)" opacity="0.92"/>
        <path d="${wP2}" fill="${lc2}" opacity="0.35" style="animation:poWaveMove ${(wSpd*1.3).toFixed(1)}s ease-in-out infinite ${wOff2};transform-box:fill-box"/>
        <path d="${wP1}" fill="rgba(30,40,100,0.55)" style="animation:poWaveMove ${wSpd}s ease-in-out infinite ${wOff1};transform-box:fill-box"/>
        ${band1Ph > 0.03 ? `<ellipse cx="${aCX.toFixed(1)}" cy="${y1.toFixed(1)}" rx="${(CW*0.42).toFixed(1)}" ry="${Math.max(5,fillH*0.16).toFixed(1)}" fill="rgba(167,139,250,${(band1Ph*0.32).toFixed(2)})" style="animation:auroraFlow 9s ease-in-out infinite ${ao(9)}"/>` : ''}
        ${band2Ph > 0.03 ? `<ellipse cx="${aCX.toFixed(1)}" cy="${y2.toFixed(1)}" rx="${(CW*0.40).toFixed(1)}" ry="${Math.max(4,fillH*0.14).toFixed(1)}" fill="rgba(34,211,238,${(band2Ph*0.30).toFixed(2)})" style="animation:auroraFlow 12s ease-in-out infinite reverse ${ao(12)}"/>` : ''}
        ${band3Ph > 0.03 ? `<ellipse cx="${aCX.toFixed(1)}" cy="${y3.toFixed(1)}" rx="${(CW*0.38).toFixed(1)}" ry="${Math.max(4,fillH*0.13).toFixed(1)}" fill="rgba(52,211,153,${(band3Ph*0.26).toFixed(2)})" style="animation:auroraFlow 7s ease-in-out infinite ${ao(7)}"/>` : ''}
        ${p > 55 ? iceFloatSVG() : ''}`;
    }

    // ---- ice (generic, non-void/aurora drinks) ----
    const iceSVG = (dv.hasIce && p >= 20 && dv.type !== 'aurora') ? iceFloatSVG() : '';

    // ---- boba (session-seeded, shake-burst then idle float — see bobaSVG) ----
    const bottomY = fillY + fillH;
    const bobasSVG = (dv.bobas && p > 0) ? bobaSVG(dv.bobaLayout, dv.sessionStartTs, bottomY, dv.bobaColor || '#2a1a0a') : '';

    // ---- drizzle — wall (caramel_mac/dalgona @100%), choc (flag, @90%+), recipe-marker (boba/lavender mastercraft) ----
    const WALL_DRIZZLE_COLOR = { caramel_mac: '#b45309', dalgona: '#8a4a10' };
    const wallDrizzleSVG = (p >= 100 && WALL_DRIZZLE_COLOR[dv.type])
      ? drizzleFromLayout(dv.wallDrizzleLayout, WALL_DRIZZLE_COLOR[dv.type], CTY + 2, (CBY - CTY) * 0.78, 0.78) : '';
    const chocDrizzleSVG = (dv.chocDrizzle && p >= 90)
      ? drizzleFromLayout(dv.chocDrizzleLayout, '#2a0d00', fillY - 2, Math.min((CBY - fillY) * 0.90, 90), 0.82) : '';
    const recipeDrizzleSVG = (dv.recipeDrizzle && p >= dv.recipeDrizzle.thresholdPct)
      ? drizzleFromLayout(dv.recipeDrizzleLayout, dv.recipeDrizzle.color, CTY + 2, (CBY - CTY) * 0.72, 0.75) : '';

    // ---- recipe tier-step data — fill/foam overrides + cumulative mid-fill
    // artwork (Galaxy Cold Brew's nebula, Void's singularity rings, espresso's
    // crema evolution, etc.), generically for ANY drink that has a recipe tier ----
    function resolveStep() {
      let chosen = null;
      (dv.tierSteps || []).forEach(s => { if (p >= s.threshold) chosen = s; });
      return chosen;
    }
    const stepCfg = resolveStep();
    const liquidFillOverride = (stepCfg && stepCfg.fill && stepCfg.fill !== 'transparent') ? stepCfg.fill : null;
    const foamOverride = (p >= 100 && dv.foamFill100 && dv.foamFill100 !== 'transparent') ? dv.foamFill100 : null;
    let recipeContentIn = '', recipeContentOut = '';
    (dv.tierSteps || []).forEach(s => {
      if (p < s.threshold || !s.svgContent) return;
      if (s.svgContentOutside) recipeContentOut += s.svgContent; else recipeContentIn += s.svgContent;
    });

    // ---- crema ring / petal flecks / 100%-garnish passthrough (verbatim main-page art) ----
    const cremaSVG = (dv.cremaRing && p >= 90)
      ? `<ellipse cx="${CX+CW/2}" cy="${fillY+2}" rx="${CW*0.36}" ry="5" fill="none" stroke="rgba(200,145,60,0.75)" stroke-width="2.5"/><ellipse cx="${CX+CW/2}" cy="${fillY+2}" rx="${CW*0.22}" ry="3" fill="rgba(185,130,50,0.35)"/>` : '';
    const petalSVG = (dv.petalFlecks && p >= 90)
      ? `<ellipse cx="${CX+22}" cy="${fillY-1}" rx="3.5" ry="1.5" fill="rgba(255,160,200,0.65)" transform="rotate(-20,${CX+22},${fillY-1})"/><ellipse cx="${CX+66}" cy="${fillY-2}" rx="2.8" ry="1.1" fill="rgba(255,150,195,0.55)" transform="rotate(-10,${CX+66},${fillY-2})"/>` : '';
    const garnishSVG = (p >= 100 && dv.garnishSvg100) ? dv.garnishSvg100 : '';

    // ---- straw (bobas/ice drinks, fades/slides in right at the finish) ----
    const showStraw = !!(dv.bobas || dv.hasIce);
    const strawOp = showStraw && p > 88 ? Math.min(0.85, (p - 88) / 6 * 0.85) : 0;
    const strawYOff = showStraw && p > 88 ? Math.round(18 * Math.max(0, (100 - p) / 12)) : 200;
    const strawSVG = (showStraw && p > 88)
      ? `<rect x="88" y="${(CTY - 18 - strawYOff).toFixed(1)}" width="4" height="${(CBY-CTY+22).toFixed(1)}" rx="2" fill="#c4a882" opacity="${strawOp.toFixed(2)}"/>` : '';

    const liquidGrad = `<linearGradient id="poLiqGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${lc}"/><stop offset="100%" stop-color="${lc2}"/></linearGradient>`;
    const waveTop = p > 0 ? wavePath(fillY, isCold ? 1.5 : 2.5, false) : '';

    // ---- main liquid-fill block: dedicated renderer for void/aurora, generic
    // wave-fill (with recipe fill override) for everything else ----
    const liquidBlock = p <= 0 ? '' : (
      dv.type === 'void'   ? voidLiquidSVG() :
      dv.type === 'aurora' ? auroraLiquidSVG() :
      `<rect x="${CX}" y="${(fillY+3).toFixed(1)}" width="${CW}" height="${(CBY-fillY+5).toFixed(1)}" fill="${liquidFillOverride || 'url(#poLiqGrad)'}" opacity="0.85"/>
       <path d="${waveTop}" fill="${lc2}" opacity="0.55" style="animation:poWaveMove 3.4s ease-in-out infinite;transform-box:fill-box"/>
       ${iceSVG}
       ${bobasSVG}
       ${foamSVG(foamOverride)}`
    );

    return `<svg width="96" height="112" viewBox="0 0 150 175" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>
        <clipPath id="poCupClip"><polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}"/></clipPath>
        ${liquidGrad}
        ${dv.tierDefs || ''}
      </defs>
      <ellipse cx="${CX+CW/2}" cy="${CBY+8}" rx="42" ry="6" fill="rgba(0,0,0,0.14)"/>
      <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}" fill="rgba(245,241,235,0.08)"/>
      ${showStraw && p > 88 ? strawSVG : ''}
      ${p > 0 ? `<g clip-path="url(#poCupClip)">${liquidBlock}${recipeContentIn}</g>` : ''}
      ${wallsSVG()}
      ${decorSVG()}
      ${rimSVG()}
      ${p > 5 ? `<path d="M${CX+2},${fillY.toFixed(1)} Q${CX+CW/2},${(fillY-3).toFixed(1)} ${CX+CW-2},${fillY.toFixed(1)}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-linecap="round"/>` : ''}
      ${steamSVG()}
      <g clip-path="url(#poCupClip)">${wallDrizzleSVG}${chocDrizzleSVG}${recipeDrizzleSVG}</g>
      ${cremaSVG}${petalSVG}
      ${garnishSVG ? `<g clip-path="url(#poCupClip)">${garnishSVG}</g>` : ''}
      ${recipeContentOut}
      ${condensationSVG()}
      ${p >= 100 ? `<text x="18" y="20" font-size="12" style="animation:poSparkle 1.6s ease-in-out infinite ${ao(1.6)}">✨</text><text x="118" y="16" font-size="10" style="animation:poSparkle 2.0s ease-in-out infinite ${ao(2.0)}">⭐</text><text x="70" y="10" font-size="9" style="animation:poSparkle 1.3s ease-in-out infinite ${ao(1.3)}">✦</text>` : ''}
      ${p > 15 ? `<text x="${CX+CW/2}" y="${Math.max(fillY+18, CBY-10).toFixed(1)}" text-anchor="middle" font-family="Playfair Display,serif" font-size="13" font-weight="600" fill="rgba(255,255,255,0.85)">${Math.round(p)}%</text>` : ''}
    </svg>`;
  }

  function openPopOut() {
    if (popOutWindow && !popOutWindow.closed) { popOutWindow.focus(); return; }

    const sounds = JSON.parse(localStorage.getItem('letsfocus_volumes') || '{}');
    const state = { remaining: remainingSeconds, total: totalSeconds, running: timerRunning, h: timerHours, m: timerMinutes, s: timerSeconds };
    let drinkVisual = null;
    try { drinkVisual = JSON.parse(localStorage.getItem('letsfocus_drink_sync') || 'null'); } catch(e) {}

    const popHTML = buildPopOutHTML(sounds, state, drinkVisual);
    popOutWindow = window.open('', 'LetsFocusTimer', 'width=400,height=600,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no');
    if (!popOutWindow) { showCustomAlert('Pop-out blocked! Please allow pop-ups for this site.'); return; }
    popOutWindow.document.write(popHTML);
    popOutWindow.document.close();
  }

  function buildPopOutHTML(sounds, state, drinkVisual) {
    const SOUND_FILES = {
      rain:     'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996128/rain_otcmzn.mp3',
      thunder:  'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996118/thunder_mz7jxe.mp3',
      ocean:    'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996115/ocean_gedg9j.mp3',
      forest:   'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996123/forest_pauzav.mp3',
      fire:     'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996116/fire_kfsnyi.mp3',
      coffee:   'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996109/coffee_szybju.mp3',
      wind:     'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996120/wind_duqzyi.mp3',
      writing:  'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996120/writing_o0e7vi.mp3',
      keyboard: 'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996477/typing_j9jjie.mp3',
      ac:       'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996118/ac_nhvrqh.mp3',
    };
    const soundEmojis = { rain:'🌧', thunder:'⛈', ocean:'🌊', forest:'🌿', fire:'🔥', coffee:'☕', wind:'💨', writing:'✍️', keyboard:'⌨️', ac:'❄️' };
    const soundRows = Object.entries(SOUND_FILES).map(([key, url]) => {
      const vol = sounds[key] !== undefined ? sounds[key] : 50;
      return `<div class="po-sound-row">
        <button class="po-sound-btn" data-sound="${key}" data-url="${url}">${soundEmojis[key]} ${key}</button>
        <input type="range" min="0" max="100" value="${vol}" class="po-vol-slider" data-sound="${key}">
      </div>`;
    }).join('');

    const h = String(state.h).padStart(2,'0'), m = String(state.m).padStart(2,'0'), s = String(state.s).padStart(2,'0');
    const initialPct = state.total > 0 ? ((state.total - state.remaining) / state.total * 100) : 0;
    const initialCupSVG = buildPoCupSVG(drinkVisual, initialPct);
    const initialDrinkLabel = drinkVisual
      ? (drinkVisual.label + (drinkVisual.tier === 'mastercraft' ? ' 👑' : drinkVisual.tier === 'signature' ? ' ✦' : ''))
      : 'No drink yet — start a session';

    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>LetsFocus Timer</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Source+Sans+Pro&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: linear-gradient(165deg,#1c0f06 0%,#2e1a0c 22%,#4a2c14 48%,#2e1a0c 74%,#140b04 100%); min-height:100vh; font-family:'Source Sans Pro',sans-serif; color:#f5f1eb; overflow-x:hidden; }
.po-header { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid rgba(212,165,116,0.2); }
.po-title { font-family:'Playfair Display',serif; font-size:1rem; color:#e0b57e; font-style:italic; text-shadow:0 0 12px rgba(212,165,116,0.35); }
.po-expand { background:rgba(212,165,116,0.15); border:1px solid rgba(212,165,116,0.3); color:#d4a574; padding:6px 12px; border-radius:8px; cursor:pointer; font-size:0.82rem; }
.po-expand:hover { background:rgba(212,165,116,0.25); }
.po-timer { text-align:center; padding:22px 16px 16px; }
.po-clock-card { background:linear-gradient(170deg,rgba(252,248,242,0.95),rgba(238,230,218,0.92)); border-radius:16px; padding:14px 10px 10px; margin:0 0 16px; border:1px solid rgba(139,111,71,0.35); border-top:3px solid rgba(196,154,108,0.65); box-shadow:0 10px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.6); }
.po-display { font-family:'Courier New',monospace; font-size:3.2rem; font-weight:bold; color:#5a3418; text-shadow:0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(90,52,20,0.25); letter-spacing:2px; }
.po-controls { display:flex; gap:12px; justify-content:center; margin-top:16px; flex-wrap:wrap; }
.po-btn { padding:10px 22px; border:none; border-radius:10px; font-family:'Playfair Display',serif; font-size:0.95rem; cursor:pointer; font-weight:600; transition:all 0.2s; }
.po-start { background:linear-gradient(135deg,#10b981,#059669); color:#fff; }
.po-start.pause { background:linear-gradient(135deg,#f59e0b,#d97706); }
.po-reset { background:rgba(212,165,116,0.2); border:1px solid rgba(212,165,116,0.4); color:#d4a574; }
.po-btn:hover { transform:translateY(-2px); opacity:0.9; }
.po-progress { margin:0 16px 8px; background:rgba(255,255,255,0.1); border-radius:8px; height:6px; overflow:hidden; }
.po-progress-fill { height:100%; background:linear-gradient(90deg,#6b4423,#d9a978); border-radius:8px; transition:width 1s linear; width:0%; }
.po-pct { text-align:center; font-size:0.78rem; color:rgba(212,165,116,0.7); margin-bottom:8px; }
.po-sounds { padding:0 16px 16px; }
.po-sounds-toggle { display:flex; align-items:center; justify-content:space-between; cursor:pointer; padding:8px 12px; border-radius:10px; background:rgba(212,165,116,0.08); border:1px solid rgba(212,165,116,0.2); transition:all 0.2s; margin-bottom:0; user-select:none; position:relative; overflow:hidden; animation:poHighlightGlow 3.2s ease-in-out infinite; }
.po-sounds-toggle::after { content:''; position:absolute; top:0; left:-60%; width:36%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.26),transparent); animation:poHighlightSweep 5.5s ease-in-out infinite 1.1s; pointer-events:none; }
.po-sounds-toggle:hover { background:rgba(212,165,116,0.15); }
.po-sounds-title { font-family:'Playfair Display',serif; color:#d4a574; font-size:0.9rem; letter-spacing:1px; text-transform:uppercase; }
.po-sounds-arrow { color:#d4a574; font-size:0.75rem; transition:transform 0.25s ease; }
.po-sounds-arrow.open { transform:rotate(180deg); }
.po-sounds-body { overflow:hidden; max-height:0; transition:max-height 0.35s ease, opacity 0.25s ease, margin-top 0.25s ease; opacity:0; margin-top:0; }
.po-sounds-body.expanded { max-height:600px; opacity:1; margin-top:10px; }
.po-sound-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.po-sound-btn { background:rgba(212,165,116,0.1); border:1px solid rgba(212,165,116,0.25); color:#d4a574; padding:6px 10px; border-radius:8px; cursor:pointer; font-size:0.82rem; min-width:100px; text-align:left; transition:all 0.2s; text-transform:capitalize; }
.po-sound-btn.active { background:rgba(212,165,116,0.3); border-color:rgba(212,165,116,0.6); }
.po-vol-slider { flex:1; accent-color:#d4a574; }
.po-sync-status { text-align:center; font-size:0.72rem; color:rgba(212,165,116,0.5); padding-bottom:8px; font-style:italic; }
.po-drink { padding:4px 16px 22px; text-align:center; }
.po-drink-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(212,165,116,0.3),transparent); margin:4px 0 14px; }
.po-drink-label { font-family:'Playfair Display',serif; font-size:0.85rem; color:#e0b57e; font-style:italic; letter-spacing:0.3px; display:inline-block; padding:6px 16px; border-radius:20px; background:rgba(212,165,116,0.08); border:1px solid rgba(212,165,116,0.22); position:relative; overflow:hidden; margin-bottom:10px; animation:poHighlightGlow 3.2s ease-in-out infinite; }
.po-drink-label::after { content:''; position:absolute; top:0; left:-60%; width:36%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent); animation:poHighlightSweep 5.5s ease-in-out infinite; pointer-events:none; }
.po-drink-cup { display:flex; justify-content:center; }
.po-drink-cup svg { filter:drop-shadow(0 4px 10px rgba(0,0,0,0.4)); }
@keyframes poWaveMove { 0%,100%{transform:translateX(-2px);} 50%{transform:translateX(2px);} }
@keyframes poBoba { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes poBobaBurst {
  0%   { transform:translate(0,0) scale(1); }
  14%  { transform:translate(-3px,-4px) scale(1.06); }
  28%  { transform:translate(4px,3px) scale(0.95); }
  42%  { transform:translate(-4px,2px) scale(1.05); }
  56%  { transform:translate(3px,-3px) scale(0.97); }
  70%  { transform:translate(-2px,2px) scale(1.03); }
  84%  { transform:translate(1px,-1px) scale(1.01); }
  100% { transform:translate(0,0) scale(1); }
}
@keyframes poSteam { 0%{opacity:0;transform:translateY(0) scaleX(1)} 40%{opacity:0.7} 100%{opacity:0;transform:translateY(-24px) scaleX(1.8)} }
@keyframes poDropL { 0%{transform:translate(0,0);opacity:0} 10%{opacity:0.5} 78%{transform:translate(0.4px,6px);opacity:0.48} 100%{transform:translate(0.5px,8px);opacity:0} }
@keyframes poDropR { 0%{transform:translate(0,0);opacity:0} 10%{opacity:0.5} 78%{transform:translate(-0.4px,6px);opacity:0.48} 100%{transform:translate(-0.5px,8px);opacity:0} }
@keyframes poSparkle { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
@keyframes voidStar { 0%,100%{opacity:0.08;transform:scale(0.6)} 50%{opacity:1;transform:scale(1.4)} }
@keyframes voidOrbitOuter { from{stroke-dashoffset:0} to{stroke-dashoffset:-232} }
@keyframes voidOrbitInner { from{stroke-dashoffset:0} to{stroke-dashoffset:143} }
@keyframes auroraFlow { 0%,100%{transform:translateX(-10px) scaleY(0.85);opacity:0.55} 40%{transform:translateX(8px) scaleY(1.18);opacity:1} 70%{transform:translateX(-5px) scaleY(0.92);opacity:0.75} }
@keyframes poIce1 { 0%,100%{transform:rotate(-8deg) translateY(0)} 50%{transform:rotate(-8deg) translateY(-2.5px)} }
@keyframes poIce2 { 0%,100%{transform:rotate(5deg) translateY(0)} 50%{transform:rotate(5deg) translateY(-3px)} }
@keyframes poIce3 { 0%,100%{transform:rotate(-5deg) translateY(0)} 50%{transform:rotate(-5deg) translateY(-1.5px)} }
/* These two names are referenced directly inside DRINK_RECIPES svgContent/
   garnishSvg strings (rose gold flakes, the Void's mastercraft singularity
   ring, etc.), which now get broadcast and rendered verbatim in the pop-out
   — so the same keyframe names need to exist here too. "sparkle" matches the
   one already injected on the main page (script-drink.js injectDrinkStyles). */
@keyframes sparkle { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
@keyframes voidOrbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
/* Subtle highlight — soft breathing glow + an occasional light sweep, kept
   gentle on purpose (low opacity, slow period) so it accents rather than
   distracts. Pop-out only; the main timer page is untouched. */
@keyframes poHighlightGlow { 0%,100%{box-shadow:0 0 0 rgba(212,165,116,0);} 50%{box-shadow:0 0 13px rgba(212,165,116,0.32);} }
@keyframes poHighlightSweep { 0%{left:-60%;} 18%{left:130%;} 100%{left:130%;} }
</style></head><body>
<div class="po-header">
  <span class="po-title">☕ LetsFocus Timer</span>
  <button class="po-expand" id="poExpand">⤡ Expand</button>
</div>
<div class="po-timer">
  <div class="po-clock-card">
    <div class="po-display" id="poDisplay">${h}:${m}:${s}</div>
  </div>
  <div class="po-controls">
    <button class="po-btn po-start" id="poStartBtn">${state.running ? '⏸ Pause' : '▶ Start'}</button>
    <button class="po-btn po-reset" id="poResetBtn">↺ Reset</button>
  </div>
</div>
<div class="po-progress"><div class="po-progress-fill" id="poProgressFill" style="width:${initialPct}%"></div></div>
<div class="po-pct" id="poPct">${Math.round(initialPct)}%</div>
<div class="po-sync-status" id="poSyncStatus">🔄 Synced with main window</div>
<div class="po-sounds">
  <div class="po-sounds-toggle" id="poSoundsToggle">
    <span class="po-sounds-title">🎵 White Noise</span>
    <span class="po-sounds-arrow" id="poSoundsArrow">▼</span>
  </div>
  <div class="po-sounds-body" id="poSoundsBody">
    ${soundRows}
  </div>
</div>
<div class="po-drink">
  <div class="po-drink-divider"></div>
  <div class="po-drink-label" id="poDrinkLabel">${initialDrinkLabel}</div>
  <div class="po-drink-cup" id="poDrinkCup">${initialCupSVG}</div>
</div>
<script>
const SYNC_KEY = 'letsfocus_timer_sync';
const CMD_KEY = 'letsfocus_timer_cmd';
const DRINK_SYNC_KEY = 'letsfocus_drink_sync';
const audios = {};
let poRunning = ${state.running};
let poRemaining = ${state.remaining};
let poTotal = ${state.total};
let poInterval = null;
let poDrinkVisual = ${JSON.stringify(drinkVisual)};

${buildPoCupSVG.toString()}

function pad(n) { return String(n).padStart(2,'0'); }
function updateDrinkCup(pct) {
  const cupEl = document.getElementById('poDrinkCup');
  const labelEl = document.getElementById('poDrinkLabel');
  if (cupEl) cupEl.innerHTML = buildPoCupSVG(poDrinkVisual, pct);
  if (labelEl) labelEl.textContent = poDrinkVisual
    ? (poDrinkVisual.label + (poDrinkVisual.tier === 'mastercraft' ? ' 👑' : poDrinkVisual.tier === 'signature' ? ' ✦' : ''))
    : 'No drink yet — start a session';
}
function updateDisplay(rem) {
  const h = Math.floor(rem/3600), m = Math.floor((rem%3600)/60), s = rem%60;
  document.getElementById('poDisplay').textContent = pad(h)+':'+pad(m)+':'+pad(s);
  const pct = poTotal > 0 ? (poTotal - rem) / poTotal * 100 : 0;
  document.getElementById('poProgressFill').style.width = pct + '%';
  document.getElementById('poPct').textContent = Math.round(pct) + '%';
  updateDrinkCup(pct);
}

// Listen for main window sync
window.addEventListener('storage', (e) => {
  if (e.key === DRINK_SYNC_KEY) {
    try {
      poDrinkVisual = JSON.parse(e.newValue);
      const pct = poTotal > 0 ? (poTotal - poRemaining) / poTotal * 100 : 0;
      updateDrinkCup(pct);
    } catch(err) {}
    return;
  }
  if (e.key !== SYNC_KEY) return;
  try {
    const data = JSON.parse(e.newValue);
    poRemaining = data.remaining;
    poTotal = data.total;
    if (data.running !== poRunning) {
      poRunning = data.running;
      const btn = document.getElementById('poStartBtn');
      if (poRunning) { btn.textContent = '⏸ Pause'; btn.classList.add('pause'); startLocalTick(); }
      else { btn.textContent = '▶ Start'; btn.classList.remove('pause'); clearInterval(poInterval); }
    }
    updateDisplay(poRemaining);
    document.getElementById('poSyncStatus').textContent = '🔄 Synced ' + new Date().toLocaleTimeString();
    if (data.action === 'complete') { clearInterval(poInterval); poRunning = false; }
  } catch(err) {}
});

function sendCmd(cmd, extra) {
  localStorage.setItem(CMD_KEY, JSON.stringify({ cmd, ts: Date.now(), ...extra }));
}

function startLocalTick() {
  clearInterval(poInterval);
  poInterval = setInterval(() => {
    poRemaining--;
    if (poRemaining < 0) { clearInterval(poInterval); poRemaining = 0; poRunning = false; }
    updateDisplay(poRemaining);
  }, 1000);
}

document.getElementById('poStartBtn').addEventListener('click', () => {
  poRunning = !poRunning;
  const btn = document.getElementById('poStartBtn');
  if (poRunning) { btn.textContent = '⏸ Pause'; btn.classList.add('pause'); startLocalTick(); sendCmd('toggle'); }
  else { btn.textContent = '▶ Start'; btn.classList.remove('pause'); clearInterval(poInterval); sendCmd('toggle'); }
});

document.getElementById('poResetBtn').addEventListener('click', () => { sendCmd('reset'); clearInterval(poInterval); poRunning = false; document.getElementById('poStartBtn').textContent = '▶ Start'; document.getElementById('poStartBtn').classList.remove('pause'); });

document.getElementById('poExpand').addEventListener('click', () => { window.resizeTo(520, 720); });

// Sounds
document.querySelectorAll('.po-sound-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sound = btn.dataset.sound, url = btn.dataset.url;
    if (!audios[sound]) { audios[sound] = new Audio(url); audios[sound].loop = true; }
    if (!audios[sound].paused) { audios[sound].pause(); btn.classList.remove('active'); }
    else { audios[sound].play(); btn.classList.add('active'); }
  });
});
document.querySelectorAll('.po-vol-slider').forEach(slider => {
  slider.addEventListener('input', (e) => {
    const sound = e.target.dataset.sound;
    if (audios[sound]) audios[sound].volume = e.target.value / 100;
    const vols = JSON.parse(localStorage.getItem('letsfocus_volumes') || '{}');
    vols[sound] = e.target.value;
    localStorage.setItem('letsfocus_volumes', JSON.stringify(vols));
  });
});

// Init if already running
if (poRunning) { startLocalTick(); document.getElementById('poStartBtn').classList.add('pause'); }
updateDisplay(poRemaining);
window.addEventListener('beforeunload', () => { Object.values(audios).forEach(a => a.pause()); });

// White noise collapsible toggle (collapsed by default)
document.getElementById('poSoundsToggle').addEventListener('click', () => {
  const body = document.getElementById('poSoundsBody');
  const arrow = document.getElementById('poSoundsArrow');
  const isOpen = body.classList.toggle('expanded');
  arrow.classList.toggle('open', isOpen);
});
<\/script></body></html>`;
  }

  // Listen for commands from pop-out
  function listenForPopOutCommands() {
    const CMD_KEY = 'letsfocus_timer_cmd';
    let lastCmdTs = 0;
    window.addEventListener('storage', (e) => {
      if (e.key !== CMD_KEY) return;
      try {
        const data = JSON.parse(e.newValue);
        if (data.ts <= lastCmdTs) return;
        lastCmdTs = data.ts;
        if (data.cmd === 'toggle') toggleTimer();
        else if (data.cmd === 'reset') resetTimer();
      } catch(err) {}
    });
  }

  // ---- Config overlay ----
  function initConfigOverlay() {
    const overlay = document.getElementById('timerConfirmOverlay');
    const cup = document.getElementById('coffeeCup');
    if (!overlay || !cup) return;

    cup.addEventListener('click', () => {
      const saved = loadTimerData();
      configHours = saved.hours ?? 0; configMinutes = saved.minutes ?? 25; configSeconds = saved.seconds ?? 0;
      segState.hours = configHours; segState.minutes = configMinutes; segState.seconds = configSeconds;
      selectedGoal = null; pomodoroMode = false;
      document.getElementById('pomoBtnCustom')?.classList.add('active');
      document.getElementById('pomoBtnPomo')?.classList.remove('active');
      document.getElementById('pomodoroCycleInfo')?.classList.add('hidden');
      populateGoalPicker();
      showConfigStep(1);
      overlay.classList.remove('hidden');
    });

    document.getElementById('pomoBtnCustom')?.addEventListener('click', () => {
      pomodoroMode = false;
      document.getElementById('pomoBtnCustom').classList.add('active');
      document.getElementById('pomoBtnPomo').classList.remove('active');
      document.getElementById('pomodoroCycleInfo')?.classList.add('hidden');
    });
    document.getElementById('pomoBtnPomo')?.addEventListener('click', () => {
      pomodoroMode = true;
      document.getElementById('pomoBtnPomo').classList.add('active');
      document.getElementById('pomoBtnCustom').classList.remove('active');
      document.getElementById('pomodoroCycleInfo')?.classList.remove('hidden');
      segState.hours = 0; segState.minutes = 25; segState.seconds = 0;
      updateSegmentDisplay();
    });

    document.getElementById('goalPickerNextBtn')?.addEventListener('click', () => {
      if (!selectedGoal) return;
      syncSegmentsFromConfig();
      syncWheelsFromConfig();
      showConfigStep(2);
    });
    document.getElementById('goalPickerCancelBtn')?.addEventListener('click', () => overlay.classList.add('hidden'));

    document.getElementById('confirmStartBtn')?.addEventListener('click', () => {
      if (pomodoroMode) {
        configHours = 0; configMinutes = 25; configSeconds = 0;
        pomoCurrentCycle = 1; pomoIsWork = true;
      } else {
        configHours = segState.hours; configMinutes = segState.minutes; configSeconds = segState.seconds;
      }
      saveTimerData(configHours, configMinutes, configSeconds);
      cup.classList.add('latte');
      overlay.classList.add('hidden');
      showTimerPage();
      updatePomoIndicator();
    });
    document.getElementById('confirmBackBtn')?.addEventListener('click', () => showConfigStep(1));

    initInputMode();
  }

  // ---- Keyboard shortcuts ----
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const timerPage = document.getElementById('timerPage');
      if (!timerPage || timerPage.classList.contains('hidden')) return;
      if (document.activeElement && document.activeElement.classList.contains('timer-seg-editing')) return;
      if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); toggleTimer(); }
      else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); resetTimer(); }
      else if (e.key === 'Escape') { e.preventDefault(); hideTimerPage(); }
    });
  }

  // ---- Sound presets ----
  const SOUND_PRESETS = {
    cafe:   { coffee: 70, keyboard: 50, writing: 40 },
    rainy:  { rain: 70, thunder: 30, wind: 20 },
    forest: { forest: 75, wind: 35, fire: 25 },
    deep:   { ac: 40, keyboard: 55, rain: 30 },
  };

  function initSoundPresets() {
    document.querySelectorAll('.sound-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.dataset.preset;
        const isActive = btn.classList.contains('active');
        document.querySelectorAll('.sound-preset-btn').forEach(b => b.classList.remove('active'));
        if (isActive) { MusicModule.stopAllAudio(); return; }
        MusicModule.stopAllAudio();
        btn.classList.add('active');
        const preset = SOUND_PRESETS[presetKey];
        if (!preset) return;
        Object.entries(preset).forEach(([sound, vol]) => {
          const slider = document.querySelector('#timerPage .ntb-volume-slider[data-sound="' + sound + '"]');
          if (slider) { slider.value = vol; slider.dispatchEvent(new Event('input')); }
          const toggleBtn = document.querySelector('#timerPage .noise-toggle-btn[data-sound="' + sound + '"]');
          if (toggleBtn) toggleBtn.click();
        });
      });
    });
  }

  function showTimerPage() {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('timerPage').classList.remove('hidden');
    const saved = loadTimerData();
    timerHours = saved.hours ?? 0; timerMinutes = saved.minutes ?? 0; timerSeconds = saved.seconds ?? 0;
    totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    remainingSeconds = totalSeconds;
    elapsedSeconds = 0; lastQuoteMilestone = -1; sessionStatsRecorded = false;
    const textEl = document.getElementById('progressQuoteText'), milestoneEl = document.getElementById('progressQuoteMilestone');
    if (textEl) textEl.textContent = '"The secret of getting ahead is getting started."';
    if (milestoneEl) milestoneEl.textContent = '— Mark Twain';
    updateTimerDisplay(); updateTimerProgress(); updateSessionGoalDisplay(); renderFocusGoal();
    MusicModule.loadPlaylist();
    broadcastState();
    if (typeof window.showFocusModeBanner === 'function') window.showFocusModeBanner();
    // Init drink for this session based on selected goal's category
    if (typeof DrinkModule !== 'undefined') {
      DrinkModule.onSessionStart(selectedGoal?.category || null);
    }
  }

  function hideTimerPage() {
    document.getElementById('timerPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    if (timerRunning) { clearInterval(timerInterval); timerRunning = false; }
    MusicModule.stopAllAudio();
    broadcastState({ action: 'hide' });
    const btn = document.getElementById('startPauseBtn');
    if (btn) { btn.textContent = '▶ Start'; btn.classList.remove('pause'); }
    GoalsModule.renderGoals(); GoalsModule.updateMainProgress();
    if (typeof window.hideFocusModeBanner === 'function') window.hideFocusModeBanner();
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
    broadcastState();
  }

  function resetTimer() {
    clearInterval(timerInterval); timerRunning = false; lastQuoteMilestone = -1;
    const btn = document.getElementById('startPauseBtn');
    if (btn) { btn.textContent = '▶ Start'; btn.classList.remove('pause'); }
    const saved = loadTimerData();
    timerHours = saved.hours ?? 0; timerMinutes = saved.minutes ?? 0; timerSeconds = saved.seconds ?? 0;
    totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    remainingSeconds = totalSeconds;
    const fill = document.getElementById('timerProgressFill'); if (fill) fill.style.width = '0%';
    const pctEl = document.getElementById('progressPctDisplay'); if (pctEl) pctEl.textContent = '0%';
    const elapsed = document.getElementById('elapsedDisplay'); if (elapsed) elapsed.textContent = '00:00';
    document.getElementById('timerPage')?.classList.remove('timer-complete');
    const textEl = document.getElementById('progressQuoteText'), milestoneEl = document.getElementById('progressQuoteMilestone');
    if (textEl) textEl.textContent = '"The secret of getting ahead is getting started."';
    if (milestoneEl) milestoneEl.textContent = '— Mark Twain';
    updateTimerDisplay(); updateTimerProgress();
    broadcastState({ action: 'reset' });
  }

  function onTimerComplete() {
    updateProgressQuote(100);
    const tp = document.getElementById('timerPage');
    if (tp) { tp.classList.add('timer-complete'); setTimeout(() => tp.classList.remove('timer-complete'), 3000); }

    // Pomodoro auto-cycle
    if (pomodoroMode) {
      playSoftChime();
      if (pomoIsWork) {
        pomoIsWork = false;
        remainingSeconds = POMO_BREAK; totalSeconds = POMO_BREAK;
        timerHours = 0; timerMinutes = 5; timerSeconds = 0;
        updateTimerDisplay(); updateTimerProgress(); updatePomoIndicator();
        showPomoBanner('☕ Break time! 5 minutes to recharge.', false);
        // auto-start break
        setTimeout(() => { if (!timerRunning) toggleTimer(); }, 1500);
      } else {
        pomoIsWork = true;
        if (pomoCurrentCycle >= POMO_CYCLES) {
          // All cycles done — record stats + XP once here with the pomodoro bonus flag
          if (!sessionStatsRecorded) {
            sessionStatsRecorded = true;
            if (typeof StatsModule !== 'undefined') StatsModule.recordSession(elapsedSeconds, selectedGoal?.text || '');
            if (typeof XPModule !== 'undefined') XPModule.onSessionComplete(elapsedSeconds, true, selectedGoal?.text || '');
            if (typeof DrinkShelfModule !== 'undefined') DrinkShelfModule.addCup(elapsedSeconds);
          }
          pomoCurrentCycle = 1;
          updatePomoIndicator();
          showTimerEndModal(true);
        } else {
          pomoCurrentCycle++;
          remainingSeconds = POMO_WORK; totalSeconds = POMO_WORK;
          timerHours = 0; timerMinutes = 25; timerSeconds = 0;
          updateTimerDisplay(); updateTimerProgress(); updatePomoIndicator();
          showPomoBanner(`🍅 Work cycle ${pomoCurrentCycle} of ${POMO_CYCLES} — let's go!`, true);
          setTimeout(() => { if (!timerRunning) toggleTimer(); }, 1500);
        }
      }
      return;
    }

    if (selectedGoal?.subgoals?.length && selectedGoal.subgoals.every(s => s.done)) triggerGoalComplete();
    else showTimerEndModal();
  }

  function showPomoBanner(msg, isWork) {
    const existing = document.getElementById('pomoBanner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.id = 'pomoBanner';
    banner.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:5000;
      background:${isWork ? 'rgba(16,185,129,0.92)' : 'rgba(59,130,246,0.92)'};
      color:#fff;padding:12px 28px;border-radius:30px;font-family:'Playfair Display',serif;
      font-size:1rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.25);
      animation:fadeIn 0.3s ease-out;backdrop-filter:blur(6px);`;
    banner.textContent = msg;
    document.body.appendChild(banner);
    setTimeout(() => { banner.style.opacity='0'; banner.style.transition='opacity 0.4s'; setTimeout(() => banner.remove(), 400); }, 3000);
  }

  function updatePomoIndicator() {
    const indicator = document.getElementById('pomoSessionIndicator');
    const phaseLabel = document.getElementById('pomoPhaseLabel');
    const tracker = document.getElementById('pomoCycleTracker');
    if (!indicator) return;
    if (!pomodoroMode) { indicator.classList.add('hidden'); return; }
    indicator.classList.remove('hidden');
    if (phaseLabel) {
      phaseLabel.textContent = pomoIsWork ? '🍅 Work' : '☕ Break';
      phaseLabel.className = 'pomo-phase-badge' + (pomoIsWork ? '' : ' break');
    }
    if (tracker) {
      tracker.innerHTML = '';
      for (let i = 1; i <= POMO_CYCLES; i++) {
        const dot = document.createElement('div');
        dot.className = 'pomo-cycle-dot' + (i < pomoCurrentCycle ? ' done' : i === pomoCurrentCycle ? ' current' : '');
        tracker.appendChild(dot);
      }
    }
  }

  // ============================================================
  // MID-SESSION INLINE TIMER EDITING
  // ============================================================
  function initInlineTimerEdit() {
    const segments = [
      { id: 'timerHours',   key: 'hours',   max: 23 },
      { id: 'timerMinutes', key: 'minutes', max: 59 },
      { id: 'timerSeconds', key: 'seconds', max: 59 },
    ];

    segments.forEach(({ id, key, max }, idx) => {
      const el = document.getElementById(id);
      if (!el) return;

      el.style.cursor = 'pointer';
      el.title = 'Click to edit';

      let editBuffer = '';
      let isEditing = false;

      function enterEdit() {
        // Auto-pause if running
        if (timerRunning) toggleTimer();
        isEditing = true;
        editBuffer = '';
        el.classList.add('timer-seg-editing');
        el.style.outline = '3px solid #d4a574';
        el.style.borderRadius = '8px';
        el.style.boxShadow = '0 0 18px rgba(212,165,116,0.55)';
        el.setAttribute('tabindex', '0');
        el.focus();
      }

      function exitEdit() {
        if (editBuffer !== '') {
          let val = parseInt(editBuffer, 10);
          if (isNaN(val)) val = 0;
          val = Math.min(val, max);
          if (key === 'hours')   { timerHours = val; }
          if (key === 'minutes') { timerMinutes = val; }
          if (key === 'seconds') { timerSeconds = val; }
          remainingSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
          // keep totalSeconds synced so progress bar reflects new time
          totalSeconds = remainingSeconds;
          updateTimerDisplay(); updateTimerProgress(); broadcastState();
        }
        editBuffer = '';
        isEditing = false;
        el.classList.remove('timer-seg-editing');
        el.style.outline = '';
        el.style.boxShadow = '';
      }

      el.addEventListener('click', (e) => { e.stopPropagation(); if (!isEditing) enterEdit(); });

      el.addEventListener('keydown', (e) => {
        if (!isEditing) return;
        if (e.key >= '0' && e.key <= '9') {
          e.preventDefault();
          editBuffer += e.key;
          const partial = parseInt(editBuffer, 10);
          el.textContent = pad(Math.min(partial, max));
          if (editBuffer.length >= 2 || (editBuffer.length === 1 && parseInt(e.key, 10) > Math.floor(max / 10))) {
            exitEdit();
            // Move focus to next segment
            const nextId = ['timerHours','timerMinutes','timerSeconds'][idx + 1];
            if (nextId) { const next = document.getElementById(nextId); if (next) { setTimeout(() => { next.dispatchEvent(new MouseEvent('click')); }, 0); } }
          }
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          editBuffer = editBuffer.slice(0, -1);
          el.textContent = editBuffer === '' ? pad(key === 'hours' ? timerHours : key === 'minutes' ? timerMinutes : timerSeconds) : pad(parseInt(editBuffer, 10));
        } else if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          exitEdit();
        } else if (e.key === 'Escape') {
          editBuffer = '';
          isEditing = false;
          el.classList.remove('timer-seg-editing');
          el.style.outline = ''; el.style.boxShadow = '';
          updateTimerDisplay();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const cur = key === 'hours' ? timerHours : key === 'minutes' ? timerMinutes : timerSeconds;
          const nv = Math.min(cur + 1, max);
          if (key === 'hours') timerHours = nv;
          else if (key === 'minutes') timerMinutes = nv;
          else timerSeconds = nv;
          remainingSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
          totalSeconds = remainingSeconds;
          updateTimerDisplay(); updateTimerProgress();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const cur = key === 'hours' ? timerHours : key === 'minutes' ? timerMinutes : timerSeconds;
          const nv = Math.max(cur - 1, 0);
          if (key === 'hours') timerHours = nv;
          else if (key === 'minutes') timerMinutes = nv;
          else timerSeconds = nv;
          remainingSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
          totalSeconds = remainingSeconds;
          updateTimerDisplay(); updateTimerProgress();
        }
      });

      el.addEventListener('blur', () => { if (isEditing) exitEdit(); });
    });

    // Click outside timer display → exit edit
    document.addEventListener('click', () => {
      document.querySelectorAll('.timer-seg-editing').forEach(el => el.blur());
    });
  }

  function init() {
    initConfigOverlay();
    listenForPopOutCommands();
    document.getElementById('backToGoals')?.addEventListener('click', hideTimerPage);
    document.getElementById('startPauseBtn')?.addEventListener('click', toggleTimer);
    document.getElementById('resetBtn')?.addEventListener('click', resetTimer);
    document.getElementById('focusGoalDoneBtn')?.addEventListener('click', triggerGoalComplete);
    document.getElementById('timerPopOutBtn')?.addEventListener('click', openPopOut);
    initInlineTimerEdit();
    initKeyboardShortcuts();
    initSoundPresets();
  }

  return { init, showTimerPage, hideTimerPage, playChime: playSoftChime };
})();
