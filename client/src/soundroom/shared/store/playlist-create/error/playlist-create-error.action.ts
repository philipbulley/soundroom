import { Action } from '@ngrx/store';

export class PlaylistCreateErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistCreateErrorAction';

  constructor(public payload?: Error) {
  }
}
