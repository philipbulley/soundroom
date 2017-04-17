import { PlaylistCollection } from '../../../model/playlist-collection';
import { ErrorResult } from '../../../model/error/error-result';

export function loadPlaylistCollectionErrorCommand(state: PlaylistCollection, error: ErrorResult): PlaylistCollection {
  state = Object.assign({}, state);
  state.loadState = null;
  state.error = error;

  return state;
}
