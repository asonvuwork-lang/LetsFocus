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
  function openPopOut() {
    if (popOutWindow && !popOutWindow.closed) { popOutWindow.focus(); return; }

    const sounds = JSON.parse(localStorage.getItem('letsfocus_volumes') || '{}');
    const state = { remaining: remainingSeconds, total: totalSeconds, running: timerRunning, h: timerHours, m: timerMinutes, s: timerSeconds };

    const popHTML = buildPopOutHTML(sounds, state);
    popOutWindow = window.open('', 'LetsFocusTimer', 'width=400,height=600,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no');
    if (!popOutWindow) { showCustomAlert('Pop-out blocked! Please allow pop-ups for this site.'); return; }
    popOutWindow.document.write(popHTML);
    popOutWindow.document.close();
  }

  function buildPopOutHTML(sounds, state) {
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

    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>LetsFocus Timer</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Source+Sans+Pro&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: linear-gradient(160deg,#2a1a0e,#3d2410,#5c3620,#3d2410,#1e1108); min-height:100vh; font-family:'Source Sans Pro',sans-serif; color:#f5f1eb; overflow-x:hidden; }
.po-header { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid rgba(212,165,116,0.2); }
.po-title { font-family:'Playfair Display',serif; font-size:1rem; color:#d4a574; font-style:italic; }
.po-expand { background:rgba(212,165,116,0.15); border:1px solid rgba(212,165,116,0.3); color:#d4a574; padding:6px 12px; border-radius:8px; cursor:pointer; font-size:0.82rem; }
.po-expand:hover { background:rgba(212,165,116,0.25); }
.po-timer { text-align:center; padding:24px 16px 16px; }
.po-display { font-family:'Courier New',monospace; font-size:4rem; font-weight:bold; color:#fff; text-shadow:0 0 30px rgba(212,165,116,0.8); letter-spacing:4px; }
.po-controls { display:flex; gap:12px; justify-content:center; margin-top:16px; flex-wrap:wrap; }
.po-btn { padding:10px 22px; border:none; border-radius:10px; font-family:'Playfair Display',serif; font-size:0.95rem; cursor:pointer; font-weight:600; transition:all 0.2s; }
.po-start { background:linear-gradient(135deg,#10b981,#059669); color:#fff; }
.po-start.pause { background:linear-gradient(135deg,#f59e0b,#d97706); }
.po-reset { background:rgba(212,165,116,0.2); border:1px solid rgba(212,165,116,0.4); color:#d4a574; }
.po-btn:hover { transform:translateY(-2px); opacity:0.9; }
.po-progress { margin:0 16px 8px; background:rgba(255,255,255,0.1); border-radius:8px; height:6px; overflow:hidden; }
.po-progress-fill { height:100%; background:linear-gradient(90deg,#8b6f47,#d4a574); border-radius:8px; transition:width 1s linear; width:0%; }
.po-pct { text-align:center; font-size:0.78rem; color:rgba(212,165,116,0.7); margin-bottom:8px; }
.po-sounds { padding:0 16px 16px; }
.po-sounds-toggle { display:flex; align-items:center; justify-content:space-between; cursor:pointer; padding:8px 12px; border-radius:10px; background:rgba(212,165,116,0.08); border:1px solid rgba(212,165,116,0.2); transition:all 0.2s; margin-bottom:0; user-select:none; }
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
</style></head><body>
<div class="po-header">
  <span class="po-title">☕ LetsFocus Timer</span>
  <button class="po-expand" id="poExpand">⤡ Expand</button>
</div>
<div class="po-timer">
  <div class="po-display" id="poDisplay">${h}:${m}:${s}</div>
  <div class="po-controls">
    <button class="po-btn po-start" id="poStartBtn">${state.running ? '⏸ Pause' : '▶ Start'}</button>
    <button class="po-btn po-reset" id="poResetBtn">↺ Reset</button>
  </div>
</div>
<div class="po-progress"><div class="po-progress-fill" id="poProgressFill" style="width:${state.total > 0 ? ((state.total - state.remaining) / state.total * 100) : 0}%"></div></div>
<div class="po-pct" id="poPct">${state.total > 0 ? Math.round((state.total - state.remaining) / state.total * 100) : 0}%</div>
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
<script>
const SYNC_KEY = 'letsfocus_timer_sync';
const CMD_KEY = 'letsfocus_timer_cmd';
const audios = {};
let poRunning = ${state.running};
let poRemaining = ${state.remaining};
let poTotal = ${state.total};
let poInterval = null;

// ---- Sound-toggle cooldown guard ----
// Prevents rapid clicking from racing play()/pause() on the same <audio>
// element, which was causing spurious "Could not play" style failures
// (an aborted play() promise looks identical to a real load failure).
// Positioning + the keyframe are applied here in JS rather than relying
// on rules in the <style> block above, so the button's own size is
// never at risk even if this script and that stylesheet ever drift.
const SOUND_COOLDOWN_MS = 450;
const busySounds = new Set();
let _cooldownKeyframeInjected = false;
function ensureCooldownKeyframe() {
  if (_cooldownKeyframeInjected) return;
  _cooldownKeyframeInjected = true;
  const s = document.createElement('style');
  s.textContent = '@keyframes poCooldownDrain { from { transform: scaleY(1); } to { transform: scaleY(0); } }';
  document.head.appendChild(s);
}
function triggerSoundCooldown(btn) {
  ensureCooldownKeyframe();
  // IMPORTANT: no overflow:hidden here — verified in a real browser that it
  // collapses this flex-column button's auto-computed height, clipping the
  // label. The overlay's own border-radius already gives rounded corners.
  btn.style.position = btn.style.position || 'relative';
  let overlay = btn.querySelector('.po-cooldown-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'po-cooldown-overlay';
    overlay.style.cssText =
      'position:absolute; left:0; right:0; top:0; bottom:0;' +
      'background:rgba(200,200,200,0.55); transform-origin:bottom;' +
      'pointer-events:none; border-radius:inherit; z-index:2;';
    btn.appendChild(overlay);
  }
  overlay.style.animation = 'none';
  void overlay.offsetWidth; // reflow — restarts the animation from scratch
  overlay.style.animation = 'poCooldownDrain ' + SOUND_COOLDOWN_MS + 'ms linear forwards';
}

function pad(n) { return String(n).padStart(2,'0'); }
function updateDisplay(rem) {
  const h = Math.floor(rem/3600), m = Math.floor((rem%3600)/60), s = rem%60;
  document.getElementById('poDisplay').textContent = pad(h)+':'+pad(m)+':'+pad(s);
  const pct = poTotal > 0 ? (poTotal - rem) / poTotal * 100 : 0;
  document.getElementById('poProgressFill').style.width = pct + '%';
  document.getElementById('poPct').textContent = Math.round(pct) + '%';
}

// Listen for main window sync
window.addEventListener('storage', (e) => {
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
    if (busySounds.has(sound)) return; // still cooling down from the last click — ignore
    busySounds.add(sound);
    triggerSoundCooldown(btn);
    setTimeout(() => busySounds.delete(sound), SOUND_COOLDOWN_MS);

    if (!audios[sound]) { audios[sound] = new Audio(url); audios[sound].loop = true; }
    if (!audios[sound].paused) {
      audios[sound].pause();
      btn.classList.remove('active');
    } else {
      audios[sound].play().catch((err) => {
        // AbortError just means a pause() interrupted this play() a moment
        // later — not a real failure, so stay quiet instead of erroring.
        if (err && err.name === 'AbortError') return;
      });
      btn.classList.add('active');
    }
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
