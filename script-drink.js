// =============================================
// DRINK PROGRESS + BILL BOARD MODULE
// =============================================
const DrinkModule = (function () {

  // ---- Drink definitions ----
  const DRINKS = {
    '☕ Coffee': {
      label: '☕ Coffee',
      liquidColor: '#3d1f0a',
      liquidColor2: '#6b3a1f',
      foamColor: '#e8d5b0',
      cupTint: '#8b6030',
      bobas: false,
      hasFoam: true,
      hasIce: false,
    },
    '🍵 Matcha': {
      label: '🍵 Matcha',
      liquidColor: '#4a7c4e',
      liquidColor2: '#6aaa6e',
      foamColor: '#a8d5a2',
      cupTint: '#5a8a5a',
      bobas: false,
      hasFoam: true,
      hasIce: false,
    },
    '🧋 Milk Tea': {
      label: '🧋 Milk Tea',
      liquidColor: '#c4a882',
      liquidColor2: '#d4bc9a',
      foamColor: '#f0e6d0',
      cupTint: '#b89060',
      bobas: true,
      bobaColor: '#2a1a0a',
      hasFoam: false,
      hasIce: false,
    },
    '🍊 Orange Juice': {
      label: '🍊 Orange Juice',
      liquidColor: '#e8820a',
      liquidColor2: '#f0a030',
      foamColor: '#ffd580',
      cupTint: '#d4740a',
      bobas: false,
      hasFoam: false,
      hasIce: true,
    },
    '🫖 Chamomile Tea': {
      label: '🫖 Chamomile',
      liquidColor: '#c8a840',
      liquidColor2: '#dfc060',
      foamColor: '#f5e8a0',
      cupTint: '#b09030',
      bobas: false,
      hasFoam: false,
      hasIce: false,
    },
    '🥤 Smoothie': {
      label: '🥤 Smoothie',
      liquidColor: '#b050a0',
      liquidColor2: '#d070c0',
      foamColor: '#e0a0d8',
      cupTint: '#904090',
      bobas: false,
      hasFoam: true,
      hasIce: true,
    },
    '🍋 Lemonade': {
      label: '🍋 Lemonade',
      liquidColor: '#d4d820',
      liquidColor2: '#e8f040',
      foamColor: '#f8f8a0',
      cupTint: '#b0b818',
      bobas: false,
      hasFoam: false,
      hasIce: true,
    },
    '🎲 Random': {
      label: '🎲 Random',
      liquidColor: '#8b6f47',
      liquidColor2: '#a67c5a',
      foamColor: '#d4a574',
      cupTint: '#8b6f47',
      bobas: false,
      hasFoam: true,
      hasIce: false,
    },
  };

  const DRINK_KEYS = Object.keys(DRINKS).filter(k => k !== '🎲 Random');

  let currentDrink = null;
  let currentPct = 0;
  let isFinished = false;

  // ---- Pick drink from goal's category ----
  function pickDrinkForGoal(goalCategoryName) {
    if (goalCategoryName && typeof CategoriesModule !== 'undefined') {
      const drink = CategoriesModule.getDrink(goalCategoryName);
      if (drink && DRINKS[drink]) return drink;
    }
    // No category or no mapping — pick a truly random drink
    return DRINK_KEYS[Math.floor(Math.random() * DRINK_KEYS.length)];
  }

  function setDrink(drinkKey) {
    currentDrink = DRINKS[drinkKey] || DRINKS[DRINK_KEYS[Math.floor(Math.random() * DRINK_KEYS.length)]];
    currentPct = 0;
    isFinished = false;
    renderCup(0);   // show empty cup immediately
    updateLabel(0);
    const titleEl = document.getElementById('drinkProgressTitle');
    if (titleEl) titleEl.textContent = currentDrink.label;
  }

  function updateProgress(pct) {
    if (!currentDrink) return;
    currentPct = Math.max(0, Math.min(100, pct));
    renderCup(currentPct);
    updateLabel(currentPct);
    if (currentPct >= 100 && !isFinished) {
      isFinished = true;
      finishDrinkAnimation();
    }
  }

  function updateLabel(pct) {
    const el = document.getElementById('drinkProgressLabel');
    if (!el) return;
    if (pct === 0) el.textContent = 'Start your session to begin filling your drink';
    else if (pct < 25) el.textContent = `Just getting started — ${Math.round(pct)}% there`;
    else if (pct < 50) el.textContent = `Keep going — ${Math.round(pct)}% done ☕`;
    else if (pct < 75) el.textContent = `More than halfway — ${Math.round(pct)}% done, stay focused!`;
    else if (pct < 100) el.textContent = `Almost there — ${Math.round(pct)}% done, finish strong!`;
    else el.textContent = `🎉 Your drink is ready — session complete!`;
  }

  // ---- SVG cup renderer ----
  function renderCup(pct) {
    const scene = document.getElementById('drinkScene');
    if (!scene || !currentDrink) return;
    const d = currentDrink;

    // Cup geometry
    const W = 140, H = 180;
    const cupX = 20, cupW = 100;
    const cupTopY = 30, cupBottomY = 155;
    const cupH = cupBottomY - cupTopY;

    // Liquid fill level (fills from bottom)
    const fillH = (pct / 100) * (cupH - 20);
    const fillY = cupBottomY - fillH;

    // Clip path for liquid inside cup
    const boba = d.bobas ? generateBobas(cupX, fillY, cupW, fillH, d.bobaColor) : '';
    const ice = d.hasIce ? generateIce(cupX, fillY, cupW, d.cupTint) : '';
    const foam = d.hasFoam && pct > 5 ? `
      <ellipse cx="${cupX + cupW/2}" cy="${fillY + 2}" rx="${cupW*0.42}" ry="8"
        fill="${d.foamColor}" opacity="0.9"/>
      <ellipse cx="${cupX + cupW/2 - 12}" cy="${fillY}" rx="10" ry="6"
        fill="${d.foamColor}" opacity="0.7"/>
      <ellipse cx="${cupX + cupW/2 + 14}" cy="${fillY + 1}" rx="9" ry="5"
        fill="${d.foamColor}" opacity="0.75"/>` : '';

    // Finish sparkles
    const sparkles = pct >= 100 ? generateSparkles() : '';

    // Wave animation offset
    const wave = pct > 0 && pct < 100 ? `
      <animateTransform attributeName="transform" type="translate"
        values="0,0;4,0;0,0" dur="2s" repeatCount="indefinite"/>` : '';

    scene.innerHTML = `
      <svg viewBox="0 0 140 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:160px;margin:0 auto;display:block;">
        <defs>
          <clipPath id="cupClip">
            <polygon points="${cupX},${cupTopY} ${cupX+cupW},${cupTopY} ${cupX+cupW-8},${cupBottomY} ${cupX+8},${cupBottomY}"/>
          </clipPath>
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${d.liquidColor}"/>
            <stop offset="100%" stop-color="${d.liquidColor2}"/>
          </linearGradient>
          <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${d.cupTint}44"/>
            <stop offset="50%" stop-color="${d.cupTint}22"/>
            <stop offset="100%" stop-color="${d.cupTint}44"/>
          </linearGradient>
        </defs>

        <!-- Cup shadow -->
        <ellipse cx="70" cy="${cupBottomY + 8}" rx="44" ry="6" fill="rgba(0,0,0,0.12)"/>

        <!-- Cup body (glass look) -->
        <polygon points="${cupX},${cupTopY} ${cupX+cupW},${cupTopY} ${cupX+cupW-8},${cupBottomY} ${cupX+8},${cupBottomY}"
          fill="rgba(245,241,235,0.15)" stroke="${d.cupTint}" stroke-width="2.5" stroke-linejoin="round"/>

        <!-- Liquid fill -->
        ${pct > 0 ? `
        <g clip-path="url(#cupClip)">
          <rect x="${cupX}" y="${fillY}" width="${cupW}" height="${fillH + 10}"
            fill="url(#liquidGrad)" opacity="0.88">
            ${wave}
          </rect>
          ${boba}
          ${ice}
          ${foam}
        </g>` : ''}

        <!-- Cup glass sheen -->
        <polygon points="${cupX},${cupTopY} ${cupX+cupW},${cupTopY} ${cupX+cupW-8},${cupBottomY} ${cupX+8},${cupBottomY}"
          fill="url(#cupGrad)" stroke="none"/>

        <!-- Cup rim -->
        <line x1="${cupX}" y1="${cupTopY}" x2="${cupX+cupW}" y2="${cupTopY}"
          stroke="${d.cupTint}" stroke-width="3" stroke-linecap="round"/>

        <!-- Straw (for milk tea / smoothie / lemonade) -->
        ${d.bobas || d.hasIce ? `
        <rect x="88" y="${cupTopY - 22}" width="5" height="${Math.min(fillH + 22, cupH + 22)}"
          rx="2.5" fill="#c4a882" opacity="0.85"/>
        <rect x="89" y="${cupTopY - 22}" width="2" height="${Math.min(fillH + 22, cupH + 22)}"
          rx="1" fill="rgba(255,255,255,0.3)"/>` : ''}

        <!-- Lid (for cup-style drinks) -->
        ${!d.bobas && !d.hasIce ? `
        <rect x="${cupX - 2}" y="${cupTopY - 8}" width="${cupW + 4}" height="8"
          rx="4" fill="${d.cupTint}" opacity="0.6"/>` : ''}

        ${sparkles}

        <!-- Progress % label inside cup -->
        ${pct > 15 ? `
        <text x="70" y="${Math.max(fillY + 18, cupBottomY - 10)}"
          text-anchor="middle" font-family="Playfair Display, serif"
          font-size="13" font-weight="600" fill="rgba(255,255,255,0.85)">
          ${Math.round(pct)}%
        </text>` : ''}
      </svg>`;
  }

  function generateBobas(cupX, fillY, cupW, fillH, color) {
    if (fillH < 10) return '';
    const bobas = [];
    const positions = [
      [cupX+15, 8], [cupX+30, 12], [cupX+50, 6], [cupX+65, 10], [cupX+80, 8],
      [cupX+20, 20], [cupX+45, 18], [cupX+70, 22], [cupX+35, 28], [cupX+60, 25],
    ];
    positions.forEach(([bx, offset]) => {
      const by = Math.min(fillY + fillH - offset, fillY + fillH - 5);
      if (by > fillY) {
        bobas.push(`<circle cx="${bx}" cy="${by}" r="5" fill="${color}" opacity="0.9"/>
          <circle cx="${bx-1}" cy="${by-1}" r="1.5" fill="rgba(255,255,255,0.2)"/>`);
      }
    });
    return bobas.join('');
  }

  function generateIce(cupX, fillY, cupW, tint) {
    return `
      <rect x="${cupX+12}" y="${fillY+5}" width="18" height="12" rx="3"
        fill="rgba(220,240,255,0.7)" stroke="rgba(180,220,255,0.5)" stroke-width="1" transform="rotate(-8,${cupX+21},${fillY+11})"/>
      <rect x="${cupX+40}" y="${fillY+8}" width="16" height="10" rx="3"
        fill="rgba(220,240,255,0.65)" stroke="rgba(180,220,255,0.5)" stroke-width="1" transform="rotate(5,${cupX+48},${fillY+13})"/>
      <rect x="${cupX+65}" y="${fillY+4}" width="20" height="13" rx="3"
        fill="rgba(220,240,255,0.72)" stroke="rgba(180,220,255,0.5)" stroke-width="1" transform="rotate(-5,${cupX+75},${fillY+10})"/>`;
  }

  function generateSparkles() {
    return `
      <g class="drink-sparkles">
        <text x="18" y="22" font-size="14" opacity="0.9">✨</text>
        <text x="108" y="18" font-size="12" opacity="0.85">⭐</text>
        <text x="60" y="12" font-size="10" opacity="0.8">✦</text>
        <text x="28" y="42" font-size="11" opacity="0.7">✧</text>
        <text x="100" y="38" font-size="13" opacity="0.75">✨</text>
      </g>`;
  }

  function finishDrinkAnimation() {
    const scene = document.getElementById('drinkScene');
    if (!scene) return;
    scene.style.filter = 'drop-shadow(0 0 12px rgba(212,165,116,0.6))';
    scene.style.transition = 'filter 0.5s ease';
    setTimeout(() => { if (scene) scene.style.filter = ''; }, 2000);
  }

  // ---- Swap drink picker ----
  function showDrinkPicker() {
    const existing = document.getElementById('drinkPickerModal');
    if (existing) { existing.remove(); return; }

    const modal = document.createElement('div');
    modal.id = 'drinkPickerModal';
    modal.style.cssText = `position:fixed;inset:0;background:rgba(74,52,41,0.5);backdrop-filter:blur(4px);z-index:15000;display:flex;align-items:center;justify-content:center;padding:20px;`;

    const box = document.createElement('div');
    box.style.cssText = `background:rgba(245,241,235,0.98);border-radius:18px;padding:1.8rem;max-width:380px;width:100%;box-shadow:0 16px 40px rgba(139,111,71,0.3);border:2px solid rgba(139,111,71,0.2);`;
    box.innerHTML = `
      <h3 style="font-family:'Playfair Display',serif;color:#4a3429;text-align:center;margin-bottom:1rem;">Choose Your Drink</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${DRINK_KEYS.map(k => `
          <button class="drink-pick-btn" data-key="${k}" style="padding:10px;border-radius:12px;border:1.5px solid rgba(139,111,71,0.25);background:rgba(245,241,235,0.7);color:#4a3429;font-family:'Playfair Display',serif;font-size:0.9rem;cursor:pointer;transition:all 0.2s ease;text-align:left;">
            ${k}
          </button>`).join('')}
      </div>
      <button id="drinkPickCancel" style="display:block;width:100%;margin-top:12px;padding:8px;border:none;background:none;color:rgba(107,81,57,0.6);font-family:'Playfair Display',serif;cursor:pointer;">Cancel</button>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    box.querySelectorAll('.drink-pick-btn').forEach(btn => {
      btn.addEventListener('mouseover', () => { btn.style.background = 'rgba(237,228,211,1)'; btn.style.borderColor = '#8b6f47'; });
      btn.addEventListener('mouseout',  () => { btn.style.background = 'rgba(245,241,235,0.7)'; btn.style.borderColor = 'rgba(139,111,71,0.25)'; });
      btn.addEventListener('click', () => {
        setDrink(btn.dataset.key);
        renderCup(currentPct);
        modal.remove();
      });
    });

    box.querySelector('#drinkPickCancel').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  // ---- Bill Board ----
  // Bill colors per category — pulled from CategoriesModule, with defaults
  const DEFAULT_BILL_COLORS = [
    '#f9e4b7', '#fcd5ce', '#d4e8c2', '#c9e4f0', '#e8d4f0', '#fce4c9', '#d4f0e8', '#f0e4d4',
  ];

  function getBillColor(categoryName) {
    if (categoryName && typeof CategoriesModule !== 'undefined') {
      const cat = CategoriesModule.getByName(categoryName);
      if (cat) {
        // Lighten the category color for the bill background
        return hexToLightBill(cat.color);
      }
    }
    return DEFAULT_BILL_COLORS[Math.floor(Math.random() * DEFAULT_BILL_COLORS.length)];
  }

  function hexToLightBill(hex) {
    // Parse hex and make it very light (mix with white)
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const lr = Math.round(r * 0.25 + 235 * 0.75);
    const lg = Math.round(g * 0.25 + 228 * 0.75);
    const lb = Math.round(b * 0.25 + 211 * 0.75);
    return `rgb(${lr},${lg},${lb})`;
  }

  function renderBillBoard() {
    const board = document.getElementById('billBoard');
    if (!board) return;
    const goals = typeof GoalsModule !== 'undefined' ? GoalsModule.getGoals() : [];
    board.innerHTML = '';

    if (!goals.length) {
      board.innerHTML = `<div class="bill-empty">No goals yet — add some goals to see your order board!</div>`;
      return;
    }

    // Assign stable random rotation per goal id
    goals.forEach((goal, idx) => {
      const bill = document.createElement('div');
      const color = getBillColor(goal.category);
      const rot = ((goal.id % 1000) % 7) - 3; // deterministic rotation -3 to +3 deg
      const catColor = goal.category && typeof CategoriesModule !== 'undefined'
        ? CategoriesModule.getColor(goal.category)
        : '#8b6f47';

      bill.className = `bill-card ${goal.completed ? 'bill-done' : ''}`;
      bill.style.cssText = `
        background:${color};
        transform:rotate(${rot}deg);
        border-left:4px solid ${catColor || '#8b6f47'};
      `;
      bill.dataset.goalId = goal.id;

      bill.innerHTML = `
        <div class="bill-pin" style="background:${catColor || '#c0392b'}"></div>
        <div class="bill-text ${goal.completed ? 'bill-text-done' : ''}">${goal.text}</div>
        ${goal.category ? `<div class="bill-cat" style="color:${catColor};opacity:0.7;">${goal.category}</div>` : ''}
        ${goal.subgoals && goal.subgoals.length ? `
          <div class="bill-subcount">${goal.subgoals.filter(s=>s.completed).length}/${goal.subgoals.length} done</div>` : ''}
        ${goal.completed ? '<div class="bill-stamp">✓</div>' : ''}
      `;

      // Click to toggle completion
      bill.addEventListener('click', () => {
        const goals = GoalsModule.getGoals();
        const g = goals.find(g => String(g.id) === String(goal.id));
        if (!g) return;
        g.completed = !g.completed;
        if (g.subgoals) g.subgoals.forEach(sg => sg.completed = g.completed);
        // Save via GoalsModule
        if (typeof GoalsModule !== 'undefined') {
          GoalsModule.updateMainProgress();
          GoalsModule.renderGoals();
          GoalsModule.renderDeadlinesTab();
        }
        renderBillBoard();
      });

      board.appendChild(bill);
    });
  }

  function clearDoneBills() {
    if (typeof GoalsModule === 'undefined') return;
    const goals = GoalsModule.getGoals();
    // Remove completed goals from the board visually — they stay in goals list
    // Just re-render (user can clear from goals tab)
    showCustomAlert('To permanently remove completed goals, use "Clear All" in the Goals tab after they\'re all done. The board reflects your goals list.');
  }

  // ---- Init ----
  function init() {
    // Drink swap button
    document.getElementById('drinkSwapBtn')?.addEventListener('click', showDrinkPicker);

    // Bill board clear button
    document.getElementById('billBoardClearBtn')?.addEventListener('click', clearDoneBills);

    // Render board initially and whenever goals tab is active
    renderBillBoard();

    // Re-render bill board when goals change (hook into tab clicks)
    document.querySelectorAll('.tab-btn[data-tab="goals"]').forEach(btn => {
      btn.addEventListener('click', () => setTimeout(renderBillBoard, 100));
    });
  }

  // Called by TimerModule when session starts with a goal
  function onSessionStart(goalCategoryName) {
    const drinkKey = pickDrinkForGoal(goalCategoryName);
    setDrink(drinkKey);
  }

  // Called by TimerModule every tick with current progress pct
  function onProgressUpdate(pct) {
    updateProgress(pct);
  }

  return { init, onSessionStart, onProgressUpdate, renderBillBoard };
})();
