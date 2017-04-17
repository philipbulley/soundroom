import { PlaylistCollection } from '../../../model/playlist-collection';
import { PlaylistErrorResult } from '../../../model/error/playlist-error-result';

export const addTrackErrorCommand = (state: PlaylistCollection, error: PlaylistErrorResult): PlaylistCollection => {
  state = Object.assign({}, state);

  const playlist = Object.assign({}, state.playlists.find(playlist => playlist._id === error.playlistId));
  playlist.loadState = null;
  playlist.error = error;

  state.playlists = [
    playlist,
    ...state.playlists.filter(playlist => playlist._id !== error.playlistId),
  ];

  return state;
};
