import { PlaylistCollection } from '../../model/playlist-collection';
import { Playlist } from '../../model/playlist';

export const resetPlaylistLoadStateCommand = (state: PlaylistCollection, playlistId: string): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  const playlist: Playlist = Object.assign(
    new Playlist,
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
