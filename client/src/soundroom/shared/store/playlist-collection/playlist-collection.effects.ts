import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import 'rxjs/add/operator/filter';
import { NetworkService } from '../../service/network.service';
import { Observable } from 'rxjs';
import { Config } from '../../model/config';
import { AppState } from '../../model/app-state';
import { LoadPlaylistCollectionAction } from './load-playlist-collection/load-playlist-collection.action';
import { LoadPlaylistCollectionSuccessAction } from './load-playlist-collection-success/load-playlist-collection-success.action';
import { Playlist } from '../../model/playlist';
import { PlaylistFactory } from '../../model/factory/playlist.factory';
import { LoadPlaylistCollectionErrorAction } from './load-playlist-collection-error/load-playlist-collection-error.action';
import { PlaylistLoadAction } from './playlist-load/playlist-load.action';
import { PlaylistLoadSuccessAction } from './playlist-load-success/playlist-load-success.action';
import { PlaylistLoadErrorAction } from './playlist-load-error/playlist-load-error.action';
import { DeletePlaylistSuccessAction } from './delete-playlist-success/delete-playlist-success.action';
import { DeletePlaylistAction } from './delete-playlist/delete-playlist.action';
import { DeletePlaylistErrorAction } from './delete-playlist-error/delete-playlist-error.action';

@Injectable()
export class PlaylistCollectionEffects {

  /** Location of RESTful resource on server */
  private API_ENDPOINT: string = '/playlists';

  constructor(private store$: Store<AppState>,
              private actions$: Actions,
              private http: Http,
              private networkService: NetworkService,
              private router: Router) {
    //
  }

  /**
   * Starts load of the full data set.
   */
  @Effect()
  loadCollection(): Observable<LoadPlaylistCollectionSuccessAction | LoadPlaylistCollectionErrorAction> {
    return this.actions$
      .filter((action: Action) => action instanceof LoadPlaylistCollectionAction)
      .switchMap(action => {
        return this.http.get(Config.API_BASE_URL + this.API_ENDPOINT, this.networkService.requestOptions)
        // .delay(2000)    // DEBUG: Delay for simulation purposes only
          .retryWhen(errors => this.networkService.retry(errors))
          .map((res: Response) => res.json())
          .map(data => {
            const playlists: Playlist[] = data.map(playlistData => PlaylistFactory.createFromApiResponse(playlistData));

            // Add initial data to the Store
            return new LoadPlaylistCollectionSuccessAction(playlists);
          })
          .catch((error: Response) => Observable.of(new LoadPlaylistCollectionErrorAction({
              status: error.status,
              statusText: error.statusText,
            }))
          );
      });
  }

  /**
   * Loads the full data of a single playlist
   */
  @Effect()
  loadPlaylist(): Observable<PlaylistLoadSuccessAction | PlaylistLoadErrorAction> {
    return this.actions$
      .filter((action: Action) => action instanceof PlaylistLoadAction)
      .switchMap(action => {
        const playlistId = action.payload;

        return this.http.get(Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlistId, this.networkService.requestOptions)
        // .delay(2000)    // DEBUG: Delay for simulation purposes only
          .retryWhen(errors => this.networkService.retry(errors))
          .map((res: Response) => PlaylistFactory.createFromApiResponse(res.json()))
          .map((playlist: Playlist) => {
            // this.onSlowConnection.emit(false);
            return new PlaylistLoadSuccessAction(playlist);
          })
          .catch((error: Response) => Observable.of(new PlaylistLoadErrorAction(playlistId)));
      });
  }

  @Effect()
  deletePlaylist(): Observable<DeletePlaylistSuccessAction | DeletePlaylistErrorAction> {
    return this.actions$
      .filter((action: Action) => action instanceof DeletePlaylistAction)
      .switchMap(action => {
          const playlist: Playlist = action.payload;

          return this.http.delete(Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlist._id, this.networkService.requestOptions)
            .map((res: Response) => new DeletePlaylistSuccessAction(playlist))
            .catch((error: Response) => Observable.of(new DeletePlaylistErrorAction(playlist)));
        }
      );
  }

// @Effect()
// xxxxxxtemplate(): Observable<XXXX | XXXX> {
//   return this.actions$
//     .filter((action: Action) => action instanceof XXXX)
//     .switchMap(action => {
//       return xxxx;
//     });
// }
}
