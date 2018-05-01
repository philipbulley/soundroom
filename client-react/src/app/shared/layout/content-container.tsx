import { css } from 'styled-components';
import media from './media';

export const contentContainer = css`
	margin: 0 10px;
	min-width: 300px;

	${media.medium`
    margin: 0 40px;
  `} ${media.large`
    margin: 0 80px;
  `};
`;
