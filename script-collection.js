// =============================================
// COLLECTION MODULE — My Collection Tab
// =============================================
const CollectionModule = (function () {

  const DRINK_TIERS = {
    espresso:       { tier1:'☕ House Espresso',       tier2:'🥛 Signature Shot',        tier3:'👑 Mastercraft Ristretto',
                      equipment:['espresso_machine','steam_wand'],
                      recipe:{ ingredients:['18g espresso grounds','30ml water','optional: sugar'], method:'Pull a 9-bar shot for 25–30s. Serve immediately.', time:'Anytime', temp:'90–96°C' } },
    americano:      { tier1:'☕ House Americano',      tier2:'🥛 Long Black',             tier3:'👑 Reserve Americano',
                      equipment:['espresso_machine','pour_over'],
                      recipe:{ ingredients:['2 shots espresso','180ml hot water'], method:'Pull shots, pour hot water first then shots on top.', time:'Morning', temp:'88°C' } },
    flat_white:     { tier1:'☕ House Flat White',     tier2:'🥛 Cortado',               tier3:'👑 Latte Art Flat White',
                      equipment:['espresso_machine','frother'],
                      recipe:{ ingredients:['2 ristretto shots','120ml whole milk'], method:'Steam milk to 60°C, pour over shots in a tight spiral.', time:'Morning', temp:'60°C' } },
    hot_choc:       { tier1:'☕ Hot Chocolate',        tier2:'🥛 Dark Mocha',            tier3:'👑 Barista Mocha',
                      equipment:['frother','steam_wand'],
                      recipe:{ ingredients:['2 tbsp cocoa powder','200ml milk','sugar to taste','cream'], method:'Heat milk, whisk in cocoa, top with steamed foam.', time:'Evening', temp:'65°C' } },
    matcha_latte:   { tier1:'🍵 House Matcha',         tier2:'🥛 Matcha Latte',          tier3:'👑 Ceremonial Matcha',
                      equipment:['frother','oat_dispenser'],
                      recipe:{ ingredients:['2 tsp ceremonial matcha','30ml hot water','150ml steamed oat milk'], method:'Whisk matcha into a smooth paste with water, then pour steamed milk over.', time:'Afternoon', temp:'75°C' } },
    egg_coffee:     { tier1:'🥚 House Egg Coffee',     tier2:'🥛 Cà Phê Trứng',         tier3:'👑 Hanoi Reserve',
                      equipment:['espresso_machine','steam_wand'],
                      recipe:{ ingredients:['2 egg yolks','2 tsp condensed milk','1 shot robusta espresso'], method:'Beat yolks with condensed milk until pale and fluffy. Pour over espresso.', time:'Morning', temp:'70°C' } },
    boba:           { tier1:'🧋 House Boba',           tier2:'🥛 Brown Sugar Boba',      tier3:'👑 Mastercraft Boba',
                      equipment:['boba_cooker','syrup_shelf','ice_bucket'],
                      recipe:{ ingredients:['50g tapioca pearls','200ml oat milk','brown sugar syrup','ice'], method:'Cook pearls 20min, caramelise syrup, layer over crushed ice and milk.', time:'Afternoon', temp:'Cold' } },
    caramel_mac:    { tier1:'☕ House Macchiato',      tier2:'🥛 Caramel Macchiato',     tier3:'👑 Signature Macchiato',
                      equipment:['espresso_machine','frother','syrup_shelf'],
                      recipe:{ ingredients:['vanilla syrup','150ml whole milk','2 shots espresso','caramel drizzle'], method:'Foam milk over vanilla syrup, pour shots through foam, finish with caramel.', time:'Afternoon', temp:'65°C' } },
    ca_phe_sua_da:  { tier1:'🧊 Iced Coffee',          tier2:'🥛 Cà Phê Sữa Đá',        tier3:'👑 Saigon Reserve',
                      equipment:['ice_bucket','crushed_ice'],
                      recipe:{ ingredients:['robusta dark roast','2 tbsp condensed milk','crushed ice'], method:'Brew through phin filter directly onto condensed milk. Pour over crushed ice.', time:'Morning', temp:'Cold' } },
    lavender_latte: { tier1:'💜 Lavender Milk',        tier2:'🥛 Lavender Honey Latte',  tier3:'👑 Floral Reserve',
                      equipment:['frother','syrup_shelf','petal_press'],
                      recipe:{ ingredients:['1 tbsp lavender syrup','2 shots espresso','200ml oat milk','honey'], method:'Extract lavender essence, combine with espresso and steamed oat milk.', time:'Afternoon', temp:'65°C' } },
    dalgona:        { tier1:'☁️ Whipped Coffee',       tier2:'🥛 Dalgona',               tier3:'👑 Reserve Dalgona',
                      equipment:['frother','ice_bucket'],
                      recipe:{ ingredients:['2 tbsp instant coffee','2 tbsp sugar','2 tbsp hot water','200ml milk','ice'], method:'Whip coffee, sugar, water until stiff peaks. Spoon over iced milk.', time:'Afternoon', temp:'Cold' } },
    iced_matcha:    { tier1:'🌿 Iced Green Tea',       tier2:'🥛 Iced Matcha',           tier3:'👑 Ceremonial Iced Matcha',
                      equipment:['ice_bucket','oat_dispenser'],
                      recipe:{ ingredients:['2 tsp ceremonial matcha','30ml cold water','200ml oat milk','ice'], method:'Whisk matcha into a paste, pour over ice and oat milk.', time:'Afternoon', temp:'Cold' } },
    rose_gold:      { tier1:'🌹 Rose Milk',            tier2:'🥛 Rose Gold Latte',       tier3:'👑 Atelier Rose',
                      equipment:['petal_press','frother','gold_flake'],
                      recipe:{ ingredients:['rose water','edible gold flakes','oat milk','espresso'], method:'Distil rose petals, combine with espresso and foamed oat milk, finish with gold.', time:'Evening', temp:'65°C' } },
    galaxy_brew:    { tier1:'🌌 Cold Brew',            tier2:'🥛 Galaxy Cold Brew',      tier3:'👑 Nebula Reserve',
                      equipment:['cold_brew_tower','ice_bucket','crushed_ice'],
                      recipe:{ ingredients:['coarse single-origin grounds','600ml cold water','butterfly pea flower','tonic'], method:'Steep 18 hours in cold brew tower, add butterfly pea infusion for colour shift.', time:'Anytime', temp:'Cold' } },
    midnight_esp:   { tier1:'🌑 Dark Espresso',        tier2:'🥛 Midnight Pull',         tier3:'👑 The Midnight Espresso',
                      equipment:['espresso_machine','gold_flake'],
                      recipe:{ ingredients:['darkest roast grounds','18g','pinch of activated charcoal'], method:'Ultra-dark roast pulled at 92°C. Finish with edible gold flake dusting.', time:'Night', temp:'92°C' } },
    cherry_blossom: { tier1:'🌸 Sakura Milk',          tier2:'🥛 Cherry Blossom Latte',  tier3:'👑 Spring Reserve',
                      equipment:['petal_press','frother','syrup_shelf'],
                      recipe:{ ingredients:['sakura extract','cherry syrup','200ml steamed oat milk','matcha swirl'], method:'Press cherry blossoms, combine extract with steamed milk and a matcha swirl.', time:'Spring morning', temp:'65°C' } },
    barista_secret: { tier1:'🔮 Mystery Brew',         tier2:'🥛 The Secret',            tier3:"👑 The Barista's Secret",
                      equipment:['espresso_machine','siphon','gold_flake','petal_press'],
                      recipe:{ ingredients:['?','?','?','time'], method:'Known only to those who have mastered all other brews.', time:'Only when ready', temp:'Perfect' } },
    golden_hour:    { tier1:'✨ Gilded Milk',           tier2:'🥛 Golden Latte',          tier3:'👑 Golden Hour Reserve',
                      equipment:['gold_flake','frother','pour_over'],
                      recipe:{ ingredients:['turmeric','ginger','edible gold flakes','oat milk','light roast espresso'], method:'Pour over with golden milk blend, finish with edible gold dust at sunset.', time:'Sunset', temp:'70°C' } },
    aurora_brew:    { tier1:'🌈 Rainbow Milk',         tier2:'🥛 Aurora Latte',          tier3:'👑 Aurora Reserve',
                      equipment:['petal_press','cold_brew_tower','siphon'],
                      recipe:{ ingredients:['butterfly pea','hibiscus','citrus','cold brew','oat milk'], method:'Layer colour-shifting extracts with cold brew. The siphon reveals the aurora effect.', time:'Any', temp:'Cold' } },
    the_void:       { tier1:'🕳️ Black Coffee',         tier2:'🥛 The Deep Dark',         tier3:'👑 The Void',
                      equipment:['cold_brew_tower','espresso_machine'],
                      recipe:{ ingredients:['activated charcoal','triple espresso','48h cold brew','nothing else'], method:"Some things cannot be explained. Brew with patience. Or don't.", time:'When all is lost', temp:'Absolute zero' } },
  };

  const RARITY_ORDER = ['common','uncommon','rare','epic','legendary'];
  const RARITY_META = {
    common:    { label:'Common',    chalk:'#d4c5a9', icon:'☕' },
    uncommon:  { label:'Uncommon',  chalk:'#7ec8c8', icon:'🥛' },
    rare:      { label:'Rare',      chalk:'#c39bd3', icon:'🌟' },
    epic:      { label:'Epic',      chalk:'#f0a500', icon:'💎' },
    legendary: { label:'Legendary', chalk:'#ffd700', icon:'👑' },
  };

  function renderCollectionTab() {
    const container = document.getElementById('collectionTabContent');
    if (!container) return;

    const owned    = ShopModule.getOwned();
    const ownedD   = owned.drinks    || [];
    const ownedE   = owned.equipment || [];
    const activeD  = owned.activeDrink;

    const totalOwned = ownedD.length + ownedE.length;
    const totalAll   = ShopModule.DRINKS.length + ShopModule.EQUIPMENT.length;

    container.innerHTML = `
      <div class="col-page">
        <div class="col-header">
          <div>
            <h2 class="col-title">🍵 My Collection</h2>
            <p class="col-subtitle">Tap an owned drink to view its recipe and tiers</p>
          </div>
          <div class="col-progress-pill">
            ${totalOwned} / ${totalAll} collected
          </div>
        </div>

        <div class="col-body">
          <!-- DRINKS — one shelf per rarity -->
          <section class="col-section">
            <h3 class="col-section-title">🍹 Drinks</h3>
            <div id="col-drinks-sections"></div>
          </section>

          <!-- EQUIPMENT — single shelf -->
          <section class="col-section">
            <h3 class="col-section-title">🔧 Equipment (${ownedE.length}/${ShopModule.EQUIPMENT.length})</h3>
            <div class="col-shelf col-shelf-equipment" id="col-equipment-shelf">
              <div class="col-shelf-label">
                <span class="col-shelf-label-icon">🔧</span>
                <span class="col-shelf-label-text">Tools & Equipment</span>
                <span class="col-rarity-count">${ownedE.length}/${ShopModule.EQUIPMENT.length}</span>
              </div>
              <div class="col-shelf-cards" id="col-equip-cards"></div>
              <div class="col-shelf-plank"></div>
            </div>
          </section>
        </div>

        <!-- Info panel slide-up -->
        <div class="col-info-panel hidden" id="colInfoPanel"></div>
      </div>
    `;

    // ---- Drinks shelves by rarity ----
    const drinksBySections = document.getElementById('col-drinks-sections');
    RARITY_ORDER.forEach(rarity => {
      const group = ShopModule.DRINKS.filter(d => d.rarity === rarity);
      if (!group.length) return;
      const meta = RARITY_META[rarity];
      const ownedInGroup = group.filter(d => ownedD.includes(d.id)).length;

      const shelf = document.createElement('div');
      shelf.className = `col-shelf col-shelf-${rarity}`;
      shelf.innerHTML = `
        <div class="col-shelf-label">
          <span class="col-shelf-label-icon">${meta.icon}</span>
          <span class="col-shelf-label-text" style="color:${meta.chalk}">${meta.label}</span>
          <span class="col-rarity-count">${ownedInGroup}/${group.length}</span>
        </div>
        <div class="col-shelf-cards" id="col-row-${rarity}"></div>
        <div class="col-shelf-plank"></div>
      `;
      drinksBySections.appendChild(shelf);

      const row = shelf.querySelector(`#col-row-${rarity}`);
      group.forEach(drink => {
        const isOwn    = ownedD.includes(drink.id);
        const isActive = activeD === drink.id;
        const card = document.createElement('div');
        card.className = `col-drink-card col-rarity-${rarity}${isOwn ? ' col-owned' : ' col-locked'}${isActive ? ' col-active' : ''}`;
        card.innerHTML = `
          <div class="col-rarity-dot" style="background:${meta.chalk}"></div>
          <div class="col-drink-emoji">${isOwn ? drink.emoji : '?'}</div>
          <div class="col-drink-name">${isOwn ? drink.name : '???'}</div>
          ${isActive ? '<div class="col-active-badge">Active</div>' : ''}
          ${!isOwn   ? '<div class="col-lock-icon">🔒</div>'       : ''}
        `;
        if (isOwn) card.addEventListener('click', () => showDrinkInfo(drink, ownedE, activeD));
        row.appendChild(card);
      });
    });

    // ---- Equipment shelf cards ----
    const equipCards = document.getElementById('col-equip-cards');
    ShopModule.EQUIPMENT.forEach(eq => {
      const isOwn = ownedE.includes(eq.id);
      const item = document.createElement('div');
      item.className = `col-drink-card col-rarity-equipment${isOwn ? ' col-owned' : ' col-locked'}`;
      item.title = isOwn ? `${eq.name} — ${eq.desc}` : 'Not yet unlocked';
      item.innerHTML = `
        <div class="col-drink-emoji">${isOwn ? eq.emoji : '🔒'}</div>
        <div class="col-drink-name">${isOwn ? eq.name : '???'}</div>
      `;
      equipCards.appendChild(item);
    });
  }

  function showDrinkInfo(drink, ownedEquip, activeDrinkId) {
    const panel = document.getElementById('colInfoPanel');
    if (!panel) return;

    const tiers = DRINK_TIERS[drink.id] || {};
    const eq1 = tiers.equipment?.[0], eq2 = tiers.equipment?.[1];
    const hasEq1 = !eq1 || ownedEquip.includes(eq1);
    const hasEq2 = !eq2 || ownedEquip.includes(eq2);
    const currentTier = hasEq1 && hasEq2 ? 3 : hasEq1 ? 2 : 1;
    const isActive = activeDrinkId === drink.id;

    const eqTag = (id) => {
      if (!id) return '';
      const eq = ShopModule.EQUIPMENT.find(e => e.id === id);
      const own = ownedEquip.includes(id);
      return `<span class="col-eq-tag${own ? ' owned' : ' locked'}">${own ? eq.emoji : '🔒'} ${own ? eq.name : 'Locked'}</span>`;
    };

    panel.classList.remove('hidden');
    panel.innerHTML = `
      <div class="col-panel-handle"></div>
      <button class="col-panel-close" id="colPanelClose">✕</button>
      <div class="col-panel-inner">
        <div class="col-panel-left">
          <div class="col-panel-emoji">${drink.emoji}</div>
          <h3 class="col-panel-name">${drink.name}</h3>
          <p class="col-panel-desc">${drink.desc}</p>

          <div class="col-tiers">
            ${[1,2,3].map(n => `
              <div class="col-tier${currentTier >= n ? ' unlocked' : ''}">
                <div class="col-tier-icon">${['☕','🥛','👑'][n-1]}</div>
                <div class="col-tier-body">
                  <div class="col-tier-label">${['House','Signature','Mastercraft'][n-1]}</div>
                  <div class="col-tier-name">${tiers['tier'+n] || '—'}</div>
                  <div class="col-tier-reqs">
                    ${n===2 ? eqTag(eq1) : n===3 ? eqTag(eq1)+eqTag(eq2) : '<span class="col-tier-free">No equipment needed</span>'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <button class="col-set-active${isActive ? ' is-active' : ''}" id="colSetActive" data-id="${drink.id}">
            ${isActive ? '✓ Currently Active' : '☕ Set as Active Drink'}
          </button>
        </div>

        <div class="col-panel-right">
          <h4 class="col-recipe-title">📜 ${tiers['tier'+currentTier] || 'Recipe'}</h4>
          ${tiers.recipe ? `
            <div class="col-recipe-block">
              <div class="col-recipe-label">Ingredients</div>
              <ul class="col-recipe-list">${(tiers.recipe.ingredients||[]).map(i=>`<li>${i}</li>`).join('')}</ul>
            </div>
            <div class="col-recipe-block">
              <div class="col-recipe-label">Method</div>
              <p class="col-recipe-method">${tiers.recipe.method}</p>
            </div>
            <div class="col-recipe-meta">
              <span>⏰ ${tiers.recipe.time}</span>
              <span>🌡️ ${tiers.recipe.temp}</span>
            </div>
          ` : '<p class="col-recipe-unknown">Recipe classified ☕</p>'}
        </div>
      </div>
    `;

    panel.querySelector('#colPanelClose').addEventListener('click', () => panel.classList.add('hidden'));
    panel.querySelector('#colSetActive').addEventListener('click', () => {
      ShopModule.setActiveDrink(drink.id);
      renderCollectionTab();
    });
  }

  function init() {
    document.querySelectorAll('.tab-btn[data-tab="collection"]').forEach(btn => {
      btn.addEventListener('click', () => renderCollectionTab());
    });
  }

  return { init, renderCollectionTab };
})();
