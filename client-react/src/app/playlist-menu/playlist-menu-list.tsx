import media from '../shared/layout/media';
import styled from 'styled-components';

export const PlaylistMenuUl = styled.ul`
	display: flex;
	flex-wrap: wrap;
	padding: 0;
	list-style-type: none;
`;
PlaylistMenuUl.displayName = 'PlaylistMenuUl';

export const PlaylistMenuLi = styled.li`
	width: 100%;
	height: 420px;
	padding: 2px;
	font-size: 16px;

	${media.medium`
    width: 50%;
  `} ${media.large`
    width: 33.333%;
  `};
`;
PlaylistMenuLi.displayName = 'PlaylistMenuLi';
