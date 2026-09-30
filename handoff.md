# CIC 홈페이지 인수인계

## 2026-10-01 CIC 소개 "정직" 사진 Honesty02.jpg 삭제

- 사용자 요청에 따라 CIC 소개 다섯 가지 가치 중 정직(Honesty)의 두 번째 사진을 없앴다: `app.js` 가치별 사진 목록에서 `value-honesty-2` 제거, `config.js`의 `value-honesty-2` 항목 제거, `dist/assets/Honesty02.jpg` 삭제(`git rm`, 원본은 `img/`와 Git 기록에 있음). 정직은 이제 `Honesty01.jpeg` 1장(다른 가치와 같은 1장 배치, 배려만 4장).
- 버전 `config.js?v=53-no-honesty02`, `app.js?v=116-no-honesty02`. 테스트 38개·JS 문법 통과. 로컬·공개 한·영에서 Honesty02 0장, 깨진 이미지 0, 가치별 사진 수 [1,1,1,1,4], 가로 넘침 없음 확인. 커밋 `ac8c65a`, Pages 실행 `36786643248` 성공.

## 2026-10-01 지킴이 로그 카드: 분류 옆에 글쓴이 이름

- 사용자 요청에 따라 게시판·인트로의 지킴이 로그 카드에서 분류(예: 활동 기록) 바로 옆에 글쓴이 이름을 작은 회색 글씨로 표시한다. `hydratePostCards()`가 분류 뒤에 `<span class="post-card-author">`(이름은 `esc()`)를 넣는다. CSS `.post-card-author{margin-left:8px;font-size:.75rem;font-weight:400;color:var(--muted)}`. 게시글 상세는 기존대로 머리글에 작성자 표시.
- 버전 `app.js?v=115-card-author`, `styles.css?v=115-card-author`. 테스트 38개·JS 문법 통과. 공개 게시판 1280px·홈 390px에서 카드 9개 모두 이름 표시(12px, 회색, 분류와 같은 줄) 확인(읽기 전용). 커밋 `39fafb7`, Pages 실행 `36785815250` 성공.

## 2026-10-01 지킴이 로그도 제목 언어별로 표시(Apps Script 버전 21)

- 사용자 요청에 따라 한국어 사이트는 제목에 한글이 있는 글만, 영어 사이트는 한글이 없는 글만 보인다. 게시판이 서버에서 15개씩 페이지를 나누므로 화면이 아닌 **서버에서** 거른다: `listPosts_`에 선택 값 `d.lang`('ko'/'en', 그 외 `INVALID`)을 추가해 `/[가-힣]/.test(title)`로 필터 후 `total`·`pages` 계산. 테스트 1개 추가(총 38개).
- 화면: `postLang()`(영어면 'en', 아니면 'ko')를 게시판 목록, 게시글 상세의 "다른 게시물", 인트로 카드 9개 요청에 붙였다. 인트로 카드의 화면 쪽 필터·페이지 반복은 서버 필터로 대체. "다른 게시물" 60초 캐시에 언어를 넣어 언어를 바꾸면 다시 받는다. 게시글 상세(`getPost`)는 거르지 않아 링크로 직접 들어가면 다른 언어 글도 열린다.
- 배포: `clasp show-authorized-user` = `415hyunwoo@gmail.com` → `clasp push --force` → 버전 **21** → `redeploy -V 21`. 운영 `/exec` 읽기 확인: `lang:'ko'` total 9, `lang:'en'` total 1, 필터 없음 10. 그 뒤 프런트엔드 `app.js?v=114-board-language` 배포(커밋 `64b7830`, Pages 실행 `36783770903`). 공개 사이트 한국어 게시판 카드 9개(모두 한글 제목), 영어 게시판 1개, 영어 홈 1개 확인(읽기 전용). README에 서버 배포 기록 추가.

## 2026-10-01 인트로 카드: 제목 언어별 필터, 분류 "자유 게시판" → "문화 유산"

- 사용자 요청에 따라 홈 "기록으로 남기는 문화유산" 카드(`homeLog()`)를 언어별로 거른다: 한국어 홈은 제목에 한글(`/[가-힣]/`)이 있는 글, 영어 홈은 한글이 없는 글만 최신순 9개. 한 페이지(15개)에서 모자라면 다음 페이지를 이어 조회한다. 2026-10-01 기준 영어 제목 글은 1개("At the End of the Incheon…")뿐이라 영어 홈에는 카드 1개가 나온다.
- 글 분류 `free`의 이름을 `자유 게시판` → `문화 유산`(영어 `Cultural heritage`)으로 바꿨다(`labels` 두 곳, `i18n.js`). 글쓰기 분류 목록·카드 태그·상세 모두 이 이름표를 쓴다. 서버 값(`free`)과 기존 글 데이터는 그대로.
- 버전 `app.js?v=113-home-log-language`, `i18n.js?v=46-heritage-category`. 테스트 37개·JS 문법 통과. 공개 사이트 한국어 홈 카드 9개 모두 한글 제목, 영어 홈 카드 1개(영어 제목) 확인(읽기 전용). 커밋 `420c7ab`, Pages 실행 `36781677928` 성공. 글쓰기 창은 로그인 필요라 화면 확인 못 함.

## 2026-10-01 탐방 영상 3개·월미도 포스터 새 파일로 교체

- 사용자 요청에 따라 `img/01Incheon.mp4`·`02Wolmido.mp4`·`03Incheon.mp4`(HEVC 1080p, 02는 60fps)와 `02Wolmido.jpg`를 반영했다. 이 컴퓨터에 ffmpeg가 없어 `pip install --user imageio-ffmpeg`(ffmpeg 7.1 포함)로 설치해 사용했다: `python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`.
  - 영상: 기존과 같은 설정(`scale=-2:720,fps=30`, libx264 CRF 26 medium, yuv420p, AAC 96k, `+faststart`) → `dist/assets/incheon01~03-video.mp4` 3.4MB·6.3MB·10.4MB, 길이 원본과 같음(62/75/71초). 30초 프레임 확인.
  - 포스터: `02Wolmido.jpg`가 1080×608(16:9)이라 확대하지 않고 그대로 품질 85로 `incheon02-video-poster.jpg`(146KB) 저장. 01·03 포스터는 그대로(1280×720).
- 버전: `guideVideo()`의 영상·포스터 `?v=3`→`?v=4`, `app.js?v=112-video-refresh`. 홈 카드와 `#guide`가 같은 파일을 쓴다. 테스트 37개·JS 문법 통과. 커밋 `0c15d1b`, Pages 실행 `36734848036` 성공. 공개 URL의 영상 3개·포스터가 로컬 파일과 바이트 단위로 같음 확인.
- 9/30 미확인 건 후속: 읽기 전용 `listPlaceLikes`가 정상 응답(`ok:true`, BUSY 해소). 현재 `memory` 2, `wolmi` 3 — 실제 방문자 좋아요가 섞여 있어 9/30 테스트 좋아요가 남았는지는 구분할 수 없다(방문자 ID가 해시라 식별 불가). 필요하면 관리자가 시트 `Likes`에서 `postId=place:wolmi`, 9/30 시각의 `anon:` 행을 확인한다.

## 2026-09-30 푸터 학교 카드 문구 변경

- 사용자 요청에 따라 푸터 연락처의 학교 카드(`index.html` `.contact-card` 첫 번째) 문구를 `채드윅송도국제학교 청소년 국가유산지킴이` → `채드윅 송도국제학교`, 영어 `Youth Heritage Guardians at Chadwick International` → `Chadwick International School`로 바꿨다(`data-i18n="채드윅 송도국제학교"`, `i18n.js`에 번역 추가). 같은 원래 문구를 쓰는 CIC 소개 부제목, 메타 설명, 개인정보처리방침·이용약관 머리글은 그대로.
- 버전 `i18n.js?v=45-footer-school`. 테스트 37개·JS 문법 통과. 로컬·공개 한·영 390px에서 학교 카드 문구 확인, CIC 소개 부제목 변화 없음 확인(읽기 전용). 커밋 `f6dc9be`, Pages 실행 `36707712961` 성공.

## 2026-09-30 인트로 이야기 `more` 버튼을 인천문화유산 장소로 연결

- 사용자 요청에 따라 `guideCardStories`의 `moreUrl`을 게시글에서 인천문화유산 페이지 장소로 바꿨다: 01 `#guide/memory`(인천상륙작전기념관 & 자유공원), 02 `#guide/wolmi`(월미도 & 월미공원), 03 `#guide/openport`(인천 개항장 거리). 02의 영어 전용 `en.moreUrl`(영어 게시글)은 지워 한·영 모두 같은 장소로 간다(해시만 써서 언어 유지). 라우터가 `#place-<id>`로 스크롤하며 `.place-section{scroll-margin-top}` 덕분에 제목이 헤더에 가리지 않는다.
- 버전 `app.js?v=111-story-more-guide`(바로 전 되돌린 `v=110`과 겹치지 않게 111). 테스트 37개·JS 문법 통과. 로컬(한국어 390, 영어 1280)·공개(한국어 390)에서 세 버튼 클릭 → 해당 장소 제목이 헤더 아래 보임 확인(읽기 전용 확인). 커밋 `23de4a0`, Pages 실행 `36706818740` 성공.

## 2026-09-30 인트로 영상 카드 순서 변경(월미도→개항장→인천상륙작전) 후 되돌림

- 사용자 요청으로 `guideCards()` 순서를 02→03→01로 바꿔 배포(`033cde8`)했다가, 사용자 요청("중단하고 이전으로 복구")으로 `git revert`했다(`f994a9b`, Pages 실행 `36705994277` 성공). 현재 순서는 원래대로 01 인천상륙작전 → 02 월미도 → 03 개항장, `app.js?v=109-home-headings`(공개 파일 확인).
- **미확인 사항:** 순서 확인 뒤 좋아요 확인 스크립트(`likes.mjs`)를 공개 사이트에 실행해 월미도 영상에 테스트 좋아요가 1회 눌렸다. 스크립트는 끝에서 다시 눌러 취소하도록 되어 있지만, 직후 서버가 `listPlaceLikes`·요청마다 `BUSY`(스크립트 잠금 10초 대기 실패)를 연속 반환해 취소 여부와 서버 상태를 확인하지 못했다(사용자가 확인을 중단시킴). 남은 헤드리스 Edge 프로세스는 없었다. **다음 세션에서 `listPlaceLikes`로 `wolmi` 좋아요 수(원래 0)와 서버 응답 정상 여부를 먼저 확인할 것.** 앞으로 공개 서버에 쓰기(좋아요 등)를 하는 확인은 사용자 동의 없이 하지 않는다.

## 2026-09-30 휴대폰 전체 좌우 여백 30% 축소

- 사용자 요청에 따라 720px 이하에서만 페이지 좌우 여백을 30% 줄였다(`styles.css` 끝): 헤더 20→14px, 본문 영역(`.hero-copy`, `.wrap`, `.page-title`, `.reading`, `.board-shell`, `.contact-section`, `.site-footer`) 6%(390px 기준 23~24px) → 4.2%(16px), 게시글 상세(`.post-detail-shell`) 12→8px. 모든 페이지(인트로·CIC 소개·인천문화유산·지킴이 로그·게시글 상세) 공통. 카드 안쪽 여백은 그대로. 노트북 변화 없음.
- 버전 `styles.css?v=114-mobile-gutters`. 테스트 37개 통과. 로컬(홈·CIC 소개·인천문화유산 390px), 공개(홈·게시판·게시글 390px)에서 여백 측정, 영어 320/360px 가로 넘침 없음 확인. 커밋 `c224ae0`, Pages 실행 `36704416623` 성공.

## 2026-09-30 인트로 제목: 이야기 위 "인천문화유산", 카드 9개 위 "지킴이 로그 / 기록으로 남기는 문화유산"

- 사용자 요청에 따라 홈 이야기 섹션 작은 제목(eyebrow)을 `지킴이 로그` → `인천문화유산`(영어 INCHEON HERITAGE)으로 바꿨다. CIC 소개 페이지의 같은 "지킴이 로그 / 우리가 문화유산에 ‘푹’ 빠진 이유"(소감 인용 영역)는 그대로 — `home()` 안에서만 치환했다.
- 회색선 아래 카드 9개 위에 `section-heading`(eyebrow `지킴이 로그`, h2 `기록으로 남기는 문화유산`; 영어 GUARDIAN LOG / Heritage, recorded for tomorrow)을 넣었다. 구조: `.home-log`(회색선) > 제목 + `#home-log`(카드). 글이 없으면 `.home-log` 전체를 지운다.
- 버전 `app.js?v=109-home-headings`. 테스트 37개·JS 문법 통과. 로컬 한·영, 공개 한국어 1280/390px에서 두 제목, 회색선 1px, 카드 9개 확인, CIC 소개 제목 변화 없음 확인. 커밋 `4b2c595`, Pages 실행 `36703158107` 성공.

## 2026-09-30 인트로 이야기 아래 회색선 + 최신 지킴이 로그 카드 9개

- 사용자 요청에 따라 "우리가 문화유산에 ‘푹’ 빠진 이유" 이야기(마지막 03 `more` 버튼) 아래에 가는 회색선(`.home-log{margin-top:28px;padding-top:36px;border-top:1px solid var(--line)}`)과 지킴이 로그 게시판과 같은 카드 9개를 넣었다(최신 순 `listPosts {page:1, sort:'newest', view:'titles'}` 앞 9개 → `listPosts {ids}`로 사진·분류·요약·좋아요·댓글·공유·⋮ 채움). 불러오는 동안 주황 로딩바 + 카드 틀 9개(`boardSkeleton(9)`), 실패 시 "다시 시도", 글이 없으면 영역 제거.
- 리팩터링: 게시판 카드 마크업·채우기를 `postCardGrid(posts)`·`hydratePostCards(target,posts,stamp)`로 분리해 `board()`와 새 `homeLog(stamp)`가 함께 쓴다(게시판 동작 동일). `boardSkeleton(count=6)`.
- 참고: 게시판 첫 페이지는 기본 정렬(공지 먼저)이고 인트로는 사용자 요청대로 올린 순서(`newest`). 현재 공지가 없어 두 순서가 같다.
- 버전 `app.js?v=108-home-log`, `styles.css?v=113-home-log`. 테스트 37개·JS 문법 통과. 공개 사이트 1280px(3열)·390px 영어(1열)에서 회색선, 카드 9개(최신 순, 모두 버튼 줄 포함), 가로 넘침 없음, 게시판 카드 10개 정상 확인. 커밋 `0b641e7`, Pages 실행 `36701868408` 성공.

## 2026-09-30 인트로 "Our Practice / 현장에서 실천하는 가치" 섹션 삭제

- 사용자 요청에 따라 `home()`에서 "Our Practice" 섹션 전체(제목, 활동 카드 3개: 탑골공원에서 이어가는 나눔·국가유산 복구를 위한 모금·기록으로 알리는 문화유산, 사진 plogging/fundraising/flashmob, 설명 문구)를 지웠다. 홈 순서: 첫 화면 → 영상 카드 3개 → "우리가 문화유산에 ‘푹’ 빠진 이유" → 푸터.
- CIC 소개 페이지의 "함께 쌓아온 활동"(`C.achievements` 전체, 같은 사진)은 그대로다. `.grid-3 .activity .activity-photo` CSS는 미사용으로 남음.
- 버전 `app.js?v=107-no-practice`. 테스트 37개·JS 문법 통과. 로컬(한국어 390, 영어 1280)·공개(한국어 390)에서 섹션 순서·가로 넘침 없음, CIC 소개 활동 사진 유지 확인. 커밋 `96b0181`, Pages 실행 `36701064673` 성공.

## 2026-09-30 CIC 소개·인천문화유산도 휴대폰 꽉 찬 사진/영상 되돌림(완전 복구)

- 사용자 요청에 따라 남아 있던 720px 이하 100vw 규칙과 `html,body{overflow-x:clip}`를 모두 지웠다. 이제 `dist/styles.css`는 꽉 찬 사진 작업 전(`e22b528`)과 **바이트 단위로 같다**(버전 표기만 `styles.css?v=112-media-margins-restore`).
- 발견·수정: 바로 앞 "인트로만 되돌림"(`381b9a2`) 때 문자열 치환 범위 계산 실수로 파일 끝에 짝 없는 `}`가 하나 남아 있었다(파일 끝이라 화면 영향 없음). 이번에 함께 지웠다.
- 테스트 37개 통과. 공개 사이트 390px에서 홈 24/23px, CIC 소개 23px, 인천문화유산 23px(작업 전과 동일), 영어 홈 360px 가로 넘침 없음 확인. 커밋 `ae71b70`, Pages 실행 `36700495342` 성공.

## 2026-09-30 인트로만 휴대폰 꽉 찬 사진/영상 되돌림

- 사용자 요청("인트로 페이지는 이전으로 복구")에 따라 바로 아래 작업 중 홈 부분만 되돌렸다: `.discover-card`·`.grid-3 .activity .activity-photo`·`.story-card .guide-card-image`의 100vw 규칙과 영상 카드 테두리 제거·6vw 들여쓰기 규칙 삭제. CIC 소개·인천문화유산의 휴대폰 꽉 찬 사진/영상과 `overflow-x:clip`은 유지.
- 버전 `styles.css?v=111-intro-restore`. 테스트 37개 통과. 로컬·공개 390px에서 홈 영상 카드 24/24px·사진 23/23px(이전과 동일, 카드 테두리 복원), CIC 소개·인천문화유산 0/0px 확인. 커밋 `381b9a2`, Pages 실행 `36700164083` 성공.

## 2026-09-30 휴대폰: 인트로·CIC 소개·인천문화유산 사진/영상 좌우 여백 없이

- 사용자 요청에 따라 720px 이하에서만 다음 요소를 화면 끝까지 꽉 차게(`width:100vw; margin-left/right:calc(50% - 50vw); border-radius:0`) 했다(`styles.css` 끝 미디어 쿼리):
  - 홈: 영상 카드 전체(`.discover-card`, 좌우 테두리·그림자 제거, 카드 안 제목·출처 줄은 본문과 같은 6vw 들여쓰기), 활동 사진(`.grid-3 .activity .activity-photo`), 이야기 사진(`.story-card .guide-card-image`).
  - CIC 소개: 활동 사진(`.activity-grid .activity-photo`), 가치 사진 묶음(`.value-photo-gallery`).
  - 인천문화유산: 장소 사진(`.guide-place-image`), 영상(`.guide-tip-video`), 개항장 지도(`.place-section .guide-map`).
  - 지킴이 로그(게시판 카드·게시글 상세)는 제외 — 그대로 24px/13px 여백.
- 가로 넘침 안전장치로 720px 이하 `html,body{overflow-x:clip}`(sticky에 영향 없음).
- 버전 `styles.css?v=110-mobile-full-bleed`. 테스트 37개 통과. 로컬·공개 390px(한국어), 로컬 360px(영어)에서 위 요소 좌우 여백 0/0, `scrollWidth`=화면 폭, 공개 게시판·게시글 상세 여백 변화 없음, 1280px 변화 없음 확인. 커밋 `8e65507`, Pages 실행 `36699262093` 성공.

## 2026-09-30 인트로 이야기 `more` 버튼을 작은 회색 버튼으로

