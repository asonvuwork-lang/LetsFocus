// =============================================
// MAIN / SHARED UTILITIES
// =============================================

// ---- Shared dialog helpers (global scope for all modules) ----
function showCustomAlert(message) {
  return new Promise(resolve => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(74,52,41,0.4);backdrop-filter:blur(2px);z-index:10000;display:flex;align-items:center;justify-content:center;';
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:rgba(245,241,235,0.98);backdrop-filter:blur(15px);border-radius:16px;padding:2rem;max-width:400px;width:90%;box-shadow:0 12px 35px rgba(139,111,71,0.25);border:2px solid rgba(139,111,71,0.3);text-align:center;';
    const p = document.createElement('p');
    p.textContent = message;
    p.style.cssText = 'margin-bottom:1.5rem;font-family:Playfair Display,serif;font-size:1.2rem;color:#6b5139;';
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.style.cssText = 'background:linear-gradient(135deg,#8b6f47 0%,#6b5139 100%);color:#f5f1eb;border:none;padding:12px 24px;border-radius:12px;font-family:Playfair Display,serif;font-weight:500;cursor:pointer;';
    btn.onclick = () => { document.body.removeChild(modal); resolve(); };
    dialog.appendChild(p); dialog.appendChild(btn);
    modal.appendChild(dialog); document.body.appendChild(modal);
  });
}

function showCustomPrompt(message) {
  return new Promise(resolve => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(74,52,41,0.4);backdrop-filter:blur(2px);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease-out;';
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:rgba(245,241,235,0.98);backdrop-filter:blur(15px);border-radius:16px;padding:2rem;max-width:400px;width:90%;box-shadow:0 12px 35px rgba(139,111,71,0.25);border:2px solid rgba(139,111,71,0.3);';
    const title = document.createElement('p');
    title.textContent = message;
    title.style.cssText = 'margin-bottom:1.5rem;font-family:Playfair Display,serif;font-size:1.2rem;color:#6b5139;text-align:center;';
    const input = document.createElement('input');
    input.type = 'text';
    input.style.cssText = 'width:100%;padding:12px 16px;border:2px solid rgba(139,111,71,0.3);border-radius:12px;font-size:1rem;font-family:Source Sans Pro,sans-serif;background:rgba(245,241,235,0.9);color:#4a3429;margin-bottom:1.5rem;transition:all 0.3s ease;';
    const btns = document.createElement('div'); btns.style.cssText = 'display:flex;gap:12px;justify-content:flex-end;';
    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.style.cssText = 'background:rgba(245,241,235,0.8);color:#6b5139;border:2px solid rgba(139,111,71,0.3);padding:12px 20px;border-radius:12px;font-family:Playfair Display,serif;cursor:pointer;';
    const ok = document.createElement('button');
    ok.textContent = 'OK';
    ok.style.cssText = 'background:linear-gradient(135deg,#8b6f47 0%,#6b5139 100%);color:#f5f1eb;border:none;padding:12px 20px;border-radius:12px;font-family:Playfair Display,serif;cursor:pointer;';
    const cleanup = () => document.body.removeChild(modal);
    cancel.onclick = () => { cleanup(); resolve(null); };
    ok.onclick = () => { cleanup(); resolve(input.value); };
    input.onkeydown = e => {
      if (e.key === 'Enter') { cleanup(); resolve(input.value); }
      else if (e.key === 'Escape') { cleanup(); resolve(null); }
    };
    btns.appendChild(cancel); btns.appendChild(ok);
    dialog.appendChild(title); dialog.appendChild(input); dialog.appendChild(btns);
    modal.appendChild(dialog); document.body.appendChild(modal);
    input.focus();
  });
}

