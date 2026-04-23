// =============================================
// GOALS MODULE
// =============================================

const GoalsModule = (function() {

  let goals = JSON.parse(localStorage.getItem('goals')) || [];
  let categories = JSON.parse(localStorage.getItem('categories')) || ['work', 'personal', 'health'];
  let selectedCategory = null;
  let selectedGoalId = null;
  let sortBy = 'none';
  let sortDirection = 'asc';
  let activeFilters = [];
  let completionFilter = null;

  function saveData() {
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  function getGoals() { return goals; }
  function getCompletionRate() {
    if (!goals.length) return 0;
    return Math.round((goals.filter(g => g.completed).length / goals.length) * 100);
  }

  // ---- Rendering ----
  function renderGoals() {
    const container = document.getElementById('goalsContainer');
    if (!container) return;
    container.innerHTML = '';

    let filtered = [...goals];
    if (activeFilters.length > 0) filtered = filtered.filter(g => activeFilters.includes(g.category));
    if (completionFilter === 'completed') filtered = filtered.filter(g => g.completed);
    else if (completionFilter === 'incomplete') filtered = filtered.filter(g => !g.completed);

    if (filtered.length === 0) {
      container.innerHTML = `<p class="no-goals-message">${activeFilters.length || completionFilter ? 'No goals match filters' : 'No goals yet. Add your first goal!'}</p>`;
      return;
    }

    filtered.forEach(goal => {
      const el = document.createElement('div');
      el.className = `goal-item ${goal.completed ? 'completed' : ''} ${selectedGoalId === goal.id ? 'selected' : ''}`;
      el.dataset.id = goal.id;

      const content = document.createElement('div');
      content.className = 'goal-content';

      const chk = document.createElement('input');
      chk.type = 'checkbox'; chk.className = 'goal-checkbox'; chk.checked = goal.completed;
      chk.addEventListener('change', function() {
        goal.completed = this.checked;
        if (goal.subgoals?.length) goal.subgoals.forEach(sg => sg.completed = this.checked);
        saveData(); updateMainProgress(); renderGoals();
      });

      const span = document.createElement('span');
      span.className = `goal-text ${goal.completed ? 'completed' : ''}`;
      span.textContent = goal.text;

      const del = document.createElement('button');
      del.className = 'delete-goal-btn'; del.innerHTML = '&times;';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        goals = goals.filter(g => g.id !== goal.id);
        if (selectedGoalId === goal.id) selectedGoalId = null;
        saveData(); updateMainProgress(); renderGoals();
      });

      content.appendChild(chk); content.appendChild(span);
      if (goal.category) {
        const badge = document.createElement('span');
        badge.className = 'goal-category'; badge.textContent = goal.category;
        content.appendChild(badge);
      }
      content.appendChild(del);
      el.appendChild(content);

      // Subgoals
      if (goal.subgoals?.length) {
        const prog = document.createElement('div'); prog.className = 'goal-progress-container';
        const progBar = document.createElement('div'); progBar.className = 'goal-progress-bar';
        const progFill = document.createElement('div'); progFill.className = 'goal-progress';
        progFill.style.width = calcSubgoalProgress(goal) + '%';
        progBar.appendChild(progFill); prog.appendChild(progBar); el.appendChild(prog);

        const subs = document.createElement('div'); subs.className = 'subgoals-container';
        goal.subgoals.forEach(sg => {
          const subEl = document.createElement('div'); subEl.className = 'subgoal-item';
          const sChk = document.createElement('input'); sChk.type = 'checkbox'; sChk.className = 'goal-checkbox'; sChk.checked = sg.completed;
          sChk.addEventListener('change', function() {
            sg.completed = this.checked;
            goal.completed = goal.subgoals.every(s => s.completed);
            saveData(); updateMainProgress(); renderGoals();
          });
          const sSpan = document.createElement('span'); sSpan.className = `goal-text ${sg.completed ? 'completed' : ''}`; sSpan.textContent = sg.text;
          const sDel = document.createElement('button'); sDel.className = 'delete-goal-btn'; sDel.innerHTML = '&times;';
          sDel.addEventListener('click', (e) => {
            e.stopPropagation();
            goal.subgoals = goal.subgoals.filter(s => s.id !== sg.id);
            saveData(); renderGoals();
          });
          subEl.appendChild(sChk); subEl.appendChild(sSpan);
          if (sg.category) { const b = document.createElement('span'); b.className = 'goal-category'; b.textContent = sg.category; subEl.appendChild(b); }
          subEl.appendChild(sDel); subs.appendChild(subEl);
        });
        el.appendChild(subs);
      }

      content.addEventListener('click', (e) => {
        if (e.target !== chk && e.target !== del) {
          selectedGoalId = selectedGoalId === goal.id ? null : goal.id;
          renderGoals();
        }
      });

      container.appendChild(el);
    });
  }

  function calcSubgoalProgress(goal) {
    if (!goal.subgoals?.length) return 0;
    return (goal.subgoals.filter(s => s.completed).length / goal.subgoals.length) * 100;
  }

  function updateMainProgress() {
    const bar = document.querySelector('.progress');
    const clearBtn = document.getElementById('clearAllGoalsBtn');
    if (!bar) return;
    if (!goals.length) { bar.style.width = '0%'; if (clearBtn) clearBtn.classList.add('hidden'); return; }
    const pct = goals.filter(g => g.completed).length / goals.length * 100;
    bar.style.width = pct + '%';
    const allDone = goals.length > 0 && goals.every(g => g.completed);
    if (clearBtn) { clearBtn.classList.toggle('hidden', !allDone); }
    if (allDone) triggerCelebration();
  }

  // ---- Goal actions ----
  function addGoal() {
    const input = document.getElementById('newGoalInput');
    const text = input.value.trim();
    if (!text) return;
    goals.push({ id: Date.now(), text, category: selectedCategory, completed: false, subgoals: [] });
    saveData(); updateMainProgress(); renderGoals();
    input.value = ''; input.classList.remove('expanded'); input.focus();
  }

  async function addSubgoalToSelected() {
    if (!selectedGoalId) { showCustomAlert('Click a goal first to add a subgoal'); return; }
    const subText = await showCustomPrompt('Enter subgoal text:');
    if (!subText?.trim()) return;
    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return;
    goal.subgoals.push({ id: Date.now(), text: subText.trim(), completed: false, category: goal.category });
    saveData(); renderGoals();
  }

  function handleAddGoal() {
    if (selectedGoalId) addSubgoalToSelected();
    else addGoal();
    document.getElementById('addGoalBtn')?.classList.add('clicked');
    setTimeout(() => document.getElementById('addGoalBtn')?.classList.remove('clicked'), 300);
  }

  // ---- Categories ----
  function renderPickCategories() {
    const list = document.getElementById('pickCategoryList');
    if (!list) return;
    list.innerHTML = '';

    const addTag = (name, isNull = false) => {
      const el = document.createElement('div');
      el.className = `category-tag ${(isNull && !selectedCategory) || selectedCategory === name ? 'active' : ''}`;
      el.textContent = isNull ? 'No Category' : name;
      el.addEventListener('click', () => {
        selectedCategory = isNull ? null : (selectedCategory === name ? null : name);
        renderPickCategories();
      });
      list.appendChild(el);
    };
    addTag(null, true);
    categories.forEach(c => addTag(c));

    const resetBtn = document.createElement('div');
    resetBtn.className = 'reset-categories-btn';
    resetBtn.innerHTML = '<span>↻</span> Reset Categories';
    resetBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const confirmed = await showConfirm('Reset all categories to default?');
      if (confirmed) {
        categories = ['work', 'personal', 'health']; selectedCategory = null;
        saveData(); renderPickCategories(); renderFilterCategories();
      }
    });
    list.appendChild(resetBtn);
  }

  function renderFilterCategories() {
    const list = document.getElementById('filterCategoryList');
    if (!list) return;
    list.innerHTML = '';

    const compSec = document.createElement('div'); compSec.className = 'filter-section';
    const compTitle = document.createElement('div'); compTitle.className = 'filter-section-title'; compTitle.textContent = 'Completion';
    compSec.appendChild(compTitle);
    const compTags = document.createElement('div'); compTags.className = 'filter-tags';
    [{ value: null, label: 'All' }, { value: 'completed', label: 'Completed' }, { value: 'incomplete', label: 'Incomplete' }].forEach(opt => {
      const t = document.createElement('span'); t.className = `filter-tag ${completionFilter === opt.value ? 'active' : ''}`;
      t.textContent = opt.label;
      t.addEventListener('click', (e) => {
        e.stopPropagation(); completionFilter = completionFilter === opt.value ? null : opt.value;
        renderFilterCategories(); renderGoals();
      });
      compTags.appendChild(t);
    });
    compSec.appendChild(compTags); list.appendChild(compSec);

    const catSec = document.createElement('div'); catSec.className = 'filter-section';
    const catTitle = document.createElement('div'); catTitle.className = 'filter-section-title'; catTitle.textContent = 'Category';
    catSec.appendChild(catTitle);
    const catTags = document.createElement('div'); catTags.className = 'filter-tags';
    const allTag = document.createElement('span'); allTag.className = `filter-tag ${activeFilters.length === 0 ? 'active' : ''}`; allTag.textContent = 'All Categories';
    allTag.addEventListener('click', (e) => { e.stopPropagation(); activeFilters = []; renderFilterCategories(); renderGoals(); });
    catTags.appendChild(allTag);
    categories.forEach(cat => {
      const t = document.createElement('span'); t.className = `filter-tag ${activeFilters.includes(cat) ? 'active' : ''}`; t.textContent = cat;
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeFilters.includes(cat)) activeFilters = activeFilters.filter(f => f !== cat);
        else activeFilters.push(cat);
        renderFilterCategories(); renderGoals();
      });
      catTags.appendChild(t);
    });
    catSec.appendChild(catTags); list.appendChild(catSec);
  }

  async function addNewCategory() {
    const name = await showCustomPrompt('Enter new category name:');
    if (!name?.trim()) return;
    if (categories.includes(name.trim())) { showCustomAlert('Category already exists!'); return; }
    categories.push(name.trim()); saveData();
    renderPickCategories(); renderFilterCategories();
  }

  // ---- Sort ----
  function initSortDropdown() {
    const btn = document.getElementById('sortGoalsBtn');
    if (!btn) return;
    const sortDropdown = document.createElement('div');
    sortDropdown.className = 'sort-dropdown hidden'; sortDropdown.id = 'sortDropdown';

    ['category', 'completion', 'text'].forEach(opt => {
      const el = document.createElement('div');
      el.className = `sort-option ${sortBy === opt ? 'active' : ''}`; el.dataset.sortBy = opt;
      el.innerHTML = `${opt.charAt(0).toUpperCase() + opt.slice(1)} <span class="sort-arrow">${sortBy === opt ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</span>`;
      el.addEventListener('click', () => {
        if (sortBy === opt) sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        else { sortBy = opt; sortDirection = 'asc'; }
        updateSortUI(); sortGoals();
      });
      sortDropdown.appendChild(el);
    });

    btn.insertAdjacentElement('afterend', sortDropdown);
    wrapDropdown(btn, sortDropdown);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns(btn);
      sortDropdown.classList.toggle('visible');
      sortDropdown.classList.toggle('hidden');
      btn.classList.toggle('active');
    });
  }

  function updateSortUI() {
    document.querySelectorAll('.sort-option').forEach(opt => {
      const sb = opt.dataset.sortBy; opt.classList.toggle('active', sortBy === sb);
      const arrow = opt.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = sortBy === sb ? (sortDirection === 'asc' ? '↑' : '↓') : '';
    });
  }

  function sortGoals() {
    if (sortBy === 'none') goals.sort((a,b) => a.id - b.id);
    else goals.sort((a,b) => {
      let cmp = 0;
      if (sortBy === 'category') cmp = (a.category||'zzz').localeCompare(b.category||'zzz');
      else if (sortBy === 'completion') cmp = a.completed === b.completed ? 0 : (a.completed ? 1 : -1);
      else if (sortBy === 'text') cmp = a.text.localeCompare(b.text);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    saveData(); renderGoals();
  }

  // ---- Helpers ----
  function wrapDropdown(button, dropdown) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;display:inline-block;';
    button.parentNode.insertBefore(wrapper, button);
    wrapper.appendChild(button); wrapper.appendChild(dropdown);
  }

  function closeAllDropdowns(except = null) {
    const items = [
      { btn: document.getElementById('pickCategoryToggle'), dd: document.getElementById('pickCategoryDropdown') },
      { btn: document.getElementById('sortGoalsBtn'), dd: document.getElementById('sortDropdown') },
      { btn: document.getElementById('filterCategoryBtn'), dd: document.getElementById('filterCategoryDropdown') },
    ];
    items.forEach(item => {
      if (!item.btn || !item.dd) return;
      if (item.btn !== except) {
        item.dd.classList.remove('visible'); item.dd.classList.add('hidden');
        item.btn.classList.remove('active');
      }
    });
  }

  // ---- Init ----
  function init() {
    const addGoalBtn = document.getElementById('addGoalBtn');
    const newGoalInput = document.getElementById('newGoalInput');
    const pickCategoryToggle = document.getElementById('pickCategoryToggle');
    const pickCategoryDropdown = document.getElementById('pickCategoryDropdown');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const filterCategoryBtn = document.getElementById('filterCategoryBtn');
    const filterCategoryDropdown = document.getElementById('filterCategoryDropdown');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const clearAllGoalsBtn = document.getElementById('clearAllGoalsBtn');

    if (!addGoalBtn) return;

    wrapDropdown(pickCategoryToggle, pickCategoryDropdown);
    wrapDropdown(filterCategoryBtn, filterCategoryDropdown);

    addGoalBtn.addEventListener('click', handleAddGoal);
    newGoalInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAddGoal(); });

    pickCategoryToggle.addEventListener('click', (e) => {
      e.stopPropagation(); closeAllDropdowns(pickCategoryToggle);
      pickCategoryDropdown.classList.toggle('visible');
      pickCategoryDropdown.classList.toggle('hidden');
      pickCategoryToggle.classList.toggle('active');
    });

    addCategoryBtn.addEventListener('click', addNewCategory);

    filterCategoryBtn.addEventListener('click', (e) => {
      e.stopPropagation(); closeAllDropdowns(filterCategoryBtn);
      filterCategoryDropdown.classList.toggle('visible');
      filterCategoryDropdown.classList.toggle('hidden');
      filterCategoryBtn.classList.toggle('active');
    });

    clearFiltersBtn.addEventListener('click', () => {
      activeFilters = []; completionFilter = null;
      renderFilterCategories(); renderGoals();
      filterCategoryDropdown.classList.remove('visible'); filterCategoryDropdown.classList.add('hidden');
      filterCategoryBtn.classList.remove('active');
    });

    clearAllGoalsBtn.addEventListener('click', async () => {
      const ok = await showConfirm('Clear all goals? This cannot be undone.');
      if (ok) { goals = []; selectedGoalId = null; saveData(); updateMainProgress(); renderGoals(); }
    });

    document.addEventListener('click', (e) => {
      if (!pickCategoryToggle.contains(e.target) && !pickCategoryDropdown.contains(e.target)) {
        pickCategoryDropdown.classList.remove('visible'); pickCategoryDropdown.classList.add('hidden'); pickCategoryToggle.classList.remove('active');
      }
      if (!filterCategoryBtn.contains(e.target) && !filterCategoryDropdown.contains(e.target)) {
        filterCategoryDropdown.classList.remove('visible'); filterCategoryDropdown.classList.add('hidden'); filterCategoryBtn.classList.remove('active');
      }
      const sd = document.getElementById('sortDropdown');
      const sb = document.getElementById('sortGoalsBtn');
      if (sd && sb && !sb.contains(e.target) && !sd.contains(e.target)) {
        sd.classList.remove('visible'); sd.classList.add('hidden'); sb.classList.remove('active');
      }
    });

    initSortDropdown();
    renderGoals();
    renderPickCategories();
    renderFilterCategories();
    updateMainProgress();

    newGoalInput.focus();
  }

  return { init, renderGoals, updateMainProgress, getGoals, getCompletionRate };
})();
