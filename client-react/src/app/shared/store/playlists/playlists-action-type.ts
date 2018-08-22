import { PlaylistsLoadAction } from './load/playlists-load.action';
import { PlaylistsLoadSuccessAction } from './load-success/playlists-load-success.action';
import { PlaylistsLoadErrorAction } from './load-error/playlists-load-error.action';
import { PlaylistCreateAction } from './playlist-create/playlist-create.action';
import { PlaylistCreateSuccessAction } from './playlist-create-success/playlist-create-success.action';
import { PlaylistCreateErrorAction } from './playlist-create-error/playlists-create-error.action';
import { PlaylistCreateResetAction } from './playlist-create-reset/playlist-create-reset.action';
import { PlaylistCreateTryAgainAction } from './playlist-create-try-again/playlist-create-try-again.action';

export enum PlaylistsActionType {
	LOAD = 'LOAD',
	LOAD_ERROR = 'LOAD_ERROR',
	LOAD_SUCCESS = 'LOAD_SUCCESS',
	PLAYLIST_CREATE = 'PLAYLIST_CREATE',
	PLAYLIST_CREATE_SUCCESS = 'PLAYLIST_CREATE_SUCCESS',
	PLAYLIST_CREATE_ERROR = 'PLAYLIST_CREATE_ERROR',
	PLAYLIST_CREATE_RESET = 'PLAYLIST_CREATE_RESET',
	PLAYLIST_CREATE_TRY_AGAIN = 'PLAYLIST_CREATE_TRY_AGAIN'
}

export type PlaylistsActions =
	| PlaylistsLoadAction
	| PlaylistsLoadSuccessAction
	| PlaylistsLoadErrorAction
	| PlaylistCreateAction
	| PlaylistCreateSuccessAction
	| PlaylistCreateErrorAction
	| PlaylistCreateResetAction
	| PlaylistCreateTryAgainAction;
