# CIC 홈페이지 인수인계

## 2026-09-20 언어 버튼 상단 중앙 배치 및 헤더 여백 축소

- 사용자 요청에 따라 `한국어 / English` 플로팅 버튼(`.language-float`)을 우측 하단에서 **화면 상단 중앙**(`position:fixed; left:50%; transform:translateX(-50%); z-index:40`)으로 옮겼다. 로고(왼쪽)와 메뉴(오른쪽) 사이 빈 곳에 헤더 세로 중앙에 맞춰 놓이고 스크롤해도 따라온다(`top`: 데스크톱 33px, 1100px 이하 25px). 이 값은 헤더 높이(로고 높이 88/72px + 여백)에서 계산했으므로 로고 크기나 헤더 여백을 바꾸면 함께 조정한다. 글쓰기 플로팅 버튼은 우측 하단 그대로다.
- 헤더 상하 여백을 22px/14px/10px에서 6px로 줄였다(`.site-header{padding-block:6px;min-height:0}`). 헤더 높이는 데스크톱 133px→약 101px, 태블릿 101px→약 85px이다.
- **폭 720px 이하(폰)**: 중앙 버튼이 메뉴(특히 영어 메뉴)와 겹쳐서 로고 줄 위에 버튼 전용 띠(`padding-top:42px`, 버튼 `top:4px`)를 두었다. 그 결과 폰에서는 헤더가 79px→약 107px로 오히려 커졌다. 폰에서도 낮게 유지하려면 버튼 위치를 다시 정해야 한다.
- 변경 파일 `dist/styles.css`(끝에 추가한 규칙 블록), `dist/index.html`(`styles.css?v=58-language-top`). 바로 아래 기록의 우측 하단 위치(`right:28px;bottom:96px` 등)는 이 변경으로 대체됐다. Edge에서 iframe으로 1280·768·375px, 한국어·영어 메뉴에서 겹침 없음을 확인했다. 실제 폰 기기와 버튼 클릭 동작은 확인하지 못했다.
- 커밋 `5f9d526`(`Center language toggle at top and trim header padding`), Pages 실행 `35509089029` 성공, 공개 사이트 HTTP 200과 새 CSS 반영을 확인했다.

## 2026-09-20 언어 버튼을 플로팅 버튼으로 변경

- 사용자 요청에 따라 `한국어 / English` 토글을 헤더에서 빼서 화면 우측 하단에 고정(`position:fixed`)된 플로팅 버튼으로 바꿨다. 글쓰기 플로팅 버튼(연필) 바로 위에 놓는다(데스크톱 `right:28px;bottom:96px`, 1100px 이하 `right:18px;bottom:84px`). 흰 배경·그림자, 크기는 원래의 70% 유지, 인쇄 시 숨김.
- `dist/index.html`에서 토글 마크업을 `<header>` 밖 `<div class="language-float">`로 옮겼다. `data-language` 속성과 클릭 처리(`app.js`)·`aria-pressed` 갱신(`i18n.js`)은 그대로다. 헤더에는 로고와 메뉴만 남아 메뉴가 오른쪽 정렬이다. 바로 아래 "한 줄 배치" 기록 중 언어 버튼 관련 내용은 이 변경으로 대체됐다. `.header-controls`의 옛 CSS 규칙 일부는 더 이상 쓰이지 않는다. `styles.css?v=57-floating-language`.
- Edge에서 폭 900px·375px으로 렌더링해 글쓰기 버튼 위에 뜨는 것을 확인했다. 헤드리스라 실제 클릭으로 언어가 바뀌는 동작은 확인하지 못했으므로 배포 후 눌러 확인이 필요하다.
- 커밋 `bfe7bb8`(`Make language toggle a floating button`), Pages 실행 `35508808380` 성공, 공개 사이트 HTTP 200·`language-float` 마크업·새 CSS 반영을 확인했다.

## 2026-09-20 헤더 로고·메뉴·언어 버튼 한 줄 배치

- 사용자 요청에 따라 헤더의 로고, 메뉴(`CIC 소개 · 인천 문화유산 · 지킴이 로그`), `한국어 / English` 버튼이 모든 폭에서 한 줄에 놓이도록 했다. 이전에는 1100px 이하에서 메뉴가 두 번째 줄로 내려갔다. 메뉴와 언어 버튼 사이 간격은 28px→10px(480px 이하 4px), 메뉴 항목 간격은 12px(480px 이하 8px)로 줄였다. 메뉴·버튼은 오른쪽, 로고는 왼쪽이다.
- 구현은 `dist/styles.css` 끝에 추가한 규칙(`/* Header: logo, menu and language toggle share one line ... */`)이다. 이전 반응형 규칙(`flex-wrap:wrap`, 메뉴 `width:100%`·`order:2`)을 뒤에서 덮어쓰는 방식이라, 헤더 CSS를 고칠 때 이 블록이 우선함에 주의한다. `styles.css?v=56-header-one-line`.
- Edge에서 iframe으로 폭 1280·768·480·375px을 확인해 모두 한 줄이다. 320px에서는 마지막 메뉴가 두 줄로 나뉜다(한 줄 유지를 위해 줄바꿈 허용). 로그인한 상태(계정 버튼이 헤더에 추가됨)의 좁은 폭 배치는 확인하지 못했다.
- 커밋 `5bf1d22`(`Keep header logo, menu and language toggle on one line`), Pages 실행 `35508353590` 성공, 공개 사이트 HTTP 200과 새 CSS 반영을 확인했다.

## 2026-09-20 언어 버튼 70% 크기로 조정

- 사용자 요청에 따라 `한국어 / English` 토글을 원래 크기의 70%로 키웠다(글자 .6125rem≈9.8px, 버튼 높이 28px, 안쪽 여백·간격 70%, 480px 이하 여백 4.9px 7px). 바로 아래 기록의 50% 축소값은 이 값으로 대체됐다. `styles.css?v=55-toggle-70`.
- 커밋 `45b897b`(`Enlarge header language toggle to 70% of original size`), Pages 실행 `35508093358` 성공, 공개 사이트 HTTP 200과 새 CSS 반영을 확인했다. 실제 휴대폰 폭은 확인하지 못했다.

## 2026-09-20 헤더 언어 버튼·메뉴 글자 축소

