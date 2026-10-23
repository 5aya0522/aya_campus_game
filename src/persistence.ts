import{AUTO,MANUAL,serialize,parseSave}from'./storage';import type{GameState}from'./domain/types';
export interface SaveStore{getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void}
export const recoveryKey=(key:string)=>`${key}-recovery-v1`;
export function readSave(store:SaveStore,key:string):{game:GameState|null;recovered:boolean}{const primary=store.getItem(key);if(primary)try{return{game:parseSave(primary),recovered:false}}catch{/* 回退到最近的有效副本；不删损坏文件 */}const backup=store.getItem(recoveryKey(key));if(backup)return{game:parseSave(backup),recovered:true};if(primary)throw Error('存档和恢复副本都不可读');return{game:null,recovered:false};}
export function writeSave(store:SaveStore,key:string,game:GameState){const next=serialize(game),previous=store.getItem(key);let backup=true;if(previous===next)return{backup:true};if(previous)try{parseSave(previous);store.setItem(recoveryKey(key),previous)}catch{backup=false}store.setItem(key,next);if(store.getItem(key)!==next)throw Error('写入校验失败');return{backup};}
export function clearAuto(store:SaveStore){store.removeItem(AUTO);store.removeItem(recoveryKey(AUTO));}
export function saveExists(store:SaveStore){return Boolean(store.getItem(AUTO)||store.getItem(MANUAL));}
