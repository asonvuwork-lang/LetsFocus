// Shared, reversible actions and the main-page session entry points.
const MainControlsModule = (() => {
  let pendingUndo=null, undoTimer=null, card, reminder;
  function commitUndo(){if(!pendingUndo)return;const action=pendingUndo;pendingUndo=null;clearTimeout(undoTimer);document.getElementById('actionUndo')?.remove();action.commit?.();}
  function offerUndo(message,undo,commit){
    commitUndo();pendingUndo={undo,commit};
    const toast=document.createElement('div');toast.id='actionUndo';toast.className='action-undo';
    const text=document.createElement('span');text.setAttribute('role','status');text.textContent=message;
    const button=document.createElement('button');button.textContent='Undo';button.onclick=()=>{const action=pendingUndo;pendingUndo=null;clearTimeout(undoTimer);toast.remove();action?.undo();render();};
    toast.append(text,button);document.body.append(toast);undoTimer=setTimeout(commitUndo,10000);
    toast.addEventListener('focusin',()=>clearTimeout(undoTimer));toast.addEventListener('focusout',()=>{undoTimer=setTimeout(commitUndo,10000);});
  }
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
  function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
  function dayKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
  function dueDays(date,now=new Date()){if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return Infinity;const today=new Date(now);today.setHours(0,0,0,0);return Math.round((new Date(date+'T00:00:00')-today)/86400000);}
  function duration(seconds){const n=Math.max(0,Math.floor(seconds||0));return n>=3600?`${Math.floor(n/3600)}h ${Math.floor(n%3600/60)}m`:n>=60?`${Math.floor(n/60)}m ${n%60}s`:`${n}s`;}
  function render(){
    if(!card||typeof GoalsModule==='undefined')return;
    const goals=GoalsModule.getGoals().filter(g=>!g.completed);
    const chosen=read('letsfocus_focus_next',null);
    const sorted=[...goals].sort((a,b)=>dueDays(a.deadline)-dueDays(b.deadline));
    const next=goals.find(g=>String(g.id)===String(chosen))||sorted[0];
    card.replaceChildren();
    const title=document.createElement('h2');title.textContent='Your next focus';card.append(title);
    const saved=typeof TimerModule!=='undefined'?TimerModule.getPendingSession?.():null;
    if(saved){
      const row=document.createElement('div');row.className='resume-session';
      const info=document.createElement('p');info.textContent=`Paused: ${saved.selectedGoal?.text||'Focus session'} · ${duration(Math.ceil(saved.remainingMs/1000))} left`;
      const resume=document.createElement('button');resume.textContent='Resume session';resume.onclick=()=>TimerModule.resumePendingSession();
      const discard=document.createElement('button');discard.textContent='End saved session';discard.className='quiet-button';discard.onclick=async()=>{if(await showConfirm('End this saved session? Its unfinished progress will be discarded.')){TimerModule.discardPendingSession();render();}};
      row.append(info,resume,discard);card.append(row);
    }
    if(next){
      const label=document.createElement('label');label.textContent='Choose a goal';label.htmlFor='focusNextGoal';
      const select=document.createElement('select');select.id='focusNextGoal';
      goals.forEach(g=>{const o=document.createElement('option');o.value=String(g.id);o.textContent=g.text;o.selected=g===next;select.append(o);});
      select.onchange=()=>write('letsfocus_focus_next',select.value);
      const start=document.createElement('button');start.textContent='Start focus';start.onclick=()=>TimerModule.startGoal(select.value);
      const row=document.createElement('div');row.className='focus-next-controls';row.append(label,select,start);card.append(row);
    }else{const empty=document.createElement('p');empty.textContent='Add a goal below to choose your next focus.';card.append(empty);}
    renderReminder(goals);
  }
  function renderReminder(goals){
    if(!reminder)return;reminder.replaceChildren();
    const saved=read('letsfocus_deadline_reminders',{}),today=dayKey();
    const due=goals.filter(g=>{const days=dueDays(g.deadline),entry=saved[String(g.id)];return days<=2&&(!entry||entry.deadline!==g.deadline||(!(entry.until>Date.now())&&entry.dismissed!==today));}).sort((a,b)=>dueDays(a.deadline)-dueDays(b.deadline));
    reminder.hidden=!due.length;if(!due.length)return;
    const goal=due[0],days=dueDays(goal.deadline),text=document.createElement('p');
    text.textContent=`${goal.text} — ${days<0?`${-days} day${days===-1?'':'s'} overdue`:days===0?'due today':days===1?'due tomorrow':`due in ${days} days`}${due.length>1?` · ${due.length-1} more approaching`:''}`;
    const open=document.createElement('button');open.textContent='View deadlines';open.onclick=()=>document.querySelector('[data-tab="deadlines"]').click();
    const snooze=document.createElement('button');snooze.textContent='Snooze 1 hour';
    const dismiss=document.createElement('button');dismiss.textContent='Dismiss today';
    function mute(kind){due.forEach(g=>{saved[String(g.id)]={deadline:g.deadline,...(kind==='snooze'?{until:Date.now()+3600000}:{dismissed:today})};});write('letsfocus_deadline_reminders',saved);renderReminder(goals);}
    snooze.onclick=()=>mute('snooze');dismiss.onclick=()=>mute('dismiss');reminder.append(text,open,snooze,dismiss);
  }
  function init(){
    const goalPanel=document.getElementById('goalPanel');if(!goalPanel)return;
    card=document.createElement('section');card.className='focus-next-card';card.id='focusNextCard';
    reminder=document.createElement('aside');reminder.className='deadline-reminder';reminder.setAttribute('aria-label','Deadline reminder');
    goalPanel.prepend(reminder);
    card.classList.add('goal-view-hidden');
    goalPanel.querySelector('.goal-view-toggle').after(card);render();
    document.addEventListener('letsfocus:datasave',render);
    document.addEventListener('letsfocus:sessionchange',render);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
    setInterval(()=>{if(!reminder?.contains(document.activeElement))renderReminder(GoalsModule.getGoals().filter(g=>!g.completed));},60000);
    window.addEventListener('pagehide',commitUndo);
    document.addEventListener('keydown',e=>{
      if(e.key!=='Escape'||e.defaultPrevented||document.querySelector('dialog[open]'))return;
      const config=document.getElementById('timerConfirmOverlay');
      if(config&&!config.classList.contains('hidden')){e.preventDefault();e.stopImmediatePropagation();document.getElementById('goalPickerCancelBtn')?.click();return;}
      const details=[...document.querySelectorAll('details[open]')].filter(el=>el.getClientRects().length);
      if(details.length){e.preventDefault();e.stopImmediatePropagation();details.at(-1).open=false;details.at(-1).querySelector('summary')?.focus();return;}
      const dropdowns=[...document.querySelectorAll('#pickCategoryDropdown,#filterCategoryDropdown,#sortDropdown')].filter(el=>el.getClientRects().length&&!el.classList.contains('hidden'));
      if(dropdowns.length){e.preventDefault();e.stopImmediatePropagation();dropdowns.forEach(el=>{el.classList.remove('visible');el.classList.add('hidden');});return;}
      const pop=document.getElementById('dlPopover');if(pop){e.preventDefault();e.stopImmediatePropagation();pop.querySelector('.dl-pop-close')?.click();}
    },true);
  }
  document.addEventListener('DOMContentLoaded',init);
  return {offerUndo,commitUndo,hasPendingUndo:()=>!!pendingUndo,render,dueDays,dayKey,duration};
})();
