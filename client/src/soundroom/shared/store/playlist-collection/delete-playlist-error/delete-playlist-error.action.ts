import { Action } from '@ngrx/store';
import { Playlist } from '../../../model/playlist';
import { PlaylistErrorResult } from '../../../model/error/playlist-error-result';

export class DeletePlaylistErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeletePlaylistErrorAction';

  constructor(public payload: PlaylistErrorResult) {
  }

}
