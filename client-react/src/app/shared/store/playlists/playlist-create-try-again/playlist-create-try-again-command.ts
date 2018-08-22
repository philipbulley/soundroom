import { Playlists } from '../playlists';

export function playlistCreateTryAgainCommand(state: Playlists) {
	state = { ...state };
	state.playlistCreate = { ...state.playlistCreate };

	delete state.playlistCreate.error;

	return state;
}
