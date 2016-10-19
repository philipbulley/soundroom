import {Action} from '@ngrx/store';
import { Playlist } from "../../../model/playlist";

export class LoadPlaylistCollectionSuccessAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type:string = 'LoadPlaylistCollectionSuccessAction';

  constructor( public payload?: Playlist[] ) {
  }

}
