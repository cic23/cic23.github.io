/** CIC backend. Deploy as owner, access: Anyone. All private actions require a session. */
const TABLES_ = ['Members', 'Posts', 'Comments', 'Sessions', 'Attachments', 'Likes'];
const SESSION_MS_ = 6 * 60 * 60 * 1000;
const MAX_ATTACHMENTS_ = 5;
const MAX_ATTACHMENT_BYTES_ = 100 * 1024 * 1024;
const MEDIA_TYPES_ = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];

function setup() {
  const p = PropertiesService.getScriptProperties();
  ['SPREADSHEET_ID', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'SITE_ORIGIN', 'ADMIN_EMAILS'].forEach(k => {
    if (!p.getProperty(k)) throw new Error('스크립트 속성이 필요합니다: ' + k);
  });
  const origin = p.getProperty('SITE_ORIGIN');
  if (!/^https:\/\/[a-zA-Z0-9.-]+(?::\d+)?$/.test(origin)) throw new Error('SITE_ORIGIN은 경로와 마지막 /가 없는 HTTPS 출처여야 합니다.');
  const db = SpreadsheetApp.openById(p.getProperty('SPREADSHEET_ID'));
  TABLES_.forEach(name => {
    let sheet = db.getSheetByName(name);
    if (!sheet) sheet = db.insertSheet(name);
    if (sheet.getLastRow() === 0) { sheet.appendRow(['id', 'data_json']); sheet.setFrozenRows(1); }
    else if (sheet.getRange(1, 1, 1, 2).getValues()[0].join('|') !== 'id|data_json') throw new Error('기존 시트 형식이 다릅니다: ' + name);
  });
  return '준비 완료';
}

function doGet() {
  return HtmlService.createHtmlOutput('<!doctype html><html lang="ko"><body><p>CIC 서버입니다. 회원 서비스는 CIC 홈페이지에서 이용해주세요.</p></body></html>');
}

