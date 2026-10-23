import type{GameState,Intent,PersonId}from'./domain/types';
export interface Interpretation{intent?:Intent;reason:string;ambiguous?:boolean}
export interface NarrativeAdapter{interpret(text:string,context:{sceneId:string;target:PersonId;knownFacts:string[]}):Promise<Interpretation>}
// 本地规则只识别有限表达；未来服务端模型可实现同一个接口。前端不存放密钥。
export function interpret(text:string):Interpretation{
const t=text.trim().toLowerCase();if(!t||t.length>600)return{reason:'请写 1—600 字的行动或想法。'};
if(/(作品|设计|音乐|说唱|这首歌|游戏|画画|노래|음악|디자인)/.test(t)&&/(喜欢|좋아)/.test(t)&&!/(喜欢他|喜欢你|좋아해요|좋아해 너)/.test(t))return{intent:/(音乐|说唱|歌|노래|음악)/.test(t)?'music':'art',reason:'谈自己的兴趣；这不是对谁的告白'};
if(/(愿意交往|答应交往|接受告白|我答应|在一起吧)/.test(t)&&/(拒绝|不接受|不愿意交往)/.test(t))return{reason:'这里同时写了接受和拒绝，请澄清现在的意愿。',ambiguous:true};
if(/(是不是|是否|会不会|他喜欢我吗|他爱我吗|좋아해\?)/.test(t))return{intent:'unsure',reason:'我还无法从他的行为确定心意'};
if(/(不喜欢他|不喜欢你|没有恋爱|只做朋友|只是朋友|做朋友|当朋友|친구로)/.test(t))return{intent:'friend',reason:'保留友情，不把亲近自动当成恋爱'};
if(/(不想放弃|不会放弃|不想结束)/.test(t))return{intent:'unsure',reason:'仍然在意，但还没有作出承诺'};
if(/(放弃|退出|告别|结束关系|结束合作|不再等|不想再等|别联系|그만|떠날)/.test(t))return{intent:'withdraw',reason:'你需要离开这段等待；这不会抹掉此前的感受'};
if(/(不接受|不答应|拒绝|不愿意交往|不想谈恋爱|거절|사귀고 싶지)/.test(t))return{intent:'decline',reason:'拒绝确定恋爱关系'};
if(/(喜欢|在意|좋아|사랑)/.test(t)&&/(不确定|说不清|没想好|不知道|모르겠)/.test(t))return{intent:'unsure',reason:'在意与不确定可以同时存在'};
if(/(愿意交往|答应交往|接受告白|我答应|在一起吧|确认关系|사귀자|사귈래)/.test(t)){
 if(/(拒绝|不接受)/.test(t))return{reason:'这段话同时包含接受和拒绝，请说清目前的意愿。',ambiguous:true};
 return{intent:'accept',reason:'明确提出或接受交往，但仍需对方也愿意'};}
if(/(异地|见面频率|联系频率|毕业以后|毕业后|未来|报备|以后重逢|重逢|다시 만나|졸업 후)/.test(t))return{intent:'future',reason:'讨论关系期待与各自的现实安排'};
if(/(喜欢|在意|좋아해|마음이 있어)/.test(t)&&!/(不喜欢|不在意|不太喜欢)/.test(t))return{intent:'admit',reason:'承认你的感情；是否说给他听取决于当下在场的人'};
if(/(作品|画|设计)/.test(t)&&/为什么/.test(t)&&!/(误会|改稿|未经|解释)/.test(t))return{intent:'art',reason:'谈创作中具体的判断，而不是解释恋爱信号'};
if(/(道歉|对不起|修复|和好|미안|사과)/.test(t))return{intent:'repair',reason:'尝试修复，修复仍需要之后的行动'};
if(/(澄清|解释|说清|问清|为什么|误会|沟通|물어|설명)/.test(t))return{intent:'clarify',reason:'询问或解释具体事情，不替对方读心'};
if(/(先问|征求|允许|边界|别改|不要改|尊重|不想被|不喜欢被|距离|不想解释|혼자|허락|싫어)/.test(t))return{intent:'boundary',reason:'说明边界，双方都可以有自己的生活'};
if(/(约好|承诺|我会|守约|说到做到|약속)/.test(t))return{intent:'promise',reason:'作出一个可在之后检查的承诺'};
if(/(画|设计|作品|海报|稿|署名|时尚|游戏|玩|그림|디자인|게임)/.test(t))return{intent:'art',reason:'谈作品、个人兴趣与自己的生活'};
if(/(音乐|歌|说唱|节拍|耳机|rap|hiphop|노래|음악)/.test(t))return{intent:'music',reason:'分享音乐与具体的聆听经验'};
if(/(复习|考试|数学|作业|学习|공부|시험)/.test(t))return{intent:'study',reason:'谈学业与现实压力'};
if(/(辛苦|休息|还好吗|关心|陪你|加油|怎么了|别太累|괜찮|쉬어|힘내)/.test(t))return{intent:'care',reason:'表达关心，不要求立刻回应'};
if(/(不确定|没想好|等等|等一等|先不决定|모르겠)/.test(t))return{intent:'unsure',reason:'保留未确定的感受'};
if(/^(你好|嗨|谢谢|早安|晚安|明天见|안녕|고마워|잘 자)[！!。 .~]*$/.test(t))return{intent:'greet',reason:'一条普通问候'};
return{reason:'这句话暂时超出本地解释器的理解范围。请补充具体想谈的事情，例如作品、考试、解释误会、边界或关系期待；不会自动替你决定。'};
}
export const localAdapter:NarrativeAdapter={async interpret(text){return interpret(text)}};
export function availableContext(s:GameState,target:PersonId){return{target,knownFacts:s.people[target].knowledge};}
