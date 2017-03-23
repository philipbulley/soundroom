import { Action } from '@ngrx/store';
import { Playlist } from '../../../model/playlist';

/**
 * Request that we start playing a playlist
 */
export class PlaylistPlayAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistPlayAction';

  constructor(public payload: Playlist) {
  }

}
