// Isolated visual audit: select recipe tiers directly so recipes whose equipment
// requirements overlap can still be compared without changing shop progression.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');const nodes=new Map();
const make=()=>({innerHTML:'',style:{},dataset:{},classList:{add(){},remove(){}},offsetWidth:1,remove(){nodes.delete(this.id)}});
const scene=make();nodes.set('drinkScene',scene);
const ctx=vm.createContext({Date,Math,console,setTimeout:()=>0,clearTimeout(){},document:{getElementById:id=>nodes.get(id),createElement:make,head:{appendChild:e=>nodes.set(e.id,e)}},ShopModule:{getOwned:()=>({equipment:[]})}});
vm.runInContext(fs.readFileSync(path.join(root,'script-drink-recipes.js'),'utf8'),ctx);
let source=fs.readFileSync(path.join(root,'script-drink.js'),'utf8').replace('if (!recipe) return null;',"if (!recipe) return null; if (typeof auditTier !== 'undefined') return {tier:auditTier,...recipe[auditTier]};").replace('return { init, onSessionStart','return { audit:{setDrink,DRINK_KEY_TO_RECIPE,SHOP_ID_TO_VISUAL,DRINKS}, init, onSessionStart');
vm.runInContext(source,ctx);const api=vm.runInContext('DrinkModule',ctx);const {audit}=api;
let renders=0;const entries=[];
for(const key of Object.keys(audit.SHOP_ID_TO_VISUAL)){
 const recipe=audit.DRINK_KEY_TO_RECIPE[key];if(!vm.runInContext('DRINK_RECIPES',ctx)[recipe])continue;
 const variants=[];
 for(const tier of ['house','signature','mastercraft']){
  ctx.auditTier=tier;
  for(const pct of [0,20,40,60,68,75,85,92,100]){
   audit.setDrink(key,pct);const svg=scene.innerHTML;
   assert(!/NaN|undefined|Infinity/.test(svg),`${key} ${tier} ${pct}`);
   const ids=[...svg.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
   for(const ref of svg.matchAll(/url\(#([^)]*)\)/g))assert(ids.includes(ref[1]),`${key}: unresolved ${ref[1]}`);
   renders++;
  }
  if(key==='cherry_blossom')assert.equal(scene.innerHTML.includes('data-effect="piped-cream"'),tier!=='house');
  if(['cherry_blossom','rose_gold','mocha','vienna_coffee','hot_choc','latte','affogato'].includes(key))assert(scene.innerHTML.includes(`data-finish=`));
  variants.push({tier,svg:scene.innerHTML});
 }
 entries.push({key,label:audit.DRINKS[audit.SHOP_ID_TO_VISUAL[key]].label,variants});
}
const namespace=(svg,ns)=>svg.replace(/id="([^"]+)"/g,(_,id)=>`id="${ns}_${id}"`).replace(/url\(#([^)]*)\)/g,(_,id)=>`url(#${ns}_${id})`);
fs.writeFileSync(path.join(__dirname,'tiers.html'),`<!doctype html><meta charset="utf-8"><title>Drink tier review</title><style>body{font:14px system-ui;background:#eee4d6;color:#493829;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}article{background:#fff9ef;border-radius:18px;padding:14px}h2{font-size:17px;margin:4px 0 12px}.variants{display:grid;grid-template-columns:repeat(3,1fr);text-align:center;gap:8px}svg{height:128px;width:100%!important}svg text{font-size:7px}svg [data-effect="completion-celebration"]{display:none}label{font-size:11px;color:#80684d}</style><h1>Every recipe, three finishes</h1><p>Controlled tier comparison · house / signature / mastercraft. In the app, equipment selects the highest eligible tier.</p><main>${entries.map(({key,label,variants},i)=>`<article><h2>${label}</h2><div class="variants">${variants.map(({tier,svg},j)=>`<div>${namespace(svg,`t${i}_${j}`)}<label>${tier}</label></div>`).join('')}</div></article>`).join('')}</main>`);
console.log(`Passed ${renders} stage renders across ${entries.length} recipes and 3 tiers; tier contact sheet generated.`);
