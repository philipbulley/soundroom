import { PlaylistCollection } from '../../../model/playlist-collection';
import { AddTrackPayload } from '../add-track/add-track-payload';

export const addTrackSuccessCommand = (state: PlaylistCollection, payload: AddTrackPayload): PlaylistCollection => {
  state = Object.assign({}, state);

  const playlist = Object.assign({}, state.playlists.find(playlist => playlist._id === payload.playlist._id));
  playlist.loadState = null;
  playlist.error = null;

  state.playlists = [
    playlist,
    ...state.playlists.filter(playlist => playlist._id !== payload.playlist._id),
  ];

  return state;
};
