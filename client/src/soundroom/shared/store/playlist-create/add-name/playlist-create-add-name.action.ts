import { Action } from '@ngrx/store';

export class PlaylistCreateAddNameAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistCreateAddNameAction';

  constructor(public payload: string) {
  }
}
