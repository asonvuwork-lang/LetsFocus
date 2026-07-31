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
    '🧋 Milk Tea':      null,
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
    // Code-exclusive
    birthday_cake:      'birthdayCake',
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
    boba:           '_boba',
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
    // Code-exclusive
    birthday_cake:  '_birthday_cake',
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
    _boba: {
      label: 'Brown Sugar Boba', type: 'milktea',
      liquidColor: '#3a1a08', liquidColor2: '#a5742e',
      foamColor: '#f0e0c0', cupTint: '#8a5020',
      bobas: true, bobaColor: '#160a02',
      hasFoam: true, hasIce: false, rarity: 'uncommon',
      dripDrizzle: { color: '#4a2005', tierGate: 'mastercraft' },
    },
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
      dripDrizzle: { color: '#8a4a10' },
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
      dripDrizzle: { color: '#b45309' },
    },
    _irish_coffee: {
      label: 'Irish Coffee', type: 'irish_coffee',
      liquidColor: '#1e0d08', liquidColor2: '#f8f2e8',
      foamColor: '#f8f2e8', cupTint: '#8b6030',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'rare',
    },
    _espresso: {
      label: 'Espresso', type: 'coffee',
      liquidColor: '#0a0402', liquidColor2: '#1e0804',
      foamColor: 'rgba(200,150,70,0.85)', cupTint: '#5a2808',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'common',
      cremaRing: true,  // tight golden crema ring — distinguishes from americano
    },
    _americano: {
      label: 'Americano', type: 'coffee',
      liquidColor: '#2a1a0c', liquidColor2: '#4a2e14',
      foamColor: null,  // NO foam — key visual difference from espresso
      cupTint: '#704828', bobas: false, hasFoam: false, hasIce: false, rarity: 'common',
    },
    _flat_white: {
      label: 'Flat White', type: 'coffee',
      liquidColor: '#b08060', liquidColor2: '#c89870',
      foamColor: 'rgba(255,255,255,0.92)', cupTint: '#8a6040',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'common',
      // Visibly milky/light brown — stands out from dark espresso cluster
    },
    _hot_choc: {
      label: 'Hot Chocolate', type: 'coffee',
      liquidColor: '#3e1c08', liquidColor2: '#6a3010',
      foamColor: 'rgba(255,255,255,0.95)', cupTint: '#5a2010',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'common',
      dripDrizzle: { color: '#2a0d00' },  // chocolate drizzle over white foam
    },
    _latte: {
      label: 'Latte', type: 'coffee',
      liquidColor: '#8a5c38', liquidColor2: '#c8a070',
      foamColor: 'rgba(255,255,255,0.88)', cupTint: '#8a6040',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
      // Warm caramel-brown — visibly lighter than cappuccino
    },
    _cappuccino: {
      label: 'Cappuccino', type: 'coffee',
      liquidColor: '#4a2010', liquidColor2: '#7a4028',
      foamColor: 'rgba(255,255,255,0.97)', cupTint: '#7a4020',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
      thickFoam: true,  // tall foam dome — most foam of any drink
    },
    _mocha: {
      label: 'Mocha', type: 'coffee',
      liquidColor: '#2a1010', liquidColor2: '#4a1818',
      foamColor: 'rgba(255,255,255,0.90)', cupTint: '#601818',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
      dripDrizzle: { color: '#2a0d00' },  // chocolate drizzle — unique to mocha + hot choc
    },
    _macchiato: {
      label: 'Macchiato', type: 'coffee',
      liquidColor: '#0e0604', liquidColor2: '#1e0e06',
      foamColor: 'rgba(245,225,195,0.70)', cupTint: '#602010',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'uncommon',
      spotFoam: true,  // small foam spot only — macchiato means "marked"
    },
    _vienna_coffee: {
      label: 'Vienna Coffee', type: 'coffee',
      liquidColor: '#1c0e08', liquidColor2: '#3a2010',
      foamColor: 'rgba(255,248,235,0.96)', cupTint: '#7a5030',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'rare',
      whipCream: true,  // dollop of whipped cream on top — unique to vienna
    },
    _affogato: {
      label: 'Affogato', type: 'coffee',
      liquidColor: '#3b1e0e', liquidColor2: '#fffdf5',
      foamColor: 'rgba(255,252,235,0.88)', cupTint: '#7a5020',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'epic',
    },
    _birthday_cake: {
      label: 'Birthday Cake', type: 'birthday_cake',
      liquidColor: '#2a1200', liquidColor2: '#f5f0e8',
      foamColor: 'rgba(255,250,245,0.97)', cupTint: '#c0883a',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'legendary',
      birthdayCake: true,
    },
    _lavender_latte: {
      label: 'Lavender Latte', type: 'milktea',
      liquidColor: '#3c2850', liquidColor2: '#9070b8',
      foamColor: 'rgba(200,170,240,0.80)', cupTint: '#7050a0',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'rare',
      dripDrizzle: { color: '#d4922a', tierGate: 'mastercraft' },
    },
    // ---- Epic drinks (unique vibrant visuals) ----
    _rose_gold: {
      label: 'Rose Gold Latte', type: 'rosegold',
      liquidColor: '#9a3858', liquidColor2: '#e8a878',
      foamColor: 'rgba(255,200,160,0.85)', cupTint: '#c07848',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'epic',
      // Deep rose-to-peach gradient — warm tones, gold shimmer foam
    },
    _cherry_blossom: {
      label: 'Cherry Blossom', type: 'sakura',
      liquidColor: '#5a2848', liquidColor2: '#e8c0d8',
      foamColor: 'rgba(255,220,240,0.90)', cupTint: '#c090b0',
      bobas: false, hasFoam: true, hasIce: false, rarity: 'epic',
      petalFlecks: true,  // pink petal flecks on foam surface — unique identifier
    },
    _galaxy_brew: {
      label: 'Galaxy Cold Brew', type: 'galaxy',
      liquidColor: '#1a0840', liquidColor2: '#3020a0',
      foamColor: 'rgba(160,120,240,0.72)', cupTint: '#2010a0',
      bobas: false, hasFoam: false, hasIce: true, rarity: 'epic',
    },
    _midnight_esp: {
      label: 'Midnight Espresso', type: 'midnight',
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
      auroraRibbon: true,
    },
    _golden_hour: {
      label: 'Golden Hour', type: 'goldenhour',
      liquidColor: '#451a03', liquidColor2: '#e0a030',
      foamColor: 'rgba(252,195,60,0.80)', cupTint: '#c08010',
      bobas: false, hasFoam: false, hasIce: false, rarity: 'legendary',
    },
    _barista_secret: {
      label: "Barista's Secret", type: 'secret',
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

  // ---- Session-seeded RNG (used for themed drizzle jitter) ----
  // Deterministic per-session/drink-swap so animation doesn't jitter frame to frame,
  // but varies session-to-session and drink-to-drink so streams don't look copy-pasted.
  function seededRng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  let _drizzleRng = seededRng(1);

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

  function tierRank(tier) {
    return tier === 'mastercraft' ? 2 : tier === 'signature' ? 1 : 0;
  }

  // Returns the highest step config whose threshold ≤ pct
  function getStepConfig(tierCfg, pct) {
    if (!tierCfg?.steps) return null;
    const thresholds = Object.keys(tierCfg.steps).map(Number).sort((a, b) => a - b);
    let chosen = thresholds[0];
    for (const t of thresholds) { if (pct >= t) chosen = t; else break; }
    return tierCfg.steps[chosen] || null;
  }

  // Collects svgContent from ALL steps up to and including pct.
  // This keeps earlier step artwork (drizzle, pearls, ice) visible as pct rises.
  function getCumulativeSvgContent(tierCfg, pct) {
    if (!tierCfg?.steps) return '';
    const thresholds = Object.keys(tierCfg.steps).map(Number).sort((a, b) => a - b);
    let combined = '';
    for (const t of thresholds) {
      if (pct >= t && tierCfg.steps[t].svgContent) combined += tierCfg.steps[t].svgContent;
    }
    return combined;
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
    // Fresh session-seeded RNG for this drink/session — stable for the whole session,
    // varies session-to-session so drizzle/sparkle streams don't look copy-pasted.
    _drizzleRng = seededRng((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
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
    birthday_cake: { waveAmp: 0, waveSpeed:  8.0, steam: false },
    // Layered shop drinks
    ca_phe_sua_da: { waveAmp: 2, waveSpeed: 5.0, steam: false },
    dalgona:       { waveAmp: 2, waveSpeed: 5.5, steam: false },
    egg_coffee:    { waveAmp: 2, waveSpeed: 4.5, steam: true  },
    iced_matcha:   { waveAmp: 2, waveSpeed: 5.0, steam: false },
    caramel_mac:   { waveAmp: 2, waveSpeed: 4.5, steam: true  },
    irish_coffee:  { waveAmp: 2, waveSpeed: 4.0, steam: true  },
    // Bespoke premium types (previously borrowed coffee/smoothie/lemonade)
    galaxy:        { waveAmp: 1.5, waveSpeed: 6.0, steam: false },
    midnight:      { waveAmp: 2,   waveSpeed: 4.5, steam: true  },
    rosegold:      { waveAmp: 2,   waveSpeed: 4.5, steam: false },
    sakura:        { waveAmp: 2,   waveSpeed: 5.0, steam: false },
    secret:        { waveAmp: 2,   waveSpeed: 4.0, steam: false },
    goldenhour:    { waveAmp: 2.5, waveSpeed: 4.0, steam: true  },
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
      @keyframes voidOrbitOuter { from{stroke-dashoffset:0} to{stroke-dashoffset:-232} }
      @keyframes voidOrbitInner { from{stroke-dashoffset:0} to{stroke-dashoffset:143} }
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
    golden_hour:'lemonade',
    birthday_cake:'birthday_cake', _birthday_cake:'birthday_cake',
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
    _boba:            ['black tea', 'brown sugar syrup', 'tapioca pearls', 'oat milk'],
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
    // Code-exclusive
    _birthday_cake:   ['dark chocolate sponge', 'vanilla buttercream', 'Belgian ganache', 'rainbow sprinkles', 'gold drizzle'],
    birthday_cake:    ['dark chocolate sponge', 'vanilla buttercream', 'Belgian ganache', 'rainbow sprinkles', 'gold drizzle'],
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
    // Bespoke premium palette (previously fell back to CUP_WALL_COLORS.coffee)
    galaxy:        { lt: 'rgba(150,105,225,0.85)', dk: 'rgba(14,5,42,0.94)'  },
    midnight:      { lt: 'rgba(120,90,180,0.85)',  dk: 'rgba(10,5,25,0.95)'  },
    rosegold:      { lt: 'rgba(255,190,160,0.90)', dk: 'rgba(120,40,70,0.90)'},
    sakura:        { lt: 'rgba(255,200,220,0.90)', dk: 'rgba(90,40,70,0.90)' },
    secret:        { lt: 'rgba(60,220,200,0.75)',  dk: 'rgba(5,40,35,0.95)'  },
    goldenhour:    { lt: 'rgba(255,210,130,0.95)', dk: 'rgba(90,50,10,0.92)' },
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

  // ---- Marble blob — one organic, wobbly closed shape (not a straight line) ----
  // Built from N points scattered around an ellipse with randomized radius jitter,
  // connected with smoothed quadratic curves through midpoints so the outline
  // reads as an irregular cloudy patch rather than a geometric shape.
  function buildMarbleBlob(cx, cy, rx, ry, rot, rng) {
    const N = 6;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const jitter = 0.72 + rng() * 0.5;
      pts.push([cx + Math.cos(angle) * rx * jitter, cy + Math.sin(angle) * ry * jitter]);
    }
    let d = `M ${((pts[0][0] + pts[N-1][0]) / 2).toFixed(1)},${((pts[0][1] + pts[N-1][1]) / 2).toFixed(1)}`;
    for (let i = 0; i < N; i++) {
      const p1 = pts[i], p2 = pts[(i + 1) % N];
      d += ` Q ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${((p1[0]+p2[0])/2).toFixed(1)},${((p1[1]+p2[1])/2).toFixed(1)}`;
    }
    d += ' Z';
    return rot
      ? `<path d="${d}" transform="rotate(${rot.toFixed(1)},${cx.toFixed(1)},${cy.toFixed(1)})"/>`
      : `<path d="${d}"/>`;
  }

  // ---- Syrup marbling — cloudy, blurred patches swirled INTO the liquid ----
  // Replaces the old wall-drizzle streaks, which read as crossed sticks once
  // several long streams landed close together. This instead mimics syrup
  // that hasn't fully dissolved: uneven soft blobs diffusing through the drink,
  // bounded to the current fill height (not floating above the liquid line),
  // scattered across the cup width rather than lined up like ribs.
  //   d.dripDrizzle = { color, tierGate? }  — set on a DRINKS entry
  //   tierGate: 'signature' | 'mastercraft' — gates on resolved recipe tier (live cup only)
  function buildSyrupMarbling(d, CX, CW, fillY, CBY, pct, rng, currentTierRank, clipId, blurId) {
    const cfg = d && d.dripDrizzle;
    if (!cfg) return '';
    if (pct < 15) return '';
    if (cfg.tierGate) {
      const gateRank = cfg.tierGate === 'mastercraft' ? 2 : 1;
      if ((currentTierRank ?? Infinity) < gateRank) return '';
    }
    const fillH = CBY - fillY;
    if (fillH < 18) return '';
    const clr   = cfg.color;
    const count = Math.max(2, Math.round(2 + (pct / 100) * 5));
    const top = fillY + 6, bottom = CBY - 8;
    const blobs = [];
    for (let i = 0; i < count; i++) {
      const bx = CX + 10 + rng() * (CW - 20);
      const by = top + rng() * Math.max(4, bottom - top);
      const streaky = rng() < 0.5;
      const rx  = streaky ? 4 + rng() * 4  : 8 + rng() * 8;
      const ry  = streaky ? 14 + rng() * 20 : 9 + rng() * 10;
      const rot = (rng() - 0.5) * 50;
      const op  = 0.22 + rng() * 0.30;
      blobs.push(`<g opacity="${op.toFixed(2)}" fill="${clr}">${buildMarbleBlob(bx, by, rx, ry, rot, rng)}</g>`);
    }
    return `<g clip-path="url(#${clipId || 'lf_cupClip'})" filter="url(#${blurId || 'lf_marbleBlur'})">${blobs.join('')}</g>`;
  }

  // ---- Aurora ribbon — replaces the old flat two-line "drizzle-looking" garnish ----
  function buildAuroraRibbon(CX, CW, CTY, pct, rng) {
    if (pct < 88) return '';
    const opacity = Math.min(1, (pct - 88) / 10);
    const cx = CX + CW / 2;
    const y1 = CTY + 18 + rng() * 6;
    const y2 = CTY + 28 + rng() * 8;
    const sparkles = Array.from({ length: 5 }, () => {
      const sx = CX + 10 + rng() * (CW - 20);
      const sy = CTY + 12 + rng() * 22;
      const dur = 1.3 + rng() * 1.3;
      return `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(1 + rng() * 1.3).toFixed(1)}"
        fill="rgba(210,225,255,0.88)" style="animation:sparkle ${dur.toFixed(1)}s ease-in-out infinite ${ao(dur)}"/>`;
    }).join('');
    return `
      <path d="M${CX+8},${y1.toFixed(1)} C${(cx-20).toFixed(1)},${(y1-14).toFixed(1)} ${(cx+20).toFixed(1)},${(y1+16).toFixed(1)} ${CX+CW-8},${(y1-6).toFixed(1)}"
        fill="none" stroke="#22d3ee" stroke-width="3.5" stroke-linecap="round" opacity="${(opacity*0.80).toFixed(2)}"/>
      <path d="M${CX+10},${y2.toFixed(1)} C${(cx-16).toFixed(1)},${(y2+12).toFixed(1)} ${(cx+18).toFixed(1)},${(y2-10).toFixed(1)} ${CX+CW-10},${(y2+8).toFixed(1)}"
        fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" opacity="${(opacity*0.65).toFixed(2)}"/>
      ${sparkles}`;
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
  // d (optional) carries special flags: thickFoam, spotFoam, whipCream
  function buildFoam(type, fillY, CX, CW, foamColor, d) {
    const cx = CX + CW / 2;
    // Special foam shapes override type-based logic
    if (d?.thickFoam) return `
      <ellipse cx="${cx}"    cy="${fillY}"   rx="${CW*0.44}" ry="11"  fill="${foamColor}" opacity="0.95"/>
      <ellipse cx="${cx-12}" cy="${fillY-2}" rx="10"         ry="7"   fill="${foamColor}" opacity="0.75"/>
      <ellipse cx="${cx+14}" cy="${fillY-1}" rx="9"          ry="6.5" fill="${foamColor}" opacity="0.78"/>
      <ellipse cx="${cx}"    cy="${fillY-3}" rx="${CW*0.28}" ry="5"   fill="rgba(255,255,255,0.25)"/>`;
    if (d?.spotFoam) return `
      <ellipse cx="${cx}" cy="${fillY+1}" rx="${CW*0.22}" ry="5.5" fill="${foamColor}" opacity="0.82"/>
      <ellipse cx="${cx}" cy="${fillY}"   rx="${CW*0.12}" ry="3"   fill="rgba(255,255,255,0.18)"/>`;
    if (d?.whipCream) return `
      <ellipse cx="${cx}" cy="${fillY-2}"  rx="${CW*0.40}" ry="10" fill="${foamColor}" opacity="0.95"/>
      <ellipse cx="${cx}" cy="${fillY-6}"  rx="${CW*0.28}" ry="7"  fill="${foamColor}" opacity="0.90"/>
      <ellipse cx="${cx}" cy="${fillY-10}" rx="${CW*0.16}" ry="5"  fill="rgba(255,255,255,0.30)"/>`;
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
  function buildLiquid(d, type, fillY, fillH, CX, CW, CBY, liquidFill, foamColor, pct, wAmp, wSpd, CTY) {
    const wOff1 = ao(wSpd), wOff2 = ao(wSpd * 1.3);
    const wP1 = wavePath(fillY, wAmp, false);
    const wP2 = wavePath(fillY, wAmp, true);
    const BUBBLE_SIZES = [2, 2.5, 2, 1.8, 2.5, 1.5, 2.2];
    // Declared up front (not down near the standard-flow section) because the
    // bespoke premium-type branches below (galaxy/midnight/rosegold/sakura/
    // secret/goldenhour) assign to it before the standard flow runs.
    let inner = '';

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
          <ellipse cx="${CX+CW/2}" cy="${orbitY}" rx="${orbitRx}" ry="5"
            fill="none" stroke="rgba(212,165,8,0.65)" stroke-width="1.8"
            stroke-dasharray="32 200"
            style="animation:voidOrbitOuter 7s linear infinite ${ao(7)}"/>
        ` : ''}
        ${pct > 60 ? `
          <ellipse cx="${CX+CW/2}" cy="${orbitY+4}" rx="${orbitRx*0.62}" ry="3.5"
            fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"
            stroke-dasharray="20 125"
            style="animation:voidOrbitInner 11s linear infinite ${ao(11)}"/>
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

    // ─── GALAXY — Nebula swirl + growing starfield (distinct from Void & Aurora) ───
    if (type === 'galaxy') {
      const starSeeds = [
        [34,130,1.3,2.0],[58,92,1.0,2.6],[82,145,1.6,1.7],[46,70,1.1,2.3],
        [100,115,1.3,1.9],[70,60,1.0,2.5],[110,138,1.4,1.6],[54,105,1.2,2.1],
      ];
      const starCount = Math.max(2, Math.floor(2 + (pct / 100) * (starSeeds.length - 2)));
      const stars = starSeeds.slice(0, starCount).map(([sx,sy,sr,sdur]) => {
        const sy2 = Math.max(fillY + 6, Math.min(CBY - 6, sy));
        return `<circle cx="${sx}" cy="${sy2}" r="${sr}" fill="rgba(230,220,255,${(0.25 + Math.min(0.55, pct/160)).toFixed(2)})"
          style="animation:voidStar ${sdur}s ease-in-out infinite ${ao(sdur)}"/>`;
      }).join('');
      const swirlY = fillY + fillH * 0.45;
      const nebula = pct > 25 ? `
        <ellipse cx="${CX+CW/2}" cy="${swirlY}" rx="${CW*0.30}" ry="${Math.max(6, fillH*0.14)}"
          fill="rgba(140,80,220,0.30)" style="animation:lfSwirl 12s linear infinite ${ao(12)};transform-origin:${CX+CW/2}px ${swirlY}px"/>
        <ellipse cx="${CX+CW/2}" cy="${swirlY}" rx="${CW*0.16}" ry="${Math.max(3, fillH*0.08)}"
          fill="rgba(80,190,220,0.24)" style="animation:lfSwirl 8s linear infinite reverse ${ao(8)};transform-origin:${CX+CW/2}px ${swirlY}px"/>` : '';
      inner = stars + nebula;
      if (pct > 55) inner += generateIce(CX, fillY);
    }

    // ─── MIDNIGHT — Deep near-black with faint twinkling star-flecks ───────────────
    if (type === 'midnight' && pct > 10) {
      inner = `<ellipse cx="70" cy="${fillY+4}" rx="${CW*0.36}" ry="4" fill="rgba(60,30,100,0.35)" opacity="0.85"/>`;
      [{x:40,d:2.4},{x:60,d:3.0},{x:80,d:2.1},{x:100,d:2.7}].forEach(({x,d:dur}) => {
        inner += `<circle cx="${x}" cy="${fillY+3}" r="1.1" fill="rgba(220,200,255,0.55)"
          style="animation:lfBub ${dur}s ease-in infinite ${ao(dur)}"/>`;
      });
    }

    // ─── ROSE GOLD — Rose/gold shimmer flecks only (no clashing fruit colors) ──────
    if (type === 'rosegold' && fillH > 15) {
      [[CX+20,0.42,'rgba(255,205,170,0.65)'],[CX+50,0.30,'rgba(240,200,150,0.55)'],
       [CX+80,0.55,'rgba(255,220,190,0.60)'],[CX+65,0.68,'rgba(230,180,140,0.50)']]
        .forEach(([px,py,fc]) => { inner += `<circle cx="${px}" cy="${fillY+fillH*py}" r="1.8" fill="${fc}"/>`; });
    }

    // ─── SAKURA (Cherry Blossom) — kept minimal; petal flecks handle the decoration ─
    if (type === 'sakura') {
      // intentionally no generic fleck decoration here
    }

    // ─── SECRET (Barista's Secret) — mysterious teal bubbles, no citrus wheel ──────
    if (type === 'secret' && fillH > 10) {
      [{x:CX+20,d:2.0},{x:CX+45,d:2.6},{x:CX+70,d:1.8},{x:CX+90,d:2.4}].forEach(({x,d:dur}) => {
        inner += `<circle cx="${x}" cy="${fillY+fillH*0.8}" r="2" fill="rgba(45,212,191,0.5)"
          style="animation:lfBub ${dur}s ease-in infinite ${ao(dur)}"/>`;
      });
    }

    // ─── GOLDEN HOUR — Warm gold-dust twinkle instead of orange crema bubbles ──────
    if (type === 'goldenhour' && pct > 10) {
      inner = `<ellipse cx="70" cy="${fillY+4}" rx="${CW*0.36}" ry="4" fill="rgba(240,180,60,0.28)" opacity="0.85"/>`;
      [{x:42,d:2.2},{x:62,d:2.8},{x:82,d:1.9},{x:100,d:2.5}].forEach(({x,d:dur}) => {
        inner += `<circle cx="${x}" cy="${fillY+3}" r="1.2" fill="rgba(255,220,120,0.7)"
          style="animation:lfBub ${dur}s ease-in infinite ${ao(dur)}"/>`;
      });
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
    const pour = (pct > 4 && pct < 92) ? buildPourStream(d.liquidColor, fillY, CTY, type) : '';

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
      // Each flower floats independently — no shared rotation (which caused orbiting)
      const floatY = fillY + 4;
      [[CX+25, 3, -15, 'rgba(255,232,102,0.78)', ao(3.2)],
       [CX+56, 2,  12, 'rgba(255,242,144,0.72)', ao(2.7)],
       [CX+81, 4,  -6, 'rgba(255,226,90,0.75)',  ao(3.8)]].forEach(([px, py, rot, fc, off]) => {
        inner += `
          <g style="animation:lfFloat 3.2s ease-in-out infinite ${off};transform-origin:${px}px ${floatY+py}px">
            <ellipse cx="${px}" cy="${floatY+py}" rx="4.5" ry="2" fill="${fc}" transform="rotate(${rot} ${px} ${floatY+py})"/>
            <ellipse cx="${px}" cy="${floatY+py}" rx="2" ry="4.5" fill="${fc}" opacity="0.75" transform="rotate(${rot+90} ${px} ${floatY+py})"/>
            <circle cx="${px}" cy="${floatY+py}" r="1.8" fill="rgba(255,200,50,0.82)"/>
          </g>`;
      });
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

    const foamSVG = foamColor && pct > 5 ? buildFoam(type, fillY, CX, CW, foamColor, d) : '';
    return base + waves + pour + inner + foamSVG;
  }

  // Tracks which milestone (25/50/75) has already shown its ripple this session
  let _lastRippleMilestone = -1;

  // ─────────────────────────────────────────────────────────────────────────────
  // BIRTHDAY CAKE — live timer cup renderer
  // Produces a 3-tier dark-chocolate ganache cake that builds tier-by-tier as
  // pct rises from 0 → 100.  Completely replaces the standard cup SVG so the
  // elliptical top faces are never cropped by the cup clip-path.
  //
  // Coordinate space: viewBox "0 0 150 175"  (matches renderCup's SVG template)
  // ─────────────────────────────────────────────────────────────────────────────
  function buildBirthdayCakeLiveSVG(pct, d, tierCfg) {
    const p  = Math.max(0, Math.min(100, pct));
    const cx = 75;   // horizontal centre
    const eH = 8;    // half-height of each tier's elliptical top face

    // Tier geometry — bottom (widest) → top (narrowest)
    const t1 = { cx: cx, by: 155, h: 35, w: 92 };
    const t2 = { cx: cx, by: 120, h: 32, w: 70 };
    const t3 = { cx: cx, by:  88, h: 30, w: 50 };

    // Progressive-reveal fractions
    function pf(start, end) {
      if (p < start) return 0;
      return Math.min(1, (p - start) / (end - start));
    }
    const f1 = pf(0,  20);   // tier 1 builds  0→20%
    const f2 = pf(20, 50);   // tier 2 builds 20→50%
    const f3 = pf(50, 70);   // tier 3 builds 50→70%
    const drizzPh    = pf(70, 85);           // ganache drizzle 70→85%
    const showFrost  = p >= 85 && f3 > 0.80; // cream frosting top
    const showSprink = p >= 94 && f3 > 0.90; // rainbow sprinkles
    const showCandle = p >= 98;               // birthday candle

    // Colour palette (dark Belgian-ganache aesthetic)
    const bodyC  = ['#2c1005', '#321208', '#2a0e04'];  // sponge per tier
    const topC   = ['#3d1808', '#421a0a', '#3a1608'];  // ganache top face per tier
    const rimC   = '#8b4020';
    const drizzC = '#1a0600';                           // near-black drizzle

    // ── Tier builder ────────────────────────────────────────────────────────
    function buildTier(t, frac, bodyFill, topFill) {
      if (frac <= 0) return '';
      const h   = t.h * frac;
      const hw  = t.w / 2;
      const topY = t.by - h;
      const op  = Math.min(1, frac * 3).toFixed(2);
      // Sponge layer texture bands (exposed on the cut side)
      const b1Y = topY + h * 0.35;
      const b2Y = topY + h * 0.68;
      const bands = frac > 0.50 ? `
        <line x1="${(t.cx-hw+2).toFixed(1)}" y1="${b1Y.toFixed(1)}" x2="${(t.cx+hw-2).toFixed(1)}" y2="${b1Y.toFixed(1)}" stroke="rgba(255,220,180,0.16)" stroke-width="1.2"/>
        <line x1="${(t.cx-hw+2).toFixed(1)}" y1="${b2Y.toFixed(1)}" x2="${(t.cx+hw-2).toFixed(1)}" y2="${b2Y.toFixed(1)}" stroke="rgba(255,220,180,0.11)" stroke-width="0.9"/>` : '';
      return `
        <ellipse cx="${t.cx}" cy="${t.by}" rx="${(hw+4).toFixed(1)}" ry="${(eH*0.55).toFixed(1)}" fill="rgba(0,0,0,0.20)" opacity="${op}"/>
        <rect x="${(t.cx-hw).toFixed(1)}" y="${topY.toFixed(1)}" width="${t.w}" height="${h.toFixed(1)}" fill="${bodyFill}" opacity="${op}"/>
        ${bands}
        <rect x="${(t.cx-hw).toFixed(1)}" y="${topY.toFixed(1)}" width="6" height="${h.toFixed(1)}" fill="rgba(255,255,255,0.07)" opacity="${op}"/>
        <rect x="${(t.cx+hw-6).toFixed(1)}" y="${topY.toFixed(1)}" width="6" height="${h.toFixed(1)}" fill="rgba(0,0,0,0.18)" opacity="${op}"/>
        <ellipse cx="${t.cx}" cy="${topY.toFixed(1)}" rx="${hw}" ry="${eH}" fill="${topFill}" opacity="${op}"/>
        <ellipse cx="${t.cx}" cy="${topY.toFixed(1)}" rx="${hw}" ry="${eH}" fill="none" stroke="${rimC}" stroke-width="1.3" opacity="${(Math.min(1, parseFloat(op))*0.55).toFixed(2)}"/>`;
    }

    // ── Ganache drizzle (organic bezier drops with teardrop bulbs) ──────────
    function buildDrizzle(t, frac, phase) {
      if (frac < 0.90 || phase <= 0) return '';
      const hw   = t.w / 2;
      const topY = t.by - t.h * frac;
      const op   = phase.toFixed(2);
      const drops = [
        { dx: -hw*0.76, len: 16, wob:  2 },
        { dx: -hw*0.42, len: 11, wob: -2 },
        { dx: -hw*0.10, len: 18, wob:  3 },
        { dx:  hw*0.22, len: 12, wob: -2 },
        { dx:  hw*0.56, len: 16, wob:  3 },
        { dx:  hw*0.82, len: 10, wob: -3 },
      ];
      return drops.map(({ dx, len, wob }) => {
        const x   = t.cx + dx;
        const y0  = topY + eH - 1;
        const cp1x = (x + wob*0.3).toFixed(1), cp1y = (y0 + len*0.3).toFixed(1);
        const cp2x = (x + wob*0.7).toFixed(1), cp2y = (y0 + len*0.7).toFixed(1);
        const ex   = (x + wob).toFixed(1),      ey   = (y0 + len).toFixed(1);
        return `<path d="M${x.toFixed(1)},${y0.toFixed(1)} C${cp1x},${cp1y} ${cp2x},${cp2y} ${ex},${ey}"
          stroke="${drizzC}" stroke-width="3.8" fill="none" stroke-linecap="round" opacity="${(parseFloat(op)*0.88).toFixed(2)}"/>
          <circle cx="${ex}" cy="${(parseFloat(ey)+2.2).toFixed(1)}" r="2.4" fill="${drizzC}" opacity="${(parseFloat(op)*0.75).toFixed(2)}"/>`;
      }).join('');
    }

    // ── Assemble tiers and drizzle ───────────────────────────────────────────
    const tier1SVG = buildTier(t1, f1, bodyC[0], topC[0]);
    const tier2SVG = buildTier(t2, f2, bodyC[1], topC[1]);
    const tier3SVG = buildTier(t3, f3, bodyC[2], topC[2]);
    const drizzle1 = buildDrizzle(t1, f1, drizzPh);
    const drizzle2 = buildDrizzle(t2, f2, drizzPh);
    const drizzle3 = buildDrizzle(t3, f3, drizzPh);

    // ── Cream frosting on very top (p ≥ 85) ─────────────────────────────────
    const frostSVG = showFrost ? `
      <ellipse cx="${t3.cx}" cy="${(t3.by-t3.h).toFixed(1)}" rx="${(t3.w/2-2).toFixed(1)}" ry="${eH-1}" fill="#f8f2ec" opacity="0.93"/>
      <ellipse cx="${t3.cx}" cy="${(t3.by-t3.h).toFixed(1)}" rx="${(t3.w/2-6).toFixed(1)}" ry="${(eH-2.5).toFixed(1)}" fill="rgba(255,255,255,0.30)"/>` : '';

    // ── Chocolate curls on top (p ≥ 85) ─────────────────────────────────────
    const curlSVG = showFrost ? (() => {
      const ty = t3.by - t3.h - eH + 1;
      function curl(ox, oy, dir) {
        return `<path d="M${(cx+ox).toFixed(1)},${(ty+oy).toFixed(1)} C${(cx+ox+dir*5).toFixed(1)},${(ty+oy-7).toFixed(1)} ${(cx+ox+dir*11).toFixed(1)},${(ty+oy-5).toFixed(1)} ${(cx+ox+dir*8).toFixed(1)},${(ty+oy+2).toFixed(1)}"
          stroke="#3d1808" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.86"/>`;
      }
      return curl(-11, 0, 1) + curl(0, -4, -1) + curl(11, 1, 1) + curl(-5, -8, 1) + curl(6, -7, -1);
    })() : '';

    // ── Rainbow sprinkles on frosting (p ≥ 94) ──────────────────────────────
    const spCols = ['#ff3b3b','#ff9900','#ffe033','#33cc44','#3399ff','#cc44ff','#ff66aa'];
    const sprSVG = showSprink ? (() => {
      const ty  = t3.by - t3.h - eH + 3;
      const hw2 = t3.w / 2 - 6;
      return [
        [-hw2*0.8,  0,  30, spCols[0]], [-hw2*0.4, -2, -20, spCols[1]],
        [0,          1,  55, spCols[2]], [ hw2*0.4, -1, -40, spCols[3]],
        [ hw2*0.8,   0,  25, spCols[4]], [-hw2*0.6,  3,  70, spCols[5]],
        [ hw2*0.2,  -3, -60, spCols[6]],
      ].map(([dx, dy, a, c]) => {
        const x = cx + dx, y = ty + dy;
        return `<rect x="${(x-4.5).toFixed(1)}" y="${(y-1.2).toFixed(1)}" width="9" height="2.4" rx="1.2" fill="${c}" transform="rotate(${a},${x.toFixed(1)},${y.toFixed(1)})" opacity="0.90"/>`;
      }).join('');
    })() : '';

    // ── Birthday candle (p ≥ 98) ─────────────────────────────────────────────
    const candleSVG = showCandle ? (() => {
      const cy3 = t3.by - t3.h - eH - 2;
      return `
        <rect x="${(cx-3).toFixed(1)}" y="${(cy3-20).toFixed(1)}" width="6" height="17" rx="3" fill="#f8b4d9"/>
        <path d="M${(cx-3).toFixed(1)},${(cy3-13).toFixed(1)} Q${(cx-4).toFixed(1)},${(cy3-9).toFixed(1)} ${(cx-2).toFixed(1)},${(cy3-6).toFixed(1)}" stroke="#f8d7ea" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.65"/>
        <ellipse cx="${cx}" cy="${(cy3-26).toFixed(1)}" rx="4.5" ry="7" fill="#ffb700" opacity="0.92"/>
        <ellipse cx="${cx}" cy="${(cy3-25).toFixed(1)}" rx="2.8" ry="4.5" fill="#fff0a0" opacity="0.88"/>
        <ellipse cx="${cx}" cy="${(cy3-25.5).toFixed(1)}" rx="1.4" ry="2.5" fill="#ffffff" opacity="0.72"/>`;
    })() : '';

    // ── Plate ───────────────────────────────────────────────────────────────
    const plateSVG = f1 > 0 ? `
      <ellipse cx="${cx}" cy="${(t1.by+7).toFixed(1)}" rx="${(t1.w/2+9).toFixed(1)}" ry="8" fill="#e8ddd0" opacity="${Math.min(0.90, f1*4).toFixed(2)}"/>
      <ellipse cx="${cx}" cy="${(t1.by+7).toFixed(1)}" rx="${(t1.w/2+9).toFixed(1)}" ry="8" fill="none" stroke="#c4a882" stroke-width="1.1" opacity="${Math.min(0.60, f1*2.5).toFixed(2)}"/>` : '';

    // ── Recipe tier badge ────────────────────────────────────────────────────
    const tierBadge = tierCfg && tierCfg.tier !== 'house' ? `
      <text x="145" y="16" text-anchor="end" font-family="Source Sans Pro,sans-serif"
        font-size="7.5" font-weight="700"
        fill="${tierCfg.tier === 'mastercraft' ? '#fbbf24' : 'rgba(212,165,116,0.9)'}">
        ${tierCfg.tier === 'mastercraft' ? '👑 MASTER' : '✦ SIG'}
      </text>` : '';

    // ── Progress % text (inside bottom tier body) ────────────────────────────
    const pctText = p > 15 ? `
      <text x="${cx}" y="${(t1.by - 9).toFixed(1)}"
        text-anchor="middle" font-family="Playfair Display,serif"
        font-size="13" font-weight="600" fill="rgba(255,255,255,0.88)">
        ${Math.round(p)}%
      </text>` : '';

    return `<svg viewBox="0 0 150 175" xmlns="http://www.w3.org/2000/svg"
      overflow="visible" style="width:100%;max-width:200px;margin:0 auto;display:block;">
      ${tierBadge}
      <!-- Drop shadow -->
      <ellipse cx="${cx}" cy="${(t1.by+10).toFixed(1)}" rx="56" ry="8" fill="rgba(0,0,0,0.15)"/>
      ${plateSVG}
      <!-- Tier 1 — bottom (widest) -->
      ${tier1SVG}
      ${drizzle1}
      <!-- Tier 2 — middle -->
      ${tier2SVG}
      ${drizzle2}
      <!-- Tier 3 — top (narrowest) -->
      ${tier3SVG}
      ${drizzle3}
      <!-- Cream frosting & chocolate curls -->
      ${frostSVG}
      ${curlSVG}
      <!-- Rainbow sprinkles -->
      ${sprSVG}
      <!-- Birthday candle with flame -->
      ${candleSVG}
      ${pctText}
      ${p >= 100 ? generateSparkles() : ''}
    </svg>`;
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
    const liquidFill = (stepFill && stepFill !== 'transparent') ? stepFill : 'url(#lf_liquidGrad)';
    const foamFill100 = step100?.foamFill;
    const foamColor  = (foamFill100 && foamFill100 !== 'transparent')
      ? foamFill100 : (d.hasFoam ? d.foamColor : null);
    const garnishSvg = (pct >= 100 && step100?.garnishSvg) ? step100.garnishSvg : '';
    // Cumulative: collect svgContent from ALL steps ≤ pct so earlier artwork persists
    const svgContentCumul  = tierCfg ? getCumulativeSvgContent(tierCfg, pct) : '';
    // stepCfg still used to check if the CURRENT step's content should be outside-cup
    const svgContentIsOut  = stepCfg?.svgContentOutside || false;
    const svgContentIn     = svgContentCumul && !svgContentIsOut ? svgContentCumul : '';
    const svgContentOut    = svgContentCumul &&  svgContentIsOut ? svgContentCumul : '';
    const bgGlow     = tierCfg?.bgGlow || 'transparent';
    scene.style.filter = (bgGlow && bgGlow !== 'transparent') ? `drop-shadow(0 0 20px ${bgGlow})` : '';

    // Cup geometry
    const CX = 20, CW = 100, CTY = 30, CBY = 155;
    const fillH = Math.max(0, (pct / 100) * (CBY - CTY - 20));
    const fillY = CBY - fillH;

    const type = d.type || 'coffee';
    const ac   = DRINK_ANIM[type] || DRINK_ANIM.coffee;

    // Birthday Cake: 3-tier chocolate ganache cake — bypass the cup SVG entirely.
    // The elliptical tier tops must NOT be masked by the cup clip-path, so we
    // short-circuit here and delegate to the dedicated cake renderer.
    if (type === 'birthday_cake') {
      injectDrinkStyles(1, 8);  // inject keyframes so switching drinks later still works
      scene.innerHTML = buildBirthdayCakeLiveSVG(pct, d, tierCfg);
      return;
    }

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
      ? buildLiquid(d, type, fillY, fillH, CX, CW, CBY, liquidFill, foamColor, pct, ac.waveAmp, ac.waveSpeed, CTY)
      : '';
    const steamSVG = ac.steam && pct > 0 && pct < 100 ? buildSteam(type, CTY) : '';

    // Inject keyframes into <head> once — they survive SVG innerHTML replacement
    injectDrinkStyles(ac.waveAmp, ac.waveSpeed);

    // ---- Special flourishes (crema ring, petal flecks, aurora ribbon) ----
    // These live outside buildLiquid so they render above foam/garnish layers
    const cremaSVG = (d.cremaRing && pct >= 90) ? `
      <ellipse cx="${CX+CW/2}" cy="${fillY+2}" rx="${CW*0.36}" ry="5"
        fill="none" stroke="rgba(200,145,60,0.75)" stroke-width="2.5"/>
      <ellipse cx="${CX+CW/2}" cy="${fillY+2}" rx="${CW*0.22}" ry="3"
        fill="rgba(185,130,50,0.35)"/>` : '';
    const petalFlecksSVG = (d.petalFlecks && pct >= 90) ? `
      <ellipse cx="${CX+22}" cy="${fillY-1}" rx="3.5" ry="1.5" fill="rgba(255,160,200,0.65)" transform="rotate(-20,${CX+22},${fillY-1})"/>
      <ellipse cx="${CX+46}" cy="${fillY+1}" rx="3"   ry="1.2" fill="rgba(255,180,210,0.60)" transform="rotate(15,${CX+46},${fillY+1})"/>
      <ellipse cx="${CX+66}" cy="${fillY-2}" rx="2.8" ry="1.1" fill="rgba(255,150,195,0.55)" transform="rotate(-10,${CX+66},${fillY-2})"/>` : '';
    const auroraRibbonSVG = d.auroraRibbon ? buildAuroraRibbon(CX, CW, CTY, pct, _drizzleRng) : '';

    // ---- Unified themed drizzle (boba, lavender, caramel mac, dalgona, mocha, hot choc) ----
    const liveTierRank = tierRank(tierCfg?.tier);
    const syrupMarblingSVG = buildSyrupMarbling(d, CX, CW, fillY, CBY, pct, _drizzleRng, liveTierRank, 'lf_cupClip', 'lf_marbleBlur');

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
        <filter id="lf_marbleBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4"/>
        </filter>
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

      <!-- Syrup marbling — swirled INTO the liquid (boba, lavender, caramel mac, dalgona, mocha, hot choc) -->
      ${syrupMarblingSVG}

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

      <!-- Special flourishes: crema ring (espresso), petals (cherry blossom), aurora ribbon -->
      ${cremaSVG}
      ${petalFlecksSVG}
      ${auroraRibbonSVG}

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

  // ================================================================
  // SHOP CUP PREVIEW — pure stateless SVG generator
  // Accepts drinkId (shop ID like 'espresso'), fill pct 0-100,
  // unique uid for SVG ID namespacing. Stateless — no module state
  // mutation. No keyframe-dependent animations (no injectDrinkStyles).
  // ================================================================
  function generateShopCupSVG(drinkId, pct, uid) {
    // ---- Resolve drink data via SHOP_ID_TO_VISUAL map ----
    // Shop IDs (e.g. 'espresso') → visual key (e.g. '_espresso') → DRINKS entry
    const visualKey = SHOP_ID_TO_VISUAL[drinkId] || drinkId;
    const d = DRINKS[visualKey] || DRINKS[drinkId] || DRINKS['☕ Coffee'];
    const type = d.type || 'coffee';

    // ── Birthday Cake — 3-tier chocolate cake (image 2 inspired) ─────────────
    if (d.birthdayCake) {
      const W = 120, H = 140;
      const p = Math.max(0, Math.min(100, pct));

      // ── Tier geometry (bottom → top, widest → narrowest) ──────────────────
      // Each tier: { cx, cy, w, h, rx } — rx = horizontal corner radius for ellipse tops
      // Plate sits at bottom. Tiers stack upward.
      const plateY = 128;                        // plate ellipse centre Y
      const t1 = { cx:60, by:124, h:28, w:74 }; // bottom tier
      const t2 = { cx:60, by:t1.by-t1.h, h:26, w:56 }; // middle tier
      const t3 = { cx:60, by:t2.by-t2.h, h:24, w:40 }; // top tier

      // Ellipse half-height for the 3D top face
      const eH = 6; // depth of elliptical top face

      // ── Progressive reveal ────────────────────────────────────────────────
      // p 0–20:  tier 1 builds up (grows in height from 0)
      // p 20–45: tier 2 builds up
      // p 45–65: tier 3 builds up
      // p 65–80: chocolate ganache drizzle appears on all tiers
      // p 80–90: cream frosting tops
      // p 90–96: rainbow sprinkles on top
      // p 96–100: candle lights

      function tierFrac(pStart, pEnd) {
        if (p < pStart) return 0;
        return Math.min(1, (p - pStart) / (pEnd - pStart));
      }

      const f1 = tierFrac(0, 20);
      const f2 = tierFrac(20, 45);
      const f3 = tierFrac(45, 65);

      // ── Tier SVG builder ──────────────────────────────────────────────────
      // Each tier is: elliptical top face + rectangular body + elliptical bottom
      // Chocolate sponge colours — each tier slightly different shade
      function buildTier(t, frac, bodyFill, topFill, rimFill) {
        if (frac <= 0) return '';
        const h  = t.h * frac;               // current rendered height
        const hw = t.w / 2;                   // half-width
        const top_y  = t.by - h;             // top face centre Y
        const bot_y  = t.by;                  // bottom face centre Y

        // Body rectangle with slight trapezoid (perspective)
        const bodyPath = `M ${t.cx-hw},${top_y} L ${t.cx+hw},${top_y} L ${t.cx+hw},${bot_y} L ${t.cx-hw},${bot_y} Z`;

        // Exposed sponge texture on the side — thin lighter bands suggesting layers
        const mid1Y = top_y + h * 0.35;
        const mid2Y = top_y + h * 0.68;
        const textureBands = frac > 0.5 ? `
          <line x1="${t.cx-hw+1}" y1="${mid1Y.toFixed(1)}" x2="${t.cx+hw-1}" y2="${mid1Y.toFixed(1)}" stroke="rgba(255,220,180,0.18)" stroke-width="1.2"/>
          <line x1="${t.cx-hw+1}" y1="${mid2Y.toFixed(1)}" x2="${t.cx+hw-1}" y2="${mid2Y.toFixed(1)}" stroke="rgba(255,220,180,0.12)" stroke-width="0.9"/>` : '';

        // Top ellipse (chocolate ganache surface — slightly lighter)
        const topEllipse = `<ellipse cx="${t.cx}" cy="${top_y}" rx="${hw}" ry="${eH}" fill="${topFill}"/>`;
        // Rim highlight on top ellipse edge
        const rimEllipse = `<ellipse cx="${t.cx}" cy="${top_y}" rx="${hw}" ry="${eH}" fill="none" stroke="${rimFill}" stroke-width="1.2" opacity="0.6"/>`;

        // Shadow under each tier (bottom ellipse)
        const shadowEllipse = `<ellipse cx="${t.cx}" cy="${bot_y}" rx="${hw+3}" ry="${eH*0.6}" fill="rgba(0,0,0,0.22)" opacity="${frac.toFixed(2)}"/>`;

        return `
          ${shadowEllipse}
          <rect x="${t.cx-hw}" y="${top_y.toFixed(1)}" width="${t.w}" height="${h.toFixed(1)}" fill="${bodyFill}"/>
          ${textureBands}
          ${topEllipse}
          ${rimEllipse}`;
      }

      const tier1SVG = buildTier(t1, f1, '#2c1005', '#3d1808', '#8b4020');
      const tier2SVG = buildTier(t2, f2, '#321208', '#421a0a', '#8b4020');
      const tier3SVG = buildTier(t3, f3, '#2a0e04', '#3a1608', '#8b4020');

      // ── Ganache drizzle on each tier (p >= 65) ────────────────────────────
      // Drizzle hangs OFF the bottom edge of each tier — thick drops of chocolate
      function buildTierDrizzle(t, frac, show) {
        if (!show || frac < 0.9) return '';  // only drizzle when tier mostly built
        const hw = t.w / 2;
        const top_y = t.by - t.h * frac;
        // Drizzle streams hang DOWN from top_y
        // Using buildOrgDrizzle pattern inline (can't call it here — different coord space)
        // Each stream: starts at top surface, drips down 8–18px
        const dc = '#1a0600';
        const drops = [
          { x: t.cx - hw*0.75, len: 14, wob:  2 },
          { x: t.cx - hw*0.40, len: 10, wob: -1 },
          { x: t.cx - hw*0.10, len: 16, wob:  3 },
          { x: t.cx + hw*0.20, len: 11, wob: -2 },
          { x: t.cx + hw*0.55, len: 15, wob:  2 },
          { x: t.cx + hw*0.80, len:  9, wob: -3 },
        ];
        return drops.map(({ x, len, wob }) => {
          const y0 = top_y + eH - 1;  // start just below the top ellipse edge
          const cp1x = (x + wob * 0.3).toFixed(1), cp1y = (y0 + len * 0.3).toFixed(1);
          const cp2x = (x + wob * 0.7).toFixed(1), cp2y = (y0 + len * 0.7).toFixed(1);
          const ex   = (x + wob).toFixed(1),         ey   = (y0 + len).toFixed(1);
          // Teardrop bulb at the bottom
          return `<path d="M${x.toFixed(1)},${y0.toFixed(1)} C${cp1x},${cp1y} ${cp2x},${cp2y} ${ex},${ey}"
            stroke="${dc}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.88"/>
            <circle cx="${ex}" cy="${(parseFloat(ey)+2).toFixed(1)}" r="2.2" fill="${dc}" opacity="0.75"/>`;
        }).join('');
      }

      const showDrizzle = p >= 65;
      const drizzle1 = buildTierDrizzle(t1, f1, showDrizzle);
      const drizzle2 = buildTierDrizzle(t2, f2, showDrizzle);
      const drizzle3 = buildTierDrizzle(t3, f3, showDrizzle);

      // ── Cream frosting layer on top (p >= 80) ────────────────────────────
      // White/cream ellipse on the very top face of tier 3
      const frostSVG = (p >= 80 && f3 > 0.8) ? `
        <ellipse cx="${t3.cx}" cy="${(t3.by - t3.h).toFixed(1)}" rx="${t3.w/2 - 2}" ry="${eH - 1}" fill="#f8f2ec" opacity="0.90"/>
        <ellipse cx="${t3.cx}" cy="${(t3.by - t3.h).toFixed(1)}" rx="${t3.w/2 - 5}" ry="${(eH - 2.5).toFixed(1)}" fill="rgba(255,255,255,0.35)"/>` : '';

      // ── Chocolate curl decorations on top (p >= 80) ───────────────────────
      const curlSVG = (p >= 80 && f3 > 0.8) ? (() => {
        const ty = t3.by - t3.h - eH + 1;
        const cx3 = t3.cx;
        // 3 chocolate curls — spiral paths
        function curl(ox, oy, dir) {
          return `<path d="M${(cx3+ox).toFixed(1)},${(ty+oy).toFixed(1)} C${(cx3+ox+dir*4).toFixed(1)},${(ty+oy-5).toFixed(1)} ${(cx3+ox+dir*8).toFixed(1)},${(ty+oy-3).toFixed(1)} ${(cx3+ox+dir*6).toFixed(1)},${(ty+oy+2).toFixed(1)}"
            stroke="#3d1808" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.85"/>`;
        }
        return curl(-8, 0, 1) + curl(0, -3, -1) + curl(8, 1, 1);
      })() : '';

      // ── Rainbow sprinkles on frosting (p >= 90) ───────────────────────────
      const sc = ['#ff3b3b','#ff9900','#ffe033','#33cc44','#3399ff','#cc44ff','#ff66aa'];
      const sprSVG = (p >= 90 && f3 > 0.9) ? (() => {
        const ty = t3.by - t3.h - eH + 3;
        const hw = t3.w / 2 - 6;
        return [
          [-hw*0.8, 0,  30, sc[0]], [-hw*0.4, -2, -20, sc[1]], [0, 1, 55, sc[2]],
          [ hw*0.4, -1, -40, sc[3]], [ hw*0.8, 0,  25, sc[4]],
          [-hw*0.6, 3,  70, sc[5]], [ hw*0.2, -3, -60, sc[6]],
        ].map(([dx, dy, a, c]) => {
          const x = t3.cx + dx, y = ty + dy;
          return `<rect x="${(x-4).toFixed(1)}" y="${(y-1.2).toFixed(1)}" width="8" height="2.4" rx="1.2" fill="${c}" transform="rotate(${a},${x.toFixed(1)},${y.toFixed(1)})" opacity="0.90"/>`;
        }).join('');
      })() : '';

      // ── Candle (p >= 96) ─────────────────────────────────────────────────
      const candleSVG = (p >= 96) ? (() => {
        const cx3 = t3.cx, cy3 = t3.by - t3.h - eH - 2;
        return `
          <rect x="${(cx3-2.5).toFixed(1)}" y="${(cy3-16).toFixed(1)}" width="5" height="14" rx="2.5" fill="#f8b4d9"/>
          <path d="M${(cx3-2.5).toFixed(1)},${(cy3-10).toFixed(1)} Q${(cx3-3.5).toFixed(1)},${(cy3-7).toFixed(1)} ${(cx3-1.5).toFixed(1)},${(cy3-4).toFixed(1)}" stroke="#f8d7ea" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.65"/>
          <ellipse cx="${cx3}" cy="${(cy3-21).toFixed(1)}" rx="3.5" ry="5.5" fill="#ffb700" opacity="0.92"/>
          <ellipse cx="${cx3}" cy="${(cy3-20).toFixed(1)}" rx="2"   ry="3.5" fill="#fff0a0" opacity="0.88"/>
          <ellipse cx="${cx3}" cy="${(cy3-20.5).toFixed(1)}" rx="1" ry="2"   fill="#ffffff" opacity="0.72"/>`;
      })() : '';

      // ── Plate ─────────────────────────────────────────────────────────────
      const plateSVG = `
        <ellipse cx="60" cy="${plateY}" rx="44" ry="7" fill="#e8ddd0" opacity="0.9"/>
        <ellipse cx="60" cy="${plateY}" rx="44" ry="7" fill="none" stroke="#c4a882" stroke-width="1" opacity="0.6"/>`;

      return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <!-- Plate -->
        ${plateSVG}
        <!-- Tier 1 — bottom (widest) -->
        ${tier1SVG}
        <!-- Tier 1 drizzle -->
        ${drizzle1}
        <!-- Tier 2 — middle -->
        ${tier2SVG}
        <!-- Tier 2 drizzle -->
        ${drizzle2}
        <!-- Tier 3 — top (narrowest) -->
        ${tier3SVG}
        <!-- Tier 3 drizzle -->
        ${drizzle3}
        <!-- Cream frosting on top -->
        ${frostSVG}
        <!-- Chocolate curls -->
        ${curlSVG}
        <!-- Sprinkles -->
        ${sprSVG}
        <!-- Candle -->
        ${candleSVG}
      </svg>`;
    }


    // Cup geometry — sized to fit inside shop card
    const W = 100, H = 130;
    const CX = 8, CW = 84;
    const CTY = 18, CBY = 118;
    const cupH = CBY - CTY;

    // Clamp pct
    const p = Math.max(0, Math.min(100, pct));

    // Liquid fill height and Y position
    const fillH = (p / 100) * cupH;
    const fillY = CBY - fillH;

    // Taper: liquid surface X narrows toward bottom
    const taper = (fillY - CTY) / cupH;
    const liqLX = CX + 8 * taper;
    const liqRX = CX + CW - 8 * taper;

    // Unique SVG ID namespace — prevents cross-card gradient bleed
    const ns = `sc_${uid}_`;
    // Per-card seeded RNG (stable across the hover-fill animation, unique per shop slot)
    const cardRng = seededRng(hashStr(String(uid) + '_' + drinkId));

    // Wave path for liquid surface
    function wavePath(y, amplitude, freq) {
      let path = `M ${liqLX},${y}`;
      for (let i = 0; i <= 10; i++) {
        const x  = liqLX + (liqRX - liqLX) * (i / 10);
        const wy = y + Math.sin(i * freq) * amplitude;
        path += ` L ${x.toFixed(1)},${wy.toFixed(1)}`;
      }
      return path + ` L ${liqRX},${CBY} L ${liqLX},${CBY} Z`;
    }

    // ---- Liquid layers ----
    let liquidSVG = '';
    if (p > 0) {
      if (type === 'ca_phe_sua_da') {
        // Two-layer: dark coffee over condensed milk
        const splitY = fillY + fillH * 0.42;
        liquidSVG = `
          <defs>
            <clipPath id="${ns}clip"><rect x="${CX+8}" y="${CTY}" width="${CW-16}" height="${cupH}"/></clipPath>
            <linearGradient id="${ns}milklg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fce8b3"/>
              <stop offset="100%" stop-color="#f8d898"/>
            </linearGradient>
          </defs>
          <rect x="${CX+8}" y="${fillY}" width="${CW-16}" height="${fillH*0.45}" fill="${d.liquidColor}" clip-path="url(#${ns}clip)"/>
          <rect x="${CX+8}" y="${splitY}" width="${CW-16}" height="${fillH*0.58}" fill="url(#${ns}milklg)" clip-path="url(#${ns}clip)"/>`;
      } else if (type === 'dalgona') {
        // Milk bottom, dark coffee foam top
        liquidSVG = `
          <defs>
            <clipPath id="${ns}clip"><rect x="${CX+8}" y="${CTY}" width="${CW-16}" height="${cupH}"/></clipPath>
          </defs>
          <rect x="${CX+8}" y="${fillY}" width="${CW-16}" height="${fillH}" fill="${d.liquidColor}" clip-path="url(#${ns}clip)"/>
          <rect x="${CX+8}" y="${fillY}" width="${CW-16}" height="${fillH*0.28}" fill="${d.liquidColor2}" clip-path="url(#${ns}clip)" opacity="0.85"/>`;
      } else if (type === 'egg_coffee') {
        // Dark espresso base, yellow egg cream on top
        liquidSVG = `
          <defs>
            <clipPath id="${ns}clip"><rect x="${CX+8}" y="${CTY}" width="${CW-16}" height="${cupH}"/></clipPath>
          </defs>
          <rect x="${CX+8}" y="${fillY}" width="${CW-16}" height="${fillH}" fill="${d.liquidColor}" clip-path="url(#${ns}clip)"/>
          <rect x="${CX+8}" y="${fillY}" width="${CW-16}" height="${fillH*0.38}" fill="${d.liquidColor2}" clip-path="url(#${ns}clip)" opacity="0.90"/>`;
      } else {
        // Standard gradient fill with wave surface
        liquidSVG = `
          <defs>
            <clipPath id="${ns}clip"><rect x="${CX+8}" y="${CTY}" width="${CW-16}" height="${cupH}"/></clipPath>
            <linearGradient id="${ns}lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${d.liquidColor2 || d.liquidColor}"/>
              <stop offset="100%" stop-color="${d.liquidColor}"/>
            </linearGradient>
          </defs>
          <path d="${wavePath(fillY, p < 100 ? 2.5 : 0.8, 1.1)}"
            fill="url(#${ns}lg)" clip-path="url(#${ns}clip)"/>`;
      }
    }

    // ---- Ice cubes (no animation — shop is static) ----
    const iceSVG = (d.hasIce && p >= 20) ? `
      <rect x="${CX+10}" y="${fillY+6}"  width="16" height="10" rx="2.5" fill="rgba(210,240,255,0.68)" stroke="rgba(180,220,255,0.5)" stroke-width="0.8"/>
      <rect x="${CX+38}" y="${fillY+9}"  width="14" height="9"  rx="2.5" fill="rgba(210,240,255,0.60)" stroke="rgba(180,220,255,0.4)" stroke-width="0.8"/>
      <rect x="${CX+60}" y="${fillY+5}"  width="15" height="11" rx="2.5" fill="rgba(210,240,255,0.65)" stroke="rgba(180,220,255,0.45)" stroke-width="0.8"/>` : '';

    // ---- Bobas (static — no keyframe animation in shop) ----
    const bobasSVG = (d.bobas && p > 0) ? `
      <circle cx="${CX+18}" cy="${CBY-8}"  r="4.5" fill="${d.bobaColor||'#2a1a0a'}" opacity="0.88"/>
      <circle cx="${CX+36}" cy="${CBY-6}"  r="4.5" fill="${d.bobaColor||'#2a1a0a'}" opacity="0.88"/>
      <circle cx="${CX+54}" cy="${CBY-9}"  r="4.5" fill="${d.bobaColor||'#2a1a0a'}" opacity="0.88"/>
      <circle cx="${CX+70}" cy="${CBY-7}"  r="4.5" fill="${d.bobaColor||'#2a1a0a'}" opacity="0.85"/>` : '';

    // ---- Foam ----
    // Trigger on hasFoam OR special flags (whipCream, thickFoam, spotFoam)
    let foamSVG = '';
    const showFoam = (d.hasFoam || d.whipCream || d.thickFoam || d.spotFoam) && d.foamColor && p >= 85;
    if (showFoam) {
      const cx = CX + CW / 2;
      const fc = d.foamColor;
      if (d.thickFoam) {
        // Cappuccino — tall dome
        foamSVG = `
          <ellipse cx="${cx}"    cy="${fillY}"   rx="${CW*0.44}" ry="11"  fill="${fc}" opacity="0.95"/>
          <ellipse cx="${cx-12}" cy="${fillY-2}" rx="10"         ry="7"   fill="${fc}" opacity="0.75"/>
          <ellipse cx="${cx+14}" cy="${fillY-1}" rx="9"          ry="6.5" fill="${fc}" opacity="0.78"/>
          <ellipse cx="${cx}"    cy="${fillY-3}" rx="${CW*0.28}" ry="5"   fill="rgba(255,255,255,0.25)"/>`;
      } else if (d.spotFoam) {
        // Macchiato — small spot only
        foamSVG = `
          <ellipse cx="${cx}" cy="${fillY+1}" rx="${CW*0.22}" ry="5.5" fill="${fc}" opacity="0.82"/>
          <ellipse cx="${cx}" cy="${fillY}"   rx="${CW*0.12}" ry="3"   fill="rgba(255,255,255,0.18)"/>`;
      } else if (d.whipCream) {
        // Vienna — whipped cream mound
        foamSVG = `
          <ellipse cx="${cx}" cy="${fillY-2}"  rx="${CW*0.40}" ry="10" fill="${fc}" opacity="0.95"/>
          <ellipse cx="${cx}" cy="${fillY-6}"  rx="${CW*0.28}" ry="7"  fill="${fc}" opacity="0.90"/>
          <ellipse cx="${cx}" cy="${fillY-10}" rx="${CW*0.16}" ry="5"  fill="rgba(255,255,255,0.30)"/>`;
      } else {
        // Standard foam (latte, flat white, americano etc.)
        foamSVG = `
          <ellipse cx="${cx}"    cy="${fillY+2}" rx="${CW*0.42}" ry="7"   fill="${fc}" opacity="0.88"/>
          <ellipse cx="${cx-12}" cy="${fillY}"   rx="9"          ry="5.5" fill="${fc}" opacity="0.68"/>
          <ellipse cx="${cx+14}" cy="${fillY+1}" rx="8"          ry="5"   fill="${fc}" opacity="0.70"/>
          <ellipse cx="${cx}"    cy="${fillY+2}" rx="${CW*0.26}" ry="3.5" fill="rgba(255,255,255,0.12)"/>`;
      }
    }

    // ---- Syrup marbling (unified system — swirled into liquid, uid-seeded, always shown for preview) ----
    const shopClipId  = `sc_clip_${uid}`;
    const shopBlurId  = `sc_blur_${uid}`;
    const shopClipDef = `<clipPath id="${shopClipId}"><path d="M ${CX},${CTY} L ${CX+CW},${CTY} L ${CX+CW-8},${CBY} L ${CX+8},${CBY} Z"/></clipPath>
      <filter id="${shopBlurId}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>`;
    const marbleSVG = buildSyrupMarbling(d, CX, CW, fillY, CBY, p, cardRng, Infinity, shopClipId, shopBlurId);

    // ---- Petal flecks (cherry blossom) ----
    const petalSVG = (d.petalFlecks && p >= 90) ? `
      <ellipse cx="${CX+22}" cy="${fillY-1}" rx="3.5" ry="1.5" fill="rgba(255,160,200,0.65)" transform="rotate(-20,${CX+22},${fillY-1})"/>
      <ellipse cx="${CX+46}" cy="${fillY+1}" rx="3"   ry="1.2" fill="rgba(255,180,210,0.60)" transform="rotate(15,${CX+46},${fillY+1})"/>
      <ellipse cx="${CX+66}" cy="${fillY-2}" rx="2.8" ry="1.1" fill="rgba(255,150,195,0.55)" transform="rotate(-10,${CX+66},${fillY-2})"/>` : '';

    // ---- Crema ring (espresso) ----
    const cremaSVG = (d.cremaRing && p >= 90) ? `
      <ellipse cx="${CX+CW/2}" cy="${fillY+2}" rx="${CW*0.36}" ry="5"
        fill="none" stroke="rgba(200,145,60,0.75)" stroke-width="2.5"/>
      <ellipse cx="${CX+CW/2}" cy="${fillY+2}" rx="${CW*0.22}" ry="3"
        fill="rgba(185,130,50,0.35)"/>` : '';

    // ---- Cup structure (walls, rim, decoration) ----
    // These functions are safe — they reference no global IDs or keyframes
    const wallsSVG = buildCupWalls(d, type, CX, CW, CTY, CBY);
    const rimSVG   = buildRim3D(d, CX, CW, CTY);
    const decorSVG = buildCupDecoration(type, d, CX, CW, CTY, CBY);

    // NOTE: Steam and pour stream intentionally omitted —
    // both depend on @keyframes injected by injectDrinkStyles which
    // we must not call here (would corrupt the active session cup).

    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>${shopClipDef}</defs>
      ${liquidSVG}
      ${marbleSVG}
      ${iceSVG}
      ${bobasSVG}
      ${wallsSVG}
      ${foamSVG}
      ${petalSVG}
      ${cremaSVG}
      ${rimSVG}
      ${decorSVG}
    </svg>`;
  }

  return { init, onSessionStart, onProgressUpdate, renderBillBoard,
           getCurrentDrinkInfo, generateShopCupSVG };

})();
