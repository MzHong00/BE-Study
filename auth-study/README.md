# Authentication을 위한 공부 자료

## `cookie`

클라이언트에 쿠키를 생성해주는 코드

## `session`

file-store 방식으로 세션을 저장하는 코드, 세션을 통하여 다른 url로 진입시 로그인 유지

## `jwt`

accessToken, refreshToken을 생성 후, 이를 사용하여 로그인과 로그아웃을 하는 코드. 교육용이므로 DB는 하드코딩.

## `passport`

passport의 로컬 전략 코드로, 오직 passport만을 이해하기 위해 잡다한 것들을 다 뺌 ex\) DB, dcrypt(패스워드 암호화 라이브러리)


## `google-oauth`

google-oauth-library를 사용하였으며, passport는 사용하지 않은 코드이다.
index.js 파일은 공식문서의 코드를 express로 변경한 것이고, copy.js 파일은 index.js를 쉽고 친근한 코드로 변경시킨 것이다.
이 프로젝트만으로는 실행이 안되며, 구글 API 페이지(https://console.cloud.google.com/apis)에서 다양한 설정을 추가적으로 해줘야 한다.
