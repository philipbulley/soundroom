import { PlaylistTracks } from './playlist-tracks';
import { PlaylistTracksActions } from './playlist-track-action-types';

const defaultState: PlaylistTracks = {
	tracks: {},
	loading: false
};

export function playlistTracksReducer(
	state: PlaylistTracks = defaultState,
	action: PlaylistTracksActions
): PlaylistTracks {
	// switch (action.type) {
	// case PlaylistTracksActionType.LOAD:
	//   return playlistTracksLoadCommand(state);
	// case PlaylistTracksActionType.LOAD_SUCCESS:
	//   return playlistTracksLoadSuccessCommand(state, action.payload);
	// case PlaylistTracksActionType.LOAD_ERROR:
	//   return playlistTracksLoadErrorCommand(state, action.payload);
	// default:
	return state;
	// }
}
