import { PlaylistsLoadAction } from './load/playlists-load.action';
import { PlaylistsLoadSuccessAction } from './load-success/playlists-load-success.action';
import { PlaylistsLoadErrorAction } from './load-error/playlists-load-error.action';

export enum PlaylistsActionType {
  LOAD = 'LOAD',
  LOAD_ERROR = 'LOAD_ERROR',
  LOAD_SUCCESS= 'LOAD_SUCCESS',
}

export type PlaylistsActions = PlaylistsLoadAction
  | PlaylistsLoadSuccessAction
  | PlaylistsLoadErrorAction;
