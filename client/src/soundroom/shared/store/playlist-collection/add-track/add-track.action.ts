import { Action } from '@ngrx/store';
import { AddTrackPayload } from './add-track-payload';

/**
 * This client begins the server request of attempting to add a track
 */
export class AddTrackAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'AddTrackAction';

  constructor(public payload: AddTrackPayload) {
  }
}
