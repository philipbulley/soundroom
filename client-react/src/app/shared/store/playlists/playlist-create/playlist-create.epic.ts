import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/delay';
import { Config } from '../../../model/config';
import { StoreState } from '../../store-state';
import { createHeaders, fetchRx } from '../../../network-helper';
import { Epic } from 'redux-observable';
import {
	PlaylistsActions,
	PlaylistsActionType
} from '../playlists-action-type';
import { ErrorType } from '../../../error/error-type';
import { Playlist } from '../../../model/playlist';
import { PlaylistCreateAction } from './playlist-create.action';
import { playlistCreateSuccessAction } from '../playlist-create-success/playlist-create-success.action';
import { playlistCreateErrorAction } from '../playlist-create-error/playlists-create-error.action';
import { errorTypeFactory } from '../../../error/error-type.factory';

export const PATH: string = '/playlists';

/**
 * Loads and dispatches a bunch of `Playlist` objects
 * @param {ActionsObservable<PlaylistsActions>} action$
 * @param {MiddlewareAPI<StoreState>} store
 */
export const playlistCreateEpic: Epic<PlaylistsActions, StoreState> = (
	action$,
	store
) =>
	action$
		.filter(action => action.type === PlaylistsActionType.PLAYLIST_CREATE)
		.switchMap((action: PlaylistCreateAction) => {
			return fetchRx(Config.API_BASE_URL + PATH, {
				method: 'POST',
				headers: createHeaders(store.getState().auth),
				body: JSON.stringify(action.payload)
			})
				.switchMap((res: Response): Observable<Playlist> =>
					Observable.fromPromise(res.json())
				)
				.delay(3000) // debug
				.map((playlist: Playlist) => playlistCreateSuccessAction(playlist))
				.catch((error: Response) =>
					Observable.of(
						playlistCreateErrorAction({
							status: error.status || 0,
							message: error.statusText,
							type: errorTypeFactory(error.status, {
								404: ErrorType.PLAYLISTS_NOT_FOUND
							})
						})
					)
				);
		});
