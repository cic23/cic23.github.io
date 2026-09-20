# CIC Android 앱 (TWA) 빌드 가이드

`https://cic23.github.io/`를 Trusted Web Activity로 감싸 Google Play에 올리는 준비 자료입니다. 사이트가 곧 앱 화면이므로 앱을 다시 올릴 일은 아이콘·이름·패키지 설정·targetSdk 변경 때뿐입니다.

## 파일
- `twa-manifest.json`: Bubblewrap 설정. `@bubblewrap/core` 1.25.0의 `TwaManifest.validate()`로 유효성을 확인했습니다.
  - 패키지 `io.github.cic23.app`, 호스트 `cic23.github.io`, 앱 이름 `CIC 지킴이`, 흰색 테마, 아이콘·maskable 아이콘은 배포된 사이트의 URL, 서명 키 `./android.keystore`(alias `cic-upload`), 버전 `1` / `1.0.0`.
  - `fingerprints`는 **비어 있음**: Play 콘솔의 앱 서명 키 SHA-256을 받은 뒤 채웁니다.
- 생성물(`android.keystore`, `app/`, `build/`, `*.aab`, `*.apk`)은 `.gitignore`로 커밋 대상에서 제외됩니다. **키스토어와 비밀번호는 절대 커밋·채팅 공유 금지**입니다.

## 필요한 것 (현재 이 PC에는 없음)
- Node.js(있음, v24), JDK 17, Android SDK. Bubblewrap이 **첫 실행 때 JDK와 Android SDK를 대화형 질문으로 자동 설치**(약 수백 MB~1GB)할 수 있습니다. 설치 질문에 답해야 하므로 터미널에서 직접 실행하세요. (Claude Code에서는 `! npx ...`처럼 `!`를 앞에 붙이면 이 세션에서 직접 실행됩니다.)
- 대안: JDK/SDK 설치가 부담되면 [PWABuilder](https://www.pwabuilder.com/)에 `https://cic23.github.io/`를 넣어 Android 패키지(AAB)를 받을 수 있습니다. 이때는 `twa-manifest.json` 대신 그 화면의 값을 위 표와 같게 입력하세요.

## 1. 업로드 키스토어 만들기 (한 번만, 소유자 본인이)
```
cd twa
keytool -genkeypair -v -keystore android.keystore -alias cic-upload -keyalg RSA -keysize 2048 -validity 10000
```
- `keytool`은 JDK에 포함되어 있습니다(Bubblewrap이 설치한 JDK는 `~/.bubblewrap/jdk` 아래).
- 키스토어 비밀번호와 키 비밀번호를 정해 **오프라인(비밀번호 관리자, 안전한 USB)에 백업**하세요. 이 키를 잃으면 Play에서 업로드 키 재설정을 요청해야 합니다.
- Play App Signing(권장)을 쓰면 실제 배포 서명은 Google이 관리하고, 이 키는 업로드 인증용입니다.

## 2. 빌드
```
cd twa
npx @bubblewrap/cli doctor          # JDK/SDK 상태 점검 (첫 실행 시 자동 설치 질문)
npx @bubblewrap/cli build           # twa-manifest.json을 읽어 AAB 생성 (비밀번호 입력)
```
- 결과: `twa/app-release-bundle.aab`(Play 업로드용), `twa/app-release-signed.apk`(기기 설치 테스트용).
- 기기 설치 테스트: `adb install app-release-signed.apk`(개발자 옵션의 USB 디버깅) 또는 APK를 옮겨 설치.
- `twa-manifest.json`을 고쳤다면 `npx @bubblewrap/cli update` 후 `build`.
- 버전을 올릴 때는 `appVersionCode`(정수, 매번 +1)와 `appVersion`을 함께 수정합니다.
- targetSdk는 Bubblewrap 템플릿이 정합니다(1.25.0 기준 36). Play 요구 API 레벨은 매년 오르므로, 업로드 시 콘솔 경고가 나오면 Bubblewrap을 최신으로 올려 다시 빌드하세요.

## 3. Play Console 업로드와 서명 키 지문
1. Play Console에서 앱을 만들고 **내부 테스트 → 새 버전 만들기**에 `app-release-bundle.aab`를 올립니다. Play App Signing에 등록합니다.
2. 콘솔 **앱 무결성 → 앱 서명 → 앱 서명 키 인증서**의 **SHA-256 인증서 지문**을 복사합니다(업로드 키 인증서 지문도 함께 확인).
3. 두 지문을 `twa-manifest.json`의 `fingerprints`에 추가합니다.
   ```
   "fingerprints": [
     { "name": "Play app signing key", "value": "AA:BB:...:FF" },
     { "name": "Upload key", "value": "11:22:...:99" }
   ]
   ```
   또는 CLI: `npx @bubblewrap/cli fingerprint add <SHA-256>`.
4. `assetlinks.json` 생성: `npx @bubblewrap/cli fingerprint generateAssetLinks` → 만들어진 파일을 **`dist/.well-known/assetlinks.json`**으로 옮깁니다(패키지 이름은 `io.github.cic23.app`이어야 합니다).
5. GitHub Pages에 배포한 뒤 확인합니다.
   - `https://cic23.github.io/.well-known/assetlinks.json`이 HTTP 200, JSON으로 열려야 합니다. (워크플로가 `include-hidden-files: true`로 `.well-known`을 배포합니다.)
   - Google 검증 API: `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://cic23.github.io&relation=delegate_permission/common.handle_all_urls`
6. 지문이 맞지 않으면 앱이 **전체 화면이 아니라 주소창이 보이는 모드**로 열립니다. 설치한 앱에서 주소창이 보이면 지문과 패키지 이름을 다시 확인하세요.

## 4. 실기기 확인 목록 (내부 테스트 설치 후)
- 주소창 없이 전체 화면으로 열림(assetlinks 인증 성공).
- **Google 로그인 팝업**이 열리고 로그인 후 앱으로 돌아와 세션이 유지됨. 이 부분은 실제 Android 기기에서 반드시 확인해야 합니다. 팝업이 막히거나 로그인 결과를 못 받으면 로그인 방식을 `ux_mode:'redirect'`로 바꿔야 할 수 있습니다.
- 글쓰기, 사진·동영상 첨부(파일 선택), 댓글, 좋아요, 신고, 언어 전환, 공유, 회원 탈퇴.
- 뒤로가기 동작, 비행기 모드에서 오프라인 안내 화면.
- 앱 아이콘(maskable) 모양, 스플래시, 상태바 색.

## 5. 출시 흐름
내부 테스트 → **비공개 테스트**(테스터 12명 이상, 14일 연속 참여) → 프로덕션 액세스 신청 → 프로덕션 출시. 스토어 등록 문구와 정책 답변 초안은 `store/listing.md`를 보세요.
