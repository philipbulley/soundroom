import { AddTrackPayload } from './add-track-payload';
import { PlaylistCollection } from '../../../model/playlist-collection';
import { Playlist } from '../../../model/playlist';
import { PlaylistState } from '../../../model/state/playlist.state';

export const addTrackCommand = (state: PlaylistCollection, payload: AddTrackPayload): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  const playlist: Playlist = Object.assign(
    {},
    state.playlists.find((playlist: Playlist) => payload.playlist._id === playlist._id)
  );

  playlist.loadState = PlaylistState.ADDING_TRACK;
  playlist.error = null;

  state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => payload.playlist._id !== playlist._id),
    playlist,
  ];

  return state;
};
