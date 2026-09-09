(() => {
  'use strict';
  const pending = new Map();
  let session = ''; // Memory only. Refreshing the page requires login again.
  const random = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
  function isScriptOrigin(origin) {
    try { const u = new URL(origin); return u.protocol === 'https:' && (u.hostname === 'script.google.com' || u.hostname === 'script.googleusercontent.com' || /^[a-z0-9-]+-script\.googleusercontent\.com$/.test(u.hostname)); }
    catch { return false; }
  }
  function belongsToFrame(source, frame) {
    // HtmlService wraps responses in an extra cross-origin sandbox. Traversing
    // parent WindowProxy is allowed without reading cross-origin document data.
    try { for (let i=0; source && i<5; i++) { if (source === frame.contentWindow) return true; if (source === source.parent) break; source = source.parent; } } catch {}
    return false;
  }
  window.addEventListener('message', event => {
    const msg = event.data;
    if (!isScriptOrigin(event.origin) || !msg || msg.channel !== 'CIC_API_V1') return;
    const p = pending.get(msg.requestId);
    if (!p || !belongsToFrame(event.source, p.frame)) return;
    p.clean();
    if (msg.result?.ok === true) p.resolve(msg.result.data);
    else { const err = new Error(msg.result?.message || '서버 응답을 확인하지 못했습니다.'); err.code = msg.result?.code; p.reject(err); }
  });
  function configured() {
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(CIC_CONFIG.apiUrl) && /^[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(CIC_CONFIG.googleClientId);
  }
  function request(action, data = {}) {
    if (!configured()) return Promise.reject(new Error('회원 서비스를 준비 중입니다.'));
    return new Promise((resolve, reject) => {
      const requestId = random(), frame = document.createElement('iframe'), form = document.createElement('form');
      frame.name = 'cic_' + requestId; frame.className = 'transport'; frame.title = 'CIC 서버 통신';
      form.method = 'POST'; form.action = CIC_CONFIG.apiUrl; form.target = frame.name; form.className = 'transport';
      const field = document.createElement('input'); field.type = 'hidden'; field.name = 'payload';
      field.value = JSON.stringify({ requestId, origin: location.origin, action, data, session });
      form.append(field);
      const timer = setTimeout(() => { clean(); const e = new Error('서버 응답이 지연되고 있습니다. 작성 중인 내용을 보관한 뒤 다시 확인해주세요.'); e.code = 'TIMEOUT'; reject(e); }, 45000);
      function clean() { clearTimeout(timer); pending.delete(requestId); frame.remove(); form.remove(); }
      pending.set(requestId, { resolve, reject, frame, clean }); document.body.append(frame, form); form.submit();
    });
  }
  window.CIC_API = { configured, request, setSession(v) { session = v || ''; }, clear() { session = ''; } };
})();
