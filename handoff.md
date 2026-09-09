# CIC 홈페이지 인수인계

최종 업데이트: 2026-09-09

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
- `node --test tests/backend.test.cjs tests/transport.test.cjs`의 16개 테스트와 `dist/*.js` 문법 검사를 통과했다.

## 주요 파일

| 경로 | 역할 |
| --- | --- |
| `dist/` | GitHub Pages로 공개할 홈페이지 정적 파일 |
| `dist/config.js` | 공개 가능한 Apps Script URL과 Google OAuth 클라이언트 ID 설정 |
| `apps-script/Code.gs` | 회원 승인, 게시글, 댓글, 세션을 처리하는 Apps Script 서버 |
| `apps-script/appsscript.json` | Apps Script 실행 환경 및 권한 |
| `tests/` | 백엔드와 iframe 통신 회귀 테스트 |
| `.github/workflows/pages.yml` | `main` 브랜치 푸시 시 Pages 배포 workflow |
| `reference/` | 검증된 원본 내보내기와 참고 자료. `.gitignore`로 제외됨 |

## Google 연결 정보

- clasp 로그인 계정: `415hyunwoo@gmail.com`
- Apps Script 프로젝트 ID: `1oSjOc7M2BLoBRdsLGuTP-G3ezkkElgvZjVjQFbQAnWJvF7dt-BS5qJSV`
- 연결된 Google Sheet ID: `1K7aCP9zi886kKqpK3WAz2ctBiIlJ6IKI0AuIE2gSnKM`
- `.clasp.json`은 로컬 연결 파일이므로 Git에 올리지 않는다.

## 다음 세션 작업

1. 최초 관리자 계정으로 PC·모바일 실사용 검증을 마친다. Google 로그인 팝업·동의, 관리자 자동 등록, 일반 계정 승인 대기, 승인 후 게시글·댓글 작성, 로그아웃을 확인한다. 오류 시 Apps Script 실행 로그와 브라우저 콘솔만 확인하며 secret·세션·회원 데이터는 공유하거나 Git에 기록하지 않는다.
2. `https://soribook.github.io/soribook`를 직접 확인한 뒤 확인 가능한 범위만 참고한다. 접근 불가 또는 미확인 내용을 추정해 구현하지 않는다.
3. 현재 정적 CIC 콘텐츠의 영문 버전과 모든 페이지/섹션에 유지되는 공통 한/영 토글을 구현한다. 언어 선택은 페이지 이동 뒤에도 유지하고, 접근성 이름·키보드 조작·모바일 UI를 포함한다.
4. 한국어 원문·이미지·디자인을 보존한다. 영문 전환 시 내비게이션·버튼·제목·본문·안내 문구가 일관되게 바뀌는지 검증한다. 게시글·댓글 원문은 자동 번역하지 않으며 LLM 기반 게시판 번역은 별도 후속 단계다.
5. 변경 뒤 필수 테스트와 `dist/*.js` 문법 검사를 실행하고, Pages 배포 후 실제 HTTP 응답과 한/영 전환을 확인한다.

## 검증 체크리스트

- 비로그인 사용자는 공개 문화유산 가이드만 볼 수 있다.
- 일반 Google 계정은 가입 후 승인 대기 상태가 된다.
- 관리자가 승인한 회원만 게시글과 댓글을 읽고 쓸 수 있다.
- 작성자와 관리자만 게시글·댓글을 수정하거나 삭제할 수 있다.
- 관리자가 차단한 계정은 기존 세션도 즉시 사용할 수 없다.
- PC와 모바일에서 Google 로그인 팝업, 글·댓글 작성, 로그아웃을 확인한다.

## 주의 사항

- `dist/config.js`에는 공개 가능한 값만 넣는다. OAuth client secret, 관리자 목록, Sheets 데이터는 넣지 않는다.
- 실제 Google 로그인에 사용할 OAuth 클라이언트는 clasp의 Google 제공 OAuth 클라이언트와 별도로 만든다.
- `dist/config.js`에는 공개 가능한 Client ID와 운영 `/exec` URL만 둔다. OAuth client secret, 관리자 목록, Sheets 데이터는 넣지 않는다.
