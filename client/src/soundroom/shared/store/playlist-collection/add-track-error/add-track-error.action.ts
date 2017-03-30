import { Action } from '@ngrx/store';
import { PlaylistErrorResult } from '../../../model/error/playlist-error-result';

/**
 * This client hasn't been able to add a track to the playlist
 */
export class AddTrackErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'AddTrackErrorAction';

  constructor(public payload: PlaylistErrorResult) {
  }
}
