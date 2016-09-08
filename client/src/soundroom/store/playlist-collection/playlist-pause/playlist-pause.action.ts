import { Action } from '@ngrx/store';
import { PlaylistSocketEvent } from "../../../model/socket/playlist-socket-event";

export class PlaylistPauseAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistPauseAction';

  constructor( public payload?: PlaylistSocketEvent ) {
  }

}
