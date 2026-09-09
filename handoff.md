# CIC 홈페이지 인수인계

최종 업데이트: 2026-09-09 (이번 세션)

## 인수인계 문서 원칙

- 이 문서는 다음 세션이 바로 작업을 재개할 수 있도록 현재 상태, 결정 사항, 다음 작업만 기록한다.
- **200줄 이하를 유지**한다. 세부 절차는 `README.md`에 두고, 완료·중복된 설명은 정리한다.

## 목적

- ChatGPT Sites에서 만든 CIC 홈페이지 배포 버전 2를 `https://cic23.github.io/`로 이전한다.
- Google Sheets를 데이터 저장소로, Google Apps Script를 회원·게시판 서버로 사용한다.
- LLM 자동 번역 기능은 다음 단계에서 추가한다.

## 이번 세션 완료

- 원본 내보내기 `reference/CIC_deployed_v2_source.zip`의 CRC와 273개 SHA-256을 검증했다. 원본 배포 버전은 2, 원본 커밋은 `2f9ad4c7a5b857e4ab513ab00c2b8b58bc896c67`이다.
- 정적 사이트와 GitHub Pages workflow를 `main`에 배포했다. `https://cic23.github.io/` 및 주요 자산은 HTTP 200으로 확인했다.
- `clasp` 활성 계정 `415hyunwoo@gmail.com`을 확인하고 Apps Script 서버 코드·매니페스트를 푸시했다.
- CIC 전용 웹 OAuth 클라이언트와 5개 스크립트 속성 설정을 완료했다. 비밀값은 이 문서와 Git에 기록하지 않는다.
- 사용자가 `setup`을 실행해 `Members`, `Posts`, `Comments`, `Sessions` 시트를 초기화했다.
- 새 Apps Script 웹 앱 배포 버전 2를 만들었다. 새 `/exec` 엔드포인트는 GET·POST 모두 HTTP 200으로 확인했다.
- 공개 Client ID와 새 `/exec` URL을 `dist/config.js`에 반영하고 Pages에 배포했다. 커밋은 `39b689c`이며 작업 트리는 `main...origin/main`으로 동기화되어 있다.
- GitHub Pages Source를 브랜치 기반 legacy 배포에서 **GitHub Actions**로 전환했다. README/Jekyll 기본 배포가 `dist/` 아티팩트를 덮어쓰던 문제를 해소했고, 루트가 CIC 첫 화면을 제공하는 것을 PC·모바일 브라우저에서 확인했다.
- Google의 이메일 검증 계정은 첫 로그인 시 자동 승인되도록 Apps Script 웹 앱 버전 3에 배포했다. 차단 계정은 계속 차단되며, 기존 `pending` 회원도 다음 로그인 시 승인된다.
- 로그인 세션은 같은 탭의 `sessionStorage`에 저장하고, 새로고침 시 `me` 요청으로 복원하도록 했다. 탭/브라우저 종료 또는 서버 세션 6시간 만료 시에는 재로그인이 필요하다.
- 사용자 노출 명칭을 `회원 게시판`에서 **지킴이 로그**로 변경했다. 관리자 화면은 `회원 관리`로 유지한다.
- `reference/CIC_Korean_English_website.zip`의 영문 원고와 전환 자료를 반영했다. `content.en.js`, `i18n.js`, 상단 고정바와 한국어/English 토글을 추가했으며, URL `?lang=en`과 브라우저 저장으로 언어 선택을 유지한다. 게시글·댓글·회원 이름은 번역하지 않는다.
- 최신 Pages 배포 커밋은 `55d519a`이며, 배포 workflow와 루트·영문 URL·`i18n.js`의 HTTP 200을 확인했다. 총 22개 테스트 및 `dist/*.js` 문법 검사를 통과했다.

## 주요 파일

