import {Action} from '@ngrx/store';
import { ErrorResult } from "../../../model/error-result";

export class LoadPlaylistCollectionErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type:string = 'LoadPlaylistCollectionErrorAction';

  constructor( public payload?:ErrorResult ) {
  }

}
