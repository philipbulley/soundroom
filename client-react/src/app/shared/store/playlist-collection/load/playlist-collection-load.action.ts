import { PlaylistCollectionActionType } from '../playlist-collection-action-type';

export const playlistCollectionLoadAction = (): PlaylistCollectionLoadAction => ({
  type: PlaylistCollectionActionType.LOAD,
});

export interface PlaylistCollectionLoadAction {
  type: PlaylistCollectionActionType.LOAD;
}