function showConfirm(message) {
  return new Promise(resolve => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(74,52,41,0.4);backdrop-filter:blur(2px);z-index:10000;display:flex;align-items:center;justify-content:center;';
    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:rgba(245,241,235,0.98);backdrop-filter:blur(15px);border-radius:16px;padding:2rem;max-width:400px;width:90%;box-shadow:0 12px 35px rgba(139,111,71,0.25);border:2px solid rgba(139,111,71,0.3);text-align:center;';
    const p = document.createElement('p');
    p.textContent = message;
    p.style.cssText = 'margin-bottom:1.5rem;font-family:Playfair Display,serif;font-size:1.2rem;color:#6b5139;';
    const btns = document.createElement('div'); btns.style.cssText = 'display:flex;gap:12px;justify-content:center;';
    const yes = document.createElement('button');
    yes.textContent = 'Yes';
    yes.style.cssText = 'background:linear-gradient(135deg,#8b6f47 0%,#6b5139 100%);color:#f5f1eb;border:none;padding:12px 24px;border-radius:12px;font-family:Playfair Display,serif;cursor:pointer;flex:1;';
    const no = document.createElement('button');
    no.textContent = 'No';
    no.style.cssText = 'background:rgba(245,241,235,0.8);color:#6b5139;border:2px solid rgba(139,111,71,0.3);padding:12px 24px;border-radius:12px;font-family:Playfair Display,serif;cursor:pointer;flex:1;';
    const cleanup = () => document.body.removeChild(modal);
    yes.onclick = () => { cleanup(); resolve(true); };
    no.onclick = () => { cleanup(); resolve(false); };
    btns.appendChild(yes); btns.appendChild(no);
    dialog.appendChild(p); dialog.appendChild(btns);
    modal.appendChild(dialog); document.body.appendChild(modal);
  });
}

// ---- Celebration ----
function triggerCelebration() {
  playCompletionChime();
  createConfetti();
}

function playCompletionChime() {
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

function createConfetti() {
  const colors = ['#8b6f47','#d4a574','#6b5139','#a67c5a','#c49468','#4a3429'];
  const container = document.createElement('div'); container.className = 'confetti-container';
  document.body.appendChild(container);
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div'); c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = Math.random() * 3 + 's';
    c.style.animationDuration = (Math.random() * 3 + 2) + 's';
    container.appendChild(c);
  }
  setTimeout(() => { if (container.parentNode) document.body.removeChild(container); }, 6000);
}

// ---- Main init ----
document.addEventListener('DOMContentLoaded', function() {

  // ---- Handwriting animation ----
  function initHandwriting() {
    const container = document.getElementById('welcome-container');
    if (!container) return;
    container.innerHTML = '';
    if (typeof Vara !== 'undefined') {
      new Vara('#welcome-container',
        'https://cdn.jsdelivr.net/npm/vara@1.4.0/fonts/Satisfy/SatisfySL.json',
        [{ text: 'Welcome', fontSize: 24, strokeWidth: 2, color: '#ffffff', duration: 2500, textAlign: 'center', letterSpacing: 6 }],
        { strokeWidth: 2, fontSize: 24, autoAnimation: true }
      );
    }
  }
  initHandwriting();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(initHandwriting, 100); });

  // ---- Inspirational quote ----
  const quotes = ["Believe you can","Stay focused","One step at a time","You got this","Make it happen","Dream big","Never give up","Small steps, big results","Today is your day","Keep going","Do it now","Success awaits","Progress over perfection","Enjoy the journey"];
  const quoteEl = document.getElementById('inspirationalQuote');
  if (quoteEl) quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];

  // ---- Tab switching ----
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('tab-' + tab);
      if (target) target.classList.add('active');
      if (tab === 'deadlines') GoalsModule.renderDeadlinesTab();
    });
  });

  // ---- Theme panel ----
  const themePanel = document.getElementById('themePanel');
  const themeToggle = document.getElementById('themeToggle');
  const themeOverlay = document.getElementById('themeOverlay');
  let themeExpanded = false;

  themeToggle?.addEventListener('click', () => {
    if (themeExpanded) {
      themePanel.classList.remove('expanded');
      themeOverlay.classList.remove('visible'); themeOverlay.classList.add('hidden');
      themeExpanded = false;
    } else {
      themePanel.classList.add('expanded');
      themeOverlay.classList.remove('hidden'); themeOverlay.classList.add('visible');
      themeExpanded = true;
    }
  });
  themeOverlay?.addEventListener('click', () => {
    themePanel.classList.remove('expanded');
    themeOverlay.classList.remove('visible'); themeOverlay.classList.add('hidden');
    themeExpanded = false;
  });

  // ---- Select bar panel ----
  const selectbarPanel = document.getElementById('selectbarPanel');
  const selectbarToggle = document.getElementById('selectbarToggle');
  const selectbarOverlay = document.getElementById('selectbarOverlay');
  let selectbarExpanded = false;

  selectbarToggle?.addEventListener('click', () => {
    if (selectbarExpanded) {
      selectbarPanel.classList.remove('expanded');
      selectbarOverlay.classList.remove('visible'); selectbarOverlay.classList.add('hidden');
      selectbarExpanded = false;
    } else {
      selectbarPanel.classList.add('expanded');
      selectbarOverlay.classList.remove('hidden'); selectbarOverlay.classList.add('visible');
      selectbarExpanded = true;
    }
  });
  selectbarOverlay?.addEventListener('click', () => {
    selectbarPanel.classList.remove('expanded');
    selectbarOverlay.classList.remove('visible'); selectbarOverlay.classList.add('hidden');
    selectbarExpanded = false;
  });

  // ---- Progress bar styles ----
  document.querySelectorAll('.progress-bar-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const style = btn.dataset.style;
      const progress = document.querySelector('.progress');
      if (!progress) return;
      if (style === 'classic') progress.style.background = 'linear-gradient(90deg, #8b6f47 0%, #a67c5a 50%, #8b6f47 100%)';
      else if (style === 'striped') progress.style.background = 'repeating-linear-gradient(45deg, #8b6f47, #8b6f47 10px, #a67c5a 10px, #a67c5a 20px)';
      else if (style === 'gradient') progress.style.background = 'radial-gradient(circle at 30% 50%, #8b6f47, #6b5139)';
      selectbarPanel.classList.remove('expanded');
      selectbarOverlay.classList.remove('visible'); selectbarOverlay.classList.add('hidden');
      selectbarExpanded = false;
    });
  });

  // ---- Close panels when clicking outside ----
  document.addEventListener('click', (e) => {
    if (themeExpanded && !themePanel.contains(e.target)) {
      themePanel.classList.remove('expanded');
      themeOverlay.classList.remove('visible'); themeOverlay.classList.add('hidden');
      themeExpanded = false;
    }
    if (selectbarExpanded && !selectbarPanel.contains(e.target)) {
      selectbarPanel.classList.remove('expanded');
      selectbarOverlay.classList.remove('visible'); selectbarOverlay.classList.add('hidden');
      selectbarExpanded = false;
    }
  });

  // ---- Bootstrap all modules ----
  GoalsModule.init();
  TimerModule.init();
  MusicModule.init();

  // ---- Help button ----
  document.getElementById('helpBtn')?.addEventListener('click', () => showManual(true));

  // ---- First-visit manual ----
  if (!localStorage.getItem('letsfocus_visited')) showManual(false);
});

