// Local-only room prototype. No networking, accounts, rewards, or personal goal sharing.
const StudyRoomModule = (() => {
  function initial() { return { joined:true, capacity:4, locked:false, host:'you', disconnected:false, members:[{id:'you',name:'You',drink:'☕',status:'Ready to focus'},{id:'sam',name:'Sam',drink:'🍵',status:'Studying · sample'},{id:'lee',name:'Lee',drink:'🧋',status:'On a break · sample'}] }; }
  function reduce(state,action) {
    const s=structuredClone(state);
    if(action.type==='reset')return initial();
    if(action.type==='leave'){s.joined=false;s.members=s.members.filter(m=>m.id!=='you');if(s.host==='you')s.host=s.members[0]?.id||null;return s;}
    if(!s.joined)return s;
    if(action.type==='reconnect'){s.disconnected=false;return s;}
    if(s.disconnected)return s;
    if(action.type==='disconnect'){s.disconnected=true;return s;}
    if(s.host!=='you')return s;
    if(action.type==='capacity'&&[2,4,6,8].includes(action.value)&&action.value>=s.members.length)s.capacity=action.value;
    if(action.type==='lock')s.locked=!s.locked;
    if(action.type==='remove'&&action.id!=='you')s.members=s.members.filter(m=>m.id!==action.id);
    if(action.type==='transfer'&&s.members.some(m=>m.id===action.id))s.host=action.id;
    if(action.type==='join'&&!s.locked&&s.members.length<s.capacity){const id=`sample-${s.members.length}-${Date.now()}`;s.members.push({id,name:'Guest',drink:'🥤',status:'Ready · sample'});}
    return s;
  }
  let state=initial(),view='room';
  function el(tag,text,className){const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;}
  function button(text,handler,disabled=false){const b=el('button',text);b.type='button';b.disabled=disabled;b.onclick=handler;return b;}
  function act(action){state=reduce(state,action);render();}
  function dialog(title,message,confirm){
    const d=el('dialog',null,'room-dialog');const h=el('h2',title);h.id='roomDialogTitle';d.setAttribute('aria-labelledby',h.id);d.append(h,el('p',message));const previous=document.activeElement;
    d.append(button(confirm?'Cancel':'Close',()=>d.close()));if(confirm)d.append(button('Confirm',()=>{d.close();confirm();}));
    d.addEventListener('keydown',e=>e.stopPropagation());d.addEventListener('close',()=>{d.remove();if(previous?.isConnected)previous.focus();else document.getElementById('roomHeading')?.focus();});document.body.append(d);d.showModal();
  }
  function render(){
    const root=document.getElementById('studyRoom');if(!root)return;root.replaceChildren();
    const header=el('div',null,'room-heading');const title=el('h2','The quiet table');title.id='roomHeading';title.tabIndex=-1;header.append(title,el('span','LOCAL PREVIEW','room-preview-badge'));root.append(header);
    root.append(el('p','Try the room layout with sample people. No one is connected, and nothing here changes your study progress.','room-intro'));
    const switches=el('div',null,'room-switch');for(const [key,label] of [['room','Café room'],['timer','My timer']]){const b=button(label,()=>{view=key;render();document.querySelector('.room-switch button[aria-pressed="true"]')?.focus();});b.setAttribute('aria-pressed',String(view===key));switches.append(b);}root.append(switches);
    const status=el('p',!state.joined?'You left the preview. Your solo timer is unaffected.':state.disconnected?'Connection lost (simulation). Your seat is reserved; room controls are paused.':`${state.members.length} of ${state.capacity} seats · ${state.locked?'Room locked':'Invite-only'} · Host: ${state.host==='you'?'You':state.members.find(m=>m.id===state.host)?.name||'None'}`,'room-status');status.setAttribute('role','status');root.append(status);
    if(!state.joined){root.append(button('Reopen preview',()=>act({type:'reset'})));return;}
    if(view==='timer'){
      const desk=el('div',null,'room-personal-desk');desk.append(el('span','☕','room-desk-cup'),el('h3','Your own pace, a shared space'),el('p','Use your existing focus timer. In this preview, leaving the room view does not start or pause a session.'));
      desk.append(button('Open my focus controls',()=>{document.querySelector('[data-tab="goals"]').click();document.getElementById('viewFocusBtn').click();document.getElementById('viewFocusBtn').focus();}));root.append(desk);
    }else{
      const scene=el('div',null,'room-scene');scene.append(el('div','☕  LETSFOCUS CAFÉ  ·  QUIET COMPANY','room-table-sign'));const seats=el('div',null,'room-seats');
      for(let i=0;i<state.capacity;i++){
        const member=state.members[i];const seat=el('article',null,member?'room-seat':'room-seat room-seat-empty');
        if(member){seat.append(el('span',member.drink,'room-cup'),el('h3',member.name+(member.id===state.host?' · Host':'')),el('p',member.status));if(member.id!=='you'&&state.host==='you')seat.append(button(`Remove ${member.name}`,()=>dialog('Remove this sample guest?','Their seat will become available. In a live room, removal must be enforced by the server.',()=>act({type:'remove',id:member.id})),state.disconnected));}
        else{seat.append(el('span','＋','room-cup'),el('h3','An open seat'),el('p',state.locked?'Room is locked':'Waiting for company'));}seats.append(seat);
      }scene.append(seats);root.append(scene);
    }
    const tools=el('div',null,'room-tools');const host=state.host==='you',disabled=!host||state.disconnected;
    tools.append(button('Invite friends',()=>dialog('Invites are not live yet','This is a local room preview. Shareable links and room codes will be enabled after accounts and the room service are connected. No link has been created.')));
    const label=el('label','Seats ');const select=el('select');select.setAttribute('aria-label','Room capacity');for(const n of [2,4,6,8]){const o=el('option',String(n));o.value=n;o.disabled=n<state.members.length;select.append(o);}select.value=state.capacity;select.disabled=disabled;select.onchange=()=>act({type:'capacity',value:Number(select.value)});label.append(select);tools.append(label);
    tools.append(button(state.locked?'Unlock room':'Lock room',()=>act({type:'lock'}),disabled));
    tools.append(button('Leave room',()=>dialog('Leave the preview?',state.host==='you'?'The next sample guest will become host. Your personal study progress stays unchanged.':'You can reopen the preview at any time.',()=>act({type:'leave'}))));root.append(tools);
    const simulation=el('details',null,'room-simulations');simulation.append(el('summary','Preview scenarios'));
    simulation.append(button('Add sample guest',()=>act({type:'join'}),disabled||state.locked||state.members.length>=state.capacity));
    simulation.append(button(state.disconnected?'Reconnect':'Simulate connection loss',()=>act({type:state.disconnected?'reconnect':'disconnect'})));
    simulation.append(button('Transfer host to sample guest',()=>act({type:'transfer',id:state.members.find(m=>m.id!=='you')?.id}),disabled||state.members.length<2));
    simulation.append(button('Reset preview',()=>act({type:'reset'})));root.append(simulation);
  }
  document.addEventListener('letsfocus:ready',render);
  return {initial,reduce};
})();
