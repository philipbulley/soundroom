import { PlaylistCollection } from '../../../model/playlist-collection';
import { Playlist } from '../../../model/playlist';

export const deletePlaylistCollectionSuccessCommand = (state: PlaylistCollection, playlist: Playlist): PlaylistCollection => {
  state = Object.assign({}, state);
  state.loadState = null;

  // New array of all playlists except the one being removed
  state.playlists = state.playlists.filter((_playlist: Playlist) => _playlist._id !== playlist._id);

  return state;
};
