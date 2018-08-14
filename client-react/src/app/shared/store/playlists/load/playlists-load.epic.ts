import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import { Config } from '../../../model/config';
import { StoreState } from '../../store-state';
import { createHeaders, fetchRx } from '../../../network-helper';
import { Epic } from 'redux-observable';
import { PlaylistsActions, PlaylistsActionType } from '../playlists-action-type';
import { PlaylistsLoadAction } from './playlists-load.action';
import { playlistsLoadSuccessAction } from '../load-success/playlists-load-success.action';
import { playlistsLoadErrorAction } from '../load-error/playlists-load-error.action';
import { ErrorType } from '../../../error/error-type';
import { Playlist } from '../../../model/playlist';
import { errorTypeFactory } from '../../../error/error-type.factory';

export const PATH: string = '/playlists';

/**
 * Loads and dispatches a bunch of `Playlist` objects
 * @param {ActionsObservable<PlaylistsActions>} action$
 * @param {MiddlewareAPI<StoreState>} store
 */
export const playlistsLoadEpic: Epic<PlaylistsActions, StoreState> = (action$, store) =>
	action$.filter(action => action.type === PlaylistsActionType.LOAD).switchMap((action: PlaylistsLoadAction) => {
		return fetchRx(Config.API_BASE_URL + PATH, {
			headers: createHeaders(store.getState().auth)
		})
			.switchMap((res: Response): Observable<Playlist[]> => Observable.fromPromise(res.json()))
			.map((items: Playlist[]) => playlistsLoadSuccessAction(items))
			.catch((error: Response) =>
				Observable.of(
					playlistsLoadErrorAction({
						status: error.status || 0,
						message: error.statusText,
						type: errorTypeFactory(error.status, {
							404: ErrorType.PLAYLISTS_NOT_FOUND
						})
					})
				)
			);
	});
