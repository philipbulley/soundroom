import * as React from 'react';
import './../../../index.css';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs/react';
import { Confirmation } from './confirmation';
import { PlaylistCreate } from '../../shared/store/playlists/playlists';
import { action } from '@storybook/addon-actions';
import PlaylistCreateStyled, { Step } from './playlist-create.styled';
import { PlaylistMenuLi, PlaylistMenuUl } from '../playlist-menu-list';
import { ErrorType } from '../../shared/error/error-type';

const PLAYLIST_CREATE_LOADING: PlaylistCreate = {
	loading: true,
	iterationId: 'dummy-iteration-id'
};

const PLAYLIST_CREATE_SUCCESS: PlaylistCreate = {
	loading: false,
	successfullyCreatedId: 'dummy-uuid',
	iterationId: 'dummy-iteration-id'
};

const PLAYLIST_CREATE_ERROR: PlaylistCreate = {
	loading: false,
	iterationId: 'dummy-iteration-id',
	error: {
		status: 401,
		message: 'Unauthorized',
		type: ErrorType.UNAUTHORIZED
	}
};

const viewStates = {
	loading: PLAYLIST_CREATE_LOADING,
	success: PLAYLIST_CREATE_SUCCESS,
	error: PLAYLIST_CREATE_ERROR
};

const options = {
	loading: 'loading',
	success: 'success',
	error: 'error'
};

function getPlaylistCreate() {
	return viewStates[select('View State', options, options.loading)];
}

storiesOf('Playlist Create', module)
	.addDecorator(withKnobs)
	.addDecorator(story => (
		<PlaylistMenuUl>
			<PlaylistMenuLi>
				<PlaylistCreateStyled>
					<Step num={0} className="debug--step">
						{story()}
					</Step>
				</PlaylistCreateStyled>
			</PlaylistMenuLi>
		</PlaylistMenuUl>
	))
	.addWithInfo(
		'Confirmation',
		'Confirmation panel of Playlist Create including knobs to demonstrate its transitions',
		() => (
			<Confirmation
				playlistCreate={getPlaylistCreate()}
				onGoBack={action('onGoBack')}
			/>
		)
	);
