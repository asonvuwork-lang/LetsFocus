// =============================================
// CATEGORIES MODULE
// =============================================
const CategoriesModule = (function () {

  const STORAGE_KEY = 'letsfocus_categories_v2';

  // Legacy base-drink list kept for getDrink() fallback compatibility
  const DRINKS = ['☕ Coffee', '🍵 Matcha', '🧋 Milk Tea', '🍊 Orange Juice', '🫖 Chamomile Tea', '🥤 Smoothie', '🍋 Lemonade', '🎲 Random'];

  // Full catalogue: base drinks + all shop collection drinks
  // drinkId matches DRINK_KEY_TO_RECIPE keys in script-drink.js
  const ALL_DRINKS = [
    // ── Base drinks (no shop unlock required) ──
    { id: '☕ Coffee',        label: '☕ Coffee',              rarity: 'base',      emoji: '☕' },
    { id: '🍵 Matcha',        label: '🍵 Matcha',              rarity: 'base',      emoji: '🍵' },
    { id: '🧋 Milk Tea',      label: '🧋 Milk Tea',            rarity: 'base',      emoji: '🧋' },
    { id: '🍊 Orange Juice',  label: '🍊 Orange Juice',        rarity: 'base',      emoji: '🍊' },
    { id: '🫖 Chamomile Tea', label: '🫖 Chamomile Tea',       rarity: 'base',      emoji: '🫖' },
    { id: '🥤 Smoothie',      label: '🥤 Smoothie',            rarity: 'base',      emoji: '🥤' },
    { id: '🍋 Lemonade',      label: '🍋 Lemonade',            rarity: 'base',      emoji: '🍋' },
    { id: '🎲 Random',        label: '🎲 Random',              rarity: 'base',      emoji: '🎲' },
    // ── Common collection ──
    { id: 'espresso',         label: 'Espresso',               rarity: 'common',    emoji: '☕' },
    { id: 'americano',        label: 'Americano',              rarity: 'common',    emoji: '🫖' },
    { id: 'flat_white',       label: 'Flat White',             rarity: 'common',    emoji: '🥛' },
    { id: 'hot_choc',         label: 'Hot Chocolate',          rarity: 'common',    emoji: '🍫' },
    // ── Uncommon collection ──
    { id: 'matcha_latte',     label: 'Matcha Latte',           rarity: 'uncommon',  emoji: '🍵' },
    { id: 'egg_coffee',       label: 'Egg Coffee',             rarity: 'uncommon',  emoji: '🥚' },
    { id: 'boba',             label: 'Brown Sugar Boba',       rarity: 'uncommon',  emoji: '🧋' },
    { id: 'caramel_mac',      label: 'Caramel Macchiato',      rarity: 'uncommon',  emoji: '🍮' },
    { id: 'latte',            label: 'Latte',                  rarity: 'uncommon',  emoji: '🥛' },
    { id: 'cappuccino',       label: 'Cappuccino',             rarity: 'uncommon',  emoji: '☁️' },
    { id: 'macchiato',        label: 'Macchiato',              rarity: 'uncommon',  emoji: '🫙' },
    // ── Rare collection ──
    { id: 'ca_phe_sua_da',    label: 'Cà Phê Sữa Đá',         rarity: 'rare',      emoji: '🧊' },
    { id: 'lavender_latte',   label: 'Lavender Honey Latte',   rarity: 'rare',      emoji: '💜' },
    { id: 'dalgona',          label: 'Dalgona Coffee',         rarity: 'rare',      emoji: '☁️' },
    { id: 'iced_matcha',      label: 'Iced Matcha',            rarity: 'rare',      emoji: '🌿' },
    { id: 'mocha',            label: 'Mocha',                  rarity: 'rare',      emoji: '🍫' },
    { id: 'irish_coffee',     label: 'Irish Coffee',           rarity: 'rare',      emoji: '🍀' },
    { id: 'vienna_coffee',    label: 'Vienna Coffee',          rarity: 'rare',      emoji: '🎩' },
    // ── Epic collection ──
    { id: 'rose_gold',        label: 'Rose Gold Latte',        rarity: 'epic',      emoji: '🌹' },
    { id: 'galaxy_brew',      label: 'Galaxy Cold Brew',       rarity: 'epic',      emoji: '🌌' },
    { id: 'midnight_esp',     label: 'Midnight Espresso',      rarity: 'epic',      emoji: '🌑' },
    { id: 'cherry_blossom',   label: 'Cherry Blossom Latte',   rarity: 'epic',      emoji: '🌸' },
    { id: 'affogato',         label: 'Affogato',               rarity: 'epic',      emoji: '🍨' },
    // ── Legendary collection ──
    { id: 'barista_secret',   label: "Barista's Secret Brew",  rarity: 'legendary', emoji: '🔮' },
    { id: 'golden_hour',      label: 'Golden Hour Latte',      rarity: 'legendary', emoji: '✨' },
    { id: 'aurora_brew',      label: 'Aurora Brew',            rarity: 'legendary', emoji: '🌈' },
    { id: 'the_void',         label: 'The Void',               rarity: 'legendary', emoji: '🕳️' },
  ];

  const RARITY_STYLE = {
    base:      { chalk: '#c4b49a', label: 'Base'      },
    common:    { chalk: '#d4c5a9', label: 'Common'    },
    uncommon:  { chalk: '#7ec8c8', label: 'Uncommon'  },
    rare:      { chalk: '#c39bd3', label: 'Rare'      },
    epic:      { chalk: '#f0a500', label: 'Epic'      },
    legendary: { chalk: '#ffd700', label: 'Legendary' },
  };

  // Stage options shown in the editor
  const STAGES = [
    { id: 'auto',        label: '🔄 Auto',        desc: 'Best stage based on owned equipment' },
    { id: 'house',       label: '🏠 House',        desc: 'No equipment needed — always available' },
    { id: 'signature',   label: '✦ Signature',    desc: 'Requires some equipment' },
    { id: 'mastercraft', label: '👑 Mastercraft',  desc: 'Requires full equipment set' },
  ];

  const DEFAULTS = [
    { id: 'study',    name: 'Study',    color: '#5a8a6a', drink: '🍵 Matcha' },
    { id: 'work',     name: 'Work',     color: '#6b4423', drink: '☕ Coffee' },
    { id: 'fitness',  name: 'Fitness',  color: '#c17f3a', drink: '🍊 Orange Juice' },
    { id: 'creative', name: 'Creative', color: '#7a5c8a', drink: '🧋 Milk Tea' },
    { id: 'personal', name: 'Personal', color: '#4a7a8a', drink: '🫖 Chamomile Tea' },
    { id: 'other',    name: 'Other',    color: '#8a6a5a', drink: '🎲 Random' },
  ];

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && saved.length ? saved : JSON.parse(JSON.stringify(DEFAULTS));
    } catch(e) { return JSON.parse(JSON.stringify(DEFAULTS)); }
  }

  function save(cats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  }

  function getAll() { return load(); }

  function getByName(name) {
    if (!name) return null;
    return load().find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
  }

  function getColor(name) {
    const cat = getByName(name);
    return cat ? cat.color : '#8a6a5a';
  }

  function getDrink(name) {
    const cat = getByName(name);
    if (!cat) return null;
    const drinkId = cat.drink;
    if (!drinkId || drinkId === '🎲 Random') {
      // Random from base drinks only (excluding Random itself)
      const pool = DRINKS.filter(d => d !== '🎲 Random');
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return drinkId;
  }

  // Returns the forced stage ('house'|'signature'|'mastercraft') or null for auto
  function getStage(name) {
    const cat = getByName(name);
    if (!cat || !cat.stage || cat.stage === 'auto') return null;
    return cat.stage;
  }

  // ---- Render the Categories Tab ----
  function renderTab() {
    const container = document.getElementById('categoriesTabContent');
    if (!container) return;
    const cats = load();

    container.innerHTML = `
      <div class="cat-tab-header">
        <h2>🏷️ Categories</h2>
        <p class="cat-tab-subtitle">Manage your goal categories, colors and drink pairings</p>
      </div>
      <div class="cat-list" id="catList"></div>
      <button class="cat-add-btn" id="catAddBtn">+ Add Category</button>
    `;

    const list = container.querySelector('#catList');
    cats.forEach(cat => list.appendChild(buildCatRow(cat, cats)));

    container.querySelector('#catAddBtn').addEventListener('click', () => {
      showCatEditor(null, cats);
    });
  }

  function buildCatRow(cat, cats) {
    const row = document.createElement('div');
    row.className = 'cat-row';
    const r = parseInt(cat.color.slice(1,3),16), g = parseInt(cat.color.slice(3,5),16), b = parseInt(cat.color.slice(5,7),16);
    const tint = `rgba(${r},${g},${b},0.08)`;
    const border = `rgba(${r},${g},${b},0.2)`;
    row.style.background = tint;
    row.style.borderColor = border;

    // Resolve drink display info
    const drinkEntry = ALL_DRINKS.find(d => d.id === cat.drink);
    const drinkLabel = drinkEntry ? `${drinkEntry.emoji} ${drinkEntry.label}` : (cat.drink || '🎲 Random');
    const drinkRarityStyle = drinkEntry ? RARITY_STYLE[drinkEntry.rarity] : RARITY_STYLE.base;

    // Stage badge
    const stageId = cat.stage || 'auto';
    const stageEntry = STAGES.find(s => s.id === stageId) || STAGES[0];

    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;width:100%;">
        <div class="cat-row-color-dot" style="background:${cat.color};" title="${cat.color}"></div>
        <div class="cat-row-info">
          <span class="cat-row-name">${cat.name}</span>
          <span class="cat-row-drink" style="color:${drinkRarityStyle.chalk}">${drinkLabel}</span>
          <span class="cat-row-stage">${stageEntry.label}</span>
        </div>
      </div>
      <div class="cat-row-actions">
        <button class="cat-row-btn edit-btn" title="Edit">✏️</button>
        <button class="cat-row-btn delete-btn" title="Delete">🗑</button>
      </div>
    `;

    row.querySelector('.edit-btn').addEventListener('click', () => showCatEditor(cat, cats));
    row.querySelector('.delete-btn').addEventListener('click', async () => {
      const ok = await showConfirm(`Delete category "${cat.name}"? Goals in this category will become uncategorized.`);
      if (!ok) return;
      const updated = cats.filter(c => c.id !== cat.id);
      save(updated);
      renderTab();
      if (typeof GoalsModule !== 'undefined') GoalsModule.onCategoryDeleted(cat.name);
    });

    return row;
  }

  function showCatEditor(existing, cats) {
    const modal = document.createElement('div');
    modal.className = 'cat-editor-modal-bg';
    const isNew = !existing;
    const current = existing || { id: Date.now().toString(), name: '', color: '#8b6f47', drink: '🎲 Random', stage: 'auto' };

    // Find the drink entry for display
    const currentDrinkEntry = ALL_DRINKS.find(d => d.id === current.drink) || ALL_DRINKS[7]; // default Random
    const currentStage = current.stage || 'auto';

    // Group drinks by rarity for section headers
    const rarityOrder = ['base', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
    const grouped = {};
    rarityOrder.forEach(r => { grouped[r] = ALL_DRINKS.filter(d => d.rarity === r); });

    modal.innerHTML = `
      <div class="cat-editor-modal cat-editor-modal-wide">
        <h3 class="cat-editor-title">${isNew ? '+ New Category' : '✏️ Edit Category'}</h3>

        <label class="cat-editor-label">Name</label>
        <input class="cat-editor-input" id="catNameInput" type="text" value="${current.name}" placeholder="e.g. Study, Work, Fitness…" maxlength="30">

        <label class="cat-editor-label">Color</label>
        <div class="cat-color-row">
          <input type="color" id="catColorPicker" value="${current.color}" class="cat-color-native">
          <div class="cat-color-presets">
            ${['#5a8a6a','#6b4423','#c17f3a','#7a5c8a','#4a7a8a','#8a6a5a','#c0392b','#2980b9','#27ae60','#8e44ad','#d35400','#16a085']
              .map(c => `<div class="cat-color-swatch ${c === current.color ? 'active' : ''}" data-color="${c}" style="background:${c}"></div>`).join('')}
          </div>
        </div>

        <label class="cat-editor-label">Session Drink</label>
        <div class="cat-drink-selected" id="catDrinkSelected">
          <span class="cat-drink-sel-emoji">${currentDrinkEntry.emoji}</span>
          <span class="cat-drink-sel-name">${currentDrinkEntry.label}</span>
          <span class="cat-drink-sel-rarity" style="color:${RARITY_STYLE[currentDrinkEntry.rarity].chalk}">${RARITY_STYLE[currentDrinkEntry.rarity].label}</span>
          <span class="cat-drink-sel-arrow">▼</span>
        </div>
        <div class="cat-drink-catalogue hidden" id="catDrinkCatalogue">
          ${rarityOrder.map(rarity => `
            <div class="cat-drink-section">
              <div class="cat-drink-section-header" style="color:${RARITY_STYLE[rarity].chalk}">${RARITY_STYLE[rarity].label}</div>
              <div class="cat-drink-section-grid">
                ${grouped[rarity].map(d => `
                  <button class="cat-drink-catalogue-btn ${d.id === current.drink ? 'active' : ''}"
                    data-id="${d.id}" data-emoji="${d.emoji}" data-label="${d.label}" data-rarity="${d.rarity}"
                    title="${d.label}">
                    <span class="cat-dc-emoji">${d.emoji}</span>
                    <span class="cat-dc-name">${d.label}</span>
                  </button>`).join('')}
              </div>
            </div>`).join('')}
        </div>

        <label class="cat-editor-label" style="margin-top:1rem;">Session Stage</label>
        <p class="cat-editor-hint">Override the drink stage shown during focus sessions.</p>
        <div class="cat-stage-grid" id="catStageGrid">
          ${STAGES.map(s => `
            <button class="cat-stage-btn ${s.id === currentStage ? 'active' : ''}" data-stage="${s.id}">
              <span class="cat-stage-label">${s.label}</span>
              <span class="cat-stage-desc">${s.desc}</span>
            </button>`).join('')}
        </div>

        <div class="cat-editor-actions">
          <button class="cat-editor-save">Save</button>
          <button class="cat-editor-cancel">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // ── Color picker ──
    const colorPicker = modal.querySelector('#catColorPicker');
    const swatches = modal.querySelectorAll('.cat-color-swatch');
    let chosenColor = current.color;

    colorPicker.addEventListener('input', (e) => {
      chosenColor = e.target.value;
      swatches.forEach(s => s.classList.toggle('active', s.dataset.color === chosenColor));
    });
    swatches.forEach(s => {
      s.addEventListener('click', () => {
        chosenColor = s.dataset.color;
        colorPicker.value = chosenColor;
        swatches.forEach(sw => sw.classList.toggle('active', sw.dataset.color === chosenColor));
      });
    });

    // ── Drink catalogue toggle ──
    let chosenDrink = current.drink || '🎲 Random';
    const drinkSelected = modal.querySelector('#catDrinkSelected');
    const drinkCatalogue = modal.querySelector('#catDrinkCatalogue');

    drinkSelected.addEventListener('click', () => {
      drinkCatalogue.classList.toggle('hidden');
      drinkSelected.querySelector('.cat-drink-sel-arrow').textContent =
        drinkCatalogue.classList.contains('hidden') ? '▼' : '▲';
    });

    modal.querySelectorAll('.cat-drink-catalogue-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        chosenDrink = btn.dataset.id;
        // Update selected display
        drinkSelected.querySelector('.cat-drink-sel-emoji').textContent = btn.dataset.emoji;
        drinkSelected.querySelector('.cat-drink-sel-name').textContent  = btn.dataset.label;
        const rs = RARITY_STYLE[btn.dataset.rarity];
        drinkSelected.querySelector('.cat-drink-sel-rarity').textContent  = rs.label;
        drinkSelected.querySelector('.cat-drink-sel-rarity').style.color = rs.chalk;
        // Mark active
        modal.querySelectorAll('.cat-drink-catalogue-btn').forEach(b => b.classList.toggle('active', b.dataset.id === chosenDrink));
        // Close catalogue
        drinkCatalogue.classList.add('hidden');
        drinkSelected.querySelector('.cat-drink-sel-arrow').textContent = '▼';
      });
    });

    // ── Stage picker ──
    let chosenStage = currentStage;
    modal.querySelectorAll('.cat-stage-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        chosenStage = btn.dataset.stage;
        modal.querySelectorAll('.cat-stage-btn').forEach(b => b.classList.toggle('active', b.dataset.stage === chosenStage));
      });
    });

    // ── Modal actions ──
    modal.querySelector('.cat-editor-cancel').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('.cat-editor-save').addEventListener('click', () => {
      const name = modal.querySelector('#catNameInput').value.trim();
      if (!name) { showCustomAlert('Please enter a category name.'); return; }
      const updated = isNew
        ? [...cats, { id: current.id, name, color: chosenColor, drink: chosenDrink, stage: chosenStage }]
        : cats.map(c => c.id === current.id ? { ...c, name, color: chosenColor, drink: chosenDrink, stage: chosenStage } : c);
      save(updated);
      modal.remove();
      renderTab();
      if (typeof GoalsModule !== 'undefined') GoalsModule.renderGoals();
    });
  }

  // ---- Inject color into category badges everywhere ----
  function injectCategoryStyles() {
    let styleEl = document.getElementById('cat-dynamic-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'cat-dynamic-styles';
      document.head.appendChild(styleEl);
    }
    const cats = load();
    const rules = cats.map(cat => {
      const name = CSS.escape(cat.name.toLowerCase());
      return `.goal-category[data-cat="${cat.name}"] { background: ${cat.color}22; color: ${cat.color}; border-color: ${cat.color}55; }
              .filter-tag[data-cat="${cat.name}"].active { background: ${cat.color}33; color: ${cat.color}; border-color: ${cat.color}; }
              .cat-bill[data-cat="${cat.name}"] { background: ${cat.color}18; border-color: ${cat.color}44; }`;
    }).join('\n');
    styleEl.textContent = rules;
  }

  function init() {
    injectCategoryStyles();
    // Re-inject when tab is opened
    document.querySelectorAll('.tab-btn[data-tab="categories"]').forEach(btn => {
      btn.addEventListener('click', () => { renderTab(); injectCategoryStyles(); });
    });
  }

  return { init, getAll, getByName, getColor, getDrink, getStage, renderTab, injectCategoryStyles, DRINKS, ALL_DRINKS };
})();
