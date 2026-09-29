// =============================================
// MAIN / SHARED UTILITIES
// =============================================

// ---- Shared dialog helpers (global scope for all modules) ----
function showActionDialog(message, mode) {
  return new Promise(resolve=>{
    const previous=document.activeElement,dialog=document.createElement('dialog');dialog.className='main-action-dialog';
    const text=document.createElement('p');text.textContent=message;dialog.setAttribute('aria-label',mode==='confirm'?'Confirm action':mode==='prompt'?'Enter a response':'Message');dialog.append(text);
    let input;if(mode==='prompt'){input=document.createElement('input');input.type='text';input.setAttribute('aria-label',message);dialog.append(input);}
    const buttons=document.createElement('div');buttons.className='main-action-buttons';
    let settled=false;function finish(value){if(settled)return;settled=true;dialog.close();dialog.remove();if(previous?.isConnected)previous.focus({preventScroll:true});resolve(value);}
    if(mode!=='alert'){const cancel=document.createElement('button');cancel.textContent=mode==='confirm'?'Cancel':'Cancel';cancel.onclick=()=>finish(mode==='confirm'?false:null);buttons.append(cancel);}
    const ok=document.createElement('button');ok.textContent=mode==='confirm'?'Confirm':'OK';const accept=()=>finish(mode==='prompt'?input.value:true);ok.onclick=accept;buttons.append(ok);dialog.append(buttons);
    dialog.addEventListener('cancel',e=>{e.preventDefault();finish(mode==='confirm'?false:mode==='prompt'?null:true);});
    dialog.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&e.target===input){e.preventDefault();accept();}});
    document.body.append(dialog);dialog.showModal();(input||buttons.firstElementChild).focus();
  });
}
function showCustomAlert(message){return showActionDialog(message,'alert');}
function showCustomPrompt(message){return showActionDialog(message,'prompt');}
function showConfirm(message){return showActionDialog(message,'confirm');}

// ---- Celebration — Coffee Shop Sign Flip ----
function triggerCelebration() {
  playCompletionChime();
  showCoffeeShopClosing();
}

function playCompletionChime() {
  if (typeof TimerModule !== 'undefined' && TimerModule.playChime) {
    TimerModule.playChime();
  }
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

  // Auth init
  if (typeof AuthModule !== 'undefined') {
    AuthModule.init();
  } else {
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
      if (tab === 'collection') { if (typeof CollectionModule !== 'undefined') CollectionModule.renderCollectionTab(); }
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

  // ---- Shop + Collection ----
  if (typeof ShopModule !== 'undefined') { ShopModule.init(); ShopModule.updateBeanDisplay(); }
  if (typeof CollectionModule !== 'undefined') CollectionModule.init();
  if (typeof DrinkShelfModule !== 'undefined') DrinkShelfModule.init();

  // ---- List / Board toggle ----
  const _lBtn  = document.getElementById('viewListBtn');
  const _bBtn  = document.getElementById('viewBoardBtn');
  const _lView = document.getElementById('goalListView');
  const _bView = document.getElementById('goalBoardView');

  const _fBtn = document.getElementById('viewFocusBtn');
  function selectGoalView(view) {
    const focus = document.getElementById('focusNextCard');
    [[_lBtn,_lView,'list'],[_bBtn,_bView,'board'],[_fBtn,focus,'focus']].forEach(([button,panel,name]) => {
      const active = view === name;
      panel?.classList.toggle('goal-view-hidden', !active);
      button?.classList.toggle('active', active);
      button?.setAttribute('aria-pressed', String(active));
    });
    if (view === 'board') {
      if (typeof DrinkModule !== 'undefined') DrinkModule.renderBillBoard();
      if (typeof GoalsModule !== 'undefined') GoalsModule.applyPriorityOutlinesToBoard();
    }
  }
  _lBtn?.addEventListener('click', () => selectGoalView('list'));
  _bBtn?.addEventListener('click', () => selectGoalView('board'));
  _fBtn?.addEventListener('click', () => selectGoalView('focus'));
  selectGoalView('list');

  // ---- Shop full page ----
  function openShopPage() {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('shopPage').classList.remove('hidden');
    if (typeof ShopModule !== 'undefined') ShopModule.renderShopTab();
  }
  function closeShopPage() {
    document.getElementById('shopPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
  }
  document.getElementById('openShopPageBtn')?.addEventListener('click', openShopPage);
  document.getElementById('backFromShop')?.addEventListener('click', closeShopPage);

}); // end letsfocus:ready

// ============================================================
// FIRST-VISIT MANUAL
// ============================================================
(function migrateOldTourKey() {
  if (localStorage.getItem('letsfocus_visited') && !localStorage.getItem('letsfocus_tour_done')) {
    localStorage.setItem('letsfocus_tour_done', '1');
  }
  localStorage.removeItem('letsfocus_visited');
})();
