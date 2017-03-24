import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Store } from '@ngrx/store';

import { Config } from '../../shared/model/config';
import { Playlist } from '../../shared/model/playlist';
import { PlaylistCreateBody } from "./vo/playlist-create-body";
import { PlaylistCreate } from "../../shared/model/playlist-create";
import { PlaylistCreateState } from "../../shared/model/state/playlist-create.state.ts";
import { PlaylistFactory } from "../../shared/model/factory/playlist.factory";
import { NetworkService } from "./network.service";
import { SocketService } from "./socket.service";
import { SocketEventTypeEnum } from "../../shared/model/socket/socket-event-type.enum.ts";
import { PlaylistProgressSocketEvent } from "../../shared/model/socket/playlist-progress-socket-event";
import { PlaylistSocketEvent } from "../../shared/model/socket/playlist-socket-event";
import { ProviderEnum } from "../../shared/model/enum/provider.enum";
import { PlaylistAddTrackBody } from "./vo/playlist-add-track-body";
import { PlaylistTrackFactory } from "../../shared/model/factory/playlist-track.factory";
import { PlaylistTracksChangeActionEnum } from "../../shared/model/socket/playlist-tracks-change-action.enum";
import { PlaylistTracksChangeSocketEvent } from "../../shared/model/socket/playlist-tracks-change-socket-event";
import { PlaylistTrack } from "../../shared/model/playlist-track";
import { PlaylistError } from "../../shared/model/error/PlaylistError";
import { User } from "../../shared/model/user";
import { PlaylistProgressAction } from "../../shared/store/playlist-collection/playlist-progress/playlist-progress.action";
import { PlaylistPausedAction } from "../store/playlist-collection/playlist-paused/playlist-paused.action";
import { AddTrackAction } from '../../shared/store/playlist-collection/add-track/add-track.action';
import { AddTrackSuccessAction } from '../../shared/store/playlist-collection/add-track-success/add-track-success.action';
import { AddTrackErrorAction } from '../../shared/store/playlist-collection/add-track-error/add-track-error.action';
import { DeleteTrackSuccessAction } from '../../shared/store/playlist-collection/delete-track-success/delete-track-success.action';
import { DeleteTrackErrorAction } from '../../shared/store/playlist-collection/delete-track-error/delete-track-error.action';
import { DeleteTrackAction } from '../../shared/store/playlist-collection/delete-track/delete-track.action';
import { TrackUpdatePayload } from '../../shared/store/playlist-collection/track-update-payload';
import { TrackUpdatedAction } from '../../shared/store/playlist-collection/track-upsert/track-updated.action';
import { TrackAddedAction } from '../../shared/store/playlist-collection/track-upsert/track-added.action';
import { TrackDeletedAction } from '../../shared/store/playlist-collection/track-deleted/track-deleted.action';
import { PlaylistLoadSuccessAction } from '../../shared/store/playlist-collection/playlist-load-success/playlist-load-success.action';
import { PlaylistCreateErrorAction } from '../../shared/store/playlist-create/error/playlist-create-error.action';
import { PlaylistCreateSuccessAction } from '../../shared/store/playlist-create/success/playlist-create-success.action';
import { AppState } from '../model/app-state';

@Injectable()
export class PlaylistService {

  /**
   * An `Observable` that can be subscribed to for playlist data. Use this in components to the data of access one or
   * more playlists.
   * @deprecated
   */
  playlists: ConnectableObservable<Playlist[]>;

  /**
   * TODO refactor into it's own connection service?
   * @type {EventEmitter}
   */
  onSlowConnection: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Location of RESTful resource on server
   * @type {string}
   */
  private API_ENDPOINT: string = '/playlists';

  private playlistCreate$: Observable<PlaylistCreate>;

  constructor(private http: Http, public store$: Store<AppState>, public networkService: NetworkService, private socketService: SocketService) {
    this.playlistCreate$ = this.store$.map((state: AppState) => state.playlistCreate);

    this.observeCreate();
    this.observeSocket();
  }

