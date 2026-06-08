// =============================================
// DRINK PROGRESS + BILL BOARD MODULE
// =============================================
const DrinkModule = (function () {

  // ---- Equipment ID map: shop IDs → Gemini recipe names ----
  const EQUIP_ID_MAP = {
    espresso_machine: 'EspressoMachine',
    frother:          'MilkFrother',
    steam_wand:       'SteamWand',
    syrup_shelf:      'SyrupShelf',
    ice_bucket:       'IceBucket',
    boba_cooker:      'BobaCooker',
    pour_over:        'PourOverSet',
    cold_brew_tower:  'ColdBrewTower',
    siphon:           'SiphonBrewer',
    oat_dispenser:    'OatMilkDispenser',
    petal_press:      'PetalPress',
    gold_flake:       'GoldFlakeJar',
    crushed_ice:      'CrushedIceMaker',
  };

  // ---- Drink key (emoji or shop ID) → DRINK_RECIPES key ----
  const DRINK_KEY_TO_RECIPE = {
    '☕ Coffee':        'espresso',
    '🍵 Matcha':        'matchaLatte',
    '🧋 Milk Tea':      'brownSugarBoba',
    '🍊 Orange Juice':  null,
    '🫖 Chamomile Tea': null,
    '🥤 Smoothie':      null,
    '🍋 Lemonade':      null,
    // Shop drinks — original 20
    espresso:           'espresso',
    americano:          'americano',
    flat_white:         'flatWhite',
    hot_choc:           'hotChocolate',
    matcha_latte:       'matchaLatte',
    egg_coffee:         'eggCoffee',
    boba:               'brownSugarBoba',
    caramel_mac:        'caramelMacchiato',
    ca_phe_sua_da:      'caPhedaSuaDa',
    lavender_latte:     'lavenderHoneyLatte',
    dalgona:            'dalgonaCoffee',
    iced_matcha:        'icedMatcha',
    rose_gold:          'roseGoldLatte',
    galaxy_brew:        'galaxyColdBrew',
    midnight_esp:       'midnightEspresso',
    cherry_blossom:     'cherryBlossomLatte',
    barista_secret:     'baristasSecretBrew',
    golden_hour:        'goldenHourLatte',
    aurora_brew:        'auroraBrew',
    the_void:           'theVoid',
    // New drinks added in updated recipe file
    latte:              'latte',
    cappuccino:         'cappuccino',
    mocha:              'mocha',
    macchiato:          'macchiato',
    irish_coffee:       'irishCoffee',
    vienna_coffee:      'viennaCoffee',
    affogato:           'affogato',
  };

  // ---- Shop drink ID → closest base visual key (for cup look) ----
  const SHOP_ID_TO_VISUAL = {
    espresso: '☕ Coffee', americano: '☕ Coffee', flat_white: '☕ Coffee',
    hot_choc: '☕ Coffee', matcha_latte: '🍵 Matcha', egg_coffee: '_egg_coffee',
    boba: '🧋 Milk Tea', caramel_mac: '_caramel_mac', ca_phe_sua_da: '_ca_phe_sua_da',
    lavender_latte: '🍵 Matcha', dalgona: '_dalgona', iced_matcha: '_iced_matcha',
    rose_gold: '🥤 Smoothie', galaxy_brew: '☕ Coffee', midnight_esp: '☕ Coffee',
    cherry_blossom: '🥤 Smoothie', barista_secret: '🍋 Lemonade',
    golden_hour: '☕ Coffee', aurora_brew: '🧋 Milk Tea', the_void: '☕ Coffee',
    latte: '☕ Coffee', cappuccino: '☕ Coffee', mocha: '☕ Coffee',
    macchiato: '☕ Coffee', irish_coffee: '_irish_coffee',
    vienna_coffee: '☕ Coffee', affogato: '🍊 Orange Juice',
  };

  // ---- Drink definitions ----
  const DRINKS = {
    '☕ Coffee': {
      label: '☕ Coffee', type: 'coffee',
      liquidColor: '#3d1f0a', liquidColor2: '#6b3a1f',
      foamColor: '#e8d5b0', cupTint: '#8b6030',
      bobas: false, hasFoam: true, hasIce: false,
    },
    '🍵 Matcha': {
      label: '🍵 Matcha', type: 'matcha',
      liquidColor: '#4a7c4e', liquidColor2: '#6aaa6e',
      foamColor: '#a8d5a2', cupTint: '#5a8a5a',
      bobas: false, hasFoam: true, hasIce: false,
    },
    '🧋 Milk Tea': {
      label: '🧋 Milk Tea', type: 'milktea',
      liquidColor: '#c4a882', liquidColor2: '#d4bc9a',
      foamColor: '#f0e6d0', cupTint: '#b89060',
      bobas: true, bobaColor: '#2a1a0a',
      hasFoam: true, hasIce: false,          // cream layer on top
    },
    '🍊 Orange Juice': {
      label: '🍊 Orange Juice', type: 'oj',
      liquidColor: '#e8820a', liquidColor2: '#f0a030',
      foamColor: '#ffd580', cupTint: '#d4740a',
      bobas: false, hasFoam: false, hasIce: true,
    },
    '🫖 Chamomile Tea': {
      label: '🫖 Chamomile', type: 'chamomile',
      liquidColor: '#c8a840', liquidColor2: '#dfc060',
      foamColor: '#f5e8a0', cupTint: '#b09030',
      bobas: false, hasFoam: false, hasIce: false,
    },
    '🥤 Smoothie': {
      label: '🥤 Smoothie', type: 'smoothie',
      liquidColor: '#b050a0', liquidColor2: '#d070c0',
      foamColor: '#e0a0d8', cupTint: '#904090',
      bobas: false, hasFoam: true, hasIce: true,
    },
    '🍋 Lemonade': {
      label: '🍋 Lemonade', type: 'lemonade',
      liquidColor: '#d4d820', liquidColor2: '#e8f040',
      foamColor: '#f8f8a0', cupTint: '#b0b818',
      bobas: false, hasFoam: false, hasIce: true,
    },
    '🎲 Random': {
      label: '🎲 Random', type: 'coffee',
      liquidColor: '#8b6f47', liquidColor2: '#a67c5a',
      foamColor: '#d4a574', cupTint: '#8b6f47',
      bobas: false, hasFoam: true, hasIce: false,
    },
    // ---- Shop drink visual entries ----
    _ca_phe_sua_da: {
      label: 'Cà Phê Sữa Đá', type: 'ca_phe_sua_da',
      liquidColor: '#140904', liquidColor2: '#fce8b3',
      foamColor: '#fce8b3', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: true,
    },
    _dalgona: {
      label: 'Dalgona', type: 'dalgona',
      liquidColor: '#f8f4ee', liquidColor2: '#c87d2a',
      foamColor: '#d4922a', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: true,
    },
    _egg_coffee: {
      label: 'Egg Coffee', type: 'egg_coffee',
      liquidColor: '#1c0a04', liquidColor2: '#f5d070',
      foamColor: '#f5d070', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: false,
    },
    _iced_matcha: {
      label: 'Iced Matcha', type: 'iced_matcha',
      liquidColor: '#3a7040', liquidColor2: '#f5f0e8',
      foamColor: '#a8d5a2', cupTint: '#5a8a5a',
      bobas: false, hasFoam: false, hasIce: true,
    },
    _caramel_mac: {
      label: 'Caramel Macchiato', type: 'caramel_mac',
      liquidColor: '#2a1208', liquidColor2: '#f5ede0',
      foamColor: '#f0e6d0', cupTint: '#b89060',
      bobas: false, hasFoam: true, hasIce: false,
    },
    _irish_coffee: {
      label: 'Irish Coffee', type: 'irish_coffee',
      liquidColor: '#1e0d08', liquidColor2: '#f8f2e8',
      foamColor: '#f8f2e8', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: false,
    },
  };

  const DRINK_KEYS = Object.keys(DRINKS).filter(k => k !== '🎲 Random' && !k.startsWith('_'));

  let currentDrink  = null;
  let currentDrinkId = null;   // tracks the actual key for recipe lookup
  let currentPct    = 0;
  let isFinished    = false;

  // ---- Recipe tier resolution ----
  function getCurrentTierConfig(recipeKey) {
    if (!recipeKey || typeof DRINK_RECIPES === 'undefined') return null;
    const recipe = DRINK_RECIPES[recipeKey];
    if (!recipe) return null;
    const ownedEquip = (typeof ShopModule !== 'undefined' ? ShopModule.getOwned().equipment : null) || [];
    const ownedGemini = ownedEquip.map(id => EQUIP_ID_MAP[id]).filter(Boolean);
    const hasAll = (reqs) => !reqs || reqs.every(r => ownedGemini.includes(r));
    if (recipe.mastercraft && hasAll(recipe.mastercraft.requires)) return { tier: 'mastercraft', ...recipe.mastercraft };
    if (recipe.signature  && hasAll(recipe.signature.requires))  return { tier: 'signature',  ...recipe.signature  };
    return { tier: 'house', ...recipe.house };
  }

  // Returns the highest step config whose threshold ≤ pct
  function getStepConfig(tierCfg, pct) {
    if (!tierCfg?.steps) return null;
    const thresholds = Object.keys(tierCfg.steps).map(Number).sort((a, b) => a - b);
    let chosen = thresholds[0];
    for (const t of thresholds) { if (pct >= t) chosen = t; else break; }
    return tierCfg.steps[chosen] || null;
  }

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
    currentDrinkId = drinkKey;
    // If key is a shop ID rather than an emoji key, map to the visual DRINKS entry
    const visualKey = DRINKS[drinkKey] ? drinkKey : (SHOP_ID_TO_VISUAL[drinkKey] || DRINK_KEYS[Math.floor(Math.random() * DRINK_KEYS.length)]);
    currentDrink = DRINKS[visualKey] || DRINKS[DRINK_KEYS[Math.floor(Math.random() * DRINK_KEYS.length)]];
    currentPct = 0;
    isFinished = false;
    renderCup(0);
    updateLabel(0);
    // Update title — prefer the recipe name if available
    const titleEl = document.getElementById('drinkProgressTitle');
    if (titleEl) {
      const recipeKey = DRINK_KEY_TO_RECIPE[drinkKey];
      const tierCfg   = recipeKey ? getCurrentTierConfig(recipeKey) : null;
      const tierBadge = tierCfg?.tier === 'mastercraft' ? ' 👑' : tierCfg?.tier === 'signature' ? ' ✦' : '';
      titleEl.textContent = currentDrink.label + tierBadge;
    }
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

    // Try recipe step label first
    const recipeKey = DRINK_KEY_TO_RECIPE[currentDrinkId] || null;
    const tierCfg   = recipeKey ? getCurrentTierConfig(recipeKey) : null;
    if (tierCfg) {
      const stepCfg = getStepConfig(tierCfg, pct);
      if (stepCfg?.label) {
        const prefix = tierCfg.tier === 'mastercraft' ? '👑 ' : tierCfg.tier === 'signature' ? '✦ ' : '☕ ';
        el.textContent = prefix + stepCfg.label;
        return;
      }
    }

    // Generic fallback
    if (pct === 0)        el.textContent = 'Start your session to begin filling your drink';
    else if (pct < 25)    el.textContent = `Just getting started — ${Math.round(pct)}% there`;
    else if (pct < 50)    el.textContent = `Keep going — ${Math.round(pct)}% done ☕`;
    else if (pct < 75)    el.textContent = `More than halfway — ${Math.round(pct)}% done, stay focused!`;
    else if (pct < 100)   el.textContent = `Almost there — ${Math.round(pct)}% done, finish strong!`;
    else                  el.textContent = `🎉 Your drink is ready — session complete!`;
  }

  // ---- Animation-offset helper ----
  // Returns a CSS animation-delay that makes animations appear to have been
  // running since before the render, so they look continuous across re-renders.
  function ao(dur) {
    return `-${((Date.now() / 1000) % dur).toFixed(2)}s`;
  }

  // ---- Sinusoidal wave path ----
  // Extends 16 px beyond the cup edges so the translate animation never shows a gap.
  function wavePath(fillY, amp, flipPhase) {
    const x0 = 4, x1 = 136, mid = 70, bot = 165;
    const a = flipPhase ? -amp : amp;
    return `M${x0},${fillY} Q${(x0+mid)/2},${fillY-a} ${mid},${fillY} Q${(mid+x1)/2},${fillY+a} ${x1},${fillY} L${x1},${bot} L${x0},${bot} Z`;
  }

  // ---- Per-drink animation config ----
  const DRINK_ANIM = {
    coffee:    { waveAmp: 3, waveSpeed: 4.0, steam: true  },
    matcha:    { waveAmp: 2, waveSpeed: 5.5, steam: true  },
    milktea:   { waveAmp: 4, waveSpeed: 3.0, steam: false },
    oj:        { waveAmp: 5, waveSpeed: 2.5, steam: false },
    chamomile: { waveAmp: 2, waveSpeed: 6.0, steam: true  },
    smoothie:  { waveAmp: 1, waveSpeed: 8.0, steam: false },
    lemonade:  { waveAmp: 5, waveSpeed: 2.0, steam: false },
  };

  // ---- CSS keyframes embedded per SVG ----
  // ---- Inject drink animation keyframes into document head (once only) ----
  // Defined globally so they persist across SVG re-renders instead of
  // being discarded and restarted every second when scene.innerHTML is replaced.
  let _stylesInjected = false;
  function injectDrinkStyles(wAmp, wSpd) {
    // Remove stale injected sheet if wave params changed (drink swap)
    const prev = document.getElementById('lfDrinkStyles');
    if (prev) {
      // Only re-inject if params actually changed
      if (prev.dataset.amp === String(wAmp) && prev.dataset.spd === String(wSpd)) return;
      prev.remove();
    }
    const tx = wAmp * 2.5;
    const style = document.createElement('style');
    style.id = 'lfDrinkStyles';
    style.dataset.amp = wAmp;
    style.dataset.spd = wSpd;
    style.textContent = `
      @keyframes lfW1 { 0%,100%{transform:translateX(-${tx}px)} 50%{transform:translateX(${tx}px)} }
      @keyframes lfW2 { 0%,100%{transform:translateX(${tx}px)} 50%{transform:translateX(-${tx}px)} }
      @keyframes lfBoba { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      @keyframes lfSteam { 0%{opacity:0;transform:translateY(0) scaleX(1)} 40%{opacity:0.75} 100%{opacity:0;transform:translateY(-26px) scaleX(2)} }
      @keyframes lfBub { 0%{opacity:0.85;transform:translateY(0)} 85%{opacity:0.4} 100%{opacity:0;transform:translateY(-55px)} }
      @keyframes lfSwirl { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes lfIce1 { 0%,100%{transform:rotate(-8deg) translateY(0)} 50%{transform:rotate(-8deg) translateY(-2.5px)} }
      @keyframes lfIce2 { 0%,100%{transform:rotate(5deg) translateY(0)} 50%{transform:rotate(5deg) translateY(-3px)} }
      @keyframes lfIce3 { 0%,100%{transform:rotate(-5deg) translateY(0)} 50%{transform:rotate(-5deg) translateY(-1.5px)} }
      @keyframes lfIceDrop { from{transform:translateY(-22px);opacity:0} to{transform:translateY(0);opacity:1} }
      @keyframes lfPour { 0%,100%{opacity:0.55;transform:translateX(-1px)} 50%{opacity:0.82;transform:translateX(1px)} }
      @keyframes sparkle { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
    `;
    document.head.appendChild(style);
  }

  // drinkStyles is now only used for the SVG <defs> section (no keyframes needed there)
  function drinkStyles() { return ''; }

  // ---- Straw ----
  function buildStraw(fillH, CTY, CBY) {
    const sh = Math.min(fillH + 26, CBY - CTY + 26);
    return `
      <rect x="88" y="${CTY - 22}" width="5" height="${sh}" rx="2.5" fill="#c4a882" opacity="0.85"/>
      <rect x="89" y="${CTY - 22}" width="2" height="${sh}" rx="1" fill="rgba(255,255,255,0.3)"/>`;
  }

  // ---- Lid (hot drinks) ----
  function buildLid(CX, CW, CTY, tint) {
    return `<rect x="${CX-2}" y="${CTY-8}" width="${CW+4}" height="8" rx="4" fill="${tint}" opacity="0.6"/>`;
  }

  // ---- Foam — unique style per drink type ----
  function buildFoam(type, fillY, CX, CW, foamColor) {
    const cx = CX + CW / 2;
    if (type === 'coffee') return `
      <ellipse cx="${cx}" cy="${fillY+2}" rx="${CW*0.44}" ry="7.5" fill="${foamColor}" opacity="0.88"/>
      <ellipse cx="${cx-14}" cy="${fillY}" rx="10" ry="6" fill="${foamColor}" opacity="0.70"/>
      <ellipse cx="${cx+16}" cy="${fillY+1}" rx="9" ry="5.5" fill="${foamColor}" opacity="0.72"/>
      <ellipse cx="${cx}" cy="${fillY+2}" rx="${CW*0.28}" ry="4" fill="rgba(255,255,255,0.12)"/>`;
    if (type === 'matcha') {
      const dots = Array.from({length: 14}, (_, i) =>
        `<circle cx="${CX + 5 + i * 7}" cy="${fillY + (i % 3) * 1.5}" r="${2.2 - (i%3)*0.3}" fill="${foamColor}" opacity="${0.85 - (i%3)*0.1}"/>`
      ).join('');
      return `<ellipse cx="${cx}" cy="${fillY+3}" rx="${CW*0.42}" ry="7" fill="${foamColor}" opacity="0.62"/>${dots}`;
    }
    if (type === 'milktea') return `
      <ellipse cx="${cx}" cy="${fillY+2}" rx="${CW*0.43}" ry="8" fill="${foamColor}" opacity="0.85"/>
      <ellipse cx="${cx-14}" cy="${fillY}" rx="12" ry="6.5" fill="${foamColor}" opacity="0.62"/>
      <ellipse cx="${cx+16}" cy="${fillY+1}" rx="10" ry="5.5" fill="${foamColor}" opacity="0.68"/>`;
    if (type === 'smoothie') return `
      <ellipse cx="${cx}" cy="${fillY+1}" rx="${CW*0.46}" ry="10" fill="${foamColor}" opacity="0.92"/>
      <ellipse cx="${cx}" cy="${fillY-1}" rx="${CW*0.36}" ry="6.5" fill="${foamColor}" opacity="0.72"/>
      <ellipse cx="${cx-20}" cy="${fillY-2}" rx="13" ry="5.5" fill="${foamColor}" opacity="0.65"/>
      <ellipse cx="${cx+22}" cy="${fillY-2}" rx="12" ry="5" fill="${foamColor}" opacity="0.68"/>
      <ellipse cx="${cx}" cy="${fillY-3}" rx="${CW*0.22}" ry="4" fill="rgba(255,255,255,0.18)"/>`;
    // chamomile / fallback
    return `
      <ellipse cx="${cx}" cy="${fillY+2}" rx="${CW*0.38}" ry="6" fill="${foamColor}" opacity="0.80"/>
      <ellipse cx="${cx-12}" cy="${fillY}" rx="8" ry="4.5" fill="${foamColor}" opacity="0.60"/>`;
  }

  // ---- Steam wisps (hot drinks, above cup rim) ----
  function buildSteam(type, CTY) {
    const sc = {
      coffee:    'rgba(220,195,165,0.52)',
      matcha:    'rgba(155,210,155,0.50)',
      chamomile: 'rgba(230,205,115,0.50)',
    }[type] || 'rgba(200,200,200,0.45)';
    const y = CTY;
    return `
      <path d="M52,${y-3} C49,${y-13} 55,${y-20} 51,${y-29}"
        stroke="${sc}" stroke-width="2.5" fill="none" stroke-linecap="round"
        style="animation:lfSteam 2.5s ease-out infinite ${ao(2.5)}"/>
      <path d="M70,${y-6} C67,${y-16} 74,${y-23} 69,${y-33}"
        stroke="${sc}" stroke-width="2.5" fill="none" stroke-linecap="round"
        style="animation:lfSteam 2.8s ease-out infinite ${ao(2.8)}"/>
      <path d="M88,${y-3} C91,${y-12} 85,${y-20} 89,${y-30}"
        stroke="${sc}" stroke-width="2.5" fill="none" stroke-linecap="round"
        style="animation:lfSteam 2.2s ease-out infinite ${ao(2.2)}"/>`;
  }

  // ---- Bobas with bounce animation ----
  function generateBobas(CX, fillY, CW, fillH, color) {
    if (fillH < 10) return '';
    const positions = [
      [CX+15, 8], [CX+30, 12], [CX+50,  6], [CX+65, 10], [CX+80,  8],
      [CX+20, 20],[CX+45, 18], [CX+70, 22], [CX+35, 28], [CX+60, 25],
    ];
    return positions.map(([bx, offset], i) => {
      const by = Math.min(fillY + fillH - offset, fillY + fillH - 5);
      if (by <= fillY) return '';
      const dur = 1.8 + (i % 3) * 0.4;
      return `<g style="animation:lfBoba ${dur}s ease-in-out infinite ${ao(dur)}">
        <circle cx="${bx}" cy="${by}" r="5" fill="${color}" opacity="0.9"/>
        <circle cx="${bx-1}" cy="${by-1}" r="1.5" fill="rgba(255,255,255,0.2)"/>
      </g>`;
    }).join('');
  }

  // ---- Pour stream (visible while drink is actively filling) ----
  function buildPourStream(liquidColor, fillY, CTY) {
    const streamH = Math.max(0, fillY - CTY - 6);
    if (streamH < 10) return '';
    return `
      <g style="animation:lfPour 1.4s ease-in-out infinite ${ao(1.4)}">
        <path d="M72,${CTY+4} C71,${CTY+streamH*0.35} 73,${CTY+streamH*0.65} 72,${fillY-2}"
          stroke="${liquidColor}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.68"/>
        <ellipse cx="72" cy="${fillY}" rx="6" ry="1.5" fill="${liquidColor}" opacity="0.42"/>
      </g>`;
  }

  // ---- Ice cubes — drop animation on first appearance (pct 20-36), float after ----
  function generateIceWithDrop(CX, fillY, pct) {
    const isDropPhase = pct >= 20 && pct < 37;
    const a1 = isDropPhase ? `lfIceDrop 0.45s ease-out forwards` : `lfIce1 3.0s ease-in-out infinite ${ao(3.0)}`;
    const a2 = isDropPhase ? `lfIceDrop 0.45s ease-out 0.12s forwards` : `lfIce2 3.8s ease-in-out infinite ${ao(3.8)}`;
    const a3 = isDropPhase ? `lfIceDrop 0.45s ease-out 0.22s forwards` : `lfIce3 3.2s ease-in-out infinite ${ao(3.2)}`;
    if (pct < 20) return '';
    return `
      <g style="animation:${a1}">
        <rect x="${CX+12}" y="${fillY+5}" width="18" height="12" rx="3"
          fill="rgba(210,240,255,0.72)" stroke="rgba(180,220,255,0.55)" stroke-width="1"/>
        <line x1="${CX+15}" y1="${fillY+8}" x2="${CX+20}" y2="${fillY+15}" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
      </g>
      <g style="animation:${a2}">
        <rect x="${CX+40}" y="${fillY+8}" width="16" height="10" rx="3"
          fill="rgba(210,240,255,0.68)" stroke="rgba(180,220,255,0.5)" stroke-width="1"/>
        <line x1="${CX+43}" y1="${fillY+11}" x2="${CX+47}" y2="${fillY+16}" stroke="rgba(255,255,255,0.30)" stroke-width="1"/>
      </g>
      <g style="animation:${a3}">
        <rect x="${CX+65}" y="${fillY+4}" width="20" height="13" rx="3"
          fill="rgba(210,240,255,0.72)" stroke="rgba(180,220,255,0.55)" stroke-width="1"/>
        <line x1="${CX+68}" y1="${fillY+7}" x2="${CX+74}" y2="${fillY+15}" stroke="rgba(255,255,255,0.32)" stroke-width="1"/>
      </g>`;
  // ---- Ice cubes with float animation ----
  function generateIce(CX, fillY) {
    return `
      <g style="animation:lfIce1 3.0s ease-in-out infinite ${ao(3.0)}">
        <rect x="${CX+12}" y="${fillY+5}" width="18" height="12" rx="3"
          fill="rgba(210,240,255,0.72)" stroke="rgba(180,220,255,0.55)" stroke-width="1"/>
        <line x1="${CX+15}" y1="${fillY+8}" x2="${CX+20}" y2="${fillY+15}" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
      </g>
      <g style="animation:lfIce2 3.8s ease-in-out infinite ${ao(3.8)}">
        <rect x="${CX+40}" y="${fillY+8}" width="16" height="10" rx="3"
          fill="rgba(210,240,255,0.68)" stroke="rgba(180,220,255,0.5)" stroke-width="1"/>
        <line x1="${CX+43}" y1="${fillY+11}" x2="${CX+47}" y2="${fillY+16}" stroke="rgba(255,255,255,0.30)" stroke-width="1"/>
      </g>
      <g style="animation:lfIce3 3.2s ease-in-out infinite ${ao(3.2)}">
        <rect x="${CX+65}" y="${fillY+4}" width="20" height="13" rx="3"
          fill="rgba(210,240,255,0.72)" stroke="rgba(180,220,255,0.55)" stroke-width="1"/>
        <line x1="${CX+68}" y1="${fillY+7}" x2="${CX+74}" y2="${fillY+15}" stroke="rgba(255,255,255,0.32)" stroke-width="1"/>
      </g>`;
  }

  // ---- Liquid layers (rendered inside cup clipPath) ----
  function buildLiquid(d, type, fillY, fillH, CX, CW, CBY, liquidFill, foamColor, pct, wAmp, wSpd) {
    const wOff1 = ao(wSpd), wOff2 = ao(wSpd * 1.3);
    const wP1 = wavePath(fillY, wAmp, false);
    const wP2 = wavePath(fillY, wAmp, true);
    const BUBBLE_SIZES = [2, 2.5, 2, 1.8, 2.5, 1.5, 2.2];

    // --- Layered drinks: rendered with distinct bands instead of a wave fill ---
    // These drinks don't use the standard wave system
    if (type === 'ca_phe_sua_da') {
      // Three bands: condensed milk (bottom 30%) → ice (middle 25%) → dark coffee (top 45%)
      const milkH   = fillH * 0.30, milkY  = CBY - fillH * 0.30;
      const iceH    = fillH * 0.25, iceY   = CBY - fillH * 0.55;
      const coffeeH = fillH * 0.45, coffeeY = fillY;
      const showIce    = pct > 30;
      const showCoffee = pct > 55;
      return `
        <rect x="${CX}" y="${milkY}" width="${CW}" height="${milkH+5}" fill="#fce8b3" opacity="0.95"/>
        ${showIce ? `
          <rect x="${CX}" y="${iceY}" width="${CW}" height="${iceH+5}" fill="#e8f4fb" opacity="0.88"/>
          ${generateIceWithDrop(CX, iceY + 4, pct)}` : ''}
        ${showCoffee ? `
          <rect x="${CX}" y="${coffeeY}" width="${CW}" height="${coffeeH+5}" fill="#140904" opacity="0.92"/>
          <path d="${wavePath(coffeeY, 3, false)}" fill="#1f0d06" opacity="0.6"
            style="animation:lfW1 4s ease-in-out infinite ${wOff1}"/>
          <ellipse cx="${CX+CW/2}" cy="${coffeeY+4}" rx="${CW*0.35}" ry="4" fill="rgba(100,50,10,0.25)"/>` : ''}
        ${buildFoam(type, fillY, CX, CW, '#fce8b3')}`;
    }

    if (type === 'dalgona') {
      // Cold milk base (bottom 65%) + thick caramel foam on top (top 35%)
      const milkH  = fillH * 0.65, milkY = CBY - milkH;
      const foamH  = fillH * 0.35, foamTopY = fillY;
      return `
        <rect x="${CX}" y="${milkY}" width="${CW}" height="${milkH+5}" fill="#f8f4ee" opacity="0.92"/>
        <path d="${wavePath(milkY, 2, false)}" fill="#f0e8dc" opacity="0.6"
          style="animation:lfW1 5s ease-in-out infinite ${wOff1}"/>
        ${pct > 25 ? generateIceWithDrop(CX, milkY + 8, pct) : ''}
        ${pct > 55 ? `
          <rect x="${CX}" y="${foamTopY}" width="${CW}" height="${foamH+5}" fill="#c87d2a" opacity="0.9"/>
          <path d="${wavePath(foamTopY, 2, true)}" fill="#b06820" opacity="0.7"
            style="animation:lfW2 6s ease-in-out infinite ${wOff2}"/>
          <ellipse cx="${CX+CW/2}" cy="${foamTopY+3}" rx="${CW*0.42}" ry="8" fill="#d4922a" opacity="0.8"/>
          <ellipse cx="${CX+CW/2}" cy="${foamTopY+1}" rx="${CW*0.30}" ry="5" fill="rgba(255,220,160,0.25)"/>` : ''}`;
    }

    if (type === 'egg_coffee') {
      // Dark espresso base (bottom 65%) + thick yellow custard top (35%)
      const espH   = fillH * 0.65, espY = CBY - espH;
      const custardY = fillY;
      return `
        <rect x="${CX}" y="${espY}" width="${CW}" height="${espH+5}" fill="#1c0a04" opacity="0.95"/>
        <path d="${wavePath(espY, 3, false)}" fill="#2a1008" opacity="0.65"
          style="animation:lfW1 4s ease-in-out infinite ${wOff1}"/>
        <ellipse cx="${CX+CW/2}" cy="${espY+4}" rx="${CW*0.36}" ry="4" fill="rgba(140,60,10,0.28)"/>
        ${pct > 58 ? `
          <rect x="${CX}" y="${custardY}" width="${CW}" height="${fillH*0.35+5}" fill="#f5d070" opacity="0.92"/>
          <path d="${wavePath(custardY, 2, true)}" fill="#e8c040" opacity="0.65"
            style="animation:lfW2 5s ease-in-out infinite ${wOff2}"/>
          <ellipse cx="${CX+CW/2}" cy="${custardY+3}" rx="${CW*0.40}" ry="7" fill="#fbe898" opacity="0.72"/>` : ''}`;
    }

    if (type === 'iced_matcha') {
      // White oat milk base (bottom 55%) + matcha cloud diffusing down from top
      const milkH = fillH * 0.55, milkY = CBY - milkH;
      const matchaY = fillY;
      const diffuse = Math.min(1, Math.max(0, (pct - 50) / 45)); // 0 at 50%, 1 at 95%
      return `
        <rect x="${CX}" y="${milkY}" width="${CW}" height="${milkH+5}" fill="#f5f0e8" opacity="0.92"/>
        <path d="${wavePath(milkY, 2, false)}" fill="#ede8dc" opacity="0.6"
          style="animation:lfW1 5s ease-in-out infinite ${wOff1}"/>
        ${pct > 25 ? generateIceWithDrop(CX, milkY + 6, pct) : ''}
        ${pct > 48 ? `
          <rect x="${CX}" y="${matchaY}" width="${CW}" height="${fillH*0.45+5}" fill="#3a7040" opacity="${0.7 + diffuse*0.2}"/>
          <path d="${wavePath(matchaY, 2, true)}" fill="#2e6030" opacity="0.6"
            style="animation:lfW2 4.5s ease-in-out infinite ${wOff2}"/>
          <ellipse cx="${CX+CW/2}" cy="${matchaY + fillH*0.45*0.85}" rx="${CW*0.38}" ry="${4+diffuse*6}"
            fill="rgba(180,220,180,0.28)" opacity="${0.4+diffuse*0.4}"/>` : ''}`;
    }

    if (type === 'caramel_mac') {
      // White milk (bottom 60%) blending up to dark espresso crown
      const milkH = fillH * 0.60, milkY = CBY - milkH;
      const crownY = fillY;
      return `
        <rect x="${CX}" y="${milkY}" width="${CW}" height="${milkH+5}" fill="#f5ede0" opacity="0.9"/>
        <path d="${wavePath(milkY, 2, false)}" fill="#ede0cc" opacity="0.55"
          style="animation:lfW1 5s ease-in-out infinite ${wOff1}"/>
        ${pct > 55 ? `
          <rect x="${CX}" y="${crownY}" width="${CW}" height="${fillH*0.40+5}" fill="#2a1208" opacity="0.88"/>
          <path d="${wavePath(crownY, 3, true)}" fill="#1c0c06" opacity="0.65"
            style="animation:lfW2 4s ease-in-out infinite ${wOff2}"/>` : ''}
        ${pct > 85 ? `
          <path d="M${CX+20},${fillY+2} L${CX+40},${fillY+2} M${CX+30},${fillY-2} L${CX+30},${fillY+6}"
            stroke="#c88020" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
          <path d="M${CX+55},${fillY+2} L${CX+80},${fillY+2} M${CX+68},${fillY-2} L${CX+68},${fillY+6}"
            stroke="#c88020" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>` : ''}`;
    }

    if (type === 'irish_coffee') {
      // Dark whiskey coffee base (bottom 75%) + thick cream float (top 25%)
      const coffeeH = fillH * 0.75, coffeeY = CBY - coffeeH;
      const creamY  = fillY;
      return `
        <rect x="${CX}" y="${coffeeY}" width="${CW}" height="${coffeeH+5}" fill="#1e0d08" opacity="0.94"/>
        <path d="${wavePath(coffeeY, 3, false)}" fill="#150a05" opacity="0.65"
          style="animation:lfW1 4s ease-in-out infinite ${wOff1}"/>
        ${pct > 70 ? `
          <rect x="${CX}" y="${creamY}" width="${CW}" height="${fillH*0.25+5}" fill="#f8f2e8" opacity="0.90"/>
          <path d="${wavePath(creamY, 2, true)}" fill="#f0e8d8" opacity="0.7"
            style="animation:lfW2 6s ease-in-out infinite ${wOff2}"/>
          <ellipse cx="${CX+CW/2}" cy="${creamY+2}" rx="${CW*0.44}" ry="7" fill="#fff8f0" opacity="0.75"/>` : ''}`;
    }

    // --- Standard wave-fill system for all other drink types ---
    const base  = `<rect x="${CX-1}" y="${fillY+3}" width="${CW+2}" height="${CBY - fillY + 5}"
      fill="${d.liquidColor}" opacity="0.52"/>`;
    const waves = `
      <path d="${wP2}" fill="${d.liquidColor2}" opacity="0.58"
        style="animation:lfW2 ${wSpd*1.3}s ease-in-out infinite ${wOff2}"/>
      <path d="${wP1}" fill="${liquidFill}" opacity="0.88"
        style="animation:lfW1 ${wSpd}s ease-in-out infinite ${wOff1}"/>`;

    // Pour stream during active fill
    const pour = (pct > 4 && pct < 92) ? buildPourStream(d.liquidColor, fillY, 30) : '';

    let inner = '';

    if (type === 'coffee' && pct > 10)
      inner = `<ellipse cx="70" cy="${fillY+4}" rx="${CW*0.38}" ry="4.5" fill="rgba(140,65,12,0.30)" opacity="0.88"/>`;

    if (type === 'matcha' && fillH > 20) {
      const swY = fillY + fillH * 0.40;
      inner = `<g style="animation:lfSwirl 9s linear infinite ${ao(9)};transform-origin:70px ${swY}px">
        <ellipse cx="70" cy="${swY}" rx="${CW*0.22}" ry="${Math.max(4,fillH*0.12)}"
          fill="none" stroke="${d.liquidColor2}" stroke-width="2" opacity="0.38" stroke-dasharray="5 4"/>
        <ellipse cx="70" cy="${swY}" rx="${CW*0.12}" ry="${Math.max(2.5,fillH*0.06)}"
          fill="none" stroke="${d.foamColor}" stroke-width="1.5" opacity="0.30" stroke-dasharray="3 4"/>
      </g>`;
    }

    if (type === 'milktea' && fillH > 0) {
      inner = `<rect x="${CX}" y="${fillY+fillH*0.20}" width="${CW}" height="${fillH*0.22}"
        fill="rgba(232,218,198,0.30)" opacity="0.85"/>`;
      inner += generateBobas(CX, fillY, CW, fillH, d.bobaColor);
    }

    if (type === 'oj') {
      inner += generateIceWithDrop(CX, fillY, pct);
      if (fillH > 15)
        [[CX+20,0.50],[CX+50,0.35],[CX+75,0.60],[CX+35,0.70],[CX+85,0.45]].forEach(([px,py]) => {
          inner += `<circle cx="${px}" cy="${fillY+fillH*py}" r="2.5" fill="rgba(255,155,22,0.42)" opacity="0.75"/>`;
        });
      if (fillH > 10)
        [{x:CX+18,d:1.8},{x:CX+35,d:2.3},{x:CX+52,d:1.5},{x:CX+68,d:2.1},{x:CX+82,d:1.9},{x:CX+45,d:2.4},{x:CX+60,d:1.7}]
          .forEach(({x,d:dur},i) => {
            inner += `<circle cx="${x}" cy="${fillY+fillH*0.85}" r="${BUBBLE_SIZES[i]}"
              fill="rgba(255,228,108,0.62)" style="animation:lfBub ${dur}s ease-in infinite ${ao(dur)}"/>`;
          });
    }

    if (type === 'chamomile' && pct > 15)
      [[CX+25,3,-15,'rgba(255,232,102,0.78)'],[CX+56,2,12,'rgba(255,242,144,0.72)'],[CX+81,4,-6,'rgba(255,226,90,0.75)']].forEach(([px,py,rot,fc]) => {
        inner += `
          <ellipse cx="${px}" cy="${fillY+py}" rx="4.5" ry="2" fill="${fc}" transform="rotate(${rot} ${px} ${fillY+py})"/>
          <ellipse cx="${px}" cy="${fillY+py}" rx="2" ry="4.5" fill="${fc}" opacity="0.75" transform="rotate(${rot+90} ${px} ${fillY+py})"/>
          <circle cx="${px}" cy="${fillY+py}" r="1.8" fill="rgba(255,200,50,0.82)"/>`;
      });

    if (type === 'smoothie') {
      inner += generateIce(CX, fillY);
      if (fillH > 15)
        [[CX+18,0.40,4,'rgba(220,50,100,0.55)'],[CX+56,0.55,3,'rgba(200,50,200,0.50)'],
         [CX+82,0.30,3.5,'rgba(80,200,50,0.50)'],[CX+36,0.70,2.5,'rgba(255,150,50,0.50)']].forEach(([fx,py,fr,fc]) => {
          inner += `<circle cx="${fx}" cy="${fillY+fillH*py}" r="${fr}" fill="${fc}"/>`;
        });
    }

    if (type === 'lemonade') {
      inner += generateIceWithDrop(CX, fillY, pct);
      if (fillH > 20) {
        const lsX = CX+72, lsY = fillY+fillH*0.50;
        inner += `
          <circle cx="${lsX}" cy="${lsY}" r="11" fill="rgba(255,255,100,0.28)" stroke="rgba(200,200,0,0.38)" stroke-width="1"/>
          <line x1="${lsX-11}" y1="${lsY}" x2="${lsX+11}" y2="${lsY}" stroke="rgba(180,180,0,0.28)" stroke-width="0.75"/>
          <line x1="${lsX}" y1="${lsY-11}" x2="${lsX}" y2="${lsY+11}" stroke="rgba(180,180,0,0.28)" stroke-width="0.75"/>
          <line x1="${lsX-8}" y1="${lsY-8}" x2="${lsX+8}" y2="${lsY+8}" stroke="rgba(180,180,0,0.18)" stroke-width="0.75"/>
          <line x1="${lsX+8}" y1="${lsY-8}" x2="${lsX-8}" y2="${lsY+8}" stroke="rgba(180,180,0,0.18)" stroke-width="0.75"/>`;
      }
      if (fillH > 10)
        [{x:CX+18,d:1.8},{x:CX+35,d:2.3},{x:CX+52,d:1.5},{x:CX+68,d:2.1},{x:CX+82,d:1.9},{x:CX+44,d:2.4},{x:CX+60,d:1.7}]
          .forEach(({x,d:dur},i) => {
            inner += `<circle cx="${x}" cy="${fillY+fillH*0.85}" r="${BUBBLE_SIZES[i]}"
              fill="rgba(255,255,188,0.72)" style="animation:lfBub ${dur}s ease-in infinite ${ao(dur)}"/>`;
          });
    }

    const foamSVG = foamColor && pct > 5 ? buildFoam(type, fillY, CX, CW, foamColor) : '';
    return base + waves + pour + inner + foamSVG;
  }
    const wOff1 = ao(wSpd), wOff2 = ao(wSpd * 1.3);
    const wP1 = wavePath(fillY, wAmp, false);
    const wP2 = wavePath(fillY, wAmp, true);

    // Solid base ensures no gap below the wave
    const base = `<rect x="${CX-1}" y="${fillY+3}" width="${CW+2}" height="${CBY - fillY + 5}"
      fill="${d.liquidColor}" opacity="0.52"/>`;

    // Two wave layers at opposing phases
    const waves = `
      <path d="${wP2}" fill="${d.liquidColor2}" opacity="0.58"
        style="animation:lfW2 ${wSpd*1.3}s ease-in-out infinite ${wOff2}"/>
      <path d="${wP1}" fill="${liquidFill}" opacity="0.88"
        style="animation:lfW1 ${wSpd}s ease-in-out infinite ${wOff1}"/>`;

    let inner = '';
    const BUBBLE_SIZES = [2, 2.5, 2, 1.8, 2.5, 1.5, 2.2];

    // --- Coffee: espresso crema ring near surface ---
    if (type === 'coffee' && pct > 10) {
      inner = `<ellipse cx="70" cy="${fillY+4}" rx="${CW*0.38}" ry="4.5"
        fill="rgba(140,65,12,0.30)" opacity="0.88"/>`;
    }

    // --- Matcha: slow ceremonial swirl ---
    if (type === 'matcha' && fillH > 20) {
      const swY = fillY + fillH * 0.40;
      inner = `
        <g style="animation:lfSwirl 9s linear infinite ${ao(9)};transform-origin:70px ${swY}px">
          <ellipse cx="70" cy="${swY}" rx="${CW*0.22}" ry="${Math.max(4, fillH*0.12)}"
            fill="none" stroke="${d.liquidColor2}" stroke-width="2" opacity="0.38" stroke-dasharray="5 4"/>
          <ellipse cx="70" cy="${swY}" rx="${CW*0.12}" ry="${Math.max(2.5, fillH*0.06)}"
            fill="none" stroke="${d.foamColor}" stroke-width="1.5" opacity="0.30" stroke-dasharray="3 4"/>
        </g>`;
    }

    // --- Milk Tea: tea/milk layering + bouncing bobas ---
    if (type === 'milktea' && fillH > 0) {
      inner = `<rect x="${CX}" y="${fillY + fillH*0.20}" width="${CW}" height="${fillH*0.22}"
        fill="rgba(232,218,198,0.30)" opacity="0.85"/>`;
      inner += generateBobas(CX, fillY, CW, fillH, d.bobaColor);
    }

    // --- Orange Juice: ice + pulp + rising bubbles ---
    if (type === 'oj') {
      inner += generateIce(CX, fillY);
      if (fillH > 15)
        [[CX+20,0.50],[CX+50,0.35],[CX+75,0.60],[CX+35,0.70],[CX+85,0.45]].forEach(([px,py]) => {
          inner += `<circle cx="${px}" cy="${fillY+fillH*py}" r="2.5" fill="rgba(255,155,22,0.42)" opacity="0.75"/>`;
        });
      if (fillH > 10)
        [{x:CX+18,d:1.8},{x:CX+35,d:2.3},{x:CX+52,d:1.5},{x:CX+68,d:2.1},{x:CX+82,d:1.9},{x:CX+45,d:2.4},{x:CX+60,d:1.7}]
          .forEach(({x,d:dur},i) => {
            inner += `<circle cx="${x}" cy="${fillY+fillH*0.85}" r="${BUBBLE_SIZES[i]}"
              fill="rgba(255,228,108,0.62)" style="animation:lfBub ${dur}s ease-in infinite ${ao(dur)}"/>`;
          });
    }

    // --- Chamomile: flower petals drifting on surface ---
    if (type === 'chamomile' && pct > 15) {
      [[CX+25, 3, -15, 'rgba(255,232,102,0.78)'],
       [CX+56, 2,  12, 'rgba(255,242,144,0.72)'],
       [CX+81, 4,  -6, 'rgba(255,226,90,0.75)']].forEach(([px, py, rot, fc]) => {
        inner += `
          <ellipse cx="${px}" cy="${fillY+py}" rx="4.5" ry="2" fill="${fc}"
            transform="rotate(${rot} ${px} ${fillY+py})"/>
          <ellipse cx="${px}" cy="${fillY+py}" rx="2" ry="4.5" fill="${fc}" opacity="0.75"
            transform="rotate(${rot+90} ${px} ${fillY+py})"/>
          <circle cx="${px}" cy="${fillY+py}" r="1.8" fill="rgba(255,200,50,0.82)"/>`;
      });
    }

    // --- Smoothie: fruit bits + floating ice ---
    if (type === 'smoothie') {
      inner += generateIce(CX, fillY);
      if (fillH > 15)
        [[CX+18,0.40,4,'rgba(220,50,100,0.55)'],[CX+56,0.55,3,'rgba(200,50,200,0.50)'],
         [CX+82,0.30,3.5,'rgba(80,200,50,0.50)'],[CX+36,0.70,2.5,'rgba(255,150,50,0.50)']].forEach(([fx,py,fr,fc]) => {
          inner += `<circle cx="${fx}" cy="${fillY+fillH*py}" r="${fr}" fill="${fc}"/>`;
        });
    }

    // --- Lemonade: ice + lemon slice cross-section + rising bubbles ---
    if (type === 'lemonade') {
      inner += generateIce(CX, fillY);
      if (fillH > 20) {
        const lsX = CX + 72, lsY = fillY + fillH * 0.50;
        inner += `
          <circle cx="${lsX}" cy="${lsY}" r="11" fill="rgba(255,255,100,0.28)" stroke="rgba(200,200,0,0.38)" stroke-width="1"/>
          <line x1="${lsX-11}" y1="${lsY}" x2="${lsX+11}" y2="${lsY}" stroke="rgba(180,180,0,0.28)" stroke-width="0.75"/>
          <line x1="${lsX}" y1="${lsY-11}" x2="${lsX}" y2="${lsY+11}" stroke="rgba(180,180,0,0.28)" stroke-width="0.75"/>
          <line x1="${lsX-8}" y1="${lsY-8}" x2="${lsX+8}" y2="${lsY+8}" stroke="rgba(180,180,0,0.18)" stroke-width="0.75"/>
          <line x1="${lsX+8}" y1="${lsY-8}" x2="${lsX-8}" y2="${lsY+8}" stroke="rgba(180,180,0,0.18)" stroke-width="0.75"/>`;
      }
      if (fillH > 10)
        [{x:CX+18,d:1.8},{x:CX+35,d:2.3},{x:CX+52,d:1.5},{x:CX+68,d:2.1},{x:CX+82,d:1.9},{x:CX+44,d:2.4},{x:CX+60,d:1.7}]
          .forEach(({x,d:dur},i) => {
            inner += `<circle cx="${x}" cy="${fillY+fillH*0.85}" r="${BUBBLE_SIZES[i]}"
              fill="rgba(255,255,188,0.72)" style="animation:lfBub ${dur}s ease-in infinite ${ao(dur)}"/>`;
          });
    }

    const foamSVG = foamColor && pct > 5 ? buildFoam(type, fillY, CX, CW, foamColor) : '';
    return base + waves + inner + foamSVG;
  }

  // ---- SVG cup renderer ----
  function renderCup(pct) {
    const scene = document.getElementById('drinkScene');
    if (!scene || !currentDrink) return;
    const d = currentDrink;

    // Recipe integration
    const recipeKey  = DRINK_KEY_TO_RECIPE[currentDrinkId] || null;
    const tierCfg    = recipeKey ? getCurrentTierConfig(recipeKey) : null;
    const stepCfg    = tierCfg  ? getStepConfig(tierCfg, pct)     : null;
    const step100    = tierCfg?.steps?.[100] || null;
    const stepFill   = stepCfg?.fill;
    const liquidFill = (stepFill && stepFill !== 'transparent') ? stepFill : 'url(#liquidGrad)';
    const foamFill100 = step100?.foamFill;
    const foamColor  = (foamFill100 && foamFill100 !== 'transparent')
      ? foamFill100 : (d.hasFoam ? d.foamColor : null);
    const garnishSvg = (pct >= 100 && step100?.garnishSvg) ? step100.garnishSvg : '';
    const bgGlow     = tierCfg?.bgGlow || 'transparent';
    scene.style.filter = (bgGlow && bgGlow !== 'transparent') ? `drop-shadow(0 0 20px ${bgGlow})` : '';

    // Cup geometry
    const CX = 20, CW = 100, CTY = 30, CBY = 155;
    const fillH = Math.max(0, (pct / 100) * (CBY - CTY - 20));
    const fillY = CBY - fillH;

    const type = d.type || 'coffee';
    const ac   = DRINK_ANIM[type] || DRINK_ANIM.coffee;

    const tierBadge = tierCfg && tierCfg.tier !== 'house' ? `
      <text x="135" y="16" text-anchor="end" font-family="Source Sans Pro,sans-serif"
        font-size="7.5" font-weight="700"
        fill="${tierCfg.tier === 'mastercraft' ? '#fbbf24' : 'rgba(212,165,116,0.9)'}">
        ${tierCfg.tier === 'mastercraft' ? '👑 MASTER' : '✦ SIG'}
      </text>` : '';

    const liquidSVG = pct > 0
      ? buildLiquid(d, type, fillY, fillH, CX, CW, CBY, liquidFill, foamColor, pct, ac.waveAmp, ac.waveSpeed)
      : '';
    const steamSVG = ac.steam && pct > 0 && pct < 100 ? buildSteam(type, CTY) : '';

    // Inject keyframes into <head> once — they survive SVG innerHTML replacement
    injectDrinkStyles(ac.waveAmp, ac.waveSpeed);

    scene.innerHTML = `
    <svg viewBox="0 0 140 180" xmlns="http://www.w3.org/2000/svg"
      style="width:100%;max-width:160px;margin:0 auto;display:block;overflow:visible;">
      <defs>
        ${tierCfg?.defs || ''}
        <clipPath id="cupClip">
          <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}"/>
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

      ${tierBadge}
      <ellipse cx="70" cy="${CBY+8}" rx="44" ry="6" fill="rgba(0,0,0,0.12)"/>
      <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}"
        fill="rgba(245,241,235,0.15)" stroke="${d.cupTint}" stroke-width="2.5" stroke-linejoin="round"/>

      ${pct > 0 ? `<g clip-path="url(#cupClip)">${liquidSVG}</g>` : ''}

      <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}"
        fill="url(#cupGrad)" stroke="none"/>
      <line x1="${CX}" y1="${CTY}" x2="${CX+CW}" y2="${CTY}"
        stroke="${d.cupTint}" stroke-width="3" stroke-linecap="round"/>

      ${(d.bobas || d.hasIce) ? buildStraw(fillH, CTY, CBY) : ''}
      ${(!d.bobas && !d.hasIce) ? buildLid(CX, CW, CTY, d.cupTint) : ''}

      ${steamSVG}
      ${garnishSvg}
      ${pct >= 100 ? generateSparkles() : ''}

      ${pct > 15 ? `
      <text x="70" y="${Math.max(fillY + 18, CBY - 10)}"
        text-anchor="middle" font-family="Playfair Display,serif"
        font-size="13" font-weight="600" fill="rgba(255,255,255,0.85)">
        ${Math.round(pct)}%
      </text>` : ''}
    </svg>`;
  }

  function generateSparkles() {
    return `<g>
      <text x="18" y="22" font-size="14" style="animation:sparkle 1.5s ease-in-out infinite ${ao(1.5)}">✨</text>
      <text x="108" y="18" font-size="12" style="animation:sparkle 1.8s ease-in-out infinite ${ao(1.8)}">⭐</text>
      <text x="60" y="12" font-size="10" style="animation:sparkle 1.3s ease-in-out infinite ${ao(1.3)}">✦</text>
      <text x="28" y="42" font-size="11" style="animation:sparkle 2.0s ease-in-out infinite ${ao(2.0)}">✧</text>
      <text x="100" y="38" font-size="13" style="animation:sparkle 1.6s ease-in-out infinite ${ao(1.6)}">✨</text>
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
  const PICKER_RARITY_STYLE = {
    base:      { chalk: '#c4b49a', label: 'Base'      },
    common:    { chalk: '#d4c5a9', label: 'Common'    },
    uncommon:  { chalk: '#7ec8c8', label: 'Uncommon'  },
    rare:      { chalk: '#c39bd3', label: 'Rare'      },
    epic:      { chalk: '#f0a500', label: 'Epic'      },
    legendary: { chalk: '#ffd700', label: 'Legendary' },
  };

  function showDrinkPicker() {
    const existing = document.getElementById('drinkPickerModal');
    if (existing) { existing.remove(); return; }

    // Base drinks always available; shop drinks only if owned
    const allDrinks = typeof CategoriesModule !== 'undefined' ? CategoriesModule.ALL_DRINKS : [];
    const ownedIds  = typeof ShopModule !== 'undefined' ? ShopModule.getOwned().drinks : [];
    const available = allDrinks.length
      ? allDrinks.filter(d => d.rarity === 'base' || ownedIds.includes(d.id))
      : DRINK_KEYS.map(k => ({ id: k, emoji: k.split(' ')[0], label: k.split(' ').slice(1).join(' '), rarity: 'base' }));

    // Group by rarity, skip empty groups
    const rarityOrder = ['base', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
    const grouped = {};
    rarityOrder.forEach(r => {
      const items = available.filter(d => d.rarity === r);
      if (items.length) grouped[r] = items;
    });

    const curEntry = allDrinks.find(d => d.id === currentDrinkId)
      || { emoji: '☕', label: 'Coffee', rarity: 'base' };
    const curRS = PICKER_RARITY_STYLE[curEntry.rarity] || PICKER_RARITY_STYLE.base;

    const modal = document.createElement('div');
    modal.id = 'drinkPickerModal';
    modal.style.cssText = `position:fixed;inset:0;background:rgba(74,52,41,0.5);backdrop-filter:blur(4px);z-index:15000;display:flex;align-items:center;justify-content:center;padding:20px;`;

    const box = document.createElement('div');
    box.style.cssText = `background:rgba(245,241,235,0.98);border-radius:18px;padding:1.8rem;max-width:420px;width:100%;box-shadow:0 16px 40px rgba(139,111,71,0.3);border:2px solid rgba(139,111,71,0.2);max-height:80vh;overflow-y:auto;`;
    box.innerHTML = `
      <h3 style="font-family:'Playfair Display',serif;color:#4a3429;margin-bottom:1rem;">☕ Choose Your Drink</h3>
      <div style="font-family:'Source Sans Pro',sans-serif;font-size:0.75rem;color:rgba(107,81,57,0.55);margin-bottom:0.4rem;">Current drink</div>
      <div class="cat-drink-selected" id="pickerDrinkSelected" style="cursor:default;margin-bottom:1.2rem;pointer-events:none;">
        <span class="cat-drink-sel-emoji">${curEntry.emoji}</span>
        <span class="cat-drink-sel-name">${curEntry.label}</span>
        <span class="cat-drink-sel-rarity" style="color:${curRS.chalk}">${curRS.label}</span>
      </div>
      <div id="pickerDrinkSections"></div>
      <button id="drinkPickCancel" style="display:block;width:100%;margin-top:12px;padding:8px;border:none;background:none;color:rgba(107,81,57,0.6);font-family:'Playfair Display',serif;cursor:pointer;">Cancel</button>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    const sectionsEl   = box.querySelector('#pickerDrinkSections');
    const selectedDisp = box.querySelector('#pickerDrinkSelected');

    Object.entries(grouped).forEach(([rarity, drinks]) => {
      const rs      = PICKER_RARITY_STYLE[rarity] || PICKER_RARITY_STYLE.base;
      const section = document.createElement('div');
      section.className = 'cat-drink-section';
      section.innerHTML = `
        <div class="cat-drink-section-header" style="color:${rs.chalk}">${rs.label}</div>
        <div class="cat-drink-section-grid"></div>
      `;
      const grid = section.querySelector('.cat-drink-section-grid');

      drinks.forEach(d => {
        const btn = document.createElement('button');
        btn.className = 'cat-drink-catalogue-btn' + (d.id === currentDrinkId ? ' active' : '');
        btn.dataset.id     = d.id;
        btn.title = d.label;
        btn.innerHTML = `
          <span class="cat-dc-emoji">${d.emoji}</span>
          <span class="cat-dc-name">${d.label}</span>
        `;
        btn.addEventListener('click', () => {
          const rs2 = PICKER_RARITY_STYLE[d.rarity] || PICKER_RARITY_STYLE.base;
          selectedDisp.querySelector('.cat-drink-sel-emoji').textContent   = d.emoji;
          selectedDisp.querySelector('.cat-drink-sel-name').textContent    = d.label;
          selectedDisp.querySelector('.cat-drink-sel-rarity').textContent  = rs2.label;
          selectedDisp.querySelector('.cat-drink-sel-rarity').style.color  = rs2.chalk;
          box.querySelectorAll('.cat-drink-catalogue-btn')
             .forEach(b => b.classList.toggle('active', b.dataset.id === d.id));
          setDrink(d.id);
          renderCup(currentPct);
          setTimeout(() => modal.remove(), 150);
        });
        grid.appendChild(btn);
      });

      sectionsEl.appendChild(section);
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
    // If user has an active shop drink set, use that for the recipe
    let drinkKey = null;
    if (typeof ShopModule !== 'undefined') {
      const owned = ShopModule.getOwned();
      if (owned.activeDrink) drinkKey = owned.activeDrink;
    }
    if (!drinkKey) drinkKey = pickDrinkForGoal(goalCategoryName);
    setDrink(drinkKey);
  }

  // Called by TimerModule every tick with current progress pct
  function onProgressUpdate(pct) {
    updateProgress(pct);
  }

  // Returns current drink data for the shelf module
  function getCurrentDrinkInfo() {
    if (!currentDrink) return null;
    const recipeKey = DRINK_KEY_TO_RECIPE[currentDrinkId] || null;
    const tierCfg   = recipeKey ? getCurrentTierConfig(recipeKey) : null;
    return {
      drinkKey:     currentDrinkId,
      drinkType:    currentDrink.type || 'coffee',
      liquidColor:  currentDrink.liquidColor,
      tier:         tierCfg?.tier || 'house',
    };
  }

  return { init, onSessionStart, onProgressUpdate, renderBillBoard, getCurrentDrinkInfo };
})();
