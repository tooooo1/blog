/*
  keepBackground: false 유지. true는 라이트에서 --shiki-light-bg: #fff를 넣어
  흰 페이지 위 명도비 1.00을 재현하고, 애초에 맨 ``` 펜스에는 닿지도 않는다.
  코드블록 표면은 app/globals.css의 `pre` 규칙이 준다.

  테마 교체: github-light의 #e36209(variable)는 순백 위에서 이미 3.49로 AA 미달이라
  표면이 생기면 더 내려간다. high-contrast는 표면(#f3f4f6) 위에서 최악 토큰 4.58,
  github-dark-default는 5.17로 둘 다 AA를 지킨다.
*/
export const prettyCodeOptions = {
  theme: { light: "github-light-high-contrast", dark: "github-dark-default" },
  keepBackground: false,
};
