// =============================================
// DRINK SHELF MODULE
// Tracks every completed session as a cup on a
// wooden shelf — silhouettes in Stats, mini SVG
// strip below the drink cup on the timer page.
// =============================================
const DrinkShelfModule = (function () {

  const STORAGE_KEY    = 'letsfocus_shelf';
  const SHELF_CAPACITY = 12;   // cups per shelf row
  const STRIP_COUNT    = 10;   // cups shown in timer strip

  // ---- Aura config per drink key ----
  // glow  : the halo colour
  // rarity: drives CSS animation tier
  const AURA = {
    // Base drinks
    'coffee':          { glow: '#c47820', rarity: 'base' },
    'matcha':          { glow: '#4aaa4e', rarity: 'base' },
    'milktea':         { glow: '#c4a882', rarity: 'base' },
    'oj':              { glow: '#e8820a', rarity: 'base' },
    'chamomile':       { glow: '#c8a840', rarity: 'base' },
    'smoothie':        { glow: '#b050a0', rarity: 'base' },
    'lemonade':        { glow: '#c8c820', rarity: 'base' },
    // Common shop drinks
    espresso:          { glow: '#b85020', rarity: 'common'    },
    americano:         { glow: '#7c4020', rarity: 'common'    },
    flat_white:        { glow: '#c8a070', rarity: 'common'    },
    hot_choc:          { glow: '#8c3010', rarity: 'common'    },
    // Uncommon
    matcha_latte:      { glow: '#22a040', rarity: 'uncommon'  },
    egg_coffee:        { glow: '#f0a820', rarity: 'uncommon'  },
    boba:              { glow: '#a05820', rarity: 'uncommon'  },
    caramel_mac:       { glow: '#d09020', rarity: 'uncommon'  },
    latte:             { glow: '#b89070', rarity: 'uncommon'  },
    cappuccino:        { glow: '#c07848', rarity: 'uncommon'  },
    macchiato:         { glow: '#883020', rarity: 'uncommon'  },
    // Rare
    ca_phe_sua_da:     { glow: '#d09030', rarity: 'rare'      },
    lavender_latte:    { glow: '#a060e0', rarity: 'rare'      },
    dalgona:           { glow: '#d08030', rarity: 'rare'      },
    iced_matcha:       { glow: '#30b050', rarity: 'rare'      },
    mocha:             { glow: '#901818', rarity: 'rare'      },
    irish_coffee:      { glow: '#b84020', rarity: 'rare'      },
    vienna_coffee:     { glow: '#c09060', rarity: 'rare'      },
    // Epic
    rose_gold:         { glow: '#f060a0', rarity: 'epic'      },
    galaxy_brew:       { glow: '#6028d0', rarity: 'epic'      },
    midnight_esp:      { glow: '#2030a0', rarity: 'epic'      },
    cherry_blossom:    { glow: '#f080c0', rarity: 'epic'      },
    affogato:          { glow: '#e0d0b0', rarity: 'epic'      },
    // Legendary
    barista_secret:    { glow: '#20d0c0', rarity: 'legendary' },
    golden_hour:       { glow: '#f0c020', rarity: 'legendary' },
    aurora_brew:       { glow: '#8080f0', rarity: 'legendary' },
    the_void:          { glow: '#4040a0', rarity: 'legendary' },
  };

  // Liquid display colour per drink key (for cup fill)
  const LIQUID_COLOR = {
    coffee: '#3d1f0a', matcha: '#4a7c4e', milktea: '#c4a882',
    oj: '#e8820a', chamomile: '#c8a840', smoothie: '#b050a0', lemonade: '#d4d820',
    espresso: '#1c0a04', americano: '#1e1008', flat_white: '#9a7868',
    hot_choc: '#2e1508', matcha_latte: '#3a7040', egg_coffee: '#4a3020',
    boba: '#3a1a08', caramel_mac: '#8a5030', latte: '#c0a080',
    cappuccino: '#905840', macchiato: '#2a1208', ca_phe_sua_da: '#200a04',
    lavender_latte: '#6840a0', dalgona: '#d09020', iced_matcha: '#4a7040',
    mocha: '#200808', irish_coffee: '#1a0c06', vienna_coffee: '#1c0e08',
    rose_gold: '#f090c0', galaxy_brew: '#280868', midnight_esp: '#060612',
    cherry_blossom: '#f8b0d0', affogato: '#1c0a04',
    barista_secret: '#0a7870', golden_hour: '#c08010', aurora_brew: '#380880',
    the_void: '#000000',
  };

  // ---- Persistence ----
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }
  function save(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }

  // ---- Public: record a completed session ----
  function addCup(sessionSeconds) {
    const info = (typeof DrinkModule !== 'undefined') ? DrinkModule.getCurrentDrinkInfo() : null;
    if (!info) return;
    const data = load();
    data.push({
      drinkKey:       info.drinkKey,
      drinkType:      info.drinkType,
      liquidColor:    info.liquidColor,
      tier:           info.tier || 'house',
      sessionSeconds: sessionSeconds || 0,
      timestamp:      Date.now(),
    });
    save(data);
    renderStatsShelf();
    renderTimerStrip();
    checkMilestone(data.length);
  }

  // ---- Helpers ----
  function getAura(cup) {
    return AURA[cup.drinkKey] || AURA[cup.drinkType] || { glow: '#d4a574', rarity: 'base' };
  }

  function getLiquidColor(cup) {
    return LIQUID_COLOR[cup.drinkKey] || cup.liquidColor || '#8b6f47';
  }

  function fmtTime(secs) {
    if (!secs) return '—';
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  function fmtDate(ts) {
    return ts ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  }

  function tierEmoji(tier) {
    if (tier === 'mastercraft') return '👑';
    if (tier === 'signature')   return '✦';
    return '';
  }

  // ---- Silhouette cup SVG (stats tab) ----
  function silhouetteSVG(cup) {
    const lc   = getLiquidColor(cup);
    const aura = getAura(cup);
    const te   = tierEmoji(cup.tier);
    const gid  = `cg${cup.timestamp}`;
    return `
      <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
        <defs>
          <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${lc}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${lc}" stop-opacity="0.72"/>
          </linearGradient>
        </defs>
        <path d="M3,6 L25,6 L22,30 L6,30 Z" fill="url(#${gid})"/>
        <rect x="2" y="4" width="24" height="4" rx="2" fill="${aura.glow}" opacity="0.75"/>
        ${te ? `<text x="14" y="21" text-anchor="middle" font-size="9" opacity="0.9">${te}</text>` : ''}
      </svg>`;
  }

  // ---- Mini SVG cup (timer strip) ----
  function miniSVG(cup) {
    const lc   = getLiquidColor(cup);
    const aura = getAura(cup);
    const te   = tierEmoji(cup.tier);
    const gid  = `mg${cup.timestamp}`;
    const hasFoam = ['coffee','matcha','milktea','smoothie','cappuccino','latte',
                     'flat_white','hot_choc','dalgona','irish_coffee','vienna_coffee'].includes(cup.drinkType);
    const glowStyle = {
      legendary: `filter:drop-shadow(0 0 5px ${aura.glow}) drop-shadow(0 0 10px ${aura.glow}55)`,
      epic:      `filter:drop-shadow(0 0 4px ${aura.glow})`,
      rare:      `filter:drop-shadow(0 0 3px ${aura.glow})`,
    }[aura.rarity] || '';

    return `
      <div class="shelf-mini-cup" title="${cup.drinkKey} · ${fmtTime(cup.sessionSeconds)} · ${fmtDate(cup.timestamp)}"
        style="${glowStyle}">
        <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="mc${cup.timestamp}">
              <path d="M3,6 L27,6 L24,32 L6,32 Z"/>
            </clipPath>
            <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${lc}"/>
              <stop offset="100%" stop-color="${lc}" stop-opacity="0.72"/>
            </linearGradient>
          </defs>
          <rect x="3" y="6" width="24" height="26" fill="url(#${gid})"
            clip-path="url(#mc${cup.timestamp})"/>
          ${hasFoam ? `<ellipse cx="15" cy="7" rx="11" ry="3.5" fill="rgba(255,255,255,0.28)"/>` : ''}
          <path d="M3,6 L27,6 L24,32 L6,32 Z" fill="none" stroke="${aura.glow}" stroke-width="1.5" opacity="0.8"/>
          <rect x="2" y="4" width="26" height="4" rx="2" fill="${aura.glow}" opacity="0.72"/>
          ${te ? `<text x="15" y="23" text-anchor="middle" font-size="9" opacity="0.88">${te}</text>` : ''}
        </svg>
      </div>`;
  }

  // ---- Render stats shelf ----
  function renderStatsShelf() {
    const container = document.getElementById('shelfContainer');
    if (!container) return;
    const data = load();

    if (!data.length) {
      container.innerHTML = `<p class="shelf-empty">No cups brewed yet — finish your first focus session to start your collection ☕</p>`;
      return;
    }

    const total = data.length;
    const MILESTONES = [10, 25, 50, 100, 200, 500];
    const next = MILESTONES.find(m => m > total);
    const rows = [];
    for (let i = 0; i < data.length; i += SHELF_CAPACITY) rows.push(data.slice(i, i + SHELF_CAPACITY));

    container.innerHTML = `
      <div class="shelf-header">
        <span class="shelf-total">☕ ${total} cup${total !== 1 ? 's' : ''} brewed</span>
        ${next ? `<span class="shelf-next">${next - total} to next milestone</span>` : `<span class="shelf-next">🏆 Max milestone reached!</span>`}
      </div>
      <div class="shelf-wall">
        ${rows.map(row => `
          <div class="shelf-row">
            <div class="shelf-cups-row">
              ${row.map(cup => {
                const aura = getAura(cup);
                return `
                  <div class="shelf-cup-wrap"
                    data-key="${cup.drinkKey}"
                    data-tip="${cup.drinkKey} · ${fmtTime(cup.sessionSeconds)} · ${fmtDate(cup.timestamp)}${cup.tier !== 'house' ? ' · ' + cup.tier : ''}">
                    ${silhouetteSVG(cup)}
                    <div class="shelf-cup-aura rarity-${aura.rarity}"
                      style="background:${aura.glow}"></div>
                    ${cup.tier === 'mastercraft' ? `<div class="shelf-cup-crown">👑</div>` : ''}
                  </div>`;
              }).join('')}
            </div>
            <div class="shelf-plank"></div>
          </div>`).join('')}
      </div>`;

    container.querySelectorAll('.shelf-cup-wrap').forEach(el => {
      el.addEventListener('mouseenter', e => showTip(e, el.dataset.tip));
      el.addEventListener('mouseleave', hideTip);
    });
  }

  // ---- Render timer strip ----
  function renderTimerStrip() {
    const container = document.getElementById('timerShelfStrip');
    if (!container) return;
    const data = load();
    if (!data.length) { container.innerHTML = ''; return; }

    const recent = data.slice(-STRIP_COUNT);
    const total  = data.length;

    container.innerHTML = `
      <div class="timer-shelf-inner">
        <div class="timer-shelf-label">☕ ${total} brewed</div>
        <div class="timer-shelf-cups">${recent.map(c => miniSVG(c)).join('')}</div>
        <div class="timer-shelf-plank"></div>
      </div>`;
  }

  // ---- Milestone celebrations ----
  const _shown = new Set();
  function checkMilestone(total) {
    const M = [10, 25, 50, 100, 200, 500];
    if (!M.includes(total) || _shown.has(total)) return;
    _shown.add(total);
    if (typeof showCustomAlert !== 'undefined')
      showCustomAlert(`☕ ${total} cups brewed — you're a dedicated barista!`);
    const wall = document.querySelector('.shelf-wall');
    if (wall) {
      wall.style.transition = 'box-shadow 0.4s ease';
      wall.style.boxShadow  = '0 0 32px rgba(212,165,116,0.55)';
      setTimeout(() => { wall.style.boxShadow = ''; }, 2200);
    }
  }

  // ---- Tooltip ----
  let _tip = null;
  function showTip(e, text) {
    hideTip();
    _tip = document.createElement('div');
    _tip.className = 'shelf-tooltip';
    _tip.textContent = text;
    document.body.appendChild(_tip);
    const r = e.currentTarget.getBoundingClientRect();
    _tip.style.left = `${r.left + r.width / 2 - _tip.offsetWidth / 2}px`;
    _tip.style.top  = `${r.top - _tip.offsetHeight - 8}px`;
  }
  function hideTip() { if (_tip) { _tip.remove(); _tip = null; } }

  // ---- Init ----
  function init() {
    renderStatsShelf();
    renderTimerStrip();
  }

  return { init, addCup, renderStatsShelf, renderTimerStrip };
})();
