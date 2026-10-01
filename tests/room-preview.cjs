const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const c={structuredClone,document:{addEventListener(){}}};vm.createContext(c);vm.runInContext(fs.readFileSync('script-room.js','utf8')+';globalThis.room=StudyRoomModule;',c);
const {initial,reduce}=c.room;let s=initial();assert.equal(reduce(s,{type:'capacity',value:2}).capacity,4);assert.equal(s.members.length,3);
s=reduce(s,{type:'lock'});assert.equal(reduce(s,{type:'join'}).members.length,3);
s=reduce(s,{type:'disconnect'});assert.equal(reduce(s,{type:'remove',id:'sam'}).members.length,3);s=reduce(s,{type:'reconnect'});s=reduce(s,{type:'remove',id:'you'});assert.equal(s.members.length,3);
s=reduce(s,{type:'transfer',id:'sam'});assert.equal(reduce(s,{type:'remove',id:'lee'}).members.length,3);
s=reduce(initial(),{type:'leave'});assert.equal(s.host,'sam');assert.equal(s.joined,false);assert.equal(reduce(s,{type:'join'}).members.length,2);
s=reduce(initial(),{type:'join'});assert.equal(s.members.length,4);assert.equal(reduce(s,{type:'join'}).members.length,4);
console.log('Room preview: capacity, lock, disconnect, host permissions, self-removal guard, leave and host transfer passed.');
