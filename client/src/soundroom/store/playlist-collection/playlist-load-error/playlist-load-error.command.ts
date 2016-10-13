import { PlaylistCollection } from "../../../model/playlist-collection";
import { Playlist } from "../../../model/playlist";

export const playlistLoadErrorCommand = (state: PlaylistCollection, playlistId: string): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  const playlist: Playlist = Object.assign(
    new Playlist,
    state.playlists.find((playlist: Playlist) => playlistId === playlist._id),
  );

  playlist.loadState = null;

    state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => playlistId !== playlist._id),
    playlist
  ];

  return state;
};