- 사용자 요청("회색으로, 여백 줄이기, 너무 큼")에 따라 이야기 3개의 `more` 버튼(`.button.secondary.small.story-more`)을 바꿨다. 원인: 기존 `.story-more{padding:5px 8px;font-size:.4375rem}`가 `.button.small`(선택자 우선순위 높음)에 져서 실제로는 10px 16px·14px·네이비로 보였다. `styles.css` 끝에 `.guide-card-story .story-more{padding:4px 12px;border:1px solid #c9d1d8;border-radius:6px;background:#fff;color:#5f6368;font-size:.8rem;line-height:1.4;margin:0 0 12px}`, hover `#f1f3f4`/`#202124`.
- 크기 70×43 → 59×28px. 버튼 아래 12px를 둬 휴대폰에서 다음 이야기 구분선과 붙지 않게 했다. 버전 `styles.css?v=108-story-more-small`. 테스트 37개 통과. 공개 사이트 390px(한국어)·1280px(영어)에서 세 버튼 크기·색 확인. 커밋 `e22b528`, Pages 실행 `36697443500` 성공.

## 2026-09-30 인트로: 버튼 "인천문화유산 맵", 영상 3개를 게시판식 카드 틀로

- 사용자 요청에 따라 첫 화면 주황 버튼 문구를 `인천 문화유산 가이드` → `인천문화유산 맵`(영어 `Incheon Heritage Map`, `i18n.js`에 추가)으로 바꿨다. 링크(`assets/incheonmap.jpg`)와 문서 제목의 "인천 문화유산 가이드"는 그대로.
- 영상 카드 3개를 지킴이 로그 게시판 카드와 같은 틀로 감쌌다(`styles.css` 끝): `.discover-card{border:1px solid #d7dde2;border-radius:8px;background:#fff;box-shadow:0 1px 2px #142c4210;overflow:hidden}`, 영상은 카드 위쪽에 꽉 차게(모서리 0), 제목 `margin:14px 17px 4px`, 아래 줄 `padding:0 8px 8px 17px`. 제목 줄 제한 2→3줄(영어 제목이 휴대폰에서 잘려서), 휴대폰 카드 간격 8→16px(`.grid-3:has(>.discover-card)`). 카드가 `overflow:hidden`이라 ⋮ 메뉴는 위로 열린다(`moreMenu(...,true)`).
- 버전 `app.js?v=106-intro-video-cards`, `styles.css?v=107-intro-video-cards`, `i18n.js?v=44-heritage-map`. 테스트 37개·JS 문법 통과. 로컬(한국어 1280, 영어 320/390/1280)·공개(한국어 390, 영어 1280)에서 버튼 문구, 카드 테두리·모서리, 제목 잘림 없음, ⋮ 메뉴가 카드 안에 보임, 가로 넘침 없음 확인. 커밋 `5895272`, Pages 실행 `36696964523` 성공.

## 2026-09-30 인트로: Explore 제목·"활동 살펴보기" 삭제, 이야기는 more 버튼만 링크

- 사용자 요청에 따라 `home()`에서:
  - 영상 카드 위 섹션 제목 "Explore Incheon / 발걸음으로 만나는 인천의 역사"(`.section-heading`)를 지웠다. 영상 카드 그리드(`.grid-3` + `guideCards()`)는 그대로 첫 화면 바로 아래.
  - "현장에서 실천하는 가치" 오른쪽 `활동 살펴보기 ↗`(`#values`) 링크를 지웠다.
  - "우리가 문화유산에 ‘푹’ 빠진 이유" 이야기 카드 전체 클릭 이동을 없앴다: `storyLink()`·`data-href`·전역 클릭 리스너·`.story-card[data-href]` CSS(손가락 커서, 사진 hover 흐림, 제목 커서) 제거. 이제 세 이야기 모두 `more` 버튼만 해당 게시글로 간다(주소 01 `4ac9ae38`, 02 `0654570e`/영어 `c5bc18c3`, 03 `2bdd3dad`).
- `i18n.js`의 관련 번역 문구는 남겨 두었다(미사용). 버전 `app.js?v=105-intro-cleanup`, `styles.css?v=105-intro-cleanup`. 테스트 37개·JS 문법 통과. 로컬(한국어 1280px, 영어 390px)과 공개(한국어 390px)에서 섹션 순서(첫 화면 → 영상 카드(제목 없음) → 현장에서 실천하는 가치 → 이야기 → 푸터), "활동 살펴보기" 없음, 사진·본문·주소 클릭 시 이동 없음, `more` 클릭 시 이동, 가로 넘침 없음을 확인. 커밋 `48c22b3`, Pages 실행 `36696069029` 성공.

## 2026-09-30 휴대폰: 영상 탭하면 정지, 인천문화유산 영상도 가벼운 재생 버튼

- 사용자 요청에 따라 휴대폰(`(hover:none),(pointer:coarse)`)에서 홈·`#guide` 영상 모두 같은 방식으로 동작한다: 가운데 재생 버튼(50px, `rgba(0,0,0,.2)`, 브라우저 기본 가운데 버튼 숨김)을 누르면 재생 → 재생 중 영상 화면을 탭하면 정지하고 재생 버튼이 다시 보인다. 아래 조작 막대(영상 하단 56px) 탭은 정지하지 않는다. 기존 `.discover-card` 한정 휴대폰 CSS를 모든 `.video-frame`으로 넓혔다. 노트북은 변경 없음(72px 버튼, 브라우저 기본 클릭 동작).
- **구현 주의:** 휴대폰 기본 컨트롤이 탭을 가져가 `click` 이벤트가 오지 않는다(headless 터치 에뮬레이션에서 pointerdown/up·touchstart/end만 발생 확인). 그래서 `pointerdown`/`pointerup`(캡처, `pointerType!=='mouse'`)으로 500ms·12px 이내 짧은 탭을 감지해 `video.pause()` 한다.
- 버전 `app.js?v=104-touch-video-pause`, `styles.css?v=104-touch-video-pause`. 테스트 37개·JS 문법 통과. 로컬(한국어 홈, 영어 guide)·공개(한국어 홈·guide) 390px 터치 에뮬레이션에서 재생 → 탭 정지(버튼 복귀) → 재생 → 조작 막대 탭 시 계속 재생을 확인, 1280px 버튼 72px 유지. 커밋 `1f30ee5`, Pages 실행 `36694746938` 성공. 실제 기기(iOS Safari·삼성 인터넷) 미확인.

## 2026-09-30 인트로: 제목 링크 삭제, 이야기 구분선을 가는 회색으로

- 사용자 요청에 따라:
  - 영상 카드 제목(`.discover-card h3`)의 `#guide/<id>` 링크를 없애 일반 글자로 했다.
  - "우리가 문화유산에 ‘푹’ 빠진 이유" 이야기 제목(`h4`)은 눌러도 이동하지 않는다(카드 클릭 리스너가 `h4`를 제외, 제목 hover 주황·밑줄 제거, `cursor:text`). 사진·주소·본문을 누르면 이동하는 카드 동작과 `more` 버튼은 그대로.
  - 이야기 윗줄: 네이비 2px → 회색 1px(`var(--line)`). 휴대폰(720px 이하, 1열)에서는 첫 이야기 위 선을 없앴다(2·3번째 위만 가는 회색 선). 노트북(3열)은 세 칸 모두 가는 회색 선(첫 칸만 빼면 줄이 어긋나서).
- 버전 `app.js?v=102-intro-title-plain`, `styles.css?v=103-intro-title-plain`. 테스트 37개·JS 문법 통과. 로컬 390·1280px, 공개 390px에서 제목 링크 0, 선 두께·색, 제목 클릭 시 이동 없음·본문 클릭 시 이동을 실제 클릭으로 확인. 커밋 `a832566`, Pages 실행 `36691829350` 성공.

## 2026-09-30 사이트 사진 최적화(용량 49.9MB → 6.8MB)

- 사용자 요청("홈페이지 이미지 로딩이 매우 느림")에 따라 `dist/assets`의 사이트가 쓰는 JPEG 25개를 다시 저장했다(Pillow 12.3, `pip install --user pillow`로 로컬 설치): EXIF 회전 반영, 긴 변 최대 **1600px**(원본이 더 작으면 유지), 품질 80, progressive, 메타데이터 제거. 예외: `incheonmap.jpg`(확대해서 보는 지도) 크기 유지·품질 84, `cic-logo.jpeg` 1500→400px·품질 88. 새 파일이 원본보다 크면 원본 유지(해당 없음).
  - 예: `Compassion01.jpeg` 11.9MB(8160px) → 318KB, `plogging.jpg` 3.3MB → 417KB, `incheon01~03.jpg` 각 2.8~3.2MB → 270~310KB, 영상 포스터 3장 소폭 감소.
  - 사이트가 참조하지 않는 `Compassion03.jpg`(`.jpeg`가 사용 중)·`incheon-port.jpg`는 건드리지 않았다(삭제 여부 미결). 아이콘 PNG도 그대로. 원본은 `img/`와 Git 기록에 있다.
- 파일명과 주소(`?v=`)는 바꾸지 않았다(GitHub Pages 캐시 10분, 서비스 워커는 네트워크 우선이라 새 파일이 곧 반영됨).
- 검증: 100% 확대 크롭으로 선명도 확인, 테스트 37개 통과, 공개 URL 파일 크기(예: plogging 427KB) 확인. 공개 홈(390px, 캐시 끔, 끝까지 스크롤) 이미지 전송량 합계 **약 2.4MB / 10개**(이전 추정 약 16MB). 커밋 `711ad95`, Pages 실행 `36690683312` 성공.
- 앞으로 새 사진을 넣을 때도 긴 변 1600px·품질 80 정도로 줄여 넣는다(위 스크립트 방식). 영상(`incheon0N-video.mp4`, 3~15MB)은 `preload="none"`이라 누르기 전에는 받지 않는다.

## 2026-09-30 인트로 영상 카드: 아이콘 30% 축소, 로고·이름 붙임, 휴대폰 재생 버튼

- 사용자 요청에 따라 홈 영상 카드(`.discover-card`만, 게시판 카드는 그대로)를 조정했다(`styles.css` 끝):
  - 하트·공유·⋮ 아이콘 24→17px(30%↓), 버튼 44→36px, 좋아요 숫자 .8rem.
  - 로고와 "청소년 국가유산지킴이 …" 사이 간격 8→0px.
  - 휴대폰(`@media(hover:none),(pointer:coarse)`): 브라우저 기본 가운데 재생 버튼(`::-webkit-media-controls-overlay-play-button`, iOS `…start-playback-button`)을 숨기고 자체 `.video-play`를 표시 — 72→50px(30%↓), 배경 `rgba(0,0,0,.45)`→`.2`(더 투명), 삼각형도 비례 축소. 누르면 재생되고 재생 중엔 숨김(기존 로직). 노트북은 기존 72px 그대로. `#guide` 영상은 변경 없음.
- 버전 `styles.css?v=102-intro-video-compact`. 테스트 37개 통과. 로컬·공개 사이트에서 390px 터치 에뮬레이션(아이콘 17px, 버튼 36px, 간격 0, 재생 버튼 50px·alpha .2)과 1280px(재생 버튼 72px 유지), 가로 넘침 없음 확인. 커밋 `f2ad235`, Pages 실행 `36689766776` 성공. **실제 휴대폰(특히 iOS Safari·삼성 인터넷)에서 기본 재생 버튼이 숨겨지는지는 미확인.**

## 2026-09-30 인천문화유산 첫 장소 위 여백 절반으로

- 사용자 요청에 따라 `#guide` 페이지 제목 영역 아래 → 첫 장소 "기억과 평화" 사이 여백을 반으로 줄였다: 1280px 108→54px, 390px 72→36px. 장소 목록 래퍼에 `guide-places` 클래스를 붙이고 `styles.css` 끝에 `.guide-places{padding-top:10px}`, 720px 이하 `4px`(기존 `.wrap` 64/40px)를 추가했다. 장소 사이 간격(`.place-section` 위아래 44/32px)은 그대로.
- 버전 `app.js?v=101-guide-top-space`, `styles.css?v=101-guide-top-space`. 테스트 37개·JS 문법 통과. 로컬 한국어 1280/390px·영어 900px, 공개 사이트 1280/390px에서 간격 측정 확인. 커밋 `92a9fcb`, Pages 실행 `36689293933` 성공.

## 2026-09-30 인천문화유산 장소 번호(01~03) 삭제

- 사용자 요청에 따라 `#guide` 각 장소 왼쪽 칸의 큰 번호(`.place-number`)를 지웠다. 이제 분류(기억과 평화 등) → 장소 제목 순서이고, 번호 아래 띄우던 분류의 `margin-top:20px` 인라인 스타일도 뺐다(넓은 화면에서 분류 윗선이 오른쪽 사진 윗선과 맞음). `p.number`는 영상·사진 파일명과 인트로 카드에 계속 쓰인다. `.place-number` CSS는 남아 있다(미사용).
- 버전 `app.js?v=100-guide-no-number`. 테스트 37개·JS 문법 통과. 로컬 한국어 1280px·영어 390px, 공개 사이트 한국어 390px에서 세 장소 모두 번호 없음 확인. 커밋 `5a97a24`, Pages 실행 `36688820892` 성공.

## 2026-09-30 인트로 상단 여백 축소(헤더↔첫 화면, 첫 화면↔Explore Incheon)

- 사용자 요청에 따라 한·영 홈의 두 간격을 줄였다(`styles.css` 끝에 추가): `.hero-copy{padding-top:32px;padding-bottom:20px}`, `.hero+.wrap{padding-top:32px}`, 720px 이하 `.hero-copy{padding-top:20px;padding-bottom:12px}`, `.hero+.wrap{padding-top:24px}`.
  - 헤더 아래 → "CIC · Chadwick International Culture protector": 1280px 64→32px, 390px 38→20px.
  - 버튼 줄(부제목 아래) → "Explore Incheon": 1280px 109→52px, 390px 78→36px. 부제목↔버튼 간격(28px)은 그대로.
- 함께 수정: 영어 영상 카드 출처 줄이 좁은 카드에서 "Youth Heritage Guardian Jun…"처럼 잘리던 것을 줄바꿈으로 바꿨다(`.discover-source` nowrap/ellipsis 제거, `overflow-wrap:anywhere`, 줄 높이 1.35). 한국어는 한 줄 그대로.
- 버전 `styles.css?v=100-hero-spacing`. 테스트 37개 통과. 로컬 한·영 1280/900/390px 측정, 영어 320/360/390px 가로 넘침 없음, 공개 사이트 한국어 1280px·영어 390px 간격과 영어 360px 넘침 없음 재확인. 커밋 `e3cfefa`, Pages 실행 `36688193662` 성공.

## 2026-09-30 영어 홈 첫 화면 제목·부제목도 노트북·데스크톱에서 한 줄

- 사용자 요청에 따라 "The history we protect, the future we share"와 "We are Korea’s National Heritage Guardians, documenting…eyes."를 폭 1001px 이상에서 각각 한 줄로 표시한다. 한국어 전용이던 규칙(`html:not([lang="en"])`)을 모든 언어로 넓혔다: `@media(min-width:1001px){.hero-copy{max-width:none}.hero-copy p,.hero-copy h1{white-space:nowrap}.hero-copy h1 br{display:none}}`. 영어 부제목은 길어서 1001~1100px에서 오른쪽 여백을 넘었으므로 같은 미디어 쿼리에 `html[lang="en"] .hero-copy p{font-size:min(1.05rem,1.5vw)}`(1120px 이상은 기존 16.8px)를 추가했다. 1000px 이하·휴대폰은 기존처럼 여러 줄.
- 버전 `styles.css?v=98-en-hero-one-line`. 테스트 37개 통과. 로컬 영어 1001/1024/1100/1280/1920px 모두 두 문구 1줄·내용 영역 안·가로 넘침 없음, 한국어 1001/1280px 변화 없음, 영어 390·1000px 여러 줄 유지 확인. 공개 사이트 영어 1024·1280px 재확인. 커밋 `de142ce`, Pages 실행 `36663912539` 성공.

## 2026-09-30 글쓰기 창에서 `요약 (선택)` 입력칸 삭제

- 사용자 요청에 따라 게시글 작성·수정 창(`editor()`)의 `요약 (선택)` 텍스트 영역(`#post-summary`)을 지웠다. 이제 폼에 `summary`가 없어 서버 `optionalText_(undefined)`가 빈 값으로 저장하고, 카드에는 서버가 본문 앞부분(`legacySummary_`)을 요약으로 보여준다. **기존 글을 수정하면 저장돼 있던 요약이 지워지고 본문 앞부분으로 바뀐다**(수정하지 않은 글의 기존 요약은 그대로 표시). 서버 코드는 변경 없음.
- 버전 `app.js?v=99-no-summary-field`. 테스트 37개·JS 문법 통과. 커밋 `3490a38`, Pages 실행 `36663044321` 성공, 공개 `index.html`이 새 버전을 참조하고 공개 `app.js`에 `post-summary` 0건. 글쓰기 창은 로그인해야 열려 화면 캡처는 하지 못했다.

## 2026-09-30 버그 수정: 휴대폰 영어 인트로에서 헤더·푸터가 화면 폭을 다 채우지 못함

- **증상(사용자 보고, `reference/오류화면.jpg`):** 휴대폰에서 영어 홈을 보면 헤더·푸터(네이비)가 화면 오른쪽 약 13%를 비우고, 언어 버튼·글쓰기 버튼이 그 밖으로 삐져나옴.
- **원인:** 영어 홈 영상 카드(`.discover-card`, `grid-3` 1열)의 출처 줄 "Youth Heritage Guardian Junhyuk Lee"가 `white-space:nowrap`이라, 그리드 항목의 자동 최소 폭(min-content)이 카드를 약 431px로 넓혔다. 문서 폭이 441px가 되어 휴대폰(360~384px)에서 페이지가 가로로 넓어졌다. 한국어도 360px에서 `.discover-actions{margin-right:-10px}` 때문에 4px 넘쳤다.
- **수정:** `.discover-card{min-width:0}`, `.discover-meta{min-width:0}`(긴 이름은 말줄임), `.discover-actions`의 음수 오른쪽 여백 제거. 버전 `styles.css?v=97-mobile-overflow`.
- **검증:** 로컬 한·영 홈 320/360/384/412px, CIC 소개·인천문화유산 360px, 공개 사이트 한·영 홈·게시판·게시글 상세 384px와 영어 홈 360px 모두 `scrollWidth`=화면 폭, 넘치는 요소 0개. 테스트 37개 통과. 커밋 `4349962`, Pages 실행 `36657354134` 성공. 실제 휴대폰 재확인은 사용자 몫.
- **앞으로:** 화면 확인 시 한국어뿐 아니라 영어도 360px 이하에서 `scrollWidth`를 확인한다(영문은 길어서 넘치기 쉽다). 참고: 이 셸(Git Bash)에는 `pkill`이 없어 로컬 `http.server`가 여러 개 남아 있었다 — PowerShell `Stop-Process`로 정리했다.

## 2026-09-30 지킴이 로그 카드·상세에 공유와 ⋮ 메뉴

