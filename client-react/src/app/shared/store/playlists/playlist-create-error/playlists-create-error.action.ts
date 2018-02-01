import { PlaylistsActionType } from '../playlists-action-type';
import { ErrorResult } from '../../../error/error-result';

export const playlistCreateErrorAction = (payload: ErrorResult): PlaylistCreateErrorAction => ({
  type: PlaylistsActionType.PLAYLIST_CREATE_ERROR,
  payload,
});

export interface PlaylistCreateErrorAction {
  type: PlaylistsActionType.PLAYLIST_CREATE_ERROR;
  payload: ErrorResult;
}
