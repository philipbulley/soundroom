import { PlaylistCollection } from "../../../model/playlist-collection";
import { PlaylistSocketEvent } from "../../../model/socket/playlist-socket-event";
import { Playlist } from "../../../model/playlist";
import { PlaylistPauseAction } from "./playlist-pause.action";
import { playlistReducer } from "../../../model/reducers/playlist.reducer";

export const playlistPauseCommand = (state: PlaylistCollection, payload: PlaylistSocketEvent, action:PlaylistPauseAction): PlaylistCollection => {

  if (!state.active) {
    // No playlist playing
    return state;
  }

	state = Object.assign({}, state);
  state.playlists = state.playlists.map(( playlist: Playlist ) => playlistReducer(playlist, action));
  state.active = null;

	return state;
};