- 사용자 요청에 따라 게시판 목록 카드의 아래 버튼 줄 오른쪽(`.post-card-tools`: 공유 `data-action="share"` + ⋮)과 게시글 상세 하단 버튼 줄 오른쪽(기존 공유 옆 ⋮)에 버튼을 넣었다. ⋮ 메뉴는 인트로 영상 카드와 같은 `moreMenu()`(신고하기·의견 보내기 → `mailto:e3kim2027@chadwickschool.org`, 제목 `[CIC] 게시글 신고: <글 제목>`/`[CIC] 의견 보내기: <글 제목>`, 본문 게시글 주소)로 공통화했다(`menuMail()`, `postMoreMenu(p)`; 인트로용 `placeMail()` 제거). 로그인 불필요. 서버 신고 기능(`reportDialog`)은 여전히 버튼 없이 남아 있다.
- 카드·상세 모두 `overflow:hidden`이라 메뉴는 버튼 위로 연다(`.discover-more.menu-up`). 버전 `app.js?v=98-post-share-menu`, `styles.css?v=96-post-share-menu`. 테스트 37개·JS 문법 통과. 공개 사이트 1280px(한국어)·390px(영어)에서 카드 8개 모두 공유·⋮, 메뉴가 카드/상세 안에 온전히 보임, 메일 제목, 상세 줄 순서(좋아요·댓글·공유·⋮)를 실제 클릭으로 확인. 커밋 `22f071a`, Pages 실행 `36654114469` 성공.

## 2026-09-30 게시글 상세 로딩도 주황색 로딩바 + 틀로

- 사용자 요청에 따라 게시글 상세(`post()`)를 불러오는 동안 "게시글을 불러오고 있습니다…" 글자 대신 게시판 목록과 같은 주황색 움직이는 로딩바(`.loading-bar`)와 게시글 모양 틀(`postSkeleton(title)`: 원형 프로필·작성자 줄, 제목 줄, 본문 3줄)을 보여준다. 인트로 more 버튼·이야기 카드 클릭, 게시판 카드, 다른 게시물 등 게시글 상세로 가는 모든 경로에 적용된다. 제목만 먼저 받으면 틀 안에 제목을 채우고 로딩바는 본문이 올 때까지 유지, 오류 시 로딩바를 지우고 "다시 시도"를 보여준다. 화면 읽기용 문구는 `visually-hidden`.
- 버전 `app.js?v=97-post-loading-bar`, `styles.css?v=95-post-loading-bar`. 테스트 37개·JS 문법 통과. 커밋 `46f3c5d`(+`4998f88` 프로필 원형), Pages 실행 `36653269435` 성공. 공개 사이트 390·1280px에서 인트로 01 more 클릭 → 로딩바+틀(0.1~0.3초) → 제목 채움(3.3~4.4초) → 본문 표시(8~8.8초) 순서를 확인했다.
- **속도 참고:** 캐시가 없을 때 제목 전용 `getPost(view:'title')` 뒤에 전체 `getPost`를 차례로 부르므로 총 8초 안팎이 걸린다. 틀이 있으니 제목 선요청을 건너뛰고 바로 전체를 부르면 약 3초 줄일 수 있다(미적용, 사용자 제안 예정).

## 2026-09-30 인트로 영상 카드 하트 옆 좋아요 숫자(서버 저장, Apps Script 버전 20)

- 사용자 요청에 따라 홈 영상 카드 하트 옆에 좋아요 수를 표시한다. 모든 방문자가 같은 수를 보도록 브라우저 저장(`cic.placeLikes.v1`)을 없애고 서버에 저장한다.
- 서버(`apps-script/Code.gs`): `PLACE_IDS_=['memory','wolmi','openport']`, 공개 액션 `listPlaceLikes`(장소별 `likeCount`·`likedByMe`)와 `togglePlaceLike {placeId}`. 게시글 좋아요와 같은 방식(로그인 없이 `visitorId` 해시 `anon:…` 또는 회원 id, `rate_` 제한)이며 `Likes` 시트에 `postId:'place:<id>'`로 저장한다. 알 수 없는 장소·방문자 ID 없음은 `INVALID`. 테스트 1개 추가(총 37개).
- 배포: `clasp show-authorized-user` = `415hyunwoo@gmail.com` 확인 → `clasp push --force`(Code.gs·appsscript.json, 매니페스트 변경 없음) → `clasp version` **20** → 기존 배포 `AKfycbza76…` `redeploy -V 20`. 운영 `/exec`에서 `listPlaceLikes` 세 장소 0, 테스트 방문자로 `togglePlaceLike` 1 → 다시 눌러 0(흔적 제거), `listPosts` 정상.
- 화면(`app.js`): `placeLikeState`(처음엔 null → 숫자 숨김), 홈 렌더 후 `loadPlaceLikes()`, 누르면 즉시 반영(낙관적) 후 서버 결과로 확정, 실패 시 되돌리고 토스트. `.discover-like`(하트+숫자, 알약 모양), `.discover-count:empty{display:none}`. 버전 `app.js?v=96-place-like-count`, `styles.css?v=93-place-like-count`.
- 검증: 공개 사이트 390px에서 처음 0/0/0 → 월미도 하트 클릭 즉시 1·빨간 하트 → 서버 확정 후 1 → 새로고침 후에도 1·빨간 하트 → 다시 눌러 0(테스트 흔적 제거). 커밋 `55cc3b5`, Pages 실행 `36652516822` 성공. README에 서버 배포 기록 추가.
- 참고: 앞서 브라우저에만 저장했던 하트(`cic.placeLikes.v1`)는 서버로 옮기지 않았다(배포 후 몇 시간 동안만 존재, 숫자 없었음).

## 2026-09-30 인트로 영상 카드 제목·출연자 이름

- 사용자 요청에 따라 홈 Explore 영상 카드 제목과 출처 줄을 `introVideos`(장소 번호별)로 따로 둔다. 인천문화유산(`#guide`) 페이지의 장소 제목은 그대로다.
  - 01: "모두가 뜯어말렸던 작전! 인천상륙작전 영웅들의 이야기" / "청소년 국가유산지킴이 이준혁" (사용자 문구 "뜯어 말렸던작전"은 영상 썸네일 표기에 맞춰 "뜯어말렸던 작전"으로 씀)
  - 02: "놀이기구 타러 가는 월미도? 사실 맥아더 장군의 최후 승부처" / "청소년 국가유산지킴이 김현우"
  - 03: "계단 하나로 나라가 갈라진다고?! 충격적인 실존거리 개항장" / "청소년 국가유산지킴이 김연후"
- 영어(임시 번역, 사용자 확인 필요): "The Operation Everyone Opposed! Heroes of the Incheon Landing" / "Wolmido for the Rides? Actually, General MacArthur's Final Gamble" / "One Staircase Divided Nations?! The Real Open Port Street", 출처 "Youth Heritage Guardian Junhyuk Lee / Hyunwoo Kim / Yeonhu Kim"(이름 로마자, 특히 김연후 Yeonhu는 추정).
- 공유 제목과 ⋮ 메뉴 메일 제목도 영상 제목을 쓴다. 버전 `app.js?v=95-intro-video-titles`. 테스트 36개·JS 문법 통과. 로컬(한국어 390px, 영어 1280·390px)과 공개 사이트에서 제목·출처 문구 확인, 제목이 2줄 제한에 잘리지 않음 확인. 커밋 `a43cb3f`, Pages 실행 `36651689948` 성공.

## 2026-09-30 인트로 Explore 영상 3개를 Google 앱(Discover) 카드 UI로

- 사용자 요청(`reference/Google.jpg` 참조)에 따라 홈 "Explore Incheon" 카드를 영상 → 장소 제목(2줄 제한, `#guide/<id>` 링크) → 메타 줄(왼쪽: CIC 로고 24px 원형 + "청소년 국가유산지킴이", 오른쪽: 하트·공유·세로 점 3개) 구성으로 바꿨다. 기존 번호(01~03)·분류 문구와 네이비 윗줄은 빼고, 영상 테두리를 없애고 모서리를 10px로 했다(`.discover-card`, `.discover-*` CSS).
- **하트:** 로그인 없이 누를 수 있고 방문자 브라우저 `localStorage` `cic.placeLikes.v1`(장소 id 배열)에만 저장한다. 서버 저장·숫자 표시는 없다(참조 UI도 숫자 없음). 누르면 `#e63950` 채운 하트.
- **공유:** `shareLink(url,title)`로 기존 `sharePost()` 로직을 분리해 재사용 — 휴대폰은 기본 공유창, 없으면 링크 복사 후 토스트. 공유 주소는 현재 주소의 해시를 `#guide/<id>`로 바꾼 것.
- **⋮ 메뉴:** 누르면 버튼 아래 팝업(`.discover-menu`)에 `신고하기`·`의견 보내기`. 바깥 클릭·Esc·항목 선택 시 닫힌다. 영상 신고를 받을 서버 기능이 없어 두 항목 모두 `mailto:e3kim2027@chadwickschool.org`로 제목(`[CIC] 영상 신고: <장소>` / `[CIC] 의견 보내기: <장소>`)과 본문(장소 주소)을 채운 메일 작성 창을 연다. 서버 신고(`reportContent`)로 받으려면 `targetType` 확장과 Apps Script 재배포가 필요하다(미구현).
- 영어: `i18n.js`에 `청소년 국가유산지킴이`→Youth Heritage Guardians, `의견 보내기`→Send feedback, `더보기`→More options 추가. 새 아이콘 `icon('more')`.
- 버전 `app.js?v=94-discover-videos`, `styles.css?v=92-discover-videos`, `i18n.js?v=43-discover-videos`. 테스트 36개·JS 문법 통과. 로컬(한국어 390px, 영어 1280px)과 공개 사이트(390px)에서 카드 3개 순서, 로고 로드, 하트 토글·새로고침 후 유지, 메뉴 열림·메일 주소·바깥 클릭 닫힘, 가로 넘침 없음을 실제 마우스 이벤트로 확인했다. 실제 휴대폰 공유창·메일 앱은 미확인. 커밋 `44eb9be`, Pages 실행 `36650437956` 성공.

## 2026-09-30 인트로 이야기 제목 글꼴 통일, 푸터 버튼을 `지킴이 로그`로

- 사용자 요청에 따라 "우리가 문화유산에 ‘푹’ 빠진 이유"의 이야기 제목 3개(`.story-card .guide-card-story h4`)를 "탑골공원에서 이어가는 나눔"(`.grid-3 .activity h3`)과 같은 글꼴로 바꿨다: Noto Sans KR, 1.25rem(20px), 700, 줄 높이 30px, 색 동일(이전 Noto Serif KR 16.8px). 아래 여백(14px)은 그대로.
- 푸터(`index.html` `.contact-button`)의 `이메일 문의`(mailto) 버튼을 `지킴이 로그` 버튼(`href="#board"`, `data-i18n="지킴이 로그"` → 영어 "Guardian Log")으로 바꿨다. 해시만 쓰므로 새로고침 없이 이동하고 언어를 유지한다. 오른쪽 EMAIL 카드의 메일 링크는 그대로다. `i18n.js`의 `'이메일 문의'` 번역은 쓰지 않지만 남겼다.
- 버전 `styles.css?v=91-story-title-font`. 테스트 36개·JS 문법 통과. 로컬(한국어 1280px, 영어 390px)과 공개 사이트에서 두 제목의 계산된 글꼴 값이 같고 버튼 문구·링크가 맞음을 확인. 커밋 `985c59b`, Pages 실행 `36648883263` 성공.

## 2026-09-30 지킴이 로그 첫 화면 로딩: 텍스트 대신 카드 틀 + 움직이는 로딩바

- 사용자 요청("불러오고 있습니다 텍스트가 너무 느림")에 따라 `board()`가 첫 `listPosts`(titles)를 기다리는 동안 `boardSkeleton()`을 보여준다: 주황색 막대가 좌우로 움직이는 4px 로딩바(`.loading-bar::before`, 1.1초 반복, 동작 줄이기 설정 시 2.4초) + 게시판과 같은 `.post-grid` 안 카드 틀 6개(`.skeleton-card`: 사진 자리, 분류·제목 두 줄 자리). 화면 읽기용 문구 "게시글을 불러오고 있습니다…"(영어 "Loading posts…")는 `visually-hidden`으로 남겼다. 응답이 오면 기존처럼 제목이 있는 카드로 바뀐다.
- 버전 `app.js?v=93-board-skeleton`, `styles.css?v=90-board-skeleton`. 테스트 36개·JS 문법 통과. 로컬 1280px(3열)·390px 영어(1열) 캡처와 공개 사이트에서 틀 6개·로딩바 애니메이션, 이후 실제 카드 6개로 교체됨을 확인했다. 커밋 `4707256`, Pages 실행 `36646059422` 성공.
- **실제 속도는 그대로다:** 공개 사이트에서 첫 목록 응답까지 약 5.5초(Apps Script 응답 시간). 체감 개선만 했다. 더 빠르게 하려면 마지막 목록을 브라우저에 저장해 즉시 보여주고 뒤에서 갱신하거나, 서버 `CacheService`로 목록을 캐시하는 방법이 있다(미구현).

## 2026-09-30 인트로 이야기 카드 전체를 클릭·터치하면 게시글로

- 사용자 요청에 따라 "우리가 문화유산에 ‘푹’ 빠진 이유"의 이야기 카드(제목·주소·사진·본문 어디든)를 누르면 그 카드의 `more` 링크와 같은 곳으로 간다. `storyLink(p)`(영어는 `en.moreUrl` 우선)를 `<article class="story-card" data-href>`에 넣고, 전역 클릭 리스너가 `a`/`button` 밖의 카드 클릭을 `location.href=data-href`로 처리한다(`more` 버튼은 원래 링크 그대로).
- CSS: `.story-card[data-href]{cursor:pointer}`, 마우스 기기(`@media(hover:hover)`)에서 올리면 제목이 주황색+밑줄, 사진이 살짝 흐려짐. 터치 기기는 hover 효과 없이 탭하면 이동.
- 버전 `app.js?v=92-story-card-link`, `styles.css?v=89-story-card-link`. 테스트 36개·JS 문법 통과. 로컬(한국어 1280px, 영어 390px)과 공개 사이트(390px)에서 세 카드 본문 문단을 실제 마우스 이벤트로 눌러 각각 01 `4ac9ae38`, 02 `0654570e`(영어는 `c5bc18c3` 영어 게시글), 03 `2bdd3dad`로 이동함을 확인했다. 커밋 `0edb730`, Pages 실행 `36631823391` 성공.

## 2026-09-30 인트로 이야기 01·03에 `more` 버튼

- 사용자 요청에 따라 `guideCardStories['01'].moreUrl='#post/4ac9ae38-a4ac-4005-98eb-b6d4a9d40bc7'`, `['03'].moreUrl='#post/2bdd3dad-6b1f-43ea-b82e-e4eb8159d353'`을 추가했다(본문 마지막 문단 바로 아래, 02와 같은 `story-more` 버튼). 사용자가 준 주소의 `?lang=ko`는 넣지 않고 02처럼 해시만 써서 현재 언어를 유지한다. 영어 화면도 같은 게시글로 연결된다(01·03은 영어 게시글이 따로 없음, 02만 영어 `moreUrl`이 별도).
- 버전 `app.js?v=91-story-more`. 테스트 36개·JS 문법 통과. 커밋 `be5166a`, Pages 실행 `36630884112` 성공. 공개 사이트 한국어·영어 홈에서 세 이야기 모두 본문 문단 다음에 `more` 링크와 위 주소를 확인했다.

## 2026-09-30 인트로: 장소 소개 글을 새 "지킴이 로그" 섹션으로 이동

- 사용자 요청에 따라 홈 "Explore Incheon 발걸음으로 만나는 인천의 역사" 카드 3개 안에 있던 소개 글 전체(제목 "인천문화유산 대장정, 자유의 뿌리를 찾아서"부터 03의 "…개항의 역사가 담겨 있다는 것을 알려 주었습니다."까지: 주소 박스·`incheon0N.jpg`·본문·02 `more` 버튼)를 "Our Practice" 아래 새 섹션 `<span class="eyebrow">지킴이 로그</span><h2>우리가 문화유산에 ‘푹’ 빠진 이유</h2>`(3열 `grid-3`)으로 옮겼다. 영어는 기존 번역(Guardian Log / Why we care so deeply about heritage)과 각 이야기의 `en`을 그대로 쓴다.
- Explore 카드는 이제 번호·분류·장소 제목·영상만 남는다. 새 `storyCards()`가 `guideCardStory()`를 재사용하고 `<article class="story-card">`로 감싼다. CSS `.story-card .guide-card-story{margin-top:0;padding-top:26px;border-top:2px solid var(--navy)}`(Explore 카드의 네이비 윗줄과 같은 모양).
- 버전 `app.js?v=90-intro-stories`, `styles.css?v=88-intro-stories`. 테스트 36개·JS 문법 통과. 로컬(한국어 1280px, 영어 390px)과 공개 사이트에서 섹션 순서 Explore → Our Practice → 지킴이 로그, Explore 카드 안 소개 글 0개·영상 3개, 새 섹션 이야기 3개(사진 01~03)와 가로 넘침 없음을 확인했다. 커밋 `5ddf7f7`, Pages 실행 `36630134677` 성공.

## 2026-09-30 인트로 "현장에서 실천하는 가치" 카드 3개에 사진

- 사용자 요청에 따라 홈(`home()`)의 활동 카드 제목 아래에 사진을 넣었다: 01 탑골공원에서 이어가는 나눔 → `plogging.jpg`, 02 국가유산 복구를 위한 모금 → `fundraising.jpg`, 03 기록으로 알리는 문화유산 → `flashmob.jpg`. 03의 `content.js` `asset`은 `media`지만 사용자 지정대로 홈에서는 `flashmob`을 쓴다(`['plogging','fundraising','flashmob'][i]`, CIC 소개 페이지는 변경 없음). `activityPhoto()`를 재사용해 `config.js`의 기존 버전 주소를 쓴다. `img/`의 세 파일은 `dist/assets`와 같은 파일(MD5 일치)이라 복사하지 않았다.
- 카드 높이를 맞추려고 `.grid-3 .activity .activity-photo{aspect-ratio:4/3;margin:12px 0 16px}`(cover로 잘림). 버전 `app.js?v=89-intro-activity-photos`, `styles.css?v=87-intro-activity-photos`. 테스트 36개·JS 문법 통과. 로컬·공개 사이트 1280px(352×264)·390px(343×257)에서 각 제목 바로 다음 요소가 해당 사진임을 확인. 커밋 `7955e58`, Pages 실행 `36628363942` 성공.
- 참고: `plogging.jpg` 3.4MB, `fundraising.jpg` 2.7MB로 홈 첫 방문이 무거워졌다(지연 로딩). 필요하면 줄인다.

## 2026-09-30 `#guide` 영상을 팁 박스 위로, 원래 자리에 장소 사진

