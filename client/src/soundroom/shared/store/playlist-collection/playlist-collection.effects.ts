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
import { SocketEventTypeEnum } from '../../model/socket/socket-event-type.enum';
import { PlaylistPlayAction } from './playlist-play/playlist-play.action';
import { SocketService } from '../../service/socket.service';
import { PlaylistPauseAction } from './playlist-pause/playlist-pause.action';
import { TrackUpVoteAction } from './track-up-vote/track-up-vote.action';
import { AddTrackErrorAction } from './add-track-error/add-track-error.action';
import { AddTrackSuccessAction } from './add-track-success/add-track-success.action';
import { AddTrackAction } from './add-track/add-track.action';
import { PlaylistAddTrackBody } from '../../service/vo/playlist-add-track-body';
import { ErrorKey } from '../../model/error/error-key';
import { DeleteTrackSuccessAction } from "./delete-track-success/delete-track-success.action";
import { DeleteTrackErrorAction } from "./delete-track-error/delete-track-error.action";
import { DeleteTrackAction } from "./delete-track/delete-track.action";
import { PlaylistCreateAddDescriptionCreateAction } from '../playlist-create/add-description-create/playlist-create-add-description-create.action';
import { PlaylistCreateSuccessAction } from '../playlist-create/success/playlist-create-success.action';
import { PlaylistCreateErrorAction } from '../playlist-create/error/playlist-create-error.action';
import { PlaylistCreate } from '../../model/playlist-create';
import { PlaylistCreateBody } from '../../service/vo/playlist-create-body';
import { getAddTrackError, getDeleteTrackError, getCreatePlaylistError } from './playlist-collection-api-error-helper';
import { PlaylistSocketEventService } from '../../service/playlist-socket-event.service';

@Injectable()
export class PlaylistCollectionEffects {

  /** Location of RESTful resource on server */
  private API_ENDPOINT: string = '/playlists';

  constructor(private store$: Store<AppState>,
              private actions$: Actions,
              private http: Http,
              private networkService: NetworkService,
              private socketService: SocketService,
              private socketEventService: PlaylistSocketEventService) {
    this.socketEventService.subscribe();
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
              type: ErrorKey.PLAYLIST_COLLECTION_NOT_FOUND,
              playlistId: null,
              status: error.status,
              message: error.statusText,
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

  @Effect({dispatch: false})
  play() {
    return this.actions$
      .filter((action: Action) => action instanceof PlaylistPlayAction)
      .map((action: PlaylistPlayAction) =>
        this.socketService.emit(SocketEventTypeEnum.PLAYLIST_PLAY, action.payload._id))
      .ignoreElements();
  }

  @Effect({dispatch: false})
  pause() {
    return this.actions$
      .filter((action: Action) => action instanceof PlaylistPauseAction)
      .map((action: PlaylistPlayAction) =>
        this.socketService.emit(SocketEventTypeEnum.PLAYLIST_PAUSE, action.payload._id))
      .ignoreElements();
  }

  @Effect({dispatch: false})
  trackUpVote() {
    return this.actions$
      .filter((action: Action) => action instanceof TrackUpVoteAction)
      .map((action: TrackUpVoteAction) => {
        console.log('PlaylistCollectionEffects.trackUpVote:', action.payload.playlist, action.payload.playlistTrack);

        this.socketService.emit(SocketEventTypeEnum.PLAYLIST_TRACK_UP_VOTE, {
          playlistId: action.payload.playlist._id,
          playlistTrackId: action.payload.playlistTrack._id,
        });
      })
      .ignoreElements();
  }

  @Effect()
  addTrack(): Observable<AddTrackSuccessAction | AddTrackErrorAction> {
    return this.actions$
      .filter((action: Action) => action instanceof AddTrackAction)
      .switchMap((action: AddTrackAction): Observable<AddTrackSuccessAction | AddTrackErrorAction> => {
        const body: PlaylistAddTrackBody = {
          provider: action.payload.provider.toString(),
          foreignId: action.payload.foreignId,
        };

        return this.http.post(
          Config.API_BASE_URL + this.API_ENDPOINT + '/' + action.payload.playlist._id + '/tracks',
          JSON.stringify(body),
          this.networkService.requestOptions
        )
        // NOTE: Track is added to store via socket event handler, as all clients will receive that event.
          .map((res: Response) => new AddTrackSuccessAction(action.payload))
          .catch((res: Response) =>
            Observable.of(new AddTrackErrorAction(getAddTrackError(res, action.payload.playlist))));
      });
  }

  @Effect()
  deleteTrack(): Observable<DeleteTrackSuccessAction | DeleteTrackErrorAction> {
    return this.actions$
      .filter((action: Action) => action instanceof DeleteTrackAction)
      .switchMap((action: DeleteTrackAction) => {
        return this.http.delete(
          Config.API_BASE_URL + this.API_ENDPOINT + '/' + action.payload.playlist._id + '/tracks/' + action.payload.playlistTrack._id,
          this.networkService.requestOptions)
          .map((res: Response) => new DeleteTrackSuccessAction(action.payload))
          .catch((res: Response) =>
            Observable.of(new DeleteTrackErrorAction(getDeleteTrackError(res, action.payload.playlist, action.payload.playlistTrack))));
      });
  }

  @Effect()
  createPlaylist(): Observable<PlaylistCreateSuccessAction | PlaylistCreateErrorAction> {
    return this.actions$
      .filter((action: Action) => action instanceof PlaylistCreateAddDescriptionCreateAction)
      .switchMap(action => {
        return this.store$.select((state: AppState) => state.playlistCreate)
          .take(1)
          .mergeMap((playlistCreate: PlaylistCreate) => {
            const body: PlaylistCreateBody = {
              name: playlistCreate.name,
            };

            if (playlistCreate.description) {
              body.description = playlistCreate.description;
            }

            return this.http.post(Config.API_BASE_URL + this.API_ENDPOINT, JSON.stringify(body), this.networkService.requestOptions)
              .map((res: Response) => PlaylistFactory.createFromApiResponse(res.json()));
          })
          .switchMap((newPlaylist: Playlist) => Observable.of(
            // For the benefit of notifying PlaylistCreateComponent that we're successful
            new PlaylistCreateSuccessAction(newPlaylist),
            // Separate action to actually add new playlist to our collection.
            new PlaylistLoadSuccessAction(newPlaylist)
          ))
          .catch(res => Observable.of(new PlaylistCreateErrorAction(getCreatePlaylistError(res))));
      });
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
