import { PlaylistCollection } from './playlist-collection';
import { PlaylistCollectionActions, PlaylistCollectionActionType } from './playlist-collection-action-types';
import { playlistCollectionLoadCommand } from './load/playlist-collection-load.command';
import { playlistCollectionLoadSuccessCommand } from './load-success/playlist-collection-load-success.command';
import { playlistCollectionLoadErrorCommand } from './load-error/playlist-collection-load-error.command';

const defaultState: PlaylistCollection = {
  items: [],
  loading: false,
};

export function playlistCollectionReducer(
  state: PlaylistCollection = defaultState, action: PlaylistCollectionActions): PlaylistCollection {
  switch (action.type) {
    case PlaylistCollectionActionType.LOAD:
      return playlistCollectionLoadCommand(state);
    case PlaylistCollectionActionType.LOAD_SUCCESS:
      return playlistCollectionLoadSuccessCommand(state, action.payload);
    case PlaylistCollectionActionType.LOAD_ERROR:
      return playlistCollectionLoadErrorCommand(state, action.payload);
    default:
      return state;
  }
}