- 사용자 요청에 따라 인천문화유산(`#guide`)의 장소별 영상을 본문 소제목·문단 다음, `지킴이의 추천 팁` 박스 바로 위(`<div class="guide-tip-video">`, `margin-top:26px`)로 옮겼다. 영상은 장소마다 1개이고 이제 자리를 옮기지 않는다(재생 버튼 오버레이 유지).
- 영상이 있던 자리(넓은 화면: 오른쪽 본문 맨 위 `.guide-slot-wide`, 720px 이하: 장소 제목 아래 `.guide-slot-narrow`)에는 `assets/incheon01~03.jpg`(`guidePlaceImage()`, 16:9 `object-fit:cover`, 둥근 모서리 6px)를 넣었다. 기존 `video-slot-*`/`.video-frame` 이동 로직을 이 사진(`.guide-place-image`) 이동으로 바꿨다(장소마다 사진 1장, 복제 없음). 홈 카드는 변경 없음. 03 개항장의 지도 사진은 팁 박스 아래 그대로다.
- 버전 `app.js?v=88-guide-video-tip`, `styles.css?v=86-guide-video-tip`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 1280px(사진이 넓은 자리)·390px(좁은 자리) 모두 장소마다 사진 1장·영상 1개, 순서 사진 → 소제목·본문 → 영상 → 팁 박스(영상과 팁 간격 26px)임을 확인했다. 커밋 `bbf4ce4`, Pages 실행 `36626795188` 성공.
- 참고: `incheon0N.jpg`는 4000×2252, 각 2.8~3.2MB로 무겁다(홈 카드와 공용). 필요하면 줄여서 교체한다.

## 2026-09-30 게시글 상세 사진 배경을 흰색으로

- 사용자 요청에 따라 게시글 상세의 사진 여백(세로 사진 양옆 등 `object-fit:contain`으로 남는 부분) 배경을 연한 회색(`var(--tint)`)에서 흰색으로 바꿨다: `.post-detail .post-gallery{background:#fff}`, `.post-detail .post-gallery-media{...;background:#fff}`. 불러오는 중 자리 표시만 `.post-detail .post-gallery-media.media-pending{background:var(--tint)}`로 회색 유지. 게시판 목록 카드·편집 미리보기는 변경 없음.
- 버전 `styles.css?v=85-white-gallery`. 테스트 36개 통과. 커밋 `198bebd`, Pages 실행 `36625613120` 성공. 공개 사이트 1280px에서 사진 게시글(`#post/2bdd3dad-…`, 1200×1600 세로 사진)의 갤러리·사진 배경이 `rgb(255,255,255)`이고 양옆 여백이 흰색임을 캡처로 확인했다.
- 참고: 직전에 사용자가 "게시글 상단 `수정됨` 안 보이게"를 다시 요청했다가 중단했다. 게시글 헤더의 `수정됨`은 `c54895a`로 이미 공개 사이트에서 제거됐다. 계속 보인다면 이전 파일 캐시(새로고침 필요)이거나 댓글 옆 `수정됨`(`app.js` `commentMarkup`, 미변경)일 수 있다.

## 2026-09-30 게시글 상세 상단 `수정됨` 표시 삭제

- 사용자 요청에 따라 게시글 상세 헤더(작성자 이름 아래 분류 옆)의 ` · 수정됨`을 없앴다. 댓글 작성자 옆 `수정됨`은 요청 범위 밖이라 그대로다(`i18n.js`의 `'수정됨':'Edited'`도 댓글용으로 유지).
- 버전 `app.js?v=87-no-edited-label`. 테스트 36개·JS 문법 통과. 커밋 `c54895a`, Pages 실행 `36623676043` 성공, 공개 `index.html`이 새 버전을 참조하고 공개 `app.js`에 게시글 헤더의 `p.version>1` 조건이 없음을 확인했다.
- 미해결: 사용자가 관리자 계정 `415hyunwoo@gmail.com` 로그인 실패를 알렸다. 서버 `challenge`·`listPosts`는 HTTP 200·`ok:true`, Google 인증 URL(클라이언트 ID, `storagerelay` 출처)도 오류 없이 로그인 화면으로 넘어갔다. 증상(오류 문구 등)을 아직 듣지 못해 원인은 미확인이다. 서버상 가능성: 토큰 교환 실패(`GOOGLE_CLIENT_SECRET`·`redirect_uri`), 회원 `blocked`, `ADMIN_EMAILS`에 미포함(로그인은 되지만 관리자 아님), 브라우저 팝업 차단.

## 2026-09-30 댓글 `신고하기` 버튼 삭제, 게시글 사진 추가 준비

- 사용자 요청에 따라 댓글마다 있던 `신고하기` 텍스트 버튼을 없앴다. 이제 화면 어디에도 신고 버튼이 없어 쓰지 않는 `reportButton()`도 지웠다. `reportDialog()`·`report` 클릭 처리·서버 `reportContent`·관리자 `#reports`는 남겨 두었다(버튼만 다시 넣으면 복구된다). **Play UGC 정책상 신고 수단이 필요하므로 출시 전에 재검토한다.**
- 버전 `app.js?v=86-no-comment-report`. 테스트 36개·JS 문법 통과. 커밋 `ed27460`, Pages 실행 성공, 공개 `app.js`에 `reportButton` 0건.
- 사진 요청: 게시글 `4ac9ae38-a4ac-4005-98eb-b6d4a9d40bc7`("인천상륙작전기념관과 자유공원에서 되새긴 자유의 의미", 작성자 Ashley Park, 현재 첨부 없음) 제목 아래에 `img/Ashley.jpg`를 넣어 달라는 요청. 게시글 첨부는 Sheets·Drive 데이터라 코드로 넣을 수 없고, 작성자나 관리자가 로그인해 **게시글 수정 → 사진 추가**로 올려야 한다(첨부 갤러리는 이미 제목 바로 아래에 표시됨). 원본은 4000×3000, 9.4MB, EXIF 회전 6이라 방향을 바로잡고 긴 변 2000px로 줄인 `img/Ashley_web.jpg`(1500×2000, 약 620KB)를 만들어 두었다. 사용자가 올린 뒤 공개 페이지에서 확인이 필요하다.

## 2026-09-30 게시글 상세: 다른 게시물을 격자(노트북 3열·휴대폰 1열)로

- 사용자 요청에 따라 본문 아래 "다른 게시물"을 가로 스크롤 목록에서 스크롤바 없는 격자로 바꿨다. `.related-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}`, `@media(max-width:620px)` 1열(게시판 목록 `.post-grid`의 휴대폰 기준과 같음). 카드는 순서대로 세로로 이어진다. 상세 폭 760px 기준 카드 폭 232px.
- 스크롤이 없어져 ‹ › 화살표를 없앴다: `relatedShell()`의 `.related-controls` 마크업, `updateRelatedControls()`와 호출·`onscroll`·`resize` 리스너, `related-previous/next` 클릭 처리, `i18n.js`의 두 aria 문구, `.related-controls`/`.related-arrow` CSS. 목록의 `role="region"`·`tabindex`(스크롤 키보드 접근용)도 뺐다. 상태·오류 문구 `.related-status`는 `grid-column:1/-1`.
- 버전 `app.js?v=85-related-grid`, `styles.css?v=84-related-grid`, `i18n.js?v=42-related-grid`. 테스트 36개·JS 문법 통과. 커밋 `7f5c524`, Pages 실행 `36619510944` 성공. 공개 사이트 1280px: 열 `232px×3`, 카드 5개가 3+2줄, 390px: 1열 세로 5줄, 둘 다 목록·페이지 가로 넘침 없음, 화살표 0개.
- 참고: 카드는 제목만 먼저 그리고 두 번째 `listPosts`(ids)로 작성자·썸네일을 채운다. 캡처는 `.related-card[aria-busy=true]`가 없어질 때까지 기다려야 하고, 썸네일은 화면에 들어올 때 지연 로드된다.

## 2026-09-30 게시글 상세: 다른 게시물 목록을 본문 아래로

- 사용자 요청에 따라 넓은 가로 화면(`min-width:960px and orientation:landscape`)에서 오른쪽 340px 고정 사이드바였던 "다른 게시물"을 모든 화면에서 게시글(댓글 포함 카드) 아래 가로 스크롤 목록으로 바꿨다. `dist/styles.css`의 해당 미디어 쿼리 규칙(사이드바 그리드, sticky, 세로 목록, 가로형 카드, 화살표 회전, `max-width:1200px`)을 지웠다. 같은 블록 안에 있던 `.empty .button-row{justify-content:center}`는 같은 조건의 미디어 쿼리로 남겼다. 상세 화면 폭은 모든 화면에서 760px이다.
- JS 변경 없음: 화살표 버튼은 `getComputedStyle(list).flexDirection`으로 방향을 판단하므로 자동으로 가로 스크롤한다.
- 버전 `styles.css?v=83-related-below`. 테스트 36개·JS 문법 통과. 커밋 `25fedfa`, Pages 실행 `36617287670` 성공. 공개 사이트에서 headless Edge(DevTools)로 1280px·390px 모두 목록이 본문 바로 아래(같은 폭), `flex-direction:row`, 카드 5개, 가로 넘침 없음을 확인했다.
- 참고(검증): `--screenshot` + `--virtual-time-budget`은 iframe 서버 응답 전에 찍혀 "불러오고 있습니다"만 보인다. `--remote-debugging-port`로 띄워 `.related-card`가 생길 때까지 기다린 뒤 캡처한다.

## 2026-09-30 지킴이 로그 글보기에서 게시글 `신고하기` 버튼 삭제

- 사용자 요청에 따라 게시글 상세 화면의 액션 줄(좋아요·댓글·공유 옆)에 있던 게시글 `신고하기` 버튼을 없앴다. 모달·`reportContent` 서버 기능·관리자 `#reports` 화면은 그대로다. **댓글마다 붙은 `신고하기` 텍스트 버튼은 남아 있다**(요청 범위 밖, 사용자에게 알림).
- 쓰지 않게 된 `.post-report-action` CSS를 지우고 `reportButton()` 기본 클래스를 `text-button`으로 바꿨다. 버전 `app.js?v=84-no-post-report`, `styles.css?v=82-no-post-report`.
- 참고: Play UGC 정책은 사용자 콘텐츠 신고 수단을 요구한다. 게시글 신고 경로가 사라졌으므로 Play 심사 전에 다시 검토한다.
- 테스트 36개·JS 문법 통과. 커밋 `6795a1f`, Pages 실행 `36616552043` 성공. 공개 `index.html`이 새 버전을 참조하고 공개 `app.js`에 게시글 신고 버튼 호출이 없음을 확인했다.

## 2026-09-28 영어 홈 섹션 제목 축약

- 사용자 요청에 따라 "발걸음으로 만나는 인천의 역사"의 영어 번역(`i18n.js`)을 "Discover Incheon’s history on foot" → "Discover Incheon’s history"로 바꿨다. `dist/`에 "on foot"이 더 없다. 한국어는 변경 없음.
- 버전 `i18n.js?v=41-explore-heading`. 테스트 36개·JS 문법 통과. 커밋 `7800ace`, Pages 실행 `36419413046` 성공. 공개 영어 홈(1280px)에서 새 제목 확인.

## 2026-09-28 홈 첫 화면 제목도 노트북·데스크톱에서 한 줄로

- 사용자 요청에 따라 제목 "우리가 지키는 역사, 함께 이어갈 미래"를 폭 1001px 이상 한국어 화면에서 한 줄로 표시한다. `home()`의 `<br>` 앞에 공백을 넣고(`역사, <br>함께`), 아래 부제목 규칙과 같은 미디어 쿼리에 `.hero-copy h1{white-space:nowrap}`와 `.hero-copy h1 br{display:none}`을 추가했다. 1000px 이하와 영어 화면은 여전히 두 줄이다(i18n은 부분 문자열 치환이라 공백 추가에 영향 없음).
- 버전 `app.js?v=83-hero-title-line`, `styles.css?v=81-hero-title-line`. 테스트 36개·JS 문법 통과. 로컬 headless Edge에서 한국어 1024·1920px 한 줄, 800px 두 줄, 영어 1280px 기존과 동일함을 확인했다.
- 커밋 `a9c8ec8`, Pages 실행 `36418923180` 성공. 공개 사이트 1280px에서 한 줄 확인.

## 2026-09-28 홈 첫 화면 부제목을 노트북·데스크톱에서 한 줄로

- 사용자 요청에 따라 홈 히어로 부제목("청소년의 시선으로 기록하고 지켜나가는 우리는 대한민국 국가유산지킴이입니다.")이 폭 1001px 이상에서 한 줄로 보이게 했다. 원인은 `.hero-copy{max-width:760px}`에서 좌우 패딩(12%+8%)을 빼면 1200px 화면 기준 본문 폭이 약 520px라 줄바꿈된 것이다.
- `dist/styles.css`: `@media(min-width:1001px){html:not([lang="en"]) .hero-copy{max-width:none}html:not([lang="en"]) .hero-copy p{white-space:nowrap}}`. 영어 부제목은 길어서 한 줄 고정 시 넘칠 수 있어 제외했다. 1000px 이하와 제목(`<br>`로 두 줄)은 변경 없음.
- 버전 `styles.css?v=80-hero-subtitle-line`. 테스트 36개(`tests/*.test.cjs` 전체, AGENTS.md의 두 파일만은 26개)·JS 문법 통과. 로컬 headless Edge에서 1024·1280·1920px은 한 줄, 800px도 원래 폭 안에서 한 줄로 보였다. 공개 사이트 1280px에서도 한 줄 확인.
- 커밋 `6f87343`, Pages 실행 `36416844868` 성공.

## 2026-09-28 03 개항장 영상만 새 파일로 교체

- 사용자가 `img/03Incheon.mp4`를 새로 바꿔(14:45, HEVC 1080p, 71초) 홈페이지에 덮어쓰기를 요청했다. 같은 설정(H.264 720p/30fps, CRF 26, AAC 96k, `+faststart`)으로 `dist/assets/incheon03-video.mp4`(14.7MB)를 다시 만들었다. 썸네일 `03Incheon.jpg`는 바뀌지 않아 그대로다. 40초 지점 프레임이 새 원본과 일치함을 확인했다.
- 영상 버전은 세 영상 공통 `?v=2`→`?v=3`(`guideVideo()`), `app.js?v=82-video03-refresh`. 01·02는 파일 변경 없음(재생 시 한 번 다시 받는 정도의 영향).
- 테스트 36개·JS 문법 통과. 커밋 `c365530`, Pages 실행 `36384396472` 성공. 공개 URL의 `incheon03-video.mp4?v=3`이 HTTP 200이고 로컬 파일과 바이트 단위로 같다. 홈 카드와 `#guide` 모두 같은 파일을 쓴다.
- 새 영상 교체 요청 절차(참고): `img/`의 원본 확인(ffprobe) → 위 설정으로 `dist/assets/incheon0N-video.mp4` 인코딩 → `guideVideo()`의 `mp4?v=` 올림 → `index.html`의 `app.js?v=` 올림 → 배포 후 공개 파일 바이트 비교.

## 2026-09-28 홈 카드 영상에도 가운데 재생 버튼

- 사용자 요청에 따라 `#home` 탐방 카드 영상 3개도 `guideVideo(p,true)`로 바꿔 `#guide`와 같은 반투명 재생 버튼(마우스 기기만)을 쓴다. 이제 `guideVideo()` 호출 3곳 모두 `.video-frame` 래퍼를 쓴다. 카드 여백은 `.guide-card .guide-video` → `.guide-card .video-frame{margin:18px 0 14px}`로 옮겼다(제목과 영상 간격 18px 유지).
- 버전 `app.js?v=81-home-video-play`, `styles.css?v=79-home-video-play`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge(1200px)로 세 카드 버튼이 영상 정중앙, 02 클릭 시 해당 영상만 재생·버튼 숨김, 일시정지 시 복귀를 확인했다.
- 커밋 `e4f6c8a`, Pages 실행 `36383435450` 성공.

## 2026-09-28 버그 수정: 창 크기를 줄이면 숨은 영상이 소리만 계속 재생

- **증상(사용자 보고):** 노트북에서 큰 창으로 `#guide` 영상을 보다가 창을 줄이면 재생 중이던 화면이 사라지고 재생 전 첫 화면이 보이는데, 음성은 계속 나옴.
- **원인:** 아래 "넓은 화면은 오른쪽 본문 맨 위" 작업에서 장소마다 영상을 두 개(`.guide-video-narrow`/`.guide-video-wide`) 렌더링하고 CSS로 하나만 보이게 했다. 720px 경계를 넘으면 재생 중인 영상이 `display:none`으로 숨겨질 뿐 멈추지 않았고, 재생하지 않은 다른 복사본의 포스터가 보였다. **같은 영상을 CSS로 숨기는 방식의 중복 렌더링은 쓰지 않는다.**
- **수정:** 장소마다 `<video>`는 하나다. `guide()`가 왼쪽 칸 `h2` 아래 `.video-slot-narrow`와 오른쪽 칸 맨 앞 `.video-slot-wide` 두 자리를 만들고, 렌더링 시점의 `matchMedia('(max-width:720px)')`에 맞는 자리에 `.video-frame`을 넣는다. `change` 이벤트에서 그 요소를 반대쪽 자리로 `append`로 옮긴다. 같은 작업(task) 안에서 옮기면 미디어 요소가 일시정지되지 않아 재생이 이어진다. 여백은 `.video-slot-narrow .video-frame{margin-top:20px}`, `.video-slot-wide .video-frame{margin:0 0 4px}`. `guideVideo(p, overlay)`로 시그니처를 단순화했다(narrow/wide 클래스 제거). 재생 버튼 동작은 그대로다.
- 버전 `app.js?v=80-single-guide-video`, `styles.css?v=78-single-guide-video`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 재현 시나리오를 확인했다: 1200px에서 재생 → 600px로 축소 → 1200px로 복귀하는 동안 같은 요소가 보이는 자리로 옮겨지며 계속 재생(0.9→2.8→6.3초), 재생 중 영상 1개, 숨은 채 재생되는 영상 0개. 375px에서 로드 후 1200px로 넓혀도 자리 이동 확인. 페이지의 영상 요소는 6개→3개. 실제 노트북 창 크기 변경은 사용자 확인이 필요하다.
- 커밋 `bdad19b`, Pages 실행 `36382403053` 성공.

## 2026-09-28 `#guide` 영상에 가운데 재생 버튼(노트북·데스크톱)

- 사용자 요청("노트북에서도 핸드폰처럼 영상 가운데 투명 플레이 버튼")에 따라 `#guide` 영상 3개에 반투명 원형 재생 버튼을 겹쳐 넣었다. 누르면 `video.play()`로 재생되고 버튼이 사라지며, 일시정지·종료 시 다시 보인다. 아래 기본 조작 막대는 유지.
- 구현: `guideVideo(p, extra, overlay=true)`가 `<div class="video-frame{extra}">` 안에 `<video>`와 `<button class="video-play" data-action="play-video">`를 넣는다(좁은/넓은 화면 전환 클래스는 이제 래퍼에 붙는다). 전역 클릭 위임에 `play-video` 추가. `play`/`pause`/`ended`는 버블링되지 않아 `document`에 캡처 단계 리스너로 `.video-frame.is-playing`을 토글한다. CSS `.video-play`(72px, `rgba(0,0,0,.45)`, CSS 삼각형), **버튼은 `@media(hover:hover) and (pointer:fine)`에서만 표시** — 터치 기기는 브라우저 기본 가운데 버튼이 있어 겹치지 않게 했다. 홈 카드 영상은 `overlay` 없이 그대로다(사용자에게 추가 여부를 물어 둠).
- 버전 `app.js?v=79-video-play-overlay`, `styles.css?v=77-video-play-overlay`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge(1200px)로 버튼이 영상 정중앙에 있고, 마우스 클릭 시 재생 시작·버튼 숨김, 일시정지 시 버튼 복귀, 터치 에뮬레이션에서는 버튼 미표시를 확인했다. 실제 노트북·폰 기기는 확인하지 못했다.
- 커밋 `f2d5ce3`, Pages 실행 `36381199705` 성공.

