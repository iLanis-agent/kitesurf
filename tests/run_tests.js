/* Kitesurf tests: engine vs tests/expected.json (python oracle). */
'use strict';
const fs=require('fs'),path=require('path');
const K=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
const tol=(a,b,t)=>a===null&&b===null||(a!==null&&b!==null&&Math.abs(a-b)<=t);
function ok(){pass++;}
function bad(l,a,b){fail++;console.log('FAIL '+l+': got '+JSON.stringify(a)+' want '+JSON.stringify(b));}
function objEq(a,b,keys,t){
  if(a===null&&b===null)return true;
  if(!a||!b)return false;
  return keys.every(k=>tol(a[k],b[k],t)||a[k]===b[k]);
}
for(const it of items){
  const T=it.kind+' '+JSON.stringify(it.args);
  let r, good;
  if(it.kind==='area'){r=K.kiteArea(it.args[0],it.args[1]);good=tol(r,it.oracle,0.15);}
  else if(it.kind==='nearest'){r=K.nearestSize(it.args[0]);good=objEq(r,it.oracle,['pick','smaller','larger'],0.01);}
  else if(it.kind==='windfor'){r=K.windForKite(it.args[0],it.args[1]);good=objEq(r,it.oracle,['ideal','min','max'],0.15);}
  else if(it.kind==='beaufort'){r=K.beaufort(it.args[0]);good=objEq(r,it.oracle,['force','name'],0);}
  else if(it.kind==='convert'){r=K.convert(it.args[0]);good=objEq(r,it.oracle,['kmh','mph','ms'],0.15);}
  else{r=K.boardBand(it.args[0]);good=objEq(r,it.oracle,['min','max'],0);}
  if(good)ok(); else bad(T,r,it.oracle);
}
/* known references: 75kg at 15kn -> 11.0m2 picking an 11m kite; 15kn is Beaufort 4 */
const a=K.kiteArea(75,15), n=K.nearestSize(a);
if(a===11&&n&&n.pick===11&&n.smaller===10&&n.larger===12)pass++; else bad('ref 75/15',{a:a,n:n},'11/11/10/12');
const bf=K.beaufort(15);
if(bf&&bf.force===4&&bf.name==='Moderate breeze')pass++; else bad('ref bf15',bf,'F4');
/* tie rule: 8.5 picks 8 (smaller wins) */
const tie=K.nearestSize(8.5);
if(tie&&tie.pick===8)pass++; else bad('tie 8.5',tie,'8');
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
