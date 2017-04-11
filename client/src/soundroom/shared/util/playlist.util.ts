import { PlaylistTrack } from '../model/playlist-track';
import { User } from '../model/user';
import { Playlist } from '../model/playlist';

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
}

/**
 * Determines whether the user specified can delete the track specified.
 *
 * @param playlistTrack
 * @param user
 */
export function canUserDeleteTrack(playlistTrack: PlaylistTrack, user: User): boolean {
  // TODO: Allow admins (when implemented) to delete tracks  (also in back-end Playlist.canUserDeleteTrack())
  return playlistTrack.createdBy._id === user._id;
}

export function isPlaylistPlaying(playlist: Playlist): boolean {
  return !playlist.current
    ? false
    : playlist.current.isPlaying;
}
