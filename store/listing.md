# Google Play 스토어 등록 자료 (초안)

콘솔에 그대로 붙여 넣을 수 있게 정리한 초안입니다. **개발자 계정 소유자가 내용을 확인한 뒤** 사용하세요. 정책 답변(데이터 보안, 콘텐츠 등급, 타깃 연령)은 실제 동작과 일치해야 하며, 어긋나면 심사에서 거절됩니다.

## 기본 정보

| 항목 | 값 |
| --- | --- |
| 앱 이름 (30자 이내) | CIC 지킴이 |
| 패키지 이름 | `io.github.cic23.app` (등록 후 변경 불가) |
| 기본 언어 | 한국어 (ko-KR), 영어(en-US)는 아래 영어 설명을 추가 번역으로 등록 |
| 앱/게임 | 앱 |
| 무료/유료 | 무료 |
| 카테고리 | 교육 |
| 개발자 연락처 이메일 | 학교 주소(`e3kim2027@chadwickschool.org`)는 졸업 시 바뀌므로 **졸업 후에도 받을 수 있는 주소 권장** |
| 웹사이트 | `https://cic23.github.io/` |
| 개인정보처리방침 URL | `https://cic23.github.io/privacy.html` |
| 계정 삭제 URL (데이터 보안 양식) | `https://cic23.github.io/privacy.html#account-deletion` (기존 `account-deletion.html`은 이 주소로 자동 이동) |
| 광고 포함 여부 | 아니요 |
| 앱 내 구매 | 없음 |

## 짧은 설명 (80자 이내, 47자)

인천 문화유산을 걷고 읽고 기록하는 청소년 국가유산지킴이 CIC의 가이드와 활동 기록

## 전체 설명 (4000자 이내)

채드윅송도국제학교 청소년 국가유산지킴이 CIC가 만든 인천 문화유산 이야기 앱입니다.

■ 인천 문화유산 가이드
인천상륙작전기념관·자유공원, 월미도·월미공원, 인천 개항장 거리 등 청소년의 시선으로 직접 걷고 조사한 탐방 이야기를 사진과 함께 소개합니다. 지킴이의 추천 팁과 탐방 에티켓으로 미래 세대를 위한 문화유산 탐방을 도와드립니다.

■ CIC 소개와 다섯 가지 가치
존중, 책임감, 정직, 공정, 배려. CIC가 함께 쌓아 온 활동과 수상 기록, 현장에서 실천한 다섯 가지 가치를 만나 보세요.

■ 지킴이 로그
회원들이 문화유산 활동을 사진과 글로 기록하는 게시판입니다. 누구나 글을 읽을 수 있고, Google 계정으로 로그인하면 글쓰기·댓글·좋아요를 이용할 수 있습니다.
- 부적절한 게시글과 댓글은 신고할 수 있으며, 운영진이 확인해 조치합니다.
- 앱 안에서 언제든 회원 탈퇴를 할 수 있습니다.

■ 한국어·영어 지원
화면의 언어 버튼으로 한국어와 영어를 바꿔 볼 수 있습니다. (회원이 쓴 글과 댓글은 원문 그대로 표시됩니다.)

문의: 아래 개발자 연락처로 보내 주세요.

### English (en-US) short description (80 chars)

Explore Incheon's heritage: guides and activity logs by youth heritage guardians CIC

### English (en-US) full description

CIC Guardians is the app of the student-led Youth National Heritage Guardians club (CIC) at Chadwick International School.

- Incheon heritage guide: walking stories with photos about the Incheon Landing Operation Memorial Hall and Freedom Park, Wolmido and Wolmi Park, and the Incheon Open Port district, with tips and heritage-visiting etiquette.
- About CIC and our five values: respect, responsibility, honesty, fairness and compassion, with the club's activities and awards.
- Guardian Log: a board where members record their heritage activities with photos and text. Anyone can read; signing in with Google lets you post, comment and like. You can report inappropriate posts and comments, and delete your account in the app at any time.
- Korean and English: switch languages with the language button. Member posts and comments are shown in their original language.

## 그래픽 자산

