import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SocketService } from "./socket.service";
import { PlaylistPausedAction } from "../store/playlist-collection/playlist-paused/playlist-paused.action";
import { AppState } from '../model/app-state';
import { SocketEventTypeEnum } from '../model/socket/socket-event-type.enum';
import { PlaylistSocketEvent } from '../model/socket/playlist-socket-event';
import { PlaylistTracksChangeSocketEvent } from '../model/socket/playlist-tracks-change-socket-event';
import { PlaylistTrackFactory } from '../model/factory/playlist-track.factory';
import { PlaylistTracksChangeActionEnum } from '../model/socket/playlist-tracks-change-action.enum';
import { TrackUpdatePayload } from '../store/playlist-collection/track-update-payload';
import { TrackUpdatedAction } from '../store/playlist-collection/track-upsert/track-updated.action';
import { TrackAddedAction } from '../store/playlist-collection/track-upsert/track-added.action';
import { TrackDeletedAction } from '../store/playlist-collection/track-deleted/track-deleted.action';
import { PlaylistProgressAction } from '../store/playlist-collection/playlist-progress/playlist-progress.action';
import { PlaylistProgressSocketEvent } from '../model/socket/playlist-progress-socket-event';

@Injectable()
export class PlaylistSocketEventService {

  private eventMap: EventMap[];
  private subscription: Subscription;

  constructor(public store$: Store<AppState>, private socketService: SocketService) {
    this.eventMap = [
      {eventType: SocketEventTypeEnum.PLAYLIST_TRACK_PROGRESS, fn: this.handleTrackProgress},
      {eventType: SocketEventTypeEnum.PLAYLIST_PAUSE, fn: this.handlePause},
      {eventType: SocketEventTypeEnum.PLAYLIST_TRACKS_CHANGE, fn: this.handleTracksChange},
    ];
  }

  subscribe() {
    this.subscription = this.socketService.stream$
      .subscribe(event => {
        const mapping = this.eventMap.find(mapping => mapping.eventType === event.type);
        if (mapping) {
          mapping.fn.call(this, event);
        }
      });
  }

  private handleTrackProgress(event: any) {
    // NOTE: We can infer playback fro progress events, so no need to subscribe to SocketEventTypeEnum.PLAYLIST_PLAY
    this.store$.dispatch(new PlaylistProgressAction(event.data as PlaylistProgressSocketEvent));
  }

  private handlePause(event: any) {
    this.store$.dispatch(new PlaylistPausedAction(event.data as PlaylistSocketEvent));
  }

  private handleTracksChange(event: any) {
    console.log('PlaylistSocketEventService.handleTracksChange:', event.data);
    const eventData: PlaylistTracksChangeSocketEvent = event.data;
    const playlistTrack = PlaylistTrackFactory.createFromApiResponse(eventData.playlistTrack);

    console.log('PlaylistSocketEventService.subscribe: SocketEventTypeEnum.PLAYLIST_TRACKS_CHANGE', event, eventData);

    switch (eventData.action) {
      case PlaylistTracksChangeActionEnum.ADD:
      case PlaylistTracksChangeActionEnum.COMPLETE:
      case PlaylistTracksChangeActionEnum.UP_VOTE:
        console.log('PlaylistSocketEventService.subscribe: ', eventData.action, eventData);

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
        console.log('PlaylistSocketEventService.subscribe: DELETE:', eventData.action, eventData);

        this.store$.dispatch(new TrackDeletedAction({
          playlistId: eventData.playlistId,
          playlistTrack,
          playlistTrackIds: eventData.playlistTrackIds,
        }));
        break;
    }
  }
}

interface EventMap {
  eventType: SocketEventTypeEnum;
  fn: (event) => void;
}
