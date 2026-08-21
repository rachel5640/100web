import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      white: string;
      black: string;

      border: string;
      lightgrey: string;
      grey: string;

      overlay: string;
      preloaderBg: string;
      preloaderText: string;
    };

    fonts: {
      Title01: SerializedStyles;
      Title02: SerializedStyles;
      Text01: SerializedStyles;
      Text02: SerializedStyles;
    };
  }
}
