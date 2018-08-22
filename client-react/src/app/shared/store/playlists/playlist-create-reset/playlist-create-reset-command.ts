import { Playlists } from '../playlists';
import { generate } from 'shortid';

export function playlistCreateResetCommand(state: Playlists) {
	state = { ...state };
	state.playlistCreate = { ...state.playlistCreate };

	state.playlistCreate.loading = false;
	state.playlistCreate.iterationId = generate();
	delete state.playlistCreate.successfullyCreatedId;
	delete state.playlistCreate.error;

	return state;
}
