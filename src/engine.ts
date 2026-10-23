import {characters,ids,person} from './data/characters';import{scenes}from'./data/scenes';import{daysBetween}from'./data/calendar';import{interpret}from'./dialogue';
import type{GameState,PersonId,Mood,Memory,Action,Intent,Receipt,Post,Line}from'./domain/types';
export const tracks=[{title:'파란 여백',cn:'蓝色留白',artist:'aya · 作品集草稿',duration:186,min:0},{title:'버스 창가',cn:'公交靠窗的位置',artist:'권오선 · 放学后的节拍',duration:204,min:2},{title:'수정하지 않은 색',cn:'没有改掉的颜色',artist:'共同记忆 · 一次修复',duration:168,min:8},{title:'서로 다른 역',cn:'不同的车站',artist:'毕业前的歌单',duration:219,min:16}];
const baseMood=():Mood=>({attraction:0,familiarity:4,trust:24,understanding:5,dependence:2,expectation:8,uncertainty:38,protection:46,communication:35,stability:20});
export const current=(s:GameState)=>scenes[s.scene];
export const stamp=(s:GameState)=>`${current(s).date} ${current(s).time}`;
const cap=(n:number)=>Math.max(0,Math.min(100,n));
function mood(s:GameState,id:PersonId,changes:Partial<Mood>){for(const key of Object.keys(changes) as (keyof Mood)[])s.people[id].mood[key]=cap(s.people[id].mood[key]+changes[key]!);}
function fact(s:GameState,id:string){if(!s.facts.includes(id))s.facts.push(id);}
function known(s:GameState,who:PersonId[],id:string){for(const p of who)if(!s.people[p].knowledge.includes(id))s.people[p].knowledge.push(id);}
function remember(s:GameState,id:string,text:string,witnesses:PersonId[],kind:Memory['kind']='ordinary'){
if(s.diary.some(m=>m.id===id))return;const m={id,date:current(s).date,text,witnesses,kind};s.diary.push(m);for(const p of witnesses)s.people[p].memories.push(m);known(s,witnesses,id);}
function message(s:GameState,from:PersonId,to:PersonId,text:string,translation?:string,system=false){s.messages.push({id:`m-${s.messages.length}`,from,to,text,translation,at:stamp(s),read:from==='aya',system});}
function post(s:GameState,p:PersonId,app:Post['app'],text:string,cn:string,privateAccount=false,image?:string){s.posts.push({id:`p-${s.posts.length}`,person:p,app,text,cn,at:stamp(s),likes:4+s.scene*2,private:privateAccount,image});}
export function willing(s:GameState){const m=s.people.wuseon.mood;return s.facts.includes('creative-exchange')&&s.facts.includes('credit-preserved')&&s.facts.includes('repair-shown')&&m.attraction>=8&&m.trust>=30&&m.understanding>=24&&m.communication>=40&&!s.unresolved.includes('authorship')&&!s.facts.includes('male-boundary');}
export function fresh(name='aya'):GameState{const s:GameState={schemaVersion:2,name:name.trim().slice(0,16)||'aya',scene:0,people:Object.fromEntries(characters.map(p=>[p.id,{mood:baseMood(),stress:p.id==='wuseon'?47:35,activity:p.goal,knowledge:[],memories:[]}])) as unknown as GameState['people'],history:[],facts:[],unresolved:[],promises:[],messages:[],calls:[],posts:[],likes:[],readPosts:[],applied:[],diary:[],feelings:'unexamined',decisions:{},last:null,player:{index:0,playing:false,position:0,shuffle:false,repeat:false},wallpaper:'spring',finished:false};s.people.aya.mood.protection=58;enter(s);return s;}
function enter(s:GameState){const c=current(s);known(s,c.participants,`event:${c.id}`);if(s.scene>0){const gap=daysBetween(scenes[s.scene-1].date,c.date);for(const id of ids){s.people[id].stress=cap(s.people[id].stress+(c.id==='csat'?18:c.id==='midterm'?8:-3));if(gap>14){mood(s,id,{uncertainty:3,dependence:-1});}}mood(s,'wuseon',{familiarity:2});mood(s,'aya',{familiarity:2});if(s.feelings==='interested'&&gap>14&&!s.facts.includes('male-spoke'))mood(s,'aya',{uncertainty:4,protection:2});}
if(c.id==='new-term'){message(s,'sorin','aya','올해도 같은 반이네. 점심 같이 먹자.','今年又同班了。午饭一起吃吧。');message(s,'wuseon','aya','자료 페이지 파일은 여기로 보내면 돼.','资料页的文件发到这里就行。');post(s,'sorin','x','새 학기. 농구화부터 챙겼다.','新学期。先把篮球鞋带上。');post(s,'wuseon','x','오프라인에서도 돌아가야 한다.','离线时也得能运行。',true);post(s,'nakyung','x','올해는 내 이름을 작게 쓰지 않기로.','今年决定不再把自己的名字写得很小。',true);post(s,'aya','instagram','새 학기, 파란 여백.','新学期，蓝色留白。',false,'blue');}
if(c.id==='drawing')remember(s,'first-detail','五善问那条线是装饰，还是声音的长度。',['aya','wuseon']);
if(c.id==='rhythm'){message(s,'jaemin','aya','음악 얘기는 환영. 오늘은 가게 마감이라 늦게 답할게.','欢迎聊音乐。今天要关店，回复会晚。');post(s,'jaemin','x','튀김기 옆에서 박자를 세는 사람.','在炸锅旁边数拍子的人。');}
if(c.id==='credit'){fact(s,'credit-preserved');remember(s,'kept-color','五善修复字体，留下了你选的颜色和所有人的署名。',['aya','wuseon','nakyung','eunseo']);mood(s,'aya',{trust:4,understanding:3});if(s.facts.includes('creative-exchange'))mood(s,'wuseon',{attraction:3,understanding:4,trust:3,dependence:1,stability:2});}
if(c.id==='friend-day'){remember(s,'sorin-future','素凛告诉你家人不支持体育方向；她请你不要替她公开。',['aya','sorin'],'personal');s.people.sorin.activity='准备体能训练，并和家里谈升学方向';post(s,'eunseo','x','행사도 좋지만 오늘은 내 공부부터.','活动很好，但今天先做自己的功课。');message(s,'eunseo','aya','졸업 앨범엔 이름을 다 넣을게.','毕业册里会保留每个人的名字。');}
if(c.id==='midterm'){post(s,'wuseon','x','수리점 재고 정리. 오늘은 여기까지.','修理店盘货。今天先到这里。',true);s.people.wuseon.activity='备考，同时每周两次帮家里盘货';}
if(c.id==='showcase'){post(s,'nakyung','instagram','작은 설명서도 작업이다.','一份小小的说明书，也是作品。',false,'paper');remember(s,'nakyung-credit','娜景要求五善保留她的署名，他当面道了歉。',['aya','nakyung','wuseon','jaemin']);}
if(c.id==='exam-conflict'){s.unresolved.push('authorship');mood(s,'aya',{trust:-6,uncertainty:7,stability:-4});mood(s,'wuseon',{uncertainty:5});remember(s,'print-changed','五善未经同意改了打印稿，也删掉了出处。',['aya','wuseon','nakyung'],'boundary');message(s,'wuseon','aya','파일 바꾼 건 내 판단이었어. 얘기할 수 있을까?','改文件是我自己的决定。可以谈一下吗？');}
if(c.id==='repair-day'){if(s.decisions['exam-conflict']==='clarify'||s.decisions['exam-conflict']==='repair'||s.decisions['exam-conflict']==='boundary'){fact(s,'repair-shown');s.unresolved=s.unresolved.filter(x=>x!=='authorship');mood(s,'wuseon',{trust:4,understanding:8,communication:6});mood(s,'aya',{trust:2,understanding:5,stability:2});remember(s,'repair-in-files','五善归还原文件、补回署名，并承诺以后改稿先询问。',['aya','wuseon'],'repair');s.promises.push('五善：改动共同作品前先问过作者。');}post(s,'wuseon','x','해결했다는 말보다 수정 기록.','比起说解决了，留下修改记录。',true);}
if(c.id==='finals'){message(s,'sorin','aya','방학 훈련 일정 나왔어. 내 사진도 봐 줘.','假期训练时间出来了。也帮我看看照片。');if(s.facts.includes('creative-exchange')&&s.facts.includes('repair-shown')){fact(s,'male-noticing');mood(s,'wuseon',{attraction:5,familiarity:3,expectation:4,dependence:2,protection:-2});}post(s,'sorin','instagram','착지하는 순간까지 찍기.','拍到落地的那一刻。',false,'court');}
if(c.id==='summer-call'){s.calls.push({id:`c-${s.calls.length}`,person:'wuseon',direction:'incoming',status:'ringing',at:stamp(s),duration:0});message(s,'wuseon','aya','지금 통화 괜찮아? 평판 화면을 보여 주려고.','现在方便通话吗？想给你看一下平板画面。');}
if(c.id==='after-call'){post(s,'jaemin','x','가게 전등 교체 완료. 영수증은 내가 챙김.','店里的灯换好了。发票归我收。');if(s.calls.some(c=>c.status==='missed')){message(s,'wuseon','aya','어제 못 받았지. 급한 건 아니었어. 문자로 남길게.','昨天没接到吧。不是急事，我用文字留给你。');remember(s,'missed-followup','五善在未接来电后改发说明，没有责问你为何不接。',['aya','wuseon']);}else if(s.facts.includes('call-shared'))message(s,'wuseon','aya','어제 네 화면에서 봤던 부분부터 고쳤어.','我先修了昨天在你画面里看到的那个问题。');}
if(c.id==='feelings')remember(s,'private-feelings','素凛没有替五善解释，只问你自己的感受。',['aya','sorin'],'personal');
if(c.id==='applications'){fact(s,'own-future');s.people.aya.activity='继续完成视觉作品集；按自己的专业目标填报';remember(s,'own-future','你明确表示会继续设计，五善认可由你自己决定。',['aya','wuseon','nakyung','eunseo'],'personal');mood(s,'wuseon',{understanding:3});post(s,'aya','instagram','내가 정한 방향으로.','向我自己选择的方向。',false,'blue');post(s,'eunseo','x','앨범은 하루 20분까지만.','毕业册每天只做二十分钟。');}
if(c.id==='his-action'){if(willing(s)){fact(s,'male-spoke');known(s,['aya','wuseon'],'male-spoke');mood(s,'wuseon',{attraction:6,communication:5,expectation:5});message(s,'wuseon','aya','파일 얘기 말고, 네 얘기도 듣고 싶어. 이번엔 내가 물어볼게.','除了文件，也想听听你的事。这次换我来问。');remember(s,'he-asked','五善主动问起你的作品集，而不是只问文件进度。',['aya','wuseon']);}else{fact(s,'male-distance');message(s,'wuseon','aya','이번 주는 나경이랑 공부 계획이 있어. 다른 날 얘기하자.','这周约了娜景一起复习。改天再聊吧。');}}
if(c.id==='csat'){message(s,'wuseon','aya','수고했어. 오늘은 답 맞춰 보지 말자.','辛苦了。今天先别对答案。');post(s,'sorin','x','오늘은 따뜻한 밥부터.','今天先吃一顿热饭。');}
if(c.id==='future'){if(s.facts.includes('male-spoke')&&!s.facts.includes('male-boundary')){message(s,'wuseon','aya','너와 계속 만나고 싶어. 네 계획을 바꾸라는 뜻은 아니야.','我想继续和你见面。不是要你改变自己的计划。');remember(s,'plain-invitation','五善明确提出继续见面，同时承认未来地点还不确定。',['aya','wuseon']);}post(s,'wuseon','x','내가 할 수 있는 약속부터.','先想清楚自己能兑现哪些承诺。',true);}
if(c.id==='winter'){if(s.facts.includes('expectations-discussed')){fact(s,'plan-tested');remember(s,'plan-in-action','你们实际按商量过的频率联系，没有要求随时报备。',['aya','wuseon'],'promise');mood(s,'wuseon',{stability:5,trust:3});mood(s,'aya',{stability:5,uncertainty:-4});}if(s.promises.includes('aya：给素凛认真看一次照片。')&&!s.facts.includes('sorin-photo-kept')){s.unresolved.push('friend-promise');message(s,'sorin','aya','사진 봐 주기로 한 거, 아직 기억해? 못 하면 말해 줘.','说好帮我看照片的事，还记得吗？做不到就告诉我。');}post(s,'nakyung','x','졸업 뒤에도 내 이름으로 쓸 것.','毕业以后，也以自己的名字写下去。',true);}
}
const responses:Record<Intent,{ko:string;cn:string}>={art:{ko:'왜 그렇게 만들었는지 듣고 싶어. 취향을 바꾸라는 건 아니야.',cn:'想听听你为什么这样做。不是要你改变喜好。'},music:{ko:'같은 곡도 다르게 듣네. 그 부분 다시 들어 볼게.',cn:'同一首歌，我们听得也不一样。我再听听那一段。'},study:{ko:'오늘은 공부부터 하자. 답이 늦어도 다른 뜻은 아니야.',cn:'今天先学习吧。晚回消息不代表别的意思。'},care:{ko:'고마워. 지금은 좀 쉬고 나중에 얘기할게.',cn:'谢谢。现在先休息，晚一点再聊。'},boundary:{ko:'알겠어. 바꾸기 전에 먼저 물어볼게.',cn:'明白了。改动前会先问你。'},repair:{ko:'말로 끝내지 말고 다음에 어떻게 할지 정하자.',cn:'别只停在说法上，一起说清楚下次怎么做吧。'},promise:{ko:'무리해서 약속하지는 마. 할 수 있는 만큼이면 돼.',cn:'别勉强自己承诺。做到自己能做的就好。'},clarify:{ko:'내가 아는 것부터 설명할게. 네 뜻도 다시 들을게.',cn:'我先解释我知道的部分，也重新听听你的意思。'},admit:{ko:'말해 줘서 고마워. 바로 답하라고는 하지 말아 줘.',cn:'谢谢你告诉我。但先别要求我立刻回答。'},unsure:{ko:'모르는 건 모른다고 말해도 돼. 추측으로 정하지 말자.',cn:'不知道也可以说不知道。别用猜测来替彼此下结论。'},friend:{ko:'응. 친하다고 모두 연애인 건 아니니까.',cn:'嗯。亲近也不一定都是恋爱。'},withdraw:{ko:'네가 정한 거면 존중할게. 붙잡을 약속은 안 할게.',cn:'如果这是你的决定，我尊重。不会承诺一定把你留下。'},accept:{ko:'내 마음도 확인하고 대답할게.',cn:'我也需要确认自己的心意后再回答。'},decline:{ko:'알겠어. 마음을 바꾸라고 하지는 않을게.',cn:'知道了。我不会要求你改变心意。'},future:{ko:'서로의 계획을 바꾸지 않는 방법부터 얘기하자.',cn:'先谈谈怎么相处，才能不要求对方放弃自己的计划。'},greet:{ko:'응, 내일 봐.',cn:'嗯，明天见。'}};
function express(s:GameState,a:Extract<Action,{type:'express'}>):Receipt{
const t=a.text.trim();if(!t||t.length>600)return{ok:false,text:'请输入 1—600 字。'};
const reading=interpret(t);const target=a.target??'wuseon';const c=current(s);if(a.channel==='chat'||a.channel==='call')message(s,'aya',target,t,/[가-힣]/.test(t)&&reading.intent?'本地意图释义：'+reading.reason:undefined);
if(!reading.intent)return{ok:false,text:reading.reason,clarify:true};const intent=reading.intent;
// 人物只听见实际在场或直接发送给自己的话。私下承认感情不会让男主全知。
const witnesses:PersonId[]=a.channel==='story'?Array.from(new Set<PersonId>(['aya',...c.participants])):['aya',target];
const speaksToMale=witnesses.includes('wuseon');const emotionTalk=['admit','accept','decline','friend','withdraw'].includes(intent);
if(a.channel==='story'&&c.gate){const allowed:Record<string,Intent[]>={conflict:['clarify','repair','boundary','withdraw','friend'],feelings:['admit','unsure','friend','withdraw','decline'],future:['future','friend','withdraw','decline','unsure','accept'],graduation:['accept','admit','decline','friend','withdraw','future','unsure']};if(!allowed[c.gate].includes(intent))return{ok:false,text:`已理解你在${reading.reason}。这不会替代当前需要你说清的${c.gate==='conflict'?'合作边界':c.gate==='feelings'?'自己的感情':c.gate==='future'?'以后怎么相处':'关系意愿'}；你的输入已保留，请再表达一下。`,clarify:true};s.decisions[c.id]=intent;}
const key=`${c.id}:${target}:${intent}:${a.channel==='story'&&c.id==='feelings'?'private':'shared'}`;
let spoken=responses[intent];const repeat=s.applied.includes(key);if(!repeat){s.applied.push(key);remember(s,`input:${key}`,`${a.channel==='story'?'当时你写道':`你对${person(target).name}说`}：“${t}”`,witnesses,emotionTalk?'personal':intent==='promise'?'promise':intent==='boundary'?'boundary':'ordinary');
if(speaksToMale){
 mood(s,'wuseon',{familiarity:1});
 if(intent==='art'||intent==='music'){fact(s,'creative-exchange');mood(s,'wuseon',{understanding:3,attraction:c.id==='new-term'?0:1});mood(s,'aya',{understanding:3,attraction:2});}
 if(intent==='care')mood(s,'wuseon',{trust:1,uncertainty:-1});
 if(intent==='boundary')mood(s,'wuseon',{understanding:2,communication:2});
 if(intent==='clarify'||intent==='repair'){mood(s,'wuseon',{understanding:3,communication:3});if(s.unresolved.includes('authorship')){fact(s,'repair-requested');if(s.scene>8){fact(s,'repair-shown');s.unresolved=s.unresolved.filter(x=>x!=='authorship');remember(s,'late-repair','五善在再次沟通后补回出处，并开始改稿前询问。',['aya','wuseon'],'repair');mood(s,'wuseon',{trust:3,understanding:5});}}if(s.calls.some(x=>x.status==='missed'))fact(s,'missed-explained');}
 if(intent==='admit'&&s.scene<9){fact(s,'early-disclosure');spoken={ko:'아직 네 마음에 같은 답을 할 수는 없어. 너를 더 알아야 해.',cn:'我现在还不能给你相同的回答。我还需要更了解你。'};mood(s,'wuseon',{uncertainty:3,protection:2});}
 if(intent==='boundary'&&s.scene<7)fact(s,'boundaries-spoken');
 if(intent==='future'&&s.scene>=16){fact(s,'expectations-discussed');mood(s,'wuseon',{understanding:4,communication:4,uncertainty:-4});mood(s,'aya',{uncertainty:-3,communication:4});}
 if(intent==='withdraw'&&c.id!=='graduation'){fact(s,'male-boundary');mood(s,'wuseon',{expectation:-4,protection:4});}
 if((intent==='admit'||intent==='accept')&&s.scene>=14){if(willing(s)){fact(s,'mutual-talk');spoken={ko:'나도 너를 좋아해. 하지만 계획까지 같다는 뜻은 아니니까, 같이 얘기하고 싶어.',cn:'我也喜欢你。但这不代表我们连未来计划都相同，所以我想一起谈。'};}else spoken={ko:'너를 소중하게 생각하지만 같은 마음이라고 말할 수는 없어.',cn:'我珍惜你，但不能说自己也抱有相同的心意。'};}
}
if(!speaksToMale&&a.channel!=='story'){mood(s,target,{familiarity:1,communication:1,trust:intent==='care'||intent==='art'?1:0});}
if(a.channel==='story'&&c.gate==='feelings'){
 s.feelings=intent==='admit'?'interested':intent==='friend'||intent==='decline'?'friends':intent==='withdraw'?'withdrawn':'uncertain';
 mood(s,'aya',{protection:intent==='withdraw'?4:-1,communication:2,uncertainty:intent==='unsure'?3:-2});
}
if(intent==='art'&&witnesses.includes('sorin')){fact(s,'sorin-photo-kept');s.unresolved=s.unresolved.filter(x=>x!=='friend-promise');mood(s,'sorin',{trust:3,understanding:3});}
if(intent==='promise'&&witnesses.includes('sorin')&&!s.promises.includes('aya：给素凛认真看一次照片。'))s.promises.push('aya：给素凛认真看一次照片。');
if(intent==='art'){s.people.aya.activity='正在完成自己的作品，而不是只等一条回复';fact(s,'aya-art');}
if(intent==='withdraw'&&a.channel==='story'&&c.gate!=='conflict')s.feelings='withdrawn';
if(intent==='friend'&&a.channel==='story'&&c.gate!=='conflict')s.feelings='friends';
}
if(target!=='wuseon'&&a.channel!=='story'){
 const map:Partial<Record<PersonId,{ko:string;cn:string}>>={sorin:{ko:intent==='art'?'발이 잘리지 않았는지도 봐 줘. 네 그림도 보고 싶어.':'내가 아는 건 네가 말해 준 것뿐이야. 대신 답을 정해 주지는 않을게.',cn:intent==='art'?'也帮我看看脚有没有被裁掉。我也想看看你的画。':'我只知道你告诉过我的事。不会替你下决定。'},jaemin:{ko:'지금은 가게 일이 있어. 네 말은 읽었고, 끝나고 얘기하자.',cn:'现在店里有事。你的话看到了，忙完再聊。'},nakyung:{ko:'내 생각도 다를 수 있어. 네가 한 말은 그대로 듣고 얘기할게.',cn:'我的想法可能不同。我会先听清你实际说了什么。'},eunseo:{ko:'가능한 시간부터 맞춰 보자. 무조건 된다고는 못 하겠어.',cn:'先对一下方便的时间。我不能什么都答应。'}};
 spoken=map[target]??spoken;
}
if(a.channel==='story'&&c.id==='feelings')spoken={ko:'네가 말하기 전에는 내가 아무한테도 말하지 않을게.',cn:'在你自己开口前，我不会告诉任何人。'};
if(a.channel==='chat'||a.channel==='call')message(s,target,'aya',spoken.ko,spoken.cn);
return{ok:true,intent,text:repeat?'对话已保留。这次没有重复改变心理状态；同一个话题不能用来刷关系。':reading.reason,spoken};
}
export function dispatch(state:GameState,a:Action):GameState{
 const s=structuredClone(state);s.last=null;
 if(a.type==='continue'){
  if(s.finished)return state;
  const c=current(s);if(c.gate&&!s.decisions[c.id]){s.last={ok:false,text:'这件事需要你自己的意愿。请在下方写下想法，再继续。'};return s;}
  for(const call of s.calls)if(call.status==='ringing'){call.status='missed';remember(s,`missed:${call.id}`,'你没有接到五善演示程序的视频电话。',['aya','wuseon']);mood(s,'wuseon',{uncertainty:2});}
  if(s.scene===scenes.length-1){s.finished=true;s.player.playing=false;}else{s.scene++;enter(s);}
 }
 if(a.type==='express'){if(s.finished){if(a.channel!=='story'&&a.target)message(s,'aya',a.target,a.text);s.last={ok:false,text:'当前学年已结束，消息会保留，但不会在结局后偷偷改写人物关系。继续人生的章节尚未展开。'};}else s.last=express(s,a);}
 if(a.type==='read')for(const m of s.messages)if(m.from===a.person&&m.to==='aya')m.read=true;
 if(a.type==='like'&&s.posts.some(p=>p.id===a.post)){s.likes=s.likes.includes(a.post)?s.likes.filter(x=>x!==a.post):[...s.likes,a.post];}
 if(a.type==='inspect'){const p=s.posts.find(x=>x.id===a.post);if(p&&!s.readPosts.includes(p.id)){s.readPosts.push(p.id);if(p.person==='nakyung'&&p.app==='x'){known(s,['aya'],'nakyung-values-credit');remember(s,'credit-clue','娜景在开学时就写过：今年不再把自己的名字写得很小。这条动态原本与恋爱无关。',['aya']);s.last={ok:true,text:'一条旧动态，让你重新理解她对署名的坚持。这个线索只进入你的记忆。'};}}}
 if(a.type==='call'){
  if(a.operation==='outgoing'&&a.person&&a.person!=='aya'){
   const busy=a.person==='wuseon'&&(s.scene<10||!s.facts.includes('call-shared'));
   s.calls.push({id:`c-${s.calls.length}`,person:a.person,direction:'outgoing',status:busy?'missed':'answered',at:stamp(s),duration:0});
   s.last={ok:true,text:busy?'对方现在不方便。没有人必须随叫随到。':'已接通模拟通话，可以在手机里挂断。'};
  }else{const call=[...s.calls].reverse().find(c=>c.status==='ringing'||(c.status==='answered'&&c.duration===0));if(call){if(a.operation==='answer'&&call.status==='ringing'){call.status='answered';fact(s,'call-shared');remember(s,'call-shared','你接起演示程序的视频电话。五善先问能否看画稿，只在你同意后讨论设计。',['aya','wuseon']);mood(s,'wuseon',{understanding:3,trust:2,dependence:2,stability:2});message(s,'wuseon','aya','예전에 예의를 호감으로 착각한 적이 있어. 그래서 이번엔 묻고 싶어.','以前把别人的礼貌误以为好感。所以这一次，我想先问清楚。');known(s,['aya','wuseon'],'his-past');}if(a.operation==='decline'&&call.status==='ringing'){call.status='declined';remember(s,`declined:${call.id}`,'你没有接通这次视频电话。',['aya','wuseon']);}if(a.operation==='end'&&call.status==='answered'){call.duration=Math.max(1,Math.min(7200,a.duration??1));fact(s,'call-completed');}}}
 }
 if(a.type==='music'){
  const max=tracks.filter(t=>t.min<=s.scene).length;
  if(a.operation==='play'){s.player.playing=true;const key=`listen:${s.player.index}`;if(!s.facts.includes(key)){fact(s,key);remember(s,key,`你听了“${tracks[s.player.index].cn}”，一首歌没有替任何人承认爱情。`,['aya']);}}
  if(a.operation==='pause')s.player.playing=false;
  if(a.operation==='select'&&Number.isInteger(a.index)&&a.index!>=0&&a.index!<max){s.player.index=a.index!;s.player.position=0;}
  if(a.operation==='seek'&&Number.isFinite(a.position))s.player.position=Math.max(0,Math.min(10000,a.position!));
  if(a.operation==='shuffle')s.player.shuffle=!s.player.shuffle;
  if(a.operation==='repeat')s.player.repeat=!s.player.repeat;
 }
 if(a.type==='wallpaper'&&['spring','night','blue'].includes(a.value))s.wallpaper=a.value;
 s.history.push(a);return s;
}
export function contextual(s:GameState):{paragraphs:string[];lines:Line[]}{const c=current(s);const paragraphs=[...c.paragraphs],lines=[...c.lines];
 if(c.id==='rhythm'&&s.facts.includes('creative-exchange'))paragraphs.push('五善记得你说过作品里的线是节奏，而不只是装饰。这次他把平板转过来，先问你想听哪一段。');
 if(c.id==='repair-day'){if(!s.facts.includes('repair-shown')){paragraphs[1]='你暂时没有决定解释或继续合作。五善把文件放回共享目录，没有再追问。改稿的事情仍未解决，你们说话比以前更短了。';lines.splice(0,1,{speaker:'wuseon',ko:'파일은 돌려놨어. 지금 얘기하기 싫으면 기다릴게.',cn:'文件放回去了。如果现在不想谈，我先等。'});}else paragraphs.push('这一次修复留下的是修改记录。你还没有义务马上消气，他也没有要求你给他一个好看的回答。');}
 if(c.id==='after-call'){paragraphs.push(s.facts.includes('call-shared')?'昨晚通话时，他认真听完了你对画面的解释。你们没有谈恋爱，却多知道了一点对方是怎样工作的人。':s.facts.includes('missed-explained')?'你已经解释过昨晚不方便，他知道你不是故意忽略。':s.calls.some(x=>x.status==='missed')?'昨晚的未接记录还在。五善不知道你当时在改画，你也还没把这件事说给他听。':'你拒接了来电，他改用文字说明。一次不方便不等于拒绝一个人。');}
 if(c.id==='his-action'){if(s.facts.includes('male-spoke')){paragraphs.push('他拿出来的，正是那张后来补回了出处的打印稿。“我有时只会修文件，”他说，“但那天你并不是在等一个修好的文件。”他问你，周末能不能看看你的作品集。');lines.push({speaker:'wuseon',ko:'이번엔 네가 바쁜 날을 먼저 물어볼게.',cn:'这次，我先问你哪天忙。'});}else{paragraphs.push('他先确认了娜景明天的复习时间，然后把资料交给你。你可以失落，也可以不往恋爱上理解。有人与你合作顺畅，并不代表他已经打算和你交往。');lines.push({speaker:'wuseon',ko:'나는 아직 그런 관계를 생각하고 있지는 않아.',cn:'我现在还没有在考虑那样的关系。'});}}
 if(c.id==='graduation'){lines.push(s.facts.includes('male-spoke')&&!s.facts.includes('male-boundary')?{speaker:'wuseon',ko:'좋아한다는 말은 내가 할게. 만날지는 네가 정해 줘. 서로의 계획도 지키면서.',cn:'喜欢这句话，由我先说。要不要交往，请你决定。我们也要守住各自的计划。'}:{speaker:'wuseon',ko:'네 작업은 기억할 거야. 같은 마음인 척하고 싶지는 않아.',cn:'我会记得你的作品。但不想假装自己也有同样的感情。'});if(s.unresolved.includes('friend-promise'))paragraphs.push('素凛把相机包拉上：你答应看她的照片，却一直没抽出时间。她没有因此停止做你的朋友，只是不再把所有期待都放在你身上。');}
 if(s.feelings==='withdrawn'&&s.scene>=14)paragraphs.push('你已经决定不再无限期等待。听见他后来的话，仍然可以有情绪，但并不意味着你必须改变决定。');
 return{paragraphs,lines};}
