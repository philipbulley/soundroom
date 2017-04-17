import { PlaylistCollection } from '../../../model/playlist-collection';
import { Playlist } from '../../../model/playlist';
import { PlaylistFactory } from '../../../model/factory/playlist.factory';
import { PlaylistState } from '../../../model/state/playlist.state';

export const playlistLoadCommand = (state: PlaylistCollection, playlistId: string): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  let playlist: Playlist = state.playlists.find((playlist: Playlist) => playlistId === playlist._id);

  playlist = playlist
    ? Object.assign({}, playlist)
    : PlaylistFactory.createEmpty(playlistId);

  playlist.loadState = PlaylistState.LOADING;
  playlist.error = null;

  state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => playlistId !== playlist._id),
    playlist,
  ];

  return state;
};
