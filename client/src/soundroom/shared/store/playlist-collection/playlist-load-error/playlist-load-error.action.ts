import { Action } from '@ngrx/store';

export class PlaylistLoadErrorAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'PlaylistLoadErrorAction';
  payload: string;

  constructor(playlistId: string) {
    this.payload = playlistId;
  }
}
