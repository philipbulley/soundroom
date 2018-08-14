import { Playlists } from '../playlists';
import { Playlist } from '../../../model/playlist';

export const playlistsLoadSuccessCommand = (state: Playlists, playlistsItems: Playlist[]): Playlists => {
	state = { ...state };

	state.loading = false;
	state.items = playlistsItems;

	return state;
};
