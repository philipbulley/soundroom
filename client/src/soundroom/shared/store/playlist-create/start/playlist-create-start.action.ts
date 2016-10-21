import { Action } from '@ngrx/store';

export class PlaylistCreateStartAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistCreateStartAction';

  payload: void;
}
