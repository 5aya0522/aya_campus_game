import{mkdirSync,rmSync,cpSync,writeFileSync,readFileSync,existsSync}from'node:fs';
if(!existsSync('dist/sw.js'))throw Error('请先完成生产构建');
// 只重建生成目录；保留 .vercel/project.json 的同一个线上项目绑定。
rmSync('.vercel/output',{recursive:true,force:true});mkdirSync('.vercel/output/static',{recursive:true});cpSync('dist','.vercel/output/static',{recursive:true});
const source=JSON.parse(readFileSync('vercel.json','utf8'));
const routes=source.headers.map(rule=>({src:rule.source==='/(.*)'?'^/.*$':rule.source==='/assets/(.*)'?'^/assets/.*$':'^'+rule.source.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$',headers:Object.fromEntries(rule.headers.map(h=>[h.key,h.value])),continue:true}));
routes.push({handle:'filesystem'});
writeFileSync('.vercel/output/config.json',JSON.stringify({version:3,routes},null,2));
console.log('已准备 Vercel 正式静态产物；不包含源码、私人存档或登录凭据。');
