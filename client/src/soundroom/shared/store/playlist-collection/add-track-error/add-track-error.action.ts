import { Action } from '@ngrx/store';

/**
 * This client hasn't been able to add a track to the playlist
 */
export class AddTrackErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'AddTrackErrorAction';
  payload: string;

  constructor(playlistId: string) {
    this.payload = playlistId;
  }
}
