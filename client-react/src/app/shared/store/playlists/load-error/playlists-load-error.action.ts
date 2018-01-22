import { PlaylistsActionType } from '../playlists-action-type';
import { ErrorResult } from '../../../error/error-result';

export const playlistsLoadErrorAction = (payload: ErrorResult): PlaylistsLoadErrorAction => ({
  type: PlaylistsActionType.LOAD_ERROR,
  payload,
});

export interface PlaylistsLoadErrorAction {
  type: PlaylistsActionType.LOAD_ERROR;
  payload: ErrorResult;
}
