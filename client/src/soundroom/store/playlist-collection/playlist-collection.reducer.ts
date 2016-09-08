import { ActionReducer, Action } from '@ngrx/store';
import { Playlist } from "../../model/playlist";
import { PlaylistAction } from "../../model/action/playlist.action.ts";
import { PlaylistCollection } from "../../model/playlist-collection";
import { playlistReducer } from "../../model/reducers/playlist.reducer";
import { PlaylistProgressSocketEvent } from "../../model/socket/playlist-progress-socket-event";
import { LoadPlaylistCollectionAction } from "./load-playlist-collection/load-playlist-collection.action";
import { loadPlaylistCollectionCommand } from "./load-playlist-collection/load-playlist-collection.command";
import { CommandReducer } from "../../model/reducers/command-reducer";
import { LoadPlaylistCollectionErrorAction } from "./load-playlist-collection-error/load-playlist-collection-error.action";
import { loadPlaylistCollectionErrorCommand } from "./load-playlist-collection-error/load-playlist-collection-error.command";
import { LoadPlaylistCollectionSuccessAction } from "./load-playlist-collection-success/load-playlist-collection-success.action";
import { loadPlaylistCollectionSuccessCommand } from "./load-playlist-collection-success/load-playlist-collection-success.command";
import { DeletePlaylistAction } from "./delete-playlist/delete-playlist.action";
import { deletePlaylistCommand } from "./delete-playlist/delete-playlist.command";
import { DeletePlaylistErrorAction } from "./delete-playlist-error/delete-playlist-error.action";
import { deletePlaylistErrorCommand } from "./delete-playlist-error/delete-playlist-error.command";
import { DeletePlaylistSuccessAction } from "./delete-playlist-success/delete-playlist-success.action";
import { deletePlaylistCollectionSuccessCommand } from "./delete-playlist-success/delete-playlist-success.command";
import { PlaylistProgressAction } from "./playlist-progress/playlist-progress.action";
import { playlistProgressCommand } from "./playlist-progress/playlist-progress.command";
import { PlaylistPauseAction } from "./playlist-pause/playlist-pause.action";
import { playlistPauseCommand } from "./playlist-pause/playlist-pause.command";


const DEFAULT_STATE = {
  loadState: null,
  playlists: null,
  active: null
};

export const playlistCollectionReducer: ActionReducer<PlaylistCollection> = new CommandReducer<PlaylistCollection>(DEFAULT_STATE)
  .add(LoadPlaylistCollectionAction, loadPlaylistCollectionCommand)
  .add(LoadPlaylistCollectionSuccessAction, loadPlaylistCollectionSuccessCommand)
  .add(LoadPlaylistCollectionErrorAction, loadPlaylistCollectionErrorCommand)
  .add(DeletePlaylistAction, deletePlaylistCommand)
  .add(DeletePlaylistSuccessAction, deletePlaylistCollectionSuccessCommand)
  .add(DeletePlaylistErrorAction, deletePlaylistErrorCommand)
  // .delegate(
  //   PlaylistProgressAction,
  //   playlistReducer,
  //   ( state: PlaylistCollection ) => state.playlists,
  //   ( state: PlaylistCollection, subState: Playlist[] ) => state.playlists = subState
  // )
  .delegate(PlaylistLoadAction, (state: PlaylistCollection, action: Action) => {
    // TODO: Move this to a command file
    state = Object.assign({}, state);
    state.playlists = state.playlists.map(( playlist: Playlist ) => playlistReducer(playlist, action));
    return state;
  })
  .add(PlaylistProgressAction, playlistProgressCommand)
  .add(PlaylistPauseAction, playlistPauseCommand)
  .reducer();

export const playlistCollectionReducer: ActionReducer<PlaylistCollection> = ( state: PlaylistCollection = new PlaylistCollection, action: Action ) => {

  // console.log('playlistCollectionReducer():', action.type);
  // console.log(' - action:', action);
  // console.log(' - state:', state);

  let newState: PlaylistCollection;

  switch (action.type) {

    // All PlaylistActions to be caught here and mapped to each playlist

          // TODO: Figure out how to map these to commands to send to reducer?!

    // payload: id
    case PlaylistAction.LOAD:
    case PlaylistAction.LOAD_ERROR:

    // payload: {playlist}
    case PlaylistAction.ADD_TRACK:
    case PlaylistAction.ADD_TRACK_SUCCESS:
    case PlaylistAction.ADD_TRACK_ERROR:

    // payload: {playlist, playlistTrack}
    case PlaylistAction.DELETE_TRACK:
    case PlaylistAction.DELETE_TRACK_SUCCESS:
    case PlaylistAction.DELETE_TRACK_ERROR:

    // payload: {playlistId, playlistTrack, playlistTrackIds}
    case PlaylistAction.TRACK_ADDED:
    case PlaylistAction.UPDATE_TRACK:
    case PlaylistAction.TRACK_DELETED:

      newState = Object.assign(new PlaylistCollection, state);
      newState.playlists = newState.playlists.map(( playlist: Playlist ) => playlistReducer(playlist, action));
      return newState;


    default:
      return state;
  }

};


