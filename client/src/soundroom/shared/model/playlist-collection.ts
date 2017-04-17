import { Action } from '@ngrx/store';
import { Playlist } from "./playlist";
import { PlaylistCollectionState } from "./state/playlist-collection.state.ts";
import { ErrorResult } from './error/error-result';

export interface PlaylistCollection {

  loadState: PlaylistCollectionState;

  playlists: Playlist[];

  /**
   * The currently active playlist.
   * TODO: Change to ID of the playlist
   */
  active: Playlist;

  recentAction: Action;

  error: ErrorResult;

}
