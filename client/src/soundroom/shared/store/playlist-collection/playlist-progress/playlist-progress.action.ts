import { Action } from '@ngrx/store';
import { PlaylistProgressSocketEvent } from '../../../model/socket/playlist-progress-socket-event';

export class PlaylistProgressAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistProgressAction';

  constructor(public playlist?: PlaylistProgressSocketEvent) {
  }

}
