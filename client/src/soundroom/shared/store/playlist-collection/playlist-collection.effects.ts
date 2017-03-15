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
          .catch((error: Response) => {
            return Observable.of(new LoadPlaylistCollectionErrorAction({
              status: error.status,
              statusText: error.statusText,
            }));
          });
      });
  }
}
