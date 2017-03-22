import { PlaylistCollection } from '../../../model/playlist-collection';
import { PlaylistCollectionState } from '../../../model/state/playlist-collection.state';

export const loadPlaylistCollectionCommand = (state: PlaylistCollection, payload: void): PlaylistCollection => {
  state = Object.assign({}, state);
  state.loadState = PlaylistCollectionState.LOADING;

  return state;
};