  /**
   * Makes request to add a track on the server. Notifies the redux state tree at the relevant points.
   *
   * @param playlist      The `Playlist` being added to.
   * @param provider      The provider of the track.
   * @param foreignId     The ID of the track according to the provider.
   * @returns {Observable<number>}  Observable with HTTP status of the request if successful.
   */
  addTrack(playlist: Playlist, provider: ProviderEnum, foreignId: string): Observable<any> {
    this.store$.dispatch(new AddTrackAction({playlist, provider, foreignId}));

    const body: PlaylistAddTrackBody = {
      provider: <string><any>provider,
      foreignId,
    };

    console.log('PlaylistService.addTrack: call POST:',
      Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlist._id + '/tracks',
      body,
      this.networkService.requestOptions);

    const observable = this.http.post(
      Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlist._id + '/tracks',
      JSON.stringify(body),
      this.networkService.requestOptions
    )
      .publishReplay(1) // Use publishReplay to allow multiple subscriptions, but only one request/result
      .refCount();

    observable.subscribe((res: Response) => {
      // NOTE: Track is added to state tree via socket event handler, as all clients will receive that event.
      this.store$.dispatch(new AddTrackSuccessAction(playlist._id));
    }, (error: Response) => {
      // Dispatch redux action
      this.store$.dispatch(new AddTrackErrorAction(playlist._id));
    });

    return observable
      .map((res: Response) => res.status)
      .catch((error: Response) => {
        // console.error(error);
        // Re-throw actual error so the requesting method can act on it
        const errorJson = error.json();
        let errorThrow;

        if (errorJson.hasOwnProperty('message') && ~errorJson.message.indexOf('getaddrinfo ENOTFOUND')) {
          errorThrow = new PlaylistError(PlaylistError.PROVIDER_CONNECTION, null, playlist, error);
        } else if (errorJson.hasOwnProperty('message') && errorJson.message === 'DUPLICATE_USER_UP_VOTE') {
          errorThrow = new PlaylistError(PlaylistError.DUPLICATE_USER_UP_VOTE, null, playlist, error);
        } else if (error.status === 500) {
          errorThrow = new PlaylistError(PlaylistError.SERVER, null, playlist, error);
        } else {
          errorThrow = new PlaylistError(PlaylistError.UNKNOWN, null, playlist, error);
        }

        return Observable.throw(errorThrow);
      });
  }

  /**
   * Determines whether the user specified can delete the track specified.
   *
   * @param playlistTrack
   * @param user
   * @returns {boolean}
   */
  canUserDeleteTrack(playlistTrack: PlaylistTrack, user: User) {
    // TODO: Allow admins (when implemented) to delete tracks  (also in back-end Playlist.canUserDeleteTrack())
    return playlistTrack.createdBy._id === user._id;
  }

  deleteTrack(playlist: Playlist, playlistTrack: PlaylistTrack) {
    this.store$.dispatch(new DeleteTrackAction({playlist, playlistTrack}));

    const observable = this.http.delete(
      Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlist._id + '/tracks/' + playlistTrack._id,
      this.networkService.requestOptions
    )
      .publishReplay(1) // Use publishReplay to allow multiple subscriptions, but only one request/result
      .refCount();

    observable.subscribe((res: Response) => {
      this.store$.dispatch(new DeleteTrackSuccessAction(playlist._id));
    }, (error: Response) => {
      this.store$.dispatch(new DeleteTrackErrorAction(playlist._id));
    });

    return observable
      .map((res: Response) => res.status)
      .catch((error: Response) => {
        // Re-throw actual error so the requesting method can act on it
        // const errorJson = error.json();
        let errorThrow;

        if (error.status === 500) {
          errorThrow = new PlaylistError(PlaylistError.SERVER, null, playlist, error);
        } else {
          errorThrow = new PlaylistError(PlaylistError.UNKNOWN, null, playlist, error);
        }

        return Observable.throw(errorThrow);
      });
  }


  /////////////////////////
  // PRIVATE METHODS
  /////////////////////////

