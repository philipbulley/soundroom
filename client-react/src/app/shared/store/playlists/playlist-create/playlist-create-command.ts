import { Playlists } from '../playlists';
import { PlaylistCreateParams } from './playlist-create.action';

export function playlistCreateCommand(state: Playlists, params: PlaylistCreateParams) {
	state = { ...state };
	state.playlistCreate = { ...state.playlistCreate };

	state.playlistCreate.loading = true;
	delete state.playlistCreate.successfullyCreatedId;
	delete state.playlistCreate.error;

	return state;
}