// ============================================================
// FIRST-VISIT MANUAL
// ============================================================
function showManual(forceShow) {
  const STEPS = [
    {
      icon: '☕',
      title: 'Welcome to LetsFocus!',
      body: 'Your personal focus companion. Add goals, set deadlines, run focus sessions, and fill the room with ambient sounds — all in one cosy place.',
      note: 'This guide takes about 30 seconds.'
    },
    {
      icon: '🎯',
      title: 'Goals Tab',
      body: 'Type a goal name and press + to add it. Click the 📅 icon to set a deadline before adding. Click any existing goal to select it, then type a new name in the input — the dropdown will let you attach it as a subgoal of the selected one.',
      note: 'Use Sort and Filter to organise your list. Sort by Deadline to see whats most urgent.'
    },
    {
      icon: '📅',
      title: 'Deadlines Tab',
      body: 'Any goal with a deadline appears here, sorted by urgency. Goals within 5 days turn amber, within 2 days turn orange, and overdue goals turn red with a notification card asking you to update or remove the deadline.',
      note: 'You can change or remove a deadline anytime by clicking the date badge on a goal.'
    },
    {
      icon: '⏱',
      title: 'Timer & Focus Session',
      body: 'Click the ☕ coffee cup on the Goals page to configure a session. Pick your goal, then set the time using the HH : MM : SS boxes (type digits, Tab to jump between fields). Hit Start Session and stay in the zone!',
      note: 'Use ⤢ Pop Out to float the timer in its own window while you work in other tabs.'
    },
    {
      icon: '🎵',
      title: 'Ambient Sounds',
      body: 'Head to Music Setup to preview sounds like rain, fire, ocean, and keyboard clicks. Toggle multiple sounds at once and adjust each volume independently. Sounds keep playing during your timer session.',
      note: 'Volumes are saved automatically so your perfect mix is always ready.'
    },
    {
      icon: '🚀',
      title: "You're all set!",
      body: "Start by adding a couple of goals, set a deadline on anything time-sensitive, then click the coffee cup and start your first focus session. You've got this!",
      note: 'You can reopen this guide anytime with the ? button in the top-right corner.'
    }
  ];

  let step = 0;
  const modal = document.createElement('div');
  modal.id = 'manualModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(40,22,10,0.78);backdrop-filter:blur(4px);z-index:20000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease-out;';

  function render() {
    const s = STEPS[step];
    const isFirst = step === 0;
    const isLast = step === STEPS.length - 1;
    const dots = STEPS.map((_, i) => `<span style="width:8px;height:8px;border-radius:50%;background:${i === step ? '#d4a574' : 'rgba(212,165,116,0.3)'};display:inline-block;margin:0 3px;transition:background 0.2s;"></span>`).join('');

    modal.innerHTML = `
      <div style="background:rgba(245,241,235,0.98);backdrop-filter:blur(15px);border-radius:20px;padding:2.5rem;max-width:480px;width:90%;box-shadow:0 24px 70px rgba(0,0,0,0.45);border:2px solid rgba(139,111,71,0.25);position:relative;animation:popUp 0.3s ease-out;">
        ${isFirst ? `<label style="position:absolute;top:16px;left:20px;font-size:0.78rem;color:rgba(107,81,57,0.7);font-family:'Source Sans Pro',sans-serif;display:flex;align-items:center;gap:6px;cursor:pointer;">
          <input type="checkbox" id="dontShowAgain" style="accent-color:#8b6f47;"> Don't show again
        </label>` : ''}
        <button id="manualSkip" style="position:absolute;top:14px;right:16px;background:none;border:none;color:rgba(107,81,57,0.5);font-size:0.82rem;cursor:pointer;font-family:'Source Sans Pro',sans-serif;padding:4px 8px;">Skip ✕</button>
        <div style="text-align:center;margin-top:${isFirst ? '1.5rem' : '0'};">
          <div style="font-size:3.5rem;margin-bottom:0.8rem;">${s.icon}</div>
          <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:#4a3429;margin-bottom:0.8rem;font-style:italic;">${s.title}</h2>
          <p style="font-family:'Source Sans Pro',sans-serif;font-size:1rem;color:#6b5139;line-height:1.65;margin-bottom:0.8rem;">${s.body}</p>
          <p style="font-family:'Source Sans Pro',sans-serif;font-size:0.83rem;color:rgba(107,81,57,0.65);font-style:italic;margin-bottom:1.8rem;padding:8px 16px;background:rgba(139,111,71,0.06);border-radius:8px;border-left:3px solid rgba(139,111,71,0.25);">💡 ${s.note}</p>
          <div style="margin-bottom:1.4rem;">${dots}</div>
          <div style="display:flex;gap:10px;justify-content:center;">
            ${step > 0 ? `<button id="manualBack" style="background:rgba(245,241,235,0.8);color:#6b5139;border:2px solid rgba(139,111,71,0.3);padding:11px 22px;border-radius:12px;font-family:'Playfair Display',serif;cursor:pointer;font-size:0.95rem;">← Back</button>` : ''}
            <button id="manualNext" style="background:linear-gradient(135deg,#8b6f47,#6b5139);color:#f5f1eb;border:none;padding:11px 28px;border-radius:12px;font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(139,111,71,0.35);">${isLast ? "✓ Let's go!" : 'Next →'}</button>
          </div>
        </div>
      </div>`;

    document.getElementById('manualNext').addEventListener('click', () => {
      if (isLast) { closeManual(); }
      else { step++; render(); }
    });
    document.getElementById('manualBack')?.addEventListener('click', () => { step--; render(); });
    document.getElementById('manualSkip')?.addEventListener('click', closeManual);
    document.getElementById('dontShowAgain')?.addEventListener('change', (e) => {
      if (e.target.checked) localStorage.setItem('letsfocus_visited', '1');
      else localStorage.removeItem('letsfocus_visited');
    });
  }

  function closeManual() {
    if (!forceShow) localStorage.setItem('letsfocus_visited', '1');
    modal.style.animation = 'fadeOut 0.2s ease-out forwards';
    setTimeout(() => { if (modal.parentNode) document.body.removeChild(modal); }, 200);
  }

  render();
  document.body.appendChild(modal);
}