  /**
   * Observe changes to the `playlistCreate` store and react as appropriate.
   */
  private observeCreate() {
    this.playlistCreate$
      .filter((playlistCreate: PlaylistCreate) => playlistCreate.state === PlaylistCreateState.CREATING)
      .mergeMap((playlistCreate: PlaylistCreate) => this.create(
        playlistCreate.name,
        playlistCreate.description
      ))
      .subscribe((newPlaylist: Playlist) => {
        console.log('PlaylistService.initCreate: subscribe:', newPlaylist);

        // For the benefit of notifying PlaylistCreateComponent that we're successful
        this.store$.dispatch(new PlaylistCreateSuccessAction(newPlaylist));

        // Separate action to actually add new playlist to our collection.
        this.store$.dispatch(new PlaylistLoadSuccessAction(newPlaylist));
      }, error => this.store$.dispatch(new PlaylistCreateErrorAction(error)));
  }

  private create(name: string, description?: string): Observable<Playlist> {
    console.log('PlaylistService.create:', name, description);

    const body: PlaylistCreateBody = {
      name: name,
    };

    if (description) {
      body.description = description;
    }

    return this.http.post(Config.API_BASE_URL + this.API_ENDPOINT, JSON.stringify(body), this.networkService.requestOptions)
      .map((res: Response) => PlaylistFactory.createFromApiResponse(res.json()))
      .catch((error: Response) => {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  private observeSocket() {
    // TODO: Should socket service should dispatch directly to store?
    this.socketService.stream$
      .subscribe((event) => {
      // console.log('PlaylistService.observeSocket: subscribe():', event);

      switch (event.type) {

        case SocketEventTypeEnum.PLAYLIST_TRACK_PROGRESS:
          this.store$.dispatch(new PlaylistProgressAction(event.data as PlaylistProgressSocketEvent));
          break;

        // NOTE: Don't really need to use PLAYLIST_PLAY as PROGRESS does the same job + more
        // case SocketEventTypeEnum.PLAYLIST_PLAY:
        //   this.store.dispatch({type: PlaylistAction.PLAY, payload: data});
        //   break;

        case SocketEventTypeEnum.PLAYLIST_PAUSE:
          this.store$.dispatch(new PlaylistPausedAction(event.data as PlaylistSocketEvent));
          break;

        case SocketEventTypeEnum.PLAYLIST_TRACKS_CHANGE:
          const eventData: PlaylistTracksChangeSocketEvent = event.data;
          const playlistTrack = PlaylistTrackFactory.createFromApiResponse(eventData.playlistTrack);

          console.log('PlaylistService.observeSocket: SocketEventTypeEnum.PLAYLIST_TRACKS_CHANGE', event, eventData);

          switch (eventData.action) {
            case PlaylistTracksChangeActionEnum.ADD:
            case PlaylistTracksChangeActionEnum.COMPLETE:
            case PlaylistTracksChangeActionEnum.UP_VOTE:
              console.log('PlaylistService.observeSocket: ', eventData.action, eventData);

              // A track has been successfully added - reflect change in local data collection
              const payload: TrackUpdatePayload = {
                playlistId: eventData.playlistId,
                playlistTrack,
                playlistTrackIds: eventData.playlistTrackIds,
              };

              this.store$.dispatch(
                eventData.action === PlaylistTracksChangeActionEnum.COMPLETE ||
                eventData.action === PlaylistTracksChangeActionEnum.UP_VOTE
                  ? new TrackUpdatedAction(payload)
                  : new TrackAddedAction(payload)
              );
              break;

            case PlaylistTracksChangeActionEnum.DELETE:
              console.log('PlaylistService.observeSocket: DELETE:', eventData.action, eventData);

              this.store$.dispatch(new TrackDeletedAction({
                playlistId: eventData.playlistId,
                playlistTrack,
                playlistTrackIds: eventData.playlistTrackIds,
              }));
              break;
          }
          break;
      }

    });
  }
}
