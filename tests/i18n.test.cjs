const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
function load({url='https://cic23.github.io/',saved=null,blocked=false}={}){
  const values=new Map(saved?[['cic-language',saved]]:[]);
  const ctx={URL,location:new URL(url),history:{replaceState:(_a,_b,url)=>{ctx.location.href=String(url)}},localStorage:{getItem:key=>{if(blocked)throw Error('Unavailable');return values.get(key)},setItem:(key,value)=>{if(blocked)throw Error('Unavailable');values.set(key,value)}}};
  ctx.window=ctx;vm.createContext(ctx);
  for(const file of ['content.js','content.en.js','i18n.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),ctx);
  return {ctx,values,i18n:ctx.CIC_I18N};
}
test('language selection prioritizes URL, persists preference and preserves deep route',()=>{
  const {i18n,ctx,values}=load({url:'https://cic23.github.io/?lang=en#guide/wolmi',saved:'ko'});
  assert.equal(i18n.language,'en');assert.equal(values.get('cic-language'),'en');
  i18n.setLanguage('ko');assert.equal(ctx.location.hash,'#guide/wolmi');assert.equal(ctx.location.search,'?lang=ko');assert.equal(values.get('cic-language'),'ko');
  assert.equal(i18n.setLanguage('invalid'),false);assert.equal(i18n.language,'ko');
  assert.equal(load({saved:'en'}).i18n.language,'en');
});
test('language switching works when browser storage is unavailable',()=>{
  const {i18n}=load({url:'https://cic23.github.io/?lang=en',blocked:true});
  assert.equal(i18n.language,'en');assert.equal(i18n.setLanguage('ko'),true);
});
test('template localization never translates member-supplied interpolations',()=>{
  const {i18n}=load({saved:'en'});
  const memberText='회원 게시판 · 댓글 · 관리자';
  assert.equal(i18n.html(['<p>회원 게시판: ','</p>'],memberText),'<p>Member board: '+memberText+'</p>');
  i18n.setLanguage('ko');assert.equal(i18n.t('회원 게시판'),'회원 게시판');
});
test('English content covers the same heritage routes, activities and values without inventing statistics',()=>{
  const {ctx}=load({saved:'en'});const ko=ctx.CIC_CONTENT,en=ctx.CIC_CONTENT_EN;
  for(const key of ['foundingYear','memberCount','volunteerHours'])assert.equal(en[key],ko[key]);
  for(const key of ['values','places','achievements','etiquette','foreword'])assert.equal(en[key].length,ko[key].length);
  assert.equal(JSON.stringify(en.places.map(p=>p.id)),JSON.stringify(ko.places.map(p=>p.id)));
  assert.equal(JSON.stringify(en.achievements.map(p=>p.asset)),JSON.stringify(ko.achievements.map(p=>p.asset)));
  assert.equal(en.reflections,ko.reflections);
});