| 경로 | 역할 |
| --- | --- |
| `dist/` | GitHub Pages로 공개할 홈페이지 정적 파일 |
| `dist/config.js` | 공개 가능한 Apps Script URL과 Google OAuth 클라이언트 ID 설정 |
| `apps-script/Code.gs` | 자동 승인(검증된 Google 계정), 차단, 게시글, 댓글, 세션을 처리하는 Apps Script 서버 |
| `apps-script/appsscript.json` | Apps Script 실행 환경 및 권한 |
| `tests/` | 백엔드·iframe 통신·언어 전환 회귀 테스트 |
| `.github/workflows/pages.yml` | `main` 브랜치 푸시 시 Pages 배포 workflow |
| `reference/` | 검증된 원본 내보내기와 참고 자료. `.gitignore`로 제외됨 |

## Google 연결 정보

- clasp 로그인 계정: `415hyunwoo@gmail.com`
- Apps Script 프로젝트 ID: `1oSjOc7M2BLoBRdsLGuTP-G3ezkkElgvZjVjQFbQAnWJvF7dt-BS5qJSV`
- 연결된 Google Sheet ID: `1K7aCP9zi886kKqpK3WAz2ctBiIlJ6IKI0AuIE2gSnKM`
- `.clasp.json`은 로컬 연결 파일이므로 Git에 올리지 않는다.

## 다음 세션 작업

1. 최초 관리자 계정과 다른 일반 Google 계정으로 PC·모바일 실사용 검증을 마친다. 일반 계정 자동 승인, 새로고침 뒤 로그인 복원, 지킴이 로그 글·댓글 작성, 로그아웃, 이용 제한 후 기존 세션 거부를 확인한다. 오류 시 Apps Script 실행 로그와 브라우저 콘솔만 확인하며 secret·세션·회원 데이터는 공유하거나 Git에 기록하지 않는다.
2. `https://soribook.github.io/soribook`를 직접 확인한 뒤 확인 가능한 범위만 참고한다. 접근 불가 또는 미확인 내용을 추정해 구현하지 않는다.
3. PC·모바일에서 한국어/English 토글을 실제로 검증한다. 깊은 링크(`?lang=en#guide/wolmi`), 페이지 이동·새로고침 뒤 언어 유지, 로그인 상태·작성 중 댓글 초안 보존, 이미지/CSS/JS 요청 오류를 확인한다.
4. 영문 원고의 고유 기관·행사명 표기가 공식 명칭과 일치하는지 검토한다. 한국어 원문·이미지·디자인을 보존하며, 게시글·댓글 원문 자동 번역과 LLM 기반 번역은 별도 단계로 남긴다.

## 검증 체크리스트

- 비로그인 사용자는 공개 문화유산 가이드만 볼 수 있다.
- 이메일이 검증된 일반 Google 계정은 로그인 시 자동 승인되어 지킴이 로그를 이용할 수 있다.
- 새로고침 뒤 동일 탭의 로그인 상태가 서버 검증을 거쳐 복원된다.
- `?lang=en`과 토글에서 영문 콘텐츠·UI가 일관되게 표시되고, 게시글·댓글 원문은 유지된다.
- 작성자와 관리자만 게시글·댓글을 수정하거나 삭제할 수 있다.
- 관리자가 차단한 계정은 기존 세션도 즉시 사용할 수 없다.
- PC와 모바일에서 Google 로그인 팝업, 글·댓글 작성, 로그아웃을 확인한다.

## 주의 사항

- `dist/config.js`에는 공개 가능한 값만 넣는다. OAuth client secret, 관리자 목록, Sheets 데이터는 넣지 않는다.
- 실제 Google 로그인에 사용할 OAuth 클라이언트는 clasp의 Google 제공 OAuth 클라이언트와 별도로 만든다.
- `dist/config.js`에는 공개 가능한 Client ID와 운영 `/exec` URL만 둔다. OAuth client secret, 관리자 목록, Sheets 데이터는 넣지 않는다.
