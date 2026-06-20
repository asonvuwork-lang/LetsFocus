// =============================================
// GOAL TEMPLATES MODULE
// =============================================
const TemplatesModule = (function () {

  const TEMPLATES = [
    {
      id: 'study',
      name: '📚 Study Session',
      description: 'Deep work on learning and knowledge',
      goals: [
        { text: 'Review notes from last session', category: 'Study' },
        { text: 'Read assigned material', category: 'Study' },
        { text: 'Complete practice problems', category: 'Study' },
        { text: 'Write a summary of what I learned', category: 'Study' },
        { text: 'Plan next study session', category: 'Study' },
      ],
    },
    {
      id: 'workday',
      name: '💼 Work Day',
      description: 'Productive professional tasks',
      goals: [
        { text: 'Check and reply to emails', category: 'Work' },
        { text: 'Complete top priority task', category: 'Work' },
        { text: 'Attend / prepare for meetings', category: 'Work' },
        { text: 'Review and update project status', category: 'Work' },
        { text: 'Plan tomorrow\'s tasks', category: 'Work' },
      ],
    },
    {
      id: 'fitness',
      name: '🏋️ Fitness Week',
      description: 'Stay active and healthy',
      goals: [
        { text: 'Morning workout or walk', category: 'Fitness' },
        { text: 'Drink 8 glasses of water', category: 'Fitness' },
        { text: 'Eat a healthy meal', category: 'Fitness' },
        { text: 'Stretch or yoga session', category: 'Fitness' },
        { text: 'Track sleep quality', category: 'Fitness' },
      ],
    },
    {
      id: 'creative',
      name: '🎨 Creative Sprint',
      description: 'Unleash your creative side',
      goals: [
        { text: 'Brainstorm new ideas', category: 'Creative' },
        { text: 'Work on main creative project', category: 'Creative' },
        { text: 'Seek inspiration (read / watch / explore)', category: 'Creative' },
        { text: 'Share or publish something', category: 'Creative' },
      ],
    },
    {
      id: 'personal',
      name: '🧘 Personal Development',
      description: 'Invest in yourself',
      goals: [
        { text: 'Journaling — reflect on the week', category: 'Personal' },
        { text: 'Read a book (at least 20 pages)', category: 'Personal' },
        { text: 'Meditate or breathe for 10 minutes', category: 'Personal' },
        { text: 'Call or message someone important', category: 'Personal' },
        { text: 'Declutter one area of your space', category: 'Personal' },
      ],
    },
    {
      id: 'morning',
      name: '☀️ Morning Routine',
      description: 'Start the day right',
      goals: [
        { text: 'Wake up on time', category: 'Personal' },
        { text: 'Exercise or stretch', category: 'Fitness' },
        { text: 'Healthy breakfast', category: 'Fitness' },
        { text: 'Review today\'s goals', category: 'Work' },
        { text: 'Set intention for the day', category: 'Personal' },
      ],
    },
  ];

  function showModal() {
    const existing = document.getElementById('templatesModal');
    if (existing) { existing.remove(); return; }

    const modal = document.createElement('div');
    modal.id = 'templatesModal';
    modal.className = 'templates-modal-bg';
    modal.innerHTML = `
      <div class="templates-modal">
        <div class="templates-modal-header">
          <h2 class="templates-modal-title">📋 Goal Templates</h2>
          <p class="templates-modal-sub">Load a pre-built goal set to get started quickly</p>
          <button class="templates-modal-close" id="templatesClose">✕</button>
        </div>
        <div class="templates-grid" id="templatesGrid"></div>
      </div>
    `;

    document.body.appendChild(modal);

    const grid = modal.querySelector('#templatesGrid');
    TEMPLATES.forEach(tmpl => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <div class="template-card-title">${tmpl.name}</div>
        <div class="template-card-desc">${tmpl.description}</div>
        <ul class="template-card-goals">
          ${tmpl.goals.slice(0, 3).map(g => `<li>${g.text}</li>`).join('')}
          ${tmpl.goals.length > 3 ? `<li class="template-more">+${tmpl.goals.length - 3} more…</li>` : ''}
        </ul>
        <button class="template-load-btn" data-id="${tmpl.id}">Load Template</button>
      `;
      card.querySelector('.template-load-btn').addEventListener('click', () => loadTemplate(tmpl, modal));
      grid.appendChild(card);
    });

    modal.querySelector('#templatesClose').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  function loadTemplate(tmpl, modal) {
    if (typeof GoalsModule === 'undefined') return;
    const goals = GoalsModule.getGoals();
    const existingTexts = goals.map(g => g.text.toLowerCase());

    let added = 0;
    tmpl.goals.forEach(tg => {
      if (!existingTexts.includes(tg.text.toLowerCase())) {
        GoalsModule.addGoalProgrammatic(tg.text, tg.category);
        added++;
      }
    });

    modal.remove();
    showCustomAlert(`✅ Loaded "${tmpl.name}" — ${added} goal${added !== 1 ? 's' : ''} added!`);
  }

  function init() {
    // Wire the existing #templatesBtn in HTML — do NOT inject a duplicate
    const tmplBtn = document.getElementById('templatesBtn');
    if (tmplBtn) {
      tmplBtn.addEventListener('click', showModal);
    }
  }

  return { init, showModal };
})();
