(() => {
  'use strict';
  const {t,html} = window.CIC_I18N;
  let C = CIC_I18N.content;
  const main = document.getElementById('main'), modal = document.getElementById('modal');
  let labels = { activity: t('활동 기록'), free: t('자유 게시판'), notice: t('공지') };
  let member = null, epoch = 0, currentPost = null, currentComments = [], toastTimer, gisPromise;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = v => new Date(v).toLocaleDateString(CIC_I18N.language === 'en' ? 'en-US' : 'ko-KR', {timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric'});
  const title = (en, heading, sub='') => `<div class="page-title"><span class="eyebrow">${esc(en)}</span><h1>${esc(heading)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
  const canEdit = id => member && (member.id === id || member.role === 'admin');
  function asset(url) { if (!url) return ''; try { const u = new URL(url, location.href); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
  function activityPhoto(key, alt) { const url = asset(CIC_CONFIG.assets.activities[key]); return url ? `<img class="activity-photo" src="${esc(url)}" alt="${esc(alt)}" loading="lazy">` : ''; }
  function openModal(html) { document.getElementById('modal-content').innerHTML = html; if (!modal.open) modal.showModal(); }
  function toast(message) { const el = document.getElementById('toast'); clearTimeout(toastTimer); el.textContent = message; el.hidden = false; toastTimer = setTimeout(() => el.hidden = true, 6000); }
  function guideCards() { return C.places.map(p => html`<article class="guide-card"><span class="number">${p.number}</span><p class="category">${p.category}</p><h3><a href="#guide/${p.id}">${esc(p.title)}</a></h3><p>${esc(p.short)}</p><a class="card-link" href="#guide/${p.id}">탐방 가이드 읽기 ↗</a></article>`).join(''); }
  function home() {
    return html`<section class="hero"><div class="hero-copy"><span class="eyebrow">CIC · Incheon Heritage Guide</span><h1>우리가 지키는 역사,<br>함께 이어갈 미래.</h1><p>${esc(C.subtitle)}</p><p class="small-text">채드윅송도국제학교 CIC와 함께하는<br>인천 문화유산 가이드</p><div class="button-row"><a class="button accent" href="#guide">문화유산 만나보기</a><a class="button secondary" href="#board">지킴이 로그</a></div></div></section>
    <section class="wrap"><div class="section-heading"><div><span class="eyebrow">Explore Incheon</span><h2>발걸음으로 만나는 인천의 역사</h2></div><a href="#guide">전체 가이드 ↗</a></div><div class="grid-3">${guideCards()}</div></section>
    <section class="intro-block tinted"><div><span class="eyebrow">Heritage into Legacy</span><h2>유산을 지켰더니,<br>우리의 이야기가 쌓였습니다.</h2></div><div><p>${esc(C.introduction)}</p><div class="button-row"><a class="text-button" href="#about">CIC의 이야기 읽기 ↗</a></div></div></section>
    <section class="wrap"><div class="section-heading"><div><span class="eyebrow">Our Practice</span><h2>현장에서 실천하는 가치</h2></div><a href="#values">활동 살펴보기 ↗</a></div><div class="grid-3">${C.achievements.slice(0,3).map((a,i) => html`<article class="activity"><span class="eyebrow">0${i+1} / CIC 활동</span>${activityPhoto(a.asset,a.title)}<h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join('')}</div></section>`;
  }
  function about() {
    const stat = (value,label,suffix) => `<div><strong>${value == null ? t('확인 중') : esc(value)+suffix}</strong><span>${label}</span></div>`;
    const reflections = C.reflections.filter(x => x.text.trim());
    return title('About CIC',t('작은 관심에서 시작된, 진정성 있는 실천'), t('채드윅송도국제학교 청소년 국가유산지킴이')) + html`<div class="reading"><span class="eyebrow">발간사</span><h2>우리가 서 있는 이 땅의 역사를<br>미래로 연결합니다</h2>${C.foreword.map(p=>`<p>${esc(p)}</p>`).join('')}<h2>CIC를 소개합니다</h2><p>${esc(C.introduction)}</p><div class="statistics">${stat(C.foundingYear,t('창립 연도'),t('년'))}${stat(C.memberCount,t('활동 단원'),t('명'))}${stat(C.volunteerHours,t('누적 봉사시간'),t('시간'))}</div><p class="muted small-text">창립 연도와 단원 수는 클럽 기록, 누적 봉사시간은 1365 자원봉사포털 기록을 확인한 뒤 반영합니다.</p><div class="notice">선생님의 기념사는 담당 선생님과 원고를 확인한 뒤 게재할 예정입니다.</div></div><section class="wrap tinted"><div class="section-heading"><div><span class="eyebrow">Our Journey</span><h2>함께 쌓아온 활동</h2></div></div><div class="activity-grid">${C.achievements.map(a=>`<article class="activity">${activityPhoto(a.asset,a.title)}<h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join('')}</div><p class="source" style="margin-top:28px">제공된 CIC 발간 원고를 바탕으로 정리했습니다. 수상·위촉 및 언론 게재의 정확한 명칭과 시기는 확인 후 보완합니다.</p></section><section class="reading"><span class="eyebrow">지킴이 로그</span><h2>우리가 문화유산에 ‘푹’ 빠진 이유</h2>${reflections.length ? reflections.map(r=>html`<blockquote class="quote-block">${esc(r.text)}<p class="muted small-text">${esc(r.name)} · ${r.grade}학년</p></blockquote>`).join('') : t('<p class="muted">단원들의 소감을 모으고 있습니다. 직접 경험하고 느낀 이야기를 곧 이곳에서 전하겠습니다.</p>')}</section>`;
  }
  function values() { return title('Five Core Values',t('다섯 가지 가치, 다섯 가지 실천'), t('존중 · 책임감 · 정직 · 공정 · 배려')) + `<div class="wrap">${C.values.map((v,i)=>`<section id="value-${v.en.toLowerCase()}" class="value-section"><div><span class="value-index">0${i+1}</span><h2>${CIC_I18N.language === 'en' ? v.en : v.ko}</h2><span class="english">${v.en}</span></div><div class="value-body"><blockquote>“${esc(v.quote)}”</blockquote>${activityPhoto(v.asset,(CIC_I18N.language === 'en' ? v.en : v.ko)+t(' 활동'))}${v.activities.map(([h,p])=>`<h3>${esc(h)}</h3><p>${esc(p)}</p>`).join('')}</div></section>`).join('')}</div>`; }
  function guide() { return title('Incheon Heritage Guide',t('도시를 걷고, 역사를 읽다'), t('CIC가 소개하는 인천의 문화유산과 탐방 이야기'))+html`<div class="wrap">${C.places.map(p=>html`<article class="place-section" id="place-${p.id}"><div><span class="place-number">${p.number}</span><p class="eyebrow" style="margin-top:20px">${p.category}</p><h2>${esc(p.title)}</h2></div><div>${activityPhoto(p.id,p.title)}${p.paragraphs.map(([h,b])=>`<h3>${esc(h)}</h3><p>${esc(b)}</p>`).join('')}<aside class="tip"><strong>지킴이의 추천 팁</strong><p>${esc(p.tip)}</p></aside>${p.source ? html`<a class="source" href="${esc(p.source[1])}" target="_blank" rel="noopener noreferrer">${esc(p.source[0])} · 참고 자료 ↗</a>` : ''}</div></article>`).join('')}</div><section class="wrap tinted"><div class="section-heading"><div><span class="eyebrow">Leave Care, Keep Heritage</span><h2>미래 세대를 위한 탐방 에티켓</h2></div></div><div class="grid-3">${C.etiquette.map(([h,p],i)=>`<article class="etiquette"><div class="number">0${i+1}</div><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div></section>`; }
  function lockedBoard() {
    let heading, message, button;
    if (!CIC_API.configured()) { heading=t('지킴이 로그를 준비하고 있습니다'); message=t('CIC 소개와 문화유산 가이드는 지금 둘러볼 수 있습니다. 회원 서비스가 연결되면 Google 로그인 후 글과 댓글을 나눌 수 있습니다.'); button=t('<a class="button secondary" href="#guide">문화유산 가이드 보기</a>'); }
    else if (!member) { heading=t('CIC 지킴이들과 이야기를 나누세요'); message=t('Google 계정으로 로그인하면 바로 활동 기록과 댓글을 읽고 작성할 수 있습니다.'); button=t('<button class="button" data-action="login">Google 계정으로 로그인</button>'); }
    else { heading=t('회원 상태를 확인할 수 없습니다'); message=html`${member.name} 님의 계정 상태를 다시 확인해주세요.`; button=t('<button class="button secondary" data-action="refresh-member">회원 상태 확인</button>'); }
    return `<div class="empty"><div class="empty-symbol">${asset(CIC_CONFIG.assets.logo) ? html`<img src="${esc(asset(CIC_CONFIG.assets.logo))}" alt="CIC 로고" width="88" height="88">` : 'CIC.'}</div><h2>${esc(heading)}</h2><p>${esc(message)}</p>${button}</div>`;
  }
  async function board(page, stamp) {
    main.innerHTML = title('Community',t('함께 기록하는 CIC'), t('활동의 순간과 생각을 회원들과 나눕니다.')) + '<section class="board-shell" id="board-content"></section>';
    const target = document.getElementById('board-content');
    if (!CIC_API.configured() || !member || member.status !== 'approved') { target.innerHTML=lockedBoard(); return; }
    target.innerHTML=t('<p role="status">게시글을 불러오고 있습니다…</p>');
    const data = await CIC_API.request('listPosts',{page}); if (stamp !== epoch) return;
    target.innerHTML=html`<div class="board-toolbar"><h2>지킴이 로그 <span class="muted small-text">${data.total}개의 글</span></h2><div class="button-row" style="margin:0">${member.role==='admin'?t('<a class="button secondary small" href="#members">회원 관리</a>'):''}<button class="button small" data-action="new-post">글쓰기</button></div></div>${data.posts.length ? `<div class="post-list">${data.posts.map(p=>html`<a class="post-row" href="#post/${p.id}"><span class="post-tag">${esc(labels[p.category])}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.authorName)} · ${date(p.createdAt)}</p></div><span class="count">댓글 ${p.commentCount}</span></a>`).join('')}</div>` : t('<div class="empty"><h3>아직 등록된 글이 없습니다</h3><p>첫 번째 CIC 활동 이야기를 남겨주세요.</p></div>')}${pagination(page,data.pages,'board')}`;
  }
  function pagination(page,pages,route) { return pages>1 ? `<div class="paging">${page>1?html`<a class="button secondary small" href="#${route}/${page-1}">이전</a>`:''}<span>${page} / ${pages}</span>${page<pages?html`<a class="button secondary small" href="#${route}/${page+1}">다음</a>`:''}</div>` : ''; }
  async function post(id, commentPage, stamp) {
    if (!member || member.status !== 'approved') { await board(1,stamp); return; }
    main.innerHTML=title('Community',t('지킴이 로그'))+t('<div class="reading"><p role="status">게시글을 불러오고 있습니다…</p></div>');
    const data = await CIC_API.request('getPost',{id,commentPage}); if (stamp!==epoch) return;
    currentPost=data.post; currentComments=data.comments; const p=data.post;
    main.innerHTML=html`<article class="reading"><a href="#board" class="muted small-text">← 게시판 목록</a><span class="eyebrow" style="margin-top:35px">${esc(labels[p.category])}</span><h1 style="font-size:2rem">${esc(p.title)}</h1><div class="post-meta"><span>${esc(p.authorName)}</span><time>${date(p.createdAt)}</time>${p.version>1?t('<span>수정됨</span>'):''}</div>${canEdit(p.authorId)?t('<div class="button-row"><button class="text-button" data-action="edit-post">수정</button><button class="text-button danger" data-action="delete-post">삭제</button></div>'):''}<div class="post-body">${esc(p.body)}</div><section class="comments"><h2>댓글 <span class="muted small-text">${data.commentCount}</span></h2>${data.comments.length ? data.comments.map(c=>`<article class="comment"><div class="comment-head"><strong>${esc(c.authorName)}</strong><time>${date(c.createdAt)}</time>${c.version>1?t('<span class="muted">수정됨</span>'):''}${canEdit(c.authorId)?html`<span class="comment-actions"><button class="text-button" data-action="edit-comment" data-id="${c.id}">수정</button><button class="text-button danger" data-action="delete-comment" data-id="${c.id}">삭제</button></span>`:''}</div><p>${esc(c.body)}</p></article>`).join('') : t('<p class="muted">첫 번째 댓글을 남겨주세요.</p>')}${pagination(commentPage,data.commentPages,'post/'+id)}<form id="comment-form"><div class="field"><label for="comment-body">댓글 쓰기</label><textarea id="comment-body" name="body" required maxlength="2000" placeholder="활동에 대한 생각을 나눠주세요."></textarea></div><p class="inline-error" role="alert"></p><button class="button" type="submit">댓글 등록</button></form></section></article>`;
    const form=document.getElementById('comment-form'); let mutationId=crypto.randomUUID();
    form.addEventListener('submit', async e => {e.preventDefault(); await submit(form,async()=>{await CIC_API.request('createComment',{postId:p.id,body:form.elements.body.value,mutationId}); mutationId=crypto.randomUUID(); toast(t('댓글을 등록했습니다.')); await route();});});
  }
  async function members(stamp) {
    if (member?.role!=='admin') { await board(1,stamp); return; }
    main.innerHTML=title('Members',t('회원 관리'),t('Google 계정으로 신청한 회원을 확인하고 승인해주세요.'))+t('<div class="reading" id="members-content"><p role="status">신청 정보를 불러오고 있습니다…</p></div>');
    const data = await CIC_API.request('listMembers'); if (stamp!==epoch) return;
    document.getElementById('members-content').innerHTML=t('<a href="#board">← 게시판으로 돌아가기</a>')+data.members.sort((a,b)=>(a.status!=='pending')-(b.status!=='pending')).map(m=>`<article class="member-row"><div><strong>${esc(m.name)}</strong>${m.role==='admin'?t(' <span class="pending">관리자</span>'):''}<p class="muted small-text">${esc(m.email)}</p><span class="pending">${esc({pending:t('승인 대기'),approved:t('승인됨'),blocked:t('이용 제한')}[m.status])}</span></div>${m.role!=='admin'?`<div class="member-actions">${m.status!=='approved'?html`<button class="button small" data-action="member-status" data-id="${m.id}" data-status="approved">승인</button>`:''}${m.status!=='blocked'?html`<button class="button secondary small" data-action="member-status" data-id="${m.id}" data-status="blocked">이용 제한</button>`:''}</div>`:''}</article>`).join('');
  }
  async function route(options = {}) {
    const stamp=++epoch, [page='home',part,third] = (location.hash.slice(1)||'home').split('/');
    currentPost=null; currentComments=[];
    document.querySelectorAll('nav a').forEach(a=>{ if(a.hash==='#'+page) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    const titles={home:t('인천 문화유산 가이드'),about:t('CIC 소개'),values:t('다섯 가지 가치'),guide:t('인천 문화유산'),board:t('지킴이 로그'),post:t('지킴이 로그'),members:t('회원 관리')};
    document.title=`CIC · ${titles[page]||titles.home}`;
    try {
      if (page==='about') main.innerHTML=about();
      else if(page==='values') main.innerHTML=values();
      else if(page==='guide') main.innerHTML=guide();
      else if(page==='board') await board(Math.max(1,parseInt(part,10)||1),stamp);
      else if(page==='post') await post(part,Math.max(1,parseInt(third,10)||1),stamp);
      else if(page==='members') await members(stamp);
      else main.innerHTML=home();
      if(stamp!==epoch)return;
      const anchor = part && ['values','guide'].includes(page) ? document.getElementById((page==='values'?'value-':'place-')+part) : null;
      if(options.keepScroll) window.scrollTo(0,options.scrollY || 0);
      else if(anchor) anchor.scrollIntoView(); else window.scrollTo(0,0);
    } catch(e) {
      if(stamp!==epoch)return;
      if(['AUTH','BLOCKED'].includes(e.code)){member=null;CIC_API.clear();}
      main.innerHTML=title('Community',t('페이지를 불러오지 못했습니다'))+html`<div class="reading"><p class="inline-error" role="alert">${esc(t(e.message))}</p><div class="button-row"><button class="button secondary" data-action="retry">다시 확인</button><a class="button secondary" href="#board">게시판으로</a></div></div>`;
    }
  }
  async function submit(form,fn) {
    const button=form.querySelector('button[type="submit"]'), err=form.querySelector('.inline-error'); button.disabled=true; err.textContent='';
    try {await fn();}catch(e){err.textContent=t(e.message);}finally{button.disabled=false;}
  }
  function editor(p=null) {
    const mutationId=crypto.randomUUID();
    openModal(html`<h2 id="modal-title">${p?t('게시글 수정'):t('새로운 이야기')}</h2><form id="post-form"><div class="field"><label for="post-category">분류</label><select id="post-category" name="category">${Object.entries(labels).filter(([k])=>k!=='notice'||member.role==='admin').map(([k,v])=>`<option value="${k}" ${p?.category===k?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label for="post-title">제목</label><input id="post-title" name="title" required maxlength="120" value="${esc(p?.title||'')}" placeholder="어떤 이야기를 나누고 싶으신가요?"></div><div class="field"><label for="post-body">내용</label><textarea id="post-body" name="body" required maxlength="10000" rows="9">${esc(p?.body||'')}</textarea></div><p class="muted small-text">승인된 CIC 회원에게만 공개됩니다.</p><p class="inline-error" role="alert"></p><button class="button" type="submit">${p?t('수정 저장'):t('게시글 등록')}</button></form>`);
    const form=document.getElementById('post-form');
    form.addEventListener('submit',e=>{e.preventDefault();submit(form,async()=>{const data=Object.fromEntries(new FormData(form));data.mutationId=mutationId;if(p){data.id=p.id;data.version=p.version;}const result=await CIC_API.request(p?'updatePost':'createPost',data);modal.close();toast(p?t('게시글을 수정했습니다.'):t('게시글을 등록했습니다.'));if(location.hash==='#post/'+result.post.id)await route();else location.hash='post/'+result.post.id;});});
  }
  function editComment(c) {
    openModal(html`<h2 id="modal-title">댓글 수정</h2><form id="edit-comment-form"><div class="field"><label for="edit-comment-body">내용</label><textarea id="edit-comment-body" name="body" required maxlength="2000">${esc(c.body)}</textarea></div><p class="inline-error" role="alert"></p><button type="submit" class="button">수정 저장</button></form>`);
    const f=document.getElementById('edit-comment-form');f.addEventListener('submit',e=>{e.preventDefault();submit(f,async()=>{await CIC_API.request('updateComment',{id:c.id,version:c.version,body:f.elements.body.value});modal.close();toast(t('댓글을 수정했습니다.'));await route();});});
  }
  function confirmAction(heading,message,fn) {
    openModal(html`<h2 id="modal-title">${esc(heading)}</h2><p>${esc(message)}</p><form id="confirm-form"><p class="inline-error" role="alert"></p><div class="button-row"><button type="submit" class="button accent">확인</button><button type="button" class="button secondary" data-action="close">취소</button></div></form>`);
    const f=document.getElementById('confirm-form');f.addEventListener('submit',e=>{e.preventDefault();submit(f,async()=>{await fn();modal.close();});});
  }
  function loadGis() {
    if(window.google?.accounts?.oauth2)return Promise.resolve();
    if(gisPromise)return gisPromise;
    gisPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;const timer=setTimeout(()=>{gisPromise=null;reject(new Error(t('Google 로그인 화면을 불러오지 못했습니다. 인터넷 연결을 확인해주세요.')));},15000);s.onload=()=>{clearTimeout(timer);resolve();};s.onerror=()=>{clearTimeout(timer);gisPromise=null;reject(new Error(t('Google 로그인 연결을 확인해주세요.')));};document.head.append(s);});return gisPromise;
  }
  async function loginDialog() {
    if(member) {
      openModal(html`<h2 id="modal-title">${esc(member.name)} 님</h2><p>${member.status==='approved'?t('CIC 회원으로 로그인했습니다.'):t('CIC 회원으로 로그인했습니다.')}</p><div class="button-row">${member.role==='admin'?t('<a class="button secondary" href="#members" data-action="close">회원 관리</a>'):''}<button class="button secondary" data-action="logout">로그아웃</button></div><p id="logout-error" class="inline-error" role="alert"></p>`);return;
    }
    if(!CIC_API.configured()){openModal(t('<h2 id="modal-title">회원 서비스를 준비 중입니다</h2><p>Google 로그인 연결이 완료되면 회원 가입과 게시판을 이용할 수 있습니다.</p><button class="button secondary" data-action="close">확인</button>'));return;}
    openModal(t('<h2 id="modal-title">CIC에 오신 것을 환영합니다</h2><p>Google 계정으로 로그인하면 바로 지킴이 로그를 이용할 수 있습니다.</p><p class="muted small-text">회원 확인을 위해 Google 계정의 이름, 이메일, 계정 식별자를 저장합니다. 게시글에는 이름이 표시되며 이메일은 관리자만 확인할 수 있습니다. 계정 삭제는 관리자에게 요청해주세요.</p><button id="google-login" class="button secondary" disabled>Google 로그인 준비 중…</button><p class="inline-error" id="login-error" role="alert"></p>'));
    const button=document.getElementById('google-login'), error=document.getElementById('login-error');
    try {
      const [,challenge]=await Promise.all([loadGis(),CIC_API.request('challenge')]);
      if(!button.isConnected)return;
      const client=google.accounts.oauth2.initCodeClient({client_id:CIC_CONFIG.googleClientId,scope:'openid email profile',ux_mode:'popup',select_account:true,callback:async response=>{
        if(response.error||!response.code){button.disabled=false;error.textContent=t('로그인이 취소되었거나 완료되지 않았습니다.');return;}
        button.disabled=true;button.textContent=t('회원 정보를 확인하고 있습니다…');
        try{const data=await CIC_API.request('login',{code:response.code,challenge:challenge.challenge});CIC_API.setSession(data.session);member=data.member;modal.close();toast(member.status==='approved'?t('로그인했습니다.'):t('가입 신청이 접수되었습니다.'));if(location.hash==='#board')await route();else location.hash='board';}
        catch(e){error.textContent=t(e.message);button.textContent=t('다시 로그인 준비');button.disabled=false;button.onclick=loginDialog;}
      },error_callback:()=>{button.disabled=false;error.textContent=t('팝업이 닫혔거나 차단되었습니다. 팝업을 허용하고 다시 시도해주세요.');}});
      button.textContent=t('Google 계정으로 계속');button.disabled=false;button.onclick=()=>{error.textContent='';client.requestCode();};
    }catch(e){if(error.isConnected){error.textContent=t(e.message);button.textContent=t('다시 시도');button.disabled=false;button.onclick=loginDialog;}}
  }
  document.addEventListener('click',async event=>{
    const b=event.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
    try{
      if(action==='close')modal.close();
      else if(action==='login')await loginDialog();
      else if(action==='retry')await route();
      else if(action==='new-post')editor();
      else if(action==='edit-post'&&currentPost)editor(currentPost);
      else if(action==='delete-post'&&currentPost){const p=currentPost;confirmAction(t('게시글을 삭제할까요?'),t('이 글과 댓글은 지킴이 로그에서 더 이상 보이지 않습니다.'),async()=>{await CIC_API.request('deletePost',{id:p.id,version:p.version});toast(t('게시글을 삭제했습니다.'));location.hash='board';});}
      else if(action==='edit-comment'){const c=currentComments.find(c=>c.id===b.dataset.id);if(c)editComment(c);}
      else if(action==='delete-comment'){const c=currentComments.find(c=>c.id===b.dataset.id);if(c)confirmAction(t('댓글을 삭제할까요?'),t('이 댓글은 더 이상 표시되지 않습니다.'),async()=>{await CIC_API.request('deleteComment',{id:c.id,version:c.version});toast(t('댓글을 삭제했습니다.'));await route();});}
      else if(action==='member-status'){const{id,status}=b.dataset;confirmAction(status==='approved'?t('이 회원을 승인할까요?'):t('이 회원의 이용을 제한할까요?'),status==='approved'?t('지킴이 로그의 글과 댓글을 읽고 작성할 수 있게 됩니다.'):t('기존 로그인도 만료되며, 지킴이 로그를 이용할 수 없게 됩니다.'),async()=>{await CIC_API.request('setMemberStatus',{id,status});await route();});}
      else if(action==='refresh-member'){b.disabled=true;const d=await CIC_API.request('me');member=d.member;await route();}
      else if(action==='logout'){b.disabled=true;try{await CIC_API.request('logout');CIC_API.clear();member=null;modal.close();await route();}catch(e){document.getElementById('logout-error').textContent=t(e.message);b.disabled=false;}}
    }catch(e){toast(t(e.message));b.disabled=false;}
  });
  document.querySelector('.modal-close').addEventListener('click',()=>modal.close());
  window.addEventListener('hashchange',()=>{modal.close();route();});
  const logo=asset(CIC_CONFIG.assets.logo);
  if(logo){
    const makeLogo=()=>{const el=document.createElement('img');el.src=logo;el.alt=t('CIC 로고');el.width=1500;el.height=1500;return el;};
    document.querySelector('.wordmark').replaceWith(makeLogo());
  }

  CIC_I18N.applyShell();
  // Re-render in place: keep the active route, member/session and comment draft.
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',async()=>{
    if (main.querySelector('button[type="submit"]:disabled')) return;
    const next=button.dataset.language;
    if (!CIC_I18N.setLanguage(next)) return;
    const routeBefore=location.hash, y=window.scrollY;
    const drafts=Array.from(main.querySelectorAll('textarea,input,select')).filter(el=>el.id).map(el=>({id:el.id,value:el.value,start:el.selectionStart,end:el.selectionEnd}));
    C=CIC_I18N.content;
    labels={activity:t('활동 기록'),free:t('자유 게시판'),notice:t('공지')};
    CIC_I18N.applyShell();
    const toastElement=document.getElementById('toast');toastElement.hidden=true;clearTimeout(toastTimer);
    await route({keepScroll:true,scrollY:y});
    if(location.hash===routeBefore) drafts.forEach(d=>{const el=document.getElementById(d.id);if(el){el.value=d.value;if(el.setSelectionRange&&typeof d.start==='number')el.setSelectionRange(d.start,d.end);}});
  }));
  const header=document.querySelector('.site-header');
  const measureHeader=()=>document.documentElement.style.setProperty('--header-height',header.offsetHeight+'px');
  measureHeader();
  if(window.ResizeObserver) new ResizeObserver(measureHeader).observe(header);
  else window.addEventListener('resize',measureHeader);
  async function restoreSession() {
    try { const data = await CIC_API.request('me'); member = data.member; }
    catch (e) { if (['AUTH','BLOCKED'].includes(e.code)) CIC_API.clear(); }
  }
  restoreSession().finally(route);
})();
