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
import { PlaylistCollectionActions, PlaylistCollectionActionType } from '../playlist-collection-action-type';
import { PlaylistCollectionLoadAction } from './playlist-collection-load.action';
import { PlaylistCollectionItem } from '../playlist-collection';
import { playlistCollectionLoadSuccessAction } from '../load-success/playlist-collection-load-success.action';
import { playlistCollectionLoadErrorAction } from '../load-error/playlist-collection-load-error.action';
import { ErrorKey } from '../../../error/error-key';

export const PATH: string = '/playlists';

export const playlistCollectionLoadEpic: Epic<PlaylistCollectionActions, StoreState> = (action$, store) => action$
  .filter(action => action.type === PlaylistCollectionActionType.LOAD)
  .switchMap((action: PlaylistCollectionLoadAction) => {
    return fetchRx(Config.API_BASE_URL + PATH, {headers: createHeaders(store.getState().auth)})
      .switchMap((res: Response): Observable<PlaylistCollectionItem[]> => Observable.fromPromise(res.json()))
      .map((items: PlaylistCollectionItem[]) => playlistCollectionLoadSuccessAction(items))
      .catch((error: Response) => Observable.of(playlistCollectionLoadErrorAction({
          status: error.status || 0,
          message: error.statusText,
          type: error.status === 404
            ? ErrorKey.PLAYLIST_COLLECTION_NOT_FOUND
            : error.status === 500
              ? ErrorKey.SERVER
              : ErrorKey.UNKNOWN,
        }))
      );
  });
