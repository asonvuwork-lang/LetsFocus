// Timer customization uses normal grid flow: panels can never cover one another.
const TimerLayoutModule = (() => {
  const KEY = 'letsfocus_timer_layout_v1';
  const IDS = ['timer', 'drink', 'goal', 'sounds', 'quote'];
  const labels = {timer:'Timer',drink:'Your drink',goal:'Current goal',sounds:'Ambient sounds',quote:'Focus quote'};
  let grid, editing=false, profile, layouts={}, gesture=null, scrollFrame=0;
  const device = () => innerWidth < 600 ? 'phone' : innerWidth < 1100 ? 'tablet' : 'desktop';
  function normalize(value) {
    const order = [...new Set((Array.isArray(value?.order)?value.order:[]).filter(id=>IDS.includes(id)))];
    IDS.forEach(id=>{if(!order.includes(id))order.push(id);});
    const sizes={};
    IDS.forEach(id=>{const s=value?.sizes?.[id];sizes[id]={wide:s?.wide===true,height:Number.isFinite(s?.height)?Math.max(0,Math.min(800,s.height)):0};});
    return {order,sizes};
  }
  function state(){return layouts[profile] ||= normalize();}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(layouts));status('Layout saved.');}catch{status('Layout updated for this visit. Browser storage is unavailable.');}}
  function status(text){document.getElementById('layoutStatus').textContent=text;}
  function apply(){
    const focused=document.activeElement;
    const s=state();
    s.order.forEach((id,index)=>{
      const panel=document.getElementById(`layout-${id}`),size=s.sizes[id];
      if(grid.children[index]!==panel)grid.insertBefore(panel,grid.children[index]||null);panel.classList.toggle('panel-wide',size.wide);
      panel.style.minHeight=size.height?`${size.height}px`:'';
      panel.querySelector('.layout-size').textContent=size.wide?'Compact':'Expand';
      panel.querySelector('.layout-size').setAttribute('aria-pressed',String(size.wide));
      panel.querySelector('[data-move="-1"]').disabled=s.order.indexOf(id)===0;
      panel.querySelector('[data-move="1"]').disabled=s.order.indexOf(id)===IDS.length-1;
    });
    if(focused?.isConnected)focused.focus({preventScroll:true});
  }
  function move(id,delta){const s=state(),from=s.order.indexOf(id),to=Math.max(0,Math.min(IDS.length-1,from+delta));s.order.splice(from,1);s.order.splice(to,0,id);apply();save();document.getElementById(`layout-${id}`).querySelector('.layout-handle').focus({preventScroll:true});}
  function endGesture(event){
    if(!gesture)return;
    const g=gesture;gesture=null;cancelAnimationFrame(scrollFrame);scrollFrame=0;
    if(event.type==='pointercancel'&&g.kind==='resize')state().sizes[g.id]=g.original;
    if(event.type!=='pointercancel'&&g.moved){
      if(g.kind==='move'&&g.target&&g.target!==g.id){const s=state(),from=s.order.indexOf(g.id),to=s.order.indexOf(g.target);s.order.splice(from,1);s.order.splice(to,0,g.id);}
      if(g.kind==='resize'){
        const size=state().sizes[g.id];size.height=Math.round(Math.max(0,Math.min(800,g.height+event.clientY-g.y)));
        if(profile!=='phone')size.wide=g.width+event.clientX-g.x>grid.clientWidth*.7;
      }
      save();
    }
    apply();
    grid.querySelectorAll('.drop-target,.layout-dragging').forEach(el=>el.classList.remove('drop-target','layout-dragging'));
  }
  function startGesture(event,id,kind){
    if(!editing||event.button!==0)return;
    const panel=document.getElementById(`layout-${id}`),r=panel.getBoundingClientRect();
    gesture={id,kind,x:event.clientX,y:event.clientY,width:r.width,height:r.height,target:null,moved:false,pointerX:event.clientX,pointerY:event.clientY,original:{...state().sizes[id]}};
    event.currentTarget.setPointerCapture(event.pointerId);panel.classList.add('layout-dragging');
    const scroll=()=>{if(!gesture)return;if(gesture.kind==='move'&&gesture.moved){const y=gesture.pointerY;if(y>innerHeight-60)window.scrollBy(0,12);else if(y<60)window.scrollBy(0,-12);const target=document.elementFromPoint(gesture.pointerX,y)?.closest('.layout-panel');grid.querySelectorAll('.drop-target').forEach(el=>el.classList.remove('drop-target'));gesture.target=target?.dataset.panel;if(target&&target.dataset.panel!==gesture.id)target.classList.add('drop-target');}scrollFrame=requestAnimationFrame(scroll);};
    scrollFrame=requestAnimationFrame(scroll);
  }
  function init(){
    grid=document.querySelector('.timer-layout');if(!grid)return;
    try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');for(const key of ['phone','tablet','desktop'])layouts[key]=normalize(raw?.[key]);}catch{}
    profile=device();
    const nodes={timer:grid.querySelector('.focus-session-box'),drink:document.getElementById('drinkProgressBox'),goal:document.getElementById('focusGoalCard'),sounds:grid.querySelector('.timer-right-col > .goal-area-box'),quote:document.getElementById('progressQuoteBox')};
    // Detach the goal before moving its former parent; preserve all handlers and IDs.
    nodes.goal.remove();
    IDS.forEach(id=>{
      const panel=document.createElement('section');panel.id=`layout-${id}`;panel.className='layout-panel';panel.dataset.panel=id;panel.setAttribute('aria-label',labels[id]);
      const tools=document.createElement('div');tools.className='panel-layout-tools';
      tools.innerHTML=`<button class="layout-handle" aria-label="Move ${labels[id]}. Use arrow keys to reorder.">⠿ ${labels[id]}</button><div class="panel-layout-actions"><button data-move="-1" aria-label="Move ${labels[id]} earlier">↑</button><button data-move="1" aria-label="Move ${labels[id]} later">↓</button><button class="layout-size" aria-label="Expand or compact ${labels[id]}">Expand</button></div>`;
      panel.append(tools,nodes[id]);
      const resize=document.createElement('button');resize.className='layout-resize';resize.textContent='↘';resize.setAttribute('aria-label',`Resize ${labels[id]}. Arrow keys change size.`);panel.append(resize);grid.append(panel);
      tools.querySelectorAll('[data-move]').forEach(btn=>btn.onclick=()=>move(id,Number(btn.dataset.move)));
      tools.querySelector('.layout-size').onclick=()=>{const size=state().sizes[id];size.wide=!size.wide;size.height=size.wide&&profile==='phone'?480:0;apply();save();};
      const handle=tools.querySelector('.layout-handle');handle.onpointerdown=e=>startGesture(e,id,'move');
      handle.onkeydown=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopPropagation();move(id,['ArrowUp','ArrowLeft'].includes(e.key)?-1:1);}};
      resize.onpointerdown=e=>startGesture(e,id,'resize');
      resize.onkeydown=e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();e.stopPropagation();const size=state().sizes[id];if(e.key==='ArrowLeft'||e.key==='ArrowRight')size.wide=e.key==='ArrowRight';else size.height=Math.max(0,Math.min(800,(size.height||panel.offsetHeight)+(e.key==='ArrowDown'?40:-40)));apply();save();};
    });
    grid.querySelectorAll(':scope > .timer-left-col,:scope > .timer-right-col').forEach(el=>el.remove());grid.classList.add('customizable-layout');
    const bar=document.createElement('div');bar.className='timer-layout-toolbar';bar.innerHTML='<button id="editTimerLayout" aria-pressed="false">Edit layout</button><button id="resetTimerLayout" hidden>Reset layout</button><span id="layoutStatus" role="status"></span>';
    grid.before(bar);
    bar.querySelector('#editTimerLayout').onclick=()=>{editing=!editing;grid.classList.toggle('layout-editing',editing);bar.querySelector('#editTimerLayout').textContent=editing?'Done editing':'Edit layout';bar.querySelector('#editTimerLayout').setAttribute('aria-pressed',String(editing));bar.querySelector('#resetTimerLayout').hidden=!editing;status(editing?(profile==='phone'?'Drag or use arrows to reorder. Choose Expand for more room.':'Drag a handle or use the arrows. Resize with the corner handle.'):'');};
    bar.querySelector('#resetTimerLayout').onclick=()=>{layouts[profile]=normalize();apply();save();status('Default layout restored for this screen size.');};
    grid.addEventListener('pointermove',e=>{if(!gesture)return;gesture.pointerX=e.clientX;gesture.pointerY=e.clientY;gesture.moved ||= Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>5;if(!gesture.moved)return;if(gesture.kind==='resize'){const g=gesture,size=state().sizes[g.id],panel=document.getElementById(`layout-${g.id}`);size.height=Math.round(Math.max(0,Math.min(800,g.height+e.clientY-g.y)));if(profile!=='phone')size.wide=g.width+e.clientX-g.x>grid.clientWidth*.7;panel.style.minHeight=`${size.height}px`;panel.classList.toggle('panel-wide',size.wide);return;}const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.layout-panel');grid.querySelectorAll('.drop-target').forEach(el=>el.classList.remove('drop-target'));gesture.target=target?.dataset.panel;if(target&&target.dataset.panel!==gesture.id)target.classList.add('drop-target');});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&gesture){e.preventDefault();e.stopImmediatePropagation();endGesture({type:'pointercancel'});}},true);
    window.addEventListener('blur',()=>endGesture({type:'pointercancel'}));
    grid.addEventListener('pointerup',endGesture);grid.addEventListener('pointercancel',endGesture);
    window.addEventListener('resize',()=>{const next=device();if(next!==profile){endGesture({type:'pointercancel'});profile=next;apply();status('Layout adapted to this screen size.');}});
    apply();
  }
  document.addEventListener('DOMContentLoaded',init);
  return {normalize};
})();
