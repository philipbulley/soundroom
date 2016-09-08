import { PlaylistCollection } from "../../../model/playlist-collection";
import { PlaylistProgressSocketEvent } from "../../../model/socket/playlist-progress-socket-event";
import { Playlist } from "../../../model/playlist";
import { PlaylistProgressAction } from "./playlist-progress.action";
import { playlistReducer } from "../../../model/reducers/playlist.reducer";

export const playlistProgressCommand = ( state: PlaylistCollection, payload: PlaylistProgressSocketEvent, action: PlaylistProgressAction ): PlaylistCollection => {

  state = Object.assign({}, state);

  // Call playlistReducer on each playlist, forwarding the state and action
  state.playlists = state.playlists.map(( playlist: Playlist ) => {
    const newPlaylist = playlistReducer(playlist, action);
    // newPlaylist may/may not be a new instance — this is for `playlistReducer` to decide
    if (newPlaylist._id === payload.playlistId) {
      state.active = newPlaylist;
    }
    return newPlaylist;
  });

  return state;
};