| 용도 | 파일 | 규격 |
| --- | --- | --- |
| 앱 아이콘 | `store/icon-512.png` | 512×512 PNG |
| 대표 이미지 | `store/feature-graphic-1024x500.png` | 1024×500 PNG |
| 휴대전화 스크린샷 (2장 이상) | `store/screenshots/phone-*.png` | 1080×2160 PNG (비율 2:1) |

스크린샷은 운영 사이트를 폰 폭(412×824)으로 캡처한 홈, 인천 문화유산 가이드, CIC 소개, 다섯 가지 가치, 가이드 상세 화면입니다. 게시판 화면에는 실제 회원 글과 이름이 보이므로 넣지 않았습니다. `phone-4-values.png`에는 활동 사진 속 학생들이 뒷모습으로 나옵니다. 스토어에 올려도 되는지(초상권·학교 동의) 확인해 주세요. 기능·언어 버튼이 일부 화면 위에 겹쳐 보이는 것은 실제 화면 그대로입니다.

## 콘솔 정책 항목 답변 초안

### 타깃 연령 및 콘텐츠
- 대상 연령: **16–17세, 18세 이상**만 선택 (13세 미만·아동 대상 앱 아님). 개인정보처리방침은 만 14세 미만에 보호자 동의를 요구하므로, 더 어린 연령을 넣으려면 방침과 함께 다시 검토해야 합니다.
- 콘텐츠 등급(IARC) 설문: 사용자 생성 콘텐츠(게시글·댓글·사진·동영상) **있음**, 사용자 간 상호작용 **있음**, 폭력·성적 콘텐츠·도박·약물 등은 앱이 제공하지 않음(사용자 콘텐츠는 이용약관으로 금지하고 신고·삭제 수단 제공).
- 사용자 생성 콘텐츠 정책 근거: 이용약관 `https://cic23.github.io/terms.html`, 신고하기 버튼, 관리자 삭제·이용 제한.

### 데이터 보안 양식 (초안)
| 데이터 유형 | 수집 | 공유 | 목적 | 비고 |
| --- | --- | --- | --- | --- |
| 개인 정보 > 이름 | 예 | 아니요 | 앱 기능, 계정 관리 | Google 계정 이름, 글·댓글 작성자로 표시 |
| 개인 정보 > 이메일 주소 | 예 | 아니요 | 계정 관리 | 관리자만 확인, 공개하지 않음 |
| 개인 정보 > 사용자 ID | 예 | 아니요 | 계정 관리 | Google 계정 식별자 |
| 사진 및 동영상 | 예 | 아니요 | 앱 기능 | 글에 첨부한 사진·동영상, 게시글에 공개 |
| 앱 활동 > 기타 사용자 생성 콘텐츠 | 예 | 아니요 | 앱 기능 | 게시글·댓글·좋아요·신고 |

- 전송 중 암호화: **예** (HTTPS).
- 사용자가 데이터 삭제를 요청할 수 있음: **예** — 앱 안 `회원 탈퇴`와 계정 삭제 URL.
- 필수 여부: 로그인 정보는 글쓰기·댓글에만 필요(선택 기능). 게시판 읽기와 가이드는 로그인 없이 이용.
- 서버(Google Apps Script/Sheets/Drive)는 서비스 제공자로 처리하며 광고·마케팅 목적으로 제3자에게 제공하지 않으므로 "공유 안 함"으로 답변하되, 콘솔 안내 문구와 방침이 일치하는지 소유자가 최종 확인하세요.

### 앱 액세스 (심사자 안내)
- 가이드·CIC 소개·게시판 읽기는 **로그인 없이** 전 기능을 볼 수 있습니다.
- 글쓰기·댓글·신고·회원 탈퇴는 Google 계정 로그인이 필요합니다(별도 가입 절차 없이 Google 계정으로 즉시 승인). 심사자가 본인의 Google 계정으로 로그인해 확인할 수 있으므로 별도의 테스트 계정 제공이 필요한지는 콘솔 질문에 따라 소유자가 정하세요(테스트 계정 비밀번호를 문서에 남기지 마세요).

### 비공개 테스트 (신규 개인 계정)
- 테스터 12명 이상이 14일 연속 참여해야 프로덕션 신청 가능(Gmail 등 Google 계정 이메일 목록 또는 Google 그룹).
- 테스터에게 안내할 것: 설치 링크, "앱을 14일 동안 삭제하지 않고 가끔 열어 주세요", 피드백 방법.
