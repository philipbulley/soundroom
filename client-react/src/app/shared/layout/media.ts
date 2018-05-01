import { css, ThemedCssFunction } from 'styled-components';

const breakpoints = {
	small: 375,
	medium: 768,
	large: 1024,
	xlarge: 1440
};

// Iterate through the breakpoints and create a media template
const media: Partial<Media> = Object.keys(breakpoints).reduce((acc, label) => {
	acc[label] = (...args: any[]) => css`
		@media (min-width: ${breakpoints[label] / 16}em) {
			// Ideally we'd use: css(...args)
			// But...         https://github.com/Microsoft/TypeScript/issues/5296
			// And...         https://github.com/Microsoft/TypeScript/issues/19419
			// Ultimately...  https://github.com/Microsoft/TypeScript/issues/4130

			// So... Workaround
			${css.apply({}, args)};
		}
	`;

	return acc;
}, {});

interface Media {
	small: ThemedCssFunction<any>;
	medium: ThemedCssFunction<any>;
	large: ThemedCssFunction<any>;
	xlarge: ThemedCssFunction<any>;
}

export default media as Media;
