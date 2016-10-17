import { PlaylistCollection } from "../../../model/playlist-collection";
import { Playlist } from "../../../model/playlist";
import { PlaylistTrack } from '../../../model/playlist-track';
import { sortPlaylistTracks } from '../../../util/playlist.util';
import { TrackUpdatePayload } from '../track-update-payload';

export const trackDeletedCommand = (state: PlaylistCollection, payload: TrackUpdatePayload): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  const playlist: Playlist = Object.assign(
    new Playlist,
    state.playlists.find((playlist: Playlist) => payload.playlistId === playlist._id)
  );

  // Create new array of tracks OTHER than the track we're deleting
  playlist.tracks = playlist.tracks.filter(( playlistTrack:PlaylistTrack ) => {
    return playlistTrack._id !== payload.playlistTrack._id;
  });

  // Sort the tracks based on the playlistTrackIds received
  playlist.tracks = sortPlaylistTracks(playlist.tracks, payload.playlistTrackIds);

  state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => payload.playlistId !== playlist._id),
    playlist
  ];

  return state;
};
