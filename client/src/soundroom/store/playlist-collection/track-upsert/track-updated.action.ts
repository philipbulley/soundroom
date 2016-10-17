import { Action } from '@ngrx/store';
import { TrackUpsertPayload } from './track-upsert-payload';

/**
 * `TrackUpdatedAction` is to be used when a track is simply being updated.
 */
export class TrackUpdatedAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'TrackUpdatedAction';

  constructor(public payload?: TrackUpsertPayload) {
  }
}
