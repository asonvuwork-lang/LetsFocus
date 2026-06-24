// =============================================
// GUIDED TOUR MODULE
// =============================================
const TourModule = (function () {

  const STORAGE_KEY = 'letsfocus_tour_done';

  const STEPS = [
    // ── 1. Welcome ─────────────────────────────────────────────────────────────
    {
      tab: 'goals',
      target: null,
      title: '☕ Welcome to LetsFocus!',
      text: 'Your personal focus café — where every work session brews something delicious. Let\'s take a quick tour of everything.',
      bullets: [
        '🎯 Set goals and focus with a timer',
        '☕ Earn beans and roll for collectible drinks',
        '🏅 Level up through 10 barista ranks',
        '🍵 Build a full collection of 27 unique drinks',
      ],
      position: 'center',
    },

    // ── 2. Adding goals ────────────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#newGoalInput',
      title: '✏️ Add Your First Goal',
      text: 'Type anything and press Enter — that\'s all it takes. The toolbar above has a few handy extras:',
      bullets: [
        '🏷️ Pick Category — colour + drink pairing for the goal',
        '📅 Deadline — shows up on the Deadlines tab with urgency colours',
        '🔁 Recurring goals auto-reset daily or weekly',
        '⚙ Export / Import all your data as a backup file',
      ],
      position: 'bottom',
    },

    // ── 3. List vs Board views ─────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#goalList',
      title: '☰ List & 📋 Board Views',
      text: 'Toggle between two views using the buttons above your goal list.',
      bullets: [
        '☰ List view — compact, sortable, filterable, drag-to-reorder',
        '📋 Board view — goals become sticky bills on a corkboard',
        '🎨 Bill colour matches the goal\'s category',
        '✓ Double-click a bill to mark it done; completed bills get a green stamp',
      ],
      position: 'center',
      beforeShow() {
        document.getElementById('viewListBtn')?.click();
      },
    },

    // ── 4. Templates ───────────────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#templatesBtn',
      title: '📋 Goal Templates',
      text: 'Don\'t want to start from scratch? Load a pre-built goal set in one click.',
      bullets: [
        '📚 Study Session, 💼 Work Day, 🏋️ Fitness Week',
        '🎨 Creative Sprint, 🧘 Personal Development, ☀️ Morning Routine',
        'Skips any duplicates — safe to load on an existing list',
      ],
      position: 'bottom',
    },

    // ── 5. Start a focus session ───────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#coffeeCup',
      title: '⏱ Start a Focus Session',
      text: 'Click the coffee cup to open the session setup. Two modes to choose from:',
      bullets: [
        '⚙ Custom time — set any HH : MM : SS you like',
        '🍅 Pomodoro — 25 min work → 5 min break × 4 cycles',
        '🥤 A drink fills up live as your session progresses',
        '⤢ Pop Out — open timer in a floating window to multitask',
      ],
      position: 'left',
    },

    // ── 6. Drink progress cup ───────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#coffeeCup',
      title: '🥤 Your Drink (or Cake!) Fills Up',
      text: 'During a session the drink fills from 0 % to 100 % as time ticks down. Special drinks reveal themselves in unique ways!',
      bullets: [
        '🎨 Drink type matches your goal\'s category (Study → Matcha, Work → Coffee…)',
        '⟳ Swap drink anytime without stopping the timer',
        '🎂 Unlock the code-exclusive Birthday Cake for a legendary 3-tier chocolate ganache experience',
        '✨ Hit 100 % — sparkle celebration animation fires',
      ],
      position: 'left',
    },

    // ── 7. Beans & Shop widget ─────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#shopSideWidget',
      title: '☕ Beans — Your Currency',
      text: 'Every minute of focus earns you beans. Completing goals and unlocking achievements earn bonus beans too.',
      bullets: [
        '⏱ 1 bean per minute focused',
        '🎯 +10 beans for completing a goal',
        '🏅 +25 beans per achievement unlocked',
        '🍅 +20 bonus beans for finishing a Pomodoro cycle',
      ],
      position: 'left',
    },

    // ── 8. Shop page — rolling for drinks ──────────────────────────────────────
    {
      tab: null,
      target: null,
      title: '🛒 The Shop — Roll for Drinks',
      text: 'Spend your beans here to roll for new collectible drinks and equipment upgrades.',
      bullets: [
        '🎰 Single roll costs 30 beans · 10× roll costs 250 (50 beans saved!)',
        '🌟 Drinks come in 5 rarities: Common → Uncommon → Rare → Epic → Legendary',
        '🔧 Equipment unlocks higher-tier recipe stages for your drinks',
        '🔁 Duplicate drinks refund 5 beans automatically',
      ],
      position: 'center',
      beforeShow() {
        const mainPage = document.getElementById('mainPage');
        const shopPage = document.getElementById('shopPage');
        if (mainPage && shopPage) {
          mainPage.classList.add('hidden');
          shopPage.classList.remove('hidden');
          if (typeof ShopModule !== 'undefined') ShopModule.renderShopTab();
        }
      },
    },

    // ── 9. My Collection ───────────────────────────────────────────────────────
    {
      tab: 'collection',
      target: '#tab-collection',
      title: '🍵 My Collection',
      text: 'Every drink you\'ve unlocked lives here — organised by rarity tier.',
      bullets: [
        '🟤 Common → 🟢 Uncommon → 🔵 Rare → 🟣 Epic → 🌟 Legendary',
        '27 drinks to collect across the whole game',
        '🔒 Locked drinks show as silhouettes — a hint of what\'s waiting',
        '👑 Each drink has 3 recipe stages: House → Signature → Mastercraft',
      ],
      position: 'center',
      beforeShow() {
        // Close shop page if it was open from the previous step
        const mainPage = document.getElementById('mainPage');
        const shopPage = document.getElementById('shopPage');
        if (shopPage && !shopPage.classList.contains('hidden')) {
          shopPage.classList.add('hidden');
          mainPage?.classList.remove('hidden');
        }
      },
    },

    // ── 10. Deadlines ──────────────────────────────────────────────────────────
    {
      tab: 'deadlines',
      target: '#tab-deadlines',
      title: '📅 Deadlines & Overdue Streak',
      text: 'Every goal with a deadline shows here with a live urgency colour. Miss too many and your XP starts dropping.',
      bullets: [
        '🟢 Safe · 🟡 Soon (≤3 days) · 🟠 Urgent (≤1 day) · 🔴 Overdue',
        '🔥 Overdue streak — consecutive overdue goals stack a penalty',
        '⚠️ Streak 1→2: −5 XP · Streak 5+: −35 XP per overdue goal',
        '💪 Completing a late goal still earns 50% Redemption XP',
      ],
      position: 'center',
    },

    // ── 11. Stats & XP ─────────────────────────────────────────────────────────
    {
      tab: 'stats',
      target: '#tab-stats',
      title: '📊 Stats & Barista Rank',
      text: 'Track your focus journey and watch your barista rank climb.',
      bullets: [
        '☕ XP for every minute focused, goal completed, and session finished',
        '🏅 10 ranks: Café Newcomer → Legend of the Brew',
        '📈 7-day bar chart of daily focus time',
        '☕ Drink Shelf — every completed session adds a mini cup to your wall',
      ],
      position: 'center',
    },

    // ── 12. Achievements ───────────────────────────────────────────────────────
    {
      tab: 'achievements',
      target: '#tab-achievements',
      title: '🏅 Achievements',
      text: '30 achievements across 6 categories. Each one you unlock gives +30 bonus XP.',
      bullets: [
        '🔥 Streak — 3, 7, 14, 30-day focus streaks',
        '⏱ Focus Time — 1h, 5h, 10h, 25h total focused',
        '🍅 Pomodoro — first cycle, 10 cycles, 50 cycles',
        '⏰ Deadlines — complete goals on time, recover from overdue streaks',
      ],
      position: 'center',
    },

    // ── 13. Categories ─────────────────────────────────────────────────────────
    {
      tab: 'categories',
      target: '#tab-categories',
      title: '🏷️ Categories',
      text: 'Categories give your goals a colour and a matching drink for your focus sessions.',
      bullets: [
        '🎨 Pick any colour — shows on goal cards, filter pills, and board bills',
        '🥤 Pair a drink — that drink fills during sessions using this category',
        '6 defaults (Study, Work, Fitness, Creative, Personal, Other) — add your own',
        '🔍 Filter your goal list by one or more categories at once',
      ],
      position: 'center',
    },

    // ── 14. Music & Sounds ─────────────────────────────────────────────────────
    {
      tab: 'music',
      target: '#tab-music',
      title: '🎵 Ambient Sounds',
      text: 'Layer up to 10 ambient sounds and save your favourite mix as a preset.',
      bullets: [
        '☕ Café — barista + keyboard + writing',
        '🌧 Rainy Day — soft rain + thunder + wind',
        '🌲 Forest — forest + wind + fireplace',
        '🎧 Deep Work — AC hum + keyboard + soft rain',
      ],
      position: 'center',
    },

    // ── 15. Help button / finish ────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#helpBtn',
      title: '❓ Replay This Tour Anytime',
      text: 'Click the ? button any time to restart this tour from step 1. A few keyboard shortcuts to remember on the timer page:',
      bullets: [
        'Space — pause / resume timer',
        'R — reset timer',
        'Esc — go back to goals',
        'Click any HH / MM / SS digit — edit inline',
      ],
      position: 'bottom',
    },
  ];

  let currentStep = 0;
  let overlay = null;
  let spotlight = null;
  let tooltip = null;

  function shouldAutoLaunch() {
    return !localStorage.getItem(STORAGE_KEY);
  }

  function markDone() {
    localStorage.setItem(STORAGE_KEY, '1');
  }

  function start(fromStep = 0) {
    if (overlay) stop();
    currentStep = fromStep;
    buildOverlay();
    showStep(currentStep);
  }

  function stop() {
    if (overlay) { overlay.remove(); overlay = null; }
    markDone();
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'tourOverlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:30000;pointer-events:none;
      transition:all 0.3s ease;
    `;

    // Dark backdrop (4 rects around spotlight)
    overlay.innerHTML = `
      <div id="tourBackdropTop"    class="tour-backdrop-piece"></div>
      <div id="tourBackdropBottom" class="tour-backdrop-piece"></div>
      <div id="tourBackdropLeft"   class="tour-backdrop-piece"></div>
      <div id="tourBackdropRight"  class="tour-backdrop-piece"></div>
      <div id="tourTooltip" class="tour-tooltip">
        <div class="tour-tooltip-step" id="tourStepCounter"></div>
        <div class="tour-tooltip-title" id="tourTitle"></div>
        <div class="tour-tooltip-text"  id="tourText"></div>
        <ul class="tour-bullets" id="tourBullets"></ul>
        <div class="tour-tooltip-actions">
          <button class="tour-btn-skip"  id="tourSkip">Skip Tour</button>
          <div class="tour-btn-row">
            <button class="tour-btn-prev" id="tourPrev">← Back</button>
            <button class="tour-btn-next" id="tourNext">Next →</button>
          </div>
        </div>
        <div class="tour-dots" id="tourDots"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Make buttons pointer-events active
    overlay.querySelector('#tourTooltip').style.pointerEvents = 'all';

    overlay.querySelector('#tourSkip').addEventListener('click', stop);
    overlay.querySelector('#tourPrev').addEventListener('click', () => { if (currentStep > 0) showStep(currentStep - 1); });
    overlay.querySelector('#tourNext').addEventListener('click', () => {
      if (currentStep < STEPS.length - 1) showStep(currentStep + 1);
      else stop();
    });

    // Dots
    const dotsEl = overlay.querySelector('#tourDots');
    STEPS.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'tour-dot';
      dot.addEventListener('click', () => showStep(i));
      dotsEl.appendChild(dot);
    });
  }

  function switchTab(tabName) {
    const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (btn && !btn.classList.contains('active')) btn.click();
  }

  function showStep(idx) {
    currentStep = idx;
    const step = STEPS[idx];

    // Run beforeShow action BEFORE switching tab / positioning
    if (typeof step.beforeShow === 'function') step.beforeShow();

    if (step.tab) switchTab(step.tab);

    overlay.querySelector('#tourStepCounter').textContent = `${idx + 1} / ${STEPS.length}`;
    overlay.querySelector('#tourTitle').textContent = step.title;
    overlay.querySelector('#tourText').textContent = step.text;

    // Bullets
    const bulletsEl = overlay.querySelector('#tourBullets');
    if (bulletsEl) {
      bulletsEl.innerHTML = '';
      if (step.bullets && step.bullets.length) {
        bulletsEl.style.display = 'block';
        step.bullets.forEach(b => {
          const li = document.createElement('li');
          li.className = 'tour-bullet';
          li.textContent = b;
          bulletsEl.appendChild(li);
        });
      } else {
        bulletsEl.style.display = 'none';
      }
    }

    overlay.querySelectorAll('.tour-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    overlay.querySelector('#tourPrev').style.visibility = idx === 0 ? 'hidden' : 'visible';
    overlay.querySelector('#tourNext').textContent = idx === STEPS.length - 1 ? 'Finish ✓' : 'Next →';
    // Give extra delay when beforeShow navigates pages (shop step needs layout time)
    const delay = step.beforeShow ? 420 : (step.tab ? 200 : 0);
    setTimeout(() => positionSpotlight(step), delay);
  }

  function positionSpotlight(step) {
    // null target or center position → centre spotlight (large circle in middle of screen)
    const el = (step.position === 'center' || !step.target) ? null : document.querySelector(step.target);
    const pad = 10;
    let rect;

    if (el) {
      rect = el.getBoundingClientRect();
      rect = {
        top:    rect.top    - pad,
        left:   rect.left   - pad,
        right:  rect.right  + pad,
        bottom: rect.bottom + pad,
        width:  rect.width  + pad * 2,
        height: rect.height + pad * 2,
      };
    } else {
      // Center spotlight — large circle in middle
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const r = 160;
      rect = { top: cy - r, left: cx - r, right: cx + r, bottom: cy + r, width: r*2, height: r*2 };
    }

    const W = window.innerWidth, H = window.innerHeight;

    // Position backdrop pieces
    setStyle('tourBackdropTop',    `left:0;top:0;width:${W}px;height:${Math.max(0,rect.top)}px;`);
    setStyle('tourBackdropBottom', `left:0;top:${rect.bottom}px;width:${W}px;height:${Math.max(0,H-rect.bottom)}px;`);
    setStyle('tourBackdropLeft',   `left:0;top:${rect.top}px;width:${Math.max(0,rect.left)}px;height:${rect.height}px;`);
    setStyle('tourBackdropRight',  `left:${rect.right}px;top:${rect.top}px;width:${Math.max(0,W-rect.right)}px;height:${rect.height}px;`);

    // Position tooltip
    const tip = overlay.querySelector('#tourTooltip');
    const tipW = 360, tipH = 280;
    let tx, ty;

    if (step.position === 'bottom' || rect.bottom + tipH + 16 < H) {
      ty = rect.bottom + 12;
    } else {
      ty = rect.top - tipH - 12;
    }
    if (step.position === 'left') {
      tx = rect.left - tipW - 12;
    } else {
      tx = Math.max(12, Math.min(rect.left + rect.width / 2 - tipW / 2, W - tipW - 12));
    }
    ty = Math.max(12, Math.min(ty, H - tipH - 12));

    tip.style.left = tx + 'px';
    tip.style.top  = ty + 'px';

    // Scroll target into view
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setStyle(id, css) {
    const el = overlay.querySelector('#' + id);
    if (el) el.style.cssText = 'position:fixed;background:rgba(20,10,5,0.72);transition:all 0.3s ease;pointer-events:all;' + css;
  }

  function init() {
    document.getElementById('helpBtn')?.addEventListener('click', () => start(0));
    if (shouldAutoLaunch()) setTimeout(() => start(0), 800);
  }

  return { init, start, stop };
})();
