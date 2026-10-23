import{ids}from'./data/characters';import{scenes}from'./data/scenes';import type{GameState,PersonId}from'./domain/types';
const obj=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const string=(v:unknown,max=20000):v is string=>typeof v==='string'&&v.length<=max;
const array=(v:unknown,p:(x:any)=>boolean,max=10000):v is any[]=>Array.isArray(v)&&v.length<=max&&v.every(p);
const strings=(v:unknown)=>array(v,x=>string(x));
const id=(v:unknown):v is PersonId=>ids.includes(v as PersonId);
const num=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const bool=(v:unknown)=>typeof v==='boolean';
const memory=(m:unknown)=>obj(m)&&string(m.id)&&string(m.date,20)&&string(m.text)&&array(m.witnesses,id,6)&&['ordinary','boundary','promise','repair','personal'].includes(m.kind);
const intents=['art','music','study','care','boundary','repair','promise','clarify','admit','unsure','friend','withdraw','accept','decline','future','greet'];
export function validSnapshot(s:unknown):s is GameState{if(!obj(s)||s.schemaVersion!==2||!string(s.name,16)||!s.name.trim()||!Number.isInteger(s.scene)||!num(s.scene,0,scenes.length-1)||!obj(s.people))return false;
for(const who of ids){const p=s.people[who];if(!obj(p)||!obj(p.mood)||!num(p.stress,0,100)||!string(p.activity)||!strings(p.knowledge)||!array(p.memories,memory))return false;for(const key of ['attraction','familiarity','trust','understanding','dependence','expectation','uncertainty','protection','communication','stability'])if(!num(p.mood[key],0,100))return false;}
for(const key of ['facts','unresolved','promises','likes','readPosts','applied'])if(!strings(s[key]))return false;
if(!array(s.diary,memory)||!obj(s.decisions)||!Object.entries(s.decisions).every(([key,v])=>scenes.some(c=>c.id===key)&&intents.includes(v as string)))return false;
if(!array(s.messages,m=>obj(m)&&string(m.id)&&id(m.from)&&id(m.to)&&string(m.text)&&string(m.at,30)&&bool(m.read)&&(m.translation===undefined||string(m.translation))))return false;
if(!array(s.calls,c=>obj(c)&&string(c.id)&&id(c.person)&&['incoming','outgoing'].includes(c.direction)&&['ringing','missed','answered','declined'].includes(c.status)&&string(c.at,30)&&num(c.duration,0,7200)))return false;
if(!array(s.posts,p=>obj(p)&&string(p.id)&&id(p.person)&&['x','instagram'].includes(p.app)&&string(p.text)&&string(p.cn)&&string(p.at,30)&&num(p.likes,0,1000000)&&(p.private===undefined||bool(p.private))&&(p.image===undefined||string(p.image,100))))return false;
return ['unexamined','interested','uncertain','friends','withdrawn'].includes(s.feelings)&&obj(s.player)&&Number.isInteger(s.player.index)&&num(s.player.index,0,3)&&num(s.player.position,0,10000)&&bool(s.player.playing)&&bool(s.player.shuffle)&&bool(s.player.repeat)&&['spring','night','blue'].includes(s.wallpaper)&&bool(s.finished);}
