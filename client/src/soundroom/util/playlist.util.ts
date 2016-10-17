import {Playlist} from "../model/playlist";
import { PlaylistTrack } from '../model/playlist-track';

export function getPlaylistById( id:string, playlists:Playlist[] ) {
  playlists = playlists.filter(( playlist:Playlist ) => {
    return playlist._id === id;
  });

  return playlists.length > 0
    ? playlists[0]
    : null;
}

export function getPlaylistsWithoutId( id:string, playlists:Playlist[] ) {
  return playlists.filter(( playlist:Playlist ) => id !== playlist._id);
}

/**
 * Sorts the PlaylistTracks in a playlist based on an array of corresponding PlaylistTrack._id values.
 *
 * @param tracks
 * @param playlistTrackIds
 * @returns New instance of PlaylistTrack[] with freshly sorted tracks
 */
export function sortPlaylistTracks( tracks:PlaylistTrack[], playlistTrackIds:string[] ):PlaylistTrack[] {
  const sortOrder = {};
  playlistTrackIds.forEach(( id, index ) => sortOrder[id] = index);

  return [...tracks].sort(( a:PlaylistTrack, b:PlaylistTrack ) => sortOrder[a._id] > sortOrder[b._id] ? 1 : -1);
};