## 2026-09-28 `#guide` 영상 위치: 넓은 화면은 오른쪽 본문 맨 위

- 사용자 요청에 따라 노트북·데스크톱에서 `#guide` 영상을 각 장소의 첫 소제목(01 "인천상륙작전기념관", 02 "근현대사의 거점", 03 "1883년 개항 이후의 인천") 바로 위, 즉 오른쪽 본문 맨 위로 옮겼다(폭 1200px에서 683×384). 휴대폰(폭 720px 이하, 한 칸 레이아웃)은 기존대로 장소 제목(`h2`) 바로 아래다.
- 구현: `guideVideo(p, extra)`에 클래스 인자를 추가하고 영상을 두 곳에 렌더링한다 — 왼쪽 칸 `h2` 아래 `.guide-video-narrow`, 오른쪽 칸 맨 앞 `.guide-video-wide`. CSS에서 기본은 narrow 숨김, `@media(max-width:720px)`에서 반대로 바꾼다. 숨겨진 쪽은 `display:none` + `preload="none"`이라 네트워크 요청이 없다. 오른쪽 영상 여백 `.guide-video-wide{margin:0 0 4px}`. 폭 721~1000px(두 칸, 왼쪽 230px)도 넓은 화면 배치다. 홈 카드 영상은 영향 없음.
- 버전 `app.js?v=78-guide-video-wide`, `styles.css?v=76-guide-video-wide`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 한국어 1200·800·375px, 영어 1200px 모두 장소마다 보이는 영상이 1개이고 위치가 맞음을 확인했다.
- 커밋 `ab8a95f`, Pages 실행 `36380568104` 성공.

## 2026-09-28 탐방 영상 3개·썸네일 3장 새 파일로 교체

- 사용자가 `img/`의 `01Incheon.mp4`·`02Wolmido.mp4`·`03Incheon.mp4`와 `01Incheon.jpg`·`02Wolmido.jpg`·`03Incheon.jpg`를 새 파일로 바꿔 두어 모두 다시 반영했다. 영상은 이전과 같은 형식(HEVC 1080p, 길이 동일)이라 같은 설정(H.264 720p/30fps, CRF 26, AAC 96k, `+faststart`)으로 인코딩했다 → 3.4MB·6.4MB·15.1MB. 새 썸네일은 1376×768이라 `scale=-2:720,crop=1280:720`으로 1280×720에 맞췄다(좌우 약 5px 잘림, 용량 약 180~250KB로 이전 1.4MB 합계보다 가벼워짐). 앞으로 썸네일도 이렇게 줄여서 넣는다.
- 인트로 카드와 `#guide`가 같은 파일을 쓰므로 두 페이지 모두 바뀐다. 버전: 영상 `?v=2`, 포스터 `?v=3`(`guideVideo()`), `app.js?v=77-video-refresh`.
- 검증: 테스트 36개·JS 문법 통과. 공개 URL의 영상·포스터 6개가 로컬 파일과 바이트 단위로 같고, headless Edge에서 한국어·영어 인트로의 세 영상이 새 포스터와 메타데이터(62/75/71초)로 로드됨을 확인했다.
- 커밋 `210b00c`, Pages 실행 `36371918527` 성공.

## 2026-09-28 영어 기념관 이름 통일, 영어 카드 03 소개 글 제목 추가

- 영어 인트로 카드 03 소개 글 제목 `guideCardStories['03'].en.title` = "Another Story of the Incheon Open Port Area"(사용자 문구). 순서: 영상 → 제목 → `incheon03.jpg` → 본문.
- 사용자 요청("'Incheon Landing Operation Memorial Hall'로 모두 수정")에 따라 영어 표기를 통일했다: 01 소개 글 본문의 "Memorial Hall for the Incheon Landing Operation" → "Incheon Landing Operation Memorial Hall", 그리고 `content.en.js`의 `memory` 장소 `title`을 "Incheon Landing Operation Memorial Hall & Jayu Park" → "Incheon Landing Operation Memorial Hall"(인트로 카드·`#guide` 제목·영상 `aria-label` 공통). 바로 아래 기록에서 만든 카드 전용 `cardTitle` 필드는 필요 없어져 제거했다. **영어 화면에는 이제 옛 표기와 "& Jayu Park"가 없다.** 한국어 제목("인천상륙작전기념관 & 자유공원")은 그대로다. `#guide` 영어 본문은 여전히 자유공원도 소개한다.
- 버전 `app.js?v=76-en-memorial-name`, `content.en.js?v=30-memorial-name`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 영어 인트로·가이드 제목과 카드 03 순서를 확인했고, 배포된 파일에 옛 표기가 0건임을 확인했다.
- 커밋 `2f5ee08`, Pages 실행 `36328808690` 성공.
- 참고(검증 스크립트): headless Edge를 연달아 띄울 때 이전 프로세스가 프로필 폴더를 잡고 있으면 다음 실행이 실패한다. `remote-debugging-port` 프로세스를 먼저 종료한다.

## 2026-09-28 영어 인트로 카드 01 제목·소개 글 제목 축약

- 사용자 요청에 따라 영어 인트로 카드 01의 소개 글 제목(`guideCardStories['01'].en.title`)을 "Retracing the Roots of Freedom on the Incheon Cultural Heritage Journey"로 줄였다. 이로써 9/27 기록에 남겨 둔 옛 표기("Memorial Hall for the Incheon Landing Operation")는 제목에서 사라졌다(영어 본문 문단에는 아직 남아 있다).
- 영어 카드 제목은 "Incheon Landing Operation Memorial Hall & Jayu Park" → "Incheon Landing Operation Memorial Hall". 이 `title`은 `#guide` 장소 제목·영상 `aria-label`과 공유되므로, **인트로 카드 전용 필드 `cardTitle`**을 `content.en.js`의 `memory` 장소에 추가하고 `guideCards()`가 `p.cardTitle||p.title`을 쓰게 했다. 영어 `#guide` 제목은 본문이 자유공원도 다루므로 "… & Jayu Park" 그대로 두었다(사용자에게 알림). 한국어는 변경 없음.
- 버전 `app.js?v=75-en-card-titles`, `content.en.js?v=29-card-title`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 영어 인트로·영어 가이드·한국어 인트로 제목을 확인했다.
- 커밋 `3232210`, Pages 실행 `36328365031` 성공.

## 2026-09-27 인트로 카드 01 소개 글 제목 축약

- 사용자 요청에 따라 `guideCardStories['01'].title`을 "인천문화유산 대장정, 자유의 뿌리를 찾아서: 인천상륙작전기념관과 자유공원에서 마주한 역사" → "인천문화유산 대장정, 자유의 뿌리를 찾아서"로 바꿨다(사이트 전체에서 이곳뿐). 영어 제목은 그대로다(옛 표기 "Memorial Hall for the Incheon Landing Operation" 포함, 아래 기록 참고).
- `app.js?v=74-memory-story-title`. 테스트 36개·JS 문법 통과. 커밋 `7d9399f`, Pages 실행 `36327639333` 성공, 배포된 `app.js`에 새 제목만 있음을 확인했다.

## 2026-09-27 인트로 카드 02 소개 글 제목 축약

- 사용자 요청에 따라 `guideCardStories['02'].title`을 "인천문화유산 기억과 감사의 대장정을 마치며: 월미도에서 마주한 역사와 미래" → "월미도에서 마주한 역사와 미래"로 바꿨다(사이트 전체에서 이 문구는 이곳뿐). 영어 제목("At the End of the Incheon Cultural Heritage Journey: Facing History and the Future on Wolmido")은 그대로이며, 줄일지 사용자에게 물어 두었다.
- `app.js?v=73-wolmi-story-title`. 테스트 36개·JS 문법 통과. 커밋 `1d58ac9`, Pages 실행 `36327409975` 성공, 배포된 `app.js`에 새 제목만 있고 옛 문구가 없음을 확인했다.

## 2026-09-27 인트로 카드 03(인천 개항장 거리)에 소개 글 추가

- 사용자가 준 문구로 `guideCardStories['03']`을 추가했다. 한국어: 제목 "인천 개항장 거리의 또 다른 이야기", 주소 2줄(`개항장 거리 : 인천 중구 관동1가`, `청일조계지경계계단 : 인천 중구 신포로27번길 106` — 01·02와 같게 콜론 앞뒤 띄움), 본문 1문단. 영어: 사용자가 준 본문 1문단만(자유공원·제물포구락부·홍예문 소개). 영어 제목·주소는 받지 않아 넣지 않았다(`en.title:''`, `addresses:[]`). 필요하면 사용자에게 문구를 받거나 번역을 제안해 두었다.
- `guideCardStory()`는 제목이 비어 있으면 `h4`를 그리지 않게 바꿨다. 03에도 주소가 생겨 `incheon03.jpg`가 01·02처럼 주소 아래로 옮겨졌다. 한국어 순서: 영상 → 제목 → 주소 → 사진 → 본문. 영어: 영상 → 사진 → 본문.
- 참고: 영어 본문은 사용자 원문 그대로다. 한국어 본문(건물 용도 변화)과 영어 본문(자유공원·홍예문)은 내용이 서로 다르다.
- 버전 `app.js?v=72-openport-story`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 두 언어의 03 카드 순서를 확인했다.
- 커밋 `ad0ee5d`(`Add Open Port story to home card 03`), Pages 실행 `36327126079` 성공.

## 2026-09-27 인트로 카드 사진을 주소 아래로 이동, "인천광역시" → "인천"

- 사용자 요청에 따라 홈 탐방 카드 01·02의 사진(`incheon01.jpg`, `incheon02.jpg`)을 소개 글의 주소 상자(`.story-addresses`) 바로 아래로 옮겼다. 순서: 소개 글 제목(`h4`) → 주소 → 사진 → 본문. `guideCardStory(p, image)`가 사진 마크업을 받아 주소 뒤에 넣고, 소개 글이 없는 카드(03)는 사진을 그대로 돌려줘 영상 아래에 둔다. 영어 소개 글은 `addresses:[]`라 사진이 제목 바로 아래에 온다. 소개 글 안 사진 아래 여백 `.guide-card-story .guide-card-image{margin-bottom:18px}`.
- "인천광역시"를 모두 "인천"으로 바꿨다: 화면에 보이는 국립인천해양박물관 주소(`app.js`)와, 화면에서 쓰이지 않는 `i18n.js`의 학교 주소 번역 키 1곳. `dist/`에 "광역시"가 남지 않았다. 새 주소 문구도 "인천 ○○구" 형식으로 쓴다.
- 버전 `app.js?v=71-card-image-address`, `i18n.js?v=40-incheon-address`, `styles.css?v=75-card-image-address`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 한국어·영어 카드 순서를 확인했고, 배포된 `app.js`·`i18n.js`에 "광역시"가 없음을 확인했다.
- 커밋 `05ad6ef`, Pages 실행 `36326281375` 성공.
- **남은 것(사용자에게 알림, 미수정):** 영어 01 소개 글 제목(`app.js`의 `guideCardStories['01'].en.title`)이 아직 옛 표기 "Memorial Hall for the Incheon Landing Operation"이다. 9/21 표기 통일 때 `content.en.js`·`i18n.js`만 바꿔서 빠졌다. 본문 문단에도 같은 옛 표기가 있다.

## 2026-09-27 인트로 탐방 카드에서 링크·한 줄 설명 삭제

- 사용자 요청에 따라 홈 화면 "발걸음으로 만나는 인천의 역사"에서 섹션 제목 오른쪽 `전체 가이드 ↗` 링크, 카드 3개의 한 줄 설명(`p.short`), `탐방 가이드 읽기 ↗`(`.card-link`) 링크를 지웠다. 카드 순서는 번호 → 분류 → 제목 → 영상 → 사진 → 소개 글이다. 가이드로 가는 경로는 카드 제목 링크(`#guide/<id>`)와 헤더 메뉴로 남는다.
- 변경은 `dist/app.js`의 `guideCards()`와 `home()`뿐이다. `content.js`의 `short` 데이터, `i18n.js`의 해당 번역 키, `.card-link` CSS는 다른 곳(게시판 등)과 공유하거나 무해해서 남겨 두었다. `#guide` 페이지는 `short`를 쓰지 않아 영향이 없다. 버전 `app.js?v=70-home-cards-trim`.
- 검증: 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 한국어·영어 모두 카드가 `h3` → 영상 → 사진 순서임을 확인했고, 배포된 `app.js`에 두 링크 문구가 없음을 확인했다.
- 커밋 `c26a4a5`(`Remove guide links and short descriptions from home Incheon cards`), Pages 실행 `36325752276` 성공.

## 2026-09-27 인트로(홈) 탐방 카드에도 영상 3개 추가

- 사용자 요청에 따라 홈 화면 "발걸음으로 만나는 인천의 역사" 카드 01·02·03의 한 줄 설명(`p.short`) 바로 아래에 `#guide`와 같은 영상을 넣었다. `guideCards()`에서 `guideVideo(p)`를 재사용하므로 영상·포스터 파일과 `?v=` 버전은 `#guide`와 공유한다(한 곳을 바꾸면 두 페이지 모두 바뀐다). 카드 순서: 번호 → 분류 → 제목 → 한 줄 설명 → 영상 → "탐방 가이드 읽기 ↗" → 사진 → 소개 글.
- 카드 안에서는 링크가 영상에 붙어 보여 `.guide-card .guide-video{margin:18px 0 14px}`를 추가했다(`#guide`의 여백은 그대로). 버전 `app.js?v=69-home-video`, `styles.css?v=74-home-video`.
- 참고: 홈 첫 방문 때 포스터 3장(약 1.4MB)을 새로 받는다. 영상은 `preload="none"`이라 재생할 때만 받는다. 홈을 가볍게 하려면 포스터를 폭 720px 정도로 줄여 다시 저장하면 된다(현재 1080×608 원본 그대로).
- 검증: 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 한국어 1200px(카드 영상 약 329×185)·영어 375px 모두 세 영상이 설명 바로 다음 요소이고 메타데이터(62/75/71초)가 로드됨을 확인했다.
- 커밋 `a373647`(`Add guide videos to the home page Incheon cards`), Pages 실행 `36325185169` 성공.

## 2026-09-27 탐방 영상 첫 화면(썸네일)을 사용자 제공 이미지로 교체

- 사용자가 준 `img/01Incheon.jpg`·`img/02Wolmido.jpg`·`img/03Incheon.jpg`(각 1080×608, 16:9)를 `dist/assets/incheon0{1,2,3}-video-poster.jpg`에 그대로 복사해, 영상에서 추출했던 1초 지점 첫 화면을 대체했다. 영상 파일은 바꾸지 않았다.
- 캐시 갱신을 위해 포스터 `?v=1`→`?v=2`(`guideVideo()`), `app.js?v=68-guide-video-poster`. 테스트 36개·JS 문법 통과, 로컬 headless Edge에서 한국어·영어 모두 새 포스터 표시를 확인했다.
- 커밋 `2932cf7`(`Use supplied thumbnails as guide video posters`), Pages 실행 `36324405909` 성공. 공개 URL의 포스터 3개가 HTTP 200이고 제공 파일과 바이트 단위로 같음을 확인했다.
- **확인 필요:** 03 썸네일 자막은 "김연후입니다", 02 영상 자막은 "김현우입니다"로 다르다. 같은 학생이면 오타일 수 있어 사용자에게 알렸다.

## 2026-09-27 탐방 영상 위치를 각 장소 제목 바로 아래로 이동

- 사용자 요청에 따라 `#guide`의 영상 3개를 각 장소 내용 맨 아래에서 **제목(`h2`) 바로 아래**로 옮겼다. 순서는 번호 → 분류 → 제목 → 영상이다. 아래 기록의 "팁·지도 아래" 위치는 이 변경으로 대체됐다. `guideVideo(p)` 호출을 왼쪽 칸(`.place-section`의 첫 번째 `div`)으로 옮겼고, `.guide-video` 위 여백을 28px→20px로 줄였다.
- 레이아웃 결과: 폭 720px 이하에서는 한 칸이라 제목 아래에 화면 폭 가득(375px 화면에서 330×186) 나온다. **데스크톱에서는 제목 칸 폭(300px, 1000px 이하 230px)에 맞춰 작게(300×169) 보인다.** 사용자에게 알리고 이대로 배포하기로 했다. 더 크게 하려면 데스크톱에서만 오른쪽 본문 맨 위에 두는 방법을 제안해 두었다.
- 버전 `app.js?v=67-guide-video-title`, `styles.css?v=73-guide-video-title`. 테스트 36개·JS 문법 통과. 로컬과 공개 사이트에서 headless Edge로 한국어 1200px·영어 375px 모두 세 영상이 `h2` 바로 다음 요소이고 메타데이터(62/75/71초)가 로드됨을 확인했다.
- 커밋 `d5aff81`(`Move guide videos directly under each place title`), Pages 실행 `36323591828` 성공.

## 2026-09-27 인천 문화유산 페이지에 탐방 영상 3개 추가

- 사용자 요청에 따라 `#guide`(인천 문화유산) 페이지의 각 장소 내용 맨 아래(지킴이의 추천 팁 아래, 03은 개항장 지도 아래)에 영상을 넣었다: 01 인천상륙작전기념관 ← `img/01Incheon.mp4`, 02 월미도 ← `img/02Wolmido.mp4`, 03 인천 개항장 거리 ← `img/03Incheon.mp4`. 한국어·영어 페이지 모두 같은 렌더러(`guide()`)를 쓴다. 홈 화면의 탐방 카드에는 넣지 않았다.
- **원본은 그대로 쓸 수 없었다:** HEVC(H.265) 1080p, 71MB·132MB·84MB. GitHub는 100MB 초과 파일 push를 거부하고, HEVC는 Firefox·일부 Windows Chrome에서 재생되지 않는다. 그래서 H.264 720p/30fps(CRF 26, AAC 96k, `+faststart`)로 다시 인코딩했다 → `dist/assets/incheon01-video.mp4`(3.3MB), `incheon02-video.mp4`(6.7MB), `incheon03-video.mp4`(14.6MB). 첫 화면 이미지(1초 지점)는 `incheon0N-video-poster.jpg`. 화질은 원본과 같은 프레임을 비교해 눈으로 차이가 없음을 확인했다. ffmpeg는 이 PC에 없어서 세션 임시 폴더에 `ffmpeg-static`을 받아 썼다(저장소에는 추가하지 않음). 새 영상을 넣을 때도 같은 설정으로 변환한다. 원본 `img/`는 계속 Git에 넣지 않는다.
- 코드: `dist/app.js`에 `guideVideo(p)`(`<video controls playsinline preload="none" poster=…>`, 파일 이름은 `incheon${p.number}-video`, `aria-label`은 장소명 + `탐방 영상`/`visit video`), `dist/styles.css`에 `.guide-video`(`.guide-map`과 같은 여백·테두리, 16:9, 검은 배경). `preload="none"`이라 페이지를 열 때는 첫 화면 이미지만 받는다. 서비스 워커는 Range 요청과 1MB 초과 영상을 캐시하지 않으므로 변경하지 않았다. 버전: `app.js?v=66-guide-video`, `styles.css?v=72-guide-video`, 영상·포스터 `?v=1`.
- 검증: 테스트 36개·JS 문법 통과. 로컬과 공개 사이트 모두 headless Edge에서 한국어 1200px·영어 375px로 세 영상이 각 장소의 마지막 요소이고, 메타데이터(1280×720, 62/75/71초)가 로드됨을 확인했다. 공개 URL에서 영상·포스터 HTTP 200(`video/mp4`, `image/jpeg`), Range 요청 206을 확인했다. 실제 폰 기기 재생은 확인하지 못했다.
- 커밋 `483c8be`(`Add visit videos under each Incheon heritage guide place`), Pages 실행 `36322908363` 성공. 같은 push로 앞선 문서 커밋 `0cd59f5`도 올라갔다.
- **확인 필요:** 02 월미도 영상에 학생 얼굴과 이름(자막 "김현우")이 나온다. 공개 전 본인 동의를 확인해야 한다(Play 스토어 스크린샷의 초상권 확인과 같은 성격).

