import { Playlists } from './playlists';
import { PlaylistsActions, PlaylistsActionType } from './playlists-action-type';
import { playlistsLoadCommand } from './load/playlists-load.command';
import { playlistsLoadSuccessCommand } from './load-success/playlists-load-success.command';
import { playlistsLoadErrorCommand } from './load-error/playlists-load-error.command';
import { playlistCreateCommand } from './playlist-create/playlist-create-command';
import { playlistCreateSuccessCommand } from './playlist-create-success/playlist-create-success.command';
import { playlistCreateErrorCommand } from './playlist-create-error/playlists-create-error.command';

const defaultState: Playlists = {
  items: [],
  loading: false,
  playlistCreate: {
    loading: false
  }
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
    case PlaylistsActionType.PLAYLIST_CREATE:
      return playlistCreateCommand(state, action.payload);
    case PlaylistsActionType.PLAYLIST_CREATE_SUCCESS:
      return playlistCreateSuccessCommand(state, action.payload);
    case PlaylistsActionType.PLAYLIST_CREATE_ERROR:
      return playlistCreateErrorCommand(state, action.payload);
    default:
      return state;
  }
}
