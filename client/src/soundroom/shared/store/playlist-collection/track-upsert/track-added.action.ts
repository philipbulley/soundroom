import { Action } from '@ngrx/store';
import { TrackUpdatePayload } from '../track-update-payload';

/**
 * A track has been added to the playlist by either this client or another.
 */
export class TrackAddedAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'TrackAddedAction';

  constructor(public payload?: TrackUpdatePayload) {
  }
}