- 사용자 요청에 따라 헤더의 `한국어 / English` 언어 토글을 50% 축소했다(글자 .875rem→.4375rem, 안쪽 여백·높이 절반, 높이 40px→20px, 480px 이하 여백도 절반). 글자가 약 7px로 작아 휴대폰에서 읽기·터치가 어려울 수 있다. 불편하면 60~70%로 조정한다.
- `CIC 소개 · 인천 문화유산 · 지킴이 로그` 메뉴 글자를 30% 줄이고(.9rem→.63rem, 1000px 이하 .875rem→.6125rem) 모든 폭에서 오른쪽 정렬로 바꿨다. 태블릿·모바일의 2번째 줄 메뉴도 양끝 정렬(`space-between`)에서 `flex-end`로 변경했다. 계정 버튼은 그대로다.
- 변경 파일 `dist/styles.css`, `dist/index.html`(`styles.css?v=54-header-size`). Edge 렌더링으로 1280px·700px 폭을 확인했고 실제 휴대폰(약 400px)은 확인하지 못했다.
- GitHub `main` 커밋 `2d43e67`(`Shrink header language toggle and nav text, right-align nav`), Pages 실행 `35507756885`. 공개 사이트 HTTP 200과 새 CSS 반영을 확인했다.

## 2026-09-20 다섯 가지 가치를 CIC 소개 페이지로 통합

- 별도 `#values` 페이지를 없애고, CIC 소개 페이지의 "함께 쌓아온 활동" 섹션(마지막 카드 `봉사의 가치를 인정받다` — 국가유산지킴이 우수활동 국가유산청장상·전국청소년자원봉사대회 수상 문구) 바로 다음, 단원 소감(`푹’ 빠진 이유`) 앞에 "다섯 가지 가치와 실천" 섹션(`valuesSection()`, `id="values"`)을 넣었다. 존중·책임감·정직·공정·배려 5개 항목 내용은 기존 그대로다.
- 상단 메뉴(`dist/index.html`)에서 "다섯 가지 가치"를 제거했다. 기존 링크 `#values`, `#values/<가치>`(예: `#values/fairness`, 홈의 "활동 살펴보기 ↗")는 소개 페이지를 열고 해당 섹션으로 스크롤하도록 `route()`에서 별칭 처리했다. 이때 메뉴는 "CIC 소개"가 선택되고 문서 제목도 `CIC · CIC 소개`다.
- 변경 파일: `dist/app.js`(v=56-values-in-about), `dist/index.html`, `dist/styles.css`(v=53-values-in-about). 서버 변경은 없다.
- 검증: 테스트 26개·JS 문법 검사 통과, Edge 렌더링으로 수상 카드 → 가치 5섹션 → 소감 순서, `#about`·`#values`·`#values/fairness` 동작, 영어 제목(`Five values in practice`) 확인. 모바일(약 400px) 레이아웃은 눈으로 확인하지 않았다.
- GitHub `main`에 커밋 `ae36003`(`Merge five core values into About CIC page`)을 푸시했고 Pages 실행 `35506780747`이 성공했다. 공개 사이트 HTTP 200, 배포된 `app.js`에 `valuesSection` 반영, 공개 `index.html`에서 `#values` 메뉴 링크 제거를 확인했다.

## 2026-09-20 게시판 오류(`SERVER`) 원인 및 해결: Apps Script 권한 승인 만료

**증상:** 지킴이 로그 게시판이 열리지 않음. 공개 `/exec`에 `listPosts`·`getPost`를 보내면 `code: SERVER`("요청을 처리하지 못했습니다. 관리자에게 서버 설정을 확인해 달라고…")로 실패하고, 시트를 읽지 않는 `challenge`만 성공했다.

**원인:** 배포 계정 `415hyunwoo@gmail.com`의 스프레드시트 권한(`https://www.googleapis.com/auth/spreadsheets`) 승인이 없는 상태였다. 진단용 배포(버전 17)로 확인한 실제 예외는 `SpreadsheetApp.openById을(를) 호출할 수 있는 권한이 없습니다. 필요한 권한은 …/auth/spreadsheets입니다.`였다. 아래는 원인이 **아니었다**: 시트 공유 권한(시트 `CIC Website Database`는 배포 계정 소유·편집 가능), `SPREADSHEET_ID` 불일치, 시트 탭·행 손상, 매니페스트 범위(이미 `spreadsheets` 포함).

**해결 방법(재발 시 그대로 실행):**
1. Apps Script 편집기를 **`415hyunwoo@gmail.com`**으로 연다.
2. 함수 선택에서 `setup`을 고르고 **실행**한다.
3. "권한 검토"가 뜨면 계정 선택 → 고급 → 이동 → **허용**한다(스프레드시트·Drive·외부 요청 권한이 모두 보여야 함).
4. `준비 완료`가 나오면 게시판을 새로고침한다. 재배포는 필요 없다. 승인은 계정 소유자의 브라우저 동의가 필요해 CLI로 대신할 수 없다.
- 2026-09-20 위 절차 후 게시판 복구를 사용자가 확인했다.

**진단 중 배포한 것:** 버전 17(진단용, 응답에 예외 문구 임시 노출) → 버전 18(`Log unexpected server errors`)로 기존 `/exec` 배포를 갱신했다. 버전 18은 `doPost`의 예상치 못한 예외를 `console.error('doPost failed [action]: …')`로 실행 로그에 남기고, 사용자 응답은 기존 일반 문구를 유지한다(`startUpload`만 상세 문구). 이제 같은 장애가 나면 Apps Script **실행(Executions)** 메뉴에서 원인을 바로 볼 수 있다. `/exec` URL은 그대로다. 서버·통신 테스트 26개 통과.

**재발 가능성 점검(주기적 발생 여부):** 재발 가능성이 높다. 근거: (1) 9월 13일 기록에 Cloud 프로젝트 연결과 "OAuth 테스트 사용자" 설정 후 `authorizeDrive`/`setup`을 승인했다고 되어 있고, README §3도 OAuth 앱이 "테스트 상태"임을 전제한다. (2) 장애 확인일 9월 20일은 승인일로부터 정확히 7일 뒤다. (3) Google OAuth 앱이 **테스트(Testing) 게시 상태**이고 민감·제한 범위(`spreadsheets`, `drive`)를 쓰면 승인(리프레시 토큰)이 **7일마다 만료**된다. 이 게시 상태는 CLI로 조회할 수 없어 아직 **콘솔에서 확인하지 못했다**(추정).

