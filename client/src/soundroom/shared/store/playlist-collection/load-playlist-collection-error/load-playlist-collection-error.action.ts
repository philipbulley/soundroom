import { Action } from '@ngrx/store';
import { PlaylistErrorResult } from '../../../model/error/playlist-error-result';

export class LoadPlaylistCollectionErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'LoadPlaylistCollectionErrorAction';

  constructor(public payload: PlaylistErrorResult) {
  }

}
