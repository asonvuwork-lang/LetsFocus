// =============================================
// XP & LEVELING MODULE
// =============================================
const XPModule = (function () {

  const STORAGE_KEY = 'letsfocus_xp';
  const DAILY_CAP = 150;

  const RANKS = [
    { level: 1,  name: 'Café Newcomer',    icon: '☕',  xp: 0    },
    { level: 2,  name: 'Kitchen Helper',   icon: '🧼',  xp: 100  },
    { level: 3,  name: 'Milk Frother',     icon: '🥛',  xp: 250  },
    { level: 4,  name: 'Junior Barista',   icon: '☕',  xp: 500  },
    { level: 5,  name: 'Latte Artist',     icon: '🎨',  xp: 900  },
    { level: 6,  name: 'Senior Barista',   icon: '🏆',  xp: 1400 },
    { level: 7,  name: 'Head Barista',     icon: '⭐',  xp: 2000 },
    { level: 8,  name: 'Café Manager',     icon: '🌟',  xp: 3000 },
    { level: 9,  name: 'Master Roaster',   icon: '👑',  xp: 4500 },
    { level: 10, name: 'Legend of the Brew', icon: '🔥', xp: 7000 },
  ];

  const ACHIEVEMENTS = [
    // STREAK
    { id: 'first_step',       icon: '👣', name: 'First Step',        desc: 'Complete your first focus session',            category: 'Streak',      xp: 20,  max: 1,   progress: d => Math.min(d.sessionsCompleted||0,1),             check: d => (d.sessionsCompleted||0)>=1 },
    { id: 'warm_up',          icon: '🌤', name: 'Warm Up',           desc: 'Reach a 3-day focus streak',                   category: 'Streak',      xp: 30,  max: 3,   progress: d => Math.min(d.streak||0,3),                        check: d => (d.streak||0)>=3 },
    { id: 'on_fire',          icon: '🔥', name: 'On Fire',           desc: 'Reach a 7-day focus streak',                   category: 'Streak',      xp: 50,  max: 7,   progress: d => Math.min(d.streak||0,7),                        check: d => (d.streak||0)>=7 },
    { id: 'unstoppable',      icon: '💥', name: 'Unstoppable',       desc: 'Reach a 14-day focus streak',                  category: 'Streak',      xp: 80,  max: 14,  progress: d => Math.min(d.streak||0,14),                       check: d => (d.streak||0)>=14 },
    { id: 'legendary_streak', icon: '🌠', name: 'Legendary',         desc: 'Reach a 30-day focus streak',                  category: 'Streak',      xp: 150, max: 30,  progress: d => Math.min(d.streak||0,30),                       check: d => (d.streak||0)>=30 },
    // GOALS
    { id: 'getting_started',  icon: '🌱', name: 'Getting Started',   desc: 'Complete your first goal',                     category: 'Goals',       xp: 20,  max: 1,   progress: d => Math.min(d.goalsCompleted||0,1),                check: d => (d.goalsCompleted||0)>=1 },
    { id: 'goal_getter',      icon: '🎯', name: 'Goal Getter',       desc: 'Complete 10 goals',                            category: 'Goals',       xp: 40,  max: 10,  progress: d => Math.min(d.goalsCompleted||0,10),               check: d => (d.goalsCompleted||0)>=10 },
    { id: 'overachiever',     icon: '🚀', name: 'Overachiever',      desc: 'Complete 25 goals',                            category: 'Goals',       xp: 70,  max: 25,  progress: d => Math.min(d.goalsCompleted||0,25),               check: d => (d.goalsCompleted||0)>=25 },
    { id: 'century',          icon: '💯', name: 'Century',           desc: 'Complete 50 goals',                            category: 'Goals',       xp: 100, max: 50,  progress: d => Math.min(d.goalsCompleted||0,50),               check: d => (d.goalsCompleted||0)>=50 },
    { id: 'legend_goals',     icon: '🏅', name: 'Legend',            desc: 'Complete 100 goals',                           category: 'Goals',       xp: 200, max: 100, progress: d => Math.min(d.goalsCompleted||0,100),              check: d => (d.goalsCompleted||0)>=100 },
    { id: 'speed_run',        icon: '⚡', name: 'Speed Run',         desc: 'Complete 3 goals in one day',                  category: 'Goals',       xp: 50,  max: 3,   progress: d => Math.min(d.goalsToday||0,3),                    check: d => (d.goalsToday||0)>=3 },
    { id: 'perfect_week',     icon: '📆', name: 'Perfect Week',      desc: 'Complete at least one goal for 7 days in a row',category: 'Goals',       xp: 100, max: 7,   progress: d => Math.min(d.weeklyGoalDays||0,7),                check: d => (d.weeklyGoalDays||0)>=7 },
    { id: 'subgoal_champ',    icon: '🔗', name: 'Sub-goal Champion', desc: 'Complete 20 goals with all sub-goals finished', category: 'Goals',       xp: 80,  max: 20,  progress: d => Math.min(d.fullSubgoalGoals||0,20),             check: d => (d.fullSubgoalGoals||0)>=20 },
    { id: 'category_master',  icon: '🏷️', name: 'Category Master',  desc: 'Complete 10 goals in the same category',       category: 'Goals',       xp: 60,  max: 10,  progress: d => Math.min(d.categoryMasterCount||0,10),          check: d => (d.categoryMasterCount||0)>=10 },
    { id: 'scholar',          icon: '📚', name: 'Scholar',           desc: 'Complete 20 Study goals',                      category: 'Goals',       xp: 60,  max: 20,  progress: d => Math.min(d.studyGoalsDone||0,20),               check: d => (d.studyGoalsDone||0)>=20 },
    // FOCUS TIME
    { id: 'first_brew',       icon: '🫖', name: 'First Brew',        desc: 'Complete your first focus session',            category: 'Focus Time',  xp: 20,  max: 1,   progress: d => Math.min(d.sessionsCompleted||0,1),             check: d => (d.sessionsCompleted||0)>=1 },
    { id: 'deep_focus',       icon: '🧠', name: 'Deep Focus',        desc: 'Accumulate 1 hour of focus time',              category: 'Focus Time',  xp: 30,  max: 60,  progress: d => Math.min(Math.floor((d.totalFocusSeconds||0)/60),60), check: d => (d.totalFocusSeconds||0)>=3600 },
    { id: 'marathon',         icon: '🏃', name: 'Marathon',          desc: 'Accumulate 5 hours of focus time',             category: 'Focus Time',  xp: 60,  max: 300, progress: d => Math.min(Math.floor((d.totalFocusSeconds||0)/60),300), check: d => (d.totalFocusSeconds||0)>=18000 },
    { id: 'iron_will',        icon: '🔩', name: 'Iron Will',         desc: 'Accumulate 10 hours of focus time',            category: 'Focus Time',  xp: 100, max: 600, progress: d => Math.min(Math.floor((d.totalFocusSeconds||0)/60),600), check: d => (d.totalFocusSeconds||0)>=36000 },
    { id: 'barista_life',     icon: '☕', name: 'Barista Life',      desc: 'Accumulate 25 hours of focus time',            category: 'Focus Time',  xp: 180, max: 1500,progress: d => Math.min(Math.floor((d.totalFocusSeconds||0)/60),1500),check: d => (d.totalFocusSeconds||0)>=90000 },
    // POMODORO
    { id: 'tomato_timer',     icon: '🍅', name: 'Tomato Timer',      desc: 'Complete your first Pomodoro cycle',           category: 'Pomodoro',    xp: 25,  max: 1,   progress: d => Math.min(d.pomoCycles||0,1),                    check: d => (d.pomoCycles||0)>=1 },
    { id: 'pomo_pro',         icon: '🍅', name: 'Pomodoro Pro',      desc: 'Complete 10 full Pomodoro cycles',             category: 'Pomodoro',    xp: 50,  max: 10,  progress: d => Math.min(d.pomoCycles||0,10),                   check: d => (d.pomoCycles||0)>=10 },
    { id: 'tomato_farm',      icon: '🌿', name: 'Tomato Farm',       desc: 'Complete 50 full Pomodoro cycles',             category: 'Pomodoro',    xp: 120, max: 50,  progress: d => Math.min(d.pomoCycles||0,50),                   check: d => (d.pomoCycles||0)>=50 },
    // TIME OF DAY
    { id: 'early_bird',       icon: '🌅', name: 'Early Bird',        desc: 'Complete 5 sessions before noon',              category: 'Time of Day', xp: 40,  max: 5,   progress: d => Math.min(d.earlyBirdSessions||0,5),             check: d => (d.earlyBirdSessions||0)>=5 },
    { id: 'night_owl',        icon: '🌙', name: 'Night Owl',         desc: 'Complete 5 sessions after 9pm',                category: 'Time of Day', xp: 40,  max: 5,   progress: d => Math.min(d.nightSessions||0,5),                 check: d => (d.nightSessions||0)>=5 },
    { id: 'all_day',          icon: '🌞', name: 'All Day',           desc: 'Focus before noon and after 6pm on same day',  category: 'Time of Day', xp: 60,  max: 1,   progress: d => d.allDayAchiever?1:0,                           check: d => d.allDayAchiever===true },
    // DEADLINES
    { id: 'sharpshooter',     icon: '🎯', name: 'Sharpshooter',      desc: 'Complete 5 goals before their deadline',       category: 'Deadlines',   xp: 50,  max: 5,   progress: d => Math.min(d.onTimeGoals||0,5),                   check: d => (d.onTimeGoals||0)>=5 },
    { id: 'deadline_crusher', icon: '⏰', name: 'Deadline Crusher',   desc: 'Complete 20 goals before their deadline',      category: 'Deadlines',   xp: 100, max: 20,  progress: d => Math.min(d.onTimeGoals||0,20),                  check: d => (d.onTimeGoals||0)>=20 },
    { id: 'comeback_kid',     icon: '💪', name: 'Comeback Kid',       desc: 'Complete a goal after a 3+ overdue streak',    category: 'Deadlines',   xp: 60,  max: 1,   progress: d => d.comebackKid?1:0,                              check: d => d.comebackKid===true },
    { id: 'redemption_arc',   icon: '🌈', name: 'Redemption Arc',     desc: 'Complete 5 overdue goals (better late!)',      category: 'Deadlines',   xp: 80,  max: 5,   progress: d => Math.min(d.lateGoalsCompleted||0,5),            check: d => (d.lateGoalsCompleted||0)>=5 },
  ];

  const CATEGORIES = ['All', 'Streak', 'Goals', 'Focus Time', 'Pomodoro', 'Time of Day', 'Deadlines'];

  function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); } catch(e) { return {}; } }
  function save(d) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
      document.dispatchEvent(new CustomEvent('letsfocus:datasave', { detail: { key: STORAGE_KEY } }));
    } catch(e) {}
  }
  function todayKey() { return new Date().toISOString().slice(0,10); }

  function getRank(xp) { let r=RANKS[0]; for(const rr of RANKS){if(xp>=rr.xp)r=rr;else break;} return r; }
  function getNextRank(xp) { for(const r of RANKS){if(xp<r.xp)return r;} return null; }

  function addXP(amount, reason, data) {
    const key = todayKey();
    if (!data.dailyXP) data.dailyXP = {};
    const todayEarned = data.dailyXP[key]||0;
    const isBonus = reason.includes('BONUS')||reason.includes('streak')||reason.includes('Pomodoro');
    const eff = (!isBonus && amount>0) ? Math.min(amount,Math.max(0,DAILY_CAP-todayEarned)) : amount;
    if (eff===0 && amount>0 && !isBonus) { logXP(data,0,reason+' (daily cap reached)'); return; }
    data.totalXP = Math.max(0,(data.totalXP||0)+eff);
    if (!isBonus && eff>0) data.dailyXP[key] = todayEarned+eff;
    logXP(data,eff,reason);
  }

  function logXP(data, amount, reason) {
    if (!data.xpLog) data.xpLog=[];
    data.xpLog.unshift({amount,reason,date:new Date().toISOString()});
    data.xpLog=data.xpLog.slice(0,200);
  }

  function onSessionComplete(elapsedSeconds, isPomodoroCycle, goalName) {
    const data=load(); const oldXP=data.totalXP||0; const oldRank=getRank(oldXP);
    const mins=Math.floor(elapsedSeconds/60);
    addXP(mins,'Focus session ('+mins+' min)',data);
    data.totalFocusSeconds=(data.totalFocusSeconds||0)+elapsedSeconds;
    data.sessionsCompleted=(data.sessionsCompleted||0)+1;
    const key=todayKey();
    if (!data.lastSessionDate||data.lastSessionDate!==key) addXP(15,'First session of the day BONUS',data);
    data.lastSessionDate=key;
    const hour=new Date().getHours();
    if (hour<12){data.earlyBirdSessions=(data.earlyBirdSessions||0)+1;data.todayEarlySession=true;}
    if (hour>=21) data.nightSessions=(data.nightSessions||0)+1;
    if (hour>=18) data.todayEveningSession=true;
    if (data.todayEarlySession&&data.todayEveningSession) data.allDayAchiever=true;
    if (isPomodoroCycle){data.pomoCycles=(data.pomoCycles||0)+1;addXP(50,'Full Pomodoro cycle BONUS',data);}
    save(data); checkLevelUp(oldRank,data); checkAchievements(data); refreshUI();
    if(typeof ShopModule!=='undefined'){
      const _key=todayKey();
      ShopModule.awardBeans(mins,'focus session');
      if(!data._lastBeanSession||data._lastBeanSession!==_key){ShopModule.awardBeans(10,'first session today');data._lastBeanSession=_key;save(data);}
      if(isPomodoroCycle)ShopModule.awardBeans(20,'Pomodoro cycle');
    }
  }

  function onGoalComplete(goal, isLate, overdueStreak) {
    const data=load(); const oldXP=data.totalXP||0; const oldRank=getRank(oldXP);
    data.goalsCompleted=(data.goalsCompleted||0)+1;
    if (isLate){
      addXP(10,'Goal completed (late redemption): '+goal.text,data);
      data.overdueStreak=0; data.lateGoalsCompleted=(data.lateGoalsCompleted||0)+1;
      if ((overdueStreak||0)>=3) data.comebackKid=true;
    } else {
      addXP(20,'Goal completed: '+goal.text,data);
    }
    if (goal.category==='Study') data.studyGoalsDone=(data.studyGoalsDone||0)+1;
    if (goal.category){
      if (!data.categoryCount) data.categoryCount={};
      data.categoryCount[goal.category]=(data.categoryCount[goal.category]||0)+1;
      data.categoryMasterCount=Math.max(...Object.values(data.categoryCount));
    }
    if (goal.deadline&&!isLate){data.onTimeGoals=(data.onTimeGoals||0)+1;addXP(15,'Completed before deadline BONUS: '+goal.text,data);}
    if (goal.subgoals&&goal.subgoals.length>0&&goal.subgoals.every(s=>s.completed)){addXP(15,'All sub-goals completed BONUS',data);data.fullSubgoalGoals=(data.fullSubgoalGoals||0)+1;}
    const key=todayKey();
    if (!data.goalsDateKey||data.goalsDateKey!==key){data.goalsToday=0;data.goalsDateKey=key;if(!data.goalDays)data.goalDays={};data.goalDays[key]=true;data.weeklyGoalDays=Object.keys(data.goalDays).sort().slice(-7).length;}
    data.goalsToday=(data.goalsToday||0)+1;
    save(data); checkLevelUp(oldRank,data); checkAchievements(data); refreshUI();
    if(typeof ShopModule!=='undefined')ShopModule.awardBeans(10,'goal completed');
  }

  function onOverdueDetected(overdueCount, currentStreak) {
    if (!overdueCount) return;
    const data=load(); const oldXP=data.totalXP||0; const oldRank=getRank(oldXP);
    const dpg=currentStreak>=7?35:currentStreak>=4?20:currentStreak>=2?10:5;
    addXP(-(overdueCount*dpg),''+overdueCount+' overdue goal'+(overdueCount>1?'s':'')+' (streak: '+currentStreak+')',data);
    data.overdueStreak=currentStreak;
    save(data); checkLevelUp(oldRank,data); refreshUI();
  }

  // Level up queue
  let levelUpQueue=[]; let levelUpPlaying=false;
  function checkLevelUp(oldRank,data){const nr=getRank(data.totalXP||0);if(nr.level>oldRank.level){levelUpQueue.push({oldRank,newRank:nr});if(!levelUpPlaying)drainLevelUpQueue();}}
  function drainLevelUpQueue(){if(!levelUpQueue.length){levelUpPlaying=false;return;}levelUpPlaying=true;const n=levelUpQueue.shift();const delay=document.getElementById('coffeeShopClosingOverlay')?5500:600;setTimeout(()=>showLevelUpAnimation(n.oldRank,n.newRank),delay);}

  function showLevelUpAnimation(oldRank,newRank){
    const o=document.createElement('div');o.id='levelUpOverlay';
    o.style.cssText='position:fixed;inset:0;z-index:25000;background:rgba(20,10,5,0);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;transition:background 0.8s ease;font-family:\'Playfair Display\',serif;';
    o.innerHTML=`<style>@keyframes rankReveal{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes beanRain{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}@keyframes lu-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}#lu-badge-wrap{perspective:600px}#lu-badge-inner{width:160px;height:160px;position:relative;transform-style:preserve-3d;transition:transform 0.8s cubic-bezier(0.4,0,0.2,1)}.lu-badge-face{position:absolute;inset:0;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;backface-visibility:hidden;border:4px solid rgba(212,165,116,0.6);box-shadow:0 8px 30px rgba(0,0,0,0.5)}#lu-face-old{background:radial-gradient(circle at 35% 35%,#5c4020,#2a1a0a);font-size:3.5rem;filter:brightness(0.6)}#lu-face-new{background:radial-gradient(circle at 35% 35%,#d4a574,#8b6f47);font-size:3.5rem;transform:rotateY(180deg);animation:lu-pulse 2s ease-in-out infinite}#lu-spotlight{position:fixed;top:0;left:50%;transform:translateX(-50%);width:300px;height:60vh;background:radial-gradient(ellipse at 50% 0%,rgba(212,165,116,0.18) 0%,transparent 70%);pointer-events:none;opacity:0;transition:opacity 1s ease}</style>
    <div id="lu-spotlight"></div>
    <div id="lu-badge-wrap"><div id="lu-badge-inner"><div class="lu-badge-face" id="lu-face-old"><span>${oldRank.icon}</span><span style="font-size:0.7rem;color:rgba(212,165,116,0.6);margin-top:6px;letter-spacing:1px">LV.${oldRank.level}</span></div><div class="lu-badge-face" id="lu-face-new"><span>${newRank.icon}</span><span style="font-size:0.7rem;color:rgba(255,255,255,0.8);margin-top:6px;letter-spacing:1px">LV.${newRank.level}</span></div></div></div>
    <div id="lu-text" style="text-align:center;opacity:0"><div style="font-size:0.75rem;color:rgba(212,165,116,0.7);letter-spacing:3px;text-transform:uppercase;margin-bottom:6px">Rank Up!</div><div style="font-size:1.8rem;color:#f5e8d0;font-weight:700">${newRank.icon} ${newRank.name}</div><div style="font-size:0.9rem;color:rgba(212,165,116,0.7);margin-top:8px;font-style:italic">You're brewing something great.</div></div>
    <button id="lu-continue" style="opacity:0;padding:13px 36px;border:none;border-radius:14px;background:linear-gradient(135deg,#d4a574,#8b6f47);color:#fff;font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(139,111,71,0.4);transition:all 0.2s ease">Continue ✓</button>`;
    document.body.appendChild(o);
    const bi=o.querySelector('#lu-badge-inner'),sp=o.querySelector('#lu-spotlight'),lt=o.querySelector('#lu-text'),lc=o.querySelector('#lu-continue');
    requestAnimationFrame(()=>{o.style.background='rgba(20,10,5,0.94)';});
    setTimeout(()=>{sp.style.opacity='1';},800);
    setTimeout(()=>{bi.style.transform='rotateY(180deg)';},1500);
    setTimeout(()=>{lt.style.animation='rankReveal 0.7s ease-out forwards';},2400);
    setTimeout(()=>spawnBeans(o),2800);
    setTimeout(()=>{lc.style.animation='rankReveal 0.5s ease-out forwards';},3400);
    lc.addEventListener('click',()=>{o.style.opacity='0';o.style.transition='opacity 0.4s ease';setTimeout(()=>{o.remove();drainLevelUpQueue();},400);});
  }

  function spawnBeans(o){
    ['☕','🫘','✨','⭐','🌟'].forEach(b=>{for(let i=0;i<4;i++){const el=document.createElement('div');el.textContent=b;el.style.cssText='position:fixed;top:-30px;left:'+(Math.random()*100)+'vw;font-size:'+(0.9+Math.random()*1.2)+'rem;pointer-events:none;z-index:25001;animation:beanRain '+(2+Math.random()*2)+'s ease-in '+(Math.random()*1.5)+'s forwards;';o.appendChild(el);el.addEventListener('animationend',()=>el.remove());}});
  }

  function checkAchievements(data){
    if(!data.unlockedAchievements)data.unlockedAchievements=[];
    const sr=JSON.parse(localStorage.getItem('letsfocus_stats')||'{}');
    const m={...data,streak:sr.streak||0,sessionsCompleted:sr.sessionsCompleted||(data.sessionsCompleted||0)};
    const nu=[];
    ACHIEVEMENTS.forEach(a=>{if(data.unlockedAchievements.includes(a.id))return;if(a.check(m)){data.unlockedAchievements.push(a.id);addXP(a.xp,'Achievement unlocked: '+a.name+' BONUS',data);nu.push(a);}});
    save(data);
    nu.forEach((a,i)=>setTimeout(()=>showAchievementToast(a),500+i*900));
    if(nu.length&&typeof ShopModule!=='undefined')ShopModule.awardBeans(25*nu.length,'achievement unlocked');
  }

  function showAchievementToast(ach){
    try{const ctx=new(window.AudioContext||window.webkitAudioContext)();[880,1100].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(0.25,ctx.currentTime+i*0.12);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.12+0.35);o.start(ctx.currentTime+i*0.12);o.stop(ctx.currentTime+i*0.12+0.35);});}catch(e){}
    const ex=document.querySelectorAll('.achievement-toast');
    const t=document.createElement('div');t.className='achievement-toast';t.style.top=(20+ex.length*96)+'px';
    t.innerHTML='<div class="ach-icon-panel"><div class="ach-foam-drip"></div><div class="ach-icon-inner">'+ach.icon+'</div></div><div class="ach-text-panel"><div class="ach-label">Achievement Unlocked!</div><div class="ach-name">'+ach.name+'</div><div class="ach-desc">+'+ach.xp+' XP</div></div>';
    document.body.appendChild(t);
    requestAnimationFrame(()=>{t.style.transform='translateX(0)';t.style.opacity='1';});
    t.addEventListener('click',()=>dismissToast(t));
    setTimeout(()=>dismissToast(t),4500);
  }

  function dismissToast(t){t.style.transform='translateX(120%)';t.style.opacity='0';setTimeout(()=>t.remove(),400);}

  function checkOverdueOnOpen(){
    const goals=JSON.parse(localStorage.getItem('goals')||'[]');
    const today=new Date();today.setHours(0,0,0,0);
    const data=load();const ts=todayKey();
    if(data.lastOverdueCheck===ts)return;
    const ov=goals.filter(g=>{if(!g.deadline||g.completed)return false;return new Date(g.deadline+'T00:00:00')<today;});
    if(ov.length>0){const s=(data.overdueStreak||0)+1;data.overdueStreak=s;data.lastOverdueCheck=ts;save(data);onOverdueDetected(ov.length,s);if(typeof GoalsModule!=='undefined')setTimeout(()=>GoalsModule.renderDeadlinesTab(),100);}
    else{data.lastOverdueCheck=ts;if((data.overdueStreak||0)>0)data.overdueStreak=0;save(data);}
  }

  function refreshUI(){renderXPBar();renderBadgeOnBoard();}

  function renderXPBar(){
    const data=load();const xp=data.totalXP||0;const rank=getRank(xp);const next=getNextRank(xp);
    const re=document.getElementById('xpRankBadge'),be=document.getElementById('xpProgressBar'),le=document.getElementById('xpProgressLabel'),ve=document.getElementById('xpCurrentValue');
    if(re)re.innerHTML='<div class="xp-rank-icon">'+rank.icon+'</div><div class="xp-rank-info"><div class="xp-rank-level">Level '+rank.level+'</div><div class="xp-rank-name">'+rank.name+'</div></div>';
    if(be&&next){const p=Math.round(((xp-rank.xp)/(next.xp-rank.xp))*100);be.style.width=p+'%';if(le)le.textContent=(xp-rank.xp)+' / '+(next.xp-rank.xp)+' XP to '+next.name;}
    else if(be){be.style.width='100%';if(le)le.textContent='🔥 Maximum rank achieved!';}
    if(ve)ve.textContent=xp+' XP';
  }

  function renderBadgeOnBoard(){
    const el=document.getElementById('billBoardBadge');if(!el)return;
    const data=load();const rank=getRank(data.totalXP||0);
    el.innerHTML='<span class="bb-badge-icon">'+rank.icon+'</span><span class="bb-badge-info">Lv.'+rank.level+' · '+rank.name+'</span>';
  }

  function renderXPLog(){
    const data=load();const log=data.xpLog||[];const ts=todayKey();
    const sda=new Date();sda.setDate(sda.getDate()-7);
    const c=document.getElementById('xpLogList'),tt=document.getElementById('xpLogTabToday'),wt=document.getElementById('xpLogTabWeek');
    if(!c)return;
    let at=c.dataset.activeTab||'today';
    function render(tab){
      c.dataset.activeTab=tab;tt?.classList.toggle('active',tab==='today');wt?.classList.toggle('active',tab==='week');
      const f=log.filter(e=>{const d=new Date(e.date);return tab==='today'?d.toISOString().slice(0,10)===ts:d>=sda;});
      c.innerHTML='';
      if(!f.length){c.innerHTML='<div class="xp-log-empty">No XP activity '+(tab==='today'?'today':'this week')+' yet</div>';return;}
      f.forEach(e=>{
        const r=document.createElement('div');r.className='xp-log-row '+(e.amount>0?'xp-gain':e.amount<0?'xp-loss':'xp-neutral');
        const tm=new Date(e.date).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
        const ds=new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric'});
        r.innerHTML='<span class="xp-log-amount">'+(e.amount>0?'+':'')+e.amount+' XP</span><span class="xp-log-reason">'+e.reason+'</span><span class="xp-log-time">'+(tab==='week'?ds+' ':'')+tm+'</span>';
        c.appendChild(r);
      });
    }
    render(at);
    // Tab listeners are wired once in init() to avoid stacking
  }

  function renderAchievementTab(){
    const container=document.getElementById('achievementsTabContent');if(!container)return;
    const data=load();const unlocked=data.unlockedAchievements||[];
    const sr=JSON.parse(localStorage.getItem('letsfocus_stats')||'{}');
    const merged={...data,streak:sr.streak||0};
    let activeFilter=container.dataset.activeFilter||'All';
    let activeShow=container.dataset.activeShow||'all';

    function rebuild(){
      container.innerHTML='';
      const header=document.createElement('div');
      header.className='ach-tab-header';
      const pct=Math.round(unlocked.length/ACHIEVEMENTS.length*100);
      header.innerHTML=`
        <div class="ach-tab-title-row">
          <h2 class="ach-tab-title">🏅 Achievements</h2>
          <div class="ach-tab-summary">
            <span class="ach-summary-count">${unlocked.length} / ${ACHIEVEMENTS.length} unlocked</span>
            <div class="ach-summary-bar-track"><div class="ach-summary-bar-fill" style="width:${pct}%"></div></div>
          </div>
        </div>
        <div class="ach-filter-row">
          <div class="ach-show-tabs">
            <button class="ach-show-tab ${activeShow==='all'?'active':''}" data-show="all">All</button>
            <button class="ach-show-tab ${activeShow==='unlocked'?'active':''}" data-show="unlocked">✓ Unlocked</button>
            <button class="ach-show-tab ${activeShow==='locked'?'active':''}" data-show="locked">🔒 Locked</button>
          </div>
        </div>
        <div class="ach-cat-filter">
          ${CATEGORIES.map(c=>`<button class="ach-cat-btn ${c===activeFilter?'active':''}" data-cat="${c}">${c}</button>`).join('')}
        </div>`;
      container.appendChild(header);

      header.querySelectorAll('.ach-show-tab').forEach(b=>b.addEventListener('click',()=>{activeShow=b.dataset.show;container.dataset.activeShow=activeShow;rebuild();}));
      header.querySelectorAll('.ach-cat-btn').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.cat;container.dataset.activeFilter=activeFilter;rebuild();}));

      let list=ACHIEVEMENTS;
      if(activeFilter!=='All')list=list.filter(a=>a.category===activeFilter);
      if(activeShow==='unlocked')list=list.filter(a=>unlocked.includes(a.id));
      if(activeShow==='locked')list=list.filter(a=>!unlocked.includes(a.id));

      const grid=document.createElement('div');grid.className='ach-tab-grid';
      if(!list.length){grid.innerHTML='<div class="ach-tab-empty">No achievements in this filter yet — keep going!</div>';}
      list.forEach(ach=>{
        const isU=unlocked.includes(ach.id);
        const prog=ach.progress(merged);
        const pct=Math.min(100,Math.round((prog/ach.max)*100));
        const card=document.createElement('div');card.className='ach-tab-card '+(isU?'ach-tab-unlocked':'ach-tab-locked');
        card.innerHTML=`
          <div class="ach-tab-card-icon">${ach.icon}</div>
          <div class="ach-tab-card-body">
            <div class="ach-tab-card-name">${ach.name}</div>
            <div class="ach-tab-card-cat">${ach.category}</div>
            <div class="ach-tab-card-desc">${ach.desc}</div>
            <div class="ach-tab-card-progress">
              <div class="ach-tab-prog-track">
                <div class="ach-tab-prog-fill ${isU?'done':''}" style="width:${pct}%"></div>
              </div>
              <div class="ach-tab-prog-label">${isU?'✓ Complete':prog+' / '+ach.max}</div>
            </div>
          </div>
          <div class="ach-tab-card-xp">+${ach.xp}<span class="ach-tab-xp-label">XP</span>${isU?'<div class="ach-tab-done-check">✓</div>':''}</div>`;
        grid.appendChild(card);
      });
      container.appendChild(grid);
    }
    rebuild();
  }

  function renderAchievements(){
    const data=load();const unlocked=data.unlockedAchievements||[];
    const el=document.getElementById('achievementsList');if(!el)return;
    el.innerHTML='';
    ACHIEVEMENTS.slice(0,6).forEach(ach=>{
      const isU=unlocked.includes(ach.id);
      const card=document.createElement('div');card.className='achievement-card '+(isU?'unlocked':'locked');
      card.innerHTML='<div class="achievement-card-icon">'+ach.icon+'</div><div class="achievement-card-info"><div class="achievement-card-name">'+ach.name+'</div><div class="achievement-card-desc">'+ach.desc+'</div></div>'+(isU?'<div class="achievement-card-check">✓</div>':'<div class="achievement-card-lock">🔒</div>');
      el.appendChild(card);
    });
    const link=document.createElement('div');link.style.cssText='text-align:center;margin-top:10px;';
    link.innerHTML='<button onclick="document.querySelector(\'.tab-btn[data-tab=\\\'achievements\\\']\').click()" style="background:none;border:none;color:#8b6f47;font-family:\'Playfair Display\',serif;font-size:0.85rem;cursor:pointer;text-decoration:underline;">View all '+ACHIEVEMENTS.length+' achievements →</button>';
    el.appendChild(link);
  }

  function getOverdueStreak(){return load().overdueStreak||0;}

  function init(){
    checkOverdueOnOpen();
    setTimeout(refreshUI,200);
    setTimeout(()=>{renderXPLog();},400);
    // Wire XP log tabs ONCE so they don't stack up on repeated opens
    const _tt=document.getElementById('xpLogTabToday'),_wt=document.getElementById('xpLogTabWeek');
    _tt?.addEventListener('click',()=>{const c=document.getElementById('xpLogList');if(c)c.dataset.activeTab='today';renderXPLog();});
    _wt?.addEventListener('click',()=>{const c=document.getElementById('xpLogList');if(c)c.dataset.activeTab='week';renderXPLog();});
    document.querySelectorAll('.tab-btn').forEach(b=>{
      b.addEventListener('click',()=>{
        if(b.dataset.tab==='stats')setTimeout(()=>{renderXPBar();renderXPLog();},80);
        if(b.dataset.tab==='achievements')setTimeout(()=>renderAchievementTab(),80);
      });
    });
  }

  return {init,onSessionComplete,onGoalComplete,onOverdueDetected,checkAchievements,getOverdueStreak,refreshUI,renderXPLog,renderAchievements,renderAchievementTab,renderXPBar,renderBadgeOnBoard,getRank,load};
})();
