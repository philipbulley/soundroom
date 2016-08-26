import {Action} from '@ngrx/store';
import {User} from "../../../model/user";

export class AddUserAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type:string = 'AddUserAction';

  constructor( public payload?:User ) {
  }

}