function doPost(e) {
  let requestId = '', result;
  const origin = PropertiesService.getScriptProperties().getProperty('SITE_ORIGIN');
  if (!origin || !/^https:\/\/[a-zA-Z0-9.-]+(?::\d+)?$/.test(origin)) return HtmlService.createHtmlOutput('서버 설정이 필요합니다.');
  let lock;
  try {
    if (!e || !e.parameter || !e.parameter.payload || e.parameter.payload.length > 40000) fail_('INVALID', '요청 크기 또는 형식이 올바르지 않습니다.');
    const r = JSON.parse(e.parameter.payload);
    requestId = r.requestId;
    if (!/^[a-f0-9]{64}$/.test(requestId || '') || r.origin !== origin) fail_('INVALID', '허용되지 않은 요청입니다.');
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) fail_('BUSY', '다른 요청을 처리 중입니다. 잠시 후 다시 시도해주세요.');
    result = { ok: true, data: dispatch_(r) };
  } catch (err) {
    result = { ok: false, code: err.cicCode || 'SERVER', message: err.cicCode ? err.message : '요청을 처리하지 못했습니다. 관리자에게 서버 설정을 확인해 달라고 요청해주세요.' };
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
  // POST + hidden iframe avoids dependence on cross-origin fetch/CORS behavior.
  // The result is never broadcast. The frontend also checks frame ancestry,
  // Google script origin and an unpredictable per-request identifier.
  const payload = JSON.stringify({ channel: 'CIC_API_V1', requestId, result }).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return HtmlService.createHtmlOutput('<!doctype html><html><head><meta charset="utf-8"></head><body><script>window.top.postMessage(' + payload + ',' + JSON.stringify(origin) + ');</script></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function dispatch_(r) {
  const a = r.action, d = r.data || {};
  if (a === 'challenge') {
    const challenge = random_();
    CacheService.getScriptCache().put('login:' + hash_(challenge), '1', 300);
    return { challenge };
  }
  if (a === 'login') return login_(d);
  // Public content is deliberately exposed only through these two projections.
  // All identity, write and audit operations still require a verified session.
  if (a === 'listPosts') return listPosts_(d, reader_(r.session));
  if (a === 'getPost') return getPost_(d, reader_(r.session));
  const auth = authenticate_(r.session);
  if (a === 'logout') { remove_('Sessions', auth.session.id); return {}; }
  if (a === 'me') return { member: publicMember_(auth.member) };
  const m = auth.member;
  if (m.status !== 'approved') fail_('PENDING', '회원 상태를 확인할 수 없습니다. 다시 로그인해주세요.');
  if (a === 'listMembers') { admin_(m); return { members: rows_('Members').map(x => ({ id: x.id, name: x.name, email: x.email, status: x.status, role: x.role, createdAt: x.createdAt })) }; }
  rate_(m.id);
  if (a === 'setMemberStatus') {
    admin_(m);
    const target = find_('Members', d.id);
    if (!target) fail_('NOT_FOUND', '회원을 찾을 수 없습니다.');
    if (target.role === 'admin') fail_('FORBIDDEN', '관리자 상태는 여기서 변경할 수 없습니다.');
    if (!['pending', 'approved', 'blocked'].includes(d.status)) fail_('INVALID', '회원 상태가 올바르지 않습니다.');
    target.status = d.status; target.updatedAt = now_(); save_('Members', target);
    if (d.status !== 'approved') rows_('Sessions').filter(s => s.memberId === target.id).forEach(s => remove_('Sessions', s.id));
    return { member: publicMember_(target) };
  }
  if (a === 'createPost') {
    const mid = mutation_(d.mutationId);
    const old = rows_('Posts').find(x => x.authorId === m.id && x.mutationId === mid);
    if (old) return { post: publicPost_(old) };
    const category = category_(d.category, m);
    const attachments = attachments_(d.attachmentIds, m, null);
    const post = { id: Utilities.getUuid(), title: text_(d.title, 120), summary: text_(d.summary, 300), body: text_(d.body, 10000), attachments: attachments.map(x => x.id), category, authorId: m.id, authorName: m.name, createdAt: now_(), updatedAt: now_(), version: 1, deleted: false, mutationId: mid };
    attachments.forEach(x => { x.postId = post.id; x.updatedAt = now_(); save_('Attachments', x); });
    save_('Posts', post); return { post: publicPost_(post) };
  }
  if (a === 'updatePost' || a === 'deletePost') {
    const p = activePost_(d.id); owner_(m, p.authorId); version_(p, d.version);
    if (a === 'deletePost') p.deleted = true;
    else {
      const attachments = attachments_(d.attachmentIds, m, p.id);
      (p.attachments || []).filter(id => !attachments.some(x => x.id === id)).forEach(id => detach_(id, p.id));
      attachments.forEach(x => { x.postId = p.id; x.updatedAt = now_(); save_('Attachments', x); });
      p.title = text_(d.title, 120); p.summary = text_(d.summary, 300); p.body = text_(d.body, 10000); p.attachments = attachments.map(x => x.id); p.category = category_(d.category, m);
    }
    p.version++; p.updatedAt = now_(); save_('Posts', p); return { post: publicPost_(p) };
  }
  if (a === 'createComment') {
    activePost_(d.postId);
    const mid = mutation_(d.mutationId);
    const old = rows_('Comments').find(x => x.authorId === m.id && x.mutationId === mid && x.postId === d.postId);
    if (old) return { comment: publicComment_(old) };
    const c = { id: Utilities.getUuid(), postId: d.postId, body: text_(d.body, 2000), authorId: m.id, authorName: m.name, createdAt: now_(), updatedAt: now_(), version: 1, deleted: false, mutationId: mid };
    save_('Comments', c); return { comment: publicComment_(c) };
  }
  if (a === 'toggleLike') {
    const p = activePost_(d.postId), old = rows_('Likes').find(x => x.postId === p.id && x.memberId === m.id);
    if (old) { remove_('Likes', old.id); return { liked: false, likeCount: likeCount_(p.id) }; }
    save_('Likes', { id: Utilities.getUuid(), postId: p.id, memberId: m.id, memberName: m.name, createdAt: now_() });
    return { liked: true, likeCount: likeCount_(p.id) };
  }
  if (a === 'listLikes') { admin_(m); const p = activePost_(d.postId); return { likes: rows_('Likes').filter(x => x.postId === p.id).map(x => ({ id:x.id, memberId:x.memberId, memberName:x.memberName, createdAt:x.createdAt })) }; }
  if (a === 'startUpload') return startUpload_(d, m);
  if (a === 'completeUpload') return completeUpload_(d, m);
  if (a === 'updateComment' || a === 'deleteComment') {
    const c = find_('Comments', d.id);
    if (!c || c.deleted) fail_('NOT_FOUND', '댓글을 찾을 수 없습니다.');
    activePost_(c.postId); owner_(m, c.authorId); version_(c, d.version);
    if (a === 'deleteComment') c.deleted = true; else c.body = text_(d.body, 2000);
    c.version++; c.updatedAt = now_(); save_('Comments', c); return { comment: publicComment_(c) };
  }
  fail_('INVALID', '지원하지 않는 요청입니다.');
}

function login_(d) {
  const code = text_(d.code, 4096), challenge = text_(d.challenge, 128);
  const cache = CacheService.getScriptCache(), key = 'login:' + hash_(challenge);
  if (!cache.get(key)) fail_('AUTH', '로그인 요청이 만료되었습니다. 다시 로그인해주세요.');
  cache.remove(key); // one-use server challenge, delivered only to configured SITE_ORIGIN
  const p = PropertiesService.getScriptProperties();
  const tokenRes = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post', payload: { code, client_id: p.getProperty('GOOGLE_CLIENT_ID'), client_secret: p.getProperty('GOOGLE_CLIENT_SECRET'), redirect_uri: p.getProperty('SITE_ORIGIN'), grant_type: 'authorization_code' }, muteHttpExceptions: true
  });
  if (tokenRes.getResponseCode() !== 200) fail_('AUTH', 'Google 인증에 실패했습니다. 로그인 설정을 확인하거나 다시 시도해주세요.');
  const tokens = JSON.parse(tokenRes.getContentText());
  if (!tokens.access_token) fail_('AUTH', 'Google 인증을 완료하지 못했습니다.');
  // Identity comes from Google's authenticated endpoint, not a client-supplied
  // email or an unverified, merely decoded JWT. No Google tokens are persisted.
  const profileRes = UrlFetchApp.fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: 'Bearer ' + tokens.access_token }, muteHttpExceptions: true
  });
  if (profileRes.getResponseCode() !== 200) fail_('AUTH', 'Google 계정 정보를 확인하지 못했습니다.');
  const profile = JSON.parse(profileRes.getContentText());
  if (profile.email_verified !== true || !profile.sub || !profile.email) fail_('AUTH', '이메일이 검증된 Google 계정이 필요합니다.');
  const email = String(profile.email).toLowerCase(), sub = String(profile.sub);
  const isAdmin = (p.getProperty('ADMIN_EMAILS') || '').split(',').map(s => s.trim().toLowerCase()).includes(email);
  let member = rows_('Members').find(x => x.googleSub === sub);
  if (!member) {
    member = { id: Utilities.getUuid(), googleSub: sub, email, name: String(profile.name || email.split('@')[0]).slice(0,100), role: isAdmin ? 'admin' : 'member', status: 'approved', createdAt: now_(), updatedAt: now_() };
  } else {
    member.email = email; member.name = String(profile.name || member.name).slice(0,100);
    member.role = isAdmin ? 'admin' : 'member';
    // All verified Google accounts are approved automatically. A blocked
    // account remains blocked until an administrator explicitly restores it.
    if (member.status !== 'blocked') member.status = 'approved';
    member.updatedAt = now_();
  }
  save_('Members', member);
  if (member.status === 'blocked') fail_('BLOCKED', '이 계정은 이용이 제한되어 있습니다. CIC 관리자에게 문의해주세요.');
  const all = rows_('Sessions');
  all.filter(s => s.expiresAt <= Date.now()).forEach(s => remove_('Sessions', s.id));
  all.filter(s => s.memberId === member.id && s.expiresAt > Date.now()).sort((a,b) => b.expiresAt - a.expiresAt).slice(4).forEach(s => remove_('Sessions', s.id));
  const session = random_();
  save_('Sessions', { id: hash_(session), memberId: member.id, expiresAt: Date.now() + SESSION_MS_ });
  return { session, member: publicMember_(member) };
}

