// Preview only: personal totals are local; sample standings are fictional and separate.
const LeaderboardModule = (() => {
  function weekSummary(daily, now = new Date()) {
    const end = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));
    const start = new Date(end); start.setUTCDate(start.getUTCDate() - (start.getUTCDay()+6)%7);
    let seconds=0, days=0;
    for(let date=new Date(start);date<=end;date.setUTCDate(date.getUTCDate()+1)){
      const value=daily?.[date.toISOString().slice(0,10)];
      if(typeof value==='number'&&Number.isFinite(value)&&value>0){seconds+=value;days++;}
    }
    return {seconds,days,start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10)};
  }
  function format(seconds){const n=Math.max(0,Math.floor(seconds));return n<60?`${n}s`:n<3600?`${Math.floor(n/60)}m`:`${Math.floor(n/3600)}h ${Math.floor(n%3600/60)}m`;}
  function rank(rows){let previous=null,rank=0;return [...rows].sort((a,b)=>b.seconds-a.seconds||a.name.localeCompare(b.name)).map((row,i)=>{if(row.seconds!==previous)rank=i+1;previous=row.seconds;return {...row,rank};});}
  function node(tag,text,className){const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n;}
  function render(){
    const root=document.getElementById('leaderboardPreview');if(!root)return;
    let data={};try{data=JSON.parse(localStorage.getItem('letsfocus_stats')||'{}')||{};}catch{}
    const wasOpen=root.querySelector('details')?.open || false;
    const restoreFocus=root.querySelector('summary')===document.activeElement;
    const summary=weekSummary(data.daily);root.replaceChildren();
    root.append(node('h3','Your weekly brew','stats-section-title'));
    root.append(node('p',`${format(summary.seconds)} focused · ${summary.days} active day${summary.days===1?'':'s'}`,'weekly-brew-total'));
    root.append(node('p',`${summary.start} – ${summary.end} · Monday–Sunday, UTC · This browser only`,'leaderboard-note'));
    if(!summary.seconds)root.append(node('p','Finish a focus session to begin this week’s progress.'));
    const details=document.createElement('details');details.className='leaderboard-sample';details.open=wasOpen;details.append(node('summary','Explore the leaderboard preview'));
    details.append(node('p','SAMPLE DATA — These are fictional people and times. Your progress is not included, ranked, or shared.','leaderboard-note'));
    const table=document.createElement('table');table.append(node('caption','Example weekly standings'));
    const head=document.createElement('thead'),tr=document.createElement('tr');for(const title of ['Rank','Study name','Focus time']){const th=node('th',title);th.scope='col';tr.append(th);}head.append(tr);table.append(head);
    const body=document.createElement('tbody');for(const row of rank([{name:'Maple',seconds:9000},{name:'Cedar',seconds:7200},{name:'Willow',seconds:7200},{name:'Fern',seconds:4500}])){const line=document.createElement('tr');line.append(node('td',String(row.rank)),node('td',`${row.name} · sample`),node('td',format(row.seconds)));body.append(line);}table.append(body);details.append(table);
    details.append(node('p','Equal focus times share a rank. Live standings will require sign-in, opt-in sharing, and validated sessions.','leaderboard-note'));root.append(details);
    if(restoreFocus)details.querySelector('summary').focus({preventScroll:true});
  }
  document.addEventListener('letsfocus:ready',render);
  document.addEventListener('letsfocus:datasave',render);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
  return {weekSummary,rank,format,render};
})();
