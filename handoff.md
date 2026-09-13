# CIC 홈페이지 인수인계

최종 업데이트: 2026-09-13

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
