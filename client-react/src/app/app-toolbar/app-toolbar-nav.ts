import { contentContainer } from '../shared/layout/content-container';
import styled from 'styled-components';

export const AppToolbarNav = styled.nav`
	display: flex;
	${contentContainer} .main {
		flex: 2 1 auto;
	}

	.meta {
		flex: 1 1 auto;
		text-align: right;
	}
`;
