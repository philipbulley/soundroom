import { PlaylistCollection } from '../../../model/playlist-collection';
import { Playlist } from '../../../model/playlist';
import { upsertPlaylists } from '../../../util/playlist-collection.util';

/**
 * Add a new Playlist to our PlaylistCollection
 */
export const playlistLoadSuccessCommand = (state: PlaylistCollection, newPlaylist: Playlist): PlaylistCollection => {
  state = Object.assign({}, state);
  state.loadState = null;
  state.error = null;

  state.playlists = upsertPlaylists(state.playlists, [newPlaylist]);

  return state;
};
