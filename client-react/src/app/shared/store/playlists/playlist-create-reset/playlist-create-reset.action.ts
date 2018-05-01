import { PlaylistsActionType } from '../playlists-action-type';

export const playlistCreateResetAction = (): PlaylistCreateResetAction => ({
	type: PlaylistsActionType.PLAYLIST_CREATE_RESET
});

export interface PlaylistCreateResetAction {
	type: PlaylistsActionType.PLAYLIST_CREATE_RESET;
}
