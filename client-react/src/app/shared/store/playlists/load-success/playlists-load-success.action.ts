import { PlaylistsActionType } from '../playlists-action-type';
import { Playlist } from '../../../model/playlist';

export const playlistsLoadSuccessAction = (
	payload: Playlist[]
): PlaylistsLoadSuccessAction => ({
	type: PlaylistsActionType.LOAD_SUCCESS,
	payload
});

export interface PlaylistsLoadSuccessAction {
	type: PlaylistsActionType.LOAD_SUCCESS;
	payload: Playlist[];
}
