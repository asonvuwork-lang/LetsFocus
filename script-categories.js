// =============================================
// CATEGORIES MODULE
// =============================================
const CategoriesModule = (function () {

  const STORAGE_KEY = 'letsfocus_categories_v2';
  const DRINKS = ['☕ Coffee', '🍵 Matcha', '🧋 Milk Tea', '🍊 Orange Juice', '🫖 Chamomile Tea', '🥤 Smoothie', '🍋 Lemonade', '🎲 Random'];

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
    if (cat.drink === '🎲 Random') {
      const pool = DRINKS.filter(d => d !== '🎲 Random');
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return cat.drink;
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
    // Light tinted background from category color
    const r = parseInt(cat.color.slice(1,3),16), g = parseInt(cat.color.slice(3,5),16), b = parseInt(cat.color.slice(5,7),16);
    const tint = `rgba(${r},${g},${b},0.08)`;
    const border = `rgba(${r},${g},${b},0.2)`;
    row.style.background = tint;
    row.style.borderColor = border;
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;width:100%;">
        <div class="cat-row-color-dot" style="background:${cat.color};" title="${cat.color}"></div>
        <div class="cat-row-info">
          <span class="cat-row-name">${cat.name}</span>
          <span class="cat-row-drink">${cat.drink}</span>
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
      // Update goals that used this category
      if (typeof GoalsModule !== 'undefined') GoalsModule.onCategoryDeleted(cat.name);
    });

    return row;
  }

  function showCatEditor(existing, cats) {
    const modal = document.createElement('div');
    modal.className = 'cat-editor-modal-bg';
    const isNew = !existing;
    const current = existing || { id: Date.now().toString(), name: '', color: '#8b6f47', drink: '🎲 Random' };

    modal.innerHTML = `
      <div class="cat-editor-modal">
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

        <label class="cat-editor-label">Drink Pairing</label>
        <div class="cat-drink-grid">
          ${DRINKS.map(d => `<button class="cat-drink-btn ${d === current.drink ? 'active' : ''}" data-drink="${d}">${d}</button>`).join('')}
        </div>

        <div class="cat-editor-actions">
          <button class="cat-editor-save">Save</button>
          <button class="cat-editor-cancel">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const colorPicker = modal.querySelector('#catColorPicker');
    const swatches = modal.querySelectorAll('.cat-color-swatch');
    const drinkBtns = modal.querySelectorAll('.cat-drink-btn');
    let chosenColor = current.color;
    let chosenDrink = current.drink;

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

    drinkBtns.forEach(b => {
      b.addEventListener('click', () => {
        chosenDrink = b.dataset.drink;
        drinkBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.drink === chosenDrink));
      });
    });

    modal.querySelector('.cat-editor-cancel').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('.cat-editor-save').addEventListener('click', () => {
      const name = modal.querySelector('#catNameInput').value.trim();
      if (!name) { showCustomAlert('Please enter a category name.'); return; }
      const updated = isNew
        ? [...cats, { id: current.id, name, color: chosenColor, drink: chosenDrink }]
        : cats.map(c => c.id === current.id ? { ...c, name, color: chosenColor, drink: chosenDrink } : c);
      save(updated);
      modal.remove();
      renderTab();
      // Refresh goals to show updated colors
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

  return { init, getAll, getByName, getColor, getDrink, renderTab, injectCategoryStyles, DRINKS };
})();
