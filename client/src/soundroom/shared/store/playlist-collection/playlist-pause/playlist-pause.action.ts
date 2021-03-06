import { Action } from '@ngrx/store';
import { Playlist } from '../../../model/playlist';

/**
 * Request that we pause a playlist
 */
export class PlaylistPauseAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistPauseAction';

  constructor(public payload: Playlist) {
  }

}
