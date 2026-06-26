// =============================================
// GUIDED TOUR MODULE
// =============================================
const TourModule = (function () {

  const STORAGE_KEY = 'letsfocus_tour_done';

  // NOTE: beforeShow callbacks are defined as functions here so they can
  // call switchTab() which is declared later in this same IIFE scope.
  // Steps use lazy evaluation — beforeShow is called at runtime, not parse time.

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
      target: '#viewListBtn',
      title: '☰ List & 📋 Board Views',
      text: 'Toggle between two views using these buttons above your goal list.',
      bullets: [
        '☰ List view — compact, sortable, filterable, drag-to-reorder',
        '📋 Board view — goals become sticky bills on a corkboard',
        '🎨 Bill colour matches the goal\'s category',
        '✓ Double-click a bill to mark it done; completed bills get a green stamp',
      ],
      position: 'bottom',
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
      text: 'During a session the drink fills from 0% to 100% as time ticks down. Special drinks reveal themselves in unique ways!',
      bullets: [
        '🎨 Drink type matches your goal\'s category (Study → Matcha, Work → Coffee…)',
        '⟳ Swap drink anytime without stopping the timer',
        '🎂 Unlock the code-exclusive Birthday Cake for a legendary 3-tier chocolate ganache experience',
        '✨ Hit 100% — sparkle celebration animation fires',
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
      target: '#shopTabContent',
      title: '🛒 The Shop — Today\'s Specials & Mystery Brews',
      text: 'Spend your beans here. The shop has two sections — daily deals and a gacha roll system.',
      bullets: [
        '🎲 4 daily slots refresh every midnight UTC — drinks & equipment at fixed prices',
        '💎 Rarity tiers: Common → Uncommon → Rare → Epic → Legendary',
        '🎰 Mystery Brews — roll ×1 for 30 beans or ×10 for 250 beans (50 saved!)',
        '🔧 Equipment unlocks higher Signature & Mastercraft recipe stages for your drinks',
      ],
      position: 'top',
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
      text: 'Every drink you\'ve unlocked lives here — organised by rarity tier on wooden shelves.',
      bullets: [
        '🟤 Common → 🟢 Uncommon → 🔵 Rare → 🟣 Epic → 🌟 Legendary',
        '27 drinks to collect across the whole game',
        '🔒 Locked drinks show as ??? silhouettes — a hint of what\'s waiting',
        '👑 Each drink has 3 recipe stages: House → Signature → Mastercraft',
      ],
      position: 'top',
      beforeShow() {
        const mainPage = document.getElementById('mainPage');
        const shopPage = document.getElementById('shopPage');
        if (shopPage && !shopPage.classList.contains('hidden')) {
          shopPage.classList.add('hidden');
          mainPage?.classList.remove('hidden');
        }
        switchTab('collection');
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
      position: 'top',
      beforeShow() {
        switchTab('deadlines');
      },
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
      position: 'top',
      beforeShow() {
        switchTab('stats');
      },
    },

    // ── 12. Achievements ───────────────────────────────────────────────────────
    {
      tab: 'achievements',
      target: '#tab-achievements',
      title: '🏅 Achievements',
      text: '30 achievements across 6 categories. Each one you unlock gives bonus XP and beans.',
      bullets: [
        '🔥 Streak — 3, 7, 14, 30-day focus streaks',
        '⏱ Focus Time — 1h, 5h, 10h, 25h total focused',
        '🍅 Pomodoro — first cycle, 10 cycles, 50 cycles',
        '⏰ Deadlines — complete goals on time, recover from overdue streaks',
      ],
      position: 'top',
      beforeShow() {
        switchTab('achievements');
      },
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
      position: 'top',
      beforeShow() {
        switchTab('categories');
      },
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
      position: 'top',
      beforeShow() {
        switchTab('music');
      },
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
      beforeShow() {
        switchTab('goals');
      },
    },
  ];

  let currentStep = 0;
  let overlay = null;

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
    overlay.style.cssText = 'position:fixed;inset:0;z-index:30000;pointer-events:none;';

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

    // Tooltip is interactive
    overlay.querySelector('#tourTooltip').style.pointerEvents = 'all';

    overlay.querySelector('#tourSkip').addEventListener('click', stop);
    overlay.querySelector('#tourPrev').addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
    overlay.querySelector('#tourNext').addEventListener('click', () => {
      if (currentStep < STEPS.length - 1) showStep(currentStep + 1);
      else stop();
    });

    // Progress dots
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

    // Run beforeShow FIRST — may navigate pages / switch tabs
    if (typeof step.beforeShow === 'function') step.beforeShow();

    // Then switch tab if specified and beforeShow didn't already handle it
    if (step.tab) switchTab(step.tab);

    // Update tooltip content
    overlay.querySelector('#tourStepCounter').textContent = `${idx + 1} / ${STEPS.length}`;
    overlay.querySelector('#tourTitle').textContent = step.title;
    overlay.querySelector('#tourText').textContent = step.text;

    // Bullets
    const bulletsEl = overlay.querySelector('#tourBullets');
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

    // Update dots and buttons
    overlay.querySelectorAll('.tour-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );
    overlay.querySelector('#tourPrev').style.visibility = idx === 0 ? 'hidden' : 'visible';
    overlay.querySelector('#tourNext').textContent =
      idx === STEPS.length - 1 ? 'Finish ✓' : 'Next →';

    // Delay before positioning: give layout time to settle
    // beforeShow steps (page nav / tab switch) need more time
    const delay = step.beforeShow ? 500 : (step.tab ? 300 : 50);
    setTimeout(() => positionSpotlight(step), delay);
  }

  function positionSpotlight(step) {
    const pad = 12;
    let el = null;

    if (step.target && step.position !== 'center') {
      el = document.querySelector(step.target);
    }

    // Zero-rect guard: treat hidden / zero-size elements as not found
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        el = null;
      }
    }

    let rect;
    if (el) {
      const r = el.getBoundingClientRect();
      rect = {
        top:    r.top    - pad,
        left:   r.left   - pad,
        right:  r.right  + pad,
        bottom: r.bottom + pad,
        width:  r.width  + pad * 2,
        height: r.height + pad * 2,
      };
    } else {
      // Centred fallback — large spotlight in middle of screen
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const r  = 180;
      rect = {
        top: cy - r, left: cx - r,
        right: cx + r, bottom: cy + r,
        width: r * 2, height: r * 2,
      };
    }

    const W = window.innerWidth;
    const H = window.innerHeight;

    // Clamp rect so backdrop pieces never go negative
    const rTop    = Math.max(0, rect.top);
    const rLeft   = Math.max(0, rect.left);
    const rRight  = Math.min(W, rect.right);
    const rBottom = Math.min(H, rect.bottom);

    setStyle('tourBackdropTop',
      `left:0;top:0;width:${W}px;height:${rTop}px;`);
    setStyle('tourBackdropBottom',
      `left:0;top:${rBottom}px;width:${W}px;height:${Math.max(0, H - rBottom)}px;`);
    setStyle('tourBackdropLeft',
      `left:0;top:${rTop}px;width:${rLeft}px;height:${rBottom - rTop}px;`);
    setStyle('tourBackdropRight',
      `left:${rRight}px;top:${rTop}px;width:${Math.max(0, W - rRight)}px;height:${rBottom - rTop}px;`);

    // ── Tooltip positioning ──────────────────────────────────────────────────
    const tip  = overlay.querySelector('#tourTooltip');
    const tipW = 380;
    const tipH = tip.offsetHeight || 300;

    let tx, ty;
    const pos = step.position || 'bottom';

    if (pos === 'center') {
      tx = Math.max(12, (W - tipW) / 2);
      ty = Math.max(12, (H - tipH) / 2 + 60);
    } else if (pos === 'top') {
      // Tooltip above the spotlight
      ty = Math.max(12, rTop - tipH - 16);
      tx = Math.max(12, Math.min(rLeft + (rRight - rLeft) / 2 - tipW / 2, W - tipW - 12));
      // If not enough room above, put it below
      if (ty < 12) {
        ty = rBottom + 12;
      }
    } else if (pos === 'bottom') {
      ty = rBottom + 12;
      tx = Math.max(12, Math.min(rLeft + (rRight - rLeft) / 2 - tipW / 2, W - tipW - 12));
      // If not enough room below, put it above
      if (ty + tipH > H - 12) {
        ty = Math.max(12, rTop - tipH - 16);
      }
    } else if (pos === 'left') {
      tx = Math.max(12, rLeft - tipW - 16);
      ty = Math.max(12, Math.min(rTop + (rBottom - rTop) / 2 - tipH / 2, H - tipH - 12));
      // If not enough room to the left, flip right
      if (tx < 12) {
        tx = rRight + 12;
      }
    } else if (pos === 'right') {
      tx = rRight + 12;
      ty = Math.max(12, Math.min(rTop + (rBottom - rTop) / 2 - tipH / 2, H - tipH - 12));
      if (tx + tipW > W - 12) {
        tx = Math.max(12, rLeft - tipW - 16);
      }
    } else {
      // Default: below
      ty = rBottom + 12;
      tx = Math.max(12, Math.min(rLeft + (rRight - rLeft) / 2 - tipW / 2, W - tipW - 12));
    }

    // Final clamp to keep tooltip on screen
    tx = Math.max(12, Math.min(tx, W - tipW - 12));
    ty = Math.max(12, Math.min(ty, H - tipH - 12));

    tip.style.left  = tx + 'px';
    tip.style.top   = ty + 'px';
    tip.style.width = tipW + 'px';

    // Scroll target into view if needed
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function setStyle(id, css) {
    const el = overlay && overlay.querySelector('#' + id);
    if (el) {
      el.style.cssText =
        'position:fixed;background:rgba(20,10,5,0.72);transition:all 0.25s ease;pointer-events:all;' + css;
    }
  }

  function init() {
    document.getElementById('helpBtn')?.addEventListener('click', () => start(0));
    if (shouldAutoLaunch()) setTimeout(() => start(0), 800);
  }

  return { init, start, stop };
})();
