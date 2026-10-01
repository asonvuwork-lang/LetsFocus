const vm=require('node:vm'),fs=require('node:fs'),a=require('node:assert/strict');const c={document:{addEventListener(){}}};vm.createContext(c);vm.runInContext(fs.readFileSync('script-leaderboard.js','utf8')+';globalThis.lb=LeaderboardModule;',c);
const {weekSummary,rank,format}=c.lb;
let s=weekSummary({'2026-09-27':999,'2026-09-28':60,'2026-09-30':120,'2026-10-02':999},new Date('2026-10-01T23:00:00Z'));a.equal(s.seconds,180);a.equal(s.days,2);a.equal(s.start,'2026-09-28');
s=weekSummary({'2026-10-05':60,'2026-10-04':90},new Date('2026-10-05T00:00:00Z'));a.equal(s.seconds,60);
a.equal(weekSummary({a:NaN,'2026-10-01':-50},new Date('2026-10-01')).seconds,0);
a.equal(weekSummary(null).seconds,0);const rows=rank([{name:'A',seconds:60},{name:'B',seconds:90},{name:'C',seconds:90}]);a.equal(rows.map(x=>x.rank).join(','),'1,1,3');a.equal(format(10),'10s');a.equal(format(3660),'1h 1m');console.log('Weekly preview: UTC week boundaries, future exclusion, invalid totals, ties and duration formatting passed.');
