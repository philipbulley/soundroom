import { Playlists } from '../playlists';
import { Playlist } from '../../../model/playlist';

export const playlistCreateSuccessCommand = (state: Playlists, playlist: Playlist): Playlists => {
	state = { ...state };
	state.playlistCreate = { ...state.playlistCreate };

	state.playlistCreate.loading = false;
	state.playlistCreate.successfullyCreatedId = playlist._id;
	state.items = [...state.items, playlist];

	return state;
};
