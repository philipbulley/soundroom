import { PlaylistsLoadAction } from './load/playlists-load.action';
import { PlaylistsLoadSuccessAction } from './load-success/playlists-load-success.action';
import { PlaylistsLoadErrorAction } from './load-error/playlists-load-error.action';
import { PlaylistCreateAction } from './create/playlist-create.action';

export enum PlaylistsActionType {
  LOAD = 'LOAD',
  LOAD_ERROR = 'LOAD_ERROR',
  LOAD_SUCCESS= 'LOAD_SUCCESS',
  CREATE = 'CREATE'
}

export type PlaylistsActions = PlaylistsLoadAction
  | PlaylistsLoadSuccessAction
  | PlaylistsLoadErrorAction
  | PlaylistCreateAction;
