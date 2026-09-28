const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
let dialog, time = 0, interval, timeout, celebrations = false;
function node() {
  return {textContent:'',isConnected:true,attributes:[],listeners:{},children:{},classList:{contains:()=>false},
    setAttribute(){},append(){},focus(){},close(){this.open=false},remove(){this.isConnected=false},showModal(){this.open=true},
    addEventListener(name, fn){this.listeners[name]=fn},querySelector(name){return this.children[name] ||= node()}};
}
const context = vm.createContext({document:{activeElement:node(),createElement(){return dialog=node()},querySelector:()=>null,getElementById:()=>node(),body:{append(){}}},Date:{now:()=>time},setInterval(fn){interval=fn;return 1},clearInterval(){interval=null},setTimeout(fn){timeout=fn;return 1},clearTimeout(){timeout=null},XPModule:{isCelebrating:()=>celebrations}});
vm.runInContext(fs.readFileSync('script-session-completion.js','utf8')+'\nthis.module=SessionCompletionModule;',context);
const api=context.module;
let continued=0,finished=0;
api.show({focusedSeconds:125,beansEarned:12,goal:'<unsafe>',onContinue(){continued++},onFinish(){finished++}});
assert.equal(dialog.querySelector('.completion-time').textContent,'2m 5s');
assert.equal(dialog.querySelector('.completion-goal').textContent,'<unsafe>');
assert.equal(dialog.querySelector('.completion-beans').textContent,'+12');
const click=name=>dialog.querySelector(`[data-action="${name}"]`).listeners.click();
click('break');assert.ok(interval);assert.equal(continued,0);assert.equal(finished,0);
time=300000;interval();assert.equal(dialog.querySelector('[data-action="break"]').textContent,'Break complete');
click('continue');click('continue');assert.equal(continued,1);assert.equal(finished,0);assert.equal(dialog.isConnected,false);
celebrations=true;api.show({onFinish(){finished++}});assert.ok(!dialog.open);assert.ok(timeout);
celebrations=false;timeout();assert.equal(dialog.open,true);
dialog.listeners.cancel({preventDefault(){}});assert.equal(finished,1);
assert.equal(api.formatDuration(-4),'0s');assert.equal(api.formatDuration(3661),'1h 1m');
console.log('Session completion: break, action guards, summaries, rank sequencing and dismissal passed.');
