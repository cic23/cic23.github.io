const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const {webcrypto}=require('node:crypto');
const source=fs.readFileSync(require('node:path').join(__dirname,'../dist/api.js'),'utf8');

function transport() {
  let listener, submitted;
  const storage = new Map();
  const elements=[];
  const document={
    createElement(tag){const el={tag,children:[],contentWindow:{},append(c){this.children.push(c);},remove(){this.removed=true;},submit(){submitted=this;}};elements.push(el);return el;},
    body:{append(){}}
  };
  const window={addEventListener:(_,fn)=>listener=fn};
  const sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
  vm.runInNewContext(source,{window,document,location:{origin:'https://example.github.io'},sessionStorage,CIC_CONFIG:{apiUrl:'https://script.google.com/macros/s/deployment/exec',googleClientId:'client.apps.googleusercontent.com'},crypto:webcrypto,URL,Uint8Array,Map,Promise,Error,setTimeout,clearTimeout});
  return {api:window.CIC_API,elements,storage,get submitted(){return submitted;},emit:e=>listener(e)};
}
test('transport ignores wrong origin, wrong nonce and unrelated Google iframe',async()=>{
  const t=transport(),promise=t.api.request('challenge');
  const req=JSON.parse(t.submitted.children[0].value),frame=t.elements.find(e=>e.tag==='iframe');
  let done=false;promise.then(()=>done=true);
  const data={channel:'CIC_API_V1',requestId:req.requestId,result:{ok:true,data:{challenge:'secret'}}};
  t.emit({origin:'https://attacker.invalid',source:frame.contentWindow,data});
  t.emit({origin:'https://abc-script.googleusercontent.com',source:frame.contentWindow,data:{...data,requestId:'wrong'}});
  t.emit({origin:'https://abc-script.googleusercontent.com',source:{parent:null},data});
  await Promise.resolve();assert.equal(done,false);
  t.emit({origin:'https://abc-script.googleusercontent.com',source:{parent:frame.contentWindow},data});
  assert.equal((await promise).challenge,'secret');assert.equal(frame.removed,true);
});
test('session is sent in POST body and errors are preserved',async()=>{
  const t=transport();t.api.setSession('private-session-token');const promise=t.api.request('listPosts');
  const req=JSON.parse(t.submitted.children[0].value),frame=t.elements.find(e=>e.tag==='iframe');
  assert.equal(t.submitted.method,'POST');assert.equal(t.submitted.action.includes('private-session-token'),false);assert.equal(req.session,'private-session-token');
  t.emit({origin:'https://script.google.com',source:frame.contentWindow,data:{channel:'CIC_API_V1',requestId:req.requestId,result:{ok:false,code:'AUTH',message:'로그인이 필요합니다.'}}});
  await assert.rejects(promise,e=>e.code==='AUTH');
});
test('session survives reload storage and logout clears it',()=>{
  const t=transport();t.api.setSession('private-session-token');assert.equal(t.storage.get('cic.session.v1'),'private-session-token');t.api.clear();assert.equal(t.storage.has('cic.session.v1'),false);
});
