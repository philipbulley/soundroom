import { css, ThemedCssFunction } from 'styled-components';

const breakpoints = {
  small: 375,
  medium: 768,
  large: 1024,
  xlarge: 1440,
};

// Iterate through the breakpoints and create a media template
const media: Partial<Media> = Object.keys(breakpoints)
  .reduce((acc, label) => {
    acc[label] = (...args: any[]) => css`
      @media (max-width: ${breakpoints[label] / 16}em) {
        ${css.apply({}, args)}   // Need TypeScript 2.4! https://github.com/Microsoft/TypeScript/issues/5296
      }
    `;

    return acc;
  }, {});

interface Media {
  small:  ThemedCssFunction<any>;
  medium: ThemedCssFunction<any>;
  large: ThemedCssFunction<any>;
  xlarge: ThemedCssFunction<any>;
}

export default media as Media;
