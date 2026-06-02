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

  // Persistent positions stored per goal id
  const POSITIONS_KEY = 'letsfocus_bill_positions';
  function loadPositions() { try { return JSON.parse(localStorage.getItem(POSITIONS_KEY)||'{}'); } catch(e) { return {}; } }
  function savePositions(p) { try { localStorage.setItem(POSITIONS_KEY, JSON.stringify(p)); } catch(e) {} }

  function getCatColor(categoryName) {
    if (categoryName && typeof CategoriesModule !== 'undefined') {
      const cat = CategoriesModule.getByName(categoryName);
      if (cat) return cat.color;
    }
    return DEFAULT_BILL_COLORS[Math.abs(Math.round(categoryName?.charCodeAt(0)||Math.random()*999)) % DEFAULT_BILL_COLORS.length];
  }

  function hexToLightBill(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.round(r*0.35+235*0.65)},${Math.round(g*0.35+228*0.65)},${Math.round(b*0.35+211*0.65)})`;
  }

  function renderBillBoard() {
    const board = document.getElementById('billBoard');
    if (!board) return;
    const goals = typeof GoalsModule !== 'undefined' ? GoalsModule.getGoals() : [];
    board.innerHTML = '';

    if (!goals.length) {
      board.innerHTML = `<div class="bill-empty">Add goals to see them pinned here!</div>`;
      return;
    }

    const positions = loadPositions();
    const boardW = board.offsetWidth || board.parentElement?.offsetWidth || 400;
    const boardH = Math.max(280, goals.length * 60);
    board.style.height = boardH + 'px';
    board.style.position = 'relative';
    board.style.overflowY = 'auto';
    board.style.overflowX = 'hidden';

    goals.forEach((goal, idx) => {
      const catColor = getCatColor(goal.category);
      const lightColor = catColor.startsWith('#') ? hexToLightBill(catColor) : catColor;
      const pinColor = catColor.startsWith('#') ? catColor : '#c0392b';

      // Stable default position — grid layout
      const cols = Math.max(2, Math.floor((boardW - 20) / 65));
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const defaultX = 12 + col * 65;
      const defaultY = 20 + row * 75;

      const pos = positions[goal.id] || { x: defaultX, y: defaultY };

      const note = document.createElement('div');
      note.className = `bill-square ${goal.completed ? 'bill-square-done' : ''}`;
      note.dataset.goalId = goal.id;
      note.title = goal.text + (goal.category ? ' · ' + goal.category : '');
      note.style.cssText = `
        position:absolute;
        left:${pos.x}px; top:${pos.y}px;
        width:52px; height:52px;
        background:${lightColor};
        border-radius:4px;
        box-shadow: 2px 3px 8px rgba(0,0,0,0.35);
        cursor:grab;
        user-select:none;
        transition: box-shadow 0.15s ease, transform 0.15s ease;
        z-index:1;
      `;

      // Pin
      note.innerHTML = `
        <div class="bill-sq-pin" style="background:${pinColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(0,0,0,0.2);"></div>
        ${goal.completed ? '<div class="bill-sq-check">✓</div>' : ''}
      `;

      // Double-click to toggle done
      note.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const g = GoalsModule.getGoals().find(g => String(g.id) === String(goal.id));
        if (!g) return;
        g.completed = !g.completed;
        if (g.subgoals) g.subgoals.forEach(sg => sg.completed = g.completed);
        GoalsModule.updateMainProgress(); GoalsModule.renderGoals(); GoalsModule.renderDeadlinesTab();
        renderBillBoard();
      });

      // Free drag
      let dragging = false, startX, startY, origX, origY;
      note.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        origX = parseInt(note.style.left); origY = parseInt(note.style.top);
        note.style.cursor = 'grabbing';
        note.style.zIndex = '100';
        note.style.boxShadow = '4px 6px 16px rgba(0,0,0,0.5)';
        note.style.transform = 'scale(1.08) rotate(2deg)';
        e.preventDefault();
      });
      document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        const nx = Math.max(0, Math.min(boardW - 56, origX + dx));
        const ny = Math.max(0, origY + dy);
        note.style.left = nx + 'px'; note.style.top = ny + 'px';
        // Expand board height if dragged down
        if (ny + 60 > board.scrollHeight) board.style.height = (ny + 80) + 'px';
      });
      document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        note.style.cursor = 'grab';
        note.style.zIndex = '1';
        note.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.35)';
        note.style.transform = '';
        // Save position
        const p = loadPositions();
        p[goal.id] = { x: parseInt(note.style.left), y: parseInt(note.style.top) };
        savePositions(p);
      });

      // Touch drag
      note.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        startX = t.clientX; startY = t.clientY;
        origX = parseInt(note.style.left); origY = parseInt(note.style.top);
        note.style.zIndex = '100'; note.style.transform = 'scale(1.08)';
        dragging = true;
      }, { passive: true });
      note.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        const t = e.touches[0];
        const nx = Math.max(0, Math.min(boardW - 56, origX + t.clientX - startX));
        const ny = Math.max(0, origY + t.clientY - startY);
        note.style.left = nx + 'px'; note.style.top = ny + 'px';
        e.preventDefault();
      }, { passive: false });
      note.addEventListener('touchend', () => {
        dragging = false; note.style.zIndex = '1'; note.style.transform = '';
        const p = loadPositions();
        p[goal.id] = { x: parseInt(note.style.left), y: parseInt(note.style.top) };
        savePositions(p);
      });

      // Single click → show detail popover
      note.addEventListener('click', (e) => {
        e.stopPropagation();
        showBillPopover(goal, note);
      });

      board.appendChild(note);
    });
  }

  function showBillPopover(goal, noteEl) {
    document.getElementById('billPopover')?.remove();
    const board = noteEl.closest('.bill-board-corkboard');
    if (!board) return;

    const subDone  = (goal.subgoals || []).filter(s => s.completed).length;
    const subTotal = (goal.subgoals || []).length;

    const pop = document.createElement('div');
    pop.id = 'billPopover';
    pop.className = 'bill-popover';
    pop.innerHTML = `
      <button class="bill-pop-close">✕</button>
      <div class="bill-pop-title">${goal.text}</div>
      ${goal.category ? `<span class="bill-pop-cat">${goal.category}</span>` : ''}
      ${goal.deadline ? `<div class="bill-pop-deadline">📅 ${new Date(goal.deadline + 'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>` : ''}
      ${subTotal ? `<div class="bill-pop-sub">${subDone}/${subTotal} subgoals done</div>` : ''}
      ${subTotal ? `<div class="bill-pop-sublist">${(goal.subgoals||[]).map(sg =>
        `<div class="bill-pop-subitem${sg.completed ? ' done' : ''}">${sg.completed ? '✓' : '○'} ${sg.text}</div>`
      ).join('')}</div>` : ''}
      <button class="bill-pop-done-btn">${goal.completed ? '↩ Mark Undone' : '✓ Mark Done'}</button>
    `;

    const boardRect = board.getBoundingClientRect();
    const noteRect  = noteEl.getBoundingClientRect();
    const left = Math.min(noteRect.left - boardRect.left + 64, boardRect.width - 230);
    const top  = noteRect.top - boardRect.top - 8;
    pop.style.cssText = `position:absolute;left:${Math.max(4,left)}px;top:${Math.max(4,top)}px;z-index:500;`;
    board.appendChild(pop);

    pop.querySelector('.bill-pop-close').addEventListener('click', (e) => {
      e.stopPropagation(); pop.remove();
    });
    pop.querySelector('.bill-pop-done-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const g = GoalsModule.getGoals().find(x => String(x.id) === String(goal.id));
      if (!g) return;
      g.completed = !g.completed;
      if (g.subgoals) g.subgoals.forEach(sg => sg.completed = g.completed);
      GoalsModule.updateMainProgress();
      GoalsModule.renderGoals();
      renderBillBoard();
      pop.remove();
    });

    setTimeout(() => {
      document.addEventListener('click', function h(e) {
        if (!pop.contains(e.target)) { pop.remove(); document.removeEventListener('click', h); }
      });
    }, 10);
  }

  function clearDoneBills() {
    if (typeof GoalsModule === 'undefined') return;
    const goals = GoalsModule.getGoals();
    const positions = loadPositions();
    goals.filter(g => g.completed).forEach(g => delete positions[g.id]);
    savePositions(positions);
    renderBillBoard();
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
