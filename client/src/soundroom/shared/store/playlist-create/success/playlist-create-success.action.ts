import { Action } from '@ngrx/store';
import { Playlist } from '../../../model/playlist';

export class PlaylistCreateSuccessAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistCreateSuccessAction';

  constructor(public payload: Playlist) {
  }
}
