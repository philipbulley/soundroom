import { Action } from '@ngrx/store';
import { PlaylistErrorResult } from '../../../model/error/playlist-error-result';

export class PlaylistLoadErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistLoadErrorAction';

  constructor(public payload: PlaylistErrorResult) {
  }
}
