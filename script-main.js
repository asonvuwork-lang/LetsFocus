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

// ---- Celebration — Coffee Shop Sign Flip ----
function triggerCelebration() {
  playCompletionChime();
  showCoffeeShopClosing();
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

const CLOSING_QUOTES = [
  { text: "The shop is closed. You did the work.", attr: "— LetsFocus" },
  { text: "Every great session deserves a great ending.", attr: "— LetsFocus" },
  { text: "You showed up. That's everything.", attr: "— LetsFocus" },
  { text: "Rest now. You've earned it.", attr: "— LetsFocus" },
  { text: "The grind is done. The coffee was worth it.", attr: "— LetsFocus" },
];

function showCoffeeShopClosing() {
  if (document.getElementById('coffeeShopClosingOverlay')) return;

  const q = CLOSING_QUOTES[Math.floor(Math.random() * CLOSING_QUOTES.length)];

  const overlay = document.createElement('div');
  overlay.id = 'coffeeShopClosingOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(28,16,8,0);z-index:20000;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:40px;
    transition:background 0.7s ease;
    font-family:'Playfair Display',serif;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes signIdle {
        0%,100% { transform: rotate(-3deg); }
        50%      { transform: rotate(3deg);  }
      }
      @keyframes signWindup {
        0%   { transform: rotate(0deg);   }
        40%  { transform: rotate(-18deg); }
        70%  { transform: rotate(12deg);  }
        100% { transform: rotate(0deg);   }
      }
      @keyframes signSettle {
        0%   { transform: rotate(0deg);  }
        25%  { transform: rotate(14deg); }
        50%  { transform: rotate(-9deg); }
        70%  { transform: rotate(5deg);  }
        85%  { transform: rotate(-2deg); }
        100% { transform: rotate(0deg);  }
      }
      @keyframes quoteReveal {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0);    }
      }
      @keyframes btnsFadeIn {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0);    }
      }
      #csco-rope {
        width:3px; height:48px;
        background:linear-gradient(180deg,rgba(212,165,116,0.6),rgba(139,111,71,0.9));
        margin:0 auto; border-radius:2px;
      }
      #csco-sign-flip { perspective:500px; width:200px; height:120px; }
      #csco-sign-inner {
        width:200px; height:120px; position:relative;
        transform-style:preserve-3d;
        transform:rotateY(0deg);
        transition:transform 0.7s cubic-bezier(0.4,0,0.2,1);
      }
      .csco-sign-face {
        position:absolute; inset:0; border-radius:10px;
        display:flex; flex-direction:column;
        align-items:center; justify-content:center; gap:4px;
        backface-visibility:hidden;
        box-shadow:0 8px 30px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08);
      }
      .csco-sign-face::before {
        content:''; position:absolute; inset:0; border-radius:10px;
        background:repeating-linear-gradient(90deg,transparent 0px,transparent 18px,rgba(0,0,0,0.06) 18px,rgba(0,0,0,0.06) 20px);
        pointer-events:none;
      }
      #csco-face-open {
        background:linear-gradient(135deg,#7a5c2e 0%,#5c3d18 50%,#6b4a22 100%);
        border:3px solid #a07840;
      }
      #csco-face-closed {
        background:linear-gradient(135deg,#5c3d18 0%,#4a2e0e 50%,#5c3d18 100%);
        border:3px solid #8b6030;
        transform:rotateY(180deg);
      }
      .csco-sign-word {
        font-family:'Playfair Display',serif;
        font-weight:700; letter-spacing:4px; text-transform:uppercase;
      }
      #csco-word-open   { font-size:1.9rem; color:#a8e6a8; text-shadow:0 0 12px rgba(100,220,100,0.4); }
      #csco-word-closed { font-size:1.7rem; color:#f08080; text-shadow:0 0 12px rgba(240,80,80,0.4); }
      .csco-sign-sub {
        font-family:'Source Sans Pro',sans-serif;
        font-size:0.7rem; letter-spacing:2px; opacity:0.65;
        text-transform:uppercase; color:#d4a574;
      }
      .csco-screw {
        position:absolute; width:8px; height:8px; border-radius:50%;
        background:radial-gradient(circle at 35% 35%,#c0a060,#7a5a20);
        box-shadow:0 1px 3px rgba(0,0,0,0.5);
      }
      .csco-screw.tl{top:10px;left:12px;} .csco-screw.tr{top:10px;right:12px;}
      .csco-screw.bl{bottom:10px;left:12px;} .csco-screw.br{bottom:10px;right:12px;}
      #csco-quote { text-align:center; max-width:400px; padding:0 24px; opacity:0; }
      #csco-quote-text {
        font-family:'Playfair Display',serif; font-style:italic;
        font-size:1.25rem; color:#f5e8d0; line-height:1.6; margin-bottom:8px;
      }
      #csco-quote-attr {
        font-size:0.8rem; color:rgba(212,165,116,0.65);
        letter-spacing:1px; font-family:'Source Sans Pro',sans-serif;
      }
      #csco-btns { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; opacity:0; }
      .csco-btn {
        padding:13px 28px; border:none; border-radius:14px;
        font-family:'Playfair Display',serif; font-size:1rem; font-weight:600;
        cursor:pointer; transition:all 0.2s ease;
      }
      .csco-btn-primary {
        background:linear-gradient(135deg,#d4a574,#8b6f47);
        color:#fff; box-shadow:0 4px 16px rgba(139,111,71,0.4);
      }
      .csco-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(139,111,71,0.5); }
      .csco-btn-secondary {
        background:rgba(245,241,235,0.1); color:rgba(245,241,235,0.8);
        border:1.5px solid rgba(245,241,235,0.25);
      }
      .csco-btn-secondary:hover { background:rgba(245,241,235,0.18); }
    </style>

    <div style="display:flex;flex-direction:column;align-items:center;">
      <div id="csco-rope"></div>
      <div id="csco-sign-wrap" style="transform-origin:top center;">
        <div id="csco-sign-flip">
          <div id="csco-sign-inner">
            <div class="csco-sign-face" id="csco-face-open">
              <span class="csco-screw tl"></span><span class="csco-screw tr"></span>
              <span class="csco-screw bl"></span><span class="csco-screw br"></span>
              <span class="csco-sign-word" id="csco-word-open">Open</span>
              <span class="csco-sign-sub">Come in, we're open</span>
            </div>
            <div class="csco-sign-face" id="csco-face-closed">
              <span class="csco-screw tl"></span><span class="csco-screw tr"></span>
              <span class="csco-screw bl"></span><span class="csco-screw br"></span>
              <span class="csco-sign-word" id="csco-word-closed">Closed</span>
              <span class="csco-sign-sub">See you next session</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="csco-quote">
      <div id="csco-quote-text">"${q.text}"</div>
      <div id="csco-quote-attr">${q.attr}</div>
    </div>

    <!-- Session Notes -->
    <div id="csco-notes" style="opacity:0;width:100%;max-width:400px;padding:0 24px;">
      <div style="font-family:'Playfair Display',serif;font-size:0.8rem;color:rgba(212,165,116,0.7);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">✍️ What did you accomplish?</div>
      <textarea id="csco-notes-input" placeholder="Jot down what you got done this session…" style="width:100%;min-height:72px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(212,165,116,0.25);border-radius:12px;padding:10px 14px;color:#f5e8d0;font-family:'Source Sans Pro',sans-serif;font-size:0.9rem;resize:vertical;outline:none;box-sizing:border-box;"></textarea>
    </div>

    <div id="csco-btns">
      <button class="csco-btn csco-btn-primary" id="csco-new-session">☕ Another Round</button>
      <button class="csco-btn csco-btn-secondary" id="csco-back-goals">← Back to Goals</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const signWrap  = overlay.querySelector('#csco-sign-wrap');
  const signInner = overlay.querySelector('#csco-sign-inner');
  const quoteEl   = overlay.querySelector('#csco-quote');
  const notesEl   = overlay.querySelector('#csco-notes');
  const btnsEl    = overlay.querySelector('#csco-btns');

  requestAnimationFrame(() => { overlay.style.background = 'rgba(28,16,8,0.92)'; });
  setTimeout(() => { signWrap.style.animation = 'signIdle 2.5s ease-in-out infinite'; }, 600);
  setTimeout(() => { signWrap.style.animation = 'signWindup 0.6s ease-in-out forwards'; }, 1600);
  setTimeout(() => { signInner.style.transform = 'rotateY(180deg)'; }, 2100);
  setTimeout(() => { signWrap.style.animation = 'signSettle 1.2s ease-out forwards'; }, 2300);
  setTimeout(() => { signWrap.style.animation = 'signIdle 3s ease-in-out infinite'; }, 3600);
  setTimeout(() => { quoteEl.style.animation = 'quoteReveal 0.7s ease-out forwards'; }, 3800);
  setTimeout(() => { if (notesEl) { notesEl.style.animation = 'quoteReveal 0.6s ease-out forwards'; } }, 4300);
  setTimeout(() => { btnsEl.style.animation = 'btnsFadeIn 0.6s ease-out forwards'; }, 4800);

  const saveNotes = () => {
    const text = overlay.querySelector('#csco-notes-input')?.value?.trim();
    if (text) {
      const log = JSON.parse(localStorage.getItem('letsfocus_session_notes') || '[]');
      log.unshift({ text, date: new Date().toISOString() });
      localStorage.setItem('letsfocus_session_notes', JSON.stringify(log.slice(0, 100)));
      // Also save to Supabase if signed in
      if (typeof SupabaseModule !== 'undefined' && SupabaseModule.uid()) {
        SupabaseModule.saveSessionNote(text);
      }
    }
  };

  const dismiss = () => {
    saveNotes();
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease';
    setTimeout(() => overlay.remove(), 400);
  };
  overlay.querySelector('#csco-new-session').addEventListener('click', () => {
    dismiss(); setTimeout(() => document.getElementById('coffeeCup')?.click(), 420);
  });
  overlay.querySelector('#csco-back-goals').addEventListener('click', dismiss);
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

  // Auth init — this gates the rest of the app
  if (typeof AuthModule !== 'undefined') {
    AuthModule.init();
  } else {
    // Fallback: no auth, boot directly
    document.dispatchEvent(new CustomEvent('letsfocus:ready'));
  }
});

