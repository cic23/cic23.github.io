# CIC 홈페이지

## 로컬 연결 상태 (2026-09-09)

- 대상 저장소: https://github.com/cic23/cic23.github.io (로컬 연결 완료).
- clasp 계정: `415hyunwoo@gmail.com`.
- 생성한 데이터베이스: https://drive.google.com/open?id=1K7aCP9zi886kKqpK3WAz2ctBiIlJ6IKI0AuIE2gSnKM (`Members`, `Posts`, `Comments`, `Sessions` 초기화 완료).
- Apps Script: https://script.google.com/d/1oSjOc7M2BLoBRdsLGuTP-G3ezkkElgvZjVjQFbQAnWJvF7dt-BS5qJSV/edit
- 새 원본 `reference/CIC_deployed_v2_source.zip` (10,700,808바이트)은 CRC 검사와 273개 파일의 SHA-256 검사를 통과했습니다. 내보내기 기록의 배포 버전은 2이며 원본 커밋은 `2f9ad4c7a5b857e4ab513ab00c2b8b58bc896c67`입니다. 기록된 원본 18개 파일의 크기와 해시도 모두 일치합니다.
- HTML·CSS·JavaScript·이미지와 테스트를 작업 폴더에 반영했습니다. 원본의 디자인과 문구를 유지하며, `reference/`는 Git에서 제외합니다.
- 현재 작업 폴더에서 테스트 22개와 `dist/*.js` 문법 검사를 통과했습니다. 실제 공개 홈페이지, 영문 URL, 번역 스크립트, Apps Script GET·POST 응답도 HTTP 200으로 확인했습니다.
- GitHub Pages는 GitHub Actions로 `main` 브랜치의 `dist/`를 배포하며, 홈페이지는 https://cic23.github.io/ 에 공개되어 있습니다.
- 운영 설정은 `SPREADSHEET_ID`에 위 데이터베이스 ID, `SITE_ORIGIN`에 `https://cic23.github.io`를 사용합니다. CIC용 웹 OAuth 클라이언트와 관리자 이메일은 Script Properties에만 보관합니다. clasp 자체의 Google 제공 OAuth 클라이언트는 홈페이지 로그인에 사용하지 않습니다.
- 현재 운영 Apps Script 웹앱 URL은 `https://script.google.com/macros/s/AKfycbza76ryDmCily3xLq79WX_TPNtdmpgMGfZc3ge_0WsyNobObKrleJ0L-Iy1-69nwJ7_hw/exec`입니다. 배포 버전은 3이며, `/exec`의 GET·POST 응답을 확인했습니다.
- 향후 LLM 자동 번역은 별도 단계이며 현재 연결하지 않았습니다.

제공받은 8페이지 발간 원고를 반영한 한국어 반응형 홈페이지입니다. GitHub Pages에서 화면을 제공하고 Google Apps Script가 회원·게시글·댓글을 Google Sheets에 저장합니다. 정적 파일만 제공하는 검토본에서는 회원 서비스를 준비 중이라고 표시합니다. 가짜 로그인이나 샘플 회원 데이터를 사용하지 않습니다.

## 구현 내용

- CIC 소개, 발간사, 활동 기록, 다섯 가지 핵심가치, 인천 문화유산 3개 코스, 탐방 에티켓, 학생 소감 영역.
- 검증된 Google 계정으로 로그인하면 자동 승인되어 회원 전용 게시판에 접근.
- 승인된 회원만 글·댓글을 읽고 작성. 작성자와 관리자만 수정·삭제. 공지 작성은 관리자만 가능.
- 관리자 회원 목록과 이용 제한. 제한 시 기존 로그인도 즉시 해제.
- 제목·내용 길이 제한, 수정 충돌 방지, 중복 제출 방지, 세션 만료, 서버 권한 검사.
- 설정된 출처로만 결과를 보내는 POST/iframe 통신. Apps Script의 CORS 응답 헤더에 의존하지 않음.
- 공개 화면과 회원 데이터 분리. Google Sheets와 회원 목록은 GitHub에 공개하지 않음.

## 현재 상태

