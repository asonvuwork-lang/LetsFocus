const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const nodes = new Map();
function element(id) {
  const classes = new Set();
  return {id, textContent:'', title:'', attributes:{}, children:[], focused:false,
    classList:{contains:n=>classes.has(n), add:n=>classes.add(n), remove:n=>classes.delete(n), toggle(n,on){on?classes.add(n):classes.delete(n);}},
    setAttribute(n,v){this.attributes[n]=v;}, addEventListener(n,fn){this[n]=fn;},
    append(...els){this.children.push(...els);els.forEach(el=>nodes.set(el.id,el));},
    focus(){this.focused=true;}};
}
const page = element('timerPage'), toolbar = element('toolbar');
page.querySelector=()=>toolbar; nodes.set(page.id,page);
let init, observe, finished=0;
const context = vm.createContext({
  document:{getElementById:id=>nodes.get(id),createElement:()=>element(''),addEventListener:(n,fn)=>init=fn},
  TimerLayoutModule:{finishEditing(){finished++;}},
  MutationObserver:class {constructor(fn){observe=fn;}observe(){}}
});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../script-focus-mode.js'),'utf8')+'\nglobalThis.moduleUnderTest=FocusModeModule;',context);
init();
const mode=context.moduleUnderTest,button=nodes.get('focusModeToggle');
assert.equal(mode.isActive(),false);
button.click();
assert.equal(mode.isActive(),true);
assert.equal(finished,1,'entering closes layout editing first');
assert.equal(page.classList.contains('calm-focus-mode'),true);
assert.equal(button.attributes['aria-pressed'],'true');
assert.equal(button.textContent,'Exit focus mode');
mode.setActive(true);
assert.equal(finished,1,'repeated state updates are idempotent');
button.click();
assert.equal(mode.isActive(),false);
assert.equal(button.attributes['aria-pressed'],'false');
assert.equal(nodes.get('focusModeNotice').textContent,'');
button.click();
page.classList.add('hidden');
button.focused=false;
observe();
assert.equal(mode.isActive(),false,'leaving timer automatically exits');
assert.equal(button.focused,false,'leaving timer does not steal focus');
mode.setActive(true);
assert.equal(mode.isActive(),false,'hidden timer cannot enter focus mode');
console.log('Focus mode: state, editing handoff, accessibility and page exit checks passed.');
