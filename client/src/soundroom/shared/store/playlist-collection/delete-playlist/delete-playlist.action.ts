import { Action } from '@ngrx/store';
import { Playlist } from '../../../model/playlist';

export class DeletePlaylistAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeletePlaylistAction';

  constructor(public playlist: Playlist) {
  }

}
