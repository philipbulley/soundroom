import { Playlists } from './playlists';
import { PlaylistsActions, PlaylistsActionType } from './playlists-action-type';
import { playlistsLoadCommand } from './load/playlists-load.command';
import { playlistsLoadSuccessCommand } from './load-success/playlists-load-success.command';
import { playlistsLoadErrorCommand } from './load-error/playlists-load-error.command';

const defaultState: Playlists = {
  items: [],
  loading: false,
};

export function playlistsReducer(
  state: Playlists = defaultState, action: PlaylistsActions): Playlists {
  switch (action.type) {
    case PlaylistsActionType.LOAD:
      return playlistsLoadCommand(state);
    case PlaylistsActionType.LOAD_SUCCESS:
      return playlistsLoadSuccessCommand(state, action.payload);
    case PlaylistsActionType.LOAD_ERROR:
      return playlistsLoadErrorCommand(state, action.payload);
    default:
      return state;
  }
}