홈페이지와 서버 코드, GitHub Pages 및 Apps Script 운영 배포를 완료했습니다. 서버 인증·권한·게시판·통신·언어 전환 검사 22개와 공개 HTTP 응답을 확인했습니다. Google 로그인 팝업, 일반 회원의 실제 글·댓글 작성, PC·모바일 브라우저별 세션 복원은 해당 Google 계정으로 수행하는 최종 수동 점검이 남아 있습니다.

사용자 PC의 `D:\CIC`와 메시지의 `file:///C:\Users\NYK\...\clip_image002.png`는 이 작업 환경에서 읽을 수 없었습니다. 원본 파일을 읽거나 수정했다고 가정하지 않습니다. 기존 폴더를 덮어쓰지 말고 새 하위 폴더에서 먼저 확인하세요.

## 파일 구성

| 위치 | 용도 |
| --- | --- |
| `dist/index.html`, `styles.css`, `app.js` | 홈페이지 화면과 게시판 UI |
| `dist/content.js` | 제공 원고를 정리한 공개 콘텐츠 |
| `dist/config.js` | 공개 가능한 웹앱 URL·OAuth 클라이언트 ID·사진 경로 |
| `dist/api.js` | POST/iframe 서버 통신 |
| `dist/assets/` | 이미지와 CIC 마크 저장 위치 |
| `apps-script/Code.gs` | Google Apps Script 서버 |
| `apps-script/appsscript.json` | Apps Script 실행 환경·권한 |
| `.github/workflows/pages.yml` | GitHub Pages 자동 배포 |
| `tests/*.test.cjs` | 서버 인증·권한·게시판 및 통신 응답 회귀 테스트 |
| `CONTENT_REVIEW.md` | 원고·사진 확인 목록 |

## 1. GitHub 저장소 준비

1. GitHub에서 사용할 저장소를 새로 만들거나 기존 CIC 저장소를 선택합니다. 저장소 이름은 예를 들어 `CIC`로 정할 수 있습니다.
2. 이 폴더의 파일을 저장소 루트에 올립니다. `dist`, `apps-script`, `tests`, `.github`가 루트 바로 아래에 있어야 합니다. `.env`, Google client secret, 회원 목록, 개인 인증 파일은 올리지 않습니다.
3. 저장소의 **Settings → Pages → Build and deployment → Source → GitHub Actions**를 선택합니다.
4. `main` 브랜치에 올리거나 **Actions → Publish CIC to GitHub Pages → Run workflow**를 실행합니다.
5. GitHub가 표시하는 실제 주소를 확인합니다. `donbkim` 계정에 `CIC` 저장소를 만든 경우 예상 형식은 `https://donbkim.github.io/CIC/`입니다. 이 주소는 예시이며 현재 배포된 주소가 아닙니다.

GitHub Pages로 공개되는 파일은 `dist` 폴더뿐입니다. 다른 기본 브랜치를 사용한다면 workflow의 `branches: [main]`을 변경하세요. GitHub 요금제에 따른 공개/비공개 저장소 Pages 지원 여부도 계정에서 확인하세요.

## 2. Google Sheet와 Apps Script 준비

1. 운영할 Google 계정으로 새 Google 스프레드시트를 만듭니다. 제목 예: `CIC 지킴이 로그 데이터`.
2. 주소의 `/d/`와 `/edit` 사이 값을 복사합니다. 이것이 `SPREADSHEET_ID`입니다. 시트는 관리자만 접근하도록 유지합니다.
3. 스프레드시트에서 **확장 프로그램 → Apps Script**를 엽니다.
4. `Code.gs` 내용을 이 프로젝트의 `apps-script/Code.gs` 내용으로 바꿉니다.
5. Apps Script의 **프로젝트 설정 → 편집기에 appsscript.json 매니페스트 파일 표시**를 켜고 `apps-script/appsscript.json` 내용을 반영합니다.

