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
import { PlaylistTrackFactory } from "../../shared/model/factory/playlist-track.factory";
import { PlaylistTracksChangeActionEnum } from "../../shared/model/socket/playlist-tracks-change-action.enum";
import { PlaylistTracksChangeSocketEvent } from "../../shared/model/socket/playlist-tracks-change-socket-event";
import { PlaylistProgressAction } from "../../shared/store/playlist-collection/playlist-progress/playlist-progress.action";
import { PlaylistPausedAction } from "../store/playlist-collection/playlist-paused/playlist-paused.action";
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
