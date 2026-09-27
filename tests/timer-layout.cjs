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
