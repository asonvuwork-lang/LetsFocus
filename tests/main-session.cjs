const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const store=new Map(),nodes=new Map();let now=10000,drinkKey;
function node(){const c=new Set();return {style:{},textContent:'',focus(){},classList:{add:k=>c.add(k),remove:k=>c.delete(k),contains:k=>c.has(k),toggle:(k,v)=>v?c.add(k):c.delete(k)}};}
['mainPage','timerPage','startPauseBtn'].forEach(id=>nodes.set(id,node()));
const ctx=vm.createContext({Date:{now:()=>now},Event:function(){},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},window:{scrollY:0,scrollTo(){}},document:{getElementById:id=>nodes.get(id),dispatchEvent(){}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},GoalsModule:{getGoals:()=>[],renderGoals(){},updateMainProgress(){}},MusicModule:{stopAllAudio(){},loadPlaylist(){}},DrinkModule:{getCurrentDrinkInfo:()=>({drinkKey:'matcha'}),setPlaybackState(){},onSessionStart:(category,key)=>{drinkKey=key;}}});
let source=fs.readFileSync(require('path').join(__dirname,'../script-timer.js'),'utf8');
source=source.replace('return { init, showTimerPage',`return {audit:{start(){recoveryReady=true;drinkSessionActive=true;totalSeconds=60;remainingMs=60000;remainingSeconds=60;toggleTimer();},state(){return {timerRunning,remainingMs,focusElapsedMs};}}, init, showTimerPage`);
vm.runInContext(source+';this.timer=TimerModule;',ctx);
ctx.timer.audit.start();now+=1250;ctx.timer.hideTimerPage();assert.equal(ctx.timer.audit.state().timerRunning,false);assert.equal(ctx.timer.getPendingSession().remainingMs,58750);assert.equal(ctx.timer.getPendingSession().focusElapsedMs,1250);
now+=3600000;ctx.timer.resumePendingSession();assert.equal(ctx.timer.audit.state().timerRunning,true);assert.equal(ctx.timer.audit.state().remainingMs,58750);assert.equal(drinkKey,'matcha');now+=250;ctx.timer.hideTimerPage();assert.equal(ctx.timer.getPendingSession().remainingMs,58500);assert.equal(ctx.timer.getPendingSession().focusElapsedMs,1500);
ctx.timer.discardPendingSession();assert.equal(ctx.timer.getPendingSession(),null);
console.log('Main-page resume: elapsed and fractional time preserved, offline time excluded, exact drink restored, explicit discard clears session.');
