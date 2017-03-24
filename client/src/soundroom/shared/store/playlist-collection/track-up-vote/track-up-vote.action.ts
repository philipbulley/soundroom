import { Action } from '@ngrx/store';
import { TrackUpVotePayload } from './track-up-vote-payload';

/**
 * Request that we upvote a track
 */
export class TrackUpVoteAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'TrackUpVoteAction';

  constructor(public payload: TrackUpVotePayload) {
  }

}
