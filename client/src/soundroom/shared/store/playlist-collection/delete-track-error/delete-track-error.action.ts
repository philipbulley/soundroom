import { Action } from '@ngrx/store';

/**
 * This client hasn't been able to delete a track from the playlist.
 */
export class DeleteTrackErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeleteTrackErrorAction';
  payload: string;

  constructor(playlistId?: string) {
    this.payload = playlistId;
  }
}
