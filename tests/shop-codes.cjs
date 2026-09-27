const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const data = new Map([
  ['letsfocus_beans','95'],
  ['letsfocus_shop',JSON.stringify({owned_drinks:['espresso'],owned_equipment:['frother'],active_drink:'espresso',custom:'preserved'})]
]);
let failSave=false;
const ctx = {localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(failSave&&k==='letsfocus_shop')throw Error('Storage full');data.set(k,v);}},showCustomAlert:()=>{}};
vm.createContext(ctx);
vm.runInContext(read('script-shop.js')+'\nthis.shop=ShopModule;',ctx);
vm.runInContext(read('script-drink-recipes.js')+'\nthis.recipes=DRINK_RECIPES;',ctx);
assert.equal(ctx.shop.redeemCode('wrong'),false);
failSave=true;
assert.throws(()=>ctx.shop.redeemCode('MasterBrew'));
assert.equal(data.has('letsfocus_codes_redeemed'),false);
failSave=false;
assert.equal(ctx.shop.redeemCode('  mAsTeRbReW  '),true);
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
