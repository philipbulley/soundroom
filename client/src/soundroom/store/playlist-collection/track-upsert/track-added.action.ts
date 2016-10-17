import { Action } from '@ngrx/store';
import { TrackUpsertPayload } from './track-upsert-payload';

/**
 * A track has been added to the playlist by either this client or another.
 */
export class TrackAddedAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'TrackAddedAction';

  constructor(public payload?: TrackUpsertPayload) {
  }
}
