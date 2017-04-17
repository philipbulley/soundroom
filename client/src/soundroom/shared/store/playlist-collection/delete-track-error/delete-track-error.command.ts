import { PlaylistCollection } from '../../../model/playlist-collection';
import { PlaylistTrackErrorResult } from '../../../model/error/playlist-track-error-result';

export const deleteTrackErrorCommand = (state: PlaylistCollection, error: PlaylistTrackErrorResult): PlaylistCollection => {
  state = Object.assign({}, state);

  const playlist = Object.assign({}, state.playlists.find(playlist => playlist._id === error.playlist._id));
  playlist.loadState = null;
  playlist.error = error;

  state.playlists = [
    playlist,
    ...state.playlists.filter(playlist => playlist._id !== error.playlist._id),
  ];

  return state;
};
