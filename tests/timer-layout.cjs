const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({document:{addEventListener(){}}});
vm.runInContext(fs.readFileSync('script-timer-layout.js','utf8')+';globalThis.normalize=TimerLayoutModule.normalize;',context);
const normalize=value=>JSON.parse(JSON.stringify(context.normalize(value)));
const defaults=normalize();
assert.equal(defaults.order.length,5);
for(const input of [null,{},'bad',{order:['quote','quote','missing','timer'],sizes:{timer:{wide:true,height:99999},drink:{height:-40},goal:{height:'400'}}}]){
 const value=normalize(input);
 assert.equal(value.order.length,5);
 assert.equal(new Set(value.order).size,5);
 assert.deepEqual([...value.order].sort(),[...defaults.order].sort());
 assert.ok(Object.values(value.sizes).every(s=>s.height>=0&&s.height<=800));
}
const custom=normalize({order:['quote'],sizes:{timer:{wide:true,height:620}}});
assert.equal(custom.order[0],'quote');
assert.deepEqual(custom.sizes.timer,{wide:true,height:620});
assert.deepEqual(normalize(custom),custom);
console.log('Timer layout: valid layouts preserved; invalid/duplicate/missing panels and sizes safely normalized.');

vm.runInContext('globalThis.preset=TimerLayoutModule.preset;globalThis.matchingPreset=TimerLayoutModule.matchingPreset;',context);
for(const screen of ['phone','tablet','desktop']) {
 for(const name of ['balanced','spotlight','minimal']) {
  const layout=context.preset(name,screen);
  assert.equal(new Set(layout.order).size,5,'Every preset retains all five panels');
  assert.equal(context.matchingPreset(layout,screen),name);
  assert.ok(Object.values(layout.sizes).every(size=>size.height>=0&&size.height<=800));
 }
 assert.equal(context.preset('spotlight',screen).order[0],'drink');
 assert.equal(context.preset('minimal',screen).sizes.timer.wide,true);
}
const first=context.preset('spotlight','phone');first.sizes.drink.height=700;
assert.equal(context.preset('spotlight','phone').sizes.drink.height,480,'Presets are independently editable');
assert.equal(context.matchingPreset(first,'phone'),'custom');
console.log('Timer presets: all panels retained, device sizes valid, custom layouts detected, preset state isolated.');
const visibility=normalize({hidden:['sounds','sounds','quote','timer','missing']});
assert.deepEqual(visibility.hidden,['sounds','quote']);
assert.deepEqual(normalize({hidden:'sounds'}).hidden,[]);
assert.deepEqual(normalize(visibility),visibility);
assert.deepEqual(normalize({}).hidden,[],'old saved layouts keep all panels visible');
console.log('Panel visibility: optional panels persist, unknown entries rejected, timer remains available.');
