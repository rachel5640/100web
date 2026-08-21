import { createGlobalStyle, css } from 'styled-components';

export const reset = css`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  button,
  video {
    margin: 0;
    border: 0;
    padding: 0;
    vertical-align: baseline;

    font-size: 62.5%;
    -webkit-font-smoothing: antialiased;
  }

  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  section {
    display: block;
  }

  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
    display: none;
  }

  body {
    line-height: 1;
    word-break: keep-all;
  }

  menu,
  ol,
  ul {
    list-style: none;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote::before,
  blockquote::after,
  q::before,
  q::after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  button {
    border: none;

    background: transparent;

    cursor: pointer;
  }
`;
const GlobalStyle = createGlobalStyle`
${reset}

/* 'neue-haas-grotesk-text'는 한글 글리프가 없어 한글은 Pretendard 계열로 폴백되는데,
   두 폰트의 어센트 비율이 달라 같은 줄에서 영문이 한글보다 살짝 떠 보인다.
   같은 family 이름으로 재선언해 어센트만 낮춰 기준선을 맞춘다. */
@font-face {
  font-family: 'neue-haas-grotesk-text';
  src: local('neue-haas-grotesk-text');
  ascent-override: 90%;
  font-display: swap;
}

#root, body, html {
    margin: 0 auto;

    -ms-overflow-style: none; /* 인터넷 익스플로러 */
    scrollbar-width: none; /* 파이어폭스 */
    -webkit-scrollbar: none;
}

#root::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 오페라, 엣지 */

}

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
    ::selection {

    }
}

* {
    box-sizing: border-box;
}

a{
  text-decoration: none;
}

 /* 사파리 웹 뷰 브라우저 상속 스타일 제거 */
input, textarea,button {
    appearance: none;
    border-radius: 0;
}`;

export default GlobalStyle;
