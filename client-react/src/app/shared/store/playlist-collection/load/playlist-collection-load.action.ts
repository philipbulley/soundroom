import { PlaylistCollectionActionType } from '../playlist-collection-action-types';

export const playlistCollectionLoadAction = (): PlaylistCollectionLoadAction => ({
  type: PlaylistCollectionActionType.LOAD,
});

export interface PlaylistCollectionLoadAction {
  type: PlaylistCollectionActionType.LOAD;
}
