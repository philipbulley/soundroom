import { Action } from '@ngrx/store';

export class PlaylistLoadAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistLoadAction';
  payload: string;

  constructor(playlistId: string) {
    this.payload = playlistId;
  }
}
