import { Action } from '@ngrx/store';

export class AddCachedJwtAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'AddCachedJwtAction';

  payload: string;

  constructor(jwt: string) {
    this.payload = jwt;
  }

}
