// =============================================
// SHOP MODULE — Beans Economy & Daily Shop
// =============================================
const ShopModule = (function () {

  const STORAGE_KEY = 'letsfocus_shop';
  const BEANS_KEY   = 'letsfocus_beans';

  // ---- Full catalogue ----
  const DRINKS = [
    { id: 'espresso',       name: 'Espresso',              rarity: 'common',    cost: 25,  emoji: '☕', desc: 'A sharp, focused shot.' },
    { id: 'americano',      name: 'Americano',             rarity: 'common',    cost: 28,  emoji: '🫖', desc: 'Long and smooth.' },
    { id: 'flat_white',     name: 'Flat White',            rarity: 'common',    cost: 27,  emoji: '🥛', desc: 'Velvet meets espresso.' },
    { id: 'hot_choc',       name: 'Hot Chocolate',         rarity: 'common',    cost: 30,  emoji: '🍫', desc: 'Cozy comfort in a cup.' },
    { id: 'matcha_latte',   name: 'Matcha Latte',          rarity: 'uncommon',  cost: 50,  emoji: '🍵', desc: 'Earthy green serenity.' },
    { id: 'egg_coffee',     name: 'Egg Coffee',            rarity: 'uncommon',  cost: 55,  emoji: '🥚', desc: 'A Hanoi classic.' },
    { id: 'boba',           name: 'Brown Sugar Boba',      rarity: 'uncommon',  cost: 58,  emoji: '🧋', desc: 'Chewy pearls of joy.' },
    { id: 'caramel_mac',    name: 'Caramel Macchiato',     rarity: 'uncommon',  cost: 60,  emoji: '🍮', desc: 'Sweet caramel swirls.' },
    { id: 'ca_phe_sua_da',  name: 'Cà Phê Sữa Đá',        rarity: 'rare',      cost: 80,  emoji: '🧊', desc: 'Vietnamese iced legend.' },
    { id: 'lavender_latte', name: 'Lavender Honey Latte',  rarity: 'rare',      cost: 82,  emoji: '💜', desc: 'Floral and dreamy.' },
    { id: 'dalgona',        name: 'Dalgona Coffee',        rarity: 'rare',      cost: 84,  emoji: '☁️', desc: 'Whipped to perfection.' },
    { id: 'iced_matcha',    name: 'Iced Matcha',           rarity: 'rare',      cost: 85,  emoji: '🌿', desc: 'Cool and vibrant.' },
    { id: 'rose_gold',      name: 'Rose Gold Latte',       rarity: 'epic',      cost: 120, emoji: '🌹', desc: 'Blush tones and magic.' },
    { id: 'galaxy_brew',    name: 'Galaxy Cold Brew',      rarity: 'epic',      cost: 125, emoji: '🌌', desc: 'Steeped in stardust.' },
    { id: 'midnight_esp',   name: 'Midnight Espresso',     rarity: 'epic',      cost: 128, emoji: '🌑', desc: 'Dark, intense, eternal.' },
    { id: 'cherry_blossom', name: 'Cherry Blossom Latte',  rarity: 'epic',      cost: 130, emoji: '🌸', desc: 'Fleeting beauty in a cup.' },
    { id: 'barista_secret', name: "Barista's Secret Brew", rarity: 'legendary', cost: 200, emoji: '🔮', desc: 'No one knows the recipe.' },
    { id: 'golden_hour',    name: 'Golden Hour Latte',     rarity: 'legendary', cost: 210, emoji: '✨', desc: 'Bottled sunset.' },
    { id: 'aurora_brew',    name: 'Aurora Brew',           rarity: 'legendary', cost: 220, emoji: '🌈', desc: 'Northern lights, liquid.' },
    { id: 'the_void',       name: 'The Void',              rarity: 'legendary', cost: 230, emoji: '🕳️', desc: 'Stare into it. It pours back.' },
    // New drinks (from enhanced recipe engine)
    { id: 'latte',          name: 'Latte',                 rarity: 'uncommon',  cost: 55,  emoji: '🥛', desc: 'Silky milk, velvety espresso.' },
    { id: 'cappuccino',     name: 'Cappuccino',            rarity: 'uncommon',  cost: 58,  emoji: '☁️', desc: 'Equal thirds of perfection.' },
    { id: 'macchiato',      name: 'Macchiato',             rarity: 'uncommon',  cost: 52,  emoji: '🫙', desc: 'Espresso stained with foam.' },
    { id: 'mocha',          name: 'Mocha',                 rarity: 'rare',      cost: 78,  emoji: '🍫', desc: 'Coffee meets chocolate.' },
    { id: 'irish_coffee',   name: 'Irish Coffee',          rarity: 'rare',      cost: 80,  emoji: '🍀', desc: 'Warmth with a little kick.' },
    { id: 'vienna_coffee',  name: 'Vienna Coffee',         rarity: 'rare',      cost: 82,  emoji: '🎩', desc: 'Crowned with whipped cream.' },
    { id: 'affogato',       name: 'Affogato',              rarity: 'epic',      cost: 115, emoji: '🍨', desc: 'Espresso drowns the gelato.' },
  ];

  const EQUIPMENT = [
    { id: 'ice_bucket',       name: 'Ice Bucket',         cost: 80,  emoji: '🪣', desc: 'Essential for iced drinks.' },
    { id: 'frother',          name: 'Milk Frother',       cost: 100, emoji: '🫧', desc: 'Velvety foam on command.' },
    { id: 'syrup_shelf',      name: 'Syrup Shelf',        cost: 120, emoji: '🍶', desc: 'Endless flavour options.' },
    { id: 'boba_cooker',      name: 'Boba Cooker',        cost: 130, emoji: '🫕', desc: 'Perfect pearls every time.' },
    { id: 'steam_wand',       name: 'Steam Wand',         cost: 150, emoji: '💨', desc: 'Pro-grade microfoam.' },
    { id: 'crushed_ice',      name: 'Crushed Ice Maker',  cost: 160, emoji: '❄️', desc: 'Snow-fine ice, instantly.' },
    { id: 'espresso_machine', name: 'Espresso Machine',   cost: 180, emoji: '⚙️', desc: 'The heart of the café.' },
    { id: 'petal_press',      name: 'Petal Press',        cost: 200, emoji: '🌺', desc: 'Extract floral essences.' },
    { id: 'pour_over',        name: 'Pour Over Set',      cost: 200, emoji: '☕', desc: 'Ritual precision brewing.' },
    { id: 'oat_dispenser',    name: 'Oat Milk Dispenser', cost: 170, emoji: '🌾', desc: 'Barista oat, on tap.' },
    { id: 'cold_brew_tower',  name: 'Cold Brew Tower',    cost: 220, emoji: '🗼', desc: '24-hour drip perfection.' },
    { id: 'gold_flake',       name: 'Gold Flake Jar',     cost: 250, emoji: '✨', desc: 'A touch of opulence.' },
    { id: 'siphon',           name: 'Siphon Brewer',      cost: 280, emoji: '🧪', desc: 'Science meets ceremony.' },
  ];

  // Rarity weights by rank level (1-10)
  const RARITY_TABLE = [
    { common:65, uncommon:25, rare:9,  epic:1,  legendary:0  }, // lv1
    { common:65, uncommon:25, rare:9,  epic:1,  legendary:0  }, // lv2
    { common:50, uncommon:30, rare:15, epic:4,  legendary:1  }, // lv3
    { common:50, uncommon:30, rare:15, epic:4,  legendary:1  }, // lv4
    { common:35, uncommon:30, rare:22, epic:10, legendary:3  }, // lv5
    { common:35, uncommon:30, rare:22, epic:10, legendary:3  }, // lv6
    { common:20, uncommon:28, rare:30, epic:17, legendary:5  }, // lv7
    { common:20, uncommon:28, rare:30, epic:17, legendary:5  }, // lv8
    { common:10, uncommon:20, rare:30, epic:28, legendary:12 }, // lv9
    { common:10, uncommon:20, rare:30, epic:28, legendary:12 }, // lv10
  ];

  const COMBO_PAIRS = [
    { items:['espresso_machine','gold_flake'],  name:'The Gilded Shot',    bonus:15 },
    { items:['cold_brew_tower','ice_bucket'],   name:'Arctic Drip Kit',    bonus:20 },
    { items:['boba_cooker','syrup_shelf'],      name:'Bubble Factory',     bonus:18 },
    { items:['siphon','pour_over'],             name:'The Alchemist Set',  bonus:25 },
    { items:['steam_wand','frother'],           name:'Foam Artisan Kit',   bonus:15 },
    { items:['petal_press','oat_dispenser'],    name:'The Garden Brew',    bonus:20 },
  ];

  const RARITY_META = {
    common:    { label:'Common',    chalk:'#d4c5a9', glow:'rgba(212,193,169,0.3)' },
    uncommon:  { label:'Uncommon',  chalk:'#7ec8c8', glow:'rgba(126,200,200,0.3)' },
    rare:      { label:'Rare',      chalk:'#c39bd3', glow:'rgba(195,155,211,0.35)' },
    epic:      { label:'Epic',      chalk:'#f0a500', glow:'rgba(240,165,0,0.3)'   },
    legendary: { label:'Legendary', chalk:'#ffd700', glow:'rgba(255,215,0,0.45)'  },
    equipment: { label:'Equipment', chalk:'#a8c5a0', glow:'rgba(168,197,160,0.3)' },
  };

  // ---- Storage ----
  function loadShop() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); } catch(e){ return {}; } }
  function saveShop(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
  function getBeans() { try { return parseInt(localStorage.getItem(BEANS_KEY)||'0',10)||0; } catch(e){ return 0; } }
  function saveBeans(n) { localStorage.setItem(BEANS_KEY, String(Math.max(0,n))); }

  function getOwned() {
    const d = loadShop();
    return { drinks: d.owned_drinks||[], equipment: d.owned_equipment||[], activeDrink: d.active_drink||null };
  }
  function isOwned(id) { const o=getOwned(); return o.drinks.includes(id)||o.equipment.includes(id); }

  // ---- Beans earning ----
  function awardBeans(amount, reason) {
    saveBeans(getBeans() + amount);
    updateBeanDisplay();
    showBeansToast('+' + amount + ' ☕ ' + reason);
  }

  function showBeansToast(msg) {
    const t = document.createElement('div');
    t.className = 'beans-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
  }

  function updateBeanDisplay() {
    const n = getBeans();
    document.querySelectorAll('.beans-count').forEach(el => el.textContent = n.toLocaleString());
  }

  // ---- Daily shop slots ----
  function todayUTC() { return new Date().toISOString().slice(0,10); }

  function getShopSlots() {
    const d = loadShop();
    if (d.slots_date === todayUTC() && d.slots && d.slots.length === 4) return d.slots;
    const slots = generateSlots();
    d.slots_date = todayUTC();
    d.slots = slots;
    saveShop(d);
    return slots;
  }

  function getUserLevel() {
    const xp = JSON.parse(localStorage.getItem('letsfocus_xp')||'{}').totalXP || 0;
    const RANK_XP = [0,100,250,500,900,1400,2000,3000,4500,7000];
    let level = 1;
    for (let i=0;i<RANK_XP.length;i++) { if (xp >= RANK_XP[i]) level = i+1; }
    return Math.max(1, Math.min(10, level));
  }

  function rollRarity(level) {
    const w = RARITY_TABLE[level-1];
    const roll = Math.random()*100; let cum=0;
    for (const [r,wt] of [['common',w.common],['uncommon',w.uncommon],['rare',w.rare],['epic',w.epic],['legendary',w.legendary]]) {
      cum += wt; if (roll < cum) return r;
    }
    return 'common';
  }

  function generateSlots() {
    const level    = getUserLevel();
    const owned    = getOwned();
    const allOwned = [...owned.drinks, ...owned.equipment];
    const slots = [];
    const used  = new Set();

    // 15% combo chance — 2 equipment items linked
    if (Math.random() < 0.15) {
      const eligible = COMBO_PAIRS.filter(cp =>
        cp.items.every(id => EQUIPMENT.find(e => e.id === id) && !allOwned.includes(id))
      );
      if (eligible.length) {
        const combo = eligible[Math.floor(Math.random() * eligible.length)];
        combo.items.forEach(id => {
          const item = EQUIPMENT.find(e => e.id === id);
          if (item && slots.length < 2) {
            slots.push({ ...item, type:'equipment', comboId:combo.name, comboBonus:combo.bonus,
                         owned: allOwned.includes(id), discount: calcTimeDiscount(id) });
            used.add(id);
          }
        });
      }
    }

    // Fill remaining slots — alternate drinks and equipment roughly 70/30
    while (slots.length < 4) {
      const rarity   = rollRarity(level);
      const useDrink = Math.random() < 0.7;

      // Primary candidates: drinks or equipment matching rarity
      let candidates = useDrink
        ? DRINKS.filter(d => !used.has(d.id) && d.rarity === rarity)
        : EQUIPMENT.filter(e => !used.has(e.id));

      // Fallback 1: same type, any rarity
      if (!candidates.length) {
        candidates = useDrink
          ? DRINKS.filter(d => !used.has(d.id))
          : EQUIPMENT.filter(e => !used.has(e.id));
      }
      // Fallback 2: anything unused
      if (!candidates.length) {
        candidates = [...DRINKS, ...EQUIPMENT].filter(x => !used.has(x.id));
      }
      if (!candidates.length) break;

      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const type = DRINKS.find(d => d.id === pick.id) ? 'drink' : 'equipment';
      slots.push({ ...pick, type, owned: allOwned.includes(pick.id), discount: calcTimeDiscount(pick.id) });
      used.add(pick.id);
    }
    return slots;
  }

  function calcTimeDiscount(id) {
    const h = new Date().getHours();
    if (['espresso','americano','ca_phe_sua_da'].includes(id) && h>=6 && h<10) return 30;
    if (['lavender_latte','hot_choc','dalgona'].includes(id) && h>=20 && h<23) return 20;
    return 0;
  }

  function msUntilMidnightUTC() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()+1)) - now;
  }

  // ---- Buy ----
  function buyItem(slotIndex) {
    const slots = getShopSlots();
    const slot  = slots[slotIndex];
    if (!slot) return;
    if (slot.owned || isOwned(slot.id)) { showCustomAlert('You already own this!'); return; }
    const cost = slot.discount ? Math.floor(slot.cost*(1-slot.discount/100)) : slot.cost;
    const beans = getBeans();
    if (beans < cost) {
      showCustomAlert(`Not enough ☕ beans!\nYou need ${cost} but have ${beans}.\n\nEarn beans by focusing and completing goals.`);
      return;
    }
    saveBeans(beans - cost);
    const d = loadShop();
    if (slot.type === 'drink') d.owned_drinks = [...(d.owned_drinks||[]), slot.id];
    else                       d.owned_equipment = [...(d.owned_equipment||[]), slot.id];
    slots[slotIndex].owned = true;
    d.slots = slots;
    saveShop(d);
    updateBeanDisplay();
    renderShopTab();
    renderSideShop();
    showBeansToast('🛍️ Purchased: ' + slot.name + '!');
  }

  function setActiveDrink(drinkId) {
    const d = loadShop(); d.active_drink = drinkId; saveShop(d);
  }

  // ---- Side shop (in aside) ----
  function renderSideShop() {
    const container = document.getElementById('sideShopContent');
    if (!container) return;
    const slots = getShopSlots().slice(0,3); // show first 3 in sidebar
    const owned = getOwned();
    updateBeanDisplay();

    container.innerHTML = '';
    slots.forEach((slot, i) => {
      const isOwnedNow = slot.owned || isOwned(slot.id);
      const cost = slot.discount ? Math.floor(slot.cost*(1-slot.discount/100)) : slot.cost;
      const meta = RARITY_META[slot.rarity || 'equipment'];
      const row = document.createElement('div');
      row.className = 'side-shop-row' + (isOwnedNow ? ' owned' : '');
      row.innerHTML = `
        <span class="side-shop-emoji">${slot.emoji}</span>
        <div class="side-shop-info">
          <div class="side-shop-name">${slot.name}</div>
          <div class="side-shop-rarity" style="color:${meta.chalk}">${meta.label}</div>
        </div>
        <div class="side-shop-price-col">
          ${slot.discount ? `<span class="side-shop-old">${slot.cost}</span>` : ''}
          <span class="side-shop-cost">${isOwnedNow ? '✓' : cost + ' ☕'}</span>
        </div>
      `;
      if (!isOwnedNow) row.addEventListener('click', () => buyItem(i));
      container.appendChild(row);
    });

    // Countdown
    const cdEl = document.createElement('div');
    cdEl.className = 'side-shop-countdown';
    cdEl.id = 'sideShopCountdown';
    container.appendChild(cdEl);
    updateSideCountdown();
  }

  let _sideCountdownTimer = null;
  function updateSideCountdown() {
    const el = document.getElementById('sideShopCountdown');
    if (!el) { clearInterval(_sideCountdownTimer); _sideCountdownTimer = null; return; }
    const ms = msUntilMidnightUTC();
    const h = Math.floor(ms/3600000), m = Math.floor((ms%3600000)/60000), s = Math.floor((ms%60000)/1000);
    el.textContent = `Restock ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (!_sideCountdownTimer) _sideCountdownTimer = setInterval(updateSideCountdown, 1000);
  }

  // ---- Full Shop Tab — chalkboard menu style ----
  let _fullCountdownTimer = null;
  function renderShopTab() {
    const container = document.getElementById('shopTabContent');
    if (!container) return;
    const beans = getBeans();
    const slots = getShopSlots();
    updateBeanDisplay();

    container.innerHTML = `
      <div class="chalkboard-shop">
        <div class="chalk-header">
          <div class="chalk-title-row">
            <h2 class="chalk-title">☕ Today's Specials</h2>
            <div class="chalk-beans-display">
              <span class="chalk-beans-icon">☕</span>
              <span class="chalk-beans-val beans-count">${beans.toLocaleString()}</span>
              <span class="chalk-beans-label">beans</span>
            </div>
          </div>
          <div class="chalk-subtitle">Hand-picked for you · Restock in <span id="shopCountdownInline">—</span></div>
          <div class="chalk-earn-hint">Earn: +1/min focus · +10 goal · +20 Pomodoro · +25 achievement</div>
        </div>

        <div class="chalk-menu-board">
          <div class="chalk-divider-top"></div>
          <div class="chalk-slots" id="chalkSlots"></div>
          <div class="chalk-divider-bottom"></div>
        </div>

        <div class="chalk-footer-note">✦ Rarity and prices change daily at midnight UTC ✦</div>
      </div>
    `;

    const slotsEl = container.querySelector('#chalkSlots');
    slots.forEach((slot, i) => {
      const isOwnedNow = slot.owned || isOwned(slot.id);
      const cost = slot.discount ? Math.floor(slot.cost*(1-slot.discount/100)) : slot.cost;
      const rarKey = slot.rarity || 'equipment';
      const meta = RARITY_META[rarKey];
      const card = document.createElement('div');
      card.className = `chalk-card chalk-rarity-${rarKey}${isOwnedNow ? ' chalk-owned' : ''}${slot.comboId ? ' chalk-combo' : ''}`;
      card.innerHTML = `
        ${slot.comboId ? `<div class="chalk-combo-tag">🔗 Combo Set</div>` : ''}
        <div class="chalk-card-emoji">${slot.emoji}</div>
        <div class="chalk-card-name">${slot.name}</div>
        <div class="chalk-card-rarity" style="color:${meta.chalk}; text-shadow: 0 0 8px ${meta.glow}">
          ${meta.label}
        </div>
        <div class="chalk-card-desc">${slot.desc}</div>
        ${slot.discount ? `
          <div class="chalk-discount">-${slot.discount}% ${slot.discount>=30 ? '☕ Morning deal' : '🌙 Evening deal'}</div>
          <div class="chalk-price-row">
            <span class="chalk-price-old">${slot.cost} ☕</span>
            <span class="chalk-price-final">${cost} ☕</span>
          </div>
        ` : `<div class="chalk-price-row"><span class="chalk-price-final">${cost} ☕</span></div>`}
        ${isOwnedNow
          ? `<div class="chalk-owned-stamp">✓ In Your Collection</div>`
          : `<button class="chalk-buy-btn" data-index="${i}">Order</button>`
        }
        ${slot.comboId ? `<div class="chalk-combo-note">Part of <em>${slot.comboId}</em></div>` : ''}
      `;
      if (!isOwnedNow) {
        card.querySelector('.chalk-buy-btn').addEventListener('click', () => buyItem(i));
      }
      slotsEl.appendChild(card);
    });

    // countdown
    clearInterval(_fullCountdownTimer);
    const updateFull = () => {
      const el = document.getElementById('shopCountdownInline');
      if (!el) { clearInterval(_fullCountdownTimer); return; }
      const ms = msUntilMidnightUTC();
      const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
      el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    };
    updateFull();
    _fullCountdownTimer = setInterval(updateFull, 1000);
  }

  function init() {
    updateBeanDisplay();
  }

  return { init, awardBeans, getBeans, getOwned, isOwned, setActiveDrink,
           renderShopTab, renderSideShop, updateBeanDisplay, DRINKS, EQUIPMENT };
})();
