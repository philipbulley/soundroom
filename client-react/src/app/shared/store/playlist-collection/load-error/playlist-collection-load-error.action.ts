import { PlaylistCollectionActionType } from '../playlist-collection-action-types';
import { ErrorResult } from '../../../error/error-result';

export const playlistCollectionLoadErrorAction = (payload: ErrorResult): PlaylistCollectionLoadErrorAction => ({
  type: PlaylistCollectionActionType.LOAD_ERROR,
  payload,
});

export interface PlaylistCollectionLoadErrorAction {
  type: PlaylistCollectionActionType.LOAD_ERROR;
  payload: ErrorResult;
}