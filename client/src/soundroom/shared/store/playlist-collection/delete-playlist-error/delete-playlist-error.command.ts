import { PlaylistCollection } from '../../../model/playlist-collection';
import { PlaylistErrorResult } from '../../../model/error/playlist-error-result';

export function deletePlaylistErrorCommand(state: PlaylistCollection, error: PlaylistErrorResult): PlaylistCollection {
  state = Object.assign({}, state);
  state.loadState = null;
  state.error = error;

  return state;
}
