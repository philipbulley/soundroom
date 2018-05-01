import styled from 'styled-components';
import colors from '../../shared/colors/colors';
import Button from '../../shared/button/button';

const PlaylistMenuItemCloseButton = styled(Button)`
	position: absolute;
	right: 30px;
	display: inline-block;
	float: right;
	padding: 3px;

	font-size: 16px;
	font-weight: bold;
	color: ${colors.greyDust};

	&:hover {
		color: ${colors.greyGrime};
	}

	// TODO: Add is-delete-confirm functionality
`;

export default PlaylistMenuItemCloseButton;
