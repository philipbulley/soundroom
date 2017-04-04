import { Action } from '@ngrx/store';
import { DeleteTrackErrorResult } from './delete-track-error-result';

/**
 * This client hasn't been able to delete a track from the playlist.
 */
export class DeleteTrackErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeleteTrackErrorAction';

  constructor(public payload: DeleteTrackErrorResult) {
    //
  }
}
