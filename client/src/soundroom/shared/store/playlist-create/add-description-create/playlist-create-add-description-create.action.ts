import { Action } from '@ngrx/store';

export class PlaylistCreateAddDescriptionCreateAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistCreateAddDescriptionCreateAction';

  constructor(public payload?: string) {
  }
}