// ---- App bootstrap (fires after auth is confirmed) ----
document.addEventListener('letsfocus:ready', function() {

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
      if (tab === 'categories') { CategoriesModule.renderTab(); CategoriesModule.injectCategoryStyles(); }
    });
  });

  // ---- Theme panel ----
  const themePanel = document.getElementById('themePanel');
  const themeToggle = document.getElementById('themeToggle');
  const themeOverlay = document.getElementById('themeOverlay');
  let themeExpanded = false;
  themeToggle?.addEventListener('click', () => {
    themeExpanded = !themeExpanded;
    themePanel.classList.toggle('expanded', themeExpanded);
    themeOverlay.classList.toggle('hidden', !themeExpanded);
    themeOverlay.classList.toggle('visible', themeExpanded);
  });
  themeOverlay?.addEventListener('click', () => {
    themePanel.classList.remove('expanded'); themeOverlay.classList.remove('visible'); themeOverlay.classList.add('hidden'); themeExpanded = false;
  });

  // ---- Select bar panel ----
  const selectbarPanel = document.getElementById('selectbarPanel');
  const selectbarToggle = document.getElementById('selectbarToggle');
  const selectbarOverlay = document.getElementById('selectbarOverlay');
  let selectbarExpanded = false;
  selectbarToggle?.addEventListener('click', () => {
    selectbarExpanded = !selectbarExpanded;
    selectbarPanel.classList.toggle('expanded', selectbarExpanded);
    selectbarOverlay.classList.toggle('hidden', !selectbarExpanded);
    selectbarOverlay.classList.toggle('visible', selectbarExpanded);
  });
  selectbarOverlay?.addEventListener('click', () => {
    selectbarPanel.classList.remove('expanded'); selectbarOverlay.classList.remove('visible'); selectbarOverlay.classList.add('hidden'); selectbarExpanded = false;
  });
  document.querySelectorAll('.progress-bar-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const style = btn.dataset.style;
      const progress = document.querySelector('.progress');
      if (!progress) return;
      if (style === 'classic') progress.style.background = 'linear-gradient(90deg,#8b6f47,#a67c5a 50%,#8b6f47)';
      else if (style === 'striped') progress.style.background = 'repeating-linear-gradient(45deg,#8b6f47,#8b6f47 10px,#a67c5a 10px,#a67c5a 20px)';
      else if (style === 'gradient') progress.style.background = 'radial-gradient(circle at 30% 50%,#8b6f47,#6b5139)';
      selectbarPanel.classList.remove('expanded'); selectbarOverlay.classList.remove('visible'); selectbarOverlay.classList.add('hidden'); selectbarExpanded = false;
    });
  });
  document.addEventListener('click', (e) => {
    if (themeExpanded && !themePanel.contains(e.target)) { themePanel.classList.remove('expanded'); themeOverlay.classList.remove('visible'); themeOverlay.classList.add('hidden'); themeExpanded = false; }
    if (selectbarExpanded && !selectbarPanel.contains(e.target)) { selectbarPanel.classList.remove('expanded'); selectbarOverlay.classList.remove('visible'); selectbarOverlay.classList.add('hidden'); selectbarExpanded = false; }
  });

  // ---- Help button → Tour ----
  document.getElementById('helpBtn')?.addEventListener('click', () => {
    if (typeof TourModule !== 'undefined') TourModule.start(0);
  });

  // ---- Inline Templates button ----
  document.getElementById('templatesBtn')?.addEventListener('click', () => {
    if (typeof TemplatesModule !== 'undefined') TemplatesModule.showModal?.() ?? TemplatesModule.init?.();
  });

  // ---- Goal Settings Gear (Export/Import) ----
  document.getElementById('goalSettingsBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('goalSettingsDropdown')?.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.goal-settings-wrap')) {
      document.getElementById('goalSettingsDropdown')?.classList.add('hidden');
    }
  });

  document.getElementById('exportBtn')?.addEventListener('click', () => {
    const data = {
      goals: JSON.parse(localStorage.getItem('goals') || '[]'),
      categories: JSON.parse(localStorage.getItem('letsfocus_categories_v2') || '[]'),
      stats: JSON.parse(localStorage.getItem('letsfocus_stats') || '{}'),
      xp: JSON.parse(localStorage.getItem('letsfocus_xp') || '{}'),
      volumes: JSON.parse(localStorage.getItem('letsfocus_volumes') || '{}'),
      exportedAt: new Date().toISOString(),
      version: '2.1',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'letsfocus-backup.json'; a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importBtn')?.addEventListener('click', () => {
    document.getElementById('importFileInput')?.click();
  });

  document.getElementById('importFileInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const ok = await showConfirm('Import this backup? Your current data will be replaced.');
    if (!ok) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.goals)      localStorage.setItem('goals', JSON.stringify(data.goals));
      if (data.categories) localStorage.setItem('letsfocus_categories_v2', JSON.stringify(data.categories));
      if (data.stats)      localStorage.setItem('letsfocus_stats', JSON.stringify(data.stats));
      if (data.xp)         localStorage.setItem('letsfocus_xp', JSON.stringify(data.xp));
      if (data.volumes)    localStorage.setItem('letsfocus_volumes', JSON.stringify(data.volumes));
      showCustomAlert('✅ Import successful! Refreshing…');
      setTimeout(() => location.reload(), 1200);
    } catch(err) {
      showCustomAlert('❌ Invalid backup file. Please check the file and try again.');
    }
    e.target.value = '';
    e.target.value = '';
  });

  // ---- Daily Quote ----
  async function loadDailyQuote() {
    const el = document.getElementById('dailyQuoteText');
    const src = document.getElementById('dailyQuoteSource');
    if (!el) return;
    const cacheKey = 'letsfocus_daily_quote';
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    const today = new Date().toISOString().slice(0,10);
    if (cached && cached.date === today) {
      el.textContent = '"' + cached.text + '"';
      if (src) src.textContent = cached.author ? '— ' + cached.author : '';
      return;
    }
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 120,
          messages: [{ role: 'user', content: 'Give me one short inspiring quote about focus, productivity, or perseverance. Reply with only JSON: {"text":"...","author":"..."}' }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || '';
      const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());
      localStorage.setItem(cacheKey, JSON.stringify({ ...parsed, date: today }));
      el.textContent = '"' + parsed.text + '"';
      if (src) src.textContent = parsed.author ? '— ' + parsed.author : '';
    } catch(e) {
      const fallbacks = ["Focus is the art of knowing what to ignore.","One task at a time. One breath at a time.","Small consistent actions build extraordinary results."];
      el.textContent = '"' + fallbacks[Math.floor(Math.random()*fallbacks.length)] + '"';
      if (src) src.textContent = '';
    }
  }
  loadDailyQuote();


  // ---- Bootstrap all modules ----
  CategoriesModule.init();
  GoalsModule.init();
  TimerModule.init();
  MusicModule.init();
  StatsModule.init();
  DrinkModule.init();
  XPModule.init();
  TemplatesModule.init();
  TourModule.init();

}); // end letsfocus:ready

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
