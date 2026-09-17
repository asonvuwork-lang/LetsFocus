const fs=require('fs'), vm=require('vm'), assert=require('assert'), path=require('path');
const nodes=new Map(), storage=new Map(), states=[], progress=[];
function node(){const classes=new Set();return {style:{},textContent:'',classList:{contains:k=>classes.has(k),add:k=>classes.add(k),remove:k=>classes.delete(k),toggle:(k,on)=>on?classes.add(k):classes.delete(k)}};}
for(const id of ['timerPage','timerProgressFill','progressPctDisplay','startPauseBtn'])nodes.set(id,node());
let now=1000;
const ctx=vm.createContext({console,Date:{now:()=>now},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},window:{},document:{getElementById:id=>nodes.get(id)},localStorage:{setItem:(k,v)=>storage.set(k,v)},DrinkModule:{setPlaybackState:s=>states.push({...s}),onProgressUpdate:p=>progress.push(p)}});
let source=fs.readFileSync(path.join(__dirname,'../script-timer.js'),'utf8');
source=source.replace('return { init, showTimerPage',`return { audit:{buildPopOutHTML,syncTimerVisualState,updateTimerProgress,broadcastState,toggleTimer,getDrinkProgressPct,set(s){timerRunning=s.running??false;drinkSessionActive=s.active??true;remainingMs=s.ms??60000;remainingSeconds=Math.ceil(remainingMs/1000);totalSeconds=s.total??60;pomodoroMode=s.pomodoro??false;pomoIsWork=s.work??true;pomoCurrentCycle=s.cycle??1;},get(){return {remainingMs,timerRunning}}}, init, showTimerPage`);
vm.runInContext(source,ctx);const a=vm.runInContext('TimerModule.audit',ctx);
a.set({});a.syncTimerVisualState();assert.deepEqual(states.at(-1),{running:false,brewing:true});
a.toggleTimer();assert.deepEqual(states.at(-1),{running:true,brewing:true});
now+=1250;a.toggleTimer();assert.deepEqual(states.at(-1),{running:false,brewing:true});assert.equal(a.get().remainingMs,58750);
a.toggleTimer();now+=250;a.toggleTimer();assert.equal(a.get().remainingMs,58500,'pause/resume preserves fractional time');
a.set({running:true,pomodoro:true,work:false,cycle:1,total:300,ms:150000});a.syncTimerVisualState();assert.deepEqual(states.at(-1),{running:true,brewing:false});a.broadcastState();assert.equal(JSON.parse(storage.get('letsfocus_timer_sync')).drinkPct,25,'pop-out holds work progress through breaks');
a.set({running:true,pomodoro:true,work:true,cycle:2,total:1500,ms:750000});a.broadcastState();assert.equal(JSON.parse(storage.get('letsfocus_timer_sync')).drinkPct,37.5);
a.set({ms:0,total:0});a.updateTimerProgress();a.syncTimerVisualState();assert.equal(progress.at(-1),0);assert.equal(states.at(-1).brewing,false);
a.set({active:false});a.syncTimerVisualState();assert.equal(states.at(-1).brewing,false);
a.set({running:true});nodes.get('timerPage').classList.add('hidden');a.syncTimerVisualState();assert.equal(states.at(-1).brewing,false);
console.log('Timer/drink integration passed: fractional pause/resume, breaks, pop-out progress, zero time, completion and hidden page.');

const popout=a.buildPopOutHTML({}, {running:false,remaining:150,total:300,h:0,m:2,s:30,drinkPct:25}, null);
const scripts=[...popout.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length,1);new vm.Script(scripts[0][1]);
assert(scripts[0][1].includes('let poDrinkPct = 25;'));
console.log('Generated pop-out JavaScript parses and uses shared drink progress.');
