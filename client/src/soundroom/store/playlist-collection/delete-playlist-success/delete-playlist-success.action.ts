import { Action } from '@ngrx/store';
import { Playlist } from "../../../model/playlist";

export class DeletePlaylistSuccessAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'DeletePlaylistSuccessAction';

  constructor(public payload?: Playlist) {
  }

}