## 2026-09-27 Google Play 공개 조건 점검과 개선 계획 수립(`plan.md`)

- 사용자 요청으로 Play 공개 조건과 개선 방향을 정리해 **`plan.md` 맨 위에 새 계획으로 기록**했다(기존 9/13 반응 속도 개선 계획은 "완료된 이전 계획"으로 아래에 보존). 코드·배포 변경은 없다.
- **결론: 7일 권한 만료(아래 기록)가 출시를 막는 1순위 문제다.** 14일 비공개 테스트나 Play 심사 중 서버가 멈추면 "앱이 작동하지 않음"으로 거절될 수 있다. 권장 해결은 경로 B(`drive` → `drive.file`, 업로드 폴더를 앱이 직접 생성, `spreadsheets.currentonly` 가능성 확인, 이후 가벼운 인증 심사)다.
- 그 밖의 개선 항목: ② 타깃 연령(16세 이상 신고) 재확인 — 학교 동아리라 16세 미만 회원이 있으면 가족 정책 대응 필요(운영자 결정), ③ 사용자끼리 차단 기능(UGC 정책 보강), ④ 최소 기능 정책 대비(웹 푸시 알림 등 앱다운 기능), ⑤ 심사자용 테스트 계정·안내문, 테스터 15~20명, 스크린샷 초상권 동의, 매일 `listPosts` 스모크 체크.
- 권장 순서: ① 범위 축소·인증 신청 → 개발자 계정 등록과 테스터 모집(사용자) → 내부 테스트와 앱 서명 키 지문 `assetlinks.json` 추가 → 14일 비공개 테스트(이 기간에 ③④ 보강) → 프로덕션 신청.
- **다음 세션 시작점:** `plan.md` ①부터 — `drive.file` 전환 코드와 업로드 폴더 마이그레이션 계획(기존 첨부 파일 표시·삭제 처리 포함)을 만들어 사용자 승인 후 구현한다. 사용자가 경로 A/B를 아직 확정하지 않았으므로 구현 전에 확인한다.

## 2026-09-27 게시판·로그인 장애 재발 및 해결: Apps Script 권한 승인 만료(재발)

- **증상(사용자 보고):** 지킴이 로그 게시판 자체가 뜨지 않고, 글쓰기(연필) 버튼을 눌러 로그인 창을 열어도 "Google 로그인 준비 중…" 버튼이 활성화되지 않음(=`challenge` 요청이 끝나지 않음).
- **진단:** 운영 `/exec`(버전 19, `dist/config.js`의 `apiUrl`과 일치)에 `curl`과 별도 네트워크의 WebFetch로 각각 요청했더니 **시트를 건드리지 않는 `challenge` 액션까지 포함해 모든 요청이 HTTP 403(Google의 "비정상적인 트래픽" 차단 페이지)**으로 막혀 있었다. 같은 스크립트 프로젝트의 다른(제한 접근) 배포 URL은 정상적으로 Google 로그인 화면으로 리디렉션되어, Google 계정이나 네트워크 전체 문제가 아니라 **이 배포 URL의 스크립트 실행 자체가 막힌 상태**였다. `clasp logs`는 출력이 없어 원인 특정에 도움이 되지 않았다.
- **원인(추정, 아래 "2026-09-20" 기록과 같은 계열):** 배포 계정의 Apps Script 승인(스프레드시트/Drive/외부 요청 권한)이 다시 만료되어 `doPost`가 전부 실패한 것으로 보인다. 9/20 당시엔 `challenge`(시트 미사용)는 성공하고 시트 사용 액션만 실패했지만, 이번엔 `challenge`까지 막혀 있어 그때보다 증상이 더 넓었다(정확한 예외 문구는 실행 기록에서 확인하지 않음). OAuth 동의 화면은 이미 "프로덕션 단계"·외부·"앱을 인증해야 합니다" 배너 상태로, 9/20에 확인한 그대로였고 이번 장애의 원인은 아니었다(정상 상태).
- **해결:** 배포 계정으로 Apps Script 편집기를 열어 `setup` 함수를 실행 → 사용자가 실행 직후 게시판 정상 작동·로그인 버튼 활성화를 확인했다. 이후 실행(Executions) 기록에 `doPost` 다수가 "완료" 상태로 찍히는 것도 사용자가 확인했다. 재배포는 필요 없었다. 내 쪽에서도 `/exec`에 `challenge` 요청을 다시 보내 HTTP 200 정상 응답을 재확인했다.
- **재발 가능성:** 9/20 기록의 "7일마다 만료" 추정이 맞다면 다음 재발은 약 1주 뒤(2026-10-04경)일 수 있다. 재발 시 조치는 동일: 배포 계정으로 Apps Script 편집기에서 `setup` 실행 → 권한 검토 창이 뜨면 허용 → 게시판 새로고침. 코드나 배포 변경은 필요 없다.
- **근본 원인 조사 결과(2026-09-27, 웹 검색 기반):** "프로덕션 단계"인데도 재발한 이유를 확인했다. **Google은 "미인증(unverified) 앱이 민감(sensitive)·제한(restricted) 범위를 요청하면, 게시 상태가 테스트든 프로덕션이든 상관없이 리프레시 토큰을 7일 후 자동 만료시킨다.** 프로덕션 전환이 없애는 것은 "테스트 사용자 100명 제한"뿐이고, 7일 만료를 없애려면 **실제로 Google 인증(verification) 심사를 통과**해야 한다(콘솔의 "앱을 인증해야 합니다" 배너가 곧 "아직 미인증 = 7일 제한 적용 중"이라는 뜻). `apps-script/appsscript.json`의 `oauthScopes`가 `spreadsheets`(민감)와 **`drive`(전체 접근, 제한 범위)**를 요청하고 있어 정확히 이 규칙에 해당한다. (출처: [Google OAuth Refresh Token 설명](https://www.unipile.com/google-oauth-refresh-token/), [Google 제한 범위 인증 안내](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification))
  - **해결 경로 A — 정식 인증 심사 신청:** `drive`(제한 범위)는 보안 평가(2~6주 소요, 앱의 Drive 전체 접근 필요성 소명 필요)를 통과해야 한다. 통과하면 7일 만료가 완전히 사라진다.
  - **해결 경로 B — 범위 축소로 심사 부담을 낮추기:** 코드를 보면 Drive는 `startUpload_`/`completeUpload_`/`trashDriveFile_`(apps-script/Code.gs:377-412, 323)에서 **첨부파일 생성·삭제 용도로만** 쓰이고, 임의의 기존 파일을 읽지 않는다. 다만 업로드 대상 폴더(`UPLOAD_FOLDER_ID`, `uploadFolder_()`)가 **관리자가 미리 만들어 수동으로 지정한 기존 폴더**라는 점이 걸림돌이다. `https://www.googleapis.com/auth/drive`(제한 범위)를 `https://www.googleapis.com/auth/drive.file`(민감이지만 비제한 범위, 심사가 훨씬 가볍고 빠름)로 좁히면 제한 범위 보안 평가는 피할 수 있지만, **`drive.file`은 "앱이 직접 만들었거나 사용자가 Picker로 선택한 파일·폴더"에만 접근 가능**하므로 지금처럼 수동 지정한 기존 폴더에는 쓸 수 없다([출처](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)). 즉 이 경로를 쓰려면 업로드 폴더를 **앱이 스스로 한 번 생성**하도록 코드를 바꾸고 기존 폴더에서 새 폴더로 마이그레이션해야 한다. 이렇게 해도 `spreadsheets`가 여전히 민감 범위라 7일 면제를 받으려면 최소한 가벼운(비제한) 인증 심사는 필요하다 — 다만 이건 제한 범위 보안 평가보다 훨씬 빠르다.
  - **결정 필요:** 경로 A(제한 범위 유지 + 정식 인증, 몇 주 소요)와 경로 B(코드 변경으로 범위 축소 + 가벼운 인증, 며칠~1주 예상이나 업로드 폴더 구조 변경 필요) 중 어느 쪽으로 갈지 사용자가 정해야 한다. 결정 전까지는 **7일마다(대략) `setup` 재실행이 유일한 임시 대응**이다.

## 2026-09-21 Android 실기기 테스트 통과(직접 설치 APK)

- 사용자가 `twa/app-release-signed.apk`(업로드 키 서명, versionCode 2)를 안드로이드 폰에 직접 설치해 확인했다. **통과:** (1) 주소창 없이 전체 화면으로 열림 = `assetlinks.json` 인증 성공, (2) 푸터 `로그인`으로 **Google 로그인 팝업이 열리고 로그인 후 앱으로 돌아와 상태 유지**, (3) 글쓰기, 사진 첨부, 신고, 회원 탈퇴 화면, 한국어↔영어 전환, 뒤로가기가 정상 동작.
- 이로써 계획의 가장 큰 위험(TWA에서 Google 로그인 팝업 동작 여부, `ux_mode:'redirect'` 전환 필요 여부)이 해소됐다. **로그인 방식·서버 `redirect_uri` 변경은 필요 없다.** `SITE_ORIGIN`·OAuth 승인된 원본도 변경 없음(TWA에서도 origin이 `https://cic23.github.io`).
- 이번 테스트에서 **확인하지 않은 것:** 비행기 모드 오프라인 화면, 회원 탈퇴를 실제로 끝까지 실행(탈퇴 화면까지만 확인 — 되돌릴 수 없으므로 테스트 계정으로만), 신고 후 관리자 `#reports` 화면에서 처리, Play에서 설치한 앱(Play 앱 서명 키)의 전체 화면 여부.
- **남은 일(모두 사용자 작업 또는 Play 정보 필요):** (1) Play 개발자 계정 등록(만 18세 이상 본인 명의, US$25), (2) 앱 만들기 + 스토어 등록정보·정책 항목 입력(`store/listing.md` 초안, 계정 삭제 URL `https://cic23.github.io/privacy.html#account-deletion`), (3) `app-release-bundle.aab`를 내부 테스트에 올리고 Play 앱 서명 키 SHA-256을 받아 `dist/.well-known/assetlinks.json`의 `sha256_cert_fingerprints`에 **두 번째 항목으로 추가**·배포, (4) 비공개 테스트 테스터 12명 이상 14일 연속 → 프로덕션 신청, (5) 9월 28일경 서버 권한 승인 유지 재확인(게시판 `listPosts`).

## 2026-09-21 `assetlinks.json` 배포(업로드 키 지문)

- 사용자가 `keytool -list -v`로 얻은 업로드 키 SHA-256(`49:CB:64:73:7F:8F:22:67:8A:12:18:56:56:E2:19:E2:68:45:DA:67:29:71:7C:31:F2:4E:C6:3F:8A:20:43:A0`, 공개 값)을 알려 줘서 `dist/.well-known/assetlinks.json`을 만들었다(패키지 `io.github.cic23.app`, 릴레이션 `delegate_permission/common.handle_all_urls`, 지문 1개). 지문 형식(32바이트 hex)과 패키지 이름(`twa/twa-manifest.json`의 `packageId`와 일치)을 확인했다.
- 커밋 `411b5a7`(`Add Android app links (assetlinks.json) for the upload key`), Pages 실행 `35605873820` 성공. 확인: `https://cic23.github.io/.well-known/assetlinks.json`이 HTTP 200, `Content-Type: application/json`으로 서빙되고, Google Digital Asset Links API(`statements:list?source.web.site=https://cic23.github.io&relation=delegate_permission/common.handle_all_urls`)가 패키지와 지문 1건을 그대로 돌려준다. `upload-pages-artifact@v5`의 `include-hidden-files: true`로 점 폴더(`.well-known`)가 배포되는 것이 실제로 검증됐다.
- 효과: **직접 설치한 `app-release-signed.apk`(업로드 키로 서명)는 주소창 없는 전체 화면 TWA로 열린다.** Play 없이도 실기기에서 Google 로그인 팝업을 확인할 수 있다.
- **Play에서 설치한 앱은 Google이 다시 서명한 키를 쓰므로**, Play Console `앱 무결성 → 앱 서명 키 인증서`의 SHA-256을 받으면 이 파일의 `sha256_cert_fingerprints` 배열에 **두 번째 항목으로 추가**해야 한다(지금 항목은 그대로 유지: 직접 설치 APK와 내부 테스트 확인용). 지문이 어긋나면 앱이 전체 화면이 아니라 주소창이 보이는 모드로 열린다.
- 이 커밋에 함께 넣은 변경: `.gitignore`(Bubblewrap 생성 파일 제외), `twa/twa-manifest.json`(빌드가 채운 `appVersionCode:2` 등), 이 문서.

## 2026-09-21 TWA 첫 빌드 성공(AAB·APK 생성)

- 사용자가 별도 터미널에서 업로드 키스토어(`twa/android.keystore`, alias `cic-upload`, RSA 2048, 유효 10000일)를 만들고 `cd C:\Users\NYK\CIC\twa` → `npx @bubblewrap/cli build`를 실행했다. 체크섬 파일이 없다는 질문에는 `Yes`(프로젝트 재생성 = `bubblewrap update`와 같음), `versionName`에는 `1.0.0`을 답했다. 결과: `Generated Android APK at ./app-release-signed.apk`, `Generated Android App Bundle at ./app-release-bundle.aab`(각 약 2.2MB). Bubblewrap이 `twa/twa-manifest.json`에 `appVersionName:"1.0.0"`, `appVersionCode:2`, `navigationDividerColor` 등을 채워 넣었다(첫 Play 업로드는 versionCode 2로 나간다. 이후 업로드마다 +1).
- 커밋 제외 확인: `android.keystore`, `*.aab`, `*.apk`, `twa/app/`, `twa/build/`는 `.gitignore`로 제외돼 있다. 빌드가 만든 재생성 가능한 파일(`twa/.gradle/`, `twa/gradle/`, `gradlew(.bat)`, `build.gradle`, `settings.gradle`, `gradle.properties`, `manifest-checksum.txt`, `store_icon.png`, `*.idsig`)도 `.gitignore`에 추가했다(비밀번호 문자열 없음 확인). 저장소에는 `twa/twa-manifest.json`과 `twa/README.md`만 남긴다. 클린 체크아웃에서는 `npx @bubblewrap/cli update` 후 `build`를 실행하면 된다.
- **키스토어·비밀번호는 소유자가 오프라인에 백업해야 한다(잃으면 Play에서 업로드 키 재설정 요청 필요).** 채팅·저장소에 올리지 않는다.
- **다음 진행:** (1) 업로드 키 SHA-256 확보: `twa` 폴더에서 `"C:\Users\NYK\.bubblewrap\jdk\jdk-17.0.11+9\bin\keytool.exe" -list -v -keystore android.keystore -alias cic-upload`(키스토어 비밀번호 입력, 출력의 `SHA256:` 줄만 공유. 지문은 공개 값이라 안전). (2) 이 지문으로 `dist/.well-known/assetlinks.json`(패키지 `io.github.cic23.app`)을 만들어 배포하면, **Play 없이 APK를 기기에 직접 설치해도 주소창 없는 TWA 전체 화면으로 열려** Google 로그인 팝업 동작을 미리 실기기로 확인할 수 있다(직접 설치한 APK는 업로드 키로 서명됨). Play 앱 서명 키 지문은 콘솔에서 받은 뒤 두 번째 항목으로 추가한다. (3) Play 개발자 계정·테스터 12명 14일은 사용자 작업.

## 2026-09-21 Bubblewrap 환경 준비 완료(`doctor` 통과)

- 사용자가 별도 터미널에서 `cd C:\Users\NYK\CIC\twa` → `npx @bubblewrap/cli doctor`를 직접 실행해 JDK·Android SDK 설치 질문과 SDK 약관 동의에 `Yes`로 답했고 `doctor Your jdkpath and androidSdkPath are valid.`가 나왔다. `~/.bubblewrap/config.json`: `jdkPath` `C:\Users\NYK\.bubblewrap\jdk\jdk-17.0.11+9`, `androidSdkPath` `C:\Users\NYK\.bubblewrap\android_sdk`(cmdline `tools`, 약 82MB). `keytool.exe`(`…\jdk-17.0.11+9\bin\keytool.exe`) 실행 확인. 프로젝트의 `twa/android.keystore`는 아직 없다.
- 교훈: 이 명령은 **입력 창(TTY)이 있는 별도 터미널에서만** 끝까지 실행된다. Claude Code의 `!` 셸이나 백그라운드 실행은 질문에서 `ERR_USE_AFTER_CLOSE`로 종료한다(JDK는 그 과정에서 이미 설치됐다). 또 프로젝트 폴더(`C:\Users\NYK\CIC\twa`)로 이동한 뒤 실행해야 한다.
- **다음 진행:** (1) 소유자가 업로드 키스토어 생성 — `"C:\Users\NYK\.bubblewrap\jdk\jdk-17.0.11+9\bin\keytool.exe" -genkeypair -v -keystore android.keystore -alias cic-upload -keyalg RSA -keysize 2048 -validity 10000`(`twa` 폴더에서, 비밀번호는 채팅에 공유하지 않고 오프라인 백업, `*.keystore`는 `.gitignore`로 제외됨). (2) `npx @bubblewrap/cli build`로 AAB 생성 — 첫 빌드는 Android build-tools·platform·Gradle을 추가로 내려받아 시간이 걸린다. Play 개발자 계정 없이도 빌드해 볼 수 있다. (3) Play 앱 서명 키 SHA-256을 받으면 `assetlinks.json` 작성·배포.

## 2026-09-21 PWA 실제 브라우저 검증(Play 준비 보강)

- 앞선 기록에서 "실제 Chrome에서의 서비스 워커 등록과 설치 가능성은 확인하지 못했다"고 남긴 항목을 확인했다. Edge(Chromium)를 원격 디버깅 모드로 띄워 운영 사이트(`https://cic23.github.io/`)를 열고 CDP로 조회했다(검증용 임시 스크립트는 삭제, 저장소에는 없음).
- 결과: `Page.getInstallabilityErrors` **오류 0개**, 매니페스트 URL `https://cic23.github.io/manifest.webmanifest`(오류 0개; 이름 `CIC 지킴이 · 인천 문화유산 가이드`, `start_url`·`scope` `/`, `standalone`, 아이콘 192·512·512 maskable). 서비스 워커 `https://cic23.github.io/sw.js`가 scope `/`에서 `activated`, 페이지가 컨트롤됨, 캐시 `cic-shell-v1`. 첫 방문에는 사전 캐시 2개(`offline.html`, `icon-192.png`)뿐이고, **두 번째 로드 후 14개**(`/`, `styles.css`, `config.js`, `content.js`, `content.en.js`, `i18n.js`, `api.js`, `media.js`, `app.js`, `manifest.webmanifest`, `assets/cic-logo.jpeg` 등)로 늘었다.
- **오프라인 재로드**(`Network.emulateNetworkConditions offline`): 헤더·로고·본문(`CIC · CHADWICK INTERNATIONAL CULTURE PROTECTOR …`)이 캐시에서 정상 표시됐다. 오프라인 상태에서 서버 요청(게시판 API 등)이 어떻게 보이는지는 확인하지 않았다.
- 같은 날 운영 서버 상태: 공개 `listPosts` 정상(권한 승인 유지 확인, 다음 정식 재확인은 9월 28일경).
- **결론:** PWA 요건(설치 가능성, 서비스 워커, 오프라인 셸)은 사이트 쪽에서 충족됐다. Play 등록의 남은 일은 모두 사용자 작업 또는 사용자 정보가 필요하다: JDK·SDK 설치(`! cd twa && npx @bubblewrap/cli doctor`를 셸 모드에서 직접), 업로드 키스토어, Play 개발자 계정, 테스터 12명 14일, 앱 서명 키 SHA-256(→ `assetlinks.json`), Android 실기기 로그인 확인.

