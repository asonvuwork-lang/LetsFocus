const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const data = new Map([
  ['letsfocus_beans','95'],
  ['letsfocus_shop',JSON.stringify({owned_drinks:['espresso'],owned_equipment:['frother'],active_drink:'espresso',custom:'preserved'})]
]);
let failSave=false, failMarker=false;
const messages=[];
const ctx = {localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>{if((failSave&&k==='letsfocus_shop')||(failMarker&&k==='letsfocus_codes_redeemed'))throw Error('Storage full');data.set(k,v);}},showCustomAlert:m=>messages.push(m)};
vm.createContext(ctx);
vm.runInContext(read('script-shop.js').replace('return { init, awardBeans', 'return { redeemCodeResult, init, awardBeans')+'\nthis.shop=ShopModule;',ctx);
vm.runInContext(read('script-drink-recipes.js')+'\nthis.recipes=DRINK_RECIPES;',ctx);
assert.equal(ctx.shop.redeemCode('wrong'),false);
failSave=true;
assert.equal(ctx.shop.redeemCode('MasterBrew'),false);
assert.match(messages.at(-1), /could not save/);
assert.equal(data.has('letsfocus_codes_redeemed'),false);
failSave=false;
assert.equal(ctx.shop.redeemCode('  mAsTeR \n bReW  '),true);
const owned=ctx.shop.getOwned();
assert.equal(owned.drinks.length,ctx.shop.DRINKS.length+1);
assert.equal(owned.equipment.length,ctx.shop.EQUIPMENT.length);
assert(ctx.shop.getCodeDrinks().includes('birthday_cake'));
assert.equal(owned.activeDrink,'espresso');
assert.equal(data.get('letsfocus_beans'),'95');
assert.equal(JSON.parse(data.get('letsfocus_shop')).custom,'preserved');
// Check actual recipe requirements against the production equipment mapping.
const mapping=read('script-drink.js').match(/const EQUIP_ID_MAP = (\{[\s\S]*?\n  \});/)[1];
const equipmentMap=vm.runInNewContext('('+mapping+')');
const equipmentNames=new Set(owned.equipment.map(id=>equipmentMap[id]));
for(const [id,recipe] of Object.entries(ctx.recipes)) {
 for(const requirement of recipe.mastercraft?.requires || []) assert(equipmentNames.has(requirement),`${id} missing ${requirement}`);
}
const saved=data.get('letsfocus_shop');
assert.equal(ctx.shop.redeemCode('MASTERBREW'),false);
assert.equal(data.get('letsfocus_shop'),saved);
assert.equal(ctx.shop.redeemCode('YouDeserveIt'),true);
assert.equal(ctx.shop.getOwned().drinks.length,owned.drinks.length);
console.log('Passed: all drinks and equipment, Mastercraft requirements, case-insensitive redemption, duplicates, existing rewards, saved data and storage failure.');

assert.equal(ctx.shop.redeemCodeResult(' ').status,'empty');
assert.equal(ctx.shop.redeemCodeResult('unknown').status,'unknown');
assert.equal(ctx.shop.redeemCodeResult('MasterBrew').status,'redeemed');
const registry={old:{reward:'drink',drinkId:'espresso',expiresAt:'2020-01-01T00:00:00Z'}};
assert.equal(ctx.shop.redeemCodeResult('old',registry,Date.parse('2021-01-01')).status,'expired');

// The authoritative marker lives in the same write as rewards, even if legacy storage fails.
failMarker=true;
const extra={test:{reward:'drink',drinkId:'espresso',message:'Saved'}};
assert.equal(ctx.shop.redeemCodeResult('test',extra).ok,true);
assert.equal(ctx.shop.redeemCodeResult('test',extra).status,'redeemed');
assert.equal(ctx.shop.getOwned().drinks.length,owned.drinks.length);
console.log('Passed: empty, unknown, expired, already redeemed, whitespace, and atomic reward storage.');
