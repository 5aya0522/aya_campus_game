export type PersonId='aya'|'wuseon'|'sorin'|'jaemin'|'nakyung'|'eunseo';
export type Mood={attraction:number;familiarity:number;trust:number;understanding:number;dependence:number;expectation:number;uncertainty:number;protection:number;communication:number;stability:number};
export type Memory={id:string;date:string;text:string;witnesses:PersonId[];kind:'ordinary'|'boundary'|'promise'|'repair'|'personal'};
export type PersonState={mood:Mood;stress:number;activity:string;knowledge:string[];memories:Memory[]};
export type Message={id:string;from:PersonId;to:PersonId;text:string;translation?:string;at:string;read:boolean;system?:boolean};
export type CallRecord={id:string;person:PersonId;direction:'incoming'|'outgoing';status:'ringing'|'missed'|'answered'|'declined';at:string;duration:number};
export type Post={id:string;person:PersonId;app:'x'|'instagram';text:string;cn:string;at:string;private?:boolean;likes:number;image?:string};
export type Intent='art'|'music'|'study'|'care'|'boundary'|'repair'|'promise'|'clarify'|'admit'|'unsure'|'friend'|'withdraw'|'accept'|'decline'|'future'|'greet';
export type Action=
 |{type:'continue'}
 |{type:'express';text:string;channel:'story'|'chat'|'call';target?:PersonId}
 |{type:'read';person:PersonId}
 |{type:'like';post:string}
 |{type:'inspect';post:string}
 |{type:'call';operation:'answer'|'decline'|'end'|'outgoing';person?:PersonId;duration?:number}
 |{type:'music';operation:'play'|'pause'|'select'|'seek'|'shuffle'|'repeat'|'tick';index?:number;position?:number}
 |{type:'wallpaper';value:string};
export type Receipt={ok:boolean;text:string;intent?:Intent;spoken?:{ko:string;cn:string};clarify?:boolean};
export type PlayerFeelings='unexamined'|'interested'|'uncertain'|'friends'|'withdrawn';
export type GameState={schemaVersion:2;name:string;scene:number;people:Record<PersonId,PersonState>;history:Action[];facts:string[];unresolved:string[];promises:string[];messages:Message[];calls:CallRecord[];posts:Post[];likes:string[];readPosts:string[];applied:string[];diary:Memory[];feelings:PlayerFeelings;decisions:Record<string,Intent>;last:Receipt|null;player:{index:number;playing:boolean;position:number;shuffle:boolean;repeat:boolean};wallpaper:string;finished:boolean};
export type Line={speaker:PersonId;ko:string;cn:string};
export type Scene={id:string;date:string;time:string;chapter:string;title:string;place:string;paragraphs:string[];lines:Line[];gate?:'conflict'|'feelings'|'future'|'graduation';participants:PersonId[];note?:string};
export type Character={id:PersonId;name:string;ko:string;initial:string;color:string;account:string;role:string;bio:string;goal:string;connections:string;secret:string;romance:string};
