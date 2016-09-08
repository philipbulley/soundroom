import { PlaylistCollection } from "../../../model/playlist-collection";
import { Playlist } from "../../../model/playlist";
import { getPlaylistById, getPlaylistsWithoutId } from "../../../util/playlist.util";

/**
 * Add an array of new Playlists to our PlaylistCollection
 *
 * @param state
 * @param payload
 * @returns {PlaylistCollection}
 */
export const loadPlaylistCollectionSuccessCommand = ( state: PlaylistCollection, payload: Playlist | Playlist[] ): PlaylistCollection => {

  let newPlaylists: Playlist[];

  if (payload instanceof Playlist) {
    newPlaylists = [payload];
  } else if (payload instanceof Array) {
    newPlaylists = payload;
  }

  state = Object.assign({}, state);
  state.loadState = null;

  // Overwrite existing playlists with those in the incoming newPlaylists array
  state.playlists = state.playlists
    .map(( playlist: Playlist ) => {
      // Is this playlist being replaced?
      let replacementPlaylist = getPlaylistById(playlist._id, newPlaylists);

      // If no tracks in replacement playlist, but we have tracks in old, copy them across
      if (replacementPlaylist && playlist.tracks && !replacementPlaylist.tracks) {
        replacementPlaylist.tracks = playlist.tracks;
      }

      // Only keep those playlists in `newPlaylists` that aren't replacing existing playlists
      newPlaylists = getPlaylistsWithoutId(playlist._id, newPlaylists);

      return replacementPlaylist
        ? replacementPlaylist
        : playlist;
    });

  // Combine old+replaced playlists with brand new playlists
  state.playlists = [...state.playlists, ...newPlaylists];

  return state;
};
