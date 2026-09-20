const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { randomUUID, createHash } = require('node:crypto');
const source = fs.readFileSync(require('node:path').join(__dirname, '../apps-script/Code.gs'), 'utf8');

// Same in-memory Sheets/Apps Script harness as backend.test.cjs, trimmed to what these policy tests need.
function server() {
  const db = {}, cache = new Map(), props = { SPREADSHEET_ID: 'test', GOOGLE_CLIENT_ID: 'client', GOOGLE_CLIENT_SECRET: 'secret', SITE_ORIGIN: 'https://example.github.io', ADMIN_EMAILS: 'admin@example.org' };
  const profile = { sub: 'google-user-a', email: 'a@example.org', email_verified: true, name: '회원 A' };
  const trashed = [];
  function sheet(name) {
    const data = db[name] ||= [];
    return {
      getLastRow: () => data.length, appendRow: r => data.push(r), setFrozenRows: () => {}, deleteRow: r => data.splice(r - 1, 1),
      getRange(row, col, n = 1, m = 1) {
        return {
          getValues: () => Array.from({ length: n }, (_, i) => Array.from({ length: m }, (_, j) => data[row - 1 + i]?.[col - 1 + j] ?? '')),
          setNumberFormat() { return this; },
          setValues(rows) { rows.forEach((r, i) => { data[row - 1 + i] ||= []; r.forEach((v, j) => { data[row - 1 + i][col - 1 + j] = v; }); }); }
        };
      }
    };
  }
  const context = vm.createContext({
    Date, JSON, Number, String, Error, RegExp, console,
    Utilities: { getUuid: randomUUID, DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' }, computeDigest: (_, v) => [...createHash('sha256').update(v).digest()] },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] }) },
    CacheService: { getScriptCache: () => ({ put: (k, v) => cache.set(k, v), get: k => cache.get(k), remove: k => cache.delete(k) }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: name => db[name] ? sheet(name) : null, insertSheet: sheet }) },
    DriveApp: { getFileById: id => ({ setTrashed: () => trashed.push(id) }) },
    UrlFetchApp: {
      fetch: url => {
        if (url.endsWith('/token')) return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ access_token: 'token' }) };
        return { getResponseCode: () => 200, getContentText: () => JSON.stringify(profile) };
      }
    }
  });
  vm.runInContext(source, context); context.setup();
  const call = (action, data = {}, session, visitorId) => context.dispatch_({ action, data, session, visitorId });
  const login = (sub = 'google-user-a', email = 'a@example.org') => {
    profile.sub = sub; profile.email = email;
    return call('login', { code: 'one-use-google-code', challenge: call('challenge').challenge });
  };
  return { context, call, login, trashed };
}
const denied = (fn, code) => assert.throws(fn, e => e.cicCode === code);
const draft = () => ({ title: '봉사 활동 기록', summary: '오늘 함께한 활동을 카드에 남깁니다.', body: '오늘 함께한 활동', attachmentIds: [], category: 'activity', mutationId: randomUUID() });

test('members can report posts and comments once, cannot report their own content, and only admins review reports', () => {
  const s = server(), a = s.login(), b = s.login('google-user-b', 'b@example.org'), admin = s.login('admin-sub', 'admin@example.org');
  const p = s.call('createPost', draft(), a.session).post;
  const c = s.call('createComment', { postId: p.id, body: '부적절한 댓글', mutationId: randomUUID() }, a.session).comment;
  denied(() => s.call('reportContent', { targetType: 'post', targetId: p.id, reason: 'spam' }), 'AUTH');
  denied(() => s.call('reportContent', { targetType: 'post', targetId: p.id, reason: 'spam' }, a.session), 'INVALID');
  denied(() => s.call('reportContent', { targetType: 'post', targetId: p.id, reason: 'bad' }, b.session), 'INVALID');
  denied(() => s.call('reportContent', { targetType: 'user', targetId: p.id, reason: 'spam' }, b.session), 'INVALID');
  denied(() => s.call('reportContent', { targetType: 'comment', targetId: 'missing', reason: 'spam' }, b.session), 'NOT_FOUND');
  assert.equal(s.call('reportContent', { targetType: 'post', targetId: p.id, reason: 'spam', detail: '광고 글입니다' }, b.session).duplicate, false);
  assert.equal(s.call('reportContent', { targetType: 'post', targetId: p.id, reason: 'spam' }, b.session).duplicate, true);
  assert.equal(s.call('reportContent', { targetType: 'comment', targetId: c.id, reason: 'harassment' }, b.session).reported, true);
  assert.equal(s.context.rows_('Reports').length, 2);
  denied(() => s.call('listReports', {}, b.session), 'FORBIDDEN');
  denied(() => s.call('resolveReport', { id: 'x', resolution: 'dismiss' }, b.session), 'FORBIDDEN');
  const list = s.call('listReports', {}, admin.session).reports;
  assert.equal(list.length, 2);
  assert.ok(!JSON.stringify(list).includes('b@example.org'), 'reports must not expose reporter email');
  assert.equal(list.find(r => r.targetType === 'post').excerpt, p.title);
});

