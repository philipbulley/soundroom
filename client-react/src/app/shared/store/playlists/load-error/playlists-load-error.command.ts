import { Playlists } from '../playlists';
import { ErrorResult } from '../../../error/error-result';

export const playlistsLoadErrorCommand = (state: Playlists, payload: ErrorResult): Playlists => {
	state = { ...state };

	state.loading = false;
	state.error = payload;

	return state;
};