**근본 해결 진행 기록 (2026-09-20):**
- 확인: Google Auth Platform 대상(Audience)의 게시 상태가 **테스트 중**, 사용자 유형 **외부**, 테스트 사용자 `415hyunwoo@gmail.com` 1명이었다. 7일 만료 추정과 일치한다.
- 게시 버튼이 비활성이던 이유: 브랜딩 구성 미완료. Google 정책상 게시에는 **앱 이름, 지원 이메일, 홈페이지 URL, 개인정보처리방침 URL**이 필요하고, URL을 넣으면 승인된 도메인(`cic23.github.io`) 입력도 필수다. 게시 버튼 툴팁 문구로 필요한 항목을 확인할 수 있다.
- 개인정보처리방침 페이지 `dist/privacy.html`(한국어+영어 요약)을 추가해 `https://cic23.github.io/privacy.html`로 배포했다(커밋 `80e50b7`, Pages 실행 `35505061877` 성공, HTTP 200 확인). 수집 항목(Google 계정 식별자·이메일·이름, 게시글·댓글·좋아요·첨부, 익명 좋아요 해시 식별자, 세션)은 `apps-script/Code.gs` 동작에 맞춰 썼다. 삭제 요청·만 14세 미만 동의·보유 기간 문구는 운영자가 검토해야 한다. 정보 수집 방식이 바뀌면 이 페이지도 함께 고친다.
- 브랜딩 입력 후 앱을 게시했고 **게시 상태가 "프로덕션 단계"**로 바뀐 것을 사용자가 확인했다. 인증 센터에 "앱을 인증해야 합니다" 배너가 나오지만 **인증 신청은 하지 않는다**(제한 범위 `drive`는 보안 평가 필요, 소유자 본인 승인에는 불필요).
- 프로덕션 전환 뒤 Apps Script `setup` 재승인(고급 → 이동 → 허용, "확인되지 않은 앱" 경고 정상)을 사용자가 실행하는 것이 필요하다. 테스트 상태에서 받은 승인에는 7일 만료가 남아 있기 때문이다. 결과는 아래 항목에 기록한다.
- 서버 쪽 게시판 공개 요청(`listPosts`)은 프로덕션 전환 직후에도 HTTP 200·정상이다.

**재확인 필요(2026-09-28경):** 프로덕션 전환 후 승인이 7일이 지나도 유지되는지는 실험하지 못했다. 그날 `listPosts`가 정상이면 근본 해결이 확인된 것이다. 다시 `SERVER`가 나오면 위 해결 방법 1~4를 실행하고, 실행 기록의 `doPost failed [...]` 로그로 원인을 새로 확인한다. `setup` 재승인 실행 결과: 프로덕션 전환 후 사용자가 `setup`을 다시 실행했고, "확인되지 않은 앱" 경고나 권한 승인 화면 없이 바로 완료됐다(2026-09-20). 기존 승인이 유효해 재승인이 필요 없었던 것으로 보인다. 다만 이 승인이 7일 만료를 벗어났는지는 실행 결과만으로 알 수 없으므로 9월 28일경 재확인이 여전히 필요하다.

**회원 로그인은 이번 문제와 무관:** 운영자가 앱이 테스트 상태일 때도 Google 계정 소유자라면 누구나 로그인·게시할 수 있게 설정해 두었다고 정정했다. 이전 기록의 "테스트 상태라서 테스트 사용자만 로그인 가능했을 것"이라는 추정은 잘못이었으므로 삭제했다. 이번 장애는 회원 로그인이 아니라 배포 계정의 스프레드시트 권한 승인 만료(추정)만 다룬다. 프로덕션 전환으로 회원 로그인 동작이 달라졌다고 가정하지 않는다.

- 대안(비권장): Apps Script를 표준 Cloud 프로젝트 연결 없이 기본 프로젝트로 되돌리면 7일 제한은 없지만, Drive REST API(`UrlFetchApp`) 첨부 업로드에 표준 프로젝트의 API 사용 설정이 필요해 현재 구조와 맞지 않는다.

**스모크 요청(장애 여부 확인):** 브라우저 콘솔에서 `CIC_API.request('listPosts')`가 성공하면 정상이다. 실패하면 위 해결 방법을 먼저 실행하고, 그래도 안 되면 Apps Script 실행 기록의 `doPost failed [...]` 로그를 확인한다.

## 2026-09-20 인트로 탐방 카드 이미지 추가 및 GitHub Pages 배포

- 사용자 요청에 따라 인트로 홈페이지의 3개 탐방 카드에서 `탐방 가이드 읽기 ↗` 링크 바로 아래에 사진을 추가했다.
- 원본 사진은 `img/incheon01.jpg`, `img/incheon02.jpg`, `img/incheon03.jpg`에 있었고, GitHub Pages 공개 배포를 위해 각각 `dist/assets/incheon01.jpg`, `dist/assets/incheon02.jpg`, `dist/assets/incheon03.jpg`로 복사했다. 원본 `img/` 폴더는 기존처럼 Git에 추가하지 않았다.
- `dist/app.js`의 `guideCards()` 렌더링에 `<img class="guide-card-image" src="./assets/incheon${p.number}.jpg" ...>`를 추가해 01/02/03 카드가 각각 대응되는 이미지를 표시하도록 했다. 한국어/영어 페이지 모두 같은 카드 렌더러를 사용하므로 양쪽에 반영된다.
- `dist/styles.css`에 `.guide-card-image` 스타일을 추가해 카드 너비에 맞는 반응형 이미지로 표시되도록 했다. 기존 `.pending` 배지의 `border-radius`와 `color` 표시가 유지되도록 보정 규칙도 추가했다.
- 배포 전 검증으로 `node --test tests/backend.test.cjs tests/transport.test.cjs` 26개 테스트 통과, `dist/*.js` 문법 체크 통과, `git diff --check` 통과를 확인했다.
- GitHub `main`에 커밋 `bd906e3` (`Add Incheon guide card images`)를 푸시했다. GitHub Pages 워크플로 실행 `35501098344`가 성공했고, 공개 `https://cic23.github.io/` HTTP 200 및 `app.js` 내 `guide-card-image` 반영을 확인했다.
- 공개 이미지 URL `https://cic23.github.io/assets/incheon01.jpg`, `https://cic23.github.io/assets/incheon02.jpg`, `https://cic23.github.io/assets/incheon03.jpg`는 모두 HTTP 200으로 확인했다.
- GitHub Actions에서 Node.js 20 deprecation 및 `ubuntu-latest` 마이그레이션 안내 경고가 있었으나 배포에는 영향 없었다.

## 2026-09-20 CIC 영문 명칭 수정 및 GitHub Pages 배포

- 사용자 요청에 따라 영문/한글 모든 활성 페이지에서 `Chadwick International Cultural Protectors`를 `Chadwick International Culture protector`로 수정했다.
- 변경 파일은 `dist/app.js`, `dist/content.en.js`, `dist/i18n.js`, `dist/index.html`이며, `reference/`와 `node_modules/`는 검색 참고용으로만 제외했다.
- 배포 전 `node --test tests/backend.test.cjs tests/transport.test.cjs` 26개 테스트와 `dist/*.js` 문법 체크를 통과했다.
- GitHub `main`에 커밋 `6f6e4c0` (`Update CIC organization name`)를 푸시했고, GitHub Pages 워크플로 실행 `35498335637`이 성공했다.
- 공개 `https://cic23.github.io/` HTTP 200과 배포된 `app.js`, `content.en.js`, `i18n.js`에서 새 명칭 반영을 확인했다.