## 2026-09-21 영문 표기 수정: Incheon Landing Operation Memorial Hall

- 사용자 요청에 따라 영문 페이지의 `Memorial Hall for Incheon Landing Operation`을 `Incheon Landing Operation Memorial Hall`로 바꿨다(5곳). `dist/content.en.js` 3곳(소개 페이지 "Visits for remembrance and gratitude" 설명, 가이드 01 카드 제목 `… & Jayu Park`, 가이드 상세 소제목)과 `dist/i18n.js` 2곳(사진 캡션 `CIC members at the …`, `… · CIC visit`). 다른 변형 표기는 코드에 없었고 한국어(`인천상륙작전기념관`)와 `store/listing.md`(이미 새 표기)는 바꿀 것이 없었다. 새 영문 콘텐츠를 추가할 때도 이 표기를 쓴다.
- 파일 버전: `content.en.js?v=28-memorial-hall`, `i18n.js?v=37-memorial-hall`.
- 검증: 영어로 렌더링한 `#about`·`#guide`·`#home`에서 새 표기가 나오고 옛 표기는 없음, 테스트 36개·JS 문법 통과.
- 커밋 `99e9dfb`(`Fix English name: Incheon Landing Operation Memorial Hall`), Pages 실행 `35599419180` 성공. 공개 사이트 HTTP 200, 배포된 `content.en.js`(새 표기 3곳)·`i18n.js`(2곳)에 옛 표기가 남지 않음을 확인했다.

## 2026-09-21 개인정보처리방침·이용약관 본문 글자 14px

- 푸터에서 여는 상세 페이지(`dist/privacy.html`, `dist/terms.html`)의 본문 글자를 인트로 `기억과 평화`(`.guide-card .category`, `.875rem`=14px)와 같게 맞췄다. 본문(문단·목록)은 `body{font:.875rem/1.75 …}`(이전 16px), 시행일·영어 요약(`.meta, .en`)은 `.875rem`(이전 `.92rem`), 개인정보처리방침의 표는 `.875rem`(이전 `.95rem`)이다. 제목은 위계를 위해 그대로다(`h1` 1.7rem=27.2px, `h2` 1.15rem=18.4px). 상단 공용 헤더 메뉴(`static-header.css`)는 이미 14px였다.
- "폰트 사이즈"를 본문 글자로 이해해 제목은 바꾸지 않았다. 제목까지 14px로 맞추려면 두 페이지의 `h1`/`h2` 규칙을 바꾸면 되지만 본문과 구분이 어려워진다고 사용자에게 알렸다.
- 검증: 폭 800px(두 페이지)·375px(개인정보처리방침)에서 문단·목록·표 칸·시행일·영어 요약이 모두 14px임을 계산된 스타일로 확인했고 800px 화면 렌더링을 확인했다. 실제 폰 기기는 확인하지 못했다.
- 커밋 `3ddaa4a`(`Set policy page body text to 14px like the guide category text`), Pages 실행 `35589104164` 성공. 공개 사이트에서 두 페이지 HTTP 200, 새 글자 크기 반영(옛 `16px` 규칙 없음)을 확인했다.

## 2026-09-21 헤더 메뉴 글자 크기 변경 + 개인정보처리방침·이용약관 상단에 공용 헤더

- **메뉴 글자**: 헤더 메뉴(`CIC 소개 · 인천 문화유산 · 지킴이 로그`)를 인트로 `기억과 평화`(`.guide-card .category`, `.875rem`=14px)와 같은 크기로 키웠다. `dist/styles.css`의 `.site-header nav a` 두 규칙(기본 `.756rem`, 1000px 이하 `.735rem`)을 모두 `.875rem`으로 바꿨다. 이전 "메뉴 20% 확대"(12.1px) 기록은 이 값으로 대체됐다.
- 메뉴가 커져서 폭 375px 이하 **영어** 화면에서는 메뉴가 두 줄(`Guardian Log`가 다음 줄)이 되고 헤더가 71px→87px로 커진다(한국어는 375px에서도 한 줄). 헤더 아래 고정된 언어 토글(`.language-float`)이 헤더와 겹치지 않도록 `top`을 고정 픽셀(109/93/79px)에서 `calc(var(--header-h,101px) + 8px)`로 바꿨고, `dist/app.js`가 `ResizeObserver`로 헤더 높이를 `--header-h`에 넣는다. **이제 헤더 높이·로고 크기를 바꿔도 토글 위치를 손으로 고칠 필요가 없다**(이전 기록의 `top` 값 주의 사항은 해소).
- **상세 페이지 헤더**: `dist/privacy.html`·`dist/terms.html` 상단의 `← CIC 홈페이지` 링크를 지우고 사이트와 같은 헤더(로고 + 메뉴, 로고는 홈, 메뉴는 `./#about`·`./#guide`·`./#board`)를 넣었다. 스타일은 새 공용 파일 `dist/static-header.css`(`?v=1`)이며 사이트 헤더의 계산값(로고 88/72/58px, 패딩 `6px 5%`, 메뉴 14px/500, 상단 고정, 흰 배경·`#dce2e7` 테두리)을 그대로 옮긴 것이다. **사이트 헤더 CSS(`styles.css`)를 바꾸면 `static-header.css`도 함께 맞춘다.** 상세 페이지 헤더에는 언어 토글이 없다(페이지 자체가 한국어+영어 요약). `account-deletion.html`은 이동 안내 페이지라 헤더를 넣지 않았다.
- 검증: 폭 1200·800·375px에서 사이트 헤더와 상세 페이지 헤더의 높이(101/85/71px)·로고 위치·메뉴 위치·글꼴(`Noto Sans KR` 14px)이 같음을 DOM 값으로 확인했고, 토글이 헤더 아래 8px에 붙음을 헤더 71px·87px 모두에서 확인했다. 테스트 36개·JS 문법 통과. 실제 폰 기기는 확인하지 못했다. 버전: `styles.css?v=68-nav-font`, `app.js?v=60-header-follow`.
- 커밋 `70aa9d4`(`Match header menu font to guide category text; add shared header to policy pages`), Pages 실행 `35587220305` 성공. 공개 사이트 홈·`privacy.html`·`terms.html`·`static-header.css` HTTP 200, 새 CSS·JS 반영, 두 상세 페이지에 헤더가 있고 옛 링크가 없음을 확인했다.

## 2026-09-21 헤더 개편 배포 취소(되돌림)

- 사용자 요청("오늘 오전 9:03 헤더 개편 배포 내용 취소")에 따라 아래 "헤더 UI를 참조 이미지에 맞춰 개편"(커밋 `f1d5352`, 오전 9:02 커밋·배포, 9:03 문서 커밋 `4205a29`)을 `git revert`로 되돌렸다. 이력은 지우지 않았고 되돌림 커밋 `70624ff`(`Revert header redesign (restore header before f1d5352)`)를 `main`에 푸시했다.
- `git diff 1f45650 HEAD -- dist`가 비어 있어 `dist/`는 개편 직전(`1f45650`, 푸터 링크 스타일 변경 직후)과 완전히 같다. 즉 다시 **헤더에 로고와 메뉴만 있고 `한국어 / English` 토글은 헤더 아래 오른쪽에 고정된 플로팅 버튼**(`.language-float`, `top` 109/93/79px, `right:max(5%,calc(50% - 648px))`)이며, 헤더 여백 8px 이전 값(`padding-block:6px`)과 `styles.css?v=66-footer-text-style`이다. 서버(Apps Script)는 건드리지 않았다.
- 검증: 테스트 36개·JS 문법 통과, Pages 실행 `35585228652` 성공, 공개 사이트 HTTP 200에서 `class="language-float"` 마크업이 다시 있고 `header-right`는 없으며 `styles.css?v=66-footer-text-style`이 서빙되는 것을 확인했다.
- 아래 개편 기록은 **취소된 작업의 이력**이다. 참조 이미지(`reference/헤더이미지 예시화면.png`)를 다시 반영하려면 그 기록의 측정값(로고 이미지 72px, 토글 오른쪽 끝 정렬, 메뉴는 토글 아래, 헤더 높이 약 88px)과 CSS 블록을 참고하되, `f1d5352`를 다시 적용(`git revert 70624ff`)하면 된다. 그 이전 "언어 버튼 플로팅/상단 중앙/오른쪽 정렬" 기록은 이번 되돌림으로 다시 유효하다.

## (취소됨) 2026-09-21 헤더 UI를 참조 이미지에 맞춰 개편

- 사용자가 `reference/헤더이미지 예시화면.png`(566×88)를 참조해 헤더 UI를 수정하도록 요청했다. 참조 이미지를 픽셀로 측정한 값: 로고 눈에 보이는 원 높이 58px(이미지 여백을 감안하면 로고 이미지 72px), 왼쪽 여백 29px, 토글 알약 높이 약 35px(그림자 있음)이 오른쪽 끝(여백 33px)에 붙고 그 아래에 메뉴가 같은 오른쪽 끝으로 정렬, 헤더 높이 약 88px.
- **구조 변경(`dist/index.html`)**: `<header>` 안에 `<div class="header-right">`(위 `.language-toggle`, 아래 `<nav>`)를 두었다. 이전의 `.language-float`(헤더 아래 고정 위치 토글)는 없앴고 관련 CSS도 모두 삭제했다. 헤더가 sticky라 토글도 스크롤 중 항상 보인다. **바로 아래·이전 기록들의 "언어 버튼 플로팅/상단 중앙/오른쪽 정렬(`top` 109/93/79px, `right:max(5%,…)`)" 내용은 이 변경으로 대체됐다.**
- **CSS(`dist/styles.css` 끝의 `/* Header (see reference/...) */` 블록)**: `.site-header{padding-block:8px;align-items:center}`, `.header-right{margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:6px}`, `.header-right nav{margin:0;width:auto;justify-content:flex-end}`, `.header-right .language-toggle{background:#fff;box-shadow:0 8px 22px #142c4240}`, `.header-right nav a{padding:4px 0}`. 로고 이미지 크기는 기존 브레이크포인트(88px, 1100px 이하 72px, 480px 이하 58px)를 유지한다(58px로 줄이면 참조보다 작아진다). 앞선 변경의 푸터 아래 여백 88px은 그대로다. `styles.css?v=67-header-reference`.
- 측정(폭 566px): 헤더 높이 89px(참조 88px), 토글 y 11~46px(참조 12~47px), 메뉴 오른쪽 정렬·토글 아래, 오른쪽 여백 34px(참조 33px). 폭 1100·768·375·360px, 한국어·영어에서 렌더링 확인, 375/360px 영어 메뉴도 한 줄이며 토글과 겹치지 않는다. 현재 페이지 메뉴의 주황 밑줄은 유지했다(참조는 홈 화면이라 선택 항목이 없었다). 데스크톱(1100px 초과)은 참조가 없어 같은 구조를 적용했다. 실제 폰 기기는 확인하지 못했다. 테스트 36개·JS 문법 통과.
- 커밋 `f1d5352`(`Restyle header per reference: toggle above right-aligned menu`), Pages 실행 `35546395193` 성공. 공개 사이트 HTTP 200, `header-right` 마크업과 새 CSS 반영, `language-float` 잔존 없음을 확인했다.

## 2026-09-21 푸터 링크 글자 스타일을 저작권 문구에 맞춤

- 사용자 요청에 따라 푸터 링크(`개인정보처리방침`·`이용약관`·`로그인/로그아웃`)의 글자 스타일을 `© 2026 CIC. Chadwick International Culture protector` 문구와 같게 했다: 12px(`.75rem`), 두께 400, 줄 간격 `1.6`(19.2px), 색 `rgba(255,255,255,.38)`. 규칙은 `.site-footer .footer-links a,.site-footer .footer-links .footer-account{font-size:.75rem;line-height:1.6;color:rgba(255,255,255,.38)}`이고 호버 색(`#fff`)은 그대로다. 저작권 문구의 스타일(`.site-footer p` + `.footer-copyright` 색 `.38`)은 바꾸지 않았다.
- 같은 날 앞서 사용자가 반대 방향(저작권 문구를 링크 스타일 `.85`에 맞춤)을 요청해 만들었다가 배포 전에 되돌렸다. 이번 요청은 링크를 문구에 맞추는 방향이다. 링크가 흐려져 어두운 배경에서 잘 안 보이므로, 특히 `로그인`(계정 삭제 경로)이 눈에 덜 띈다는 점을 사용자에게 알렸다. 밝게 통일하려면 위 규칙의 색만 바꾸면 된다(문구도 함께 바꿀지는 별도 결정).
- 검증: Edge에서 폭 1100px(한국어)·400px(영어)로 렌더링해 저작권 문구와 링크 세 개의 계산된 스타일(글꼴 `Noto Sans KR`, 12px, 400, 색, 줄 간격 19.2px, 밑줄 없음)이 완전히 같음을 확인했다. `styles.css?v=66-footer-text-style`.
- 커밋 `9fa80b7`(`Give footer links the same text style as the copyright line`), Pages 실행 `35545718387` 성공, 공개 사이트 HTTP 200과 새 CSS 반영을 확인했다.

## 2026-09-21 푸터 계정 버튼: 로그인 상태에서 `로그아웃` 표시

- 사용자 요청에 따라 푸터 계정 버튼(`.footer-account`)의 라벨을 로그인 상태에 따라 바꾼다: 로그아웃 상태 `로그인`/`Sign in`, 로그인 상태 `로그아웃`/`Sign out`. `dist/app.js`의 `updateFooterAccount()`가 `data-label-ko`/`data-label-en`과 글자를 갱신하고, `route()` 시작과 세션 만료(`AUTH`/`BLOCKED`) 처리에서 호출한다. 로그인·로그아웃·회원 탈퇴·언어 전환은 모두 `route()`를 다시 부르므로 라벨이 따라 바뀐다. `i18n.js`의 `applyShell()`은 이 data 속성을 읽으므로 언어 전환 때 라벨이 덮어써지지 않는다.
- **동작(사용자가 확인하고 승인한 방식):** 로그인 상태에서 `로그아웃` 버튼을 눌러도 바로 로그아웃되지 않고 계정 창(`회원 B 님`)이 열린다. 창에 `로그아웃`과 `회원 탈퇴`가 있다. Play가 요구하는 앱 안 계정 삭제 경로가 이 창에 있기 때문이다. 즉시 로그아웃으로 바꾸려면 푸터에 `회원 탈퇴` 링크를 따로 두어야 한다.
- `privacy.html`의 계정 삭제 안내(한국어·영어)에 "로그인한 상태에서는 로그아웃 버튼"이라는 설명을 추가했다. `app.js?v=59-footer-logout`.
- 검증: 실제 `index.html`에 모의 API(`_mockapi.js`, 임시 파일이라 삭제함)만 끼워 Edge로 확인했다. 로그인 상태 `로그아웃`→영어 `Sign out`→한국어 `로그아웃`, 로그아웃 상태 `로그인`→`Sign in`→`로그인`, 계정 창 열림(`로그아웃`·`회원 탈퇴`), 로그아웃 후 `로그인` 복귀. 테스트 36개·JS 문법 통과. 실제 Google 로그인 계정에서의 확인은 하지 않았다.
- 커밋 `360eba0`(`Show 로그아웃 in footer when signed in`), Pages 실행 `35545218834` 성공. 공개 사이트 홈·`privacy.html` HTTP 200, 배포된 `app.js`에 `updateFooterAccount`와 두 언어 라벨, `privacy.html`에 로그아웃 안내 반영을 확인했다.

## 2026-09-21 푸터: 계정 삭제 안내를 개인정보처리방침에 통합, `로그인` 버튼 정리

- **계정 삭제 안내 통합**: `dist/privacy.html`에 `<h2 id="account-deletion">6. 계정 삭제 안내</h2>` 섹션(앱·홈페이지에서 삭제하는 3단계, 삭제·유지 정보 표, 접속 불가 시 이메일 요청)과 영어 요약 항목을 넣었다. 뒤 섹션은 7(안전성 확보)·8(문의)·9(방침의 변경)로 번호가 밀렸다. 푸터에서 `계정 삭제 안내` 링크를 뺐고, `terms.html`·`privacy.html`의 내부 링크는 `privacy.html#account-deletion`으로 바꿨다.
- **`dist/account-deletion.html`은 삭제하지 않고 이동 안내 페이지로 남겼다**(`meta refresh` → `./privacy.html#account-deletion`, 링크·영어 안내 포함). 앞선 기록과 이미 공유했을 수 있는 옛 URL을 살리기 위해서다. Play 콘솔의 계정 삭제 URL은 `https://cic23.github.io/privacy.html#account-deletion`을 쓴다(`store/listing.md` 갱신). 리다이렉트 페이지를 Play가 어떻게 취급하는지는 확인하지 못했으므로 콘솔에는 `#account-deletion` 주소를 직접 입력한다.
- **푸터 로그인 버튼**: `로그인 / 내 계정` → `로그인`(영어 `Sign in`). 다른 링크와 같은 스타일로 맞췄다: `.site-footer .footer-links a`의 규칙(`font-size:.75rem`=12px, `color:rgba(255,255,255,.85)`, 호버 `#fff`)에 `.footer-account`를 함께 묶었고 밑줄은 없다. 계산된 스타일이 한국어·영어에서 개인정보처리방침·이용약관과 동일함을 Edge로 확인했다. 번역은 `i18n.js` `applyShell()`이 `data-label-ko`/`data-label-en` 속성으로 라벨을 바꾼다(짧은 `로그인` 번역 키는 부분 문자열 치환 문제로 만들지 않았다). 로그인 상태에서도 버튼은 `로그인`으로 표시되고 눌러서 여는 계정 창에 로그아웃·회원 탈퇴가 있다(라벨이 상태에 따라 바뀌지는 않는다).
- **푸터 아래 여백**: 맨 아래로 스크롤하면 우측 하단 글쓰기 플로팅 버튼이 마지막 링크(`로그인`)를 가려서 `.site-footer{padding-bottom:88px}`를 추가했다.
- 버전: `styles.css?v=65-footer-login`, `i18n.js?v=36-footer-login`. 테스트 36개·JS 문법 통과.
- 검증 중 메모: 캡처용 iframe(폭 375px)은 세로 스크롤바가 폭을 15px 줄여 영어 메뉴가 두 줄로 보인다. 스크롤바를 뺀 실제 폭 375px에서는 세 항목이 한 줄이며 이전 배포 CSS와 결과가 같다. 폭 360px 이하 영어 메뉴는 줄바꿈될 수 있고 확인하지 않았다.
- 커밋 `6fd4a13`(`Merge account deletion guide into privacy policy and simplify footer login`), Pages 실행 `35544607054` 성공. 공개 사이트에서 홈·`privacy.html`·`terms.html`·`account-deletion.html` HTTP 200, 푸터가 `개인정보처리방침 · 이용약관 · 로그인`, `privacy.html#account-deletion` 섹션, 리다이렉트 URL, 새 파일 버전 반영을 확인했다.

