import { PlaylistCollectionActionType } from '../playlist-collection-action-types';
import { PlaylistCollectionItem } from '../playlist-collection';

export const playlistCollectionLoadSuccessAction =
  (payload: PlaylistCollectionItem[]): PlaylistCollectionLoadSuccessAction => ({
    type: PlaylistCollectionActionType.LOAD_SUCCESS,
    payload,
  });

export interface PlaylistCollectionLoadSuccessAction {
  type: PlaylistCollectionActionType.LOAD_SUCCESS;
  payload: PlaylistCollectionItem[];
}
