import { Playlist } from '../model/playlist';
/**
 * Returns a new array of playlists where playlist that exist already in `existingPlaylists` will be replaced by
 * counterparts inside `newPlaylists`. Any other playlists in `newPlaylists` will be inserted.
 */
export function upsertPlaylists(existingPlaylists: Playlist[], newPlaylists: Playlist[]): Playlist[] {
  let allPlaylists = existingPlaylists
    .map((playlist: Playlist) => {
      // Is this playlist being replaced?
      let replacementPlaylist = newPlaylists.find((_playlist: Playlist) => _playlist._id === playlist._id);

      // If no tracks in replacement playlist, but we have tracks in old, copy them across
      if (replacementPlaylist && playlist.tracks && !replacementPlaylist.tracks) {
        replacementPlaylist.tracks = playlist.tracks;
      }

      // Only keep those playlists in `newPlaylists` that aren't replacing existing playlists (playlists to insert)
      newPlaylists = newPlaylists.filter((_playlist: Playlist) => _playlist._id !== playlist._id);

      return replacementPlaylist
        ? replacementPlaylist
        : playlist;
    });

  allPlaylists = allPlaylists.concat(newPlaylists);

  allPlaylists.sort(sortPlaylistsByModified);

  return allPlaylists;
}

function sortPlaylistsByModified(a: Playlist, b: Playlist) {
  return a.modified > b.modified
    ? -1
    : 1;
}
