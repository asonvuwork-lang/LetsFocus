const fs=require('fs'),vm=require('vm'),assert=require('assert');
const storage=new Map();let now=100000;
const ctx=vm.createContext({console,Date:{now:()=>now},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},DrinkModule:{getCurrentDrinkInfo:()=>({drinkKey:'cherry_blossom'})}});
let src=fs.readFileSync(require('path').join(__dirname,'../script-timer.js'),'utf8');
src=src.replace('return { init, showTimerPage',`return {audit:{saveRecovery,readRecovery,clearRecovery,resolveSelectedGoalIndex,set(s){recoveryReady=true;drinkSessionActive=true;sessionStatsRecorded=false;totalSeconds=1500;remainingMs=900000;focusElapsedMs=600000;selectedGoal={text:'Read',index:0,subgoals:[]};pomodoroMode=true;pomoCurrentCycle=2;pomoIsWork=false;timerRunning=false;Object.keys(s).forEach(k=>{if(k==='running'){timerRunning=s[k];phaseEndsAtMs=nowForTest+900000;focusRunStartedAtMs=nowForTest;}if(k==='recorded')sessionStatsRecorded=s[k];if(k==='remaining')remainingMs=s[k];});}}, init, showTimerPage`);
ctx.nowForTest=now;vm.runInContext(src,ctx);const a=vm.runInContext('TimerModule.audit',ctx);
a.set({});a.saveRecovery();let s=a.readRecovery();assert.equal(s.remainingMs,900000);assert.equal(s.drinkKey,'cherry_blossom');assert.equal(s.pomoCurrentCycle,2);assert.equal(s.pomoIsWork,false);
now+=3600000;assert.equal(a.readRecovery().remainingMs,900000,'offline time does not silently advance');
a.set({recorded:true});a.clearRecovery();a.saveRecovery();assert.equal(a.readRecovery(),null,'completed sessions cannot recover twice');
for(const change of [{remainingMs:-1},{totalSeconds:Infinity},{pomoCurrentCycle:10},{focusElapsedMs:-2},{savedAt:now-8*86400000},{selectedGoal:{text:123}}]){storage.set('letsfocus_session_recovery_v1',JSON.stringify({...s,...change}));assert.equal(a.readRecovery(),null);}
storage.set('letsfocus_session_recovery_v1','broken');assert.equal(a.readRecovery(),null);
console.log('Recovery passes: paused snapshot, offline exclusion, exact drink and Pomodoro phase, recorded-session guard, malformed and expired data.');

a.set({remaining:0});storage.set('letsfocus_session_recovery_v1',JSON.stringify(s));a.saveRecovery();assert.equal(a.readRecovery(),null,'zero timer clears older snapshot');
a.set({});assert.equal(a.resolveSelectedGoalIndex([{text:'Other'},{text:'Read'}]),1);assert.equal(a.resolveSelectedGoalIndex([{text:'Read',completed:true}]),null);assert.equal(a.resolveSelectedGoalIndex([{text:'Read'},{text:'Read'}]),null);
console.log('Recovery edge checks: zero timers clear stale saves and ambiguous/completed goals cannot be completed again.');
