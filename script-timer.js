// =============================================
// TIMER MODULE
// =============================================

const TimerModule = (function() {

  let timerHours = 0, timerMinutes = 25, timerSeconds = 0;
  let totalSeconds = 0, remainingSeconds = 0;
  let timerRunning = false, timerInterval = null;
  let elapsedSeconds = 0;

  let configHours = 0, configMinutes = 25, configSeconds = 0;

  // ---- Progress Quotes ----
  const PROGRESS_QUOTES = [
    { pct: 0,   text: "The secret of getting ahead is getting started.",             author: "Mark Twain" },
    { pct: 10,  text: "Push yourself, because no one else is going to do it for you.", author: "" },
    { pct: 20,  text: "Great things never come from comfort zones.",                 author: "" },
    { pct: 30,  text: "Dream it. Wish it. Do it. The hustle is real.",               author: "" },
    { pct: 40,  text: "Success doesn't just find you. You have to go out and get it.", author: "" },
    { pct: 50,  text: "Halfway there — keep the fire burning. You're doing great.",  author: "" },
    { pct: 60,  text: "Don't stop when you're tired. Stop when you're done.",        author: "" },
    { pct: 70,  text: "Your future is created by what you do today, not tomorrow.",  author: "" },
    { pct: 80,  text: "Almost there. Every extra minute now compounds forever.",     author: "" },
    { pct: 90,  text: "The last 10% is what separates the good from the great.",     author: "" },
    { pct: 100, text: "Session complete! Hard work always pays off. ☕",             author: "" },
  ];

  let lastQuoteMilestone = -1;

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
    if (saved && (saved.hours > 0 || saved.minutes > 0 || saved.seconds > 0 || 'seconds' in saved)) return saved;
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
    const startBtn = document.getElementById('confirmStartBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    const cup = document.getElementById('coffeeCup');
    if (!overlay || !cup) return;

    cup.addEventListener('click', () => {
      const saved = loadTimerData();
      configHours = saved.hours || 0;
      configMinutes = saved.minutes || 25;
      configSeconds = saved.seconds || 0;
      updateConfigDisplay();
      overlay.classList.remove('hidden');
    });

    startBtn.addEventListener('click', () => {
      saveTimerData(configHours, configMinutes, configSeconds);
      cup.classList.add('latte');
      overlay.classList.add('hidden');
      showTimerPage();
    });

    cancelBtn.addEventListener('click', () => overlay.classList.add('hidden'));

    overlay.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.dataset.target;
        const isUp = btn.classList.contains('up');
        if (target === 'hours') configHours = isUp ? Math.min(configHours + 1, 23) : Math.max(configHours - 1, 0);
        else if (target === 'minutes') configMinutes = isUp ? Math.min(configMinutes + 1, 59) : Math.max(configMinutes - 1, 0);
        else if (target === 'seconds') configSeconds = isUp ? Math.min(configSeconds + 1, 59) : Math.max(configSeconds - 1, 0);
        updateConfigDisplay();
      });
    });

    [document.getElementById('configHours'), document.getElementById('configMinutes'), document.getElementById('configSeconds')].forEach(el => {
      if (!el) return;
      el.addEventListener('input', function() {
        let val = this.textContent.replace(/\D/g,'');
        if (val.length > 2) val = val.slice(0,2);
        if (val === '') val = '0';
        let num = parseInt(val, 10);
        const max = this.id === 'configHours' ? 23 : 59;
        if (num > max) num = max;
        this.textContent = pad(num);
        if (this.id === 'configHours') configHours = num;
        else if (this.id === 'configMinutes') configMinutes = num;
        else configSeconds = num;
      });
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { this.blur(); e.preventDefault(); }
        if (!/[\d]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault();
      });
      el.addEventListener('blur', function() {
        let val = this.textContent.replace(/\D/g,'');
        if (val === '') val = '0';
        let num = parseInt(val,10);
        const max = this.id === 'configHours' ? 23 : 59;
        if (num > max) num = max;
        this.textContent = pad(num);
        if (this.id === 'configHours') configHours = num;
        else if (this.id === 'configMinutes') configMinutes = num;
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
    // Reset quote to starting message
    const textEl = document.getElementById('progressQuoteText');
    const milestoneEl = document.getElementById('progressQuoteMilestone');
    if (textEl) textEl.textContent = '"The secret of getting ahead is getting started."';
    if (milestoneEl) milestoneEl.textContent = '— Mark Twain';
    updateTimerDisplay();
    updateTimerProgress();
    updateSessionGoalDisplay();
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
    // Reset quote
    const textEl = document.getElementById('progressQuoteText');
    const milestoneEl = document.getElementById('progressQuoteMilestone');
    if (textEl) textEl.textContent = '"The secret of getting ahead is getting started."';
    if (milestoneEl) milestoneEl.textContent = '— Mark Twain';
    updateTimerDisplay(); updateTimerProgress();
  }

  function onTimerComplete() {
    playCompletionSound();
    updateProgressQuote(100);
    const tp = document.getElementById('timerPage');
    if (tp) { tp.classList.add('timer-complete'); setTimeout(() => tp.classList.remove('timer-complete'), 3000); }
    showCustomAlert('🎉 Session Complete! Great work!');
  }

  function playCompletionSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.3);
      });
    } catch(e) {}
  }

  function init() {
    initConfigOverlay();
    document.getElementById('backToGoals')?.addEventListener('click', hideTimerPage);
    document.getElementById('startPauseBtn')?.addEventListener('click', toggleTimer);
    document.getElementById('resetBtn')?.addEventListener('click', resetTimer);
  }

  return { init, showTimerPage, hideTimerPage };
})();
