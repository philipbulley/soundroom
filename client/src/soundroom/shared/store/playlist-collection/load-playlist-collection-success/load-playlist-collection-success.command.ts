import { PlaylistCollection } from '../../../model/playlist-collection';
import { Playlist } from '../../../model/playlist';
import { upsertPlaylists } from '../../../util/playlist-collection.util';

/**
 * Add an array of new Playlists to our PlaylistCollection
 */
export const loadPlaylistCollectionSuccessCommand = (state: PlaylistCollection, newPlaylists: Playlist[]): PlaylistCollection => {
  state = Object.assign({}, state);
  state.loadState = null;
  state.error = null;

  state.playlists = upsertPlaylists(state.playlists, newPlaylists);

  return state;
};
