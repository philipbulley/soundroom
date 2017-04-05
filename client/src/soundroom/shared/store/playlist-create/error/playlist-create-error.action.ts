import { Action } from '@ngrx/store';
import { ErrorResult } from '../../../model/error/error-result';

export class PlaylistCreateErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistCreateErrorAction';

  constructor(public payload: ErrorResult) {
  }
}
