import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      white: string;
    };

    fonts: {
      Title01: SerializedStyles;
      Title02: SerializedStyles;
    };
  }
}
