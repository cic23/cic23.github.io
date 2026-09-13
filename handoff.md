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
- 게시물에는 이미지·동영상을 최대 5개, 파일당 100MB까지 첨부할 수 있다. 파일은 설정된 비공개 Google Drive 폴더에 저장하고 게시물에 연결된 파일만 공개한다. Apps Script 배포 버전 4와 GitHub Pages 배포를 확인했다.
- 지킴이 로그 목록의 글쓰기를 우측 하단 주황색 플로팅 버튼으로 변경했다. 비로그인 사용자가 누르면 Google 로그인 창을 연다.
- 게시물 수정 화면에서도 기존 첨부를 유지한 채 사진·동영상을 추가할 수 있고, 기존 첨부는 항목별로 삭제할 수 있다. 총 첨부 수는 새 파일을 합산해 최대 5개로 제한한다.
- 홈페이지 하단에 CIC 색상(네이비·주황) 기반 Contact 영역을 추가했다. School, Email, Instagram, YouTube 카드를 제공하며 Email·Instagram·YouTube는 카드 전체가 링크다.
- 문의 주소를 `e3kim2027@chadwickschool.org`로 통일했고 footer는 저작권 표기만 남겼다.
- 하단 UI 변경 전 `node --test tests/backend.test.cjs tests/transport.test.cjs`와 `dist/*.js` 문법 검사를 실행한다. 배포 후 공개 URL의 HTTP 200과 변경 마크업을 확인한다.

## 다음 할 일

1. **게시판 상세 튜닝:** 게시물 상세의 미디어 갤러리·좋아요·댓글 흐름, 가독성 및 모바일 레이아웃을 검토·개선한다. 회원명·게시글·댓글 원문은 번역하거나 변경하지 않는다.
2. 일반 Google 계정과 관리자 계정으로 로그인·자동 승인·세션 복원·글/댓글 작성·차단을 PC와 모바일에서 실사용 검증한다.
3. 한국어/영어 전환, 깊은 링크, 이미지·CSS·JS 오류를 다시 확인한다.
