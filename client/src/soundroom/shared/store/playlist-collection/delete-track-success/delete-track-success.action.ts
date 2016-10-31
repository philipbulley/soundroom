import { Action } from '@ngrx/store';

/**
 * This client has successfully deleted a track from the playlist. This and all clients should expect an TRACK_DELETED
 * around the same time.
 */
export class DeleteTrackSuccessAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeleteTrackSuccessAction';
  payload: string;

  constructor(playlistId: string) {
    this.payload = playlistId;
  }
}
