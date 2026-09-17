const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const root = path.resolve(__dirname, '..');
const elements = new Map();
function element() { return { innerHTML:'', style:{}, dataset:{}, classList:{add(){},remove(){}}, remove(){elements.delete(this.id)}, setAttribute(){}, offsetWidth:100 }; }
const scene = element(); elements.set('drinkScene', scene);
const context = vm.createContext({console, Date, Math, setTimeout:()=>0, clearTimeout(){},
 document:{getElementById:id=>elements.get(id), createElement:()=>element(), head:{appendChild:e=>elements.set(e.id,e)}},
 ShopModule:{getOwned:()=>({equipment:[]})}});
vm.runInContext(fs.readFileSync(path.join(root,'script-drink-recipes.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'script-drink.js'),'utf8').replace('return { init, onSessionStart', 'return { audit: {setDrink, DRINKS, DRINK_KEY_TO_RECIPE, SHOP_ID_TO_VISUAL, EQUIP_ID_MAP, getCumulativeSvgContent, buildSyrupMarbling, seededRng, getProgress: () => ({visualPct, currentPct})}, init, onSessionStart'),context);
const api=vm.runInContext('DrinkModule',context), audit=api.audit;
let count=0; const gallery=[];
function check(svg,label){
 assert(!/NaN|undefined|Infinity/.test(svg), label+' invalid numbers');
 const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,label+' duplicate ids');
 for(const m of svg.matchAll(/url\(#([^)]*)\)/g)) assert(ids.includes(m[1]),label+' missing '+m[1]);
 count++;
}
// Diffused marbling must vary between brews, while staying stable during one brew.
const syrupDrinks = Object.entries(audit.DRINKS).filter(([, drink]) => drink.dripDrizzle);
assert(syrupDrinks.length > 0, 'syrup drinks are covered');
function syrupFragment(drink, seed, progress, fillY = 55, bottomY = 180, rank = Infinity) {
 return audit.buildSyrupMarbling(drink, 30, 100, fillY, bottomY, progress,
  audit.seededRng(seed), rank, 'testCupClip', 'testMarbleBlur');
}
function syrupDocument(fragment) {
 return `<svg><defs><clipPath id="testCupClip"><rect width="200" height="200"/></clipPath><filter id="testMarbleBlur"><feGaussianBlur stdDeviation="1"/></filter></defs>${fragment}</svg>`;
}
for (const [name, drink] of syrupDrinks) {
 const first = syrupFragment(drink, 12345, 100);
 assert(first.includes('data-syrup="diffused-marbling"'), `${name}: diffused marbling present`);
 assert.equal(first, syrupFragment(drink, 12345, 100), `${name}: fixed seed stays stable`);
 const different = syrupFragment(drink, 98765, 100);
 const geometry = svg => [...svg.matchAll(/\b(?:d|cx|cy|rx|ry|transform)="([^"]+)"/g)].map(match => match[0]).join('|');
 assert.notEqual(geometry(first), geometry(different), `${name}: seed changes marbling geometry`);
 for (const progress of [0, 14.999, 15, 15.001, 16, 38, 50, 85, 99.999, 100]) {
  const fragment = syrupFragment(drink, 12345, progress);
  check(syrupDocument(fragment), `${name}: marbling at ${progress}`);
  assert(!/folded-marbling|glass-trails/.test(fragment), `${name}: old drizzle removed`);
  if (progress <= 15) assert.equal(fragment, '', `${name}: syrup hidden before ingredient stage`);
 }
 for (const fillY of [178.001, 179, 180]) {
  assert.equal(syrupFragment(drink, 12345, 100, fillY), '', `${name}: no marbling below minimum fill`);
 }
 if (drink.dripDrizzle.tierGate) {
  assert.equal(syrupFragment(drink, 12345, 100, 55, 180, 0), '', `${name}: syrup respects equipment tier`);
 }
}
const keys=[...Object.keys(audit.SHOP_ID_TO_VISUAL),...Object.keys(audit.DRINKS).filter(k=>!k.startsWith('_')&&k!=='🎲 Random')];
for(const tier of ['house','signature','mastercraft']){
 context.ShopModule.getOwned=()=>({equipment:tier==='house'?[]:tier==='signature'?['espresso_machine','frother','syrup_shelf']:Object.keys(audit.EQUIP_ID_MAP)});
 for(const key of keys){
  const recipe=vm.runInContext("DRINK_RECIPES",context)[audit.DRINK_KEY_TO_RECIPE[key]];
  const required=recipe?.[tier]?.requires || [];
  context.ShopModule.getOwned=()=>({equipment:Object.entries(audit.EQUIP_ID_MAP).filter(([,v])=>required.includes(v)).map(([k])=>k)});
  audit.setDrink(key);
  for(const pct of [0,1,15,20,25,40,60,75,80,90,99,100,0,100]){
   api.onProgressUpdate(pct); check(scene.innerHTML,`${key} ${tier} ${pct}`);
   check(api.generateShopCupSVG(key,pct,'test'),`preview ${key} ${pct}`);
  }
  if(tier==='mastercraft') gallery.push({key,svg:scene.innerHTML});
 }
}
const cfg={steps:{20:{svgContent:'INSIDE'},40:{svgContent:'OUTSIDE',svgContentOutside:true},100:{}}};
assert.equal(audit.getCumulativeSvgContent(cfg,100,false),'INSIDE');
assert.equal(audit.getCumulativeSvgContent(cfg,100,true),'OUTSIDE');
audit.setDrink('mocha');api.onProgressUpdate(NaN);check(scene.innerHTML,'invalid progress');
fs.writeFileSync(path.join(root,'tests/gallery.html'),`<!doctype html><meta charset="utf-8"><title>Drink review</title><style>body{background:#ede2d2;color:#443329;font:14px system-ui;margin:32px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:16px}article{background:#fff9ed;border-radius:16px;padding:16px;text-align:center}svg{height:190px}</style><h1>Drink collection · completed mastercraft</h1><main>${gallery.map(({key,svg},i)=>'<article><h3>'+key+'</h3>'+svg.replace(/id="([^"]+)"/g,(_,id)=>`id="g${i}_${id}"`).replace(/url\(#([^)]*)\)/g,(_,id)=>`url(#g${i}_${id})`)+'</article>').join('')}</main>`);
console.log(`Passed ${count} render checks across ${keys.length} drinks; gallery generated.`);
const recipes=vm.runInContext('DRINK_RECIPES',context);
const reverse=Object.fromEntries(Object.entries(audit.EQUIP_ID_MAP).map(([k,v])=>[v,k]));
for(const [name,recipe] of Object.entries(recipes)) for(const tier of ['house','signature','mastercraft']) for(const req of recipe[tier]?.requires||[]) assert(reverse[req],`${name}: unavailable equipment ${req}`);
fs.writeFileSync(path.join(root,'tests/review.html'),`<!doctype html><meta charset="utf-8"><title>Drink animation studio</title><style>body{font:16px system-ui;background:#eee5d7;color:#433329;max-width:960px;margin:40px auto;padding:24px}section{display:flex;gap:60px;justify-content:center;background:#fff9ef;border-radius:24px;padding:40px;margin-top:24px}#drinkScene{width:250px;min-height:300px}select,button{font:inherit;padding:10px;margin:6px;border:1px solid #c9b597;border-radius:8px;background:#fff9ef}input{width:100%}a{color:#705134}</style><h1>Drink animation studio</h1><p>Choose a drink, equipment tier, and progress. Play a complete brew or scrub to inspect the effects.</p><select id="drink" aria-label="Drink">${keys.map(k=>'<option>'+k+'</option>').join('')}</select><select id="tier" aria-label="Equipment tier"><option>house</option><option>signature</option><option>mastercraft</option></select><button id="play">Play brew</button><button id="pause" disabled>Pause brew</button><button id="remix">New blend</button><label>Progress <output id="amount">0%</output><input id="progress" aria-label="Progress" type="range" min="0" max="100" value="0" step=".1"></label><section><div><h2>Live drink</h2><div id="drinkScene"></div></div><div><h2>Shop preview</h2><div id="preview"></div></div></section><p id="drinkProgressLabel"></p><p><a href="gallery.html">View the full collection</a></p><script>const requirements=${JSON.stringify(Object.fromEntries(keys.map(k=>{const recipe=recipes[audit.DRINK_KEY_TO_RECIPE[k]];return [k,Object.fromEntries(['house','signature','mastercraft'].map(t=>[t,(recipe?.[t]?.requires||[]).map(r=>reverse[r])]))]})))};const equipment=${JSON.stringify(Object.keys(audit.EQUIP_ID_MAP))};let selected=document.getElementById('drink').value;const ShopModule={getOwned:()=>({activeDrink:selected,equipment:requirements[selected][document.getElementById('tier').value]})};</script><script src="../script-drink-recipes.js"></script><script src="../script-drink.js"></script><script>const slider=document.getElementById('progress');let frame=0,paused=false;const pauseButton=document.getElementById('pause');function draw(){DrinkModule.onProgressUpdate(+slider.value);document.getElementById('amount').textContent=Math.round(slider.value)+'%';document.getElementById('preview').innerHTML=DrinkModule.generateShopCupSVG(selected,+slider.value,'studio')}function reset(){cancelAnimationFrame(frame);frame=0;paused=false;pauseButton.disabled=true;pauseButton.textContent='Pause brew';DrinkModule.setPlaybackState({running:true,brewing:true});selected=document.getElementById('drink').value;DrinkModule.onSessionStart();slider.value=0;draw()}document.getElementById('drink').onchange=reset;document.getElementById('tier').onchange=reset;slider.oninput=()=>{cancelAnimationFrame(frame);frame=0;paused=false;pauseButton.disabled=true;pauseButton.textContent='Pause brew';DrinkModule.setPlaybackState({running:true,brewing:true});draw()};document.getElementById('remix').onclick=()=>{const pct=slider.value;reset();slider.value=pct;draw()};function animate(){const start=performance.now()-Number(slider.value)*200;pauseButton.disabled=false;function tick(now){slider.value=Math.min(100,(now-start)/200);draw();if(+slider.value<100)frame=requestAnimationFrame(tick);else{frame=0;pauseButton.disabled=true;DrinkModule.setPlaybackState({running:false,brewing:false})}}frame=requestAnimationFrame(tick)}document.getElementById('play').onclick=()=>{reset();animate()};pauseButton.onclick=()=>{paused=!paused;DrinkModule.setPlaybackState({running:!paused,brewing:true});pauseButton.textContent=paused?'Resume brew':'Pause brew';if(paused){cancelAnimationFrame(frame);frame=0}else animate()};reset();</script>`);

// Exercise the asynchronous easing path with a deterministic frame clock.
let frames = new Map(), frameId = 0;
context.requestAnimationFrame = callback => { frames.set(++frameId, callback); return frameId; };
context.cancelAnimationFrame = id => frames.delete(id);
audit.setDrink('boba'); api.onProgressUpdate(80);
assert.equal(frames.size, 1, 'one progress loop');
let clock = 0;
while(frames.size && clock < 3000) {
  const pending = [...frames.values()]; frames.clear(); clock += 16;
  pending.forEach(callback => callback(clock));
}
assert.equal(frames.size, 0, 'easing settles');
assert(scene.innerHTML.includes('80%'), 'easing reaches target');
api.onProgressUpdate(95); audit.setDrink('iced_matcha');
assert.equal(frames.size, 0, 'drink swap cancels pending frames');
api.onProgressUpdate(70); api.onProgressUpdate(0);
assert.equal(frames.size, 0, 'reset cancels pending frames');
check(scene.innerHTML, 'reset during interpolation');
console.log('Animation easing, settlement, swap cancellation and reset checks passed.');
// Golden Hour upgrades must visibly add effects rather than reuse the house glow.
for (const [tier, equipment] of [['house',[]],['signature',['espresso_machine','syrup_shelf']],['mastercraft',['espresso_machine','syrup_shelf','gold_flake']]]) {
  context.ShopModule.getOwned=()=>({equipment});
  audit.setDrink('golden_hour',100);
  assert.equal(scene.innerHTML.includes('data-effect="golden-hour-mastercraft"'),tier==='mastercraft');
  assert.equal(scene.innerHTML.includes('data-effect="golden-hour-signature"'),tier==='signature');
}
console.log('Golden Hour tier-specific visual checks passed.');

// Pausing during a pour holds the visible liquid level and resumes its latest target.
assert.equal(typeof api.setPlaybackState, 'function', 'playback control is public');
api.setPlaybackState({running:true, brewing:true});
audit.setDrink('boba');
api.onProgressUpdate(80);
const firstFrames = [...frames.values()]; frames.clear(); clock += 16;
firstFrames.forEach(callback => callback(clock));
const midPour = audit.getProgress().visualPct;
assert(midPour > 0 && midPour < 80, 'pause test begins during interpolation');
api.setPlaybackState({running:false, brewing:true});
assert.equal(frames.size, 0, 'pause cancels progress interpolation');
assert.equal(scene.dataset.running, 'false', 'scene exposes paused state for preparation effects');
assert.equal(scene.dataset.brewing, 'true', 'paused brew preserves brew state');
assert.equal(audit.getProgress().visualPct, midPour, 'pause preserves current visible level');
api.onProgressUpdate(90);
assert.equal(frames.size, 0, 'progress broadcasts cannot restart paused interpolation');
assert.equal(audit.getProgress().visualPct, midPour, 'paused progress does not jump visible level');
assert.equal(audit.getProgress().currentPct, 90, 'paused progress retains latest target');
api.setPlaybackState({running:true, brewing:true});
assert.equal(frames.size, 1, 'resume starts one interpolation loop');
assert.equal(scene.dataset.running, 'true', 'scene exposes resumed state');
api.setPlaybackState({running:true, brewing:true});
assert.equal(frames.size, 1, 'repeated resume cannot duplicate loops');
const resumeDeadline = clock + 3000;
while (frames.size && clock < resumeDeadline) {
 const pending = [...frames.values()]; frames.clear(); clock += 16;
 pending.forEach(callback => callback(clock));
}
assert.equal(frames.size, 0, 'resumed interpolation settles');
assert.equal(audit.getProgress().visualPct, 90, 'resume reaches newest progress target');
check(scene.innerHTML, 'resumed pour');
api.onProgressUpdate(95);
api.setPlaybackState({running:false, brewing:false});
assert.equal(frames.size, 0, 'stopping brew cancels interpolation');
assert.equal(scene.dataset.brewing, 'false', 'scene exposes inactive brew state');
api.onProgressUpdate(0);
assert.equal(audit.getProgress().visualPct, 0, 'reset clears drink even while stopped');
api.onProgressUpdate(100);
assert.equal(audit.getProgress().visualPct, 100, 'completion is authoritative while stopped');
assert.equal(frames.size, 0, 'stopped completion does not start easing');
console.log('Playback pause, broadcast hold, resume, stopped reset and completion checks passed.');

assert(!api.generateShopCupSVG('espresso',40,'static').includes('data-preparation="pour"'), 'static previews omit preparation streams');
console.log('Static previews contain no frozen pour streams.');
