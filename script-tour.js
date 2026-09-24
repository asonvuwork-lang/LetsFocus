// =============================================
// GUIDED TOUR MODULE
// =============================================
const TourModule = (function () {

  const STORAGE_KEY     = 'letsfocus_tour_done';
  const SESSION_KEY     = 'letsfocus_tour_step';

  // Tour targets are deliberately compact so the card can sit beside each feature.
  const STEPS = [
    // ── 1. Welcome ─────────────────────────────────────────────────────────────
    {
      tab: 'goals',
      target: null,
      title: '☕ Welcome to LetsFocus!',
      text: 'Your personal focus café — where every work session brews something delicious. Let\'s take a quick tour of everything.',
      bullets: [
        '🎯 Set goals and focus with a timer',
        '☕ Earn beans and roll for collectible drinks',
        '🏅 Level up through 10 barista ranks',
        '🍵 Build a full collection of 27 unique drinks',
      ],
      position: 'center',
    },

    // ── 2. Adding goals ────────────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#newGoalInput',
      title: '✏️ Add Your First Goal',
      text: 'Type anything and press Enter — that\'s all it takes. The toolbar above has a few handy extras:',
      bullets: [
        '🏷️ Pick Category — colour + drink pairing for the goal',
        '📅 Deadline — shows up on the Deadlines tab with urgency colours',
        '🔁 Recurring goals auto-reset daily or weekly',
        'Use Sort and Filter to find the next goal to work on',
      ],
      position: 'bottom',
    },

    // ── 3. List vs Board views ─────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '.goal-view-toggle',
      title: '☰ List & 📋 Board Views',
      text: 'Toggle between two views using these buttons above your goal list.',
      bullets: [
        '☰ List view — compact, sortable, filterable, drag-to-reorder',
        '📋 Board view — goals become sticky bills on a corkboard',
        '🎨 Bill colour matches the goal\'s category',
        '✓ Double-click a bill to mark it done; completed bills get a green stamp',
      ],
      position: 'bottom',

    },

    // ── 4. Templates ───────────────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#templatesBtn',
      title: '📋 Goal Templates',
      text: 'Don\'t want to start from scratch? Load a pre-built goal set in one click.',
      bullets: [
        '📚 Study Session, 💼 Work Day, 🏋️ Fitness Week',
        '🎨 Creative Sprint, 🧘 Personal Development, ☀️ Morning Routine',
        'Skips any duplicates — safe to load on an existing list',
      ],
      position: 'bottom',
    },

    // ── 5. Focus session + drink (MERGED) ──────────────────────────────────────
    {
      tab: 'goals',
      target: '#coffeeCup',
      title: '⏱ Focus Sessions & Your Drink',
      text: 'Click the coffee cup to start a session. Watch your drink fill up live as time ticks down!',
      bullets: [
        '⚙ Custom time or 🍅 Pomodoro (25 min work → 5 min break × 4)',
        '🥤 Drink type matches your goal\'s category — swap it anytime with ⟳',
        'Cream, garnishes and finishing touches appear as your session progresses',
        '⤢ Pop Out — float the timer in its own window while you work',
      ],
      position: 'left',
    },

    {
      page: 'timer', target: '.timer-controls-large', fallback: '#startPauseBtn',
      title: '⏯ A Timer That Follows Your Pace',
      text: 'This is a preview of your focus space. The tour does not start or reset a session.',
      bullets: ['Start or pause here; your drink holds its progress while paused', 'Click the time digits to edit the duration', 'Pop Out keeps the timer in a separate window'], position: 'bottom',
    },
    {
      page: 'timer', target: '#drinkProgressBox .goal-area-box-header', fallback: '#drinkSwapBtn',
      title: '🥤 Make Each Session Your Own',
      text: 'Your category pairs a drink with your session. Use the swap button to choose another unlocked drink.',
      bullets: ['The drink builds during work and rests during breaks', 'Equipment adds Signature and Mastercraft finishes', 'Completed drinks become part of your focus history'], position: 'left',
    },
    // ── 6. Beans & Shop widget ─────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#shopSideWidget',
      title: '☕ Beans — Your Currency',
      text: 'Every minute of focus earns you beans. Completing goals and achievements earn bonus beans too.',
      bullets: [
        '⏱ 1 bean per minute focused',
        '🎯 +10 beans for completing a goal',
        '🏅 +25 beans per achievement unlocked',
        '🍅 +20 bonus beans for finishing a Pomodoro cycle',
      ],
      position: 'left',
    },

    // ── 7. Shop page ───────────────────────────────────────────────────────────
    {
      page: 'shop',
      target: '.chalk-header',
      title: '🛒 The Shop — Daily Specials & Mystery Brews',
      text: 'Spend your beans here. The shop has two sections — daily deals and a gacha roll system.',
      bullets: [
        '🎲 4 daily slots refresh every midnight UTC — drinks & equipment at fixed prices',
        '💎 Rarity tiers: Common → Uncommon → Rare → Epic → Legendary',
        '🎰 Mystery Brews — roll ×1 for 30 beans or ×10 for 250 (50 beans saved!)',
        '🔧 Equipment unlocks Signature & Mastercraft recipe stages for your drinks',
      ],
      position: 'bottom',
    },

    {
      page: 'shop', target: '.roll-panel-title', fallback: '.roll-panel-header',
      title: '🎲 Mystery Brews', text: 'Choose a single roll or a bundle to discover collectible drinks.',
      bullets: ['Check the bean cost before rolling', 'Duplicate drinks return some beans', 'Daily specials offer a direct purchase instead'], position: 'top',
    },
    // ── 8. My Collection ───────────────────────────────────────────────────────
    {
      tab: 'collection',
      target: '.col-header',
      fallback: '.tab-btn[data-tab="collection"]',
      title: '🍵 My Collection',
      text: 'Every drink you\'ve unlocked lives here — organised by rarity tier on wooden shelves.',
      bullets: [
        '🟤 Common → 🟢 Uncommon → 🔵 Rare → 🟣 Epic → 🌟 Legendary',
        '27 drinks to collect across the whole game',
        '🔒 Locked drinks show as ??? — a hint of what\'s waiting',
        '👑 Each drink has 3 recipe stages: House → Signature → Mastercraft',
      ],
      position: 'top',

    },

    // ── 9. Deadlines ───────────────────────────────────────────────────────────
    {
      tab: 'deadlines',
      target: '.deadlines-header h2',
      fallback: '.tab-btn[data-tab="deadlines"]',
      title: '📅 Deadlines & Overdue Streak',
      text: 'Every goal with a deadline shows here with a live urgency colour. Miss too many and your XP starts dropping.',
      bullets: [
        '🟢 Safe · 🟡 Soon (≤3 days) · 🟠 Urgent (≤1 day) · 🔴 Overdue',
        '⚡ Early Shift adds a buffer before your actual deadlines',
        '⚠️ Streak 1–2: −5 XP · Streak 5+: −35 XP per overdue goal',
        '💪 Completing a late goal still earns 50% Redemption XP',
      ],
      position: 'top',
    },

    // ── 10. Stats & XP ─────────────────────────────────────────────────────────
    {
      tab: 'stats',
      target: '#xpRankBadge',
      fallback: '.tab-btn[data-tab="stats"]',
      title: '📊 Stats & Barista Rank',
      text: 'Track your focus journey and watch your barista rank climb.',
      bullets: [
        '☕ XP for every minute focused, goal completed, and session finished',
        '🏅 10 ranks: Café Newcomer → Legend of the Brew',
        '📈 7-day bar chart of daily focus time',
        '☕ Drink Shelf — every completed session adds a mini cup to your wall',
      ],
      position: 'top',
    },

    // ── 11. Achievements ───────────────────────────────────────────────────────
    {
      tab: 'achievements',
      target: '#achievementsTabContent h2',
      fallback: '.tab-btn[data-tab="achievements"]',
      title: '🏅 Achievements',
      text: '30 achievements across 6 categories. Each one gives bonus XP and beans when unlocked.',
      bullets: [
        '🔥 Streak — 3, 7, 14, 30-day focus streaks',
        '⏱ Focus Time — 1h, 5h, 10h, 25h total focused',
        '🍅 Pomodoro — first cycle, 10 cycles, 50 cycles',
        '⏰ Deadlines — complete goals on time, recover from overdue streaks',
      ],
      position: 'top',
    },

    // ── 12. Categories ─────────────────────────────────────────────────────────
    {
      tab: 'categories',
      target: '.cat-tab-header',
      fallback: '.tab-btn[data-tab="categories"]',
      title: '🏷️ Categories',
      text: 'Categories give your goals a colour and a matching drink for your focus sessions.',
      bullets: [
        '🎨 Pick any colour — shows on goal cards, filter pills, and board bills',
        '🥤 Pair a drink — that drink fills during sessions using this category',
        '6 defaults (Study, Work, Fitness, Creative, Personal, Other) — add your own',
        '🔍 Filter your goal list by one or more categories at once',
      ],
      position: 'top',
    },

    // ── 13. Music & Sounds ─────────────────────────────────────────────────────
    {
      tab: 'music',
      target: '.music-setup-header',
      fallback: '.tab-btn[data-tab="music"]',
      title: '🎵 Ambient Sounds',
      text: 'Preview and layer ambient sounds here. Your active sounds carry over into the timer, where you can adjust their volume.',
      bullets: [
        '☕ Café — barista + keyboard + writing',
        '🌧 Rainy Day — soft rain + thunder + wind',
        '🌲 Forest — forest + wind + fireplace',
        '🎧 Deep Work — AC hum + keyboard + soft rain',
      ],
      position: 'top',
    },

    {
      tab: 'goals', target: '#goalSettingsBtn', title: '💾 Keep a Backup',
      text: 'The settings gear beside your goal controls contains Export Data and Import Data.',
      bullets: ['Export a backup before switching browsers or devices', 'Import a saved file to restore your data'], position: 'bottom',
    },
    {
      tab: 'goals', target: '#enterCodeBtn', title: '🎟️ Redeem a Café Treat',
      text: 'Have a promo code? Enter Code beside the shop lets you redeem it.',
      bullets: ['Check your collection after unlocking a new drink', 'Pair unlocked drinks with categories for future sessions'], position: 'left',
    },
    // ── 14. Help button / finish ────────────────────────────────────────────────
    {
      tab: 'goals',
      target: '#helpBtn',
      title: '❓ Replay This Tour Anytime',
      text: 'Click the ? button any time to restart this tour from step 1. A few keyboard shortcuts to remember on the timer page:',
      bullets: [
        'Space — pause / resume timer',
        'R — reset timer',
        'Esc — go back to goals',
        'Click any HH / MM / SS digit — edit inline',
      ],
      position: 'bottom',
      isLast: true,
    },
  ];

  let currentStep = 0, overlay = null, frame = 0, observer = null, saved = null;
  const pageIds = ['mainPage', 'shopPage', 'timerPage'];
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(n, Math.max(lo, hi)));

  // Score every side before clamping; clamping first used to prevent flipping.
  function placeCard(rect, width, height, viewport, preferred = 'bottom') {
    const { width: W, height: H } = viewport, margin = 12, gap = 16;
    if (!rect) return { x: (W-width)/2, y: Math.max(margin,(H-height)/2), side: 'center' };
    const cx = (rect.left+rect.right-width)/2, cy = (rect.top+rect.bottom-height)/2;
    const positions = { bottom:[cx,rect.bottom+gap], top:[cx,rect.top-height-gap], right:[rect.right+gap,cy], left:[rect.left-width-gap,cy] };
    return Object.entries(positions).map(([side,[x,y]]) => {
      const px = clamp(x,margin,W-width-margin), py = clamp(y,margin,H-height-margin);
      const overlap = Math.max(0,Math.min(px+width,rect.right)-Math.max(px,rect.left)) * Math.max(0,Math.min(py+height,rect.bottom)-Math.max(py,rect.top));
      return { x:px, y:py, side, score: overlap*100 + Math.abs(x-px)+Math.abs(y-py)+(side===preferred?0:8) };
    }).sort((a,b)=>a.score-b.score)[0];
  }
  function switchTab(name) {
    const btn = document.querySelector(`.tab-btn[data-tab="${name}"]`);
    if (btn && !btn.classList.contains('active')) btn.click();
  }
  function targetFor(step) {
    for (const selector of [step.target,step.fallback]) {
      const el = selector && document.querySelector(selector);
      if (el && el.getClientRects().length && el.getBoundingClientRect().width > 0) return el;
    }
    return null;
  }
  function scheduleLayout(event) {
    if (event?.target instanceof Node && overlay?.contains(event.target)) return;
    if (!overlay || frame) return;
    frame = requestAnimationFrame(()=>{ frame=0; positionSpotlight(); });
  }
  function positionSpotlight() {
    if (!overlay) return;
    const step = STEPS[currentStep], el = targetFor(step), tip = overlay.querySelector('#tourTooltip');
    const W = document.documentElement.clientWidth, H = window.innerHeight;
    tip.style.width = `${Math.min(380,W-24)}px`;
    tip.style.maxHeight = `${H-24}px`;
    let tipH = tip.offsetHeight; const tipW = tip.offsetWidth;
    let rect = null;
    if (el) {
      const r = el.getBoundingClientRect(), pad = 8;
      if (r.bottom>0 && r.top<H && r.right>0 && r.left<W) rect = { left:clamp(r.left-pad,0,W), right:clamp(r.right+pad,0,W), top:clamp(r.top-pad,0,H), bottom:clamp(r.bottom+pad,0,H) };
    }
    const mask = overlay.querySelector('#tourMask'), ring = overlay.querySelector('#tourHighlight');
    mask.setAttribute('viewBox',`0 0 ${W} ${H}`);
    let path = `M0 0H${W}V${H}H0Z`;
    ring.style.display = rect ? 'block':'none';
    if (rect) {
      const {left:l,right:r,top:t,bottom:b}=rect, k=Math.min(12,(r-l)/2,(b-t)/2);
      path += ` M${l+k} ${t}H${r-k}Q${r} ${t} ${r} ${t+k}V${b-k}Q${r} ${b} ${r-k} ${b}H${l+k}Q${l} ${b} ${l} ${b-k}V${t+k}Q${l} ${t} ${l+k} ${t}Z`;
      Object.assign(ring.style,{left:`${l}px`,top:`${t}px`,width:`${r-l}px`,height:`${b-t}px`});
    }
    mask.firstElementChild.setAttribute('d',path);
    let pos = placeCard(rect,tipW,tipH,{width:W,height:H},step.position);
    if (rect && pos.score >= 100) {
      const available = Math.max(rect.top-28,H-rect.bottom-28);
      if (available >= 220 && available < tipH) {
        tip.style.maxHeight=`${available}px`;tipH=tip.offsetHeight;
        pos=placeCard(rect,tipW,tipH,{width:W,height:H},step.position);
      }
    }
    tip.style.left=`${pos.x}px`; tip.style.top=`${pos.y}px`;
    tip.dataset.side=pos.side;
    overlay.classList.add('tour-ready');
  }
  function showStep(idx) {
    if (!overlay) return;
    currentStep=clamp(idx,0,STEPS.length-1);
    const step=STEPS[currentStep];
    sessionStorage.setItem(SESSION_KEY,String(currentStep));
    const page = step.page==='shop'?'shopPage':step.page==='timer'?'timerPage':'mainPage';
    pageIds.forEach(id=>document.getElementById(id)?.classList.toggle('hidden',id!==page));
    if (page==='shopPage' && typeof ShopModule!=='undefined') ShopModule.renderShopTab();
    if (step.tab) switchTab(step.tab);
    overlay.querySelector('#tourStepCounter').textContent=`YOUR CAFÉ GUIDE · ${currentStep+1} OF ${STEPS.length}`;
    overlay.querySelector('#tourTitle').textContent=step.title;
    overlay.querySelector('#tourText').textContent=step.text;
    const bullets=overlay.querySelector('#tourBullets'); bullets.replaceChildren();
    (step.bullets||[]).forEach(text=>{const li=document.createElement('li');li.className='tour-bullet';li.textContent=text;bullets.append(li);});
    overlay.querySelector('#tourPrev').disabled=currentStep===0;
    overlay.querySelector('#tourNext').textContent=currentStep===STEPS.length-1?'Finish tour ✓':'Next →';
    overlay.querySelector('#tourProgress').style.width=`${(currentStep+1)/STEPS.length*100}%`;
    overlay.querySelectorAll('.tour-dot').forEach((dot,i)=>{
      dot.classList.toggle('active',i===currentStep);
      dot.setAttribute('aria-current',i===currentStep?'step':'false');
    });
    observer?.disconnect();
    const target=targetFor(step);
    // Scroll first, then measure. Small screens reserve the top half for the target.
    if (target) {
      target.scrollIntoView({block:'start',inline:'nearest',behavior:'instant'});
      if (window.innerWidth<700) window.scrollBy({top:-24,behavior:'instant'});
      observer?.observe(target);
    }
    observer?.observe(overlay.querySelector('#tourTooltip'));
    positionSpotlight(); scheduleLayout();
  }
  function onKey(e) {
    if (!overlay) return;
    if (['Escape','ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Tab',' '].includes(e.key)) e.stopImmediatePropagation();
    if (e.key==='Escape') {e.preventDefault();stop();}
    else if (['ArrowRight','ArrowDown'].includes(e.key)) {e.preventDefault();next();}
    else if (['ArrowLeft','ArrowUp'].includes(e.key)) {e.preventDefault();showStep(currentStep-1);}
    else if (e.key==='Tab') {
      const buttons=[...overlay.querySelectorAll('button:not(:disabled)')];
      const index=buttons.indexOf(document.activeElement);
      if (index<0 || (e.shiftKey && index===0) || (!e.shiftKey && index===buttons.length-1)) {
        e.preventDefault();buttons[e.shiftKey?buttons.length-1:0].focus();
      }
    }
  }
  function next() { if(currentStep===STEPS.length-1) stop(); else showStep(currentStep+1); }
  function start(fromStep=0) {
    if (overlay) return;
    saved={ focus:document.activeElement, scrollX:window.scrollX, scrollY:window.scrollY, tab:document.querySelector('.tab-btn.active')?.dataset.tab,
      scrolls:[...document.querySelectorAll('body *')].filter(el=>el.scrollHeight>el.clientHeight || el.scrollWidth>el.clientWidth).map(el=>[el,el.scrollLeft,el.scrollTop]),
      pages:pageIds.map(id=>({id,hidden:document.getElementById(id)?.classList.contains('hidden')})), inert:[] };
    overlay=document.createElement('div');overlay.id='tourOverlay';
    overlay.innerHTML=`<svg id="tourMask" aria-hidden="true" preserveAspectRatio="none"><path fill-rule="evenodd"/></svg>
      <div id="tourHighlight" aria-hidden="true"></div>
      <section id="tourTooltip" class="tour-tooltip" role="dialog" aria-modal="true" aria-labelledby="tourTitle" aria-describedby="tourText">
        <div class="tour-progress-track" aria-hidden="true"><div id="tourProgress"></div></div>
        <div id="tourStepCounter" class="tour-tooltip-step"></div>
        <div class="tour-copy"><div aria-live="polite" aria-atomic="true"><h2 id="tourTitle" class="tour-tooltip-title"></h2><p id="tourText" class="tour-tooltip-text"></p></div>
        <ul id="tourBullets" class="tour-bullets"></ul></div>
        <div class="tour-tooltip-actions"><button id="tourSkip" class="tour-btn-skip">Close tour</button><div class="tour-btn-row"><button id="tourPrev" class="tour-btn-prev">← Back</button><button id="tourNext" class="tour-btn-next">Next →</button></div></div>
        <nav id="tourDots" class="tour-dots" aria-label="Tour steps"></nav>
      </section>`;
    document.body.append(overlay);
    [...document.body.children].filter(el=>el!==overlay && !['SCRIPT','STYLE','LINK'].includes(el.tagName)).forEach(el=>{saved.inert.push([el,el.inert]);el.inert=true;});
    STEPS.forEach((step,i)=>{const dot=document.createElement('button');dot.className='tour-dot';dot.setAttribute('aria-label',`Step ${i+1}: ${step.title}`);dot.title=step.title;dot.onclick=()=>showStep(i);overlay.querySelector('#tourDots').append(dot);});
    overlay.querySelector('#tourSkip').onclick=()=>stop();
    overlay.querySelector('#tourPrev').onclick=()=>showStep(currentStep-1);
    overlay.querySelector('#tourNext').onclick=next;
    observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(scheduleLayout):null;
    window.addEventListener('resize',scheduleLayout);
    window.addEventListener('scroll',scheduleLayout,true);
    window.visualViewport?.addEventListener('resize',scheduleLayout);
    document.addEventListener('keydown',onKey,true);
    showStep(Number.isInteger(fromStep)?fromStep:0);
    overlay.querySelector('#tourNext').focus({preventScroll:true});
  }
  function stop() {
    if (!overlay) return;
    cancelAnimationFrame(frame);frame=0;observer?.disconnect();observer=null;
    window.removeEventListener('resize',scheduleLayout);window.removeEventListener('scroll',scheduleLayout,true);
    window.visualViewport?.removeEventListener('resize',scheduleLayout);
    document.removeEventListener('keydown',onKey,true);
    overlay.remove();overlay=null;
    saved.inert.forEach(([el,value])=>el.inert=value);
    if(saved.tab) switchTab(saved.tab);
    saved.pages.forEach(({id,hidden})=>document.getElementById(id)?.classList.toggle('hidden',hidden));
    saved.scrolls.forEach(([el,left,top])=>el.scrollTo({left,top,behavior:'instant'}));
    window.scrollTo({left:saved.scrollX,top:saved.scrollY,behavior:'instant'});
    saved.focus?.focus({preventScroll:true});saved=null;
    localStorage.setItem(STORAGE_KEY,'1');sessionStorage.removeItem(SESSION_KEY);
  }
  function init() {
    document.getElementById('helpBtn')?.addEventListener('click',()=>start(0));
    if (!localStorage.getItem(STORAGE_KEY)) {
      const resume=Number(sessionStorage.getItem(SESSION_KEY)||0);
      setTimeout(()=>{if(!overlay && !localStorage.getItem(STORAGE_KEY)) start(resume);},800);
    }
  }
  return { init, start, stop };
})();
