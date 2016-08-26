import {Action} from '@ngrx/store';
import {User} from "../../../model/user";

export class LoadUserSuccessAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type:string = 'LoadUserSuccessAction';

  constructor( public payload?:User ) {
  }

}
