import { Action } from '@ngrx/store';
import { PlaylistProgressSocketEvent } from '../../../model/socket/playlist-progress-socket-event';

export class PlaylistProgressAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistProgressAction';

  payload: PlaylistProgressSocketEvent;

  constructor(playlist: PlaylistProgressSocketEvent) {
    this.payload = playlist;
  }
}