test('resolving a report can remove the content or dismiss it, and applies to every open report on that content', () => {
  const s = server(), a = s.login(), b = s.login('google-user-b', 'b@example.org'), c2 = s.login('google-user-c', 'c@example.org'), admin = s.login('admin-sub', 'admin@example.org');
  const p = s.call('createPost', draft(), a.session).post;
  const comment = s.call('createComment', { postId: p.id, body: '댓글', mutationId: randomUUID() }, a.session).comment;
  s.call('reportContent', { targetType: 'post', targetId: p.id, reason: 'privacy' }, b.session);
  s.call('reportContent', { targetType: 'post', targetId: p.id, reason: 'other', detail: '확인 부탁' }, c2.session);
  s.call('reportContent', { targetType: 'comment', targetId: comment.id, reason: 'spam' }, b.session);
  denied(() => s.call('resolveReport', { id: 'x', resolution: 'ban' }, admin.session), 'INVALID');
  denied(() => s.call('resolveReport', { id: 'missing', resolution: 'dismiss' }, admin.session), 'NOT_FOUND');
  const postReport = s.call('listReports', {}, admin.session).reports.find(r => r.targetType === 'post');
  assert.equal(s.call('resolveReport', { id: postReport.id, resolution: 'remove' }, admin.session).report.status, 'resolved');
  assert.equal(s.call('listPosts').total, 0);
  assert.equal(s.context.rows_('Reports').filter(r => r.targetType === 'post' && r.status === 'open').length, 0);
  denied(() => s.call('resolveReport', { id: postReport.id, resolution: 'dismiss' }, admin.session), 'CONFLICT');
  const commentReport = s.call('listReports', {}, admin.session).reports.find(r => r.targetType === 'comment');
  assert.equal(s.call('resolveReport', { id: commentReport.id, resolution: 'dismiss' }, admin.session).report.resolution, 'dismiss');
  assert.equal(s.context.find_('Comments', comment.id).deleted, false);
  assert.equal(s.call('listReports', {}, admin.session).reports.every(r => r.status === 'resolved'), true);
});

test('account deletion erases the member and sessions, anonymizes remaining content and purges the rest', () => {
  const s = server(), a = s.login(), b = s.login('google-user-b', 'b@example.org'), admin = s.login('admin-sub', 'admin@example.org');
  const kept = s.call('createPost', draft(), b.session).post, gone = s.call('createPost', draft(), b.session).post;
  s.call('createComment', { postId: kept.id, body: '탈퇴 전 댓글', mutationId: randomUUID() }, b.session);
  const otherPost = s.call('createPost', draft(), a.session).post;
  s.call('createComment', { postId: gone.id, body: '다른 사람 댓글', mutationId: randomUUID() }, a.session);
  s.call('toggleLike', { postId: otherPost.id }, b.session);
  s.call('reportContent', { targetType: 'post', targetId: otherPost.id, reason: 'spam' }, b.session);
  s.call('deletePost', { id: gone.id, version: 1 }, b.session);
  s.context.save_('Attachments', { id: 'att-loose', ownerId: b.member.id, status: 'complete', postId: '', driveId: 'loose-file' });
  s.context.save_('Attachments', { id: 'att-linked', ownerId: b.member.id, status: 'complete', postId: kept.id, driveId: 'linked-file' });
  const before = s.call('listPosts').total;
  denied(() => s.call('deleteMyAccount', {}, b.session), 'INVALID');
  denied(() => s.call('deleteMyAccount', { confirm: 'yes' }, b.session), 'INVALID');
  denied(() => s.call('deleteMyAccount', { confirm: true }, admin.session), 'FORBIDDEN');
  assert.equal(s.call('deleteMyAccount', { confirm: true }, b.session).deleted, true);
  assert.equal(s.context.find_('Members', b.member.id), undefined);
  assert.equal(s.context.rows_('Sessions').some(x => x.memberId === b.member.id), false);
  denied(() => s.call('me', {}, b.session), 'AUTH');
  const post = s.context.find_('Posts', kept.id);
  assert.equal(post.authorId, 'deleted'); assert.equal(post.authorName, '탈퇴한 회원'); assert.equal(post.deleted, false);
  assert.equal(s.call('listPosts').total, before, 'visible posts stay');
  assert.equal(s.context.find_('Posts', gone.id), undefined, 'already-deleted posts are purged');
  assert.equal(s.context.rows_('Comments').some(c => c.postId === gone.id), false, 'comments on purged posts are purged');
  assert.equal(s.context.rows_('Comments').find(c => c.body === '탈퇴 전 댓글').authorName, '탈퇴한 회원');
  assert.equal(s.context.rows_('Likes').length, 0);
  const report = s.context.rows_('Reports')[0]; assert.equal(report.reporterName, '탈퇴한 회원'); assert.equal(report.reporterId, 'deleted');
  assert.equal(s.context.find_('Attachments', 'att-loose'), undefined);
  assert.deepEqual(s.trashed, ['loose-file'], 'only unattached uploads are trashed');
  assert.equal(s.context.find_('Attachments', 'att-linked').ownerId, 'deleted');
  denied(() => s.call('updatePost', { id: kept.id, version: post.version, ...draft() }, a.session), 'FORBIDDEN');
  const again = s.login('google-user-b', 'b@example.org'); assert.notEqual(again.member.id, b.member.id); assert.equal(again.member.status, 'approved');
});