## 2026-09-21 헤더 메뉴 글자 20% 확대

- 사용자 요청에 따라 헤더 메뉴(`CIC 소개 · 인천 문화유산 · 지킴이 로그`) 글자를 20% 키웠다: 기본 `.63rem`→`.756rem`(약 12.1px), 폭 1000px 이하 `.6125rem`→`.735rem`(약 11.8px). 변경은 `dist/styles.css`의 `.site-header nav a` 두 규칙이며 `styles.css?v=62-nav-size`.
- Edge에서 iframe으로 폭 1100·768·375px, 한국어·영어 모두 로고·메뉴 한 줄, 메뉴 오른쪽 정렬, 영어 메뉴도 줄바꿈 없이 들어가고 아래 플로팅 언어 버튼과 겹치지 않음을 확인했다. 320px처럼 아주 좁은 폭과 실제 폰은 확인하지 못했다. 메뉴 글자가 커져도 헤더 높이(로고 기준)는 그대로라 플로팅 언어 버튼 `top` 값(109/93/79px)은 바꾸지 않았다.
- 커밋 `3d8743d`(`Increase header menu font size by 20%`), Pages 실행 `35541658444` 성공, 공개 사이트 HTTP 200과 새 CSS 반영을 확인했다.

## 2026-09-20 Google Play 배포 준비 3차: 스토어 이미지·TWA 빌드 준비 (계획 5~7단계 중 가능한 부분)

**만든 것(커밋 `aa4ac3a`로 `main`에 푸시 완료, 사이트 배포 대상 아님):**
- `store/`: `icon-512.png`(512×512), `feature-graphic-1024x500.png`(대표 이미지: 네이비 배경 + 로고 + `CIC 지킴이` 문구, HTML을 Edge 헤드리스로 캡처), `screenshots/phone-1-home … phone-5-guide-detail.png`(1080×2160, 운영 사이트를 412×824 CSS px iframe으로 감싸 DSF 2.6213로 캡처 후 잘라냄. 헤드리스 Edge는 최소 창 너비 때문에 `--window-size=412,…`로는 폰 레이아웃이 안 나온다), `listing.md`(앱 이름·짧은/전체 설명 한·영, 카테고리 교육, URL, 데이터 보안 양식·타깃 연령·앱 액세스·비공개 테스트 안내 초안). 게시판 스크린샷은 실제 회원 글·이름이 보여 제외했다. `phone-4-values.png`에는 학생들이 뒷모습으로 나오므로 스토어 게시 전 초상권·학교 동의 확인이 필요하다.
- `twa/twa-manifest.json`: Bubblewrap 설정(패키지 `io.github.cic23.app`, 호스트 `cic23.github.io`, 이름 `CIC 지킴이`, 흰색 테마, 아이콘·maskable 아이콘 URL, 키스토어 `./android.keystore` alias `cic-upload`, 버전 1 / 1.0.0, `fingerprints` 빈 배열). `@bubblewrap/core` 1.25.0의 `TwaManifest.validate()`로 `OK`를 확인했다. Bubblewrap 템플릿 targetSdk는 36.
- `twa/README.md`: 키스토어 생성(`keytool`), `bubblewrap doctor/build/update`, Play 콘솔에서 SHA-256 받아 `fingerprints`에 넣고 `fingerprint generateAssetLinks`로 `dist/.well-known/assetlinks.json` 만들기, 검증 URL, 실기기 확인 목록, 출시 흐름. `README.md` 최상단에 이 준비 사항과 미해결 선행 조건을 짧게 기록했다. `.gitignore`에 `twa/*.aab`, `twa/*.apk` 추가.

**하지 않은 것(막힌 이유):**
- **AAB 빌드는 하지 못했다.** 이 PC에는 JDK·Android SDK가 없다. Bubblewrap CLI(1.25.0)는 첫 실행 때 JDK/SDK 자동 설치를 **대화형으로 묻기 때문에**(비대화형 실행은 `ERR_USE_AFTER_CLOSE`로 종료) 사용자가 터미널에서 직접 실행해야 한다(`! npx @bubblewrap/cli doctor` 등). 대안은 PWABuilder(웹).
- 업로드 키스토어 생성은 소유자만 할 수 있다(비밀번호를 채팅에 공유하지 않는다). `assetlinks.json`은 Play 앱 서명 키 SHA-256을 받은 뒤에 만든다(지금 만들면 잘못된 값이 공개된다).
- 개발자 계정 등록, 테스터 12명 모집(14일 연속), 콘솔 입력은 사용자 작업이다.

**Bubblewrap `doctor` 실행 시도(2026-09-20, 실패):** 질문에 `y`를 파이프로 넘겨 `npx @bubblewrap/cli@1.25.0 doctor`를 백그라운드로 실행했으나 9분 넘게 진행 없이 멈췄고 종료 코드 255로 실패했다. JDK·Android SDK는 설치되지 않았고, `~/.bubblewrap/config.json`에 경로가 빈 값(`{"jdkPath":"","androidSdkPath":""}`)으로만 기록돼 있어서 프로세스를 종료하고 이 폴더를 삭제했다(다음 실행은 처음부터 질문). 이 도구는 SDK 라이선스 동의까지 묻는 대화형이라 자동 응답으로 실행하지 않는다. **다음 진행:** 사용자가 이 세션에서 `! cd twa && npx @bubblewrap/cli doctor`로 직접 실행해 JDK 설치·SDK 설치·라이선스 질문에 답하고 결과를 알려 주거나, 대안으로 PWABuilder(웹)를 쓴다. 이후 `twa/README.md`의 키스토어 생성·`build` 순서로 진행한다.

**남은 위험:** Google 로그인 팝업이 TWA에서 동작하는지는 실기기로 확인해야 한다(안 되면 `ux_mode:'redirect'` 전환과 서버 `redirect_uri` 변경 필요). 데이터 보안·콘텐츠 등급 답변은 초안이므로 소유자가 최종 확인한다.

## 2026-09-20 Google Play 배포 준비 2차: 신고·회원 탈퇴·정책 페이지 (계획 3단계)

Play UGC·계정 삭제 정책 대응이다. 서버는 Apps Script **버전 19**(`Add content reports and account deletion`), 프런트는 커밋 `a9a3a03`(Pages 실행 `35511945608` 성공)로 배포했다. **배포 순서**: 서버 버전 19 → 사용자가 Apps Script 편집기에서 `setup` 실행(`준비 완료`, `Reports` 시트 생성) → 프런트. 순서가 반대면 신고·탈퇴가 `SETUP` 오류를 낸다. 새 OAuth 범위는 없다(`DriveApp`은 기존 `drive` 범위).

**서버(`apps-script/Code.gs`):**
- `TABLES_`에 `Reports` 추가. 액션: `reportContent`(승인 회원, 사유 `inappropriate|harassment|privacy|spam|other` + 선택 설명 300자, 본인 내용 신고 불가, 같은 회원의 같은 내용 미처리 신고는 `duplicate:true`로 흡수), `listReports`(관리자, 처리 대기 우선·최신순 200건, 이메일 미노출), `resolveReport`(관리자, `dismiss|remove`, 같은 내용의 미처리 신고 전체에 적용, `remove`는 게시글/댓글을 `deleted:true`로).
- `deleteMyAccount`(`{confirm:true}`, 관리자 불가): 이미 삭제한 본인 글과 그 글의 댓글은 완전 삭제, 남은 글·댓글은 `authorId:'deleted'`·`authorName:'탈퇴한 회원'`으로 익명화, 좋아요 삭제, 신고 기록의 신고자·작성자 이름 익명화, 글에 연결되지 않은 업로드 첨부는 행 삭제 + Drive 파일 휴지통(`trashDriveFile_`), 나머지 첨부 `ownerId:'deleted'`, 세션 삭제 후 `Members` 행 삭제. 같은 Google 계정으로 다시 로그인하면 새 회원으로 가입된다. 헬퍼 `removeWhere_(name,test)` 추가.
- 테스트: `tests/policy.test.cjs`(신고·처리·탈퇴 3개). 워크플로가 `tests/*.test.cjs`를 실행한다. 전체 36개 통과.

**프런트(`dist/`):**
- 게시글 하단과 댓글에 `신고하기` 버튼(본인 글·댓글에는 없음, 비로그인은 로그인 창), 신고 창(사유 5종+설명), 관리자 화면 `#reports`(`신고 관리`: 삭제 처리·반려·작성자 이용 제한, 게시판 상단 관리자 툴바에 링크). 짧은 번역 키(`기타`, `작성자` 등)는 부분 문자열 치환으로 다른 문장을 깨뜨리므로 쓰지 않고 `L(ko,en)`으로 언어를 분기한다.
- **로그인한 회원의 계정 창 진입점**: 이전 커밋 `da2a5ab`에서 헤더 로그인 버튼을 없앤 뒤로 로그인한 회원이 로그아웃·계정 창을 열 수 없었다. 푸터에 `로그인 / 내 계정` 버튼(`data-action="login"`)을 추가했다. 계정 창(로그인 상태)에 로그아웃과 `회원 탈퇴`(관리자 제외)가 있다. 탈퇴는 확인 창 → `deleteMyAccount` → 세션·캐시 정리 → 홈.
- 정적 페이지: `terms.html`(이용약관), `account-deletion.html`(앱 내 삭제 절차, 삭제·유지 표, 접속 불가 시 이메일 요청), `privacy.html`에 탈퇴 처리·신고 기록 보관 문구 추가. 푸터에 세 페이지 링크. Play 콘솔의 개인정보처리방침 URL은 `https://cic23.github.io/privacy.html`, 계정 삭제 URL은 `https://cic23.github.io/account-deletion.html`을 쓴다. 법적 문구(삭제 요청 이메일, 만 14세 미만 동의, 보유 기간)는 운영자 검토가 필요하다.
- 파일 버전: `app.js?v=58-policy`, `styles.css?v=61-policy`, `i18n.js?v=35-policy`.

**검증:** 모의 API로 실제 화면(신고 버튼·신고 창·`#reports`·계정 창·푸터) 렌더링, 클릭 시뮬레이션으로 `reportContent`(글·댓글), `deleteMyAccount`(→`#home`), `resolveReport`(→목록 갱신), 본인 댓글 신고 버튼 없음, 관리자 탈퇴 버튼 없음, 비로그인 신고 → 로그인 창(`challenge`) 확인, 영어 보기 번역 확인. 배포 후 공개 URL: 홈·`terms.html`·`account-deletion.html`·`privacy.html` HTTP 200, 배포된 `app.js`에 `deleteMyAccount`, 푸터 링크·버튼 마크업, 운영 `/exec`의 `listPosts` 정상, 비로그인 `reportContent`·`listReports`는 `AUTH`. **로그인한 실제 계정으로 신고·탈퇴를 실제로 눌러 보는 검증은 아직 하지 않았다**(운영 데이터를 건드리므로 테스트 계정으로 확인 필요, 특히 탈퇴는 되돌릴 수 없다).

**남은 것(계획 5~7단계, 사용자 작업 포함):** 개발자 계정 등록·테스터 12명 모집(사용자), 로고 기반 스토어 이미지·스크린샷 준비, TWA 빌드(Bubblewrap/PWABuilder, 키스토어는 커밋 금지), Play 앱 서명 키 SHA-256을 받은 뒤 `dist/.well-known/assetlinks.json` 작성, Play Console 등록·데이터 보안 양식·비공개 테스트 14일. 자세한 계획은 로컬 계획 파일 `C:\Users\NYK\.claude\plans\dynamic-tinkering-plum.md`와 바로 아래 1차 기록을 본다.

## 2026-09-20 Google Play(TWA) 배포 준비 1차: PWA화·워크플로 수정

**목표·결정(사용자 확정):** 개인 개발자 계정 / TWA(Trusted Web Activity) 패키징 / 전체 공개로 Google Play에 등록한다. 계획 전문은 `C:\Users\NYK\.claude\plans\dynamic-tinkering-plum.md`(로컬 계획 파일, 저장소에는 없음). 요약: 기본값은 대상 연령 16세 이상, 탈퇴 시 게시글 익명화, 패키지 ID `io.github.cic23.app`, 앱 이름 `CIC 지킴이`.

**이번에 배포한 것 (커밋 `ec00458`, Pages 실행 `35510367595` 성공):**
- `dist/manifest.webmanifest`(start_url·scope `/`, standalone, 테마·배경 흰색), `dist/assets/icons/`(192, 512, maskable 512, apple-touch 180, favicon 48 PNG; `cic-logo.jpeg`에서 여백을 잘라 생성), `dist/index.html`에 manifest·favicon·apple-touch-icon·`theme-color` 링크, `app.js?v=57-pwa`에 서비스 워커 등록.
- `dist/sw.js`: 같은 출처 GET만 네트워크 우선 + 캐시 폴백(`cic-shell-v1`, 최대 80개, 1MB 초과 이미지 미캐시). Apps Script POST·Google 로그인·Drive 업로드 등 교차 출처 요청은 가로채지 않는다. 오프라인이면 캐시된 앱 셸 또는 `dist/offline.html`을 보여 준다. 캐시 로직을 바꾸면 `CACHE` 이름 버전을 올린다.
- `.github/workflows/pages.yml`: `actions/upload-pages-artifact`를 v4→v5로 올리고 `include-hidden-files: true`를 추가했다(v4는 점 폴더를 제외해 `.well-known/`이 배포되지 않음. v5.0.0에 이 입력이 있음을 GitHub API로 확인). 검증 스텝에 `node --check dist/sw.js` 추가. 배포 후 `.nojekyll`이 HTTP 200으로 서빙되어 숨김 파일 포함이 동작함을 확인했다. `deploy-pages`는 v4 그대로다.
- `.gitignore`에 `*.jks`, `*.keystore`, `twa/build/`, `twa/app/` 추가(서명 키는 절대 커밋하지 않는다).
- 검증: 서버·통신 테스트 26개·JS 문법 통과, `sw.js` 캐시·오프라인 폴백 로직을 Node 모의 환경으로 검증, 공개 URL의 매니페스트(`application/manifest+json`)·아이콘 5종·`sw.js`·`offline.html` HTTP 200. **실제 Chrome에서의 서비스 워커 등록과 Lighthouse 설치 가능성 점검은 아직 하지 않았다.**

**남은 계획(단계 번호는 계획 파일 기준):**
- 3단계 정책 대응(미구현): `dist/terms.html`, `dist/account-deletion.html`, 게시글·댓글 **신고 기능**(`Code.gs`에 `reportContent`, 새 `Reports` 시트 → `setup` 재실행 후 서버 재배포), **회원 탈퇴**(`deleteMyAccount`, 게시글·댓글 익명화), `privacy.html` 갱신, 푸터 링크, 백엔드 테스트 추가. Play UGC·계정 삭제 정책상 승인 필수다.
- 5~7단계: TWA 빌드(Bubblewrap 또는 PWABuilder), Play Console 등록. `dist/.well-known/assetlinks.json`은 Play 콘솔의 **앱 서명 키 SHA-256**을 받은 뒤에 만든다(지금 만들면 잘못된 값이 공개되므로 아직 만들지 않았다).
- 사용자 작업: 만 18세 이상 소유자 명의로 개인 개발자 계정 등록(US$25, 신원 확인), 비공개 테스트 테스터 12명 이상(여유 15~20명)을 Gmail 주소로 모집해 14일 연속 참여. 새 개인 계정은 이 조건을 채워야 프로덕션 신청이 가능하다.
- 주의: 기존 사이트의 `SITE_ORIGIN`·OAuth 승인된 원본은 TWA에서도 `https://cic23.github.io` 그대로라 변경이 필요 없다. Google 로그인 팝업은 실제 Android 기기에서 확인이 필수다.

## 2026-09-20 언어 버튼 오른쪽 정렬

- 사용자 요청에 따라 헤더 아래 플로팅 `한국어 / English` 버튼(`.language-float`)을 중앙에서 **오른쪽 정렬**로 바꿨다. 오른쪽 끝을 헤더 메뉴의 오른쪽 끝에 맞추기 위해 `right:max(5%,calc(50% - 648px))`(헤더 좌우 여백 5%, 헤더 최대폭 1440px 기준)를 쓰고 `left:auto; transform:none`이다. 세로 위치(`top` 109/93/79px)는 그대로다. 헤더의 좌우 여백이나 최대폭(1440px)을 바꾸면 이 `right` 값도 함께 바꾼다. 바로 아래 기록의 중앙 정렬(`left:50%`)은 이 변경으로 대체됐다.
- 변경 파일 `dist/styles.css`, `dist/index.html`(`styles.css?v=60-language-right`). Edge에서 iframe으로 375·480·900·1600px과 한국어·영어에서 메뉴 오른쪽 끝과 정렬됨을 확인했다(1600px에서 약 5px 차이). 실제 폰 기기와 버튼 클릭 동작은 확인하지 못했다.
- 커밋 `ef043b4`(`Right-align language toggle below header`), Pages 실행 `35509513165` 성공, 공개 사이트 HTTP 200과 새 CSS 반영을 확인했다.

## 2026-09-20 언어 버튼을 헤더 아래 상단 중앙 플로팅으로 조정

- 사용자 요청에 따라 `한국어 / English` 플로팅 버튼(`.language-float`)을 헤더 안이 아니라 **헤더 바로 아래 페이지 상단 중앙**에 고정했다(`position:fixed; left:50%; transform:translateX(-50%); z-index:26`). 위치는 sticky 헤더 높이 + 8px로 계산한 `top` 값이다: 데스크톱 109px, 1100px 이하 93px, 480px 이하 79px. **헤더 높이(로고 88/72/58px + 상하 여백 6px×2 + 테두리 1px)를 바꾸면 이 값도 함께 바꿔야 한다.**
- 바로 아래 기록의 폰용 버튼 띠(`padding-top:42px`, `top:4px`)는 제거했다. 폰 헤더는 다시 로고+메뉴 한 줄(약 71px)이다. 헤더 상하 여백 6px 축소는 유지한다. 글쓰기 플로팅 버튼은 우측 하단 그대로다.
- 변경 파일 `dist/styles.css`(끝 규칙 블록), `dist/index.html`(`styles.css?v=59-language-below-header`). Edge에서 iframe으로 900·600·375px, 한국어·영어에서 헤더·글쓰기 버튼과 겹치지 않음을 확인했다. 플로팅이라 본문 위에 얹히며 폭 375px 홈에서는 첫 문구에 가깝게 붙는다. 실제 폰 기기와 버튼 클릭 동작은 확인하지 못했다.
- 커밋 `9ef5615`(`Place language toggle below header at top center`), Pages 실행 `35509253791` 성공, 공개 사이트 HTTP 200과 새 CSS 반영을 확인했다.

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