function authenticate_(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) fail_('AUTH', '로그인이 필요합니다.');
  const session = find_('Sessions', hash_(token));
  if (!session || session.expiresAt <= Date.now()) fail_('AUTH', '로그인이 만료되었습니다. 다시 로그인해주세요.');
  const member = find_('Members', session.memberId);
  if (!member || member.status === 'blocked') fail_('BLOCKED', '이 계정은 이용이 제한되어 있습니다.');
  // Revoking an admin in properties takes effect on the very next request.
  const admins = (PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS') || '').split(',').map(x => x.trim().toLowerCase());
  member.role = admins.includes(member.email) ? 'admin' : 'member';
  return { session, member };
}
function reader_(token) {
  if (!token) return null;
  try { return authenticate_(token).member; } catch (_) { return null; }
}
function listPosts_(d, member) {
  const page = page_(d.page), size = 15;
  const posts = rows_('Posts').filter(p => !p.deleted).sort((a,b) => (b.category === 'notice') - (a.category === 'notice') || b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
  const comments = rows_('Comments').filter(c => !c.deleted);
  return { page, total: posts.length, pages: Math.max(1, Math.ceil(posts.length / size)), posts: posts.slice((page - 1)*size, page*size).map(p => {
    const out = publicPost_(p, member); delete out.body; out.commentCount = comments.filter(c => c.postId === p.id).length; return out;
  }) };
}
function getPost_(d, member) {
  const p = activePost_(d.id), page = page_(d.commentPage), size = 30;
  const all = rows_('Comments').filter(c => c.postId === p.id && !c.deleted).sort((a,b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  return { post: publicPost_(p, member), comments: all.slice((page - 1)*size, page*size).map(publicComment_), commentPage: page, commentPages: Math.max(1, Math.ceil(all.length/size)), commentCount: all.length };
}
function publicMember_(m) { return { id:m.id, name:m.name, status:m.status, role:m.role }; }
function publicPost_(p, member) {
  const attachments = (p.attachments || []).map(id => find_('Attachments', id)).filter(x => x && x.status === 'complete' && x.postId === p.id).map(publicAttachment_);
  return { id:p.id, title:p.title, summary:p.summary || legacySummary_(p.body), body:p.body, attachments, category:p.category, authorId:p.authorId, authorName:p.authorName, createdAt:p.createdAt, updatedAt:p.updatedAt, version:p.version, likeCount:likeCount_(p.id), likedByMe:!!(member && rows_('Likes').some(x => x.postId === p.id && x.memberId === member.id)) };
}
function publicComment_(c) { return { id:c.id, postId:c.postId, body:c.body, authorId:c.authorId, authorName:c.authorName, createdAt:c.createdAt, updatedAt:c.updatedAt, version:c.version }; }
function publicAttachment_(a) { return { id:a.id, name:a.name, mimeType:a.mimeType, size:a.size, url:a.url }; }
function legacySummary_(body) { return String(body || '').replace(/\s+/g, ' ').trim().slice(0, 300); }
function likeCount_(postId) { return rows_('Likes').filter(x => x.postId === postId).length; }
function activePost_(id) { const p = find_('Posts', id); if (!p || p.deleted) fail_('NOT_FOUND', '게시글을 찾을 수 없습니다.'); return p; }
function category_(v, m) { if (!['activity', 'free', 'notice'].includes(v)) fail_('INVALID', '게시글 분류를 선택해주세요.'); if (v === 'notice') admin_(m); return v; }
function text_(v, max) { if (typeof v !== 'string' || !v.trim() || v.trim().length > max) fail_('INVALID', '필수 내용을 확인해주세요. 최대 ' + max + '자까지 입력할 수 있습니다.'); return v.trim(); }
function mutation_(v) { if (typeof v !== 'string' || !/^[a-f0-9-]{36}$/.test(v)) fail_('INVALID', '작성 요청이 올바르지 않습니다.'); return v; }
function version_(record, v) { if (record.version !== v) fail_('CONFLICT', '다른 곳에서 내용이 변경되었습니다. 새로고침 후 다시 수정해주세요.'); }
function owner_(m, id) { if (m.id !== id && m.role !== 'admin') fail_('FORBIDDEN', '본인이 작성한 내용만 변경할 수 있습니다.'); }
function admin_(m) { if (m.role !== 'admin') fail_('FORBIDDEN', '관리자 권한이 필요합니다.'); }
function page_(v) { if (v === undefined) return 1; if (!Number.isInteger(v) || v < 1 || v > 10000) fail_('INVALID', '페이지 번호가 올바르지 않습니다.'); return v; }
function now_() { return new Date().toISOString(); }
function random_() { return (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''); }
function hash_(v) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, v, Utilities.Charset.UTF_8).map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join(''); }
function fail_(code, message) { const e = new Error(message); e.cicCode = code; throw e; }
function rate_(id) { const cache = CacheService.getScriptCache(), key = 'write:' + id; const n = Number(cache.get(key) || 0); if (n >= 30) fail_('RATE', '요청이 너무 많습니다. 1분 후 다시 시도해주세요.'); cache.put(key, String(n+1), 60); }
function attachments_(ids, m, postId) {
  if (ids === undefined) ids = [];
  if (!Array.isArray(ids) || ids.length > MAX_ATTACHMENTS_ || new Set(ids).size !== ids.length) fail_('INVALID', '첨부 파일을 최대 ' + MAX_ATTACHMENTS_ + '개까지 선택해주세요.');
  return ids.map(id => {
    if (typeof id !== 'string') fail_('INVALID', '첨부 파일 정보가 올바르지 않습니다.');
    const a = find_('Attachments', id);
    if (!a || a.status !== 'complete' || a.ownerId !== m.id || (a.postId && a.postId !== postId)) fail_('FORBIDDEN', '사용할 수 없는 첨부 파일입니다.');
    return a;
  });
}
function uploadFolder_() {
  const id = PropertiesService.getScriptProperties().getProperty('UPLOAD_FOLDER_ID');
  if (!id) fail_('SETUP', '첨부 파일용 Google Drive 폴더를 설정해야 합니다.');
  return id;
}
function startUpload_(d, m) {
  const name = text_(d.name, 180), mimeType = text_(d.mimeType, 100), size = Number(d.size);
  if (!MEDIA_TYPES_.includes(mimeType) || !Number.isSafeInteger(size) || size < 1 || size > MAX_ATTACHMENT_BYTES_) fail_('INVALID', '이미지 또는 동영상 파일은 파일당 최대 100MB까지 첨부할 수 있습니다.');
  const a = { id: Utilities.getUuid(), ownerId:m.id, name, mimeType, size, status:'uploading', driveId:'', postId:'', createdAt:now_(), updatedAt:now_() };
  const response = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,mimeType,size,webContentLink', {
    method:'post', contentType:'application/json', payload:JSON.stringify({name, mimeType, parents:[uploadFolder_()]}),
    headers:{Authorization:'Bearer ' + ScriptApp.getOAuthToken(), 'X-Upload-Content-Type':mimeType, 'X-Upload-Content-Length':String(size)}, muteHttpExceptions:true
  });
  if (response.getResponseCode() !== 200) fail_('SERVER', '첨부 업로드를 시작하지 못했습니다. Drive 설정을 확인해주세요.');
  const location = response.getHeaders().Location || response.getHeaders().location;
  if (!location) fail_('SERVER', '첨부 업로드 주소를 받지 못했습니다.');
  const meta = JSON.parse(response.getContentText()); a.driveId = meta.id; save_('Attachments', a);
  return { attachment:{id:a.id, name, mimeType, size}, uploadUrl:location, chunkSize:8 * 1024 * 1024 };
}
function completeUpload_(d, m) {
  const a = find_('Attachments', text_(d.id, 64));
  if (!a || a.ownerId !== m.id || a.status !== 'uploading') fail_('FORBIDDEN', '완료할 수 없는 첨부 파일입니다.');
  const base = 'https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(a.driveId);
  const token = ScriptApp.getOAuthToken();
  const metaRes = UrlFetchApp.fetch(base + '?fields=id,name,mimeType,size,webContentLink', {headers:{Authorization:'Bearer ' + token}, muteHttpExceptions:true});
  if (metaRes.getResponseCode() !== 200) fail_('INVALID', '파일 업로드가 아직 완료되지 않았습니다.');
  const meta = JSON.parse(metaRes.getContentText());
  if (meta.mimeType !== a.mimeType || Number(meta.size) !== a.size) fail_('INVALID', '업로드된 파일 정보가 일치하지 않습니다.');
  const permission = UrlFetchApp.fetch(base + '/permissions', {method:'post', contentType:'application/json', payload:JSON.stringify({type:'anyone',role:'reader'}), headers:{Authorization:'Bearer ' + token}, muteHttpExceptions:true});
  if (permission.getResponseCode() < 200 || permission.getResponseCode() >= 300) fail_('SERVER', '첨부 파일 공개 권한을 설정하지 못했습니다.');
  a.status='complete'; a.url=meta.webContentLink || ('https://drive.google.com/uc?export=download&id=' + encodeURIComponent(a.driveId)); a.updatedAt=now_(); save_('Attachments', a);
  return { attachment:publicAttachment_(a) };
}
function detach_(id, postId) { const a=find_('Attachments', id); if (a && a.postId === postId) { a.postId=''; a.updatedAt=now_(); save_('Attachments', a); } }
function sheet_(name) { const s = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')).getSheetByName(name); if (!s) fail_('SETUP', '관리자가 서버 초기 설정을 완료해야 합니다.'); return s; }
function rows_(name) { const s = sheet_(name); if (s.getLastRow() < 2) return []; return s.getRange(2,1,s.getLastRow()-1,2).getValues().map(r => JSON.parse(r[1])); }
function find_(name, id) { return rows_(name).find(x => x.id === id); }
function save_(name, record) {
  const s = sheet_(name), rows = s.getLastRow() > 1 ? s.getRange(2,1,s.getLastRow()-1,1).getValues() : [];
  const i = rows.findIndex(r => r[0] === record.id), row = i < 0 ? s.getLastRow()+1 : i+2;
  // JSON objects start with '{', so user text never becomes a Sheet formula.
  s.getRange(row,1,1,2).setNumberFormat('@').setValues([[record.id, JSON.stringify(record)]]);
}
function remove_(name, id) { const s = sheet_(name); if (s.getLastRow() < 2) return; const i = s.getRange(2,1,s.getLastRow()-1,1).getValues().findIndex(r => r[0] === id); if (i >= 0) s.deleteRow(i+2); }
