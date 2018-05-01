import { Playlists } from '../playlists';
import { ErrorResult } from '../../../error/error-result';

export const playlistCreateErrorCommand = (
	state: Playlists,
	payload: ErrorResult
): Playlists => {
	state = { ...state };
	state.playlistCreate = { ...state.playlistCreate };

	state.playlistCreate.loading = false;
	state.playlistCreate.error = payload;

	return state;
};
