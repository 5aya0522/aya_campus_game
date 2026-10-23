export const calendar=[
{date:'2026-03-03',label:'新学年开学 · 高三分班',kind:'school'},
{date:'2026-04-28',label:'第一学期期中考（本校）',kind:'exam'},
{date:'2026-05-15',label:'班级小型作品展示（本校）',kind:'event'},
{date:'2026-06-04',label:'6月修能模拟评价',kind:'exam'},
{date:'2026-07-07',label:'第一学期期末考（本校）',kind:'exam'},
{date:'2026-07-20',label:'暑假开始（本校；补习按个人安排）',kind:'holiday'},
{date:'2026-08-24',label:'第二学期开学（本校）',kind:'school'},
{date:'2026-11-19',label:'2027学年度大学修学能力考试',kind:'exam'},
{date:'2026-12-11',label:'修能成绩发布',kind:'exam'},
{date:'2027-01-04',label:'寒假开始（本校）',kind:'holiday'},
{date:'2027-02-05',label:'毕业典礼（本校）',kind:'event'}
];
export function dayLabel(date:string){return new Intl.DateTimeFormat('zh-CN',{timeZone:'UTC',weekday:'long'}).format(new Date(date+'T12:00:00Z'));}
export const term=(date:string)=>date>='2027-02-06'?'毕业之后':date>='2026-08-24'?'第二学期':date>='2026-07-20'?'第一学期 · 暑假':'第一学期';
export function daysBetween(a:string,b:string){return Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);}