## 2026-09-14 지킴이로그 게시글 공유 아이콘 추가 및 배포

- 게시글 상세 하단의 좋아요·댓글 액션과 같은 줄 오른쪽 끝에 Google 모바일 UI의 연결점형 공유 아이콘을 추가했다. 아이콘에는 접근성 레이블과 영어 보기 번역(`Share`)을 적용했다.
- 모바일 등 Web Share API 지원 환경에서는 게시글 제목과 고유 URL을 기기 기본 공유 시트로 전달한다. 지원하지 않는 환경에서는 같은 URL을 클립보드에 복사하고 완료 안내를 표시한다.
- 구현은 `dist/app.js`, `dist/styles.css`, `dist/i18n.js`에 반영했으며, 공유 기능 변경만 커밋 `68cf7c8` (`Add share action to guardian log posts`)으로 GitHub `main`에 푸시했다. 기존 미추적 파일 `codex_cli_yolo.bat`, `img/`는 변경하거나 커밋하지 않았다.
- 배포 전 `node --test tests/backend.test.cjs tests/transport.test.cjs` 26개와 `dist/*.js` 문법 검사를 통과했다. GitHub Pages 실행 [34843700252](https://github.com/cic23/cic23.github.io/actions/runs/34843700252)가 성공했고, 공개 `https://cic23.github.io/` 및 배포된 `https://cic23.github.io/app.js`의 HTTP 200과 `data-action="share"`, `navigator.share` 반영을 확인했다.

## 2026-09-14 문화유산 가이드 소개 문구 수정

- 문화유산 가이드 소개 문구를 `CIC가 소개하는 인천 문화유산 탐방 이야기`로 변경하고 영어 보기에도 기존 번역을 반영했다. 변경된 파일 URL 버전은 `v=32-guide-copy`이다.

## 2026-09-14 글쓰기 로그인 창 문구 수정

- 글쓰기 로그인 창의 `문화유산 이야기를 남겨주세요!`를 `우리의 문화유산 이야기를 함께 나눠요!`로 변경하고 영어 번역도 반영했다. 변경된 파일 URL 버전은 `v=31-login-message`이다.

## 2026-09-14 다섯 가지 가치 제목 수정

- 가치 페이지 제목을 `다섯 가지 가치와 실천`으로 변경하고 영어 보기는 `Five values in practice`로 반영했다. 변경된 파일 URL 버전은 `v=30-values-heading`이다.

## 2026-09-14 첫 화면 가이드 문구 삭제

- 첫 화면의 `CIC와 함께하는 인천 문화유산 가이드` 문구를 제거하고 사용하지 않는 영문 전환 항목도 정리했다. 변경된 파일 URL 버전은 `v=29-remove-hero-guide`이다.

## 2026-09-14 글쓰기 요약 입력란 정리

- 글쓰기·수정 팝업의 요약 입력란을 한 줄 높이로 줄여 `비워 두면 본문 앞부분을 표시합니다.` 안내가 한 줄에 표시되게 했다. 공개·작성 안내 문구는 제거했다. 변경된 `app.js` URL 버전은 `v=28-summary-form`이다.

## 2026-09-14 영문 가이드 제목 수정

- 영문 첫 화면의 `CIC와 함께하는 Incheon Cultural Heritage Guide`를 `Incheon Cultural Heritage Guide with CIC`로 변경하고 영문 콘텐츠 제목도 통일했다. 변경된 파일 URL 버전은 `v=27-guide-title`이다.

## 2026-09-14 발간사 및 수상 활동 소개 문구 수정

- 발간사의 문화유산 안내서 문구와 수상 활동 소개를 요청한 문장으로 수정하고 영어 콘텐츠에도 같은 의미를 반영했다. 변경된 콘텐츠 파일 URL 버전은 `v=26-publication-copy`이다.

## 2026-09-14 글쓰기 로그인 창 영문 및 글자 크기 수정

- 글쓰기 로그인 창의 영문 안내를 `Sign in with Google to use the Guardian Log immediately.`로 수정했다. `문화유산 이야기를 남겨주세요!`는 첫 로그인 안내와 같은 본문 글자 크기로 표시한다. 변경된 파일 URL 버전은 `v=25-login-translation`이다.

## 2026-09-14 글쓰기 로그인 안내 문구 수정

- 비로그인 방문자가 지킴이 로그의 글쓰기 버튼을 눌렀을 때 뜨는 Google 로그인 창에서 개인정보 저장 안내를 제거하고 `문화유산 이야기를 남겨주세요!`로 바꿨다. 영어 번역도 추가했다. 변경된 파일 URL 버전은 `v=24-login-copy`이다.

## 2026-09-14 첫 화면 소개 문구 수정

- 첫 화면 소개 문구를 `청소년의 시선으로 기록하고 지켜나가는 우리는 대한민국 국가유산지킴이입니다.`로 변경하고 영어 콘텐츠에도 같은 의미를 반영했다. 변경된 콘텐츠 파일 URL 버전은 `v=23-hero-subtitle`이다.

## 2026-09-14 지킴이 로그 제목 및 빈 화면 버튼 정렬

- 지킴이 로그 제목 아래에 `기록으로 남기는 문화유산`을 추가하고, 빈 게시판의 `글쓰기` 버튼을 가운데 정렬했다. 영어 보기 번역도 추가했다. 변경된 정적 파일 URL 버전은 `v=22-board-heading`이다.

## 2026-09-14 빈 지킴이 로그 글쓰기 버튼

- 지킴이 로그가 비어 있을 때 안내 문구 아래에 `글쓰기` 버튼을 추가했다. 승인 회원은 게시글 작성 창으로, 비로그인 방문자는 로그인으로 연결된다. 변경된 `app.js` URL 버전은 `v=21-empty-board-write`이다.

## 2026-09-13 첫 화면 한 줄 표기

- `CIC와 함께하는 인천 문화유산 가이드`의 줄바꿈을 제거했다. 변경된 `app.js` URL 버전은 `v=20-hero-line`이다.

## 2026-09-13 첫 화면 소개 문구 수정

- 첫 화면의 `채드윅송도국제학교 CIC와 함께하는`을 `CIC와 함께하는`으로 변경했다. 변경된 `app.js` URL 버전은 `v=19-hero-copy`이다.

## 2026-09-13 콘텐츠 표기 수정

- 모금 활동 소개에서 굿네이버스 명칭을 제거하고, 가이드 제목을 `월미도 & 월미공원`으로 변경했다. 영어 콘텐츠에도 같은 변경을 반영했다.
- 하단 연락처 제목의 `채드윅 청소년 국가유산지킴이` 띄어쓰기를 데이터 속성과 번역 키까지 통일했다. 변경된 정적 파일의 URL 버전은 `v=18-content`이다.

## 2026-09-13 콘텐츠 문구 및 출처 링크 정리

- 첫 화면의 CIC 영문 표기 뒤 한국어 병기를 제거했다. 모금 금액·앰버서더 위촉 기관 확인 중 문구·탑골공원 게이트볼장 언급·소개 페이지의 편집자 주석을 제거하고 요청 문구로 바꿨다. 영어 콘텐츠에도 같은 의미의 변경을 적용했다.
- 자유공원과 월미공원 참고 자료 링크를 한국어·영어 가이드에서 제거했다. 변경된 콘텐츠·JS·CSS의 URL 버전은 `v=17-content`이다.

최종 업데이트: 2026-09-13

최신 백엔드 배포는 Apps Script **버전 16**이다. 배포 결과는 문서 끝의 제목 우선 로딩 기록을 참조한다. 아래 버전 11/원격 소스 불일치는 해결 전 기록이며, 업로드 응답 오류는 버전 12에서 수정했다.

## 현재 상태

- GitHub Pages는 `main` 푸시 시 Actions로 `https://cic23.github.io/`에 배포된다.
- 정적 프런트엔드는 `dist/`, Google Sheets·Apps Script 백엔드는 `apps-script/`에 있다. 비밀값·OAuth 토큰·`.clasp.json`은 Git에 넣지 않는다.
- 원본 v2는 `reference/extracted-v2/CIC-deployed-v2/CIC-original/`에 보관한다. 원본 디자인·텍스트·이미지를 보존하며, LLM 게시글 번역은 후속 단계다.

## 이번까지 완료한 일

- 한국어/영어 전환, 지킴이 로그 회원 기능, GitHub Pages 및 Apps Script 운영 연결을 구현했다.
- 지킴이 로그를 누구나 읽을 수 있는 카드형 피드로 전환했다. 카드에는 대표 사진·동영상, 제목, 요약, 좋아요·댓글 수만 표시하며 게시 날짜와 싫어요는 표시하지 않는다.
- Google 로그인 회원만 글쓰기·댓글·좋아요를 사용할 수 있다. 좋아요는 계정별 토글이며, 누른 회원 기록은 비공개 감사 데이터로 보관한다.
- 게시물에는 이미지·동영상을 최대 5개, 파일당 100MB까지 첨부할 수 있다. 파일은 설정된 비공개 Google Drive 폴더에 저장하고 게시물에 연결된 파일만 공개한다. Apps Script 배포 버전 5와 GitHub Pages 배포를 확인했다.
- 지킴이 로그 목록의 글쓰기를 우측 하단 주황색 플로팅 버튼으로 변경했다. 비로그인 사용자가 누르면 Google 로그인 창을 연다.
- 게시물 수정 화면에서도 기존 첨부를 유지한 채 사진·동영상을 추가할 수 있고, 기존 첨부는 항목별로 삭제할 수 있다. 총 첨부 수는 새 파일을 합산해 최대 5개로 제한한다.
- 홈페이지 하단에 CIC 색상(네이비·주황) 기반 Contact 영역을 추가했다. School, Email, Instagram, YouTube 카드를 제공하며 Email·Instagram·YouTube는 카드 전체가 링크다.
- 문의 주소를 `e3kim2027@chadwickschool.org`로 통일했고 footer는 저작권 표기만 남겼다.
- 하단 UI 변경 전 `node --test tests/backend.test.cjs tests/transport.test.cjs`와 `dist/*.js` 문법 검사를 실행한다. 배포 후 공개 URL의 HTTP 200과 변경 마크업을 확인한다.

## 이번 세션 (2026-09-13)

- 게시물 수정 화면에서 기존 사진·동영상을 유지하면서 새 첨부를 추가할 수 있게 했고, 기존 첨부는 항목별 `삭제` 버튼으로 제거할 수 있게 했다. 유지 파일과 새 파일을 합산한 첨부 한도는 5개다.
- 지킴이 로그 목록에서 `지킴이 로그 · N개의 글` 제목, 소개 문구, 우측 상단 글쓰기 버튼을 제거했다. 우측 하단 플로팅 글쓰기 버튼만 유지하며 관리자에게만 회원 관리 버튼을 표시한다.
- 첨부 추가·교체·해제 백엔드 회귀 테스트를 추가했다. `node --test tests/backend.test.cjs tests/transport.test.cjs` 20개 통과와 `dist/*.js` 문법 검사를 확인했다.
- GitHub `main`에 커밋 `38d5912` (`Improve guardian log post editing`)을 푸시했다. GitHub Actions 실행 `34731718625`가 성공했고, `https://cic23.github.io/` 및 배포된 `app.js`의 HTTP 200과 변경 마크업을 확인했다.
- `clasp show-authorized-user`로 확인한 활성 clasp 계정은 `415hyunwoo@gmail.com`이다.
- 플로팅 글쓰기 버튼은 모든 페이지에 공통으로 표시한다. 텍스트 없이 좌우 반전한 연필 아이콘만 남기며, 로그인 회원에게는 글쓰기, 비로그인 사용자에게는 로그인 동작을 제공한다. 게시판 제목과 목록의 간격도 줄였다.
- Google Cloud 프로젝트에서 Google Drive API를 활성화하고 Apps Script `setup`을 다시 실행했다. Shared Drive 폴더도 지원하도록 업로드 시작·파일 확인·공개 권한 요청에 `supportsAllDrives=true`을 적용했으며, Drive API가 업로드 시작을 거절하면 서버 로그에 HTTP 상태와 응답 본문 앞부분을 기록한다.
- Apps Script 소스를 푸시하고 기존 웹앱 `/exec` 배포를 버전 5(`Support shared Drive attachments`)로 갱신했다. 공개 `listPosts` API 요청의 HTTP 200과 `CIC_API_V1` 응답을 확인했다. 실제 사진 업로드는 재시험이 필요하며, 재차 실패하면 Apps Script 실행 기록의 `Drive resumable upload start failed (...)` 로그를 확인한다.

## 배포 방법

### GitHub Pages (정적 프런트엔드)

1. 배포할 파일만 `git add`한다. 비밀 파일과 임시 파일은 추가하지 않는다.
2. `node --test tests/backend.test.cjs tests/transport.test.cjs` 및 `Get-ChildItem dist -Filter *.js | ForEach-Object { node --check $_.FullName }`를 실행한다.
3. `git commit -m "..."` 후 `git push origin main`을 실행한다. `main` 푸시가 `.github/workflows/pages.yml`을 통해 `dist/`를 GitHub Pages에 배포한다.
4. `gh run list --workflow pages.yml --limit 3`로 실행 ID를 확인하고 `gh run watch <실행-ID> --exit-status`로 성공을 기다린다.
5. `curl.exe -I https://cic23.github.io/`로 HTTP 200을 확인하고, 변경한 JS·CSS 파일도 실제 URL에서 받아 필요한 문자열이나 마크업이 반영됐는지 확인한다.

### Apps Script (백엔드 변경 시에만)

1. 먼저 `clasp show-authorized-user`를 실행해 활성 계정이 `415hyunwoo@gmail.com`인지 확인한다. 다른 계정이면 배포하지 않고 로그인 상태를 바로잡는다.
2. `clasp status`로 푸시 대상 파일을 확인한 뒤 `clasp push`를 실행한다.
3. 새 버전을 만들고, 기존 웹 앱 배포 ID를 `clasp deployments`로 확인한 뒤 `clasp redeploy <배포-ID> -V <버전번호>`로 기존 웹 앱을 갱신한다. 새 웹 앱을 만들 필요가 있을 때만 `clasp deploy -V <버전번호>`를 사용한다.
4. 공개 `/exec` URL에 실제 요청을 보내 HTTP 응답과 필요한 동작을 확인한다. 배포 생성 또는 갱신 성공 메시지만으로 정상 동작을 판단하지 않는다.

## 2026-09-13 상세 화면의 다른 게시물 스크롤

- 상세의 `목록보기` 및 작은 수정·삭제 버튼은 커밋 `56576c8`, Pages 실행 `34750439616`으로 배포 완료했다.
- 다른 게시물의 썸네일·제목·작성자·분류 카드를 추가했다. 960px 이상 가로 화면에서는 우측 고정 위치의 세로 스크롤, 세로형/좁은 화면에서는 상세 아래 가로 스크롤이다. 이전/다음 버튼과 기본 스크롤을 지원한다.
- 현재 게시물은 제외하며 공지 고정과 관계없이 작성 시각 내림차순으로 표시한다. 공개 목록의 전체 페이지를 모아 정렬하고 60초 메모리 캐시로 재사용한다. 게시물 생성·수정·삭제 시 무효화한다. 목록 실패는 상세 본문에 영향을 주지 않고 목록 내 재시도 버튼을 표시한다.
- 서버·통신·언어 테스트 27개와 JS 문법 검사를 통과했다. 브라우저 모의 API로 32개 게시물/3페이지 정렬, 현재 글 제외, 1440×900 우측 배치, 390×844 및 1024×1366 하단 배치, 스크롤 버튼, 카드 이동, 영문 전환 시 원문 보존, 깊은 링크, 실패·빈 목록·재시도 및 댓글 초안 보존을 확인했다.
- 정적 프런트엔드 변경으로 Apps Script는 버전 14를 유지했다. GitHub `main`에 커밋 `a22871a` (`Add responsive other-post thumbnail rail`)을 푸시했고, Pages 실행 `34751292275`가 성공했다.
- 배포 뒤 `https://cic23.github.io/`와 `app.js`·`styles.css`·`i18n.js`의 HTTP 200 응답을 확인했다. 공개 파일에 `renderRelatedPosts`, `.related-list`, `Other posts` 마커가 포함되고, 실제 게시물 상세에서 다른 게시물 목록이 표시되는 것을 확인했다.

## 2026-09-13 비로그인 좋아요

- 좋아요를 인증 필수 작업에서 분리했다. 로그인하지 않은 방문자는 브라우저에 저장한 64자리 무작위 식별자로 게시물별 좋아요를 토글하고, 서버에는 이 식별자의 SHA-256 해시를 `anon:` 접두어와 함께 저장한다. 같은 브라우저는 재클릭으로 취소할 수 있으며, 로그인 회원은 기존 회원 ID 기반 좋아요를 그대로 사용한다.
- 익명 식별자가 없거나 형식이 올바르지 않으면 요청을 거절하며, 좋아요 요청은 식별자별 분당 30회로 제한한다. 익명 좋아요는 브라우저 데이터 삭제·다른 브라우저·시크릿 창에서 별도 상태로 처리된다.
- 백엔드 회귀 테스트는 익명 좋아요의 생성·목록 상태·취소, 로그인 회원 좋아요, 누락 식별자 거절을 검증한다. 전송 테스트는 익명 식별자가 POST 본문에만 포함되고 로컬 저장소에 유지되는지 확인한다.
- 활성 clasp 계정 `415hyunwoo@gmail.com`으로 Apps Script 소스를 푸시하고 버전 15(`Allow anonymous post likes`)를 만들었다. 기존 공개 웹앱 `AKfycbza76ryDmCily3xLq79WX_TPNtdmpgMGfZc3ge_0WsyNobObKrleJ0L-Iy1-69nwJ7_hw`를 버전 15로 갱신했으며 URL은 유지했다.
- GitHub `main`에 커밋 `cc655d7`을 푸시했고 Pages 실행 `34752216092`가 성공했다. 공개 페이지의 비로그인 상태에서 실제 좋아요 수가 1→2→1로 토글되고 로그인 대화상자가 열리지 않는 것을 확인했다. 사이트와 변경된 JS 파일도 HTTP 200으로 응답했다.

## 다음 할 일

1. **게시판 상세 튜닝:** 게시물 상세의 미디어 갤러리·좋아요·댓글 흐름, 가독성 및 모바일 레이아웃을 검토·개선한다. 회원명·게시글·댓글 원문은 번역하거나 변경하지 않는다.
2. 일반 Google 계정과 관리자 계정으로 로그인·자동 승인·세션 복원·글/댓글 작성·차단을 PC와 모바일에서 실사용 검증한다.
3. 한국어/영어 전환, 깊은 링크, 이미지·CSS·JS 오류를 다시 확인한다.
4. 실제 계정으로 사진·동영상 첨부를 재시험한다. 실패 시 Apps Script 실행 기록에 남은 Drive API HTTP 상태와 응답 사유를 확인한다.

## 2026-09-13 첨부 업로드 후속 점검

- 활성 clasp 계정은 `415hyunwoo@gmail.com`으로 확인되어 있다. Apps Script 프로젝트 ID는 `.clasp.json`에만 보관하며 Git에 올리지 않는다.
- Drive API와 Apps Script 권한 문제를 순차적으로 해결했다. Cloud 프로젝트 연결, Drive API 사용 설정, OAuth 테스트 사용자/Drive 범위 설정 뒤 Apps Script 편집기에서 `authorizeDrive`와 `setup` 실행은 성공했다.
- 업로드 흐름은 (1) Apps Script가 Drive resumable-upload 세션과 사전 생성 파일 ID를 발급하고, (2) 브라우저가 Drive에 PUT 업로드하며 진행률을 표시하고, (3) Apps Script가 Drive 파일 크기·형식과 공개 읽기 권한을 확인한 뒤 게시물에 연결하는 구조다. Drive 업로드 응답의 브라우저 CORS 제한 때문에, 브라우저 PUT 응답이 읽히지 않아도 3단계의 서버 확인을 기준으로 완료 처리한다.
- 로컬 소스의 `startUpload_()`는 빈 resumable-session 응답 본문을 JSON으로 파싱하지 않도록 되어 있다. `generatedDriveId_()`도 빈/비정상 JSON을 잡아 일반적인 서버 오류로 바꾼다. 따라서 사용자에게 다시 보인 `Unexpected end of JSON input`은 로컬 최신 코드가 아닌 Apps Script `/exec` 배포 버전에서 발생했을 가능성이 높다.
- 2026-09-13 공개 API를 실제 POST로 확인했다. `https://script.google.com/macros/s/AKfycbza76ryDmCily3xLq79WX_TPNtdmpgMGfZc3ge_0WsyNobObKrleJ0L-Iy1-69nwJ7_hw/exec`는 HTTP 200 및 `CIC_API_V1` 응답을 반환했지만, 최신 소스에 추가한 기존 이미지의 인라인 URL(`lh3.googleusercontent.com/d/<Drive ID>`)은 반환하지 않았다. 즉 현재 `/exec`는 최신 `apps-script/Code.gs`와 일치하지 않는다.
- 현재 Git 최신 커밋은 `6efb32b Display Drive media and upload progress`이다. 이 버전에는 이미지 표시 수정과 XHR 업로드 진행률 표시가 포함되어 있다. GitHub Pages 정적 배포는 Actions 실행 `34736959082` 성공으로 확인했다.

### Apps Script 재배포 필수 절차

1. `clasp show-authorized-user`로 `415hyunwoo@gmail.com`인지 확인한다.
2. 로컬에서 `clasp push`를 실행하여 `apps-script/Code.gs`와 `apps-script/appsscript.json`을 Apps Script 프로젝트에 반영한다. `clasp`가 응답 없이 멈추면 Apps Script 편집기에서 프로젝트 파일이 최신 소스와 같은지 먼저 확인한다.
3. Apps Script 편집기에서 **배포 → 배포 관리 → 기존 웹 앱의 연필 아이콘**을 열고, **버전: 새 버전**을 선택한 뒤 배포한다. 새 배포를 만들지 말고 기존 `/exec` 배포를 갱신한다.
4. `/exec` URL은 그대로여야 한다. 배포 후 게시물 목록을 새로고침해 기존 이미지가 보이는지, 새 이미지 첨부가 완료되는지 확인한다.
5. 같은 오류가 남으면 Apps Script **실행**에서 해당 `startUpload` 실행의 오류 전문과 시간대를 확보한다. 최신 코드가 배포되어 있다면 원문 `Unexpected end of JSON input` 대신 구체적인 Drive/서버 오류가 반환되어야 한다.

## 2026-09-13 버전 12 배포 완료

- Apps Script API로 기존 웹앱 버전 11과 원격 HEAD를 직접 조회했다. 둘 다 `startUpload_()`에서 빈 Drive 응답을 JSON으로 읽고 있었으며, 해당 소스를 모의 실행하여 `Unexpected end of JSON input`을 재현했다. 같은 조건에서 로컬 수정본은 성공했다.
- 사용자 요청에 따라 활성 clasp 계정 `415hyunwoo@gmail.com`과 업로드 대상 두 파일을 확인했다. `node --test tests/backend.test.cjs tests/transport.test.cjs` 20개 및 `dist/*.js` 문법 검사가 통과했다.
- 최초 `clasp push`는 `Skipping push.`로 종료했다. 설치된 clasp 3.4.1 소스를 확인한 결과 매니페스트 변경 확인을 비대화형 환경에서 자동 거절하는 동작이었다. 원격과 로컬 매니페스트는 항목 순서만 달랐고 OAuth 범위·웹앱 접근 설정은 같았다.
- `clasp push --force`로 `apps-script/Code.gs`와 `apps-script/appsscript.json`을 반영했다. 버전 12(`Fix empty Drive upload responses and media display`)를 생성하고 기존 웹앱을 `clasp redeploy <기존 배포 ID> -V 12`로 갱신했다. `/exec` URL은 유지했다.
- 배포 후 Apps Script API HTTP 200 응답으로 운영 버전 12, 배포 코드의 로컬 일치(줄바꿈 정규화 비교), 매니페스트의 구조적 일치를 확인했다. 실행 주체는 `USER_DEPLOYING`, 접근은 `ANYONE_ANONYMOUS`다.
- 실제 홈페이지와 `/exec` GET은 HTTP 200이고, 브라우저의 `CIC_API.request('listPosts')`도 성공했다. 로그인 회원의 실제 첨부 업로드·게시물 저장은 아직 검증하지 않았다.
- 프런트엔드 변경이나 GitHub 재배포는 없었다. 이번 배포 기록은 README.md와 handoff.md에 남겼다.

## 2026-09-13 요약 선택 입력 및 상세 댓글 UI

- 요약과 본문은 선택 입력으로 변경했다. 제목은 계속 필수다. 목록에서는 요약이 없으면 본문을 공백 정리 후 최대 300자/3줄로 표시하며, 둘 다 없으면 빈칸이다. 자동 미리보기는 목록 응답에만 적용하고 저장 데이터와 수정 화면의 요약란에는 넣지 않는다.
- 상세 화면을 작성자·미디어·본문 카드 형태로 바꾸고, 본문 아래에 하트/좋아요 수와 말풍선/댓글 수를 나란히 배치했다. 상단 좋아요는 제거했다. 말풍선으로 댓글 영역을 토글하며 맨 아래 한 줄 입력창에서 버튼 또는 Enter로 댓글을 등록한다.
- 좋아요는 상태·숫자만 갱신하여 스크롤과 댓글 초안을 보존한다. 댓글 열기/닫기와 언어 전환도 초안을 유지한다. 새 댓글이 다음 페이지에 속하면 해당 페이지로 이동한다. 비회원에게는 댓글 열람과 로그인 안내를 제공한다.
- 서버·통신·언어 테스트 26개와 `dist/*.js` 문법 검사가 통과했다. 로컬 모의 API 브라우저에서 PC/390px 모바일 배치, 요약 생략과 빈 본문, 댓글 토글·등록, 31번째 댓글 페이지 이동, 좋아요 성공/실패 시 초안 유지, 언어 전환 및 비로그인 화면을 확인했다. 운영 데이터에 시험 게시물·댓글을 만들지는 않았다.
- 활성 clasp 계정 `415hyunwoo@gmail.com`으로 소스를 반영하고 기존 웹앱을 버전 13(`Optional post summaries and compact comment interface`)으로 갱신했다. 웹앱 URL은 동일하다.

## 2026-09-13 지킴이 로그 반응 속도 개선 및 배포

- 구현 계획은 `plan.md`에 기록했다. 게시물 상세는 목록에서 받은 제목·작성자·대표 미디어를 먼저 보여 주고, 한 번 읽은 게시물·댓글 페이지는 브라우저 메모리 캐시에서 즉시 다시 표시한다. 로그인·로그아웃·게시물 또는 댓글 수정·삭제 시 관련 캐시는 비운다.
- 좋아요는 클릭 즉시 하트 상태와 숫자를 바꾸고, 서버의 최종 `liked`·`likeCount` 응답으로 확정한다. 요청 실패 시에는 클릭 전 상태와 숫자로 복구한다.
- 댓글 등록은 `createComment` 한 번으로 끝나며, 새 댓글·댓글 수·페이지 정보를 응답받아 댓글 영역만 갱신한다. 새 댓글이 다른 페이지에 속할 때만 해당 댓글 페이지로 이동한다.
- `listPosts`와 `getPost`은 Posts, Comments, Attachments, Likes 시트를 각각 한 번 읽어 메모리에서 좋아요·댓글 수와 첨부 정보를 집계한다. 게시물·첨부·좋아요 항목마다 시트를 다시 읽던 호출을 제거했다.
- 댓글 생성 응답의 페이지 메타데이터와 31번째 댓글 경계를 검증하는 회귀 테스트를 추가했다. 같은 밀리초에 생성된 테스트 댓글의 정렬 순서가 달라질 수 있어, 반환 페이지에 해당 댓글이 실제 포함되는지 확인하도록 테스트를 안정화했다.
- 활성 clasp 계정 `415hyunwoo@gmail.com`을 확인한 뒤 `clasp push --force`를 실행하고 Apps Script 버전 14(`Speed up guardian log interactions`)를 만들었다. 기존 공개 웹앱 배포 `AKfycbza76ryDmCily3xLq79WX_TPNtdmpgMGfZc3ge_0WsyNobObKrleJ0L-Iy1-69nwJ7_hw`를 버전 14로 갱신했으며 URL은 유지했다.
- GitHub `main`에는 `022e030`과 테스트 안정화 커밋 `d86e814`를 푸시했다. Pages 실행 `34749437217`이 성공했고, `https://cic23.github.io/`의 HTTP 200 및 배포된 `app.js`의 `postPreview`, `setLikeUI`, `commentMarkup` 마커를 확인했다.
- `node --test tests/*.test.cjs` 27개와 `dist/*.js` 문법 검사가 통과했다. 운영 게시물·좋아요·댓글을 만들지는 않았으므로, 로그인한 실제 계정에서의 클릭·댓글 등록 흐름은 후속 실사용 점검 대상으로 남아 있다.

## 2026-09-13 제목 우선 로딩 및 썸네일 요청 조절

- 점검 결과 기존 목록은 전체 정보 응답 뒤 한 번에 표시했고, 상세의 다른 게시물은 모든 페이지를 모은 뒤 표시했다. 상세 제목 미리보기는 목록에서 진입한 경우에만 있었다.
- `listPosts`의 `view:'titles'`, `getPost`의 `view:'title'`을 추가했다. 제목 조회는 Posts 시트만 읽으며 공개 ID·제목·정렬 시각만 반환한다. 목록은 제목 카드 → 최대 15개 ID별 카드 내용 → 화면 근처 썸네일 순으로 표시한다. 직접 연 상세도 제목부터 표시하고 본문·첨부·댓글을 이어서 받는다.
- 다른 게시물은 서버 `sort:'newest'`로 첫 페이지부터 표시하고 페이지별로 내용을 채운다. 현재 글 제외, 반응형 스크롤, 완성된 목록의 60초 캐시는 유지한다. 내용 요청 실패 시 이미 받은 제목 링크와 재시도 버튼을 제공한다.
- `dist/media.js`를 추가했다. 두 번의 animation frame 뒤 화면 근처(160px)의 이미지를 최대 3개씩 요청한다. 라우트 이동 시 대기·진행 요청을 정리하고, 15초 이상 멈춘 이미지는 취소해 다음 이미지가 진행되게 한다. 사진 썸네일은 Drive 480px URL이며 상세 원본 URL은 유지한다. 동영상의 자동 metadata 다운로드를 없애고 재생 시에만 로드한다. 다른 게시물의 영상 카드는 재생 아이콘이다.
- 비로그인 시작 시 `me` 요청을 생략한다. 카드 내용을 채울 때 링크 DOM을 보존해 키보드 포커스를 유지한다. 상세 제목은 미디어 위로 배치했다. 원문·회원명·댓글은 변경하거나 번역하지 않았다.
- 회귀 테스트 33개와 모든 `dist/*.js` 문법 검사를 통과했다. 모의 API 브라우저로 15개 제목 먼저 표시/이미지 요청 0개, 내용 뒤 이미지 3개부터 요청, 17개 글 페이지별 표시, 직접 접속, 요청 실패·재시도, 이전 응답 무시, 390px 모바일, 영상 자동 요청 0개, 영어 전환 시 원문·키보드 포커스 보존을 확인했다. 실제 공개 사진의 480px 응답(HTTP 200, 자연 너비 480px)도 확인했다.
- 활성 clasp 계정 `415hyunwoo@gmail.com`으로 서버 파일 두 개를 푸시하고 기존 공개 웹앱을 버전 16(`Load guardian post titles before content and thumbnails`)으로 갱신했다. `/exec` HTTP 200, 실제 `listPosts` 제목 3개와 `getPost` 제목의 필드가 `id/title/createdAt`만 포함하는 것, 후속 카드 조회와 480px 썸네일 URL을 확인했다. GitHub Pages 배포 결과는 이어서 기록한다.
- 구현 커밋 `75d2f41`의 Pages 실행 `34753371136`은 성공했고 공개 파일 6개의 HTTP 200 및 로컬 해시 일치를 확인했다. 기존 방문 브라우저가 이전 `app.js`·`api.js`를 캐시해 새 HTML과 섞어 쓰는 현상을 발견하여 변경된 JS·CSS URL에 `?v=16-titles`를 추가한다. 이후 정적 파일 변경 시 해당 버전 문자열도 갱신한다.
- 캐시 갱신 커밋 `e26991a`와 Pages 실행 `34753496043`이 성공했다. 버전이 붙은 공개 파일 6개 모두 HTTP 200 및 로컬 해시 일치를 확인했다. 실제 운영 브라우저에서 제목 카드 3개/이미지 요청 0개 → 카드 내용 → 480px 사진 2개 표시, 상세 제목 미리보기 → 본문, 다른 게시물 2개 표시를 확인했다. PC 상세 스크린샷도 확인했으며 운영 게시물·댓글·좋아요는 변경하지 않았다.
