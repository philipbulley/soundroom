import { PlaylistCollection } from '../../../model/playlist-collection';
import { Playlist } from '../../../model/playlist';

export function deletePlaylistErrorCommand(state: PlaylistCollection, payload: Playlist): PlaylistCollection {
  state = Object.assign({}, state);
  state.loadState = null;

  return state;
}
