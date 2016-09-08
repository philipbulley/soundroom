import {Action} from '@ngrx/store';
import { LoadPlaylistCollectionParams } from "./load-playlist-collection-params";

export class LoadPlaylistCollectionAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type:string = 'LoadPlaylistCollectionAction';

  constructor( public payload?:LoadPlaylistCollectionParams ) {
  }

}
