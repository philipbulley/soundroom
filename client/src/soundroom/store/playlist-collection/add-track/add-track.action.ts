import { Action } from '@ngrx/store';
import { AddTrackPayload } from './add-track-payload';

export class AddTrackAction implements Action {
  // tslint:disable-next-line:no-reserved-keywords
  type: string = 'AddTrackAction';

  constructor(public payload?: AddTrackPayload) {
  }
}
