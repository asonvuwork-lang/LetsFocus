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

  // ---- Shop drink ID → unique visual key (each drink gets its own look) ----
  const SHOP_ID_TO_VISUAL = {
    // Common coffee variants
    espresso:       '_espresso',
    americano:      '_americano',
    flat_white:     '_flat_white',
    hot_choc:       '_hot_choc',
    // Matcha / milk-based
    matcha_latte:   '🍵 Matcha',
    lavender_latte: '_lavender_latte',
    iced_matcha:    '_iced_matcha',
    // Boba / milk tea
    boba:           '🧋 Milk Tea',
    // Layered shop specials
    egg_coffee:     '_egg_coffee',
    caramel_mac:    '_caramel_mac',
    ca_phe_sua_da:  '_ca_phe_sua_da',
    dalgona:        '_dalgona',
    irish_coffee:   '_irish_coffee',
    // Uncommon coffee
    latte:          '_latte',
    cappuccino:     '_cappuccino',
    mocha:          '_mocha',
    macchiato:      '_macchiato',
    vienna_coffee:  '_vienna_coffee',
    affogato:       '_affogato',
    // Epic
    rose_gold:      '_rose_gold',
    cherry_blossom: '_cherry_blossom',
    galaxy_brew:    '_galaxy_brew',
    midnight_esp:   '_midnight_esp',
    // Legendary
    barista_secret: '_barista_secret',
    golden_hour:    '_golden_hour',
    aurora_brew:    '_aurora_brew',
    the_void:       '_the_void',
  };

  // ---- Drink definitions ----
  const DRINKS = {
    '☕ Coffee': {
      label: '☕ Coffee', type: 'coffee',
      liquidColor: '#3d1f0a', liquidColor2: '#6b3a1f',
      foamColor: '#e8d5b0', cupTint: '#8b6030',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'base',
    },
    '🍵 Matcha': {
      label: '🍵 Matcha', type: 'matcha',
      liquidColor: '#4a7c4e', liquidColor2: '#6aaa6e',
      foamColor: '#a8d5a2', cupTint: '#5a8a5a',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'base',
    },
    '🧋 Milk Tea': {
      label: '🧋 Milk Tea', type: 'milktea',
      liquidColor: '#c4a882', liquidColor2: '#d4bc9a',
      foamColor: '#f0e6d0', cupTint: '#b89060',
      bobas: true, bobaColor: '#2a1a0a',
      hasFoam: true, hasIce: false, rarity: 'base',
    },
    '🍊 Orange Juice': {
      label: '🍊 Orange Juice', type: 'oj',
      liquidColor: '#e8820a', liquidColor2: '#f0a030',
      foamColor: '#ffd580', cupTint: '#d4740a',
      bobas: false, hasFoam: false, hasIce: true, rarity: 'base',
    },
    '🫖 Chamomile Tea': {
      label: '🫖 Chamomile', type: 'chamomile',
      liquidColor: '#c8a840', liquidColor2: '#dfc060',
      foamColor: '#f5e8a0', cupTint: '#b09030',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'base',
    },
    '🥤 Smoothie': {
      label: '🥤 Smoothie', type: 'smoothie',
      liquidColor: '#b050a0', liquidColor2: '#d070c0',
      foamColor: '#e0a0d8', cupTint: '#904090',
      bobas: false, hasFoam: true, hasIce: true, rarity: 'base',
    },
    '🍋 Lemonade': {
      label: '🍋 Lemonade', type: 'lemonade',
      liquidColor: '#d4d820', liquidColor2: '#e8f040',
      foamColor: '#f8f8a0', cupTint: '#b0b818',
      bobas: false, hasFoam: false, hasIce: true, rarity: 'base',
    },
    '🎲 Random': {
      label: '🎲 Random', type: 'coffee',
      liquidColor: '#8b6f47', liquidColor2: '#a67c5a',
      foamColor: '#d4a574', cupTint: '#8b6f47',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'base',
    },
    // ---- Shop drink visual entries ----
    _ca_phe_sua_da: {
      label: 'Cà Phê Sữa Đá', type: 'ca_phe_sua_da',
      liquidColor: '#140904', liquidColor2: '#fce8b3',
      foamColor: '#fce8b3', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: true, rarity: 'rare',
    },
    _dalgona: {
      label: 'Dalgona', type: 'dalgona',
      liquidColor: '#f8f4ee', liquidColor2: '#c87d2a',
      foamColor: '#d4922a', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: true, rarity: 'rare',
    },
    _egg_coffee: {
      label: 'Egg Coffee', type: 'egg_coffee',
      liquidColor: '#1c0a04', liquidColor2: '#f5d070',
      foamColor: '#f5d070', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'uncommon',
    },
    _iced_matcha: {
      label: 'Iced Matcha', type: 'iced_matcha',
      liquidColor: '#3a7040', liquidColor2: '#f5f0e8',
      foamColor: '#a8d5a2', cupTint: '#5a8a5a',
      bobas: false, hasFoam: false, hasIce: true, rarity: 'rare',
    },
    _caramel_mac: {
      label: 'Caramel Macchiato', type: 'caramel_mac',
      liquidColor: '#2a1208', liquidColor2: '#f5ede0',
      foamColor: '#f0e6d0', cupTint: '#b89060',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
    },
    _irish_coffee: {
      label: 'Irish Coffee', type: 'irish_coffee',
      liquidColor: '#1e0d08', liquidColor2: '#f8f2e8',
      foamColor: '#f8f2e8', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'rare',
    },
    // ---- Common coffee variants (unique liquid colours) ----
    _espresso: {
      label: 'Espresso', type: 'coffee',
      liquidColor: '#0f0604', liquidColor2: '#2a0e06',
      foamColor: 'rgba(190,140,80,0.72)', cupTint: '#6a3010',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'common',
    },
    _americano: {
      label: 'Americano', type: 'coffee',
      liquidColor: '#1e1008', liquidColor2: '#381808',
      foamColor: 'rgba(160,120,70,0.50)', cupTint: '#704020',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'common',
    },
    _flat_white: {
      label: 'Flat White', type: 'coffee',
      liquidColor: '#a07050', liquidColor2: '#c09070',
      foamColor: 'rgba(255,255,255,0.88)', cupTint: '#8a6040',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'common',
    },
    _hot_choc: {
      label: 'Hot Chocolate', type: 'coffee',
      liquidColor: '#2e1508', liquidColor2: '#5a2c10',
      foamColor: 'rgba(255,255,255,0.92)', cupTint: '#5a2010',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'common',
    },
    _latte: {
      label: 'Latte', type: 'coffee',
      liquidColor: '#7a5030', liquidColor2: '#c09070',
      foamColor: 'rgba(255,255,255,0.92)', cupTint: '#8a6040',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
    },
    _cappuccino: {
      label: 'Cappuccino', type: 'coffee',
      liquidColor: '#5a2c10', liquidColor2: '#8a5030',
      foamColor: 'rgba(255,255,255,0.94)', cupTint: '#7a4020',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
    },
    _mocha: {
      label: 'Mocha', type: 'coffee',
      liquidColor: '#1a0808', liquidColor2: '#3a1010',
      foamColor: 'rgba(255,255,255,0.88)', cupTint: '#601818',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
    },
    _macchiato: {
      label: 'Macchiato', type: 'coffee',
      liquidColor: '#100806', liquidColor2: '#2a1208',
      foamColor: 'rgba(245,235,220,0.82)', cupTint: '#602010',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
    },
    _vienna_coffee: {
      label: 'Vienna Coffee', type: 'coffee',
      liquidColor: '#1c0e08', liquidColor2: '#2e1808',
      foamColor: 'rgba(250,248,245,0.94)', cupTint: '#7a5030',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'rare',
    },
    _affogato: {
      label: 'Affogato', type: 'coffee',
      liquidColor: '#3b1e0e', liquidColor2: '#fffdf5',
      foamColor: 'rgba(255,252,235,0.88)', cupTint: '#7a5020',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'epic',
    },
    _lavender_latte: {
      label: 'Lavender Latte', type: 'milktea',
      liquidColor: '#3c2850', liquidColor2: '#9070b8',
      foamColor: 'rgba(200,170,240,0.80)', cupTint: '#7050a0',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'rare',
    },
    // ---- Epic drinks (unique vibrant visuals) ----
    _rose_gold: {
      label: 'Rose Gold Latte', type: 'smoothie',
      liquidColor: '#883050', liquidColor2: '#d08870',
      foamColor: 'rgba(255,210,165,0.82)', cupTint: '#c07848',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'epic',
    },
    _cherry_blossom: {
      label: 'Cherry Blossom', type: 'smoothie',
      liquidColor: '#7a3858', liquidColor2: '#f0d8e8',
      foamColor: 'rgba(252,235,248,0.88)', cupTint: '#c090b0',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'epic',
    },
    _galaxy_brew: {
      label: 'Galaxy Cold Brew', type: 'coffee',
      liquidColor: '#1a0840', liquidColor2: '#3020a0',
      foamColor: 'rgba(160,120,240,0.72)', cupTint: '#2010a0',
      bobas: false, hasFoam: false, hasIce: true, rarity: 'epic',
    },
    _midnight_esp: {
      label: 'Midnight Espresso', type: 'coffee',
      liquidColor: '#040208', liquidColor2: '#282038',
      foamColor: 'rgba(80,60,120,0.72)', cupTint: '#180e30',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'epic',
    },
    // ---- Legendary drinks (vibrant / cosmic effects) ----
    _the_void: {
      label: 'The Void', type: 'void',
      liquidColor: '#0c0614', liquidColor2: '#1a0e28',
      foamColor: 'rgba(90,40,140,0.55)', cupTint: '#120a20',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'legendary',
    },
    _aurora_brew: {
      label: 'Aurora Brew', type: 'aurora',
      liquidColor: '#1e1b4b', liquidColor2: '#0c1840',
      foamColor: 'rgba(100,220,255,0.55)', cupTint: '#181060',
      bobas: false, hasFoam: false, hasIce: true, rarity: 'legendary',
    },
    _golden_hour: {
      label: 'Golden Hour', type: 'coffee',
      liquidColor: '#451a03', liquidColor2: '#e0a030',
      foamColor: 'rgba(252,195,60,0.80)', cupTint: '#c08010',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'legendary',
    },
    _barista_secret: {
      label: "Barista's Secret", type: 'lemonade',
      liquidColor: '#042f2e', liquidColor2: '#0f766e',
      foamColor: 'rgba(45,212,191,0.72)', cupTint: '#0a6060',
      bobas: false, hasFoam: true, hasIce: true, rarity: 'legendary',
    },
  };

  const DRINK_KEYS = Object.keys(DRINKS).filter(k => k !== '🎲 Random' && !k.startsWith('_'));

  let currentDrink  = null;
  let currentDrinkId = null;   // tracks the actual key for recipe lookup
  let currentPct    = 0;
  let isFinished    = false;
  let _currentCategoryName = null;  // passed from onSessionStart, used for category pill

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

    // Resolve tier for this drink
    const recipeKey = DRINK_KEY_TO_RECIPE[drinkKey];
    const tierCfg   = recipeKey ? getCurrentTierConfig(recipeKey) : null;
    const tierBadge = tierCfg?.tier === 'mastercraft' ? ' 👑' : tierCfg?.tier === 'signature' ? ' ✦' : '';

    // Update drink title with rarity styling
    const titleEl = document.getElementById('drinkProgressTitle');
    if (titleEl) {
      titleEl.textContent = currentDrink.label + tierBadge;
      titleEl.className = 'drink-progress-title';
      const rarity = currentDrink.rarity || 'base';
      if (rarity === 'legendary') titleEl.classList.add('drink-name-legendary');
      else if (rarity === 'epic')  titleEl.classList.add('drink-name-epic');
      else if (rarity === 'rare')  titleEl.classList.add('drink-name-rare');
    }

    // Category pill — shows which goal category drove this drink choice
    const pillEl = document.getElementById('drinkCategoryPill');
    if (pillEl) {
      if (_currentCategoryName) {
        const catColor = getCatColor(_currentCategoryName);
        pillEl.textContent = _currentCategoryName;
        pillEl.style.background  = catColor + '28';
        pillEl.style.borderColor = catColor + '60';
        pillEl.style.color       = catColor;
        pillEl.style.display     = '';
      } else {
        pillEl.style.display = 'none';
      }
    }

    // Render recipe bill beside the cup
    renderRecipeBill(drinkKey, currentDrink, tierCfg);
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
    coffee:        { waveAmp: 3, waveSpeed: 4.0, steam: true  },
    matcha:        { waveAmp: 2, waveSpeed: 5.5, steam: true  },
    milktea:       { waveAmp: 4, waveSpeed: 3.0, steam: false },
    oj:            { waveAmp: 5, waveSpeed: 2.5, steam: false },
    chamomile:     { waveAmp: 2, waveSpeed: 6.0, steam: true  },
    smoothie:      { waveAmp: 1, waveSpeed: 8.0, steam: false },
    lemonade:      { waveAmp: 5, waveSpeed: 2.0, steam: false },
    // Legendary special types
    void:          { waveAmp: 1, waveSpeed: 10.0, steam: false },
    aurora:        { waveAmp: 2, waveSpeed:  5.0, steam: false },
    // Layered shop drinks
    ca_phe_sua_da: { waveAmp: 2, waveSpeed: 5.0, steam: false },
    dalgona:       { waveAmp: 2, waveSpeed: 5.5, steam: false },
    egg_coffee:    { waveAmp: 2, waveSpeed: 4.5, steam: true  },
    iced_matcha:   { waveAmp: 2, waveSpeed: 5.0, steam: false },
    caramel_mac:   { waveAmp: 2, waveSpeed: 4.5, steam: true  },
    irish_coffee:  { waveAmp: 2, waveSpeed: 4.0, steam: true  },
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
      @keyframes lfDropL { 0%{transform:translate(0,0);opacity:0} 10%{opacity:0.55} 78%{transform:translate(0.45px,7px);opacity:0.52} 100%{transform:translate(0.58px,9px);opacity:0} }
      @keyframes lfDropR { 0%{transform:translate(0,0);opacity:0} 10%{opacity:0.55} 78%{transform:translate(-0.45px,7px);opacity:0.52} 100%{transform:translate(-0.58px,9px);opacity:0} }
      @keyframes lfRipple { 0%{transform:scale(0.3);opacity:0.9} 100%{transform:scale(4.2);opacity:0} }
      @keyframes lfDrinkChange { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.91)} }
      @keyframes voidStar { 0%,100%{opacity:0.08;transform:scale(0.6)} 50%{opacity:1;transform:scale(1.4)} }
      @keyframes voidOrbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes auroraFlow { 0%,100%{transform:translateX(-10px) scaleY(0.85);opacity:0.55} 40%{transform:translateX(8px) scaleY(1.18);opacity:1} 70%{transform:translateX(-5px) scaleY(0.92);opacity:0.75} }
    `;
    document.head.appendChild(style);
  }

  // drinkStyles is now only used for the SVG <defs> section (no keyframes needed there)
  function drinkStyles() { return ''; }

  // ---- Straw (slides in from above near end of session) ----
  // yOffset: positive = shifted above, 0 = final position. opacity: 0→0.85 fade-in.
  function buildStraw(CTY, CBY, yOffset, opacity) {
    const sh = CBY - CTY + 26;           // full cup height + above-rim protrusion
    const y0 = CTY - 22 - yOffset;       // tip y, pushed above viewBox until near 100%
    return `
      <rect x="88" y="${y0}" width="5" height="${sh}" rx="2.5" fill="#c4a882" opacity="${opacity.toFixed(2)}"/>
      <rect x="89" y="${y0}" width="2" height="${sh}" rx="1" fill="rgba(255,255,255,${(opacity * 0.35).toFixed(2)})"/>`;
  }

  // ---- Condensation drops — hug the sloped cup wall exterior ----
  // Cup wall slope: 8px inward per 125px height (dx/dy = 0.064)
  function buildCondensation(CX, CW, CTY, CBY, pct) {
    if (pct < 28) return '';
    const n   = Math.ceil(Math.min(1, (pct - 28) / 48) * 4);
    const slp = 8 / (CBY - CTY); // wall inward slope per y-unit
    // Drop y positions — x is computed from wall position at that y, offset 2px outside
    const LD = [
      {y:62,  rx:1.0, ry:2.4, dur:3.2, del:0   },
      {y:90,  rx:1.2, ry:3.0, dur:4.1, del:0.8  },
      {y:118, rx:0.9, ry:2.2, dur:3.7, del:1.5  },
      {y:144, rx:1.4, ry:3.2, dur:2.9, del:0.3  },
    ].map(d => ({ ...d, x: +(CX + (d.y - CTY) * slp - 1.8).toFixed(1), anim:'lfDropL' }));
    const RD = [
      {y:50,  rx:1.1, ry:2.6, dur:3.5, del:0.5  },
      {y:80,  rx:0.9, ry:2.0, dur:4.3, del:1.2  },
      {y:108, rx:1.3, ry:3.0, dur:3.1, del:0.2  },
      {y:134, rx:1.0, ry:2.4, dur:3.8, del:1.8  },
    ].map(d => ({ ...d, x: +((CX+CW) - (d.y - CTY) * slp + 1.8).toFixed(1), anim:'lfDropR' }));
    return [...LD.slice(0, n), ...RD.slice(0, n)]
      .filter(d => d.y >= CTY)
      .map(d => `<ellipse cx="${d.x}" cy="${d.y}" rx="${d.rx}" ry="${d.ry}"
        fill="rgba(200,228,248,0.54)"
        style="animation:${d.anim} ${d.dur}s ease-in-out infinite ${d.del}s"/>`)
      .join('');
  }

  // ---- Equipment silhouette (behind cup, faint) ----
  const EQUIP_SVG = {
    coffee:    `<g fill="none" stroke="rgba(139,111,71,0.65)" stroke-width="1.1">
      <rect x="48" y="38" width="44" height="82" rx="4"/>
      <rect x="55" y="46" width="30" height="18" rx="2"/>
      <circle cx="70" cy="88" r="9"/>
      <rect x="61" y="96" width="18" height="5" rx="2.5"/>
      <path d="M61,101 L59,114 L81,114 L79,101"/>
      <line x1="34" y1="62" x2="48" y2="62"/><line x1="34" y1="66" x2="42" y2="70"/>
    </g>`,
    matcha:    `<g fill="none" stroke="rgba(139,111,71,0.65)" stroke-width="0.9">
      <line x1="70" y1="38" x2="70" y2="88"/>
      ${[0,18,36,54,72,90,108,126,144,162].map(a=>`<path d="M70,88 Q${70+Math.sin(a*Math.PI/180)*28},${108+Math.cos(a*Math.PI/180)*14} ${70+Math.sin(a*Math.PI/180)*22},${112+Math.cos(a*Math.PI/180)*10}"/>`).join('')}
      <ellipse cx="70" cy="36" rx="6" ry="3"/>
    </g>`,
    milktea:   `<g fill="none" stroke="rgba(139,111,71,0.65)" stroke-width="1.1">
      <rect x="55" y="42" width="30" height="68" rx="15"/>
      <rect x="55" y="36" width="30" height="10" rx="5"/>
      <line x1="65" y1="36" x2="62" y2="26"/><line x1="75" y1="36" x2="78" y2="26"/>
      <line x1="60" y1="80" x2="80" y2="80"/>
    </g>`,
    oj:        `<g fill="none" stroke="rgba(139,111,71,0.65)" stroke-width="1.1">
      <path d="M50,90 Q50,50 70,46 Q90,50 90,90"/>
      <ellipse cx="70" cy="66" rx="12" ry="18"/>
      <line x1="70" y1="48" x2="70" y2="84"/>
      <line x1="58" y1="66" x2="82" y2="66"/>
      <rect x="52" y="90" width="36" height="10" rx="4"/>
    </g>`,
    chamomile: `<g fill="none" stroke="rgba(139,111,71,0.65)" stroke-width="1.1">
      <ellipse cx="65" cy="78" rx="22" ry="28"/>
      <path d="M87,68 Q102,62 100,78 Q98,92 87,90"/>
      <path d="M43,56 Q38,48 43,56"/>
      <rect x="55" y="42" width="20" height="8" rx="4"/>
      <circle cx="65" cy="46" r="3"/>
    </g>`,
    smoothie:  `<g fill="none" stroke="rgba(139,111,71,0.65)" stroke-width="1.1">
      <path d="M52,42 L58,110 L82,110 L88,42 Z"/>
      <line x1="52" y1="42" x2="88" y2="42"/>
      <rect x="52" y="36" width="36" height="8" rx="3"/>
      <rect x="56" y="110" width="28" height="14" rx="3"/>
      <line x1="56" y1="117" x2="84" y2="117"/>
      <circle cx="63" cy="119" r="2"/><circle cx="70" cy="119" r="2"/><circle cx="77" cy="119" r="2"/>
    </g>`,
    lemonade:  `<g fill="none" stroke="rgba(139,111,71,0.65)" stroke-width="1.1">
      <path d="M52,76 Q52,52 70,48 Q88,52 88,76"/>
      <ellipse cx="70" cy="68" rx="14" ry="22"/>
      <line x1="70" y1="46" x2="70" y2="90"/>
      <rect x="50" y="76" width="40" height="8" rx="3"/>
      <rect x="54" y="84" width="32" height="16" rx="4"/>
    </g>`,
  };
  const EQUIP_ALIASES = {
    ca_phe_sua_da:'coffee', dalgona:'milktea', egg_coffee:'coffee',
    iced_matcha:'matcha', caramel_mac:'coffee', irish_coffee:'coffee',
    espresso:'coffee', americano:'coffee', flat_white:'coffee', latte:'coffee',
    cappuccino:'coffee', macchiato:'coffee', mocha:'coffee', affogato:'coffee',
    matcha_latte:'matcha', boba:'milktea', lavender_latte:'milktea',
    hot_choc:'coffee', vienna_coffee:'coffee',
    rose_gold:'smoothie', galaxy_brew:'smoothie', midnight_esp:'coffee',
    the_void:'void', aurora_brew:'aurora',
    cherry_blossom:'chamomile', barista_secret:'coffee',
    golden_hour:'lemonade', aurora_brew:'smoothie', the_void:'coffee',
  };

  function buildEquipmentBg(type, fillY, CTY) {
    return ''; // Equipment silhouettes removed for cleaner cup view
  }

  // ---- Ingredient card (styled cream card, left panel) ----
  const DRINK_INGREDIENTS = {
    // Base drinks
    coffee:           ['espresso', 'hot water'],
    matcha:           ['matcha powder', 'oat milk'],
    milktea:          ['black tea', 'tapioca pearls', 'milk'],
    oj:               ['fresh orange juice', 'ice'],
    chamomile:        ['chamomile flowers', 'honey'],
    smoothie:         ['mixed fruit', 'yogurt', 'ice'],
    lemonade:         ['lemon juice', 'sugar syrup', 'ice'],
    // Common coffee shop
    _espresso:        ['fine-ground coffee', '9-bar pressure'],
    _americano:       ['double espresso', 'hot water'],
    _flat_white:      ['double ristretto', 'steamed milk'],
    _hot_choc:        ['dark chocolate', 'whole milk', 'cream'],
    // Uncommon
    _latte:           ['espresso', 'steamed milk', 'microfoam'],
    _cappuccino:      ['espresso', 'steamed milk', 'thick foam'],
    _mocha:           ['espresso', 'chocolate sauce', 'milk'],
    _macchiato:       ['espresso', 'foam dollop'],
    _egg_coffee:      ['espresso', 'egg yolk', 'condensed milk'],
    _caramel_mac:     ['espresso', 'vanilla milk', 'caramel drizzle'],
    // Rare
    _iced_matcha:     ['matcha powder', 'oat milk', 'ice'],
    _lavender_latte:  ['espresso', 'lavender syrup', 'steamed milk'],
    _ca_phe_sua_da:   ['dark roast drip', 'condensed milk', 'ice'],
    _dalgona:         ['whipped coffee', 'cold milk', 'ice'],
    _irish_coffee:    ['Irish whiskey', 'hot coffee', 'cream'],
    _vienna_coffee:   ['strong espresso', 'whipped cream', 'cocoa'],
    // Epic
    _affogato:        ['vanilla gelato', 'hot espresso shot'],
    _rose_gold:       ['rose water', 'lychee', 'oat milk', 'gold dust'],
    _cherry_blossom:  ['cherry blossom tea', 'sakura syrup', 'milk'],
    _galaxy_brew:     ['cold brew', 'butterfly pea', 'tonic'],
    _midnight_esp:    ['dark roast', 'activated charcoal', 'cream'],
    // Legendary
    _the_void:        ['absolute darkness', 'distilled time'],
    _aurora_brew:     ['blue spirulina', 'teal concentrate', 'nitrogen'],
    _golden_hour:     ['blonde espresso', 'liquid gold', 'honey'],
    _barista_secret:  ['secret cold brew', 'mint oil', 'teal syrup'],
    // Aliases for type-based lookups
    ca_phe_sua_da:    ['dark roast drip', 'condensed milk', 'ice'],
    dalgona:          ['whipped coffee', 'cold milk', 'ice'],
    egg_coffee:       ['espresso', 'egg yolk', 'condensed milk'],
    iced_matcha:      ['matcha powder', 'oat milk', 'ice'],
    caramel_mac:      ['espresso', 'vanilla milk', 'caramel drizzle'],
    irish_coffee:     ['Irish whiskey', 'hot coffee', 'cream'],
  };

  // ---- Recipe Bill — rendered as an HTML element beside the cup ----
  function renderRecipeBill(drinkKey, d, tierCfg) {
    const container = document.getElementById('drinkRecipeBill');
    if (!container) return;

    const type      = d?.type || 'coffee';
    // Resolve the best ingredient key: prefer the specific visual key, then the shop key, then the type
    const visualKey = (drinkKey && SHOP_ID_TO_VISUAL[drinkKey]) || drinkKey || type;
    const items     = DRINK_INGREDIENTS[visualKey]
                   || DRINK_INGREDIENTS[drinkKey]
                   || DRINK_INGREDIENTS[type]
                   || [];

    if (!items.length) { container.style.display = 'none'; return; }
    container.style.display = '';

    const hasTier     = tierCfg && tierCfg.tier !== 'house';
    const isMaster    = tierCfg?.tier === 'mastercraft';
    const tierHtml    = hasTier
      ? `<div class="bill-tier${isMaster ? ' bill-tier-master' : ''}">${isMaster ? '👑 mastercraft' : '✦ signature'}</div>`
      : '';
    const drinkName   = d?.label || drinkKey || 'Your Drink';
    const rarity      = d?.rarity || 'base';

    container.innerHTML = `
      <div class="bill-drink-name bill-rarity-${rarity}">— ${drinkName} —</div>
      <div class="bill-rule">·  ·  ·  ·  ·  ·  ·</div>
      <div class="bill-section-label">ingredients</div>
      <ul class="bill-items">${items.map(i => `<li>${i}</li>`).join('')}</ul>
      ${tierHtml}
    `;

    // Trigger CSS fade-in each time the drink changes
    container.classList.remove('bill-visible');
    void container.offsetWidth;   // reflow
    container.classList.add('bill-visible');
  }

  // ---- 3D Cup Walls (drawn over the liquid to create depth) ----
  const CUP_WALL_COLORS = {
    coffee:    { lt: 'rgba(185,135,80,0.95)',  dk: 'rgba(58,24,6,0.92)'   },
    matcha:    { lt: 'rgba(145,205,130,0.90)', dk: 'rgba(38,88,38,0.92)'  },
    milktea:   { lt: 'rgba(215,188,152,0.92)', dk: 'rgba(128,88,48,0.92)' },
    oj:        { lt: 'rgba(255,255,255,0.32)', dk: 'rgba(0,0,0,0.12)'     },
    chamomile: { lt: 'rgba(225,202,98,0.90)',  dk: 'rgba(98,78,18,0.92)'  },
    smoothie:  { lt: 'rgba(222,130,212,0.90)', dk: 'rgba(88,28,118,0.92)' },
    lemonade:  { lt: 'rgba(255,255,255,0.32)', dk: 'rgba(0,0,0,0.12)'     },
    ca_phe_sua_da: { lt: 'rgba(180,130,75,0.92)', dk: 'rgba(55,22,5,0.92)' },
    dalgona:       { lt: 'rgba(200,160,80,0.90)',  dk: 'rgba(70,40,5,0.92)' },
    egg_coffee:    { lt: 'rgba(188,135,75,0.90)',  dk: 'rgba(55,20,5,0.92)' },
    iced_matcha:   { lt: 'rgba(145,205,130,0.90)', dk: 'rgba(38,88,38,0.92)' },
    caramel_mac:   { lt: 'rgba(215,175,105,0.90)', dk: 'rgba(80,38,8,0.92)'  },
    irish_coffee:  { lt: 'rgba(175,128,72,0.90)',  dk: 'rgba(50,18,5,0.92)'  },
    void:          { lt: 'rgba(110,55,180,0.75)',  dk: 'rgba(12,4,28,0.96)'  },
    aurora:        { lt: 'rgba(80,200,240,0.55)',  dk: 'rgba(8,10,60,0.90)'  },
    lemonade:      { lt: 'rgba(255,255,255,0.30)', dk: 'rgba(0,0,0,0.12)'    },
  };

  function buildCupWalls(d, type, CX, CW, CTY, CBY) {
    const isCold = !!(d.hasIce || d.bobas);
    const WT = 8, WB = 5;   // wall thickness top / bottom
    const wc = CUP_WALL_COLORS[type] || CUP_WALL_COLORS.coffee;
    const lt = isCold ? 'rgba(255,255,255,0.30)' : wc.lt;
    const dk = isCold ? 'rgba(0,0,0,0.14)'       : wc.dk;

    // Left wall: outer-left edge → inset-left edge
    const lWall  = `${CX},${CTY} ${CX+WT},${CTY} ${CX+8+WB},${CBY} ${CX+8},${CBY}`;
    // Right wall: inset-right edge → outer-right edge
    const rWall  = `${CX+CW-WT},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+CW-8-WB},${CBY}`;
    // Bottom bar
    const botBar = `${CX+8},${CBY-4} ${CX+CW-8},${CBY-4} ${CX+CW-8},${CBY} ${CX+8},${CBY}`;

    // For glass cups, add a specular sheen on left wall
    const glassSheen = isCold ? `
      <polygon points="${CX+1},${CTY+4} ${CX+4},${CTY+4} ${CX+7},${CBY-6} ${CX+2},${CBY-6}"
        fill="rgba(255,255,255,0.18)"/>` : '';

    return `
      <polygon points="${lWall}" fill="${lt}"/>
      <polygon points="${rWall}" fill="${dk}"/>
      <polygon points="${botBar}" fill="${dk}"/>
      ${glassSheen}`;
  }

  // ---- 3D Rim ellipse at cup opening ----
  function buildRim3D(d, CX, CW, CTY) {
    const cx   = CX + CW / 2;
    const rx   = CW / 2 + 5;
    const ry   = 7;
    const isCold = !!(d.hasIce || d.bobas);
    const rimFill   = isCold ? 'rgba(220,240,255,0.28)' : d.cupTint;
    const rimOp     = isCold ? '1' : '0.88';

    return `
      <!-- Rim outer -->
      <ellipse cx="${cx}" cy="${CTY}" rx="${rx}" ry="${ry}"
        fill="${rimFill}" opacity="${rimOp}"/>
      <!-- Rim inner shadow (shows depth of opening) -->
      <ellipse cx="${cx}" cy="${CTY+1}" rx="${rx-12}" ry="${ry-2.5}"
        fill="rgba(0,0,0,0.22)"/>
      <!-- Rim specular highlight -->
      <ellipse cx="${cx-8}" cy="${CTY-1.5}" rx="${rx*0.55}" ry="${ry*0.38}"
        fill="rgba(255,255,255,0.32)"/>`;
  }

  // ---- Drink-specific cup decoration (outside the liquid area) ----
  function buildCupDecoration(type, d, CX, CW, CTY, CBY) {
    const lx  = CX + 4;                       // left decoration x (inside left wall)
    const midY = (CTY + CBY) / 2 + 10;
    const op  = 0.22;

    switch (type) {
      case 'coffee':
      case 'ca_phe_sua_da':
      case 'egg_coffee':
      case 'irish_coffee':
        // Coffee bean on left wall
        return `<g opacity="${op}">
          <ellipse cx="${lx+6}" cy="${midY}" rx="4.5" ry="6.5" fill="${d.cupTint}"
            transform="rotate(-20,${lx+6},${midY})"/>
          <path d="M${lx+2},${midY-1} Q${lx+6},${midY+2} ${lx+10},${midY-1}"
            stroke="rgba(0,0,0,0.4)" stroke-width="0.9" fill="none"/>
        </g>`;
      case 'matcha':
      case 'iced_matcha':
        // Bamboo leaf
        return `<g opacity="${op}">
          <path d="M${lx+6},${midY+8} C${lx+2},${midY-6} ${lx+12},${midY-14} ${lx+10},${midY+4}
            S${lx+4},${midY+14} ${lx+6},${midY+8}" fill="${d.cupTint}"/>
          <line x1="${lx+6}" y1="${midY+8}" x2="${lx+9}" y2="${midY-5}"
            stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
        </g>`;
      case 'milktea':
      case 'dalgona':
        // Polka dots
        return [[lx+6,midY-16],[lx+5,midY],[lx+7,midY+15]]
          .map(([x,y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="${d.cupTint}" opacity="${op}"/>`)
          .join('');
      case 'chamomile':
        // Small flower
        return `<g opacity="${op}" transform="translate(${lx+6},${midY})">
          ${[0,60,120,180,240,300].map(a => {
            const r = a * Math.PI / 180;
            return `<ellipse cx="${(Math.cos(r)*5.5).toFixed(1)}" cy="${(Math.sin(r)*5.5).toFixed(1)}"
              rx="2.2" ry="3.8" fill="${d.cupTint}"
              transform="rotate(${a},${(Math.cos(r)*5.5).toFixed(1)},${(Math.sin(r)*5.5).toFixed(1)})"/>`;
          }).join('')}
          <circle cx="0" cy="0" r="2" fill="rgba(255,220,80,0.8)"/>
        </g>`;
      case 'smoothie':
        // Fruit slice silhouette
        return `<g opacity="${op}">
          <circle cx="${lx+6}" cy="${midY}" r="8" fill="${d.cupTint}"/>
          ${[0,60,120,180,240,300].map(a => {
            const r = a * Math.PI / 180;
            return `<line x1="${lx+6}" y1="${midY}"
              x2="${(lx+6+Math.cos(r)*8).toFixed(1)}" y2="${(midY+Math.sin(r)*8).toFixed(1)}"
              stroke="rgba(255,255,255,0.45)" stroke-width="0.9"/>`;
          }).join('')}
          <circle cx="${lx+6}" cy="${midY}" r="2.5" fill="rgba(255,255,255,0.25)"/>
        </g>`;
      case 'lemonade':
      case 'oj':
        // Citrus wheel
        return `<g opacity="${op}">
          <circle cx="${lx+6}" cy="${midY}" r="8" fill="${d.cupTint}"/>
          ${[0,45,90,135].map(a => {
            const r = a * Math.PI / 180;
            return `<line
              x1="${(lx+6-Math.cos(r)*8).toFixed(1)}" y1="${(midY-Math.sin(r)*8).toFixed(1)}"
              x2="${(lx+6+Math.cos(r)*8).toFixed(1)}" y2="${(midY+Math.sin(r)*8).toFixed(1)}"
              stroke="rgba(255,255,255,0.38)" stroke-width="0.9"/>`;
          }).join('')}
        </g>`;
      default:
        return '';
    }
  }

  // ---- Wall drizzle (boba / caramel drinks at 100%) ----
  function buildWallDrizzle(type, CX, CW, CTY, CBY, pct) {
    if (pct < 100) return '';
    const drizzleMap = {
      milktea:    '#3a1702',
      caramel_mac: '#b45309',
      dalgona:    '#8a4a10',
    };
    const clr = drizzleMap[type];
    if (!clr) return '';

    // Left-wall streaks
    const lStreaks = [
      `M ${CX+8},${CTY+8} C ${CX+6},${CTY+38} ${CX+10},${CTY+68} ${CX+8},${CTY+100}`,
      `M ${CX+13},${CTY+4} C ${CX+11},${CTY+28} ${CX+15},${CTY+56} ${CX+11},${CTY+82}`,
    ].map(path => `<path d="${path}" stroke="${clr}" stroke-width="1.8" fill="none" opacity="0.60" stroke-linecap="round"/>`).join('');

    // Right-wall streaks
    const rStreaks = [
      `M ${CX+CW-8},${CTY+6} C ${CX+CW-6},${CTY+34} ${CX+CW-10},${CTY+62} ${CX+CW-8},${CTY+94}`,
      `M ${CX+CW-13},${CTY+3} C ${CX+CW-11},${CTY+30} ${CX+CW-15},${CTY+58} ${CX+CW-12},${CTY+85}`,
    ].map(path => `<path d="${path}" stroke="${clr}" stroke-width="1.5" fill="none" opacity="0.45" stroke-linecap="round"/>`).join('');

    return `<g clip-path="url(#lf_cupClip)">${lStreaks}${rStreaks}</g>`;
  }

  // ---- Milestone surface ripple (plays once at 25 / 50 / 75%) ----
  function buildRipple(CX, CW, fillY) {
    const cx = CX + CW / 2;
    return `
      <ellipse cx="${cx}" cy="${fillY + 2}" rx="10" ry="3.5"
        fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"
        style="animation:lfRipple 0.9s ease-out forwards"/>
      <ellipse cx="${cx}" cy="${fillY + 2}" rx="5" ry="2"
        fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="1"
        style="animation:lfRipple 0.9s ease-out 0.13s forwards"/>`;
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

  // ---- Bobas — anchored at the bottom of the liquid fill ----
  function generateBobas(CX, fillY, CW, fillH, color) {
    if (fillH < 10) return '';
    // Offset from the BOTTOM of the cup (CBY direction) — bobas sink and rest there
    // Larger offset = closer to surface; small = hugging the bottom
    const positions = [
      [CX+15, 4], [CX+30, 6], [CX+50, 3], [CX+65, 5], [CX+80, 4],
      [CX+22, 14],[CX+45, 12],[CX+68, 15],[CX+38, 20],[CX+58, 18],
    ];
    const bottomY = fillY + fillH;   // y-coordinate of cup bottom at current fill
    return positions.map(([bx, offsetFromBottom], i) => {
      const by = bottomY - offsetFromBottom;   // anchor from the bottom up
      if (by <= fillY + 4) return '';           // don't let bobas escape above liquid surface
      const dur = 1.8 + (i % 3) * 0.4;
      return `<g style="animation:lfBoba ${dur}s ease-in-out infinite ${ao(dur)}">
        <circle cx="${bx}" cy="${by}" r="5" fill="${color}" opacity="0.9"/>
        <circle cx="${bx-1}" cy="${by-1}" r="1.5" fill="rgba(255,255,255,0.2)"/>
      </g>`;
    }).join('');
  }

  // ---- Pour stream (visible while drink is actively filling) ----
  function buildPourStream(liquidColor, fillY, CTY, type) {
    const streamH = Math.max(0, fillY - CTY - 6);
    if (streamH < 10) return '';
    // Stroke width, bezier wobble, and opacity vary by drink viscosity
    const V = {
      smoothie: { sw: 5.5, w: 9, op: 0.72 },
      matcha:   { sw: 4.5, w: 7, op: 0.68 },
      milktea:  { sw: 4.0, w: 5, op: 0.65 },
      lemonade: { sw: 2.5, w: 2, op: 0.58 },
      oj:       { sw: 3.0, w: 3, op: 0.62 },
    }[type] || { sw: 3.5, w: 3, op: 0.68 };
    const cx = 72;
    return `
      <g style="animation:lfPour 1.4s ease-in-out infinite ${ao(1.4)}">
        <path d="M${cx},${CTY+4} C${cx-V.w},${CTY+streamH*0.35} ${cx+V.w},${CTY+streamH*0.65} ${cx},${fillY-2}"
          stroke="${liquidColor}" stroke-width="${V.sw}" fill="none" stroke-linecap="round" opacity="${V.op}"/>
        <ellipse cx="${cx}" cy="${fillY}" rx="${(V.sw * 1.6).toFixed(1)}" ry="1.8"
          fill="${liquidColor}" opacity="${(V.op * 0.45).toFixed(2)}"/>
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
  }

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

    // --- Layered drinks — smooth per-percent transitions, dynamic proportions, blend zones ---
    if (type === 'ca_phe_sua_da') {
      // Three layers: condensed milk (bottom) → ice (middle) → dark coffee (top)
      // Each layer fades/grows in continuously rather than popping at a threshold
      const milkPh   = Math.min(1, pct / 17);
      const icePh    = Math.min(1, Math.max(0, (pct - 15) / 26));   // grows in pct 15→41
      const coffeePh = Math.min(1, Math.max(0, (pct - 32) / 34));   // grows in pct 32→66
      // Layer fractions (always sum to 1)
      const cfFrac = 0.52 * coffeePh, icFrac = 0.20 * icePh;
      const mkFrac = Math.max(0.06, 1 - cfFrac - icFrac);
      // Heights and Y positions (bottom to top: milk, ice, coffee)
      const mkH = fillH * mkFrac, mkY = CBY - fillH * mkFrac;
      const icH = fillH * icFrac, icY = mkY - icH;
      const cfH = fillH * cfFrac;
      // Smooth opacities
      const mkOp = Math.min(0.95, milkPh * 2.8), icOp = Math.min(0.88, icePh * 2.2), cfOp = Math.min(0.92, coffeePh * 2.0);
      const blnd = Math.min(8, fillH * 0.05);  // blend overlap zone
      return `
        <rect x="${CX}" y="${mkY}" width="${CW}" height="${mkH + 5}" fill="#fce8b3" opacity="${mkOp.toFixed(2)}"/>
        <path d="${wavePath(mkY, 2, false)}" fill="#f0d890" opacity="${(mkOp * 0.42).toFixed(2)}"
          style="animation:lfW1 5s ease-in-out infinite ${wOff1}"/>
        ${icH > 1 ? `
          <rect x="${CX}" y="${icY}" width="${CW}" height="${icH + 5}" fill="#e8f4fb" opacity="${icOp.toFixed(2)}"/>
          <rect x="${CX}" y="${mkY}" width="${CW}" height="${blnd}" fill="#e8f4fb" opacity="${(icOp * 0.36).toFixed(2)}"/>
          ${icePh > 0.22 ? generateIceWithDrop(CX, icY + 4, pct) : ''}
        ` : ''}
        ${cfH > 1 ? `
          <rect x="${CX}" y="${fillY}" width="${CW}" height="${cfH + 5}" fill="#140904" opacity="${cfOp.toFixed(2)}"/>
          <rect x="${CX}" y="${icY}" width="${CW}" height="${blnd}" fill="#200a04" opacity="${(cfOp * 0.40).toFixed(2)}"/>
          <path d="${wavePath(fillY, 3, false)}" fill="#1f0d06" opacity="${(coffeePh * 0.50).toFixed(2)}"
            style="animation:lfW1 4s ease-in-out infinite ${wOff1}"/>
          <ellipse cx="${CX + CW/2}" cy="${fillY + 4}" rx="${CW*0.35}" ry="4"
            fill="rgba(100,50,10,0.22)" opacity="${(coffeePh * 0.88).toFixed(2)}"/>
        ` : ''}
        ${buildFoam(type, fillY, CX, CW, '#fce8b3')}`;
    }

    if (type === 'dalgona') {
      // Cold oat milk base (bottom) + thick caramel dalgona foam (top)
      const milkPh = Math.min(1, pct / 20);
      const icePh  = Math.min(1, Math.max(0, (pct - 18) / 25));   // pct 18→43
      const foamPh = Math.min(1, Math.max(0, (pct - 46) / 32));   // pct 46→78
      const fmFrac = 0.35 * foamPh, mkFrac = Math.max(0.06, 1 - fmFrac);
      const mkY = fillY + fillH * fmFrac;  // milk starts below foam
      const blnd = Math.min(8, fillH * 0.05);
      const mkOp = Math.min(0.92, milkPh * 2.5), icOp = Math.min(0.88, icePh * 2.2), fmOp = Math.min(0.90, foamPh * 2.0);
      return `
        <rect x="${CX}" y="${mkY}" width="${CW}" height="${fillH * mkFrac + 5}" fill="#f8f4ee" opacity="${mkOp.toFixed(2)}"/>
        <path d="${wavePath(mkY, 2, false)}" fill="#f0e8dc" opacity="${(mkOp * 0.46).toFixed(2)}"
          style="animation:lfW1 5s ease-in-out infinite ${wOff1}"/>
        ${icePh > 0.08 ? generateIceWithDrop(CX, mkY + 8, pct) : ''}
        ${foamPh > 0.02 ? `
          <rect x="${CX}" y="${fillY}" width="${CW}" height="${fillH * fmFrac + 5}" fill="#c87d2a" opacity="${fmOp.toFixed(2)}"/>
          <rect x="${CX}" y="${mkY}" width="${CW}" height="${blnd}" fill="#c87d2a" opacity="${(fmOp * 0.38).toFixed(2)}"/>
          <path d="${wavePath(fillY, 2, true)}" fill="#b06820" opacity="${(foamPh * 0.60).toFixed(2)}"
            style="animation:lfW2 6s ease-in-out infinite ${wOff2}"/>
          <ellipse cx="${CX+CW/2}" cy="${fillY+3}" rx="${CW*0.42}" ry="8"
            fill="#d4922a" opacity="${(fmOp * 0.80).toFixed(2)}"/>
          <ellipse cx="${CX+CW/2}" cy="${fillY+1}" rx="${CW*0.30}" ry="5"
            fill="rgba(255,220,160,0.22)" opacity="${foamPh.toFixed(2)}"/>
        ` : ''}`;
    }

    if (type === 'egg_coffee') {
      // Dark espresso base (bottom) + thick yellow egg custard float (top)
      const espPh  = Math.min(1, pct / 30);
      const custPh = Math.min(1, Math.max(0, (pct - 52) / 32));   // pct 52→84
      const csFrac = 0.35 * custPh, espFrac = Math.max(0.06, 1 - csFrac);
      const espY = fillY + fillH * csFrac;  // espresso starts below custard
      const blnd = Math.min(8, fillH * 0.05);
      const espOp = Math.min(0.95, espPh * 2.2), csOp = Math.min(0.92, custPh * 2.0);
      return `
        <rect x="${CX}" y="${espY}" width="${CW}" height="${fillH * espFrac + 5}" fill="#1c0a04" opacity="${espOp.toFixed(2)}"/>
        <path d="${wavePath(espY, 3, false)}" fill="#2a1008" opacity="${(espOp * 0.52).toFixed(2)}"
          style="animation:lfW1 4s ease-in-out infinite ${wOff1}"/>
        <ellipse cx="${CX+CW/2}" cy="${espY + 4}" rx="${CW*0.36}" ry="4"
          fill="rgba(140,60,10,0.24)" opacity="${(espOp * 0.85).toFixed(2)}"/>
        ${custPh > 0.02 ? `
          <rect x="${CX}" y="${fillY}" width="${CW}" height="${fillH * csFrac + 5}" fill="#f5d070" opacity="${csOp.toFixed(2)}"/>
          <rect x="${CX}" y="${espY}" width="${CW}" height="${blnd}" fill="#f5d070" opacity="${(csOp * 0.38).toFixed(2)}"/>
          <path d="${wavePath(fillY, 2, true)}" fill="#e8c040" opacity="${(custPh * 0.58).toFixed(2)}"
            style="animation:lfW2 5s ease-in-out infinite ${wOff2}"/>
          <ellipse cx="${CX+CW/2}" cy="${fillY + 3}" rx="${CW*0.40}" ry="7"
            fill="#fbe898" opacity="${(csOp * 0.68).toFixed(2)}"/>
        ` : ''}`;
    }

    if (type === 'iced_matcha') {
      // White oat milk base (bottom) + matcha cloud diffusing down from top
      const milkPh  = Math.min(1, pct / 25);
      const icePh   = Math.min(1, Math.max(0, (pct - 22) / 25));   // pct 22→47
      const matchPh = Math.min(1, Math.max(0, (pct - 44) / 34));   // pct 44→78
      const diffuse = Math.min(1, Math.max(0, (pct - 44) / 52));   // diffusion: 0 at 44%, 1 at 96%
      const mtFrac = 0.45 * matchPh, mkFrac = Math.max(0.06, 1 - mtFrac);
      const mkY = fillY + fillH * mtFrac;
      const blnd = Math.min(8, fillH * 0.05);
      const mkOp = Math.min(0.92, milkPh * 2.5), icOp = Math.min(0.88, icePh * 2.2), mtOp = Math.min(0.90, matchPh * 2.0);
      return `
        <rect x="${CX}" y="${mkY}" width="${CW}" height="${fillH * mkFrac + 5}" fill="#f5f0e8" opacity="${mkOp.toFixed(2)}"/>
        <path d="${wavePath(mkY, 2, false)}" fill="#ede8dc" opacity="${(mkOp * 0.46).toFixed(2)}"
          style="animation:lfW1 5s ease-in-out infinite ${wOff1}"/>
        ${icePh > 0.08 ? generateIceWithDrop(CX, mkY + 6, pct) : ''}
        ${matchPh > 0.02 ? `
          <rect x="${CX}" y="${fillY}" width="${CW}" height="${fillH * mtFrac + 5}" fill="#3a7040" opacity="${mtOp.toFixed(2)}"/>
          <rect x="${CX}" y="${mkY}" width="${CW}" height="${blnd}" fill="#3a7040" opacity="${(mtOp * 0.36).toFixed(2)}"/>
          <path d="${wavePath(fillY, 2, true)}" fill="#2e6030" opacity="${(matchPh * 0.52).toFixed(2)}"
            style="animation:lfW2 4.5s ease-in-out infinite ${wOff2}"/>
          <ellipse cx="${CX+CW/2}" cy="${fillY + fillH*mtFrac*0.85}" rx="${CW*0.38}" ry="${4 + diffuse*6}"
            fill="rgba(180,220,180,0.24)" opacity="${(0.32 + diffuse*0.46).toFixed(2)}"/>
        ` : ''}`;
    }

    if (type === 'caramel_mac') {
      // Milk base (bottom) blending up to dark espresso crown, caramel cross at surface
      const milkPh  = Math.min(1, pct / 28);
      const crownPh = Math.min(1, Math.max(0, (pct - 46) / 32));   // pct 46→78
      const caramPh = Math.min(1, Math.max(0, (pct - 75) / 20));   // pct 75→95
      const crFrac = 0.40 * crownPh, mkFrac = Math.max(0.06, 1 - crFrac);
      const mkY = fillY + fillH * crFrac;
      const blnd = Math.min(8, fillH * 0.05);
      const mkOp = Math.min(0.90, milkPh * 2.5), crOp = Math.min(0.88, crownPh * 2.0), carOp = Math.min(0.75, caramPh * 2.2);
      return `
        <rect x="${CX}" y="${mkY}" width="${CW}" height="${fillH * mkFrac + 5}" fill="#f5ede0" opacity="${mkOp.toFixed(2)}"/>
        <path d="${wavePath(mkY, 2, false)}" fill="#ede0cc" opacity="${(mkOp * 0.43).toFixed(2)}"
          style="animation:lfW1 5s ease-in-out infinite ${wOff1}"/>
        ${crownPh > 0.02 ? `
          <rect x="${CX}" y="${fillY}" width="${CW}" height="${fillH * crFrac + 5}" fill="#2a1208" opacity="${crOp.toFixed(2)}"/>
          <rect x="${CX}" y="${mkY}" width="${CW}" height="${blnd}" fill="#2a1208" opacity="${(crOp * 0.40).toFixed(2)}"/>
          <path d="${wavePath(fillY, 3, true)}" fill="#1c0c06" opacity="${(crownPh * 0.58).toFixed(2)}"
            style="animation:lfW2 4s ease-in-out infinite ${wOff2}"/>
        ` : ''}
        ${caramPh > 0.04 ? `
          <path d="M${CX+18},${fillY+2} L${CX+42},${fillY+2} M${CX+30},${fillY-3} L${CX+30},${fillY+6}"
            stroke="#c88020" stroke-width="1.5" stroke-linecap="round" opacity="${carOp.toFixed(2)}"/>
          <path d="M${CX+54},${fillY+2} L${CX+82},${fillY+2} M${CX+68},${fillY-3} L${CX+68},${fillY+6}"
            stroke="#c88020" stroke-width="1.5" stroke-linecap="round" opacity="${carOp.toFixed(2)}"/>
        ` : ''}`;
    }

    if (type === 'irish_coffee') {
      // Gradient-blend approach: whiskey-dark amber base blending into green-kissed cream
      const cofPh   = Math.min(1, pct / 38);
      const creamPh = Math.min(1, Math.max(0, (pct - 58) / 32));
      const crFrac  = 0.28 * creamPh;
      const cofY    = fillY + fillH * crFrac;
      const blnd    = Math.min(14, fillH * 0.10); // wider blend zone = softer transition
      const cofOp   = Math.min(0.94, cofPh * 2.0), crOp = Math.min(0.90, creamPh * 2.0);
      // Irish green cream tint
      const irishCream = 'rgba(215,252,215,0.92)';
      return `
        <rect x="${CX}" y="${fillY}" width="${CW}" height="${fillH + 5}" fill="#1e0d08" opacity="${cofOp.toFixed(2)}"/>
        <path d="${wavePath(fillY + fillH*0.5, 3, false)}" fill="#160a05" opacity="${(cofOp * 0.45).toFixed(2)}"
          style="animation:lfW1 4.2s ease-in-out infinite ${wOff1}"/>
        ${creamPh > 0.02 ? `
          <rect x="${CX}" y="${fillY}" width="${CW}" height="${fillH * crFrac + blnd}" fill="${irishCream}" opacity="${crOp.toFixed(2)}"/>
          <rect x="${CX}" y="${fillY + fillH * crFrac}" width="${CW}" height="${blnd}" fill="${irishCream}" opacity="${(crOp * 0.42).toFixed(2)}"/>
          <path d="${wavePath(fillY, 2, true)}" fill="rgba(200,245,200,0.55)" opacity="${(creamPh * 0.65).toFixed(2)}"
            style="animation:lfW2 6s ease-in-out infinite ${wOff2}"/>
          <ellipse cx="${CX+CW/2}" cy="${fillY+2}" rx="${CW*0.44}" ry="8"
            fill="rgba(230,255,230,0.75)" opacity="${(crOp * 0.65).toFixed(2)}"/>
        ` : ''}`;
    }

    // ─── VOID — Cosmic purple-black with stars + orbit ring ────────────────────────────
    if (type === 'void') {
      const starSeeds = [
        [36,135,1.2,1.5],[62,88,0.9,2.2],[78,148,1.5,1.8],[44,72,1.0,2.5],
        [97,118,1.2,1.2],[112,84,0.9,2.0],[54,140,1.4,1.6],[88,96,1.1,1.9],
        [72,62,0.8,2.3],[104,143,1.5,1.4],[32,104,1.0,2.1],[118,112,1.2,1.7],
        [58,76,0.9,2.4],[92,132,1.3,1.5],[48,118,1.1,2.0],[108,68,0.8,1.9],
        [68,148,1.4,1.3],[82,78,1.0,2.2],[114,98,0.9,2.6],[40,90,1.1,1.4],
      ];
      // More stars = more progress
      const starCount = Math.floor(3 + (pct / 100) * 17);
      const stars = starSeeds.slice(0, Math.min(starCount, starSeeds.length)).map(([sx,sy,sr,sdur]) => {
        const sy2 = Math.max(fillY + 6, Math.min(CBY - 6, sy));
        return `<circle cx="${sx}" cy="${sy2}" r="${sr}" fill="rgba(255,255,255,${(0.2 + Math.min(0.6, pct/150)).toFixed(2)})"
          style="animation:voidStar ${sdur}s ease-in-out infinite ${ao(sdur)}"/>`;
      }).join('');
      const orbitY = fillY + 7;
      const orbitRx = CW * 0.42;
      return `
        <rect x="${CX-1}" y="${fillY}" width="${CW+2}" height="${CBY-fillY+5}" fill="url(#houseVoid)" opacity="0.96"/>
        <rect x="${CX-1}" y="${fillY}" width="${CW+2}" height="${CBY-fillY+5}" fill="rgba(50,15,90,0.18)"/>
        <path d="${wP1}" fill="rgba(70,25,110,0.50)"
          style="animation:lfW1 ${wSpd}s ease-in-out infinite ${wOff1}"/>
        <ellipse cx="${CX+CW/2}" cy="${fillY+CBY*0.38}" rx="${CW*0.18}" ry="${fillH*0.1}"
          fill="rgba(40,10,80,0.40)"/>
        ${stars}
        ${pct > 25 ? `
          <g style="animation:voidOrbit 7s linear infinite ${ao(7)};transform-origin:${CX+CW/2}px ${orbitY}px">
            <ellipse cx="${CX+CW/2}" cy="${orbitY}" rx="${orbitRx}" ry="5"
              fill="none" stroke="rgba(212,165,8,0.65)" stroke-width="1.8" stroke-dasharray="6 3"/>
          </g>
        ` : ''}
        ${pct > 60 ? `
          <g style="animation:voidOrbit 11s linear infinite reverse ${ao(11)};transform-origin:${CX+CW/2}px ${orbitY+4}px">
            <ellipse cx="${CX+CW/2}" cy="${orbitY+4}" rx="${orbitRx*0.62}" ry="3.5"
              fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2" stroke-dasharray="3 5"/>
          </g>
        ` : ''}
      `;
    }

    // ─── AURORA — Northern lights flowing color bands ──────────────────────────────
    if (type === 'aurora') {
      const band1Ph = Math.min(1, pct / 40);
      const band2Ph = Math.min(1, Math.max(0, (pct - 28) / 42));
      const band3Ph = Math.min(1, Math.max(0, (pct - 55) / 38));
      const auroraY1 = fillY + fillH * 0.45;
      const auroraY2 = fillY + fillH * 0.62;
      const auroraY3 = fillY + fillH * 0.28;
      const aCX = CX + CW/2;
      const pour = (pct > 4 && pct < 92) ? buildPourStream(d.liquidColor, fillY, CTY, 'milktea') : '';
      return `
        <rect x="${CX-1}" y="${fillY}" width="${CW+2}" height="${CBY-fillY+5}" fill="${liquidFill}" opacity="0.92"/>
        <path d="${wP2}" fill="${d.liquidColor2}" opacity="0.35"
          style="animation:lfW2 ${wSpd*1.3}s ease-in-out infinite ${wOff2}"/>
        <path d="${wP1}" fill="rgba(30,40,100,0.55)"
          style="animation:lfW1 ${wSpd}s ease-in-out infinite ${wOff1}"/>
        ${band1Ph > 0.03 ? `
          <ellipse cx="${aCX}" cy="${auroraY1}" rx="${CW*0.42}" ry="${Math.max(5, fillH*0.16)}"
            fill="rgba(167,139,250,${(band1Ph*0.32).toFixed(2)})"
            style="animation:auroraFlow 9s ease-in-out infinite ${ao(9)};transform-origin:${aCX}px ${auroraY1}px"/>
        ` : ''}
        ${band2Ph > 0.03 ? `
          <ellipse cx="${aCX}" cy="${auroraY2}" rx="${CW*0.40}" ry="${Math.max(4, fillH*0.14)}"
            fill="rgba(34,211,238,${(band2Ph*0.30).toFixed(2)})"
            style="animation:auroraFlow 12s ease-in-out infinite reverse ${ao(12)};transform-origin:${aCX}px ${auroraY2}px"/>
        ` : ''}
        ${band3Ph > 0.03 ? `
          <ellipse cx="${aCX}" cy="${auroraY3}" rx="${CW*0.38}" ry="${Math.max(4, fillH*0.13)}"
            fill="rgba(52,211,153,${(band3Ph*0.26).toFixed(2)})"
            style="animation:auroraFlow 7s ease-in-out infinite ${ao(7)};transform-origin:${aCX}px ${auroraY3}px"/>
        ` : ''}
        ${pct > 55 ? generateIce(CX, fillY) : ''}
        ${pour}
      `;
    }

    // --- Standard wave-fill system for all other drink types ---
    // Depth gradient: lighter at surface (light hits it), denser at depth
    const base = `
      <defs>
        <linearGradient id="lf_depthG" gradientUnits="userSpaceOnUse" x1="0" y1="${fillY}" x2="0" y2="${CBY}">
          <stop offset="0%"   stop-color="${d.liquidColor}" stop-opacity="0.36"/>
          <stop offset="35%"  stop-color="${d.liquidColor}" stop-opacity="0.52"/>
          <stop offset="100%" stop-color="${d.liquidColor}" stop-opacity="0.72"/>
        </linearGradient>
      </defs>
      <rect x="${CX-1}" y="${fillY+3}" width="${CW+2}" height="${CBY - fillY + 5}" fill="url(#lf_depthG)"/>`;
    const waves = `
      <path d="${wP2}" fill="${d.liquidColor2}" opacity="0.58"
        style="animation:lfW2 ${wSpd*1.3}s ease-in-out infinite ${wOff2}"/>
      <path d="${wP1}" fill="${liquidFill}" opacity="0.88"
        style="animation:lfW1 ${wSpd}s ease-in-out infinite ${wOff1}"/>`;

    // Pour stream during active fill — width/wobble vary by drink viscosity
    const pour = (pct > 4 && pct < 92) ? buildPourStream(d.liquidColor, fillY, 30, type) : '';

    let inner = '';

    if (type === 'coffee' && pct > 10) {
      inner = `<ellipse cx="70" cy="${fillY+4}" rx="${CW*0.38}" ry="4.5" fill="rgba(140,65,12,0.30)" opacity="0.88"/>`;
      // Crema micro-bubbles appear and pop at the surface
      [{x:38,d:1.9},{x:55,d:2.4},{x:72,d:1.7},{x:88,d:2.1},{x:104,d:1.6}].forEach(({x,d:dur}) => {
        inner += `<circle cx="${x}" cy="${fillY+3}" r="1.2" fill="rgba(180,90,20,0.45)"
          style="animation:lfBub ${dur}s ease-in infinite ${ao(dur)}"/>`;
      });
    }

    if (type === 'matcha' && fillH > 20) {
      const swY = fillY + fillH * 0.40;
      // Double-ring ceremonial swirl — outer ring counter-rotates for depth
      inner = `
        <g style="animation:lfSwirl 9s linear infinite ${ao(9)};transform-origin:70px ${swY}px">
          <ellipse cx="70" cy="${swY}" rx="${CW*0.28}" ry="${Math.max(5, fillH*0.15)}"
            fill="none" stroke="${d.liquidColor2}" stroke-width="2" opacity="0.36" stroke-dasharray="6 4"/>
          <ellipse cx="70" cy="${swY}" rx="${CW*0.17}" ry="${Math.max(3.5, fillH*0.09)}"
            fill="none" stroke="${d.liquidColor2}" stroke-width="1.5" opacity="0.28" stroke-dasharray="4 5"/>
        </g>
        <g style="animation:lfSwirl 14s linear infinite reverse ${ao(14)};transform-origin:70px ${swY}px">
          <ellipse cx="70" cy="${swY}" rx="${CW*0.10}" ry="${Math.max(2, fillH*0.055)}"
            fill="none" stroke="${d.foamColor}" stroke-width="1" opacity="0.22" stroke-dasharray="3 4"/>
        </g>`;
    }

    if (type === 'milktea' && fillH > 0) {
      // Milky cream layer
      inner = `<rect x="${CX}" y="${fillY+fillH*0.20}" width="${CW}" height="${fillH*0.22}"
        fill="rgba(232,218,198,0.30)" opacity="0.85"/>`;
      // Only render bobas if the drink actually has them (e.g. boba milktea, NOT lavender latte)
      if (d.bobas !== false && d.bobaColor) {
        inner += generateBobas(CX, fillY, CW, fillH, d.bobaColor);
      }
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

    if (type === 'chamomile' && pct > 15) {
      // Petals orbit the surface in a slow rotation
      const orbitY = fillY + 3;
      inner += `<g style="animation:lfSwirl 18s linear infinite ${ao(18)};transform-origin:70px ${orbitY}px">`;
      [[CX+25,3,-15,'rgba(255,232,102,0.78)'],[CX+56,2,12,'rgba(255,242,144,0.72)'],[CX+81,4,-6,'rgba(255,226,90,0.75)']].forEach(([px,py,rot,fc]) => {
        inner += `
          <ellipse cx="${px}" cy="${orbitY+py}" rx="4.5" ry="2" fill="${fc}" transform="rotate(${rot} ${px} ${orbitY+py})"/>
          <ellipse cx="${px}" cy="${orbitY+py}" rx="2" ry="4.5" fill="${fc}" opacity="0.75" transform="rotate(${rot+90} ${px} ${orbitY+py})"/>
          <circle cx="${px}" cy="${orbitY+py}" r="1.8" fill="rgba(255,200,50,0.82)"/>`;
      });
      inner += `</g>`;
    }

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

  // Tracks which milestone (25/50/75) has already shown its ripple this session
  let _lastRippleMilestone = -1;

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
    const liquidFill = (stepFill && stepFill !== 'transparent') ? stepFill : 'url(#lf_liquidGrad)';
    const foamFill100 = step100?.foamFill;
    const foamColor  = (foamFill100 && foamFill100 !== 'transparent')
      ? foamFill100 : (d.hasFoam ? d.foamColor : null);
    const garnishSvg = (pct >= 100 && step100?.garnishSvg) ? step100.garnishSvg : '';
    const svgContentRaw   = stepCfg?.svgContent || '';
    const svgContentIsOut = stepCfg?.svgContentOutside || false;
    const svgContentIn    = svgContentRaw && !svgContentIsOut ? svgContentRaw : '';
    const svgContentOut   = svgContentRaw &&  svgContentIsOut ? svgContentRaw : '';
    const bgGlow     = tierCfg?.bgGlow || 'transparent';
    scene.style.filter = (bgGlow && bgGlow !== 'transparent') ? `drop-shadow(0 0 20px ${bgGlow})` : '';

    // Cup geometry
    const CX = 20, CW = 100, CTY = 30, CBY = 155;
    const fillH = Math.max(0, (pct / 100) * (CBY - CTY - 20));
    const fillY = CBY - fillH;

    const type = d.type || 'coffee';
    const ac   = DRINK_ANIM[type] || DRINK_ANIM.coffee;

    // Cold drink flag — drives condensation drops on cup exterior
    const isCold = !!(d.hasIce || d.bobas ||
      ['oj','lemonade','iced_matcha','ca_phe_sua_da','dalgona'].includes(type));

    // Milestone ripple — fires once when pct first crosses 25, 50, 75
    let showRipple = false;
    for (const m of [25, 50, 75]) {
      if (pct >= m && _lastRippleMilestone < m) {
        _lastRippleMilestone = m;
        showRipple = true;
        break;
      }
    }
    if (pct < 20 && _lastRippleMilestone > 0) _lastRippleMilestone = 0; // reset on timer reset

    // Straw: hidden until pct>88, slides in from above and fades in over the final ~12%
    const showStraw = !!(d.bobas || d.hasIce);
    const STRAW_PCT = 88;
    const strawYOff = showStraw && pct > STRAW_PCT
      ? Math.round(22 * Math.max(0, (100 - pct) / 12))
      : 200;
    const strawOp = showStraw && pct > STRAW_PCT
      ? parseFloat(Math.min(0.85, (pct - STRAW_PCT) / 6 * 0.85).toFixed(2))
      : 0;

    const tierBadge = tierCfg && tierCfg.tier !== 'house' ? `
      <text x="145" y="16" text-anchor="end" font-family="Source Sans Pro,sans-serif"
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
    <svg viewBox="0 0 150 175" xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      style="width:100%;max-width:200px;margin:0 auto;display:block;">
      <defs>
        <clipPath id="lf_cupClip">
          <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}"/>
        </clipPath>
        <mask id="lf_cupMask">
          <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}" fill="white"/>
        </mask>
        <linearGradient id="lf_liquidGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${d.liquidColor}"/>
          <stop offset="100%" stop-color="${d.liquidColor2}"/>
        </linearGradient>
        <linearGradient id="lf_cupGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${d.cupTint}44"/>
          <stop offset="50%" stop-color="${d.cupTint}22"/>
          <stop offset="100%" stop-color="${d.cupTint}44"/>
        </linearGradient>
        ${tierCfg?.defs || ''}
        <clipPath id="lf_equipClip">
          <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${+(CX+CW-8*(fillY-CTY)/(CBY-CTY)).toFixed(1)},${fillY} ${+(CX+8*(fillY-CTY)/(CBY-CTY)).toFixed(1)},${fillY}"/>
        </clipPath>
      </defs>

      ${tierBadge}

      <!-- Drop shadow -->
      <ellipse cx="${CX + CW/2}" cy="${CBY+8}" rx="44" ry="6" fill="rgba(0,0,0,0.12)"/>

      <!-- Cup body background (visible interior when empty) -->
      <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}"
        fill="rgba(245,241,235,0.10)" stroke="none"/>

      ${showStraw && pct > STRAW_PCT ? buildStraw(CTY, CBY, strawYOff, strawOp) : ''}

      <!-- Liquid fill (masked to cup interior) -->
      ${pct > 0 ? `<g mask="url(#lf_cupMask)">${liquidSVG}</g>` : ''}

      <!-- Subtle interior glass sheen over liquid -->
      <polygon points="${CX},${CTY} ${CX+CW},${CTY} ${CX+CW-8},${CBY} ${CX+8},${CBY}"
        fill="url(#lf_cupGrad)" stroke="none"/>

      <!-- 3D cup walls (drawn over liquid edges for depth) -->
      ${buildCupWalls(d, type, CX, CW, CTY, CBY)}

      <!-- Cup surface decoration (left wall art) -->
      ${buildCupDecoration(type, d, CX, CW, CTY, CBY)}

      <!-- 3D rim ellipse -->
      ${buildRim3D(d, CX, CW, CTY)}

      <!-- Meniscus ring at liquid surface -->
      ${pct > 5 ? `<path d="M${CX+2},${fillY} Q${CX+CW/2},${fillY-3} ${CX+CW-2},${fillY}"
        fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-linecap="round"/>` : ''}

      ${(!d.bobas && !d.hasIce) ? buildLid(CX, CW, CTY, d.cupTint) : ''}

      ${steamSVG}

      <!-- svgContent inside cup (pearls, ice, shimmer etc.) -->
      ${svgContentIn ? `<g mask="url(#lf_cupMask)">${svgContentIn}</g>` : ''}

      <!-- Garnish at 100% -->
      ${garnishSvg ? `<g clip-path="url(#lf_cupClip)">${garnishSvg}</g>` : ''}

      <!-- Wall drizzle (boba, caramel etc.) -->
      ${buildWallDrizzle(type, CX, CW, CTY, CBY, pct)}

      <!-- svgContent outside cup (orbit rings, glow halos, aurora bands) -->
      ${svgContentOut}

      ${pct >= 100 ? generateSparkles() : ''}
      ${showRipple && pct > 0 ? `<g mask="url(#lf_cupMask)">${buildRipple(CX, CW, fillY)}</g>` : ''}
      ${isCold && pct > 0 ? buildCondensation(CX, CW, CTY, CBY, pct) : ''}

      <!-- Progress % text -->
      ${pct > 15 ? `
      <text x="${CX + CW/2}" y="${Math.max(fillY + 18, CBY - 10)}"
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
          // Swirl-fade the current cup before switching
          const scene = document.getElementById('drinkScene');
          if (scene) scene.style.animation = 'lfDrinkChange 0.38s ease-in forwards';
          setTimeout(() => {
            if (scene) scene.style.animation = '';
            setDrink(d.id);
            renderCup(currentPct);
            modal.remove();
          }, 400);
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
  function savePositions(p) {
    try {
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(p));
      document.dispatchEvent(new CustomEvent('letsfocus:datasave', { detail: { key: POSITIONS_KEY } }));
    } catch(e) {}
  }

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
    _currentCategoryName = goalCategoryName || null;  // store for category pill in setDrink
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
