import { PlaylistCollection } from "../../../model/playlist-collection";
import { Playlist } from "../../../model/playlist";

export const deletePlaylistCollectionSuccessCommand = ( state: PlaylistCollection, playlist: Playlist ): PlaylistCollection => {

  state = Object.assign({}, state);
  state.loadState = null;

  const i = state.playlists.indexOf(playlist);
  state.playlists = [
    ...state.playlists.slice(0, i),
    ...state.playlists.slice(i + 1)
  ];

  return state;
};