## 3. Google 로그인 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 CIC용 프로젝트를 선택하거나 만듭니다.
2. **Google Auth Platform**에서 앱 이름, 지원 이메일, 대상 사용자를 설정합니다. 서로 다른 Google 계정을 받을 경우 외부 사용자 설정이 필요합니다. 학교 조직 정책에 따라 관리자의 허용이 필요할 수 있습니다.
3. 필요한 범위는 `openid`, `email`, `profile`입니다. 홈페이지 방문자에게 Drive 또는 Sheets 접근 권한을 요청하지 않습니다.
4. **클라이언트 → 클라이언트 만들기 → 웹 애플리케이션**을 선택합니다.
5. **승인된 JavaScript 원본**에 실제 홈페이지의 출처를 추가합니다. 예: `https://donbkim.github.io`. `/CIC/` 경로는 넣지 않습니다.
6. 클라이언트 ID와 클라이언트 보안 비밀을 확인합니다. 보안 비밀은 아래 Apps Script 속성에만 저장하고 채팅이나 GitHub에 붙여넣지 않습니다.
7. 테스트 상태인 OAuth 앱은 이용할 계정을 테스트 사용자에 추가합니다. 실제 회원에게 공개하기 전에는 Google Auth Platform의 게시 상태와 앱 정보 요구사항을 확인합니다.

Google Identity Services의 팝업 authorization code 모델을 사용합니다. 서버에서 인증 코드를 Google 토큰으로 교환하고, Google userinfo에서 계정 식별자와 검증된 이메일을 확인합니다. 팝업 모드의 코드 교환 `redirect_uri`는 홈페이지 **출처**입니다. 브라우저가 보내는 이메일·권한 값은 인증 근거로 사용하지 않습니다.

## 4. Apps Script 속성 설정과 서버 배포

Apps Script **프로젝트 설정 → 스크립트 속성**에 다음을 넣습니다.

| 속성 | 값 |
| --- | --- |
| `SPREADSHEET_ID` | 2단계의 시트 ID |
| `GOOGLE_CLIENT_ID` | 웹 OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google 클라이언트 보안 비밀; 서버에만 저장 |
| `SITE_ORIGIN` | 예: `https://donbkim.github.io` — 경로와 마지막 `/` 없이 |
| `ADMIN_EMAILS` | 관리자 Google 이메일, 여러 명은 쉼표로 구분 |

1. 편집기로 돌아와 함수 목록에서 `setup`을 선택하고 **실행**합니다. 소유자 계정으로 Sheets 및 외부 요청 권한을 허용합니다.
2. `Members`, `Posts`, `Comments`, `Sessions` 시트가 만들어집니다. 각 시트는 `id`, `data_json` 두 열을 사용합니다. 회원 상태 변경은 홈페이지 관리자 메뉴에서 진행합니다.
3. **배포 → 새 배포 → 유형: 웹 앱**을 선택합니다.
4. **실행 사용자: 나**, **액세스 권한: 모든 사용자(Anyone)**를 선택합니다. 서버 입구는 열려 있지만 실제 데이터는 자체 인증·회원 승인 검사로 보호됩니다. `Google 계정이 있는 모든 사용자`와 혼동하지 마세요. 이 옵션이 없으면 학교/조직의 웹앱 외부 공개 정책을 확인해야 합니다.
5. 배포 후 `/exec`로 끝나는 웹앱 URL을 복사합니다. 개발용 `/dev` 주소를 사용하지 않습니다.
6. 서버 코드를 수정할 때는 **배포 관리 → 수정 → 새 버전 → 배포**를 진행합니다.

## 5. 홈페이지 연결

`dist/config.js`에서 다음 두 값을 입력하고 GitHub에 반영합니다.

```javascript
apiUrl: 'https://script.google.com/macros/s/실제_배포_ID/exec',
googleClientId: '실제_클라이언트_ID.apps.googleusercontent.com',
```

첫 로그인은 `ADMIN_EMAILS`에 지정한 Google 계정으로 합니다. 이 계정은 관리자 및 승인된 회원으로 등록됩니다. 이메일이 검증된 다른 Google 계정도 처음 로그인할 때 자동 승인됩니다. 관리자는 **지킴이 로그 → 회원 관리**에서 회원을 확인하고 필요한 계정을 이용 제한할 수 있습니다.

현재 로그인 세션은 같은 브라우저 탭의 `sessionStorage`에 보관하므로 새로고침 뒤에도 복원됩니다. 탭이나 브라우저를 닫으면 다시 로그인해야 합니다. 서버 세션은 6시간 후 만료되고, 로그아웃 또는 이용 제한으로 폐기됩니다. 게시글·댓글 자체는 Google Sheets에 보관됩니다.

