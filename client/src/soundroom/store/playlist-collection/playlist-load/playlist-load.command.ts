import { PlaylistCollection } from "../../../model/playlist-collection";
import { Playlist } from "../../../model/playlist";
import { PlaylistState } from '../../../model/state/playlist.state';

export const playlistLoadCommand = (state: PlaylistCollection, playlistId: string): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  const playlist: Playlist = Object.assign(
    new Playlist,
    state.playlists.find((playlist: Playlist) => playlistId === playlist._id),
  );

  playlist.loadState = PlaylistState.LOADING;

    state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => playlistId !== playlist._id),
    playlist
  ];

  return state;
};
