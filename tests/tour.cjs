const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname,'../script-tour.js'),'utf8');
const context = {};
vm.runInNewContext(source.replace('return { init, start, stop };','return { init, start, stop, placeCard, STEPS };')+'\nthis.tour = TourModule;',context);
const {placeCard,STEPS}=context.tour;
assert.equal(STEPS.length,19);
// Placement at each edge must remain on screen and choose an unoccluded side.
let checks=0;
for(const [W,H] of [[1280,720],[390,844],[320,568],[844,390]]) {
 const w=Math.min(380,W-24),h=Math.min(280,H-24);
 for(const [x,y] of [[12,12],[W-64,12],[12,H-64],[W-64,H-64]]) {
  const r={left:x,top:y,right:x+44,bottom:y+44};
  for(const preferred of ['left','right','top','bottom']) {
   const p=placeCard(r,w,h,{width:W,height:H},preferred);
   assert(p.x>=12 && p.y>=12 && p.x+w<=W-12 && p.y+h<=H-12);
   const overlap=Math.max(0,Math.min(p.x+w,r.right)-Math.max(p.x,r.left))*Math.max(0,Math.min(p.y+h,r.bottom)-Math.max(p.y,r.top));
   assert.equal(overlap,0);checks++;
  }
 }
}
assert.equal(placeCard({left:10,right:60,top:300,bottom:340},380,280,{width:1280,height:720},'left').side,'right');
assert.equal(placeCard({left:450,right:550,top:10,bottom:50},380,280,{width:1280,height:720},'top').side,'bottom');
assert(!source.includes('TimerModule.showTimerPage('),'Tour must not reset or start a real session');
console.log(`Passed ${checks} edge placements, side flipping, and tour preview safety checks.`);