export function ending(s:GameState){const decision=s.decisions.graduation;const reasons:string[]=[];
 if(s.facts.includes('creative-exchange'))reasons.push('共同创作让你们认识到彼此怎样思考，而不是只记住外表。');
 if(s.facts.includes('repair-shown'))reasons.push('那次改稿冲突留下了实际的修复，信任没有被一句道歉直接复原。');else reasons.push('未经同意改稿的事情始终没有被真正说清。');
 if(s.facts.includes('call-shared'))reasons.push('暑假的演示通话让你们看见对方工作时真实的样子。');
 if(s.facts.includes('expectations-discussed'))reasons.push('你们谈过以后怎么联系、怎样保留自己的计划。');else reasons.push('未来的地点和关系期待还没有形成可实行的安排。');
 const love=willing(s)&&s.facts.includes('male-spoke');const consent=decision==='accept'||decision==='admit';
 if(decision==='friend'||s.feelings==='friends')return{title:'朋友这个名字，足够认真',label:'友情',text:'你没有把陪伴误认成必须恋爱的承诺。你们交换了毕业后的联系方式，各自继续自己的方向。朋友不是爱情失败后的安慰奖。',reasons};
 if(decision==='future')return{title:'再见时，不必沿用旧答案',label:'重逢 · 尾声',text:'毕业时你没有答应交往。2028年初夏，你在一次独立设计展上与他重逢。他先问你是否方便聊聊。旧记忆还在，但你们都没有假装，重逢本身就能让关系重新开始。下一次的决定仍然属于现在的你。',reasons};
 if(decision==='withdraw'||decision==='decline'||s.feelings==='withdrawn')return{title:'比回应更早的告别',label:love?'错过':'自己的方向',text:love?'五善终于把喜欢说清，你却已经在漫长的不确定里走远。你没有因为被喜欢而逃跑，也没有义务把已经结束的等待重新开始。他听见了你的拒绝。':'你选择把精力放回自己的作品与生活。那些关心与误会都是真的，但没有一件事要求你无限期留下。',reasons};
 if(consent&&love&&s.facts.includes('expectations-discussed')&&s.facts.includes('plan-tested')&&!s.unresolved.includes('authorship'))return{title:'我们之间，有了一个名字',label:'交往 · 从商量开始',text:'你答应了他。不是因为等待终于被奖励，而是你们已经学会在不理解时询问，在改动前征求同意，并承认未来可能在不同城市。你们约定可以说累、可以讨论，也保留各自的生活。关系从这里开始，不替你们保证一生。',reasons};
 if(consent&&!love)return{title:'有一个人的春天，先到了',label:'单恋',text:'你终于把心意说出口。他认真听完，也明确说自己没有相同的感情。你会难过，却不需要为了得到回应把兴趣、作品或性格改成另一个样子。',reasons};
 return{title:'未命名的距离',label:love?'互相在意，却没有确认':'未确定',text:love?'你们都说过在意，却没有在现实安排和关系期待上得到共同答案。毕业没有替你们确认交往，也没有抹掉此前的认真。':'你没有在没想清楚时答应任何事。彼此的陪伴与误会都留在这一年，未来仍然有尚未认识的人与新的生活。',reasons};}
export function visibleMemories(s:GameState,id:PersonId){return s.people[id].memories.filter(m=>m.witnesses.includes('aya'));}
export function incoming(s:GameState){return s.calls.find(c=>c.status==='ringing');}
