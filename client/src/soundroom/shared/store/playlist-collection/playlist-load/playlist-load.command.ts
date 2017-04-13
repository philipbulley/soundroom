import { PlaylistCollection } from '../../../model/playlist-collection';
import { Playlist } from '../../../model/playlist';
import { PlaylistFactory } from '../../../model/factory/playlist.factory';

export const playlistLoadCommand = (state: PlaylistCollection, playlistId: string): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  let playlist: Playlist = state.playlists.find((playlist: Playlist) => playlistId === playlist._id);

  playlist = playlist
    ? Object.assign({}, playlist)
    : PlaylistFactory.createEmptyAndLoading(playlistId);

  state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => playlistId !== playlist._id),
    playlist,
  ];

  return state;
};
