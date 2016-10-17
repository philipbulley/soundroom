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
import { resetPlaylistLoadStateCommand } from './reset-playlist-load-state.command';
import { AddTrackAction } from './add-track/add-track.action';
import { addTrackCommand } from './add-track/add-track.command';
import { AddTrackSuccessAction } from './add-track-success/add-track-success.action';
import { AddTrackErrorAction } from './add-track-error/add-track-error.action';
import { DeleteTrackSuccessAction } from './delete-track-success/delete-track-success.action';
import { DeleteTrackErrorAction } from './delete-track-error/delete-track-error.action';
import { DeleteTrackAction } from './delete-track/delete-track.action';
import { deleteTrackCommand } from './delete-track/delete-track.command';
import { TrackAddedAction } from './track-upsert/track-added.action';
import { TrackUpdatedAction } from './track-upsert/track-updated.action';
import { trackUpsertCommand } from './track-upsert/track-upsert.command';
import { TrackDeletedAction } from './track-deleted/track-deleted.action';
import { trackDeletedCommand } from './track-deleted/track-deleted.command';

const DEFAULT_STATE = {
  loadState: null,
  playlists: null,
  active: null,
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
  .add(PlaylistLoadErrorAction, resetPlaylistLoadStateCommand)

  .add(AddTrackAction, addTrackCommand)
  .add(AddTrackSuccessAction, resetPlaylistLoadStateCommand)
  .add(AddTrackErrorAction, resetPlaylistLoadStateCommand)

  .add(DeleteTrackAction, deleteTrackCommand)
  .add(DeleteTrackSuccessAction, resetPlaylistLoadStateCommand)
  .add(DeleteTrackErrorAction, resetPlaylistLoadStateCommand)

  .add(TrackAddedAction, trackUpsertCommand)
  .add(TrackUpdatedAction, trackUpsertCommand)
  .add(TrackDeletedAction, trackDeletedCommand)
  .reducer();
