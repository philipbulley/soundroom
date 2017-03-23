import { Action } from '@ngrx/store';
import { PlaylistSocketEvent } from '../../../model/socket/playlist-socket-event';

/** Dispatch when the server tells that a playlist has been paused */
export class PlaylistPausedAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistPausedAction';

  constructor(public payload: PlaylistSocketEvent) {
  }

}
