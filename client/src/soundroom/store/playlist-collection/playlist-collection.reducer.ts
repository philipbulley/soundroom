import { ActionReducer } from '@ngrx/store';
import { PlaylistCollection } from "../../model/playlist-collection";
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
import { PlaylistLoadAction } from './playlist-load/playlist-load.action';
import { playlistLoadCommand } from './playlist-load/playlist-load.command';
import { PlaylistLoadErrorAction } from './playlist-load-error/playlist-load-error.action';
import { playlistLoadErrorCommand } from './playlist-load-error/playlist-load-error.command';

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

  .add(PlaylistProgressAction, playlistProgressCommand)
  .add(PlaylistPauseAction, playlistPauseCommand)

  .add(PlaylistLoadAction, playlistLoadCommand)
  .add(PlaylistLoadErrorAction, playlistLoadErrorCommand)
  // TODO: Create the commands below

  // payload: {playlist}
  // .delegate(AddTrackAction, delegateToPlaylistCommand)
  // .delegate(AddTrackSuccessAction, delegateToPlaylistCommand)
  // .delegate(AddTrackErrorAction, delegateToPlaylistCommand)

  // payload: {playlist, playlistTrack}
  // .delegate(DeleteTrackAction, delegateToPlaylistCommand)
  // .delegate(DeleteTrackSuccessAction, delegateToPlaylistCommand)
  // .delegate(DeleteTrackErrorAction, delegateToPlaylistCommand)

  // payload: {playlistId, playlistTrack, playlistTrackIds}
  // .delegate(TrackAddedAction, delegateToPlaylistCommand)
  // .delegate(TrackUpdatedAction, delegateToPlaylistCommand)
  // .delegate(TrackDeletedAction, delegateToPlaylistCommand)
  .reducer();
