import { PlaylistCollectionLoadAction } from './load/playlist-collection-load.action';
import { PlaylistCollectionLoadSuccessAction } from './load-success/playlist-collection-load-success.action';
import { PlaylistCollectionLoadErrorAction } from './load-error/playlist-collection-load-error.action';

export enum PlaylistCollectionActionType {
  LOAD = 'LOAD',
  LOAD_ERROR = 'LOAD_ERROR',
  LOAD_SUCCESS= 'LOAD_SUCCESS',
}

export type PlaylistCollectionActions = PlaylistCollectionLoadAction
  | PlaylistCollectionLoadSuccessAction
  | PlaylistCollectionLoadErrorAction;
