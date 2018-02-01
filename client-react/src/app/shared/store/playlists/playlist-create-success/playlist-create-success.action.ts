import { PlaylistsActionType } from '../playlists-action-type';
import { Playlist } from '../../../model/playlist';

export const playlistCreateSuccessAction =
  (payload: Playlist): PlaylistCreateSuccessAction => ({
    type: PlaylistsActionType.PLAYLIST_CREATE_SUCCESS,
    payload,
  });

export interface PlaylistCreateSuccessAction {
  type: PlaylistsActionType.PLAYLIST_CREATE_SUCCESS;
  payload: Playlist;
}
