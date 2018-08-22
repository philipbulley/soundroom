import { PlaylistsActionType } from '../playlists-action-type';

export const playlistCreateTryAgainAction = (): PlaylistCreateTryAgainAction => ({
	type: PlaylistsActionType.PLAYLIST_CREATE_TRY_AGAIN
});

export interface PlaylistCreateTryAgainAction {
	type: PlaylistsActionType.PLAYLIST_CREATE_TRY_AGAIN;
}
