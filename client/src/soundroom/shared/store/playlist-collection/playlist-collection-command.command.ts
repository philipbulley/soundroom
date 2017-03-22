import {Action} from '@ngrx/store';
import { PlaylistCollection } from '../../model/playlist-collection';

export const playlistCollectionCommand = (state: PlaylistCollection, payload: any, action: Action): PlaylistCollection => {
  state = Object.assign({}, state);
  state.recentAction = action;

  return state;
};
