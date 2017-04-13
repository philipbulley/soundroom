import { PlaylistCollection } from '../../model/playlist-collection';
import { Playlist } from '../../model/playlist';
import { AddTrackPayload } from './add-track/add-track-payload';
import { PlaylistErrorResult } from '../../model/error/playlist-error-result';

export const resetPlaylistLoadStateCommand = (state: PlaylistCollection, payload: string | AddTrackPayload | PlaylistErrorResult): PlaylistCollection => {
  state = Object.assign({}, state);

  const playlistId = typeof(payload) === 'string'
    ? payload
    : payload.hasOwnProperty('playlistId')
      ? (payload as PlaylistErrorResult).playlistId
      : (payload as AddTrackPayload).playlist._id;

  // Find the playlist
  const playlist: Playlist = Object.assign(
    {},
    state.playlists.find((playlist: Playlist) => playlistId === playlist._id)
  );

  // Reset the loadState
  playlist.loadState = null;

  // Add to a new array
  state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => playlistId !== playlist._id),
    playlist,
  ];

  return state;
};
