import { Action } from '@ngrx/store';
import { Playlist } from '../../../model/playlist';

export class DeletePlaylistErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeletePlaylistErrorAction';

  constructor(public payload: Playlist) {
  }

}
