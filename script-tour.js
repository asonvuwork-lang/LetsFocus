// =============================================
// GUIDED TOUR MODULE
// =============================================
const TourModule = (function () {

  const STORAGE_KEY = 'letsfocus_tour_done';

  const STEPS = [
    {
      tab: 'goals',
      target: '#tab-goals',
      title: '☕ Welcome to LetsFocus!',
      text: 'Your personal focus café. Add goals, run timed sessions, and level up as a barista the more you work.',
      bullets: ['✏️ Add and organise goals by category', '⏱ Start focus sessions with the coffee cup', '📋 See your goals as bills on the order board'],
      position: 'center',
    },
    {
      tab: 'goals',
      target: '#newGoalInput',
      title: '✏️ Add a Goal',
      text: 'Type a goal and press Enter. You can also:',
      bullets: ['📁 Assign a category for colour + drink pairing', '↺ Set it to repeat daily or weekly', '📅 Add a deadline so it shows up in the Deadlines tab'],
      position: 'bottom',
    },
    {
      tab: 'goals',
      target: '#billBoard',
      title: '📋 Order Board',
      text: 'Every goal appears here as a sticky bill — just like a café order board.',
      bullets: ['🎨 Bill colour matches the goal\'s category', '📌 Click any bill to toggle it done', '✓ Completed bills get a green stamp'],
      position: 'left',
    },
    {
      tab: 'goals',
      target: '#coffeeCup',
      title: '⏱ Start a Focus Session',
      text: 'Click the coffee cup to kick off a timed session.',
      bullets: ['🍅 Choose Custom time or Pomodoro (25/5 cycles)', '🎵 Pick ambient sounds or a preset', '🥤 A drink fills up as you focus — based on your goal\'s category'],
      position: 'left',
    },
    {
      tab: 'deadlines',
      target: '#tab-deadlines',
      title: '📅 Deadlines & Overdue Streak',
      text: 'Goals with deadlines appear here with urgency colours. Watch out for the overdue streak!',
      bullets: ['🟢 Green = safe  🟡 Amber = soon  🔴 Red = overdue', '🔥 Overdue streak = consecutive overdue goals', '⚠️ The higher your overdue streak, the more XP you lose per overdue goal', '💪 Completing a late goal still earns Redemption XP'],
      position: 'center',
    },
    {
      tab: 'stats',
      target: '#tab-stats',
      title: '📊 Stats & XP System',
      text: 'Track your focus journey and level up your barista rank!',
      bullets: ['☕ Earn XP for every minute focused and every goal completed', '🏅 Level up through 10 barista ranks — from Café Newcomer to Legend of the Brew', '⚡ XP log shows today\'s and last 7 days\' activity', '🏆 Unlock achievements for special milestones'],
      position: 'center',
    },
    {
      tab: 'stats',
      target: '#achievementsList',
      title: '🏅 Achievements',
      text: 'Unlock badges for reaching milestones. Each unlocked achievement also gives +30 bonus XP.',
      bullets: ['🌅 Early Bird — 5 sessions before noon', '🔥 On Fire — 7-day streak', '⚡ Speed Run — 3 goals in one day', '🍅 Pomodoro Pro — 10 full Pomodoro cycles', '💪 Comeback Kid — recover from a 3+ overdue streak'],
      position: 'center',
    },
    {
      tab: 'categories',
      target: '#tab-categories',
      title: '🏷️ Categories',
      text: 'Create categories with custom colours and drink pairings.',
      bullets: ['🎨 Pick any colour — it shows on goal cards, filter tags, and bill board', '🥤 Map a drink to the category — your session drink changes accordingly', '↺ Recurring goals keep their category across resets'],
      position: 'center',
    },
    {
      tab: 'music',
      target: '#tab-music',
      title: '🎵 Music & Sounds',
      text: 'Set up ambient sounds for deep focus.',
      bullets: ['☕ Café — coffee + keyboard + writing', '🌧 Rainy Day — rain + thunder + wind', '🌲 Forest — forest + wind + fire', '🎧 Deep Work — AC + keyboard + soft rain'],
      position: 'center',
    },
    {
      tab: 'goals',
      target: '#helpBtn',
      title: '❓ Always Here to Help',
      text: 'Click ? any time to replay this tour. Keyboard shortcuts work on the timer page:',
      bullets: ['Space — pause / resume', 'R — reset timer', 'Esc — back to goals', 'Click any digit — edit the time inline'],
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
    setTimeout(() => positionSpotlight(step), step.tab ? 200 : 0);
  }

  function positionSpotlight(step) {
    const el = step.position === 'center' ? null : document.querySelector(step.target);
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
    const tipW = 320, tipH = 220;
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
