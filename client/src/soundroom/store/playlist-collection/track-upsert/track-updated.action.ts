import { Action } from '@ngrx/store';
import { TrackUpdatePayload } from '../track-update-payload';

/**
 * `TrackUpdatedAction` is to be used when a track is simply being updated.
 */
export class TrackUpdatedAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'TrackUpdatedAction';

  constructor(public payload?: TrackUpdatePayload) {
  }
}
