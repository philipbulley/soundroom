import { Action } from '@ngrx/store';
import { Playlist } from '../../../model/playlist';

export class DeletePlaylistAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeletePlaylistAction';

  payload: Playlist;

  constructor(playlist: Playlist) {
    this.payload = playlist;
  }
}
