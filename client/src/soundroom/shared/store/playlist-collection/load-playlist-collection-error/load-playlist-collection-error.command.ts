import { PlaylistCollection } from '../../../model/playlist-collection';
import { ErrorResult } from '../../../model/error/error-result';

export function loadPlaylistCollectionErrorCommand(state: PlaylistCollection, payload: ErrorResult): PlaylistCollection {
  state = Object.assign({}, state);
  state.loadState = null;

  return state;
}