## 6. 실제 계정으로 확인할 항목

1. 비로그인 상태: 공개 가이드는 열리고 지킴이 로그는 볼 수 없어야 합니다.
2. 일반 Google 계정 로그인: 자동 승인되어 회원 글·댓글을 읽고 쓸 수 있어야 합니다.
3. 새로고침 뒤 로그인 상태가 복원되고 글·댓글 작성 및 새 조회가 유지되는지 확인합니다.
4. 서로 다른 두 회원: 상대방의 글·댓글 수정·삭제가 거절되어야 합니다.
5. 관리자 이용 제한: 해당 회원의 기존 세션으로 다시 접근해도 거절되어야 합니다.
6. PC Chrome과 스마트폰 브라우저에서 Google 팝업, 로그인, 글 작성, 댓글, 로그아웃을 확인합니다.
7. 서버 응답이 지연될 때: 중복 클릭하지 말고 목록을 먼저 확인합니다. 같은 작성 화면에서 재시도할 때는 중복 생성 방지 ID를 재사용합니다.

모의 테스트는 실제 Google 서비스와 브라우저 통신을 검증하지 않습니다. 실제 설정 없이는 1~7 전체 통과를 주장할 수 없습니다.

## 7. 사진과 원고 반영

`dist/assets`에 파일을 넣고 `dist/config.js`의 `assets`를 설정합니다. 파일 경로는 예를 들어 `./assets/cic-logo.png`, `./assets/group-memorial.jpg`로 입력합니다.

- `logo`: 제공된 CIC 로고(`./assets/cic-logo.jpeg`)를 상단·하단·게시판 안내에 사용. 원본 이미지의 비율과 색상을 유지합니다.
- `group`: 인천상륙작전기념관 단체사진. 미설정이면 출처가 표시된 인천항 과거 사진 사용.
- `activities`: `plogging`, `fundraising`, `media`, `flashmob`, `exchange`, `appointment`, `docent`, `awards`, `respect`, `responsibility`, `honesty`, `fairness`, `compassion`, `memory`, `wolmi`, `openport` 키로 사진 지정.

창립 연도·단원 수·봉사시간은 `dist/content.js`의 null 값을 확인된 숫자로 바꿉니다. 학생 소감은 `reflections`의 빈 `text`를 실제 소감으로 채웁니다. 내용이 빈 학생은 이름·학년이 화면에 출력되지 않습니다. 사진과 소감은 게시 가능한 실제 자료를 사용합니다.

이 홈페이지는 8페이지 인쇄용 책자 파일은 아닙니다. Page 1과 8은 첫 화면/푸터, Page 2는 소개, Page 3~4는 핵심가치, Page 5~6은 가이드, Page 7은 에티켓/소감에 반영했습니다.

## 운영 범위와 제한

소규모 클럽용 구현입니다. Sheets 전체 행을 읽어 처리하므로 대규모 트래픽용 데이터베이스는 아닙니다. Google Apps Script 실행 시간·동시 실행·외부 요청 할당량의 영향을 받습니다. 악의적인 대량 요청을 차단하는 별도의 인프라는 포함하지 않았습니다. 삭제는 화면에서 숨기는 방식이며, 보관 데이터를 영구 삭제하려면 관리자가 관련 행을 정리해야 합니다. 정기적으로 시트 백업을 권장합니다.

`node --test tests/*.test.cjs`로 로컬 테스트를 실행할 수 있습니다. 별도 npm 패키지 설치가 필요하지 않습니다.

## 공식 구현 참고

- [Google Identity Services: Use Code Model](https://developers.google.com/identity/oauth2/web/guides/use-code-model)
- [Apps Script HTML iframe sandbox](https://developers.google.com/apps-script/migration/iframe)
- [Apps Script XFrameOptionsMode](https://developers.google.com/apps-script/reference/html/x-frame-options-mode)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

사진: [Port of Incheon — Davidinkorea / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Port_of_Incheon.jpg), Public domain, 2006년 등록. 현재 풍경이나 CIC 활동 사진으로 표시하지 않습니다.
