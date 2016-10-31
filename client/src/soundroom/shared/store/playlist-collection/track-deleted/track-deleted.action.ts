import { Action } from '@ngrx/store';
import { TrackUpdatePayload } from '../track-update-payload';

/**
 * A track has been deleted from the playlist by either this client or another.
 */
export class TrackDeletedAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'TrackDeletedAction';

  constructor(public payload: TrackUpdatePayload) {
  }
}
