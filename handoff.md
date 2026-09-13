# CIC 홈페이지 인수인계

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
