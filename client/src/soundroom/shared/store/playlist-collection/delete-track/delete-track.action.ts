import { Action } from '@ngrx/store';
import { DeleteTrackPayload } from './delete-track-payload';

/**
 * This client begins the server request of attempting to delete a track
 */
export class DeleteTrackAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeleteTrackAction';

  constructor(public payload?: DeleteTrackPayload) {
  }
}
