import { Playlist } from '../model/playlist';
import { PlaylistTrack } from '../model/playlist-track';
/**
 * Returns a new array of playlists where playlist that exist already in `existingPlaylists` will be replaced by
 * counterparts inside `newPlaylists`. Any other playlists in `newPlaylists` will be inserted.
 */
export function upsertPlaylists(existingPlaylists: Playlist[], newPlaylists: Playlist[]): Playlist[] {
  const allPlaylists = existingPlaylists
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

  return allPlaylists.concat(newPlaylists);
}

/**
 * Sorts the PlaylistTracks in a playlist based on an array of corresponding PlaylistTrack._id values.
 *
 * @param tracks
 * @param playlistTrackIds
 * @returns New instance of PlaylistTrack[] with freshly sorted tracks
 */
export function sortPlaylistTracks(tracks: PlaylistTrack[], playlistTrackIds: string[]): PlaylistTrack[] {
  const sortOrder = {};
  playlistTrackIds.forEach((id, index) => sortOrder[id] = index);

  return [...tracks].sort((a: PlaylistTrack, b: PlaylistTrack) => sortOrder[a._id] > sortOrder[b._id] ? 1 : -1);
};
