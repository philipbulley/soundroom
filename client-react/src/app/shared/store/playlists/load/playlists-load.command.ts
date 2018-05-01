import { Playlists } from '../playlists';

export const playlistsLoadCommand = (state: Playlists): Playlists => {
	state = { ...state };

	state.loading = true;
	delete state.error;

	return state;
};
