import {Action} from '@ngrx/store';
import { ErrorResult } from "../../../model/error-result";

export class DeletePlaylistErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type:string = 'DeletePlaylistErrorAction';

  constructor( public payload?:ErrorResult ) {
  }

}
