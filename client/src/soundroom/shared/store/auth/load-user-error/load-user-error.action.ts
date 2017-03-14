import { Action } from '@ngrx/store';
import { LoadUserErrorResult } from './load-user-error-result';

export class LoadUserErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'LoadUserErrorAction';

  constructor(public payload: LoadUserErrorResult) {
    console.log('LoadUserErrorAction():', payload);
  }
}
