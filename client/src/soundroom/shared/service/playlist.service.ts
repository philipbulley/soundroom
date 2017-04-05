import { Injectable, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

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
import { AppState } from '../model/app-state';

@Injectable()
export class PlaylistService {

  /**
   * TODO refactor into it's own connection service?
   * @type {EventEmitter}
   */
  onSlowConnection: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public store$: Store<AppState>, private socketService: SocketService) {
    this.observeSocket();
  }

  /////////////////////////
  // PRIVATE METHODS
  /////////////////////////

  private observeSocket() {
    // TODO: Should socket service should dispatch directly to store? — socket effetcs?
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
