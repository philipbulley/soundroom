import { Action } from '@ngrx/store';
import { AddTrackPayload } from '../add-track/add-track-payload';

/**
 * This client has successfully added a track to the playlist. This and all clients should expect an NEW_TRACK around
 * the same time.
 */
export class AddTrackSuccessAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'AddTrackSuccessAction';

  constructor(public payload: AddTrackPayload) {
    //
  }
}
