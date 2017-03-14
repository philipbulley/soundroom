import { Action } from '@ngrx/store';
import { LoadUserParams } from './load-user-params';

export class LoadUserAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'LoadUserAction';

  constructor(public payload?: LoadUserParams) {
  }

}
