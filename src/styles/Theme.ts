import { css, type DefaultTheme } from 'styled-components';

const colors = {
  white: '#FBFBFB',
  black: '#000000',

  border: '#E5E4E7',

  lightgrey: '#CCCCCC',
  grey: '#6F6F6F',

  overlay: 'rgba(10, 10, 12, 0.55)',
  preloaderBg: '#0B0B0C',
  preloaderText: '#F5F4EF',
};

const fonts = {
  Title01: css`
    font-family:
      'neue-haas-grotesk-text',
      'Pretendard Variable',
      Pretendard,
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      'Helvetica Neue',
      'Segoe UI',
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      'Malgun Gothic',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      sans-serif;
    font-style: normal;
    font-weight: 700;
    font-variation-settings: 'wght' 750;

    font-size: 2.8rem;
    letter-spacing: -0.02em;

    font-style: normal;
  `,
  Title02: css`
    font-family:
      'neue-haas-grotesk-text',
      'Pretendard Variable',
      Pretendard,
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      'Helvetica Neue',
      'Segoe UI',
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      'Malgun Gothic',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      sans-serif;
    font-style: normal;
    font-weight: 700;
    font-variation-settings: 'wght' 750;

    font-size: 2.4rem;
    letter-spacing: -0.02em;

    font-style: normal;
  `,
  Text01: css`
    font-family: 'neue-haas-grotesk-text', 'Pretendard Variable', Pretendard, sans-serif;

    font-weight: 700;
    font-variation-settings: 'wght' 750;

    font-size: 1.4rem;
    letter-spacing: -0.02em;
    line-height: 1.65;
    font-style: normal;
  `,
  Text02: css`
    font-family: 'neue-haas-grotesk-text', 'Pretendard Variable', Pretendard, sans-serif;

    font-weight: 700;
    font-variation-settings: 'wght' 750;
    font-style: italic;

    font-size: 1.6rem;
    letter-spacing: -0.02em;
    line-height: 1.65;
  `,
};

// stylelint's media-query-no-invalid rule rejects interpolated @media params,
// so the 767px breakpoint below must stay a literal in every styled component.
const theme: DefaultTheme = {
  colors,
  fonts,
};

export default theme;
