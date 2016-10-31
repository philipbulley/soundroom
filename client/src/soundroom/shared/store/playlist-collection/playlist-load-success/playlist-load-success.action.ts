import { Action } from '@ngrx/store';
import { Playlist } from '../../../model/playlist';

export class PlaylistLoadSuccessAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistLoadSuccessAction';

  constructor(public payload: Playlist) {
  }

}
