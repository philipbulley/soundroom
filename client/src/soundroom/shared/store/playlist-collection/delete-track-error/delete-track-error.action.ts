import { Action } from '@ngrx/store';
import { DeleteTrackPayload } from '../delete-track/delete-track-payload';

/**
 * This client hasn't been able to delete a track from the playlist.
 */
export class DeleteTrackErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeleteTrackErrorAction';

  constructor(public payload: DeleteTrackPayload) {
    //
  }
}
